from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.notification import Notification


class NotificationService:
    """Service to handle platform notifications."""

    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str = "system",
        data: Optional[Dict[str, Any]] = None,
    ) -> Notification:
        """Create a new notification for a specific user."""
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            data=data,
            is_read=False,
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[Notification], int, int]:
        """Fetch paginated notifications along with unread count."""
        query = db.query(Notification).filter(Notification.user_id == user_id)
        total = query.count()
        unread_count = query.filter(Notification.is_read.is_(False)).count()
        items = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
        return items, total, unread_count

    @staticmethod
    def mark_as_read(db: Session, user_id: int, notification_id: int) -> Notification:
        """Mark a single notification as read."""
        notification = (
            db.query(Notification)
            .filter(Notification.id == notification_id, Notification.user_id == user_id)
            .first()
        )
        if not notification:
            raise NotFoundException("Notification not found")
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> int:
        """Mark all unread notifications for a user as read."""
        updated = (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read.is_(False))
            .update({Notification.is_read: True})
        )
        db.commit()
        return updated


notification_service = NotificationService()
