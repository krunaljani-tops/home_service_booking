from typing import List
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.user import User, UserRole
from app.schemas.payment import InvoiceResponse

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get("", response_model=List[InvoiceResponse])
def list_invoices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve billing invoices for customer or platform."""
    query = db.query(Invoice)

    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer:
            return []
        query = query.filter(Invoice.customer_id == customer.id)

    invoices = query.order_by(Invoice.issued_at.desc()).all()
    return [InvoiceResponse.model_validate(inv) for inv in invoices]


@router.get("/{id}", response_model=InvoiceResponse)
def get_invoice(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve invoice details by ID."""
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise NotFoundException("Invoice not found")

    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer or invoice.customer_id != customer.id:
            raise ForbiddenException("Unauthorized to view this invoice")

    return InvoiceResponse.model_validate(invoice)


@router.get("/{id}/download")
def download_invoice(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate printable invoice representation (HTML/Text)."""
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise NotFoundException("Invoice not found")

    content = f"""
    =======================================================
                    HOMESERVE TECHNOLOGIES
                        TAX INVOICE
    =======================================================
    Invoice Number : {invoice.invoice_number}
    Date           : {invoice.issued_at.strftime('%Y-%m-%d %H:%M:%S')}
    Booking ID     : {invoice.booking_id}
    Customer ID    : {invoice.customer_id}
    -------------------------------------------------------
    Subtotal       : INR {invoice.subtotal:.2f}
    Discount       : INR {invoice.discount:.2f}
    GST (18%)      : INR {invoice.tax:.2f}
    -------------------------------------------------------
    TOTAL PAID     : INR {invoice.total:.2f}
    =======================================================
    Thank you for choosing HomeServe Technologies!
    """
    return Response(content=content, media_type="text/plain")
