from datetime import datetime
from decimal import Decimal
import hmac
import hashlib
import random
import string
from typing import Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.booking import Booking, BookingStatus
from app.models.invoice import Invoice
from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import CreateOrderResponse, PaymentVerify

# Attempt to initialize Razorpay Client
has_razorpay = False
client = None
try:
    import razorpay

    if (
        settings.RAZORPAY_KEY_ID
        and settings.RAZORPAY_KEY_ID != "rzp_test_your_key"
        and settings.RAZORPAY_KEY_SECRET != "your_razorpay_secret"
    ):
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        has_razorpay = True
except Exception:
    has_razorpay = False


class PaymentService:
    """Service to handle Razorpay payment orders, signature verification, invoicing, and refunds."""

    @staticmethod
    def generate_invoice_number() -> str:
        """Generate unique invoice identifier, e.g. INV-20261104-1234."""
        today_str = datetime.now().strftime("%Y%m%d")
        rand_num = "".join(random.choices(string.digits, k=4))
        return f"INV-{today_str}-{rand_num}"

    @staticmethod
    def generate_payment_uid() -> str:
        """Generate payment UID."""
        return f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(100, 999)}"

    @classmethod
    def create_order(cls, db: Session, booking_id: int) -> CreateOrderResponse:
        """Generate an order ID for Razorpay checkout."""
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise NotFoundException("Booking not found")

        amount_paise = int(booking.final_amount * 100)
        order_id: str

        if has_razorpay and client:
            try:
                razorpay_order = client.order.create({
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": f"receipt_{booking.booking_uid}",
                    "notes": {"booking_id": booking.id, "booking_uid": booking.booking_uid},
                })
                order_id = razorpay_order["id"]
            except Exception as e:
                raise BadRequestException(f"Failed to initiate Razorpay order: {str(e)}")
        else:
            # Development/Sandbox mock order ID
            rand_str = "".join(random.choices(string.ascii_letters + string.digits, k=14))
            order_id = f"order_{rand_str}"

        # Create or update pending payment record
        payment = db.query(Payment).filter(Payment.booking_id == booking.id).first()
        if not payment:
            payment = Payment(
                booking_id=booking.id,
                payment_uid=cls.generate_payment_uid(),
                razorpay_order_id=order_id,
                amount=booking.final_amount,
                currency="INR",
                status=PaymentStatus.PENDING,
            )
            db.add(payment)
        else:
            payment.razorpay_order_id = order_id
            payment.status = PaymentStatus.PENDING

        db.commit()
        db.refresh(payment)

        return CreateOrderResponse(
            order_id=order_id,
            amount=booking.final_amount,
            currency="INR",
            key_id=settings.RAZORPAY_KEY_ID,
            booking_id=booking.id,
        )

    @classmethod
    def verify_payment(cls, db: Session, verify_data: PaymentVerify) -> Payment:
        """Verify the cryptographic payment signature and generate invoice upon confirmation."""
        booking = db.query(Booking).filter(Booking.id == verify_data.booking_id).first()
        if not booking:
            raise NotFoundException("Booking not found")

        payment = db.query(Payment).filter(Payment.booking_id == booking.id).first()
        if not payment:
            raise NotFoundException("Payment record not found for this booking")

        # Verify signature if Razorpay is configured
        if has_razorpay and client:
            try:
                client.utility.verify_payment_signature({
                    "razorpay_order_id": verify_data.razorpay_order_id,
                    "razorpay_payment_id": verify_data.razorpay_payment_id,
                    "razorpay_signature": verify_data.razorpay_signature,
                })
            except Exception:
                payment.status = PaymentStatus.FAILED
                db.commit()
                raise BadRequestException("Razorpay signature verification failed")

        now = datetime.now()
        payment.razorpay_payment_id = verify_data.razorpay_payment_id
        payment.razorpay_signature = verify_data.razorpay_signature
        payment.status = PaymentStatus.PAID
        payment.paid_at = now

        # Update booking status to CONFIRMED
        if booking.status == BookingStatus.PENDING:
            booking.status = BookingStatus.CONFIRMED

        # Generate invoice if not already generated
        existing_invoice = db.query(Invoice).filter(Invoice.payment_id == payment.id).first()
        if not existing_invoice:
            invoice = Invoice(
                invoice_number=cls.generate_invoice_number(),
                payment_id=payment.id,
                booking_id=booking.id,
                customer_id=booking.customer_id,
                subtotal=booking.total_amount,
                discount=booking.discount_amount,
                tax=booking.tax_amount,
                total=booking.final_amount,
                issued_at=now,
            )
            db.add(invoice)

        db.commit()
        db.refresh(payment)
        return payment

    @classmethod
    def process_refund(
        cls,
        db: Session,
        payment_id: int,
        refund_amount: Optional[Decimal],
        refund_reason: str,
    ) -> Payment:
        """Process a refund for a previously captured payment."""
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise NotFoundException("Payment not found")

        if payment.status != PaymentStatus.PAID:
            raise BadRequestException("Only completed payments can be refunded")

        refund_amt = refund_amount or payment.amount
        if refund_amt > payment.amount:
            raise BadRequestException("Refund amount cannot exceed paid amount")

        # In live razorpay mode, trigger refund via API
        if has_razorpay and client and payment.razorpay_payment_id:
            try:
                client.payment.refund(
                    payment.razorpay_payment_id,
                    {"amount": int(refund_amt * 100), "notes": {"reason": refund_reason}},
                )
            except Exception as e:
                raise BadRequestException(f"Razorpay refund failed: {str(e)}")

        payment.status = PaymentStatus.REFUNDED
        payment.refund_amount = refund_amt
        payment.refund_reason = refund_reason
        payment.refunded_at = datetime.now()

        # Update booking status
        booking = payment.booking
        if booking:
            booking.status = BookingStatus.CANCELLED
            booking.cancellation_reason = f"Refunded: {refund_reason}"

        db.commit()
        db.refresh(payment)
        return payment


payment_service = PaymentService()
