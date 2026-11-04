# 🏠 HomeServe Technologies

**A modern SaaS-based Home Services Booking Platform** that connects customers with professional service providers.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Overview

HomeServe Technologies is a comprehensive marketplace platform where:
- **Customers** can discover services, compare providers, book appointments, make payments, and submit reviews
- **Service Providers** can manage their services, technicians, pricing, availability, and earnings
- **Technicians** can view and complete assigned jobs with status tracking
- **Administrators** can manage the entire platform through a centralized dashboard

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React + Vite  │────▶│  FastAPI Backend │────▶│   MySQL 8.0     │
│   Tailwind CSS  │     │  Python 3.12+   │     │   Database      │
│   Port: 5173    │     │   Port: 8000    │     │   Port: 3306    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
              ┌──────────┐ ┌────────┐ ┌───────────┐
              │ Razorpay │ │Cloudinary│ │  Email   │
              │ Payments │ │  Media  │ │  Service │
              └──────────┘ └────────┘ └───────────┘
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Pydantic v2 |
| Database | MySQL 8.0 |
| Auth | JWT (python-jose), Bcrypt |
| Payments | Razorpay (Test Mode) |
| File Storage | Cloudinary |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Testing | Pytest, Playwright |

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)
- MySQL 8.0+ (or use Docker)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/homeserve-technologies.git
cd homeserve-technologies

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👥 User Roles

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@homeserve.com | Admin@123 |
| Customer | rahul.sharma@email.com | Customer@123 |
| Provider | cleanpro@email.com | Provider@123 |
| Technician | tech.ravi@email.com | Tech@123 |

> ⚠️ **Note**: All seed accounts use the same hash for development convenience. Change all passwords in production.

## 📁 Project Structure

```
homeserve-technologies/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components by role
│   │   ├── layouts/       # Layout components
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── routes/        # Route configuration
│   │   └── utils/         # Utility functions
│   ├── Dockerfile
│   └── package.json
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/v1/        # API route handlers
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── core/          # Config, security, deps
│   │   └── database/      # Database session
│   ├── tests/             # Pytest tests
│   ├── Dockerfile
│   └── requirements.txt
├── database/              # SQL scripts
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD
├── docker-compose.yml
└── README.md
```

## 🔌 API Documentation

The API is documented using Swagger/OpenAPI. Access the interactive docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `POST /api/v1/auth/register` | User registration |
| Auth | `POST /api/v1/auth/login` | User login |
| Services | `GET /api/v1/services` | Browse services |
| Providers | `GET /api/v1/providers` | List providers |
| Bookings | `POST /api/v1/bookings` | Create booking |
| Payments | `POST /api/v1/payments/create-order` | Create payment |
| Reviews | `POST /api/v1/reviews` | Submit review |

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm run test
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

