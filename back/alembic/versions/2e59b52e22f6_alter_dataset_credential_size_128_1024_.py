"""alter dataset_credential size 128 -> 1024 from dataset table

Revision ID: 2e59b52e22f6
Revises: 3fe591bd8385
Create Date: 2023-06-14 14:58:11.301635

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2e59b52e22f6'
down_revision = '3fe591bd8385'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
