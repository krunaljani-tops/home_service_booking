import requests

LIVE_URL = "https://homeserve-platform.onrender.com"

USERS = [
    ("SUPER_ADMIN", "admin@homeserve.com", "Admin@123"),
    ("CUSTOMER", "rahul.sharma@email.com", "Customer@123"),
    ("SERVICE_PROVIDER", "cleanpro@email.com", "Provider@123"),
    ("TECHNICIAN", "tech.ravi@email.com", "Tech@123"),
]

print("=== VERIFYING LIVE RENDER PLATFORM ENDPOINTS ===")
tokens = {}
for role, email, pw in USERS:
    res = requests.post(f"{LIVE_URL}/api/v1/auth/login", json={"email": email, "password": pw})
    if res.status_code == 200:
        data = res.json()
        tokens[role] = data["access_token"]
        u = data["user"]
        print(f"[{role:16}] 200 OK - ID: {u['id']}, Email: {u['email']}, Role: {u['role']}")
    else:
        print(f"[{role:16}] FAILED {res.status_code}: {res.text}")

print("\n=== TESTING ADMIN ANALYTICS ON RENDER POSTGRES ===")
admin_h = {"Authorization": f"Bearer {tokens['SUPER_ADMIN']}"}
stats_res = requests.get(f"{LIVE_URL}/api/v1/reports/dashboard", headers=admin_h)
print("Dashboard Stats:", stats_res.status_code, stats_res.json())

cat_res = requests.get(f"{LIVE_URL}/api/v1/categories", headers=admin_h)
print(f"Categories ({cat_res.status_code}): {[c['name'] for c in cat_res.json()]}")

srv_res = requests.get(f"{LIVE_URL}/api/v1/services", headers=admin_h)
print(f"Services ({srv_res.status_code}): {len(srv_res.json().get('items', srv_res.json()))} services active")

bk_res = requests.get(f"{LIVE_URL}/api/v1/bookings", headers=admin_h)
print(f"Bookings ({bk_res.status_code}): {len(bk_res.json().get('items', bk_res.json()))} bookings loaded")

