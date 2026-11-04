from typing import Any, Generator, List, Optional
from fastapi import Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.database.session import get_db

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Any:
    """Validate JWT token and return the authenticated user."""
    if not credentials or not credentials.credentials:
        raise UnauthorizedException("Authentication credentials were not provided")

    token = credentials.credentials
    try:
        payload = decode_access_token(token)
    except Exception:
        raise UnauthorizedException("Invalid or expired authentication token")
    if payload is None:
        raise UnauthorizedException("Invalid or expired authentication token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Token payload missing user identification")

    # Local import to prevent circular dependencies
    from app.models.user import User

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise UnauthorizedException("User associated with token not found")

    if not user.is_active:
        raise ForbiddenException("User account is deactivated")

    return user


def get_current_active_user(
    current_user: Any = Depends(get_current_user),
) -> Any:
    """Verify that current authenticated user is active."""
    if not current_user.is_active:
        raise ForbiddenException("User account is inactive")
    return current_user


class RoleChecker:
    """RBAC dependency to enforce permitted user roles."""

    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: Any = Depends(get_current_user)) -> Any:
        # SUPER_ADMIN has access across all privileged role checks
        role_str = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
        if "SUPER_ADMIN" not in self.allowed_roles and role_str == "SUPER_ADMIN":
            return current_user

        if role_str not in self.allowed_roles:
            raise ForbiddenException(
                f"Role '{role_str}' is not authorized to perform this operation. Allowed: {self.allowed_roles}"
            )
        return current_user


def role_required(*allowed_roles: str):
    """Factory function for role-based route protection."""
    return RoleChecker(list(allowed_roles))
