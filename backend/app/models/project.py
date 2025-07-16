"""
Project model for managing QoE projects
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    client_name = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    
    # Materiality settings
    materiality_amount = Column(Float, default=1000.0)
    materiality_percentage = Column(Float, default=3.0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    created_by_user = relationship("User", back_populates="projects")
    users = relationship("ProjectUser", back_populates="project")
    documents = relationship("Document", back_populates="project")
    adjustments = relationship("Adjustment", back_populates="project")
    questionnaires = relationship("Questionnaire", back_populates="project")
    audit_logs = relationship("AuditLog", back_populates="project")

class ProjectUser(Base):
    __tablename__ = "project_users"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="users")
    user = relationship("User", back_populates="project_assignments")