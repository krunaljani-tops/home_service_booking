from datetime import date, datetime, time, timedelta
from decimal import Decimal
import random
import string
from typing import List, Optional, Tuple
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session
from app.core.exceptions import BadRequestException, ConflictException, NotFoundException
from app.models.address import Address
from app.models.booking import Booking, BookingStatus
from app.models.booking_assignment import AssignmentStatus, BookingAssignment
from app.models.coupon import Coupon, CouponDiscountType
from app.models.provider_earning import EarningStatus, ProviderEarning
from app.models.provider_service import ProviderService
from app.models.service import Service
from app.models.service_provider import ServiceProvider
from app.models.technician import Technician
from app.schemas.booking import BookingCreate, BookingUpdate


class BookingService:
    """Business logic for booking lifecycles, schedule validation, conflict prevention, and assignments."""

    @staticmethod
    def calculate_pricing(
        base_price: Decimal,
        coupon_type: Optional[str] = None,
        coupon_value: Optional[Decimal] = None,
        max_discount: Optional[Decimal] = None,
        tax_rate: Decimal = Decimal("18.00"),
    ) -> dict:
        """Calculate total, discount, tax, and final amount."""
        total_amount = Decimal(str(base_price))
        discount_amount = Decimal("0.00")

        if coupon_type and coupon_value:
            if coupon_type == "PERCENTAGE":
                calculated_discount = (total_amount * coupon_value) / Decimal("100")
                if max_discount:
                    calculated_discount = min(calculated_discount, max_discount)
                discount_amount = calculated_discount
            elif coupon_type == "FIXED":
                discount_amount = min(coupon_value, total_amount)

        taxable_amount = max(Decimal("0.00"), total_amount - discount_amount)
        tax_amount = round((taxable_amount * (tax_rate / Decimal("100"))), 2)
        final_amount = taxable_amount + tax_amount

        return {
            "total_amount": total_amount,
            "discount_amount": discount_amount,
            "taxable_amount": taxable_amount,
            "tax_amount": tax_amount,
            "final_amount": final_amount,
        }

    @staticmethod
    def generate_booking_uid() -> str:
        """Generate human-readable unique booking identifier, e.g. HS-20261104-A1B2."""
        today_str = datetime.now().strftime("%Y%m%d")
        rand_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"HS-{today_str}-{rand_suffix}"

    @classmethod
    def check_schedule_conflict(
        cls,
        db: Session,
        provider_id: int,
        scheduled_date: date,
        scheduled_time: time,
        duration_minutes: int,
        exclude_booking_id: Optional[int] = None,
    ) -> None:
        """Verify that provider does not already have an overlapping active booking."""
        # Calculate start and end datetime
        booking_start = datetime.combine(scheduled_date, scheduled_time)
        booking_end = booking_start + timedelta(minutes=duration_minutes)

        # Query all active bookings for this provider on the requested date
        active_statuses = [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.PROVIDER_ASSIGNED,
            BookingStatus.IN_PROGRESS,
        ]

        query = db.query(Booking).filter(
            Booking.provider_id == provider_id,
            Booking.scheduled_date == scheduled_date,
            Booking.status.in_(active_statuses),
        )

        if exclude_booking_id:
            query = query.filter(Booking.id != exclude_booking_id)

        existing_bookings = query.all()

        for b in existing_bookings:
            existing_start = datetime.combine(b.scheduled_date, b.scheduled_time)
            existing_end = existing_start + timedelta(minutes=b.duration_minutes)

            # Check overlap: (StartA < EndB) and (EndA > StartB)
            if booking_start < existing_end and booking_end > existing_start:
                raise ConflictException(
                    f"Schedule conflict: Provider already has a booking between {b.scheduled_time} and {existing_end.time()}"
                )

    @classmethod
    def check_technician_conflict(
        cls,
        db: Session,
        technician_id: int,
        scheduled_date: date,
        scheduled_time: time,
        duration_minutes: int,
        exclude_booking_id: Optional[int] = None,
    ) -> None:
        """Verify technician does not have overlapping booking assignment."""
        booking_start = datetime.combine(scheduled_date, scheduled_time)
        booking_end = booking_start + timedelta(minutes=duration_minutes)

        active_statuses = [
            AssignmentStatus.ASSIGNED,
            AssignmentStatus.ACCEPTED,
            AssignmentStatus.EN_ROUTE,
            AssignmentStatus.ARRIVED,
            AssignmentStatus.IN_PROGRESS,
        ]

        query = (
            db.query(BookingAssignment)
            .join(Booking, BookingAssignment.booking_id == Booking.id)
            .filter(
                BookingAssignment.technician_id == technician_id,
                Booking.scheduled_date == scheduled_date,
                BookingAssignment.status.in_(active_statuses),
            )
        )

        if exclude_booking_id:
            query = query.filter(Booking.id != exclude_booking_id)

        assignments = query.all()

        for assign in assignments:
            b = assign.booking
            existing_start = datetime.combine(b.scheduled_date, b.scheduled_time)
            existing_end = existing_start + timedelta(minutes=b.duration_minutes)

            if booking_start < existing_end and booking_end > existing_start:
                raise ConflictException(
                    f"Schedule conflict: Technician already assigned to booking {b.booking_uid} between {b.scheduled_time} and {existing_end.time()}"
                )

    @classmethod
    def create_booking(
        cls,
        db: Session,
        customer_id: int,
        booking_data: BookingCreate,
    ) -> Booking:
        """Create a new service booking with validation and pricing calculation."""
        # 1. Verify provider exists
        provider = db.query(ServiceProvider).filter(ServiceProvider.id == booking_data.provider_id).first()
        if not provider:
            raise NotFoundException("Service provider not found")

        # 2. Verify service exists
        service = db.query(Service).filter(Service.id == booking_data.service_id, Service.is_active.is_(True)).first()
        if not service:
            raise NotFoundException("Service not found or is currently inactive")

        # 3. Verify address belongs to customer
        address = db.query(Address).filter(Address.id == booking_data.address_id, Address.customer_id == customer_id).first()
        if not address:
            raise NotFoundException("Service address not found for this customer")

        # 4. Check for double booking conflict
        duration = booking_data.duration_minutes or service.duration_minutes or 60
        cls.check_schedule_conflict(
            db=db,
            provider_id=provider.id,
            scheduled_date=booking_data.scheduled_date,
            scheduled_time=booking_data.scheduled_time,
            duration_minutes=duration,
        )

        # 5. Price calculation: check provider custom price
        provider_svc = (
            db.query(ProviderService)
            .filter(
                ProviderService.provider_id == provider.id,
                ProviderService.service_id == service.id,
                ProviderService.is_available.is_(True),
            )
            .first()
        )
        base_price = (
            provider_svc.custom_price
            if (provider_svc and provider_svc.custom_price is not None)
            else service.base_price
        )
        total_amount = Decimal(str(base_price))

        # 6. Apply coupon discount if provided
        discount_amount = Decimal("0.00")
        applied_coupon_id: Optional[int] = None

        if booking_data.coupon_code:
            now = datetime.now()
            coupon = (
                db.query(Coupon)
                .filter(
                    Coupon.code == booking_data.coupon_code.strip().upper(),
                    Coupon.is_active.is_(True),
                    Coupon.valid_from <= now,
                    Coupon.valid_until >= now,
                )
                .first()
            )
            if not coupon:
                raise BadRequestException("Invalid or expired coupon code")

            if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
                raise BadRequestException("Coupon usage limit has been reached")

            if total_amount < coupon.min_order_amount:
                raise BadRequestException(f"Minimum order amount for this coupon is ₹{coupon.min_order_amount}")

            if coupon.discount_type == CouponDiscountType.PERCENTAGE:
                calculated_discount = (total_amount * coupon.discount_value) / Decimal("100")
                if coupon.max_discount:
                    calculated_discount = min(calculated_discount, coupon.max_discount)
                discount_amount = calculated_discount
            else:
                discount_amount = min(coupon.discount_value, total_amount)

            coupon.used_count += 1
            applied_coupon_id = coupon.id

        # 7. Calculate 18% standard GST tax
        taxable_amount = max(Decimal("0.00"), total_amount - discount_amount)
        tax_amount = round((taxable_amount * Decimal("0.18")), 2)
        final_amount = taxable_amount + tax_amount

        # 8. Create booking record
        new_booking = Booking(
            booking_uid=cls.generate_booking_uid(),
            customer_id=customer_id,
            provider_id=provider.id,
            service_id=service.id,
            address_id=address.id,
            scheduled_date=booking_data.scheduled_date,
            scheduled_time=booking_data.scheduled_time,
            duration_minutes=duration,
            status=BookingStatus.PENDING,
            description=booking_data.description,
            total_amount=total_amount,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            final_amount=final_amount,
            coupon_id=applied_coupon_id,
        )

        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        return new_booking

    @classmethod
    def assign_technician(
        cls,
        db: Session,
        booking_id: int,
        provider_id: int,
        technician_id: int,
        remarks: Optional[str] = None,
    ) -> BookingAssignment:
        """Assign an available technician from the provider's pool to the booking."""
        booking = db.query(Booking).filter(Booking.id == booking_id, Booking.provider_id == provider_id).first()
        if not booking:
            raise NotFoundException("Booking not found for this provider")

        if booking.status in [BookingStatus.CANCELLED, BookingStatus.REJECTED, BookingStatus.COMPLETED]:
            raise BadRequestException(f"Cannot assign technician to booking with status '{booking.status.value}'")

        technician = (
            db.query(Technician)
            .filter(Technician.id == technician_id, Technician.provider_id == provider_id)
            .first()
        )
        if not technician:
            raise NotFoundException("Technician not found or does not belong to your company")

        if not technician.is_available:
            raise BadRequestException("Technician is currently marked unavailable")

        # Conflict check for technician schedule
        cls.check_technician_conflict(
            db=db,
            technician_id=technician.id,
            scheduled_date=booking.scheduled_date,
            scheduled_time=booking.scheduled_time,
            duration_minutes=booking.duration_minutes,
            exclude_booking_id=booking.id,
        )

        assignment = db.query(BookingAssignment).filter(BookingAssignment.booking_id == booking.id).first()
        if assignment:
            assignment.technician_id = technician.id
            assignment.remarks = remarks
            assignment.status = AssignmentStatus.ASSIGNED
        else:
            assignment = BookingAssignment(
                booking_id=booking.id,
                technician_id=technician.id,
                status=AssignmentStatus.ASSIGNED,
                remarks=remarks,
            )
            db.add(assignment)

        booking.status = BookingStatus.PROVIDER_ASSIGNED
        db.commit()
        db.refresh(assignment)
        return assignment

    @classmethod
    def update_status(
        cls,
        db: Session,
        booking: Booking,
        new_status: BookingStatus,
        cancellation_reason: Optional[str] = None,
        cancelled_by: Optional[str] = None,
    ) -> Booking:
        """Transition booking status and trigger completion financials if applicable."""
        booking.status = new_status
        if cancellation_reason:
            booking.cancellation_reason = cancellation_reason
        if cancelled_by:
            booking.cancelled_by = cancelled_by

        # If status moved to COMPLETED, create provider earning record if not already created
        if new_status == BookingStatus.COMPLETED:
            existing_earning = db.query(ProviderEarning).filter(ProviderEarning.booking_id == booking.id).first()
            if not existing_earning:
                provider = db.query(ServiceProvider).filter(ServiceProvider.id == booking.provider_id).first()
                commission_pct = provider.commission_rate if provider else Decimal("15.00")
                total = booking.total_amount
                commission_amt = round((total * (commission_pct / Decimal("100"))), 2)
                earning_amt = total - commission_amt

                earning = ProviderEarning(
                    provider_id=booking.provider_id,
                    booking_id=booking.id,
                    total_amount=total,
                    commission_amount=commission_amt,
                    earning_amount=earning_amt,
                    status=EarningStatus.PENDING,
                )
                db.add(earning)

        db.commit()
        db.refresh(booking)
        return booking


booking_service = BookingService()
