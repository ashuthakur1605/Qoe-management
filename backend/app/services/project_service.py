"""
Project service for managing project business logic
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.project import Project, ProjectUser
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate
from fastapi import HTTPException, status
from typing import List, Optional

class ProjectService:
    def __init__(self, db: Session):
        self.db = db
    
    async def create_project(self, project_data: ProjectCreate, created_by: int) -> Project:
        """Create a new project"""
        project = Project(
            name=project_data.name,
            description=project_data.description,
            client_name=project_data.client_name,
            created_by=created_by,
            materiality_amount=project_data.materiality_amount,
            materiality_percentage=project_data.materiality_percentage
        )
        
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        
        # Assign the creator to the project
        project_user = ProjectUser(
            project_id=project.id,
            user_id=created_by
        )
        self.db.add(project_user)
        self.db.commit()
        
        return project
    
    async def get_project(self, project_id: int) -> Optional[Project]:
        """Get a project by ID"""
        return self.db.query(Project).filter(Project.id == project_id).first()
    
    async def get_user_projects(self, user_id: int) -> List[Project]:
        """Get all projects accessible to a user"""
        # Get user to check role
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if user.role == "admin":
            # Admins can see all projects
            return self.db.query(Project).filter(Project.is_active == True).all()
        else:
            # Analysts can only see projects they're assigned to
            return self.db.query(Project).join(ProjectUser).filter(
                and_(
                    ProjectUser.user_id == user_id,
                    Project.is_active == True
                )
            ).all()
    
    async def update_project(self, project_id: int, project_data: ProjectUpdate) -> Optional[Project]:
        """Update a project"""
        project = self.db.query(Project).filter(Project.id == project_id).first()
        
        if not project:
            return None
        
        # Update fields that are provided
        update_data = project_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)
        
        self.db.commit()
        self.db.refresh(project)
        
        return project
    
    async def delete_project(self, project_id: int) -> bool:
        """Delete a project"""
        project = self.db.query(Project).filter(Project.id == project_id).first()
        
        if not project:
            return False
        
        # Delete project assignments first
        self.db.query(ProjectUser).filter(ProjectUser.project_id == project_id).delete()
        
        # Delete the project
        self.db.delete(project)
        self.db.commit()
        
        return True
    
    async def user_has_access(self, user_id: int, project_id: int) -> bool:
        """Check if a user has access to a project"""
        # Get user to check role
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if user.role == "admin":
            # Admins have access to all projects
            return True
        
        # Check if user is assigned to the project
        assignment = self.db.query(ProjectUser).filter(
            and_(
                ProjectUser.user_id == user_id,
                ProjectUser.project_id == project_id
            )
        ).first()
        
        return assignment is not None
    
    async def assign_user_to_project(self, project_id: int, user_id: int) -> bool:
        """Assign a user to a project"""
        # Check if assignment already exists
        existing = self.db.query(ProjectUser).filter(
            and_(
                ProjectUser.project_id == project_id,
                ProjectUser.user_id == user_id
            )
        ).first()
        
        if existing:
            return False
        
        # Create new assignment
        project_user = ProjectUser(
            project_id=project_id,
            user_id=user_id
        )
        
        self.db.add(project_user)
        self.db.commit()
        
        return True
    
    async def remove_user_from_project(self, project_id: int, user_id: int) -> bool:
        """Remove a user from a project"""
        assignment = self.db.query(ProjectUser).filter(
            and_(
                ProjectUser.project_id == project_id,
                ProjectUser.user_id == user_id
            )
        ).first()
        
        if not assignment:
            return False
        
        self.db.delete(assignment)
        self.db.commit()
        
        return True