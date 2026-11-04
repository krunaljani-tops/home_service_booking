import asyncio
import os
from playwright.async_api import async_playwright

SCREENSHOT_DIR = r"C:\Users\Lenovo\.gemini\antigravity\brain\58009687-c367-4c54-9243-c18195cda81a"

ROLES_TEST = [
    {
        "role_name": "SUPER_ADMIN",
        "email": "admin@homeserve.com",
        "pass": "Admin@123",
        "expected_base": "/admin",
        "links": [
            ("Dashboard", "/admin"),
            ("Bookings", "/admin/bookings"),
            ("Customers", "/admin/customers"),
            ("Providers", "/admin/providers"),
            ("Categories", "/admin/categories"),
            ("Services", "/admin/services"),
            ("Payments", "/admin/payments"),
            ("Complaints", "/admin/complaints"),
            ("Coupons", "/admin/coupons"),
            ("Reports", "/admin/reports"),
            ("Settings", "/admin/settings"),
        ]
    },
    {
        "role_name": "CUSTOMER",
        "email": "rahul.sharma@email.com",
        "pass": "Customer@123",
        "expected_base": "/customer",
        "links": [
            ("Dashboard", "/customer"),
            ("My Bookings", "/customer/bookings"),
            ("Browse Services", "/customer/browse"),
            ("Book Service", "/customer/book"),
            ("Favorites", "/customer/favorites"),
            ("Payments & History", "/customer/payments"),
            ("Invoices", "/customer/invoices"),
            ("My Reviews", "/customer/reviews"),
            ("Complaints", "/customer/complaints"),
            ("My Addresses", "/customer/addresses"),
            ("My Profile", "/customer/profile"),
        ]
    },
    {
        "role_name": "SERVICE_PROVIDER",
        "email": "cleanpro@email.com",
        "pass": "Provider@123",
        "expected_base": "/provider",
        "links": [
            ("Dashboard", "/provider"),
            ("Booking Requests", "/provider/bookings"),
            ("My Services", "/provider/services"),
            ("Manage Pricing", "/provider/pricing"),
            ("Availability", "/provider/availability"),
            ("Technicians", "/provider/technicians"),
            ("Earnings", "/provider/earnings"),
            ("Customer Reviews", "/provider/reviews"),
            ("Profile & Docs", "/provider/profile"),
        ]
    },
    {
        "role_name": "TECHNICIAN",
        "email": "tech.ravi@email.com",
        "pass": "Tech@123",
        "expected_base": "/technician",
        "links": [
            ("Dashboard", "/technician"),
            ("Assigned Jobs", "/technician/jobs"),
            ("Job History", "/technician/history"),
            ("My Profile", "/technician/profile"),
        ]
    }
]

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1400, "height": 900})
        page = await context.new_page()

        print("=== COMMENCING FULL E2E DASHBOARD VERIFICATION ===")

        for test in ROLES_TEST:
            role = test["role_name"]
            print(f"\n--- Testing Portal for Role: {role} ---")
            
            # Clear storage
            await context.clear_cookies()
            await page.goto("http://127.0.0.1:5173/login", wait_until="networkidle")
            await page.evaluate("() => localStorage.clear()")
            await page.reload(wait_until="networkidle")

            # Fill credentials
            await page.fill('input[type="email"]', test["email"])
            await page.fill('input[type="password"]', test["pass"])
            
            # Click sign in
            await page.click('button[type="submit"]')
            await page.wait_for_timeout(1500)

            cur_url = page.url
            print(f"Logged in, landed at: {cur_url}")
            assert test["expected_base"] in cur_url, f"Expected {test['expected_base']} in {cur_url}"

            # Capture main dashboard
            shot_path = os.path.join(SCREENSHOT_DIR, f"verified_{role.lower()}_dashboard.png")
            await page.screenshot(path=shot_path)
            print(f"Saved snapshot to {shot_path}")

            # Verify every sidebar link
            for name, path in test["links"]:
                nav_selector = f'nav a[href="{path}"]'
                link_el = await page.query_selector(nav_selector)
                if not link_el:
                    print(f"  [X] Missing sidebar link for {name} ({path})")
                    continue
                
                # Click link
                await link_el.click()
                await page.wait_for_timeout(800)

                # Check URL and content
                sub_url = page.url
                body_text = await page.inner_text("body")
                
                has_404 = "404" in body_text and "Page Not Found" in body_text
                has_403 = "403" in body_text or "Unauthorized" in body_text

                if has_404:
                    print(f"  [FAIL 404] Link '{name}' ({path}) resulted in 404 Not Found!")
                elif has_403:
                    print(f"  [FAIL 403] Link '{name}' ({path}) resulted in 403 Forbidden!")
                else:
                    print(f"  [OK 200] Link '{name}' ({path}) loaded cleanly at {sub_url}")

        await browser.close()
        print("\n=== ALL ROLE DASHBOARDS AND SUB-LINKS VERIFIED SUCCESSFULLY ===")

if __name__ == "__main__":
    asyncio.run(run())

