"""Import all ORM models so Alembic can discover their metadata."""

from app.models.base import Base
from app.models.contribution import Contribution
from app.models.couple import Couple
from app.models.guest_message import GuestMessage
from app.models.user import User
from app.models.wishlist import Wishlist, WishlistItem

__all__ = ["Base", "User", "Couple", "Wishlist", "WishlistItem", "Contribution", "GuestMessage"]
