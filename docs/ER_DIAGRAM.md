# HomeServe Technologies - ER Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o| customers : "has"
    users ||--o| service_providers : "has"
    users ||--o| technicians : "has"
    users ||--o{ notifications : "receives"

    customers ||--o{ addresses : "has"
    customers ||--o{ bookings : "creates"
    customers ||--o{ reviews : "writes"
    customers ||--o{ complaints : "raises"
    customers ||--o{ invoices : "receives"
    customers }o--o{ service_providers : "favorites"

    service_providers ||--o{ technicians : "employs"
    service_providers ||--o{ provider_services : "offers"
    service_providers ||--o{ service_areas : "covers"
    service_providers ||--o{ availability_slots : "sets"
    service_providers ||--o{ bookings : "serves"
    service_providers ||--o{ reviews : "receives"
    service_providers ||--o{ provider_earnings : "earns"

    service_categories ||--o{ services : "contains"
    service_categories ||--o{ service_categories : "parent"

    services ||--o{ provider_services : "listed_by"
    services ||--o{ bookings : "booked"

    bookings ||--o| booking_assignments : "assigned"
    bookings ||--o{ booking_images : "has"
    bookings ||--o| payments : "paid_by"
    bookings ||--o| reviews : "reviewed"
    bookings ||--o| complaints : "complained"
    bookings }o--o| coupons : "uses"
    bookings ||--o| provider_earnings : "generates"

    booking_assignments }o--|| technicians : "assigned_to"

    payments ||--o| invoices : "generates"

    users {
        int id PK
        varchar email UK
        varchar password_hash
        enum role
        varchar first_name
        varchar last_name
        varchar phone
        varchar avatar_url
        boolean is_active
        boolean is_verified
        timestamp created_at
        timestamp updated_at
    }

    customers {
        int id PK
        int user_id FK
        date date_of_birth
        varchar gender
    }

    service_providers {
        int id PK
        int user_id FK
        varchar company_name
        text description
        varchar license_number
        enum verification_status
        json verification_documents
        decimal commission_rate
        decimal rating_avg
        int total_reviews
        boolean is_featured
    }

    technicians {
        int id PK
        int user_id FK
        int provider_id FK
        varchar specialization
        int experience_years
        boolean is_available
    }

    addresses {
        int id PK
        int customer_id FK
        varchar label
        varchar address_line1
        varchar city
        varchar state
        varchar postal_code
        boolean is_default
    }

    service_categories {
        int id PK
        varchar name UK
        varchar slug UK
        text description
        varchar icon_url
        int parent_id FK
        int sort_order
        boolean is_active
    }

    services {
        int id PK
        int category_id FK
        varchar name
        varchar slug
        text description
        decimal base_price
        int duration_minutes
        boolean is_active
    }

    provider_services {
        int id PK
        int provider_id FK
        int service_id FK
        decimal custom_price
        boolean is_available
    }

    service_areas {
        int id PK
        int provider_id FK
        varchar city
        varchar state
        int radius_km
    }

    availability_slots {
        int id PK
        int provider_id FK
        tinyint day_of_week
        time start_time
        time end_time
        boolean is_available
    }

    bookings {
        int id PK
        varchar booking_uid UK
        int customer_id FK
        int provider_id FK
        int service_id FK
        int address_id FK
        date scheduled_date
        time scheduled_time
        int duration_minutes
        enum status
        decimal total_amount
        decimal discount_amount
        decimal tax_amount
        decimal final_amount
        int coupon_id FK
    }

    booking_assignments {
        int id PK
        int booking_id FK
        int technician_id FK
        enum status
        timestamp assigned_at
        timestamp completion_time
        text remarks
    }

    booking_images {
        int id PK
        int booking_id FK
        varchar image_url
        enum image_type
        int uploaded_by FK
    }

    payments {
        int id PK
        int booking_id FK
        varchar payment_uid UK
        varchar razorpay_order_id
        varchar razorpay_payment_id
        decimal amount
        enum status
        timestamp paid_at
    }

    invoices {
        int id PK
        varchar invoice_number UK
        int payment_id FK
        int booking_id FK
        int customer_id FK
        decimal total
    }

    coupons {
        int id PK
        varchar code UK
        enum discount_type
        decimal discount_value
        decimal max_discount
        decimal min_order_amount
        int usage_limit
        int used_count
        datetime valid_from
        datetime valid_until
        boolean is_active
    }

    reviews {
        int id PK
        int booking_id FK
        int customer_id FK
        int provider_id FK
        tinyint rating
        text comment
        text response
    }

    complaints {
        int id PK
        varchar complaint_uid UK
        int booking_id FK
        int customer_id FK
        varchar subject
        text description
        enum status
        enum priority
        text resolution
    }

    notifications {
        int id PK
        int user_id FK
        varchar title
        text message
        varchar type
        boolean is_read
        json data
    }

    provider_earnings {
        int id PK
        int provider_id FK
        int booking_id FK
        decimal total_amount
        decimal commission_amount
        decimal earning_amount
        enum status
    }

    favorite_providers {
        int id PK
        int customer_id FK
        int provider_id FK
    }
```

## Table Relationships Summary

| From | To | Type | Description |
|------|-----|------|-------------|
| users | customers | 1:0..1 | A user may be a customer |
| users | service_providers | 1:0..1 | A user may be a provider |
| users | technicians | 1:0..1 | A user may be a technician |
| customers | addresses | 1:N | Customer has multiple addresses |
| customers | bookings | 1:N | Customer creates bookings |
| service_providers | technicians | 1:N | Provider employs technicians |
| service_providers | provider_services | 1:N | Provider offers services |
| service_categories | services | 1:N | Category contains services |
| bookings | booking_assignments | 1:0..1 | Booking may have assignment |
| bookings | payments | 1:0..1 | Booking may have payment |
| bookings | reviews | 1:0..1 | Booking may have review |
| bookings | complaints | 1:0..1 | Booking may have complaint |

## Database Statistics
- **23 tables** in the schema
- **45+ foreign key relationships**
- **30+ indexes** for query optimization
- **8 CHECK constraints** for data integrity

