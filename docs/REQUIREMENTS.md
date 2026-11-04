# HomeServe Technologies - Requirements Specification

## 1. Project Overview
HomeServe Technologies is a SaaS-based home services booking marketplace connecting customers with professional service providers across India.

## 2. Functional Requirements

### 2.1 Authentication & Authorization
- FR-001: Users can register with email, password, name, phone, and role selection
- FR-002: Users can log in with email and password
- FR-003: JWT-based session management with 24-hour expiry
- FR-004: Role-based access control (SUPER_ADMIN, CUSTOMER, SERVICE_PROVIDER, TECHNICIAN)
- FR-005: Password hashing with bcrypt
- FR-006: Profile management for all user roles
- FR-007: Password change functionality

### 2.2 Customer Management
- FR-010: Customers can manage multiple addresses
- FR-011: Customers can browse service categories
- FR-012: Customers can search and filter services
- FR-013: Customers can view provider profiles and ratings
- FR-014: Customers can manage favorite providers
- FR-015: Customers can view booking history
- FR-016: Customers can download invoices

### 2.3 Service & Category Management
- FR-020: Admin can create/edit/delete service categories
- FR-021: Admin can create/edit/delete services with pricing
- FR-022: Categories support parent-child hierarchy
- FR-023: Services have base price, duration, and description
- FR-024: Providers can list their offered services with custom pricing

### 2.4 Service Provider Management
- FR-030: Providers register with company details
- FR-031: Providers upload verification documents
- FR-032: Admin approves/rejects provider applications
- FR-033: Providers manage service areas
- FR-034: Providers set weekly availability slots
- FR-035: Providers manage technician teams
- FR-036: Providers view earnings and commission deductions

### 2.5 Booking Management
- FR-040: Customers create bookings with date, time, address, and description
- FR-041: System generates unique booking ID (HS-YYYYMMDD-NNN)
- FR-042: Booking status workflow: PENDING → CONFIRMED → PROVIDER_ASSIGNED → IN_PROGRESS → COMPLETED
- FR-043: Support CANCELLED and REJECTED statuses
- FR-044: Providers accept/reject bookings
- FR-045: Providers assign technicians to bookings
- FR-046: Prevent double booking via database constraints
- FR-047: Customers can cancel bookings
- FR-048: Image uploads for booking reference

### 2.6 Technician Management
- FR-050: Providers create technician accounts
- FR-051: Technicians view assigned jobs
- FR-052: Technicians accept assignments
- FR-053: Technicians update job status (arrived, started, completed)
- FR-054: Technicians upload before/after images
- FR-055: Technicians add completion remarks

### 2.7 Payment Management
- FR-060: Razorpay integration (test mode)
- FR-061: Payment order creation
- FR-062: Server-side payment verification
- FR-063: Invoice generation on payment
- FR-064: Platform commission calculation
- FR-065: Coupon/discount application
- FR-066: Tax (GST) calculation at 18%
- FR-067: Refund processing
- FR-068: Provider earnings tracking

### 2.8 Rating & Review System
- FR-070: Customers rate completed bookings (1-5 stars)
- FR-071: Customers write review comments
- FR-072: Providers respond to reviews
- FR-073: Provider rating averages auto-calculated

### 2.9 Complaint Management
- FR-080: Customers raise complaints against bookings
- FR-081: Complaints have priority levels (LOW, MEDIUM, HIGH)
- FR-082: Admin manages complaint lifecycle (OPEN → IN_PROGRESS → RESOLVED → CLOSED)

### 2.10 Admin Dashboard & Reports
- FR-090: Dashboard with KPIs (users, bookings, revenue, providers)
- FR-091: Revenue trend charts
- FR-092: Booking analytics
- FR-093: CSV export functionality
- FR-094: Platform settings management

## 3. Non-Functional Requirements

- NFR-001: Response time < 500ms for API endpoints
- NFR-002: Support 100+ concurrent users
- NFR-003: Mobile-responsive UI (320px to 1920px)
- NFR-004: WCAG 2.1 AA accessibility compliance
- NFR-005: 99.9% uptime target
- NFR-006: Data encrypted at rest and in transit
- NFR-007: CORS properly configured
- NFR-008: API rate limiting (100 req/min per IP)
- NFR-009: Input validation on all endpoints
- NFR-010: SQL injection prevention via ORM

## 4. User Stories

### Customer
- US-001: As a customer, I want to register so I can book services
- US-002: As a customer, I want to browse categories so I can find what I need
- US-003: As a customer, I want to search providers so I can compare options
- US-004: As a customer, I want to book a service so I can get my problem fixed
- US-005: As a customer, I want to track my booking so I know its status
- US-006: As a customer, I want to pay online so the transaction is convenient
- US-007: As a customer, I want to rate my experience so others can benefit

### Provider
- US-010: As a provider, I want to register my company so I can offer services
- US-011: As a provider, I want to manage my services so customers can find me
- US-012: As a provider, I want to accept bookings so I can serve customers
- US-013: As a provider, I want to assign technicians so work is organized
- US-014: As a provider, I want to track earnings so I know my revenue

### Technician
- US-020: As a technician, I want to see assigned jobs so I know my schedule
- US-021: As a technician, I want to update job status so everyone is informed
- US-022: As a technician, I want to upload completion photos as proof of work

### Admin
- US-030: As an admin, I want a dashboard so I can monitor the platform
- US-031: As an admin, I want to verify providers so only legitimate ones operate
- US-032: As an admin, I want to manage complaints so customer issues are resolved
- US-033: As an admin, I want to generate reports so I can make data-driven decisions

## 5. Role-Permission Matrix

| Permission | Admin | Customer | Provider | Technician |
|-----------|-------|----------|----------|------------|
| View admin dashboard | ✅ | ❌ | ❌ | ❌ |
| Manage all users | ✅ | ❌ | ❌ | ❌ |
| Manage categories | ✅ | ❌ | ❌ | ❌ |
| Manage platform services | ✅ | ❌ | ❌ | ❌ |
| Verify providers | ✅ | ❌ | ❌ | ❌ |
| Manage coupons | ✅ | ❌ | ❌ | ❌ |
| View reports | ✅ | ❌ | ❌ | ❌ |
| Export data | ✅ | ❌ | ❌ | ❌ |
| Browse services | ✅ | ✅ | ✅ | ❌ |
| Book services | ❌ | ✅ | ❌ | ❌ |
| Manage addresses | ❌ | ✅ | ❌ | ❌ |
| Make payments | ❌ | ✅ | ❌ | ❌ |
| Submit reviews | ❌ | ✅ | ❌ | ❌ |
| Raise complaints | ❌ | ✅ | ❌ | ❌ |
| Manage own services | ❌ | ❌ | ✅ | ❌ |
| Set availability | ❌ | ❌ | ✅ | ❌ |
| Accept/reject bookings | ❌ | ❌ | ✅ | ❌ |
| Manage technicians | ❌ | ❌ | ✅ | ❌ |
| View earnings | ❌ | ❌ | ✅ | ❌ |
| View assigned jobs | ❌ | ❌ | ❌ | ✅ |
| Update job status | ❌ | ❌ | ❌ | ✅ |
| Upload job images | ❌ | ❌ | ❌ | ✅ |

