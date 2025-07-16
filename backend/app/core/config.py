"""
Configuration settings for QoE Automation MVP
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://qoe_user:qoe_password@localhost/qoe_automation"
    
    # Redis (for background tasks)
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI API
    OPENAI_API_KEY: Optional[str] = None
    
    # LangSmith (for LangChain monitoring)
    LANGCHAIN_TRACING_V2: bool = True
    LANGCHAIN_API_KEY: Optional[str] = None
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    UPLOAD_DIR: str = "uploads"
    
    # AI Model Settings
    DEFAULT_LLM_MODEL: str = "gpt-3.5-turbo"
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 2000
    
    # Materiality Thresholds
    DEFAULT_MATERIALITY_AMOUNT: int = 1000
    DEFAULT_MATERIALITY_PERCENTAGE: float = 3.0
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()