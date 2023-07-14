from sqlalchemy import Boolean, Table ,Column, ForeignKey, Integer, String, DateTime,Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy import ForeignKeyConstraint

# Association Table
user_organization_association = Table(
    'user_organization', Base.metadata,
    Column('user_id', Integer, ForeignKey('user.user_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('org_id', Integer, ForeignKey('organization.org_id',ondelete='CASCADE',onupdate='CASCADE'))
)

workspace_teams_association = Table(
    'workspace_teams', Base.metadata,
    Column('workspace_id', Integer, ForeignKey('workspace.workspace_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('team_id', Integer, ForeignKey('team.team_id',ondelete='CASCADE',onupdate='CASCADE'))
)

user_teams_association = Table(
    'user_teams', Base.metadata,
    Column('user_id', Integer, ForeignKey('user.user_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('team_id', Integer, ForeignKey('team.team_id',ondelete='CASCADE',onupdate='CASCADE'))
)

team_projects_association = Table(
    'team_projects', Base.metadata,
    Column('team_id', Integer, ForeignKey('team.team_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('project_id', Integer, ForeignKey('project.project_id',ondelete='CASCADE',onupdate='CASCADE'))
)

dataset_projects_association = Table(
    'dataset_projects', Base.metadata,
    Column('dataset_id', Integer, ForeignKey('dataset.dataset_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('project_id', Integer, ForeignKey('project.project_id',ondelete='CASCADE',onupdate='CASCADE'))
)

user_project_roles_association = Table(
    'user_project_roles', Base.metadata,
    Column('user_id', Integer, ForeignKey('user.user_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('role_id', Integer, ForeignKey('role.role_id',ondelete='CASCADE',onupdate='CASCADE')),
    Column('project_id', Integer, ForeignKey('project.project_id',ondelete='CASCADE',onupdate='CASCADE'))
)

# user_datasets_association = Table(
#     'user_datasets', Base.metadata,
#     Column('user_id', Integer, ForeignKey('user.user_id',ondelete='CASCADE',onupdate='CASCADE')),
#     Column('dataset_id', Integer, ForeignKey('dataset.dataset_id',ondelete='CASCADE',onupdate='CASCADE'))
# )


# Tables
class SystemInfo(Base):
    __tablename__ = "system_info"

    version = Column(String(32), primary_key=True, index=True)
    name = Column(String(100))
    desc = Column(String(512))
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

class DataType(Base):
    __tablename__ = "data_type"

    type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(32))

class UserType(Base):
    __tablename__ = "user_type"

    user_type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(32))

    users = relationship("User", back_populates="user_type")

class WorkspaceType(Base):
    __tablename__ = "workspace_type"
    workspace_type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(32))

class SocialPlatformType(Base):
    __tablename__ = "social_platform_type"

    provider_id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String(32))

    users = relationship("User", back_populates="social_platform")

class ProjectType(Base):
    __tablename__ = "project_type"

    project_type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(32))
    desc = Column(Text)

class Role(Base):
    __tablename__ = "role"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(32))
    role_desc = Column(Text)

class Membership(Base):
    __tablename__ = "membership"

    membership_id = Column(Integer, primary_key=True, index=True)
    membership_name = Column(String(32))

    users = relationship("User", back_populates="membership")

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_type_id = Column(Integer, ForeignKey("user_type.user_type_id"), nullable=False)
    user_pw = Column(String(128))
    social_id = Column(String(45))
    email = Column(String(128),primary_key=True, nullable=False, unique=True)
    provider = Column(Integer, ForeignKey("social_platform_type.provider_id"))
    name = Column(String(32))
    membership_id = Column(Integer, ForeignKey("membership.membership_id"), nullable=False)
    profile_image = Column(String(32))
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    # relations
    user_type = relationship("UserType", back_populates="users")
    membership = relationship("Membership", back_populates="users")
    social_platform = relationship("SocialPlatformType", back_populates="users")
    teams = relationship("Team", secondary="user_teams", back_populates="users")
    created_organizations = relationship("Organization", back_populates="creator")
    organizations = relationship("Organization", secondary=user_organization_association, back_populates="users")
    # datasets = relationship("Dataset", secondary=user_datasets_association, back_populates="users")

class Organization(Base):
    __tablename__ = "organization"

    org_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    org_email = Column(String(128), nullable=False)
    org_name = Column(String(32), nullable=False)
    creator_id = Column(Integer, ForeignKey("user.user_id",ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    # relations
    creator = relationship("User", back_populates="created_organizations")
    users = relationship("User", secondary=user_organization_association, back_populates="organizations")
    datasets = relationship("Dataset", back_populates="organization")
    

class Workspace(Base):
    __tablename__ = "workspace"

    workspace_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    workspace_type_id = Column(Integer, ForeignKey("workspace_type.workspace_type_id"))
    creator_id = Column(Integer, ForeignKey("user.user_id",ondelete='CASCADE',onupdate='CASCADE'))
    org_id = Column(Integer, ForeignKey("organization.org_id",ondelete='CASCADE',onupdate='CASCADE'))
    workspace_name = Column(String(32))
    workspace_info = Column(String(128))
    invitation_link = Column(String(128))
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    teams = relationship("Team", secondary=workspace_teams_association, back_populates="workspaces")


class Project(Base):
    __tablename__ = "project"

    project_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_type = Column(Integer, ForeignKey("project_type.project_type_id"))
    project_name = Column(String(32))
    desc = Column(Text)
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    teams = relationship("Team", secondary=team_projects_association, back_populates="projects")
    user_roles = relationship("User",secondary=user_project_roles_association,backref="projects")
    datasets = relationship("Dataset", secondary=dataset_projects_association, back_populates="projects")

class Team(Base):
    __tablename__ = "team"

    team_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    team_name = Column(String(32))
    team_info = Column(String(32))
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    users = relationship("User", secondary=user_teams_association, back_populates="teams")
    projects = relationship("Project", secondary=team_projects_association, back_populates="teams")
    workspaces = relationship("Workspace", secondary=workspace_teams_association, back_populates="teams")

class Dataset(Base):
    __tablename__ = "dataset"

    dataset_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    creator_id = Column(Integer, ForeignKey("user.user_id",ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
    org_id = Column(Integer, ForeignKey("organization.org_id",ondelete='CASCADE',onupdate='CASCADE'),nullable=True)
    
    dataset_name = Column(String(32),nullable=False)
    dataset_desc = Column(String(1024),nullable=True)

    dataset_type = Column(Integer,ForeignKey("data_type.type_id"),nullable=False)
    dataset_credential = Column(Text,nullable=True)

    dataset_count = Column(Integer,nullable=True)
    dataset_bucket_name = Column(String(128),nullable=True)
    dataset_prefix = Column(String(128),nullable=True)

    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    # users = relationship("User", secondary=user_datasets_association, back_populates="datasets")
    projects = relationship("Project", secondary=dataset_projects_association, back_populates="datasets")
    organization = relationship("Organization", back_populates="datasets")
    