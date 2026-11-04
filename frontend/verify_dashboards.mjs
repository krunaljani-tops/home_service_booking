import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCREENSHOT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/58009687-c367-4c54-9243-c18195cda81a';

const ROLES_TEST = [
  {
    roleName: 'SUPER_ADMIN',
    buttonLabel: 'Admin',
    expectedBase: '/admin',
    links: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Bookings', path: '/admin/bookings' },
      { name: 'Customers', path: '/admin/customers' },
      { name: 'Providers', path: '/admin/providers' },
      { name: 'Categories', path: '/admin/categories' },
      { name: 'Services', path: '/admin/services' },
      { name: 'Payments', path: '/admin/payments' },
      { name: 'Complaints', path: '/admin/complaints' },
      { name: 'Coupons', path: '/admin/coupons' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Settings', path: '/admin/settings' },
    ],
  },
  {
    roleName: 'CUSTOMER',
    buttonLabel: 'Customer',
    expectedBase: '/customer',
    links: [
      { name: 'Dashboard', path: '/customer' },
      { name: 'My Bookings', path: '/customer/bookings' },
      { name: 'Browse Services', path: '/customer/browse' },
      { name: 'Book Service', path: '/customer/book' },
      { name: 'Favorites', path: '/customer/favorites' },
      { name: 'Payments & History', path: '/customer/payments' },
      { name: 'Invoices', path: '/customer/invoices' },
      { name: 'My Reviews', path: '/customer/reviews' },
      { name: 'Complaints', path: '/customer/complaints' },
      { name: 'My Addresses', path: '/customer/addresses' },
      { name: 'My Profile', path: '/customer/profile' },
    ],
  },
  {
    roleName: 'SERVICE_PROVIDER',
    buttonLabel: 'Provider',
    expectedBase: '/provider',
    links: [
      { name: 'Dashboard', path: '/provider' },
      { name: 'Booking Requests', path: '/provider/bookings' },
      { name: 'My Services', path: '/provider/services' },
      { name: 'Manage Pricing', path: '/provider/pricing' },
      { name: 'Availability', path: '/provider/availability' },
      { name: 'Technicians', path: '/provider/technicians' },
      { name: 'Earnings', path: '/provider/earnings' },
      { name: 'Customer Reviews', path: '/provider/reviews' },
      { name: 'Profile & Docs', path: '/provider/profile' },
    ],
  },
  {
    roleName: 'TECHNICIAN',
    buttonLabel: 'Technician',
    expectedBase: '/technician',
    links: [
      { name: 'Dashboard', path: '/technician' },
      { name: 'Assigned Jobs', path: '/technician/jobs' },
      { name: 'Job History', path: '/technician/history' },
      { name: 'My Profile', path: '/technician/profile' },
    ],
  },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  console.log('=== COMMENCING BROWSER E2E DASHBOARD & LINK VERIFICATION ===');

  let totalLinks = 0;
  let passedLinks = 0;
  let failedLinks = 0;

  for (const test of ROLES_TEST) {
    console.log(`\n========================================`);
    console.log(`Testing Role: ${test.roleName}`);
    console.log(`========================================`);

    // Reset storage & visit login
    await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Click the role preset button
    const btnClicked = await page.evaluate((label) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const targetBtn = btns.find((b) => b.innerText.includes(label));
      if (targetBtn) {
        targetBtn.click();
        return true;
      }
      return false;
    }, test.buttonLabel);

    if (!btnClicked) {
      console.error(`Could not find preset button for ${test.buttonLabel}`);
      failedLinks++;
      continue;
    }

    await new Promise((r) => setTimeout(r, 400));

    // Submit form
    await page.evaluate(() => {
      const sub = document.querySelector('button[type="submit"]');
      if (sub) sub.click();
    });

    await new Promise((r) => setTimeout(r, 2000));

    const currentUrl = page.url();
    console.log(`[AUTH] Landed at: ${currentUrl}`);

    if (!currentUrl.includes(test.expectedBase)) {
      console.error(`[ERROR] Expected ${test.expectedBase} in URL but got ${currentUrl}`);
      failedLinks++;
      continue;
    }

    // Screenshot dashboard
    const shotPath = path.join(SCREENSHOT_DIR, `verified_${test.roleName.toLowerCase()}_dashboard.png`);
    await page.screenshot({ path: shotPath });
    console.log(`[SCREENSHOT] Saved dashboard snapshot to ${shotPath}`);

    // Verify all sidebar links
    for (const item of test.links) {
      totalLinks++;
      const selector = `nav a[href="${item.path}"]`;
      const linkEl = await page.$(selector);

      if (!linkEl) {
        console.error(`  [LINK MISSING] Could not find nav element with selector ${selector}`);
        failedLinks++;
        continue;
      }

      await linkEl.click();
      await new Promise((r) => setTimeout(r, 600));

      const pageText = await page.evaluate(() => document.body.innerText);
      const is404 = pageText.includes('404') && pageText.includes('Page Not Found');
      const is403 = pageText.includes('403') || pageText.includes('Unauthorized');

      if (is404) {
        console.error(`  [FAIL 404] '${item.name}' (${item.path}) displayed 404 Not Found!`);
        failedLinks++;
      } else if (is403) {
        console.error(`  [FAIL 403] '${item.name}' (${item.path}) displayed 403 Forbidden!`);
        failedLinks++;
      } else {
        console.log(`  [PASS 200] '${item.name}' (${item.path}) -> ${page.url()}`);
        passedLinks++;
      }
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`SUMMARY: Total Links Tested: ${totalLinks} | Passed: ${passedLinks} | Failed: ${failedLinks}`);
  console.log('========================================');

  if (failedLinks > 0) {
    process.exit(1);
  }
})();
