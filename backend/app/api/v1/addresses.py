from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.address import Address
from app.models.customer import Customer
from app.models.user import User, UserRole
from app.schemas.address import AddressCreate, AddressResponse, AddressUpdate
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/addresses", tags=["Addresses"])


@router.post("", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
def create_address(
    address_data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new delivery / service address for customer."""
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        customer = Customer(user_id=current_user.id)
        db.add(customer)
        db.flush()

    if address_data.is_default:
        db.query(Address).filter(Address.customer_id == customer.id).update({Address.is_default: False})

    address = Address(
        customer_id=customer.id,
        label=address_data.label,
        address_line1=address_data.address_line1,
        address_line2=address_data.address_line2,
        city=address_data.city,
        state=address_data.state,
        postal_code=address_data.postal_code,
        country=address_data.country,
        latitude=address_data.latitude,
        longitude=address_data.longitude,
        is_default=address_data.is_default,
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return AddressResponse.model_validate(address)


@router.get("", response_model=List[AddressResponse])
def list_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List addresses saved by authenticated customer."""
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        return []
    addresses = db.query(Address).filter(Address.customer_id == customer.id).all()
    return [AddressResponse.model_validate(a) for a in addresses]


@router.get("/{id}", response_model=AddressResponse)
def get_address(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve address details by ID."""
    address = db.query(Address).filter(Address.id == id).first()
    if not address:
        raise NotFoundException("Address not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if current_user.role != UserRole.SUPER_ADMIN and (not customer or address.customer_id != customer.id):
        raise ForbiddenException("Unauthorized to access this address")

    return AddressResponse.model_validate(address)


@router.put("/{id}", response_model=AddressResponse)
def update_address(
    id: int,
    address_data: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing address."""
    address = db.query(Address).filter(Address.id == id).first()
    if not address:
        raise NotFoundException("Address not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if current_user.role != UserRole.SUPER_ADMIN and (not customer or address.customer_id != customer.id):
        raise ForbiddenException("Unauthorized to edit this address")

    data = address_data.model_dump(exclude_unset=True)
    if data.get("is_default"):
        db.query(Address).filter(Address.customer_id == address.customer_id).update({Address.is_default: False})

    for key, value in data.items():
        setattr(address, key, value)

    db.commit()
    db.refresh(address)
    return AddressResponse.model_validate(address)


@router.delete("/{id}", response_model=MessageResponse)
def delete_address(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an address."""
    address = db.query(Address).filter(Address.id == id).first()
    if not address:
        raise NotFoundException("Address not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if current_user.role != UserRole.SUPER_ADMIN and (not customer or address.customer_id != customer.id):
        raise ForbiddenException("Unauthorized to delete this address")

    db.delete(address)
    db.commit()
    return MessageResponse(message="Address deleted successfully")
