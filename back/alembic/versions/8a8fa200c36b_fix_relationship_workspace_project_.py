"""fix relationship workspace : project table to 1:N

Revision ID: 8a8fa200c36b
Revises: 834a6a0ea0ec
Create Date: 2023-08-23 09:46:23.249725

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8a8fa200c36b'
down_revision = '834a6a0ea0ec'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('project_workspace')
    op.add_column('project', sa.Column('workspace_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'project', 'workspace', ['workspace_id'], ['workspace_id'], onupdate='CASCADE', ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'project', type_='foreignkey')
    op.drop_column('project', 'workspace_id')
    op.create_table('project_workspace',
    sa.Column('workspace_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('project_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['project_id'], ['project.project_id'], name='project_workspace_ibfk_1', onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspace.workspace_id'], name='project_workspace_ibfk_2', onupdate='CASCADE', ondelete='CASCADE'),
    mysql_collate='utf8mb4_unicode_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
