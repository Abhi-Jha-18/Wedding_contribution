"""Add an optional wedding photo URL, preserving existing profiles.

Revision ID: 0003_couple_photo
Revises: 0002_user_name
"""

import sqlalchemy as sa
from alembic import op

revision = "0003_couple_photo"
down_revision = "0002_user_name"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("couples", sa.Column("photo", sa.String(2048), nullable=True))


def downgrade() -> None:
    op.drop_column("couples", "photo")
