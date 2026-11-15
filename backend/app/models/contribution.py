"""Demo-only guest contributions; no payment provider or payment processing."""

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Contribution(TimestampMixin, Base):
    __tablename__ = "contributions"
    __table_args__ = (
        CheckConstraint("amount_paise > 0", name="ck_contributions_amount_positive"),
        CheckConstraint("payment_mode = 'DEMO'", name="ck_contributions_demo_only"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    wishlist_item_id: Mapped[int] = mapped_column(
        ForeignKey("wishlist_items.id", ondelete="CASCADE"), index=True, nullable=False
    )
    contributor_name: Mapped[str | None] = mapped_column(String(120))
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    # Intentionally fixed to DEMO until a separate, explicitly approved phase.
    payment_mode: Mapped[str] = mapped_column(String(20), default="DEMO", nullable=False)

    item: Mapped["WishlistItem"] = relationship(back_populates="contributions")
