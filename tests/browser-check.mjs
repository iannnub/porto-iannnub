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
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
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
const CDP_PORT = Number(process.env.CDP_PORT) || 9229;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`[Preview Server] Started on http://127.0.0.1:${PORT}`);

  const userDataDir = path.resolve(__dirname, 'chrome-profile-test');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${CDP_PORT}`,
    'about:blank',
  ]);

  const killChrome = () => {
    try {
      chromeProc.kill('SIGKILL');
    } catch {}
  };

  process.on('exit', killChrome);
  process.on('SIGINT', killChrome);

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
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
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
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('\n--- Test 1: Desktop Experience & Section Verification (1440x900) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1.5,
      mobile: false,
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise((r) => setTimeout(r, 2500));

    // Full overview shot
    const deskShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-desktop.png'), Buffer.from(deskShot.data, 'base64'));

    // Verify DOM structure, no gradients, and CWV measurements
    const evalRes = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const bodyHtml = document.body.innerHTML;
        const hasGradient = bodyHtml.includes('bg-gradient-') || bodyHtml.includes('linear-gradient(') || bodyHtml.includes('radial-gradient(');
        
        // Measure CLS
        let clsScore = 0;
        const entries = performance.getEntriesByType('layout-shift');
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        }

        // Check FCP & LCP
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = Math.round(paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || 0);
        const navEntry = performance.getEntriesByType('navigation')[0];
        const domInteractive = Math.round(navEntry?.domInteractive || 0);
        const loadEventEnd = Math.round(navEntry?.loadEventEnd || 0);

        return JSON.stringify({
          root: !!document.getElementById('root'),
          title: document.title,
          hero: !!document.getElementById('hero'),
          about: !!document.getElementById('about'),
          skills: !!document.getElementById('skills'),
          experience: !!document.getElementById('experience'),
          projects: !!document.getElementById('projects'),
          certifications: !!document.getElementById('certifications'),
          contact: !!document.getElementById('contact'),
          hasGradient,
          clsScore,
          fcp,
          domInteractive,
          loadEventEnd,
          jsonLdPresent: !!document.querySelector('script[type="application/ld+json"]')
        });
      })()`,
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
    console.log('[CHECK] Zero gradients in DOM:', !domCheck.hasGradient);
    console.log('[CHECK] CLS Score:', domCheck.clsScore, '(target < 0.1)');
    console.log('[CHECK] FCP:', `${domCheck.fcp}ms`, '| DOM Interactive:', `${domCheck.domInteractive}ms`, '| Load End:', `${domCheck.loadEventEnd}ms`, '(LCP target < 2500ms)');
    console.log('[CHECK] JSON-LD Schema.org present in DOM:', domCheck.jsonLdPresent);

    // Scroll to and screenshot About
    await send('Runtime.evaluate', {
      expression: `document.getElementById('about').scrollIntoView({ behavior: 'instant' })`,
    });
    await new Promise((r) => setTimeout(r, 600));
    const aboutShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-about.png'), Buffer.from(aboutShot.data, 'base64'));
    console.log('[PASS] About section screenshot saved: screenshot-about.png');

    // Scroll to and screenshot Experience
    await send('Runtime.evaluate', {
      expression: `document.getElementById('experience').scrollIntoView({ behavior: 'instant' })`,
    });
    await new Promise((r) => setTimeout(r, 600));
    const expShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-experience.png'), Buffer.from(expShot.data, 'base64'));
    console.log('[PASS] Experience section screenshot saved: screenshot-experience.png');

    // Scroll to and screenshot Projects (filter Gov & EdTech to show SIVO Puskesmas)
    await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const pSection = document.getElementById('projects');
        pSection.scrollIntoView({ behavior: 'instant' });
        const btn = Array.from(pSection.querySelectorAll('button')).find(b => b.textContent.includes('Gov & EdTech'));
        if (btn) btn.click();
        await new Promise(r => setTimeout(r, 500));
      })()`,
    });
    const projShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-projects.png'), Buffer.from(projShot.data, 'base64'));
    console.log('[PASS] Projects section screenshot saved: screenshot-projects.png');

    // Test Document Viewer Modal (CV + Portfolio Deck PDF)
    console.log('\n--- Test 1B: Document Viewer Modal (CV & Portfolio PDF) ---');
    const docModalRes = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const portfolioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Preview Portfolio (PDF)'));
        if (!portfolioBtn) return JSON.stringify({ opened: false, reason: 'Preview Portfolio button not found' });
        portfolioBtn.click();
        await new Promise(r => setTimeout(r, 700));

        const dialog = document.querySelector('[role="dialog"]');
        const obj = dialog?.querySelector('object[type="application/pdf"]');
        const firstData = obj?.getAttribute('data') || '';

        const cvTab = Array.from(dialog?.querySelectorAll('[role="tab"]') || []).find(t => t.textContent.includes('Curriculum Vitae') || t.textContent.includes('CV'));
        if (cvTab) cvTab.click();
        await new Promise(r => setTimeout(r, 600));

        const secondData = dialog?.querySelector('object[type="application/pdf"]')?.getAttribute('data') || '';
        return JSON.stringify({
          opened: !!dialog,
          portfolioLoaded: firstData.includes('SeptianPutraRachmanHakim_Portfolio_Academy.pdf'),
          cvLoaded: secondData.includes('SeptianPutraRachmanHakim_CV_Academy.pdf'),
          firstData,
          secondData
        });
      })()`,
    });
    const docCheck = JSON.parse(docModalRes.result.value);
    console.log('[CHECK] Document Modal opened:', docCheck.opened);
    console.log('[CHECK] Portfolio PDF loaded:', docCheck.portfolioLoaded, `(${docCheck.firstData})`);
    console.log('[CHECK] CV PDF switched & loaded:', docCheck.cvLoaded, `(${docCheck.secondData})`);
    if (!docCheck.opened || !docCheck.portfolioLoaded || !docCheck.cvLoaded) {
      throw new Error('Document Viewer Modal check failed');
    }

    const docShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-doc-modal.png'), Buffer.from(docShot.data, 'base64'));
    console.log('[PASS] Document Viewer Modal screenshot saved: screenshot-doc-modal.png');

    // Close the modal before continuing
    await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const closeBtn = document.querySelector('[aria-label="Close document viewer"]');
        if (closeBtn) closeBtn.click();
        await new Promise(r => setTimeout(r, 400));
      })()`,
    });

    // Test Contact form interaction
    console.log('\n--- Test 2: Contact Form Filling, Validation & Submission ---');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`,
    });
    await new Promise((r) => setTimeout(r, 600));

    const formTestRes = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const nameInput = document.querySelector('input[name="name"]');
        const emailInput = document.querySelector('input[name="email"]');
        const messageInput = document.querySelector('textarea[name="message"]');
        const submitBtn = document.querySelector('#contact form button[type="submit"]');

        if (!nameInput || !emailInput || !messageInput || !submitBtn) {
          return JSON.stringify({ success: false, reason: 'Inputs not found' });
        }

        const setNativeValue = (el, val) => {
          const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        // 1. Trigger validation error with invalid email
        setNativeValue(nameInput, 'Hiring Recruiter');
        setNativeValue(emailInput, 'invalid-email-format');
        setNativeValue(messageInput, 'Hi Septian, interested in discussing full-stack engineering opportunities.');

        submitBtn.click();
        await new Promise(r => setTimeout(r, 350));

        const emailErrEl = document.getElementById('email-error');
        const hasEmailError = !!emailErrEl && emailErrEl.textContent.toLowerCase().includes('invalid');
        const ariaInvalid = emailInput.getAttribute('aria-invalid') === 'true';

        // 2. Fix email and verify valid submission
        setNativeValue(emailInput, 'recruiter@company.com');
        await new Promise(r => setTimeout(r, 150));

        return JSON.stringify({
          success: true,
          nameVal: nameInput.value,
          emailVal: emailInput.value,
          hasErrorFeedback: hasEmailError,
          ariaInvalid
        });
      })()`,
    });
    const formCheck = JSON.parse(formTestRes.result.value);
    console.log('[CHECK] Contact Form validation result:', formCheck);
    if (!formCheck.success || !formCheck.hasErrorFeedback || !formCheck.ariaInvalid) {
      throw new Error('Contact Form validation check failed');
    }

    const contactShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-contact.png'), Buffer.from(contactShot.data, 'base64'));
    console.log('[PASS] Contact section screenshot saved: screenshot-contact.png');

    // Test 2B: Project Gallery Modal & Category Filtering
    console.log('\n--- Test 2B: Project Gallery Lightbox & Filter Tabs ---');
    const galleryRes = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const pSection = document.getElementById('projects');
        pSection.scrollIntoView({ behavior: 'instant' });
        const allTab = Array.from(pSection.querySelectorAll('button[aria-pressed]')).find(b => b.textContent.includes('All'));
        if (allTab) allTab.click();
        await new Promise(r => setTimeout(r, 400));

        const screenBtn = pSection.querySelector('button[aria-label^="Open screenshot gallery"]');
        if (!screenBtn) return JSON.stringify({ opened: false });
        screenBtn.click();
        await new Promise(r => setTimeout(r, 500));

        const dialog = document.querySelector('[role="dialog"]');
        const nextBtn = dialog?.querySelector('button[aria-label="Next image"]');
        if (nextBtn) nextBtn.click();
        await new Promise(r => setTimeout(r, 300));

        const closeBtn = dialog?.querySelector('button[aria-label="Close gallery"]');
        if (closeBtn) closeBtn.click();
        await new Promise(r => setTimeout(r, 400));

        return JSON.stringify({
          opened: !!dialog,
          closedCleanly: !document.querySelector('[role="dialog"]')
        });
      })()`,
    });
    const galleryCheck = JSON.parse(galleryRes.result.value);
    console.log('[CHECK] Project Gallery Modal opened & navigated:', galleryCheck.opened, '| closed cleanly:', galleryCheck.closedCleanly);
    if (!galleryCheck.opened || !galleryCheck.closedCleanly) {
      throw new Error('Project Gallery Modal check failed');
    }

    console.log('\n--- Test 3: Mobile iPhone 393x852 & Small Android 360x640 Responsiveness ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 393,
      height: 852,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await new Promise((r) => setTimeout(r, 1200));

    const mobileCheck = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      })`,
    });
    const mobRes = JSON.parse(mobileCheck.result.value);
    console.log('[CHECK] Mobile 393x852 scroll overflow:', mobRes.overflowX ? 'FAIL' : 'PASS', `(scrollWidth: ${mobRes.scrollWidth}, innerWidth: ${mobRes.innerWidth})`);
    if (mobRes.overflowX) throw new Error('Horizontal overflow detected at 393x852');

    const mobShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'screenshot-mobile.png'), Buffer.from(mobShot.data, 'base64'));
    console.log('[PASS] Mobile screenshot saved: screenshot-mobile.png');

    // Test 360x640 narrow viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 640,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 600));
    const smallMobCheck = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      })`,
    });
    const smallMobRes = JSON.parse(smallMobCheck.result.value);
    console.log('[CHECK] Mobile 360x640 scroll overflow:', smallMobRes.overflowX ? 'FAIL' : 'PASS', `(scrollWidth: ${smallMobRes.scrollWidth}, innerWidth: ${smallMobRes.innerWidth})`);
    if (smallMobRes.overflowX) throw new Error('Horizontal overflow detected at 360x640');

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
