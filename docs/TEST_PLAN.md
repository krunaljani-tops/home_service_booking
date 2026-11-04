# HomeServe Technologies - Test Plan

## 1. Test Strategy

### Scope
- Unit tests for business logic (backend)
- API integration tests
- End-to-end UI tests (Playwright)
- Security tests
- Performance baseline tests

### Tools
- **Backend**: Pytest + HTTPX test client
- **Frontend**: Vitest (unit) + Playwright (E2E)
- **API**: Pytest + FastAPI TestClient

### Test Environment
- SQLite in-memory database for unit tests
- Docker MySQL for integration tests
- Test Razorpay credentials for payment tests

---

## 2. Unit Test Cases

### 2.1 Authentication
| ID | Test Case | Expected Result |
|----|-----------|----------------|
| UT-001 | Hash password | Returns valid bcrypt hash |
| UT-002 | Verify correct password | Returns True |
| UT-003 | Verify incorrect password | Returns False |
| UT-004 | Create JWT token | Returns valid JWT string |
| UT-005 | Decode valid token | Returns user data |
| UT-006 | Decode expired token | Raises exception |
| UT-007 | Decode invalid token | Raises exception |

### 2.2 Registration Validation
| ID | Test Case | Expected Result |
|----|-----------|----------------|
| UT-010 | Valid registration data | Passes validation |
| UT-011 | Invalid email format | Validation error |
| UT-012 | Password too short (<8) | Validation error |
| UT-013 | Missing required fields | Validation error |
| UT-014 | Duplicate email | 409 Conflict |

### 2.3 Price Calculation
| ID | Test Case | Expected Result |
|----|-----------|----------------|
| UT-020 | Calculate service total | base_price amount |
| UT-021 | Apply percentage coupon | Correct discount |
| UT-022 | Apply fixed coupon | Correct discount |
| UT-023 | Max discount cap | Discount capped |
| UT-024 | Tax calculation (18%) | Correct GST amount |
| UT-025 | Commission calculation | provider_earning = total - commission |
| UT-026 | Min order for coupon | Coupon rejected if below minimum |

### 2.4 Booking Validation
| ID | Test Case | Expected Result |
|----|-----------|----------------|
| UT-030 | Valid booking data | Passes validation |
| UT-031 | Past date booking | Rejected |
| UT-032 | Invalid time slot | Rejected |
| UT-033 | Provider unavailable | Rejected |
| UT-034 | Double booking check | Rejected if conflict |
| UT-035 | Booking UID generation | Unique format HS-YYYYMMDD-NNN |

---

## 3. API Test Cases

### 3.1 Auth Endpoints
| ID | Method | Endpoint | Test | Expected |
|----|--------|----------|------|----------|
| AT-001 | POST | /auth/register | Valid registration | 201 Created |
| AT-002 | POST | /auth/register | Duplicate email | 409 Conflict |
| AT-003 | POST | /auth/register | Missing fields | 422 Validation Error |
| AT-004 | POST | /auth/login | Valid credentials | 200 + token |
| AT-005 | POST | /auth/login | Wrong password | 401 Unauthorized |
| AT-006 | POST | /auth/login | Non-existent user | 401 Unauthorized |
| AT-007 | GET | /auth/me | Valid token | 200 + user data |
| AT-008 | GET | /auth/me | No token | 401 Unauthorized |
| AT-009 | GET | /auth/me | Expired token | 401 Unauthorized |

### 3.2 Booking Endpoints
| ID | Method | Endpoint | Test | Expected |
|----|--------|----------|------|----------|
| AT-020 | POST | /bookings | Customer creates booking | 201 Created |
| AT-021 | POST | /bookings | Provider tries to book | 403 Forbidden |
| AT-022 | POST | /bookings | Past date | 400 Bad Request |
| AT-023 | POST | /bookings | Double booking | 409 Conflict |
| AT-024 | GET | /bookings | Customer sees own bookings | 200 + filtered |
| AT-025 | GET | /bookings/{id} | Own booking | 200 + details |
| AT-026 | GET | /bookings/{id} | Another customer's booking | 403 Forbidden |
| AT-027 | PATCH | /bookings/{id}/status | Provider confirms | 200 Updated |
| AT-028 | PATCH | /bookings/{id}/status | Customer tries to confirm | 403 Forbidden |
| AT-029 | PATCH | /bookings/{id}/cancel | Customer cancels | 200 Updated |

### 3.3 Payment Endpoints
| ID | Method | Endpoint | Test | Expected |
|----|--------|----------|------|----------|
| AT-040 | POST | /payments/create-order | Valid booking | 200 + order_id |
| AT-041 | POST | /payments/verify | Valid signature | 200 + payment confirmed |
| AT-042 | POST | /payments/verify | Invalid signature | 400 Bad Request |
| AT-043 | POST | /payments/verify | Already paid booking | 409 Conflict |

---

## 4. E2E Test Scenarios (Playwright)

### 4.1 Customer Flow
| ID | Scenario | Steps |
|----|----------|-------|
| E2E-001 | Customer Registration | Navigate → Fill form → Submit → Dashboard loads |
| E2E-002 | Customer Login | Navigate → Enter creds → Submit → Dashboard loads |
| E2E-003 | Browse Services | Login → Navigate to services → View categories → Filter |
| E2E-004 | Search Providers | Search bar → Enter query → View results |
| E2E-005 | Book Service | Select service → Select provider → Pick date/time → Confirm |
| E2E-006 | View Bookings | Navigate to My Bookings → Verify booking appears |
| E2E-007 | Submit Review | Navigate to completed booking → Rate → Comment → Submit |

### 4.2 Provider Flow
| ID | Scenario | Steps |
|----|----------|-------|
| E2E-010 | Provider Login | Navigate → Enter creds → Provider dashboard loads |
| E2E-011 | Accept Booking | View booking requests → Click Accept → Status updates |
| E2E-012 | Assign Technician | Open booking → Select technician → Assign → Status updates |
| E2E-013 | View Earnings | Navigate to earnings → Verify amounts shown |

### 4.3 Technician Flow
| ID | Scenario | Steps |
|----|----------|-------|
| E2E-020 | Technician Login | Navigate → Enter creds → Technician dashboard loads |
| E2E-021 | View Assigned Jobs | Dashboard → View assigned jobs list |
| E2E-022 | Complete Job | Open job → Mark arrived → Start → Complete |

### 4.4 Admin Flow
| ID | Scenario | Steps |
|----|----------|-------|
| E2E-030 | Admin Dashboard | Login as admin → Verify stats cards → Charts load |
| E2E-031 | Manage Providers | Navigate → View list → Verify/Reject provider |
| E2E-032 | Manage Coupons | Navigate → Create coupon → Verify in list |

---

## 5. Negative Test Cases

| ID | Test Case | Expected Result |
|----|-----------|----------------|
| NT-001 | Login with invalid credentials | Error message shown |
| NT-002 | Register with existing email | Duplicate error |
| NT-003 | Customer accesses admin dashboard URL | Redirected/Forbidden |
| NT-004 | Provider accesses another provider's bookings | 403 Forbidden |
| NT-005 | Book service with past date | Validation error |
| NT-006 | Double booking same slot | Conflict error |
| NT-007 | Upload file >10MB | Size limit error |
| NT-008 | Upload non-image file to booking | Type validation error |
| NT-009 | Access API without token | 401 Unauthorized |
| NT-010 | Tamper with payment data | Signature mismatch |

---

## 6. Security Test Cases

| ID | Test Case | Expected Result |
|----|-----------|----------------|
| ST-001 | SQL injection in search | Query parameterized, no injection |
| ST-002 | XSS in review comment | Input sanitized |
| ST-003 | CORS from unauthorized origin | Request blocked |
| ST-004 | Rate limiting | 429 after threshold |
| ST-005 | JWT tampering | 401 Unauthorized |
| ST-006 | Password not in API response | password_hash excluded |
| ST-007 | File upload validation | Only allowed types accepted |
| ST-008 | Horizontal privilege escalation | Cannot access other users' data |

