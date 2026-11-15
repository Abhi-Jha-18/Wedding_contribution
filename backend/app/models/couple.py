"""Wedding profile owned by a user."""

from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Couple(TimestampMixin, Base):
    __tablename__ = "couples"
    __table_args__ = (UniqueConstraint("owner_user_id", name="uq_couples_owner_user_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    partner_one_name: Mapped[str] = mapped_column(String(120), nullable=False)
    partner_two_name: Mapped[str] = mapped_column(String(120), nullable=False)
    wedding_date: Mapped[date | None] = mapped_column(Date)
    venue: Mapped[str | None] = mapped_column(String(255))
    story: Mapped[str | None] = mapped_column(Text)

    owner: Mapped["User"] = relationship(back_populates="couple")
    wishlist: Mapped["Wishlist | None"] = relationship(
        back_populates="couple", uselist=False, cascade="all, delete-orphan"
    )
    guest_messages: Mapped[list["GuestMessage"]] = relationship(
        back_populates="couple", cascade="all, delete-orphan"
    )
