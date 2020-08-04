"""empty message

Revision ID: 713c7838d4e9
Revises: e5d4cc1e8be9
Create Date: 2020-08-04 13:36:52.785988

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '713c7838d4e9'
down_revision = 'e5d4cc1e8be9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('prediction', sa.Column('location', sa.String(length=30), nullable=True))
    op.add_column('prediction', sa.Column('timestamp', sa.TIMESTAMP(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('prediction', 'timestamp')
    op.drop_column('prediction', 'location')
    # ### end Alembic commands ###
