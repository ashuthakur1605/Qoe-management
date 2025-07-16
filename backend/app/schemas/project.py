"""
Project schemas for request/response models
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    materiality_amount: float = 1000.0
    materiality_percentage: float = 3.0

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    materiality_amount: Optional[float] = None
    materiality_percentage: Optional[float] = None
    is_active: Optional[bool] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    client_name: Optional[str]
    created_by: int
    is_active: bool
    materiality_amount: float
    materiality_percentage: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True