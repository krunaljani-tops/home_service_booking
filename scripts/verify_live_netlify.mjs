import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCREENSHOT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/58009687-c367-4c54-9243-c18195cda81a';
const NETLIFY_URL = 'https://homeservicebooking1.netlify.app';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  console.log('=== COMMENCING NETLIFY PRODUCTION VERIFICATION ===');
  console.log(`URL: ${NETLIFY_URL}`);

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('response', res => {
    if (res.url().includes('/api/v1/')) {
      console.log(`API [${res.status()}]: ${res.url()}`);
    }
  });

  // 1. Visit homepage
  await page.goto(NETLIFY_URL, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'netlify_live_home.png') });
  console.log('Saved netlify_live_home.png');

  // 2. Visit login
  await page.goto(`${NETLIFY_URL}/login`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'netlify_live_login.png') });
  console.log('Saved netlify_live_login.png');

  // 3. Test Admin Login
  console.log('Selecting Admin role preset on Netlify...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminBtn = btns.find(b => b.innerText.includes('Admin'));
    if (adminBtn) adminBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('Clicking Submit on Netlify...');
  await page.evaluate(() => {
    const sub = document.querySelector('button[type="submit"]');
    if (sub) sub.click();
  });

  await new Promise(r => setTimeout(r, 3000));

  const adminUrl = page.url();
  console.log(`Landed at: ${adminUrl}`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'netlify_live_admin_dashboard.png') });
  console.log('Saved netlify_live_admin_dashboard.png');

  await browser.close();
  console.log('=== NETLIFY VERIFICATION FINISHED ===');
})();

