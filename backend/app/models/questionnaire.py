"""
Questionnaire model for managing project questionnaires and Q&A
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Questionnaire(Base):
    __tablename__ = "questionnaires"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="questionnaires")
    questions = relationship("Question", back_populates="questionnaire")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    questionnaire_id = Column(Integer, ForeignKey("questionnaires.id"))
    question_text = Column(Text, nullable=False)
    question_type = Column(String)  # text, multiple_choice, boolean, number
    options = Column(JSON)  # For multiple choice questions
    is_required = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    # AI-generated metadata
    is_ai_generated = Column(Boolean, default=False)
    generated_reason = Column(Text)  # Why this question was generated
    
    # Follow-up logic
    triggers_followup = Column(Boolean, default=False)
    followup_conditions = Column(JSON)  # Conditions that trigger follow-up questions
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    questionnaire = relationship("Questionnaire", back_populates="questions")
    responses = relationship("QuestionResponse", back_populates="question")

class QuestionResponse(Base):
    __tablename__ = "question_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    response_text = Column(Text)
    response_data = Column(JSON)  # For structured responses
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    question = relationship("Question", back_populates="responses")
    user = relationship("User")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)  # create, update, delete, approve, reject
    entity_type = Column(String, nullable=False)  # adjustment, document, question
    entity_id = Column(Integer)
    old_values = Column(JSON)
    new_values = Column(JSON)
    notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="audit_logs")
    user = relationship("User", back_populates="audit_logs")