from sqlalchemy.orm import Session
import sqlalchemy
from . import models, schemas

def object_as_dict(obj):
    if isinstance(obj, list):
        return [object_as_dict(item) for item in obj]
    return {c.key: getattr(obj, c.key)
        for c in sqlalchemy.inspect(obj).mapper.column_attrs}
    


# CRUD - user 
def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user: schemas.UserUpdate, user_id: int):
    db.query(models.User).filter(models.User.user_id == user_id).update(user.dict())
    db.commit()
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def delete_user(db: Session, user_id: int):
    db.query(models.User).filter(models.User.user_id == user_id).delete()
    db.commit()
    return True

# CRUD - organization 
def get_organization(db: Session, org_id: int):
    return db.query(models.Organization).filter(models.Organization.org_id == org_id).first()

def get_organization_by_creator_id(db: Session, creator_id: int):
    return db.query(models.Organization).filter(models.Organization.creator_id == creator_id).first()

def get_organizations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Organization).offset(skip).limit(limit).all()

def create_organization(db: Session, organization: schemas.OrganizationCreate):
    db_organization = models.Organization(**organization.dict())
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization

def update_organization(db: Session, organization: schemas.OrganizationUpdate, org_id: int):
    db.query(models.Organization).filter(models.Organization.org_id == org_id).update(organization.dict())
    db.commit()
    return db.query(models.Organization).filter(models.Organization.org_id == org_id).first()

def delete_organization(db: Session, org_id: int):
    db.query(models.Organization).filter(models.Organization.org_id == org_id).delete()
    db.commit()
    return True

# CRUD - workspace
def get_workspace(db: Session, workspace_id: int):
    return db.query(models.Workspace).filter(models.Workspace.workspace_id == workspace_id).first()

def get_workspace_by_invitation_link(db: Session, invitation_link: str):
    return db.query(models.Workspace).filter(models.Workspace.invitation_link == invitation_link).first()

def get_workspaces_by_creator_id(db: Session, creator_id: int):
    return db.query(models.Workspace).filter(models.Workspace.creator_id == creator_id).all()

def get_workspaces_by_workspace_type_id(db: Session, workspace_type_id: int):
    return db.query(models.Workspace).filter(models.Workspace.workspace_type_id == workspace_type_id).all()

def get_workspaces(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Workspace).offset(skip).limit(limit).all()

def create_workspace(db: Session, workspace: schemas.WorkspaceCreate):
    db_workspace = models.Workspace(**workspace.dict())
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def update_workspace(db: Session, workspace: schemas.WorkspaceUpdate, workspace_id: int):
    db.query(models.Workspace).filter(models.Workspace.workspace_id == workspace_id).update(workspace.dict())
    db.commit()
    return db.query(models.Workspace).filter(models.Workspace.workspace_id == workspace_id).first()

def delete_workspace(db: Session, workspace_id: int):
    db.query(models.Workspace).filter(models.Workspace.workspace_id == workspace_id).delete()
    db.commit()
    return True

# CRUD - project
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.project_id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project: schemas.ProjectUpdate, project_id: int):
    db.query(models.Project).filter(models.Project.project_id == project_id).update(project.dict())
    db.commit()
    return db.query(models.Project).filter(models.Project.project_id == project_id).first()

def delete_project(db: Session, project_id: int):
    db.query(models.Project).filter(models.Project.project_id == project_id).delete()
    db.commit()
    return True

# CRUD - team
def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.team_id == team_id).first()

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

def create_team(db: Session, team: schemas.TeamCreate):
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def update_team(db: Session, team: schemas.TeamUpdate, team_id: int):
    db.query(models.Team).filter(models.Team.team_id == team_id).update(team.dict())
    db.commit()
    return db.query(models.Team).filter(models.Team.team_id == team_id).first()

def delete_team(db: Session, team_id: int):
    db.query(models.Team).filter(models.Team.team_id == team_id).delete()
    db.commit()
    return True

# CRUD - dataset
def get_dataset_by_dataset_id(db: Session, dataset_id: int):
    return db.query(models.Dataset).filter(models.Dataset.dataset_id == dataset_id).first()

def get_datasets_by_creator_id(db: Session, creator_id: int):
    return db.query(models.Dataset).filter(models.Dataset.creator_id == creator_id).all()

def get_datasets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Dataset).offset(skip).limit(limit).all()

def create_dataset(db: Session, dataset: schemas.DatasetCreate):
    db_dataset = models.Dataset(**dataset.dict())
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def update_dataset(db: Session, dataset: schemas.DatasetUpdate, dataset_id: int):
    db.query(models.Dataset).filter(models.Dataset.dataset_id == dataset_id).update(dataset.dict())
    db.commit()
    return db.query(models.Dataset).filter(models.Dataset.dataset_id == dataset_id).first()

def delete_dataset(db: Session, dataset_id: int):
    db.query(models.Dataset).filter(models.Dataset.dataset_id == dataset_id).delete()
    db.commit()
    return True

#CRUD - associate tables
def create_user_and_organization(db: Session, user_id: int, org_id: int):
    # 이 함수는 User와 Organization 간의 관계를 설정합니다.
    
    # 사용자와 조직의 정보를 데이터베이스에서 가져옵니다.
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    organization = db.query(models.Organization).filter(models.Organization.org_id == org_id).first()

    if user is None or organization is None:
        # 만약 사용자나 조직이 데이터베이스에서 찾아지지 않는다면, 에러를 반환합니다.
        return None

    # 사용자가 생성한 조직을 설정하고,
    user.created_organizations.append(organization)

    # 사용자가 조직의 일원이라는 것을 설정합니다.
    user.organizations.append(organization)

    # 데이터베이스에 변경사항을 저장하고 변화를 커밋합니다.
    db.commit()
    db.refresh(user)
    
    return user

def get_user_organizations(db: Session, user_id: int):
    # 이 함수는 특정 User와 관련된 모든 Organization을 반환합니다.

    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    
    if user is None:
        # 만약 사용자가 데이터베이스에서 찾아지지 않는다면, 에러를 반환합니다.
        return None

    # 사용자가 속한 모든 조직을 가져옵니다.
    organizations = db.query(models.Organization).join(
        models.user_organization_association).filter(
        models.user_organization_association.c.user_id == user.user_id).all()

    return organizations
