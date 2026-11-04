import os
from decimal import Decimal
from datetime import datetime, date, time
from sqlalchemy.orm import Session
import bcrypt

from app.models.user import User, UserRole
from app.models.customer import Customer
from app.models.service_provider import ServiceProvider, VerificationStatus
from app.models.technician import Technician
from app.models.service_category import ServiceCategory
from app.models.service import Service
from app.models.address import Address
from app.models.coupon import Coupon, CouponDiscountType
from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, PaymentStatus
from app.models.review import Review
from app.models.service_area import ServiceArea

def get_hash(pw: str) -> str:
    pwd_bytes = pw.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

def auto_seed_if_empty(db: Session):
    try:
        if db.query(User).count() > 0:
            return

        print("Fresh database detected - initiating automated platform seed...")

        admin_pw = get_hash("Admin@123")
        cust_pw = get_hash("Customer@123")
        prov_pw = get_hash("Provider@123")
        tech_pw = get_hash("Tech@123")

        # 1. Super Admin
        admin = User(
            email="admin@homeserve.com",
            password_hash=admin_pw,
            role=UserRole.SUPER_ADMIN,
            first_name="Platform",
            last_name="Admin",
            phone="9999999999",
            is_active=True,
            is_verified=True,
        )
        db.add(admin)
        db.flush()

        # 2. Customers
        c1_user = User(
            email="rahul.sharma@email.com",
            password_hash=cust_pw,
            role=UserRole.CUSTOMER,
            first_name="Rahul",
            last_name="Sharma",
            phone="9876543210",
            is_active=True,
            is_verified=True,
        )
        c2_user = User(
            email="priya.patel@email.com",
            password_hash=cust_pw,
            role=UserRole.CUSTOMER,
            first_name="Priya",
            last_name="Patel",
            phone="9876543211",
            is_active=True,
            is_verified=True,
        )
        db.add_all([c1_user, c2_user])
        db.flush()

        c1 = Customer(user_id=c1_user.id, gender="Male")
        c2 = Customer(user_id=c2_user.id, gender="Female")
        db.add_all([c1, c2])
        db.flush()

        addr1 = Address(customer_id=c1.id, label="Home", address_line1="42, MG Road", city="Bangalore", state="Karnataka", postal_code="560001", is_default=True)
        addr2 = Address(customer_id=c2.id, label="Home", address_line1="15, Park Street", city="Bangalore", state="Karnataka", postal_code="560034", is_default=True)
        db.add_all([addr1, addr2])

        # 3. Service Providers
        p1_user = User(
            email="cleanpro@email.com",
            password_hash=prov_pw,
            role=UserRole.SERVICE_PROVIDER,
            first_name="Rajesh",
            last_name="Verma",
            phone="9876500001",
            is_active=True,
            is_verified=True,
        )
        p2_user = User(
            email="fixitall@email.com",
            password_hash=prov_pw,
            role=UserRole.SERVICE_PROVIDER,
            first_name="Suresh",
            last_name="Nair",
            phone="9876500002",
            is_active=True,
            is_verified=True,
        )
        db.add_all([p1_user, p2_user])
        db.flush()

        p1 = ServiceProvider(
            user_id=p1_user.id,
            company_name="CleanPro Services",
            description="Professional home cleaning & sanitization specialists.",
            license_number="LIC-CLN-2024-001",
            verification_status=VerificationStatus.VERIFIED,
            commission_rate=Decimal("15.00"),
            rating_avg=Decimal("4.80"),
            total_reviews=48,
            is_featured=True,
        )
        p2 = ServiceProvider(
            user_id=p2_user.id,
            company_name="FixItAll Solutions",
            description="Certified electrical, plumbing and appliance diagnostics.",
            license_number="LIC-FIX-2024-002",
            verification_status=VerificationStatus.VERIFIED,
            commission_rate=Decimal("15.00"),
            rating_avg=Decimal("4.60"),
            total_reviews=35,
            is_featured=True,
        )
        db.add_all([p1, p2])
        db.flush()

        area1 = ServiceArea(provider_id=p1.id, city="Bangalore", state="Karnataka", postal_code="560001", radius_km=25)
        area2 = ServiceArea(provider_id=p2.id, city="Bangalore", state="Karnataka", postal_code="560001", radius_km=30)
        db.add_all([area1, area2])

        # 4. Technicians
        t1_user = User(
            email="tech.ravi@email.com",
            password_hash=tech_pw,
            role=UserRole.TECHNICIAN,
            first_name="Ravi",
            last_name="Kumar",
            phone="9876510001",
            is_active=True,
            is_verified=True,
        )
        db.add(t1_user)
        db.flush()

        t1 = Technician(
            user_id=t1_user.id,
            provider_id=p1.id,
            specialization="Home Cleaning",
            experience_years=5,
            is_available=True,
        )
        db.add(t1)
        db.flush()

        # 5. Categories & Services
        cat_clean = ServiceCategory(name="Home Cleaning", slug="home-cleaning", description="Deep cleaning, kitchen & sofa sanitization", is_active=True)
        cat_repair = ServiceCategory(name="Repairs & Plumbing", slug="repairs-plumbing", description="Plumbing, leak repairs and pipe fitting", is_active=True)
        cat_elec = ServiceCategory(name="Electrical Services", slug="electrical-services", description="Fan, switchboard, wiring & lighting", is_active=True)
        cat_appl = ServiceCategory(name="Appliance Care", slug="appliance-care", description="AC servicing, washing machine & refrigerator repair", is_active=True)
        db.add_all([cat_clean, cat_repair, cat_elec, cat_appl])
        db.flush()

        s1 = Service(category_id=cat_clean.id, name="Full Home Deep Cleaning", slug="full-home-deep-cleaning", description="Exhaustive scrubbing, sanitizing and floor polishing.", base_price=Decimal("1499.00"), duration_minutes=180, is_active=True)
        s2 = Service(category_id=cat_clean.id, name="Bathroom Sanitization", slug="bathroom-sanitization", description="Tile stain removal, faucet polishing and germ protection.", base_price=Decimal("499.00"), duration_minutes=60, is_active=True)
        s3 = Service(category_id=cat_repair.id, name="Plumbing Inspection & Leak Fix", slug="plumbing-inspection", description="Expert diagnosis of pipe leakage, taps, and drainage.", base_price=Decimal("299.00"), duration_minutes=45, is_active=True)
        s4 = Service(category_id=cat_elec.id, name="Switchboard & Wiring Repair", slug="switchboard-wiring-repair", description="Safe repair of burnt sockets, short circuits and wiring.", base_price=Decimal("199.00"), duration_minutes=30, is_active=True)
        s5 = Service(category_id=cat_appl.id, name="Split AC Comprehensive Service", slug="split-ac-service", description="Deep foam jet cleaning of filters, coils, and gas check.", base_price=Decimal("699.00"), duration_minutes=60, is_active=True)
        db.add_all([s1, s2, s3, s4, s5])
        db.flush()

        # 6. Coupons
        cpn1 = Coupon(code="WELCOME50", description="50% off first booking", discount_type=CouponDiscountType.PERCENTAGE, discount_value=Decimal("50.00"), max_discount=Decimal("150.00"), min_order_amount=Decimal("300.00"), valid_from=datetime.now(), valid_until=datetime(2027, 1, 1), is_active=True)
        cpn2 = Coupon(code="HOMESERVE100", description="Flat Rs 100 off", discount_type=CouponDiscountType.FIXED, discount_value=Decimal("100.00"), max_discount=Decimal("100.00"), min_order_amount=Decimal("500.00"), valid_from=datetime.now(), valid_until=datetime(2027, 1, 1), is_active=True)
        db.add_all([cpn1, cpn2])
        db.flush()

        # 7. Sample Bookings
        b1 = Booking(
            booking_uid="HS-202611-001",
            customer_id=c1.id,
            provider_id=p1.id,
            service_id=s1.id,
            address_id=addr1.id,
            scheduled_date=date(2026, 11, 10),
            scheduled_time=time(10, 0),
            status=BookingStatus.CONFIRMED,
            total_amount=Decimal("1499.00"),
            tax_amount=Decimal("269.82"),
            final_amount=Decimal("1768.82"),
        )
        b2 = Booking(
            booking_uid="HS-202611-002",
            customer_id=c1.id,
            provider_id=p2.id,
            service_id=s3.id,
            address_id=addr1.id,
            scheduled_date=date(2026, 11, 12),
            scheduled_time=time(14, 30),
            status=BookingStatus.COMPLETED,
            total_amount=Decimal("299.00"),
            tax_amount=Decimal("53.82"),
            final_amount=Decimal("352.82"),
        )
        db.add_all([b1, b2])
        db.flush()

        # 8. Sample Payment & Review
        pmt = Payment(
            booking_id=b2.id,
            payment_uid="PAY-202611-001",
            amount=Decimal("352.82"),
            payment_method="UPI",
            status=PaymentStatus.PAID,
        )
        rev = Review(
            booking_id=b2.id,
            customer_id=c1.id,
            provider_id=p2.id,
            rating=5,
            comment="Technician arrived on time and fixed the stubborn tap leak cleanly! Highly recommended.",
            response="Thank you for trusting FixItAll Solutions, Rahul! Always happy to help.",
        )
        db.add_all([pmt, rev])

        db.commit()
        print("Automated platform seed completed successfully.")
    except Exception as e:
        print(f"Auto-seed exception: {e}")
        db.rollback()

