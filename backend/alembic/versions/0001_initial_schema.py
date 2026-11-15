"""Create the initial wedding wishlist schema.

Revision ID: 0001_initial
Revises:
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=20), server_default="user", nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("role IN ('user', 'admin')", name="ck_users_role"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "couples",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_user_id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=100), nullable=False),
        sa.Column("partner_one_name", sa.String(length=120), nullable=False),
        sa.Column("partner_two_name", sa.String(length=120), nullable=False),
        sa.Column("wedding_date", sa.Date(), nullable=True),
        sa.Column("venue", sa.String(length=255), nullable=True),
        sa.Column("story", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("owner_user_id", name="uq_couples_owner_user_id"),
    )
    op.create_index("ix_couples_slug", "couples", ["slug"], unique=True)

    op.create_table(
        "guest_messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("couple_id", sa.Integer(), nullable=False),
        sa.Column("guest_name", sa.String(length=120), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("is_approved", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["couple_id"], ["couples.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_guest_messages_couple_id", "guest_messages", ["couple_id"])

    op.create_table(
        "wishlists",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("couple_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=160), server_default="Our Wishlist", nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["couple_id"], ["couples.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("couple_id", name="uq_wishlists_couple_id"),
    )

    op.create_table(
        "wishlist_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("wishlist_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("target_amount_paise", sa.Integer(), nullable=True),
        sa.Column("quantity", sa.Integer(), server_default="1", nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint(
            "target_amount_paise IS NULL OR target_amount_paise > 0",
            name="ck_wishlist_items_target_amount_positive",
        ),
        sa.CheckConstraint("quantity > 0", name="ck_wishlist_items_quantity_positive"),
        sa.ForeignKeyConstraint(["wishlist_id"], ["wishlists.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_wishlist_items_wishlist_id", "wishlist_items", ["wishlist_id"])

    op.create_table(
        "contributions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("wishlist_item_id", sa.Integer(), nullable=False),
        sa.Column("contributor_name", sa.String(length=120), nullable=True),
        sa.Column("amount_paise", sa.Integer(), nullable=False),
        sa.Column("payment_mode", sa.String(length=20), server_default="DEMO", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("amount_paise > 0", name="ck_contributions_amount_positive"),
        sa.CheckConstraint("payment_mode = 'DEMO'", name="ck_contributions_demo_only"),
        sa.ForeignKeyConstraint(["wishlist_item_id"], ["wishlist_items.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_contributions_wishlist_item_id", "contributions", ["wishlist_item_id"])


def downgrade() -> None:
    op.drop_index("ix_contributions_wishlist_item_id", table_name="contributions")
    op.drop_table("contributions")
    op.drop_index("ix_wishlist_items_wishlist_id", table_name="wishlist_items")
    op.drop_table("wishlist_items")
    op.drop_table("wishlists")
    op.drop_index("ix_guest_messages_couple_id", table_name="guest_messages")
    op.drop_table("guest_messages")
    op.drop_index("ix_couples_slug", table_name="couples")
    op.drop_table("couples")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
