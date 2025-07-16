"""
Document model for file uploads and classification
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class DocumentType(enum.Enum):
    GL = "gl"  # General Ledger
    PL = "p_and_l"  # Profit & Loss
    PAYROLL = "payroll"
    TRIAL_BALANCE = "trial_balance"
    OTHER = "other"

class DocumentStatus(enum.Enum):
    PENDING = "pending"
    PROCESSED = "processed"
    FAILED = "failed"

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String)
    
    # Classification
    document_type = Column(Enum(DocumentType))
    classification_confidence = Column(Float)
    
    # Processing status
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PENDING)
    processing_error = Column(Text)
    
    # Extracted data
    extracted_data = Column(JSON)  # Store structured data extracted from document
    raw_text = Column(Text)  # Store raw text extracted from document
    
    # Timestamps
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    project = relationship("Project", back_populates="documents")
    adjustments = relationship("Adjustment", back_populates="source_document")