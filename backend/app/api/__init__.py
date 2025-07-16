"""
API package for QoE Automation MVP
"""
from fastapi import APIRouter
from .auth import router as auth_router
from .projects import router as projects_router
from .documents import router as documents_router
from .adjustments import router as adjustments_router
from .questionnaires import router as questionnaires_router
from .reports import router as reports_router

api_router = APIRouter()

# Include all sub-routers
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(adjustments_router, prefix="/adjustments", tags=["adjustments"])
api_router.include_router(questionnaires_router, prefix="/questionnaires", tags=["questionnaires"])
api_router.include_router(reports_router, prefix="/reports", tags=["reports"])