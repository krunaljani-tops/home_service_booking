from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator, model_validator
from app.models.user import UserRole
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER
    # Optional fields for initial role setup
    company_name: Optional[str] = None
    specialization: Optional[str] = None

    @field_validator("role", mode="before")
    @classmethod
    def normalize_role(cls, v: Any) -> Any:
        if isinstance(v, str):
            clean = v.strip().upper()
            if clean in ("CUSTOMER", "USER"):
                return UserRole.CUSTOMER
            if clean in ("PROVIDER", "SERVICE_PROVIDER"):
                return UserRole.SERVICE_PROVIDER
            if clean in ("TECH", "TECHNICIAN"):
                return UserRole.TECHNICIAN
            if clean in ("ADMIN", "SUPER_ADMIN"):
                return UserRole.SUPER_ADMIN
        return v

    @model_validator(mode="after")
    def populate_name_parts(self) -> "RegisterRequest":
        if self.name and not self.first_name and not self.last_name:
            parts = self.name.strip().split(maxsplit=1)
            self.first_name = parts[0]
            if len(parts) > 1:
                self.last_name = parts[1]
            else:
                self.last_name = ""
        return self


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
