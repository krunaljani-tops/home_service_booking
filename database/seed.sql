-- ============================================================
-- HomeServe Technologies - Seed Data
-- ============================================================

USE homeserve_db;

-- ============================================================
-- Admin User (password: Admin@123)
-- ============================================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, is_verified) VALUES
('admin@homeserve.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'SUPER_ADMIN', 'Platform', 'Admin', '9999999999', TRUE, TRUE);

-- ============================================================
-- Customer Users (password: Customer@123)
-- ============================================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, is_verified) VALUES
('rahul.sharma@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'CUSTOMER', 'Rahul', 'Sharma', '9876543210', TRUE, TRUE),
('priya.patel@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'CUSTOMER', 'Priya', 'Patel', '9876543211', TRUE, TRUE),
('amit.kumar@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'CUSTOMER', 'Amit', 'Kumar', '9876543212', TRUE, TRUE);

INSERT INTO customers (user_id, date_of_birth, gender) VALUES
(2, '1990-05-15', 'Male'),
(3, '1992-08-22', 'Female'),
(4, '1988-03-10', 'Male');

-- ============================================================
-- Customer Addresses
-- ============================================================
INSERT INTO addresses (customer_id, label, address_line1, address_line2, city, state, postal_code, is_default) VALUES
(1, 'Home', '42, MG Road', 'Near City Mall', 'Mumbai', 'Maharashtra', '400001', TRUE),
(1, 'Office', 'Tech Park, Floor 5', 'Andheri East', 'Mumbai', 'Maharashtra', '400069', FALSE),
(2, 'Home', '15, Park Street', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', TRUE),
(3, 'Home', '88, Brigade Road', NULL, 'Bangalore', 'Karnataka', '560025', TRUE);

-- ============================================================
-- Service Provider Users (password: Provider@123)
-- ============================================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, is_verified) VALUES
('cleanpro@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'SERVICE_PROVIDER', 'Rajesh', 'Verma', '9876500001', TRUE, TRUE),
('fixitall@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'SERVICE_PROVIDER', 'Suresh', 'Nair', '9876500002', TRUE, TRUE),
('sparkelectric@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'SERVICE_PROVIDER', 'Vikram', 'Singh', '9876500003', TRUE, TRUE);

INSERT INTO service_providers (user_id, company_name, description, license_number, verification_status, commission_rate, rating_avg, total_reviews, is_featured) VALUES
(5, 'CleanPro Services', 'Professional cleaning services for homes and offices. We use eco-friendly products and deliver spotless results.', 'LIC-CLN-2024-001', 'VERIFIED', 15.00, 4.50, 128, TRUE),
(6, 'FixItAll Solutions', 'Expert plumbing and electrical repair services. Available 24/7 for emergency repairs.', 'LIC-FIX-2024-002', 'VERIFIED', 12.00, 4.20, 95, TRUE),
(7, 'SparkElectric Co.', 'Licensed electricians providing safe and reliable electrical services. Fully insured and certified.', 'LIC-ELC-2024-003', 'VERIFIED', 15.00, 4.80, 210, TRUE);

-- ============================================================
-- Service Areas
-- ============================================================
INSERT INTO service_areas (provider_id, city, state, postal_code, radius_km) VALUES
(1, 'Mumbai', 'Maharashtra', NULL, 25),
(1, 'Pune', 'Maharashtra', NULL, 15),
(2, 'Mumbai', 'Maharashtra', NULL, 20),
(2, 'Hyderabad', 'Telangana', NULL, 20),
(3, 'Bangalore', 'Karnataka', NULL, 30),
(3, 'Mumbai', 'Maharashtra', NULL, 20);

-- ============================================================
-- Technician Users (password: Tech@123)
-- ============================================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, is_verified) VALUES
('tech.ravi@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'TECHNICIAN', 'Ravi', 'Gupta', '9876600001', TRUE, TRUE),
('tech.sanjay@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'TECHNICIAN', 'Sanjay', 'Das', '9876600002', TRUE, TRUE),
('tech.manoj@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'TECHNICIAN', 'Manoj', 'Tiwari', '9876600003', TRUE, TRUE),
('tech.deepak@email.com', '$2b$12$LJ3m4ys3GZfnMQXQfGKHr.8bZDeRsW8MKfnJqxCmxMJZPuxpHVSy2', 'TECHNICIAN', 'Deepak', 'Yadav', '9876600004', TRUE, TRUE);

INSERT INTO technicians (user_id, provider_id, specialization, experience_years, is_available) VALUES
(8, 1, 'Deep Cleaning, Carpet Cleaning', 5, TRUE),
(9, 1, 'Kitchen Cleaning, Bathroom Cleaning', 3, TRUE),
(10, 2, 'Plumbing, Pipe Fitting', 8, TRUE),
(11, 3, 'Wiring, Panel Installation', 6, TRUE);

-- ============================================================
-- Service Categories
-- ============================================================
INSERT INTO service_categories (name, slug, description, is_active, sort_order) VALUES
('Cleaning', 'cleaning', 'Professional cleaning services for homes and offices', TRUE, 1),
('Plumbing', 'plumbing', 'Expert plumbing repair and installation services', TRUE, 2),
('Electrical', 'electrical', 'Licensed electrical repair and installation', TRUE, 3),
('Painting', 'painting', 'Interior and exterior painting services', TRUE, 4),
('Carpentry', 'carpentry', 'Custom carpentry and furniture repair', TRUE, 5),
('Pest Control', 'pest-control', 'Safe and effective pest control solutions', TRUE, 6),
('Appliance Repair', 'appliance-repair', 'Repair services for all home appliances', TRUE, 7),
('AC Service', 'ac-service', 'Air conditioner installation, repair and maintenance', TRUE, 8);

-- ============================================================
-- Services
-- ============================================================
INSERT INTO services (category_id, name, slug, description, base_price, duration_minutes, is_active) VALUES
-- Cleaning (cat 1)
(1, 'Home Deep Cleaning', 'home-deep-cleaning', 'Complete deep cleaning of your entire home including all rooms, kitchen, and bathrooms.', 2499.00, 180, TRUE),
(1, 'Bathroom Cleaning', 'bathroom-cleaning', 'Thorough cleaning of bathrooms including tiles, fixtures, and sanitization.', 599.00, 60, TRUE),
(1, 'Kitchen Cleaning', 'kitchen-cleaning', 'Deep cleaning of kitchen including chimney, stove, countertops, and cabinets.', 999.00, 90, TRUE),
(1, 'Sofa Cleaning', 'sofa-cleaning', 'Professional sofa and upholstery cleaning using steam technology.', 799.00, 60, TRUE),
(1, 'Carpet Cleaning', 'carpet-cleaning', 'Deep carpet cleaning with stain removal and deodorizing.', 1299.00, 90, TRUE),
-- Plumbing (cat 2)
(2, 'Tap & Mixer Repair', 'tap-mixer-repair', 'Repair or replace leaking taps and mixers.', 349.00, 45, TRUE),
(2, 'Toilet Repair', 'toilet-repair', 'Fix toilet flush, seat, and leak issues.', 449.00, 60, TRUE),
(2, 'Pipe Leakage Fix', 'pipe-leakage-fix', 'Identify and fix pipe leakage issues.', 599.00, 60, TRUE),
(2, 'Drain Cleaning', 'drain-cleaning', 'Unclog and clean blocked drains and pipes.', 499.00, 45, TRUE),
(2, 'Water Tank Cleaning', 'water-tank-cleaning', 'Complete water tank cleaning and sanitization.', 1499.00, 120, TRUE),
-- Electrical (cat 3)
(3, 'Switchboard Installation', 'switchboard-installation', 'Install new switchboards or replace existing ones.', 399.00, 45, TRUE),
(3, 'Fan Installation', 'fan-installation', 'Install ceiling fans, exhaust fans, or wall fans.', 299.00, 30, TRUE),
(3, 'Wiring Repair', 'wiring-repair', 'Diagnose and repair electrical wiring issues.', 699.00, 60, TRUE),
(3, 'MCB/Fuse Repair', 'mcb-fuse-repair', 'Replace or repair MCB, fuse, or circuit breakers.', 499.00, 45, TRUE),
(3, 'Inverter Installation', 'inverter-installation', 'Install home inverter and battery setup.', 999.00, 90, TRUE),
-- Painting (cat 4)
(4, 'Full Home Painting', 'full-home-painting', 'Complete interior painting for 1BHK/2BHK/3BHK homes.', 14999.00, 1440, TRUE),
(4, 'Single Room Painting', 'single-room-painting', 'Professional painting for a single room.', 3999.00, 480, TRUE),
(4, 'Exterior Painting', 'exterior-painting', 'Weather-proof exterior painting services.', 19999.00, 2880, TRUE),
-- Carpentry (cat 5)
(5, 'Furniture Assembly', 'furniture-assembly', 'Assemble new furniture including beds, tables, and shelves.', 499.00, 60, TRUE),
(5, 'Door Repair', 'door-repair', 'Fix door hinges, locks, handles, and alignment.', 399.00, 45, TRUE),
(5, 'Custom Shelving', 'custom-shelving', 'Design and install custom wall shelves and storage.', 1999.00, 180, TRUE),
-- Pest Control (cat 6)
(6, 'General Pest Control', 'general-pest-control', 'Treatment for cockroaches, ants, spiders, and common pests.', 999.00, 60, TRUE),
(6, 'Termite Control', 'termite-control', 'Anti-termite treatment for homes and offices.', 2499.00, 120, TRUE),
(6, 'Bed Bug Treatment', 'bed-bug-treatment', 'Complete bed bug elimination treatment.', 1999.00, 90, TRUE),
-- Appliance Repair (cat 7)
(7, 'Washing Machine Repair', 'washing-machine-repair', 'Diagnose and repair washing machine issues.', 499.00, 60, TRUE),
(7, 'Refrigerator Repair', 'refrigerator-repair', 'Fix cooling, leaking, and other refrigerator problems.', 599.00, 60, TRUE),
(7, 'Microwave Repair', 'microwave-repair', 'Repair microwave oven heating and electrical issues.', 449.00, 45, TRUE),
-- AC Service (cat 8)
(8, 'AC Regular Service', 'ac-regular-service', 'Regular AC servicing including filter cleaning and gas check.', 499.00, 60, TRUE),
(8, 'AC Deep Cleaning', 'ac-deep-cleaning', 'Complete AC deep cleaning with foam wash technology.', 799.00, 90, TRUE),
(8, 'AC Installation', 'ac-installation', 'Professional split/window AC installation.', 1499.00, 120, TRUE),
(8, 'AC Gas Refill', 'ac-gas-refill', 'AC gas refilling with leak detection.', 2499.00, 60, TRUE);

-- ============================================================
-- Provider Services
-- ============================================================
INSERT INTO provider_services (provider_id, service_id, custom_price, is_available) VALUES
-- CleanPro - Cleaning services
(1, 1, 2299.00, TRUE),
(1, 2, 549.00, TRUE),
(1, 3, 949.00, TRUE),
(1, 4, 749.00, TRUE),
(1, 5, 1199.00, TRUE),
-- FixItAll - Plumbing services
(2, 6, NULL, TRUE),
(2, 7, NULL, TRUE),
(2, 8, 549.00, TRUE),
(2, 9, NULL, TRUE),
(2, 10, 1399.00, TRUE),
-- SparkElectric - Electrical services
(3, 11, NULL, TRUE),
(3, 12, NULL, TRUE),
(3, 13, 649.00, TRUE),
(3, 14, NULL, TRUE),
(3, 15, NULL, TRUE),
-- Cross-listing: FixItAll also offers some electrical
(2, 11, 449.00, TRUE),
(2, 12, 349.00, TRUE);

-- ============================================================
-- Availability Slots
-- ============================================================
-- CleanPro: Mon-Sat, 8AM-6PM
INSERT INTO availability_slots (provider_id, day_of_week, start_time, end_time, is_available) VALUES
(1, 0, '08:00:00', '12:00:00', TRUE),
(1, 0, '13:00:00', '18:00:00', TRUE),
(1, 1, '08:00:00', '12:00:00', TRUE),
(1, 1, '13:00:00', '18:00:00', TRUE),
(1, 2, '08:00:00', '12:00:00', TRUE),
(1, 2, '13:00:00', '18:00:00', TRUE),
(1, 3, '08:00:00', '12:00:00', TRUE),
(1, 3, '13:00:00', '18:00:00', TRUE),
(1, 4, '08:00:00', '12:00:00', TRUE),
(1, 4, '13:00:00', '18:00:00', TRUE),
(1, 5, '09:00:00', '14:00:00', TRUE);

-- FixItAll: Mon-Sun (24/7 emergency), regular 9AM-7PM
INSERT INTO availability_slots (provider_id, day_of_week, start_time, end_time, is_available) VALUES
(2, 0, '09:00:00', '13:00:00', TRUE),
(2, 0, '14:00:00', '19:00:00', TRUE),
(2, 1, '09:00:00', '13:00:00', TRUE),
(2, 1, '14:00:00', '19:00:00', TRUE),
(2, 2, '09:00:00', '13:00:00', TRUE),
(2, 2, '14:00:00', '19:00:00', TRUE),
(2, 3, '09:00:00', '13:00:00', TRUE),
(2, 3, '14:00:00', '19:00:00', TRUE),
(2, 4, '09:00:00', '13:00:00', TRUE),
(2, 4, '14:00:00', '19:00:00', TRUE),
(2, 5, '09:00:00', '13:00:00', TRUE),
(2, 6, '10:00:00', '14:00:00', TRUE);

-- SparkElectric: Mon-Fri, 10AM-6PM
INSERT INTO availability_slots (provider_id, day_of_week, start_time, end_time, is_available) VALUES
(3, 0, '10:00:00', '14:00:00', TRUE),
(3, 0, '15:00:00', '18:00:00', TRUE),
(3, 1, '10:00:00', '14:00:00', TRUE),
(3, 1, '15:00:00', '18:00:00', TRUE),
(3, 2, '10:00:00', '14:00:00', TRUE),
(3, 2, '15:00:00', '18:00:00', TRUE),
(3, 3, '10:00:00', '14:00:00', TRUE),
(3, 3, '15:00:00', '18:00:00', TRUE),
(3, 4, '10:00:00', '14:00:00', TRUE),
(3, 4, '15:00:00', '18:00:00', TRUE);

-- ============================================================
-- Sample Coupons
-- ============================================================
INSERT INTO coupons (code, description, discount_type, discount_value, max_discount, min_order_amount, usage_limit, used_count, valid_from, valid_until, is_active) VALUES
('WELCOME20', 'Get 20% off on your first booking', 'PERCENTAGE', 20.00, 500.00, 499.00, 1000, 45, '2026-01-01 00:00:00', '2027-12-31 23:59:59', TRUE),
('FLAT200', 'Flat ₹200 off on orders above ₹999', 'FIXED', 200.00, NULL, 999.00, 500, 23, '2026-01-01 00:00:00', '2027-06-30 23:59:59', TRUE),
('CLEAN15', '15% off on all cleaning services', 'PERCENTAGE', 15.00, 400.00, 599.00, 200, 12, '2026-06-01 00:00:00', '2027-03-31 23:59:59', TRUE),
('DIWALI500', 'Diwali special - Flat ₹500 off', 'FIXED', 500.00, NULL, 1999.00, 100, 0, '2026-10-15 00:00:00', '2026-11-15 23:59:59', TRUE);

-- ============================================================
-- Sample Bookings
-- ============================================================
INSERT INTO bookings (booking_uid, customer_id, provider_id, service_id, address_id, scheduled_date, scheduled_time, duration_minutes, status, description, total_amount, discount_amount, tax_amount, final_amount, coupon_id) VALUES
('HS-20261101-001', 1, 1, 1, 1, '2026-11-05', '10:00:00', 180, 'CONFIRMED', 'Full home deep cleaning needed. 3 BHK apartment.', 2299.00, 400.00, 341.82, 2240.82, 3),
('HS-20261101-002', 2, 2, 6, 3, '2026-11-06', '14:00:00', 45, 'PENDING', 'Kitchen tap leaking continuously.', 349.00, 0.00, 62.82, 411.82, NULL),
('HS-20261102-001', 3, 3, 13, 4, '2026-11-07', '11:00:00', 60, 'COMPLETED', 'Old wiring needs replacement in bedroom.', 649.00, 0.00, 116.82, 765.82, NULL),
('HS-20261102-002', 1, 1, 4, 2, '2026-11-08', '09:00:00', 60, 'PROVIDER_ASSIGNED', 'Sofa stains need to be removed.', 749.00, 149.80, 107.86, 707.06, 1);

-- ============================================================
-- Sample Booking Assignments
-- ============================================================
INSERT INTO booking_assignments (booking_id, technician_id, assigned_at, accepted_at, status) VALUES
(1, 1, '2026-11-01 15:00:00', '2026-11-01 15:30:00', 'ACCEPTED'),
(3, 4, '2026-11-02 12:00:00', '2026-11-02 12:15:00', 'COMPLETED'),
(4, 2, '2026-11-02 16:00:00', NULL, 'ASSIGNED');

-- ============================================================
-- Sample Payments
-- ============================================================
INSERT INTO payments (booking_id, payment_uid, razorpay_order_id, razorpay_payment_id, amount, status, payment_method, paid_at) VALUES
(3, 'PAY-20261102-001', 'order_test_abc123', 'pay_test_xyz789', 765.82, 'PAID', 'upi', '2026-11-07 12:30:00');

-- ============================================================
-- Sample Invoices
-- ============================================================
INSERT INTO invoices (invoice_number, payment_id, booking_id, customer_id, subtotal, discount, tax, total) VALUES
('INV-20261107-001', 1, 3, 3, 649.00, 0.00, 116.82, 765.82);

-- ============================================================
-- Sample Reviews
-- ============================================================
INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment, response) VALUES
(3, 3, 3, 5, 'Excellent work! The electrician was very professional and completed the wiring replacement quickly. Highly recommended!', 'Thank you for your kind words! We are glad you are satisfied with our service.');

-- ============================================================
-- Sample Provider Earnings
-- ============================================================
INSERT INTO provider_earnings (provider_id, booking_id, total_amount, commission_amount, earning_amount, status) VALUES
(3, 3, 765.82, 114.87, 650.95, 'PENDING');

-- ============================================================
-- Sample Notifications
-- ============================================================
INSERT INTO notifications (user_id, title, message, type, is_read, data) VALUES
(2, 'Booking Confirmed', 'Your booking HS-20261101-001 for Home Deep Cleaning has been confirmed.', 'booking', FALSE, '{"booking_id": 1}'),
(5, 'New Booking Request', 'You have a new booking request HS-20261101-001 from Rahul Sharma.', 'booking', TRUE, '{"booking_id": 1}'),
(3, 'Booking Pending', 'Your booking HS-20261101-002 for Tap & Mixer Repair is pending confirmation.', 'booking', FALSE, '{"booking_id": 2}'),
(4, 'Service Completed', 'Your booking HS-20261102-001 has been completed. Please rate your experience.', 'booking', FALSE, '{"booking_id": 3}'),
(1, 'Platform Update', 'Welcome to HomeServe Technologies admin panel. Start managing your platform.', 'system', TRUE, NULL);

-- ============================================================
-- Platform Settings
-- ============================================================
INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
('platform_commission', '15.00', 'Default platform commission percentage'),
('tax_rate', '18.00', 'GST tax rate percentage'),
('min_booking_advance_hours', '2', 'Minimum hours in advance for booking'),
('max_booking_advance_days', '30', 'Maximum days in advance for booking'),
('cancellation_window_hours', '4', 'Hours before service when cancellation is free'),
('platform_name', 'HomeServe Technologies', 'Platform display name'),
('support_email', 'support@homeserve.com', 'Customer support email'),
('support_phone', '1800-HOME-SERVE', 'Customer support phone');

-- ============================================================
-- Sample Subscription Plans
-- ============================================================
INSERT INTO subscription_plans (name, description, price, duration_days, max_services, max_technicians, commission_rate, features, is_active) VALUES
('Starter', 'Perfect for individual service providers', 999.00, 30, 5, 2, 18.00, '["Basic dashboard", "Up to 5 services", "Email support"]', TRUE),
('Professional', 'Ideal for growing service businesses', 2499.00, 30, 15, 5, 15.00, '["Advanced dashboard", "Up to 15 services", "Priority support", "Analytics"]', TRUE),
('Enterprise', 'For large service companies', 4999.00, 30, 50, 20, 10.00, '["Full dashboard", "Unlimited services", "24/7 support", "Advanced analytics", "API access"]', TRUE);

-- ============================================================
-- Sample Complaints
-- ============================================================
INSERT INTO complaints (complaint_uid, booking_id, customer_id, subject, description, status, priority) VALUES
('CMP-20261103-001', 2, 2, 'Delayed response from provider', 'The provider has not responded to my booking request for over 24 hours. Please look into this.', 'OPEN', 'MEDIUM');

