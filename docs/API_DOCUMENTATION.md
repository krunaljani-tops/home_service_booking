# HomeServe Technologies - API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: `https://api.homeserve.com`

## Authentication
All protected endpoints require a JWT Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication (`/api/v1/auth`)

### POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "role": "CUSTOMER",
  "company_name": "string (required for SERVICE_PROVIDER)"
}
```

**Response (201):**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "CUSTOMER",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### POST `/api/v1/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Response (200):** Same as register response.

### GET `/api/v1/auth/me`
Get current authenticated user profile. 🔒 Requires auth.

### PUT `/api/v1/auth/profile`
Update current user profile. 🔒 Requires auth.

### POST `/api/v1/auth/change-password`
Change password. 🔒 Requires auth.

---

## 2. Users (`/api/v1/users`) - 🔒 Admin Only

### GET `/api/v1/users`
List all users with pagination and filters.

**Query Parameters:**
- `skip` (int, default: 0)
- `limit` (int, default: 20)
- `role` (string, optional): Filter by role
- `search` (string, optional): Search by name/email
- `is_active` (bool, optional)

### GET `/api/v1/users/{id}`
Get user by ID.

### PUT `/api/v1/users/{id}`
Update user details.

### DELETE `/api/v1/users/{id}`
Deactivate user account.

### PATCH `/api/v1/users/{id}/status`
Toggle user active status.

---

## 3. Categories (`/api/v1/categories`)

### GET `/api/v1/categories`
List all active service categories. 🌐 Public.

### POST `/api/v1/categories`
Create a new category. 🔒 Admin only.

### GET `/api/v1/categories/{id}`
Get category details. 🌐 Public.

### PUT `/api/v1/categories/{id}`
Update category. 🔒 Admin only.

### DELETE `/api/v1/categories/{id}`
Delete category. 🔒 Admin only.

---

## 4. Services (`/api/v1/services`)

### GET `/api/v1/services`
Browse services with search and filters. 🌐 Public.

**Query Parameters:**
- `skip`, `limit` (pagination)
- `category_id` (int, optional)
- `search` (string, optional)
- `min_price`, `max_price` (decimal, optional)
- `sort_by` (string: "price", "name", "created_at")
- `sort_order` (string: "asc", "desc")

### GET `/api/v1/services/{id}`
Get service details with available providers. 🌐 Public.

### GET `/api/v1/services/{id}/providers`
Get providers offering this service. 🌐 Public.

---

## 5. Providers (`/api/v1/providers`)

### GET `/api/v1/providers`
List verified providers. 🌐 Public.

### GET `/api/v1/providers/{id}`
Get provider public profile. 🌐 Public.

### POST `/api/v1/providers/{id}/verify`
Approve/reject provider. 🔒 Admin only.

```json
{
  "status": "VERIFIED",
  "remarks": "All documents verified"
}
```

### GET `/api/v1/providers/{id}/availability`
Get provider availability slots. 🌐 Public.

### POST `/api/v1/providers/{id}/availability`
Set availability slots. 🔒 Provider only.

### GET `/api/v1/providers/{id}/earnings`
Get provider earnings. 🔒 Provider only.

---

## 6. Bookings (`/api/v1/bookings`)

### POST `/api/v1/bookings`
Create a new booking. 🔒 Customer only.

```json
{
  "provider_id": 1,
  "service_id": 1,
  "address_id": 1,
  "scheduled_date": "2026-11-10",
  "scheduled_time": "10:00",
  "description": "Need deep cleaning for 3BHK",
  "coupon_code": "WELCOME20"
}
```

### GET `/api/v1/bookings`
List bookings (filtered by role). 🔒 Requires auth.

### GET `/api/v1/bookings/{id}`
Get booking details. 🔒 Requires auth (own bookings only).

### PATCH `/api/v1/bookings/{id}/status`
Update booking status. 🔒 Provider/Admin.

```json
{
  "status": "CONFIRMED"
}
```

### PATCH `/api/v1/bookings/{id}/cancel`
Cancel a booking. 🔒 Customer/Provider.

```json
{
  "reason": "Schedule conflict"
}
```

### POST `/api/v1/bookings/{id}/assign`
Assign technician to booking. 🔒 Provider only.

```json
{
  "technician_id": 1
}
```

---

## 7. Payments (`/api/v1/payments`)

### POST `/api/v1/payments/create-order`
Create Razorpay payment order. 🔒 Customer only.

```json
{
  "booking_id": 1
}
```

**Response:**
```json
{
  "order_id": "order_test_abc123",
  "amount": 76582,
  "currency": "INR",
  "key_id": "rzp_test_..."
}
```

### POST `/api/v1/payments/verify`
Verify Razorpay payment. 🔒 Customer only.

```json
{
  "razorpay_order_id": "order_test_abc123",
  "razorpay_payment_id": "pay_test_xyz789",
  "razorpay_signature": "...",
  "booking_id": 1
}
```

---

## 8. Reviews (`/api/v1/reviews`)

### POST `/api/v1/reviews`
Submit a review. 🔒 Customer only (completed bookings).

```json
{
  "booking_id": 3,
  "rating": 5,
  "comment": "Excellent service!"
}
```

### PUT `/api/v1/reviews/{id}/respond`
Provider responds to review. 🔒 Provider only.

---

## 9. Reports (`/api/v1/reports`) - 🔒 Admin Only

### GET `/api/v1/reports/dashboard`
Get dashboard overview statistics.

### GET `/api/v1/reports/revenue`
Get revenue analytics.

### GET `/api/v1/reports/export/csv`
Export data as CSV.

---

## Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Internal Server Error |

