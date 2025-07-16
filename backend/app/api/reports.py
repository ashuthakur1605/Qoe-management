"""
Reports API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.project import Project

router = APIRouter()

@router.get("/excel/{project_id}")
async def generate_excel_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate Excel data book for a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # TODO: Implement Excel generation
    return {"message": "Excel report generation not implemented yet"}

@router.get("/word/{project_id}")
async def generate_word_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate Word/PDF report for a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # TODO: Implement Word/PDF generation
    return {"message": "Word report generation not implemented yet"}

@router.get("/qa-checklist/{project_id}")
async def get_qa_checklist(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get QA checklist status for a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Mock QA checklist data
    checklist = [
        {
            "id": 1,
            "item": "All documents have been uploaded and processed",
            "status": "complete",
            "required": True,
        },
        {
            "id": 2,
            "item": "AI-suggested adjustments have been reviewed",
            "status": "pending",
            "required": True,
        },
        {
            "id": 3,
            "item": "Manual adjustments have narratives",
            "status": "complete",
            "required": True,
        },
        {
            "id": 4,
            "item": "Questionnaire responses are complete",
            "status": "pending",
            "required": False,
        },
        {
            "id": 5,
            "item": "Materiality thresholds are confirmed",
            "status": "complete",
            "required": True,
        },
        {
            "id": 6,
            "item": "All adjustments have been categorized",
            "status": "complete",
            "required": True,
        },
    ]
    
    return checklist