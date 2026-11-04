import csv
import io
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.booking import Booking, BookingStatus
from app.models.complaint import Complaint, ComplaintStatus
from app.models.customer import Customer
from app.models.payment import Payment, PaymentStatus
from app.models.provider_earning import ProviderEarning
from app.models.review import Review
from app.models.service_provider import ServiceProvider, VerificationStatus
from app.models.technician import Technician
from app.models.user import User, UserRole


class ReportService:
    """Service to aggregate analytics, generate revenue statistics, and export CSV reports."""

    @staticmethod
    def get_dashboard_stats(db: Session) -> Dict[str, Any]:
        """Aggregate high-level KPIs across the platform for Super Admin dashboard."""
        total_users = db.query(User).count()
        total_customers = db.query(Customer).count()
        total_providers = db.query(ServiceProvider).count()
        pending_providers = (
            db.query(ServiceProvider)
            .filter(ServiceProvider.verification_status == VerificationStatus.PENDING)
            .count()
        )
        total_technicians = db.query(Technician).count()

        # Bookings stats
        total_bookings = db.query(Booking).count()
        completed_bookings = (
            db.query(Booking).filter(Booking.status == BookingStatus.COMPLETED).count()
        )
        cancelled_bookings = (
            db.query(Booking).filter(Booking.status == BookingStatus.CANCELLED).count()
        )
        in_progress_bookings = (
            db.query(Booking).filter(Booking.status == BookingStatus.IN_PROGRESS).count()
        )

        # Revenue and commission stats
        revenue_sum = (
            db.query(func.coalesce(func.sum(Payment.amount), Decimal("0.00")))
            .filter(Payment.status == PaymentStatus.PAID)
            .scalar()
        )
        commission_sum = (
            db.query(func.coalesce(func.sum(ProviderEarning.commission_amount), Decimal("0.00")))
            .scalar()
        )
        provider_payouts_sum = (
            db.query(func.coalesce(func.sum(ProviderEarning.earning_amount), Decimal("0.00")))
            .scalar()
        )

        # Complaints and reviews
        open_complaints = (
            db.query(Complaint)
            .filter(Complaint.status.in_([ComplaintStatus.OPEN, ComplaintStatus.IN_PROGRESS]))
            .count()
        )
        avg_rating = db.query(func.coalesce(func.avg(Review.rating), 0.0)).scalar()

        return {
            "users": {
                "total": total_users,
                "customers": total_customers,
                "providers": total_providers,
                "pending_providers": pending_providers,
                "technicians": total_technicians,
            },
            "bookings": {
                "total": total_bookings,
                "completed": completed_bookings,
                "cancelled": cancelled_bookings,
                "in_progress": in_progress_bookings,
            },
            "financials": {
                "total_revenue": float(revenue_sum or 0),
                "platform_commission": float(commission_sum or 0),
                "provider_earnings": float(provider_payouts_sum or 0),
            },
            "customer_satisfaction": {
                "open_complaints": open_complaints,
                "average_rating": round(float(avg_rating or 0), 2),
            },
        }

    @staticmethod
    def get_booking_reports(
        db: Session,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        status: Optional[BookingStatus] = None,
    ) -> List[Dict[str, Any]]:
        """Filter bookings for reporting."""
        query = db.query(Booking)
        if start_date:
            query = query.filter(Booking.scheduled_date >= start_date)
        if end_date:
            query = query.filter(Booking.scheduled_date <= end_date)
        if status:
            query = query.filter(Booking.status == status)

        bookings = query.order_by(Booking.created_at.desc()).all()
        return [
            {
                "id": b.id,
                "uid": b.booking_uid,
                "customer_id": b.customer_id,
                "provider_id": b.provider_id,
                "service_id": b.service_id,
                "status": b.status.value,
                "scheduled_date": str(b.scheduled_date),
                "scheduled_time": str(b.scheduled_time),
                "total_amount": float(b.total_amount),
                "final_amount": float(b.final_amount),
                "created_at": str(b.created_at),
            }
            for b in bookings
        ]

    @staticmethod
    def get_revenue_reports(
        db: Session,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> Dict[str, Any]:
        """Aggregate revenue by date ranges and payments."""
        query = db.query(Payment).filter(Payment.status == PaymentStatus.PAID)
        if start_date:
            query = query.filter(Payment.paid_at >= datetime.combine(start_date, datetime.min.time()))
        if end_date:
            query = query.filter(Payment.paid_at <= datetime.combine(end_date, datetime.max.time()))

        payments = query.all()
        total_revenue = sum(p.amount for p in payments)

        return {
            "total_transactions": len(payments),
            "total_revenue": float(total_revenue),
            "transactions": [
                {
                    "payment_uid": p.payment_uid,
                    "booking_id": p.booking_id,
                    "amount": float(p.amount),
                    "currency": p.currency,
                    "paid_at": str(p.paid_at) if p.paid_at else None,
                }
                for p in payments
            ],
        }

    @staticmethod
    def export_csv(db: Session, report_type: str = "bookings") -> str:
        """Export dataset as CSV formatted string."""
        output = io.StringIO()
        writer = csv.writer(output)

        if report_type == "bookings":
            writer.writerow([
                "Booking UID",
                "Customer ID",
                "Provider ID",
                "Scheduled Date",
                "Status",
                "Total Amount",
                "Final Amount",
                "Created At",
            ])
            bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
            for b in bookings:
                writer.writerow([
                    b.booking_uid,
                    b.customer_id,
                    b.provider_id,
                    b.scheduled_date,
                    b.status.value,
                    b.total_amount,
                    b.final_amount,
                    b.created_at,
                ])

        elif report_type == "revenue":
            writer.writerow(["Payment UID", "Booking ID", "Amount", "Status", "Paid At"])
            payments = db.query(Payment).filter(Payment.status == PaymentStatus.PAID).all()
            for p in payments:
                writer.writerow([
                    p.payment_uid,
                    p.booking_id,
                    p.amount,
                    p.status.value,
                    p.paid_at,
                ])

        elif report_type == "providers":
            writer.writerow([
                "Provider ID",
                "Company Name",
                "Verification Status",
                "Rating Avg",
                "Total Reviews",
                "Commission Rate",
            ])
            providers = db.query(ServiceProvider).all()
            for p in providers:
                writer.writerow([
                    p.id,
                    p.company_name,
                    p.verification_status.value,
                    p.rating_avg,
                    p.total_reviews,
                    p.commission_rate,
                ])

        return output.getvalue()


report_service = ReportService()
