# QoE Automation MVP

A comprehensive Quality of Earnings automation platform built with React, Python, FastAPI, LangChain, and LangGraph.

## 🎯 Project Overview

The QoE Automation MVP is designed to streamline Quality of Earnings analysis through AI-powered document processing, automated adjustment identification, and intelligent report generation. The system supports the complete QoE workflow from document ingestion to final report generation.

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript, Material-UI
- **Backend**: Python with FastAPI
- **AI/ML**: LangChain, LangGraph, OpenAI GPT models
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based authentication
- **File Processing**: Support for Excel, CSV, DOCX, and PDF files

### System Components

1. **Document Ingestion Engine**
   - Multi-format file upload (Excel, CSV, DOCX, PDF)
   - Automatic document classification
   - Real-time processing status tracking

2. **AI-Powered Adjustment Engine**
   - 28+ predefined adjustment types
   - LangGraph workflow orchestration
   - Automated narrative generation
   - Materiality threshold filtering

3. **Review Canvas & Feedback Loop**
   - Interactive adjustment review interface
   - Manual override capabilities
   - Audit trail and versioning

4. **Questionnaire System**
   - AI-generated questions based on documents
   - Follow-up question logic
   - Complete Q&A tracking

5. **Report Generation**
   - Excel Data Book generation
   - Word/PDF report composer
   - QA checklist enforcement

6. **Role-Based Access Control**
   - Admin and Analyst roles
   - Project-specific access control

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 13+
- Redis (for background tasks)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qoe-automation
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Run database migrations
   alembic upgrade head
   
   # Start the backend server
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env.local
   # Edit .env.local with your configuration
   
   # Start the development server
   npm start
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb qoe_automation
   
   # Update DATABASE_URL in backend/.env
   DATABASE_URL=postgresql://username:password@localhost/qoe_automation
   ```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://qoe_user:qoe_password@localhost/qoe_automation
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
LANGCHAIN_API_KEY=your-langchain-api-key
MAX_FILE_SIZE=52428800
UPLOAD_DIR=uploads
DEFAULT_MATERIALITY_AMOUNT=1000
DEFAULT_MATERIALITY_PERCENTAGE=3.0
```

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## 📋 Features

### ✅ Implemented Features

1. **User Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin/Analyst)
   - Protected routes

2. **Project Management**
   - Create and manage QoE projects
   - Project-specific settings
   - User assignment to projects

3. **Document Processing**
   - Multi-format file upload
   - Automatic document classification
   - Content extraction and parsing

4. **AI-Powered Analysis**
   - LangGraph workflow for adjustment identification
   - 28+ predefined adjustment types
   - Automated narrative generation
   - Confidence and precision scoring

5. **Database Schema**
   - Complete data models for all entities
   - Audit logging and versioning
   - Relationship management

6. **API Infrastructure**
   - RESTful API with FastAPI
   - Comprehensive endpoint coverage
   - Error handling and validation

7. **Frontend Foundation**
   - React with TypeScript
   - Material-UI components
   - Authentication flow
   - API integration setup

### 🔄 Workflow Overview

```
Document Upload → Classification → AI Analysis → Adjustment Identification → 
Review Process → Narrative Generation → Report Generation
```

## 🎯 Core Adjustment Types

The system supports 28+ predefined adjustment types including:

- Executive Compensation
- Severance Payments
- One-Time Revenue
- Stock Compensation
- Litigation Costs
- Restructuring Costs
- Acquisition Costs
- IPO Costs
- Related Party Transactions
- And 19+ more categories

## 🔧 Development

### Project Structure

```
qoe-automation/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── core/          # Core configuration
│   │   ├── db/            # Database configuration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── workflows/     # LangGraph workflows
│   │   └── main.py        # FastAPI application
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main App component
│   ├── package.json
│   └── .env.local
└── README.md
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention with SQLAlchemy
- CORS configuration for frontend-backend communication

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. Set up production database (PostgreSQL)
2. Configure environment variables for production
3. Build frontend: `npm run build`
4. Deploy backend with gunicorn or similar WSGI server
5. Serve frontend with nginx or similar web server

## 📊 Monitoring & Logging

- LangSmith integration for AI workflow monitoring
- Application logging with Python logging
- Audit trail for all user actions
- Error tracking and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🔮 Future Enhancements

- OCR support for scanned documents
- Multi-client access control
- Mobile responsiveness
- Integration with external systems (NetSuite, Box, Google Drive)
- Custom model fine-tuning
- Advanced analytics and reporting

---

**Built with ❤️ for Quality of Earnings professionals**
