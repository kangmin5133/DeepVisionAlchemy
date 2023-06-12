"""add dataset table col creator_id

Revision ID: f3fac266c53b
Revises: 0ad4b34c623d
Create Date: 2023-06-12 10:35:42.619302

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f3fac266c53b'
down_revision = '0ad4b34c623d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dataset', sa.Column('creator_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'dataset', 'user', ['creator_id'], ['user_id'], onupdate='CASCADE', ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'dataset', type_='foreignkey')
    op.drop_column('dataset', 'creator_id')
    # ### end Alembic commands ###
