import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

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
    // SPA fallback
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
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Preview server listening on http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve(__dirname, 'homepage-screenshot.png');

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    `--screenshot=${screenshotPath}`,
    '--dump-dom',
    `http://127.0.0.1:${PORT}/`,
  ];

  execFile(chromePath, args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    server.close();

    if (err) {
      console.error('Chrome execution failed:', err);
      process.exit(1);
    }

    console.log('--- DOM Verification ---');
    const dom = stdout;

    const checks = [
      { name: 'Root container exists', test: dom.includes('id="root"') },
      { name: 'Title matches', test: dom.includes('Septian Putra Rachman Hakim | Portfolio') },
      { name: 'Hero section rendered', test: dom.includes('id="hero"') },
      { name: 'About section rendered', test: dom.includes('id="about"') },
      { name: 'Skills section rendered', test: dom.includes('id="skills"') },
      { name: 'Experience section rendered', test: dom.includes('id="experience"') },
      { name: 'Projects section rendered', test: dom.includes('id="projects"') },
      { name: 'Certifications section rendered', test: dom.includes('id="certifications"') },
      { name: 'Contact section rendered', test: dom.includes('id="contact"') },
      { name: 'No gradient-to- classes', test: !dom.includes('bg-gradient-to') },
      { name: 'No undefined text', test: !dom.includes('undefined') },
      { name: 'Screenshot captured', test: fs.existsSync(screenshotPath) },
    ];

    let allPassed = true;
    for (const c of checks) {
      if (c.test) {
        console.log(`[PASS] ${c.name}`);
      } else {
        console.error(`[FAIL] ${c.name}`);
        allPassed = false;
      }
    }

    if (!allPassed) {
      process.exit(1);
    }

    console.log('\nAll browser DOM checks PASSED successfully!');
    process.exit(0);
  });
});
