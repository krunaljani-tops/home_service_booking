import math
from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db, role_required
from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.models.booking import Booking, BookingStatus
from app.models.booking_assignment import BookingAssignment
from app.models.booking_image import BookingImage, BookingImageType
from app.models.customer import Customer
from app.models.service_provider import ServiceProvider
from app.models.technician import Technician
from app.models.user import User, UserRole
from app.schemas.booking import (
    BookingAssignRequest,
    BookingAssignmentResponse,
    BookingCancelRequest,
    BookingCreate,
    BookingImageCreate,
    BookingImageResponse,
    BookingListResponse,
    BookingResponse,
    BookingStatusUpdate,
)
from app.schemas.common import MessageResponse
from app.services.booking_service import booking_service
from app.services.notification_service import notification_service
from app.services.upload_service import upload_service

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new service booking (Customer only)."""
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        customer = Customer(user_id=current_user.id)
        db.add(customer)
        db.flush()

    booking = booking_service.create_booking(db, customer.id, booking_data)

    # Notify provider
    provider = booking.provider
    if provider:
        notification_service.create_notification(
            db=db,
            user_id=provider.user_id,
            title="New Booking Received",
            message=f"You received a new booking #{booking.booking_uid} scheduled for {booking.scheduled_date}.",
            notification_type="booking",
            data={"booking_id": booking.id},
        )

    return BookingResponse.model_validate(booking)


@router.get("", response_model=BookingListResponse)
def list_bookings(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[BookingStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve bookings filtered according to authenticated user role."""
    query = db.query(Booking)

    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer:
            return BookingListResponse(items=[], total=0, page=page, limit=limit, pages=0)
        query = query.filter(Booking.customer_id == customer.id)

    elif current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider:
            return BookingListResponse(items=[], total=0, page=page, limit=limit, pages=0)
        query = query.filter(Booking.provider_id == provider.id)

    elif current_user.role == UserRole.TECHNICIAN:
        technician = db.query(Technician).filter(Technician.user_id == current_user.id).first()
        if not technician:
            return BookingListResponse(items=[], total=0, page=page, limit=limit, pages=0)
        query = query.join(BookingAssignment).filter(BookingAssignment.technician_id == technician.id)

    # SUPER_ADMIN sees all

    if status:
        query = query.filter(Booking.status == status)

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit
    bookings = query.order_by(Booking.created_at.desc()).offset(offset).limit(limit).all()

    return BookingListResponse(
        items=[BookingResponse.model_validate(b) for b in bookings],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.get("/{id}", response_model=BookingResponse)
def get_booking(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve detailed booking information by ID."""
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    # Authorize role access
    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer or booking.customer_id != customer.id:
            raise ForbiddenException("Unauthorized to view this booking")
    elif current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider or booking.provider_id != provider.id:
            raise ForbiddenException("Unauthorized to view this booking")

    return BookingResponse.model_validate(booking)


@router.patch("/{id}/status", response_model=BookingResponse)
def update_booking_status(
    id: int,
    status_update: BookingStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Transition booking status (Admin or Provider)."""
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    updated = booking_service.update_status(
        db=db,
        booking=booking,
        new_status=status_update.status,
        cancellation_reason=status_update.cancellation_reason,
        cancelled_by=current_user.role.value,
    )

    # Notify customer of status change
    customer_user = booking.customer.user if booking.customer else None
    if customer_user:
        notification_service.create_notification(
            db=db,
            user_id=customer_user.id,
            title="Booking Status Updated",
            message=f"Booking #{booking.booking_uid} is now {status_update.status.value}.",
            notification_type="booking",
            data={"booking_id": booking.id, "status": status_update.status.value},
        )

    return BookingResponse.model_validate(updated)


@router.patch("/{id}/cancel", response_model=BookingResponse)
def cancel_booking(
    id: int,
    cancel_data: BookingCancelRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel booking with a reason."""
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
        raise BadRequestException(f"Cannot cancel booking with current status '{booking.status.value}'")

    updated = booking_service.update_status(
        db=db,
        booking=booking,
        new_status=BookingStatus.CANCELLED,
        cancellation_reason=cancel_data.cancellation_reason,
        cancelled_by=current_user.role.value,
    )
    return BookingResponse.model_validate(updated)


@router.post("/{id}/assign", response_model=BookingAssignmentResponse)
def assign_technician(
    id: int,
    assign_data: BookingAssignRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Assign technician to booking (Provider or Admin)."""
    provider_id: int
    if current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider:
            raise BadRequestException("User has no provider record")
        provider_id = provider.id
    else:
        booking = db.query(Booking).filter(Booking.id == id).first()
        if not booking:
            raise NotFoundException("Booking not found")
        provider_id = booking.provider_id

    assignment = booking_service.assign_technician(
        db=db,
        booking_id=id,
        provider_id=provider_id,
        technician_id=assign_data.technician_id,
        remarks=assign_data.remarks,
    )

    # Notify technician
    tech = db.query(Technician).filter(Technician.id == assign_data.technician_id).first()
    if tech and tech.user_id:
        notification_service.create_notification(
            db=db,
            user_id=tech.user_id,
            title="New Job Assignment",
            message=f"You have been assigned to booking #{assignment.booking.booking_uid}.",
            notification_type="booking",
            data={"booking_id": id},
        )

    return BookingAssignmentResponse.model_validate(assignment)


@router.post("/{id}/images", response_model=BookingImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_booking_image(
    id: int,
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    image_type: BookingImageType = Form(BookingImageType.REFERENCE),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload or attach an image (reference, before, after) to booking."""
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    final_url: str
    if file:
        final_url = await upload_service.upload_image(file, folder="homeserve/bookings")
    elif image_url:
        final_url = image_url
    else:
        raise BadRequestException("Either a file upload or an image_url must be provided")

    image = BookingImage(
        booking_id=booking.id,
        image_url=final_url,
        image_type=image_type,
        uploaded_by=current_user.id,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return BookingImageResponse.model_validate(image)


@router.get("/{id}/images", response_model=List[BookingImageResponse])
def get_booking_images(id: int, db: Session = Depends(get_db)):
    """Retrieve all images attached to a booking."""
    images = db.query(BookingImage).filter(BookingImage.booking_id == id).all()
    return [BookingImageResponse.model_validate(img) for img in images]
