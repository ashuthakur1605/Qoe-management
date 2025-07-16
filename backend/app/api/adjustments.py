"""
Adjustments API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.adjustment import Adjustment

router = APIRouter()

@router.get("/project/{project_id}")
async def get_project_adjustments(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all adjustments for a project"""
    # TODO: Check if user has access to project
    
    adjustments = db.query(Adjustment).filter(Adjustment.project_id == project_id).all()
    return adjustments

@router.get("/{adjustment_id}")
async def get_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific adjustment"""
    adjustment = db.query(Adjustment).filter(Adjustment.id == adjustment_id).first()
    
    if not adjustment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Adjustment not found"
        )
    
    # TODO: Check if user has access to project
    
    return adjustment

@router.post("/project/{project_id}")
async def create_adjustment(
    project_id: int,
    # adjustment_data: AdjustmentCreate,  # TODO: Create schema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new manual adjustment"""
    # TODO: Implement adjustment creation
    return {"message": "Not implemented yet"}

@router.post("/{adjustment_id}/review")
async def review_adjustment(
    adjustment_id: int,
    # review_data: AdjustmentReview,  # TODO: Create schema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Review an adjustment (accept/reject)"""
    # TODO: Implement adjustment review
    return {"message": "Not implemented yet"}

@router.put("/{adjustment_id}")
async def update_adjustment(
    adjustment_id: int,
    # adjustment_data: AdjustmentUpdate,  # TODO: Create schema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an adjustment"""
    # TODO: Implement adjustment update
    return {"message": "Not implemented yet"}

@router.delete("/{adjustment_id}")
async def delete_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an adjustment"""
    adjustment = db.query(Adjustment).filter(Adjustment.id == adjustment_id).first()
    
    if not adjustment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Adjustment not found"
        )
    
    # TODO: Check if user has access to project
    
    db.delete(adjustment)
    db.commit()
    
    return {"message": "Adjustment deleted successfully"}