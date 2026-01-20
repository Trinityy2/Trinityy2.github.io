# Personal Website

A modern full-stack personal website built with VueJS frontend, FastAPI backend, and Strapi CMS, all containerized with Docker.

## 🏗️ Architecture

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS + Pinia
- **Backend API**: FastAPI + Python + SQLAlchemy
- **CMS**: Strapi 4 with refresh token authentication
- **Database**: PostgreSQL with separate schemas
- **Storage**: Abstracted interface (Local/S3/CloudFlare R2)
- **Containerization**: Docker + Docker Compose
- **Repository**: Monorepo structure with shared TypeScript types

## 📁 Project Structure

```
personal-website/
├── packages/
│   ├── frontend/          # Vue 3 application
│   ├── api/              # FastAPI backend
│   ├── cms/              # Strapi CMS
│   └── shared/           # Shared TypeScript types
├── docs/                 # Project documentation
├── deployment/           # Infrastructure configuration
├── docker-compose.dev.yml    # Development environment
├── docker-compose.prod.yml   # Production environment
└── .env.example          # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.11+
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd personal-website
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**

   ```bash
   npm run install:all
   ```

4. **Start development environment**

   ```bash
   npm run dev
   ```

This will start:

- Frontend (Vue): <http://localhost:3000>
- Backend API (FastAPI): <http://localhost:8000>
- CMS (Strapi): <http://localhost:1337>
- Database (PostgreSQL): localhost:5432

### First Time Setup

1. **Create Strapi admin user**
   - Visit <http://localhost:1337/admin>
   - Create your admin account

2. **Configure authentication**
   - In Strapi admin, go to Settings > Users & Permissions > Roles
   - Configure permissions for Public and Authenticated roles

3. **Create content types** (if not auto-generated)
   - Blog Posts, Projects, Categories, Tags

## 🛠️ Development

### Package Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:build        # Rebuild and start all services

# Production
npm run prod             # Start production environment
npm run prod:build       # Build and start production

# Utilities
npm run stop             # Stop all services
npm run clean            # Clean up containers and volumes
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run test             # Run all tests
```

### Individual Package Development

```bash
# Frontend
cd packages/frontend
npm run dev              # Vue dev server
npm run build            # Build for production
npm run lint             # ESLint + Prettier

# Backend API
cd packages/api
python -m uvicorn main:app --reload    # Development server
python -m pytest                       # Run tests
flake8 .                               # Linting

# Strapi CMS
cd packages/cms
npm run develop          # Development mode
npm run build            # Build admin panel
npm run start            # Production mode

# Shared Types
cd packages/shared
npm run build            # Build TypeScript types
npm run dev              # Watch mode
```

## 📝 Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- **Database**: PostgreSQL connection settings
- **JWT Secrets**: Shared between Strapi and FastAPI
- **Storage**: Local, S3, or CloudFlare R2 configuration
- **Email**: SMTP settings for contact forms
- **URLs**: Service URLs for different environments

### Key Features Configured

- **Authentication**: Strapi refresh tokens validated by FastAPI
- **File Storage**: Abstracted interface for easy cloud migration
- **Content Management**: Hybrid approach (direct Strapi + FastAPI proxy)
- **Database Schemas**: Separate `strapi` and `app` schemas
- **CORS**: Properly configured for cross-origin requests

## 🚢 Deployment

### Production Build

```bash
# Build all services
npm run build

# Start production environment
npm run prod
```

### Docker Deployment

The project includes production-ready Docker configurations:

- **Multi-stage builds** for optimized image sizes
- **Non-root users** for security
- **Health checks** for service monitoring
- **Volume mounts** for data persistence

### Environment-Specific Configs

- **Development**: Hot reload, debugging enabled
- **Production**: Optimized builds, security hardening

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests
cd packages/frontend && npm run test

# Backend tests  
cd packages/api && python -m pytest

# Type checking
npm run type-check
```

## 📖 API Documentation

- **FastAPI Docs**: <http://localhost:8000/docs> (development only)
- **Strapi API**: <http://localhost:1337/documentation>

## 🔒 Security Features

- **Refresh Token Authentication**: Short-lived access tokens
- **JWT Validation**: Shared secret between services
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Pydantic models and Vue form validation
- **File Upload Security**: Type and size validation

## 📚 Technology Stack Details

### Frontend (Vue 3)

- **TypeScript**: Type safety
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Headless UI**: Accessible components
- **Vite**: Fast build tool

### Backend (FastAPI)

- **Pydantic**: Data validation
- **SQLAlchemy**: ORM
- **Alembic**: Database migrations
- **python-jose**: JWT handling
- **httpx**: HTTP client for Strapi integration

### CMS (Strapi)

- **PostgreSQL**: Database adapter
- **Refresh Tokens**: Enhanced security
- **Rich Text**: Content editing
- **Media Library**: File management
- **Role-based Access**: User permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
