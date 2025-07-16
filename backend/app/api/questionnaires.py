"""
Questionnaires API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.questionnaire import Questionnaire, Question, QuestionResponse

router = APIRouter()

@router.get("/project/{project_id}")
async def get_project_questionnaires(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all questionnaires for a project"""
    # TODO: Check if user has access to project
    
    questionnaires = db.query(Questionnaire).filter(
        Questionnaire.project_id == project_id
    ).all()
    return questionnaires

@router.get("/{questionnaire_id}")
async def get_questionnaire(
    questionnaire_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific questionnaire with questions"""
    questionnaire = db.query(Questionnaire).filter(
        Questionnaire.id == questionnaire_id
    ).first()
    
    if not questionnaire:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Questionnaire not found"
        )
    
    # TODO: Check if user has access to project
    
    return questionnaire

@router.post("/questions/{question_id}/respond")
async def submit_response(
    question_id: int,
    # response_data: QuestionResponseCreate,  # TODO: Create schema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a response to a question"""
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # TODO: Check if user has access to project
    # TODO: Create response record
    
    return {"message": "Response submitted successfully"}

@router.get("/questions/{question_id}/responses")
async def get_question_responses(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all responses for a question"""
    # TODO: Check if user has access to project
    
    responses = db.query(QuestionResponse).filter(
        QuestionResponse.question_id == question_id
    ).all()
    
    return responses