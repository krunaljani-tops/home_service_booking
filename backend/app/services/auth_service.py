from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.core.exceptions import BadRequestException, ConflictException, UnauthorizedException
from app.core.security import create_access_token, hash_password, verify_password
from app.models.customer import Customer
from app.models.service_provider import ServiceProvider, VerificationStatus
from app.models.technician import Technician
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest
from app.schemas.user import UserUpdate


class AuthService:
    """Service handling user registration, authentication, and credential management."""

    @staticmethod
    def register_user(db: Session, request: RegisterRequest) -> Tuple[User, str]:
        """Register a new user and create their respective role profile."""
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise ConflictException(f"User with email '{request.email}' already exists")

        # Create user
        new_user = User(
            email=request.email,
            password_hash=hash_password(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
            phone=request.phone,
            role=request.role,
            is_active=True,
            is_verified=False,
        )
        db.add(new_user)
        db.flush()  # To populate new_user.id

        # Create specific role profile
        if request.role == UserRole.CUSTOMER:
            customer = Customer(user_id=new_user.id)
            db.add(customer)
        elif request.role == UserRole.SERVICE_PROVIDER:
            company_name = request.company_name or f"{new_user.full_name}'s Services"
            provider = ServiceProvider(
                user_id=new_user.id,
                company_name=company_name,
                verification_status=VerificationStatus.PENDING,
            )
            db.add(provider)
        elif request.role == UserRole.TECHNICIAN:
            # Standalone technician or will be attached to provider later
            # Default placeholder provider if none specified
            provider = db.query(ServiceProvider).first()
            if provider:
                technician = Technician(
                    user_id=new_user.id,
                    provider_id=provider.id,
                    specialization=request.specialization,
                )
                db.add(technician)

        db.commit()
        db.refresh(new_user)

        token = create_access_token(
            subject=new_user.id,
            role=new_user.role.value if hasattr(new_user.role, "value") else str(new_user.role),
            extra_claims={"email": new_user.email},
        )
        return new_user, token

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Tuple[User, str]:
        """Authenticate user by email and password, returning user and JWT token."""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise UnauthorizedException("Incorrect email or password")

        if not user.is_active:
            raise UnauthorizedException("Account has been deactivated. Please contact support.")

        token = create_access_token(
            subject=user.id,
            role=user.role.value if hasattr(user.role, "value") else str(user.role),
            extra_claims={"email": user.email},
        )
        return user, token

    @staticmethod
    def change_password(
        db: Session, user: User, current_password: str, new_password: str
    ) -> None:
        """Change password after validating current password."""
        if not verify_password(current_password, user.password_hash):
            raise BadRequestException("Current password provided is incorrect")

        if len(new_password) < 6:
            raise BadRequestException("New password must be at least 6 characters")

        user.password_hash = hash_password(new_password)
        db.commit()

    @staticmethod
    def update_profile(db: Session, user: User, update_data: UserUpdate) -> User:
        """Update basic profile details."""
        data = update_data.model_dump(exclude_unset=True)
        if "email" in data and data["email"] != user.email:
            existing = db.query(User).filter(User.email == data["email"]).first()
            if existing:
                raise ConflictException("Email is already taken by another account")

        for key, value in data.items():
            setattr(user, key, value)

        db.commit()
        db.refresh(user)
        return user


auth_service = AuthService()
