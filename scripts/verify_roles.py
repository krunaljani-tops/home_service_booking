import requests
import json

BASE_URL = "http://127.0.0.1:8000"

USERS = [
    {"role": "SUPER_ADMIN", "email": "admin@homeserve.com", "password": "Admin@123"},
    {"role": "CUSTOMER", "email": "rahul.sharma@email.com", "password": "Customer@123"},
    {"role": "SERVICE_PROVIDER", "email": "cleanpro@email.com", "password": "Provider@123"},
    {"role": "TECHNICIAN", "email": "tech.ravi@email.com", "password": "Tech@123"},
]

print("=== VERIFYING AUTHENTICATION & TOKENS FOR ALL 4 ROLES ===")
tokens = {}
for u in USERS:
    try:
        res = requests.post(f"{BASE_URL}/api/v1/auth/login", json={"email": u["email"], "password": u["password"]})
        if res.status_code == 200:
            data = res.json()
            user = data.get("user", {})
            tokens[u["role"]] = data.get("access_token")
            print(f"[{u['role']:16}] OK - User ID: {user.get('id')}, Role in DB: {user.get('role')}, Token len: {len(tokens[u['role']])}")
        else:
            print(f"[{u['role']:16}] FAILED: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"[{u['role']:16}] ERROR: {e}")

print("\n=== VERIFYING SUPER_ADMIN API ACCESS ===")
admin_headers = {"Authorization": f"Bearer {tokens['SUPER_ADMIN']}"}

admin_endpoints = [
    ("/api/v1/reports/dashboard", "Admin Stats"),
    ("/api/v1/users", "Admin Users"),
    ("/api/v1/categories", "Categories"),
    ("/api/v1/services", "Services"),
    ("/api/v1/bookings", "Bookings"),
    ("/api/v1/payments", "Payments"),
    ("/api/v1/complaints", "Complaints"),
    ("/api/v1/coupons", "Coupons"),
    ("/api/v1/reports/bookings", "Reports Bookings"),
    ("/api/v1/reports/revenue", "Reports Revenue"),
]

for ep, name in admin_endpoints:
    res = requests.get(f"{BASE_URL}{ep}", headers=admin_headers)
    print(f"{name:20} -> Status: {res.status_code}")

print("\n=== VERIFYING CUSTOMER API ACCESS ===")
cust_headers = {"Authorization": f"Bearer {tokens['CUSTOMER']}"}
cust_endpoints = [
    ("/api/v1/bookings", "Customer Bookings"),
    ("/api/v1/payments", "Customer Payments"),
    ("/api/v1/invoices", "Customer Invoices"),
    ("/api/v1/complaints", "Customer Complaints"),
    ("/api/v1/reviews", "Customer Reviews"),
    ("/api/v1/addresses", "Customer Addresses"),
]
for ep, name in cust_endpoints:
    res = requests.get(f"{BASE_URL}{ep}", headers=cust_headers)
    print(f"{name:20} -> Status: {res.status_code}")

print("\n=== VERIFYING PROVIDER API ACCESS ===")
prov_headers = {"Authorization": f"Bearer {tokens['SERVICE_PROVIDER']}"}
prov_endpoints = [
    ("/api/v1/bookings", "Provider Bookings"),
    ("/api/v1/providers", "Providers List"),
    ("/api/v1/technicians", "Technicians List"),
    ("/api/v1/reviews", "Reviews"),
]
for ep, name in prov_endpoints:
    res = requests.get(f"{BASE_URL}{ep}", headers=prov_headers)
    print(f"{name:20} -> Status: {res.status_code}")

print("\n=== VERIFYING TECHNICIAN API ACCESS ===")
tech_headers = {"Authorization": f"Bearer {tokens['TECHNICIAN']}"}
tech_endpoints = [
    ("/api/v1/bookings", "Technician Jobs"),
]
for ep, name in tech_endpoints:
    res = requests.get(f"{BASE_URL}{ep}", headers=tech_headers)
    print(f"{name:20} -> Status: {res.status_code}")
