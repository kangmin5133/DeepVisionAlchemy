from sqlalchemy.orm import Session

from . import models, schemas

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