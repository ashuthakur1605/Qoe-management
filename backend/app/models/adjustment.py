"""
Adjustment model for the core QoE adjustment engine
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class AdjustmentType(enum.Enum):
    EXECUTIVE_COMPENSATION = "executive_compensation"
    SEVERANCE = "severance"
    ONE_TIME_REVENUE = "one_time_revenue"
    DEPRECIATION = "depreciation"
    STOCK_COMPENSATION = "stock_compensation"
    LITIGATION_COSTS = "litigation_costs"
    RESTRUCTURING = "restructuring"
    ACQUISITION_COSTS = "acquisition_costs"
    IPO_COSTS = "ipo_costs"
    CONSULTANT_FEES = "consultant_fees"
    TRAVEL_ENTERTAINMENT = "travel_entertainment"
    RENT_NORMALIZATION = "rent_normalization"
    RELATED_PARTY = "related_party"
    INSURANCE_NORMALIZATION = "insurance_normalization"
    BAD_DEBT = "bad_debt"
    INVENTORY_ADJUSTMENT = "inventory_adjustment"
    WARRANTY_RESERVE = "warranty_reserve"
    ACCRUAL_ADJUSTMENT = "accrual_adjustment"
    ACCOUNTING_POLICY = "accounting_policy"
    SEASONAL_ADJUSTMENT = "seasonal_adjustment"
    CUSTOMER_CONCENTRATION = "customer_concentration"
    SUPPLIER_CONCENTRATION = "supplier_concentration"
    CONTRACT_ADJUSTMENT = "contract_adjustment"
    REVENUE_RECOGNITION = "revenue_recognition"
    COST_ALLOCATION = "cost_allocation"
    ASSET_IMPAIRMENT = "asset_impairment"
    TAX_ADJUSTMENT = "tax_adjustment"
    OTHER = "other"

class AdjustmentStatus(enum.Enum):
    SUGGESTED = "suggested"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    MODIFIED = "modified"
    PENDING_REVIEW = "pending_review"

class Adjustment(Base):
    __tablename__ = "adjustments"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    source_document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    # Adjustment details
    adjustment_type = Column(Enum(AdjustmentType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    amount = Column(Float, nullable=False)
    
    # AI-generated content
    ai_narrative = Column(Text)  # AI-generated justification
    confidence_score = Column(Float)  # AI confidence in the adjustment
    precision_score = Column(Float)  # Precision of the adjustment calculation
    
    # Review status
    status = Column(Enum(AdjustmentStatus), default=AdjustmentStatus.SUGGESTED)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_notes = Column(Text)
    
    # Manual override
    is_manual = Column(Boolean, default=False)
    original_amount = Column(Float)  # Original amount before manual adjustment
    override_reason = Column(Text)
    
    # Source data
    source_data = Column(JSON)  # Raw data that led to this adjustment
    calculation_method = Column(Text)  # How the amount was calculated
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    
    # Relationships
    project = relationship("Project", back_populates="adjustments")
    source_document = relationship("Document", back_populates="adjustments")
    created_by_user = relationship("User", back_populates="adjustments", foreign_keys=[created_by])
    reviewed_by_user = relationship("User", foreign_keys=[reviewed_by])