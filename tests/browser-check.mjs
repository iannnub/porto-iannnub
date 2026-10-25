import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath)) {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

const PORT = 4173;
const CDP_PORT = 9222;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`[Preview Server] Started on http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${CDP_PORT}`,
    'about:blank',
  ]);

  const killChrome = () => {
    try {
      chromeProc.kill('SIGKILL');
    } catch {
      // ignore
    }
  };

  process.on('exit', killChrome);
  process.on('SIGINT', killChrome);

  // Wait for Chrome page target in /json/list
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
        if (page) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!wsUrl) {
    console.error('Failed to locate Chrome page target debugger URL');
    server.close();
    killChrome();
    process.exit(1);
  }

  console.log(`[Chrome CDP Page] Connected to ${wsUrl}`);

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();
  const consoleLogs = [];
  const consoleErrors = [];

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
      return;
    }

    if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      consoleLogs.push({ type: data.params.type, text });
      if (data.params.type === 'error') {
        consoleErrors.push(text);
      }
    } else if (data.method === 'Runtime.exceptionThrown') {
      const text = data.params.exceptionDetails?.text || 'Uncaught exception';
      const desc = data.params.exceptionDetails?.exception?.description || '';
      consoleErrors.push(`${text}: ${desc}`);
    }
  };

  await new Promise((resolve) => (ws.onopen = resolve));

  try {
    // Enable domains
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('\n--- Test 1: Local Preview (Desktop 1280x900) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise((r) => setTimeout(r, 2500));

    // Capture Desktop Screenshot
    const deskShot = await send('Page.captureScreenshot', { format: 'png' });
    const deskPath = path.resolve(__dirname, 'screenshot-desktop.png');
    fs.writeFileSync(deskPath, Buffer.from(deskShot.data, 'base64'));
    console.log(`[PASS] Desktop screenshot saved: ${deskPath}`);

    // Verify DOM nodes
    const evalRes = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        root: !!document.getElementById('root'),
        title: document.title,
        hero: !!document.getElementById('hero'),
        about: !!document.getElementById('about'),
        skills: !!document.getElementById('skills'),
        experience: !!document.getElementById('experience'),
        projects: !!document.getElementById('projects'),
        certifications: !!document.getElementById('certifications'),
        contact: !!document.getElementById('contact'),
        hasGradient: document.body.innerHTML.includes('bg-gradient-to'),
        jsonLdPresent: !!document.querySelector('script[type="application/ld+json"]')
      })`,
    });
    const domCheck = JSON.parse(evalRes.result.value);

    console.log('[CHECK] Root container rendered:', domCheck.root);
    console.log('[CHECK] Title:', domCheck.title);
    console.log('[CHECK] Hero section:', domCheck.hero);
    console.log('[CHECK] About section:', domCheck.about);
    console.log('[CHECK] Skills section:', domCheck.skills);
    console.log('[CHECK] Experience section:', domCheck.experience);
    console.log('[CHECK] Projects section:', domCheck.projects);
    console.log('[CHECK] Certifications section:', domCheck.certifications);
    console.log('[CHECK] Contact section:', domCheck.contact);
    console.log('[CHECK] No gradient-to- classes in DOM:', !domCheck.hasGradient);
    console.log('[CHECK] JSON-LD Schema.org present in DOM:', domCheck.jsonLdPresent);

    console.log('\n--- Test 2: Local Preview (Mobile iPhone 393x852) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 393,
      height: 852,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1200));

    const mobShot = await send('Page.captureScreenshot', { format: 'png' });
    const mobPath = path.resolve(__dirname, 'screenshot-mobile.png');
    fs.writeFileSync(mobPath, Buffer.from(mobShot.data, 'base64'));
    console.log(`[PASS] Mobile screenshot saved: ${mobPath}`);

    console.log('\n--- Test 3: Live Production Vercel Audit (https://porto-iannnub.vercel.app/) ---');
    try {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1280,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await send('Page.navigate', { url: 'https://porto-iannnub.vercel.app/' });
      await new Promise((r) => setTimeout(r, 3500));

      const prodShot = await send('Page.captureScreenshot', { format: 'png' });
      const prodPath = path.resolve(__dirname, 'screenshot-vercel-prod.png');
      fs.writeFileSync(prodPath, Buffer.from(prodShot.data, 'base64'));
      console.log(`[PASS] Vercel production screenshot saved: ${prodPath}`);
    } catch (e) {
      console.warn('[WARN] Could not capture live vercel site:', e.message);
    }

    console.log('\n--- Console Audit Summary ---');
    console.log(`Total console logs captured: ${consoleLogs.length}`);
    if (consoleErrors.length > 0) {
      console.error(`[FAIL] Found ${consoleErrors.length} console errors:`);
      consoleErrors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
      process.exit(1);
    } else {
      console.log('[PASS] ZERO console errors detected! Pure, clean console output.');
    }

    ws.close();
    server.close();
    killChrome();
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    ws.close();
    server.close();
    killChrome();
    process.exit(1);
  }
});
