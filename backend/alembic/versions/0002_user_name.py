"""Add a required user name without removing existing accounts.

Revision ID: 0002_user_name
Revises: 0001_initial
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_user_name"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("name", sa.String(120), nullable=True))
    op.execute("UPDATE users SET name = 'Existing user' WHERE name IS NULL")
    op.alter_column("users", "name", existing_type=sa.String(120), nullable=False)


def downgrade() -> None:
    op.drop_column("users", "name")
