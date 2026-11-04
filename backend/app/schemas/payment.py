from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.payment import PaymentStatus


class CreateOrderRequest(BaseModel):
    booking_id: int


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: Decimal
    currency: str
    key_id: str
    booking_id: int


class PaymentVerify(BaseModel):
    booking_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentCreate(BaseModel):
    booking_id: int
    amount: Decimal
    currency: str = "INR"
    payment_method: Optional[str] = None


class RefundRequest(BaseModel):
    refund_amount: Optional[Decimal] = None
    refund_reason: str


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    payment_id: int
    booking_id: int
    customer_id: int
    subtotal: Decimal
    discount: Decimal
    tax: Decimal
    total: Decimal
    issued_at: datetime
    pdf_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    payment_uid: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    amount: Decimal
    currency: str
    status: PaymentStatus
    payment_method: Optional[str] = None
    paid_at: Optional[datetime] = None
    refund_amount: Optional[Decimal] = None
    refund_reason: Optional[str] = None
    refunded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    invoice: Optional[InvoiceResponse] = None

    model_config = ConfigDict(from_attributes=True)
