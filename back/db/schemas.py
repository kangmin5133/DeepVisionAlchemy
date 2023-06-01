from typing import Optional, List
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base classes
class UserTypeBase(BaseModel):
    type_name: str

class DataTypeBase(BaseModel):
    type_name: str

class SocialPlatformTypeBase(BaseModel):
    provider_name: str

class ProjectTypeBase(BaseModel):
    type_name: str
    desc: Optional[str] = None

class RoleBase(BaseModel):
    role_name: str
    role_desc: Optional[str] = None

class MembershipBase(BaseModel):
    membership_name: str

class UserBase(BaseModel):
    user_id: int
    user_type_id: int
    user_pw: Optional[str]
    social_id:Optional[str]
    email: str
    provider: Optional[int]
    name: Optional[str]
    membership_id: int

class OrganizationBase(BaseModel):
    org_email: str
    org_name: str
    creator_id: int

class WorkspaceBase(BaseModel):
    creator_id: int
    workspace_name: str
    workspcae_info: Optional[str] = None
    invitation_link: str
    org_id: Optional[int] = None

class ProjectBase(BaseModel):
    project_type: int
    project_name: str
    data_type: int
    desc: Optional[str] = None

class TeamBase(BaseModel):
    team_name: str
    team_info: Optional[str] = None

# Create classes
class UserTypeCreate(UserTypeBase):
    pass

class DataTypeCreate(DataTypeBase):
    pass

class SocialPlatformTypeCreate(SocialPlatformTypeBase):
    pass

class ProjectTypeCreate(ProjectTypeBase):
    pass

class RoleCreate(RoleBase):
    pass

class MembershipCreate(MembershipBase):
    pass

class UserCreate(UserBase):
    pass

class OrganizationCreate(OrganizationBase):
    pass

class WorkspaceCreate(WorkspaceBase):
    pass

class ProjectCreate(ProjectBase):
    pass

class TeamCreate(TeamBase):
    pass

# Update classes
class UserUpdate(UserBase):
    user_type_id: Optional[int]
    user_pw: Optional[str]
    social_id:Optional[str]
    email: Optional[str]
    provider: Optional[int]
    name: Optional[str]
    membership_id: Optional[int]


class OrganizationUpdate(OrganizationBase):
    org_email: Optional[str]
    org_name:Optional[str]

class WorkspaceUpdate(WorkspaceBase):
    user_type_id: Optional[int]
    workspace_name: Optional[str]
    workspcae_info: Optional[str]
    invitation_link: Optional[str]
    org_id: Optional[int]


class ProjectUpdate(ProjectBase):
    project_name: Optional[str]
    data_type: Optional[int]
    desc: Optional[str]

class TeamUpdate(TeamBase):
    team_name: Optional[str]
    team_info: Optional[str]


# DB class
class UserType(UserTypeBase):
    user_type_id: int

    class Config:
        orm_mode = True

class DataType(DataTypeBase):
    type_id: int
    class Config:
        orm_mode = True

class SocialPlatformType(SocialPlatformTypeBase):
    provider_id: int
    class Config:
        orm_mode = True

class ProjectType(ProjectTypeBase):
    project_type_id: int
    class Config:
        orm_mode = True

class Role(RoleBase):
    role_id: int
    class Config:
        orm_mode = True

class Membership(MembershipBase):
    membership_id: int
    class Config:
        orm_mode = True

class User(UserBase):
    created: datetime
    updated: datetime

    class Config:
        orm_mode = True

class Organization(OrganizationBase):
    org_id: int
    created: datetime
    updated: datetime
    class Config:
        orm_mode = True

class Workspace(WorkspaceBase):
    workspace_id: int
    created: datetime
    updated: datetime
    class Config:
        orm_mode = True

class Project(ProjectBase):
    project_id: int
    created: datetime
    updated: datetime
    class Config:
        orm_mode = True

class Team(TeamBase):
    team_id: int
    created: datetime
    updated: datetime
    class Config:
        orm_mode = True