"""Add category to wishlist items and message to contributions.

Revision ID: 0004_wishlist_category_and_message
Revises: 0003_couple_photo
"""

import sqlalchemy as sa
from alembic import op

revision = "0004_wishlist_category_and_message"
down_revision = "0003_couple_photo"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("wishlist_items", sa.Column("category", sa.String(60), server_default="Other", nullable=True))
    op.add_column("contributions", sa.Column("message", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("contributions", "message")
    op.drop_column("wishlist_items", "category")
