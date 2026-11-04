from datetime import date
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, role_required
from app.models.booking import BookingStatus
from app.models.customer import Customer
from app.models.service_provider import ServiceProvider
from app.schemas.customer import CustomerResponse
from app.schemas.service_provider import ProviderResponse
from app.services.report_service import report_service

router = APIRouter(
    prefix="/reports",
    tags=["Analytics & Reports"],
    dependencies=[Depends(role_required("SUPER_ADMIN"))],
)


@router.get("/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Retrieve system overview metrics for super admin dashboard."""
    return report_service.get_dashboard_stats(db)


@router.get("/bookings")
def get_booking_analytics(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[BookingStatus] = None,
    db: Session = Depends(get_db),
):
    """Retrieve filtered booking records for analytical inspection."""
    return report_service.get_booking_reports(db, start_date, end_date, status)


@router.get("/revenue")
def get_revenue_analytics(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """Retrieve revenue and financial transactions breakdown."""
    return report_service.get_revenue_reports(db, start_date, end_date)


@router.get("/providers", response_model=List[ProviderResponse])
def get_providers_report(db: Session = Depends(get_db)):
    """Retrieve provider operational performance report."""
    providers = db.query(ServiceProvider).all()
    return [ProviderResponse.model_validate(p) for p in providers]


@router.get("/customers", response_model=List[CustomerResponse])
def get_customers_report(db: Session = Depends(get_db)):
    """Retrieve customer acquisition and activity report."""
    customers = db.query(Customer).all()
    return [CustomerResponse.model_validate(c) for c in customers]


@router.get("/export/csv")
def export_csv_report(
    report_type: str = Query("bookings", pattern="^(bookings|revenue|providers)$"),
    db: Session = Depends(get_db),
):
    """Export tabular analytical reports in standard CSV format."""
    csv_data = report_service.export_csv(db, report_type)
    filename = f"{report_type}_report_{date.today().isoformat()}.csv"
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
