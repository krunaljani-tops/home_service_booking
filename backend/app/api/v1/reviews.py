from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.models.booking import Booking, BookingStatus
from app.models.customer import Customer
from app.models.review import Review
from app.models.service_provider import ServiceProvider
from app.models.user import User, UserRole
from app.schemas.review import ReviewCreate, ReviewReplyRequest, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews & Ratings"])


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a rating and review for a completed service booking."""
    booking = db.query(Booking).filter(Booking.id == review_data.booking_id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer or booking.customer_id != customer.id:
        raise ForbiddenException("You can only review bookings you have created")

    if booking.status != BookingStatus.COMPLETED:
        raise BadRequestException("You can only submit reviews for completed bookings")

    existing_review = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing_review:
        raise BadRequestException("You have already reviewed this booking")

    new_review = Review(
        booking_id=booking.id,
        customer_id=customer.id,
        provider_id=booking.provider_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )
    db.add(new_review)
    db.flush()

    # Recalculate provider average rating & review count
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == booking.provider_id).first()
    if provider:
        avg_rating = (
            db.query(func.avg(Review.rating))
            .filter(Review.provider_id == provider.id)
            .scalar()
        )
        count_reviews = (
            db.query(Review).filter(Review.provider_id == provider.id).count()
        )
        provider.rating_avg = Decimal(str(round(avg_rating or 0, 2)))
        provider.total_reviews = count_reviews

    db.commit()
    db.refresh(new_review)
    return ReviewResponse.model_validate(new_review)


@router.get("", response_model=List[ReviewResponse])
def list_reviews(
    provider_id: Optional[int] = None,
    rating: Optional[int] = Query(None, ge=1, le=5),
    db: Session = Depends(get_db),
):
    """Filter reviews by provider or star rating."""
    query = db.query(Review)
    if provider_id:
        query = query.filter(Review.provider_id == provider_id)
    if rating:
        query = query.filter(Review.rating == rating)

    reviews = query.order_by(Review.created_at.desc()).all()
    return [ReviewResponse.model_validate(r) for r in reviews]


@router.get("/{id}", response_model=ReviewResponse)
def get_review(id: int, db: Session = Depends(get_db)):
    """Retrieve review details by ID."""
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise NotFoundException("Review not found")
    return ReviewResponse.model_validate(review)


@router.put("/{id}/respond", response_model=ReviewResponse)
def respond_to_review(
    id: int,
    reply: ReviewReplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Provider response to customer feedback."""
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise NotFoundException("Review not found")

    provider = review.provider
    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("Unauthorized to respond to reviews for this provider")

    review.response = reply.response
    db.commit()
    db.refresh(review)
    return ReviewResponse.model_validate(review)
