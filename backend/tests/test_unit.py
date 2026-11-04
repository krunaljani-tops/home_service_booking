import pytest
from decimal import Decimal
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.services.booking_service import booking_service


def test_password_hashing():
    raw = "SecureSecret@2026"
    hashed = hash_password(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_creation_and_decoding():
    token = create_access_token(
        subject="123",
        role="CUSTOMER",
        extra_claims={"email": "test@homeserve.com"},
    )
    decoded = decode_access_token(token)
    assert decoded["sub"] == "123"
    assert decoded["email"] == "test@homeserve.com"
    assert decoded["role"] == "CUSTOMER"
    assert "exp" in decoded


def test_calculate_pricing():
    # Base: 1000, 10% coupon, 18% tax
    calc = booking_service.calculate_pricing(
        base_price=Decimal("1000.00"),
        coupon_type="PERCENTAGE",
        coupon_value=Decimal("10.00"),
        max_discount=Decimal("200.00"),
        tax_rate=Decimal("18.00"),
    )
    assert calc["total_amount"] == Decimal("1000.00")
    assert calc["discount_amount"] == Decimal("100.00")
    # taxable: 900 -> tax: 162.00
    assert calc["tax_amount"] == Decimal("162.00")
    assert calc["final_amount"] == Decimal("1062.00")


def test_calculate_pricing_fixed_coupon():
    calc = booking_service.calculate_pricing(
        base_price=Decimal("500.00"),
        coupon_type="FIXED",
        coupon_value=Decimal("150.00"),
        tax_rate=Decimal("18.00"),
    )
    assert calc["discount_amount"] == Decimal("150.00")
    # taxable: 350 -> tax: 63.00
    assert calc["tax_amount"] == Decimal("63.00")
    assert calc["final_amount"] == Decimal("413.00")


def test_booking_uid_format():
    uid = booking_service.generate_booking_uid()
    assert uid.startswith("HS-")
    assert len(uid) >= 12
