# SaaS Backend Starter

This is a generic, modern and simple full SaaS backend + frontend starter template built with Go, Gin, and GORM with PostgreSQL and Typescript/Next.js on the frontend.

## Features

- RESTful API with Gin
- PostgreSQL database with GORM ORM
- Automatic database migrations
- Authentication middleware
- User management
- Organization management
- Project management
- Subscription management

## Prerequisites

- Go 1.24.3
- PostgreSQL 16+ (or Docker for containerized deployment)
- Docker and Docker Compose (recommended for development)

## Directory Structure

```
platform/backend/
├── config/         # Configuration loading
├── controllers/    # HTTP request handlers
├── db/             # Database setup and migrations
├── middleware/     # HTTP middleware
├── models/         # Database models
├── routes/         # API route definitions
├── utils/          # Utility functions
├── main.go         # Application entry point
├── go.mod          # Go module file
├── Dockerfile      # Docker configuration
└── README.md       # This file
```

## Architecture

### Overview

The application follows a layered architecture pattern:

1. **Routes Layer**: Defines API endpoints and connects them to controllers
2. **Middleware Layer**: Intercepts requests for authentication, logging, etc.
3. **Controller Layer**: Handles business logic and coordinates between models and responses
4. **Model Layer**: Represents database entities and relationships
5. **Database Layer**: Manages connections and migrations
6. **Utility Layer**: Provides shared functionality across the application

### Request Flow

1. Client sends HTTP request
2. Gin router matches the route
3. Middleware functions process the request (authentication, etc.)
4. Controller receives the request and extracts parameters
5. Controller performs business logic using models
6. Controller returns a standardized response

### Controller Design

The application uses a controller-based design with inheritance to promote code reuse:

#### BaseController

The `BaseController` provides common functionality used across all controllers:

- Authentication checks
- Database operations (create, read, update, delete)
- Access control verification

Controllers inherit from the BaseController to leverage these common methods, following the DRY principle.

### Authentication

JWT-based authentication is implemented:

1. User logs in with credentials
2. Server validates credentials and issues a JWT token
3. Client includes this token in the Authorization header for subsequent requests
4. Auth middleware validates the token and extracts the user ID
5. Controllers use the user ID for authorization checks

### Database Management

The application uses GORM for database operations and migrations:

- **Automatic Migrations**: Database schema is defined in the model structs and automatically applied at startup
- **Soft Deletes**: Records are marked as deleted rather than being physically removed
- **Relationships**: One-to-many and many-to-many relationships are managed through GORM

### Error Handling

Standardized error responses are provided through utility functions:

- Validation errors
- Authentication errors
- Authorization errors
- Server errors
- Not found errors

### Modularity and Extensions

The architecture is designed for modularity:

1. Add new models in the `models/` directory
2. Register them in `db/migrations.go` for automatic migrations
3. Create corresponding controllers in `controllers/`
4. Define routes in `routes/routes.go`

## Getting Started

### Using Docker Compose (Recommended)

The easiest way to run the full stack with PostgreSQL:

1. Clone the repository
2. Create a `.env` file in the root directory with your admin credentials:
   ```bash
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```
3. Start all services:
   ```bash
   docker-compose up -d
   ```
4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432

### Local Development

1. Clone the repository
2. Start PostgreSQL (or use Docker):
   ```bash
   docker run -d \
     --name postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=platform \
     -p 5432:5432 \
     postgres:16-alpine
   ```
3. Create a `.env` file in the backend directory:
   ```bash
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=platform
   DB_SSLMODE=disable
   
   # Server
   PORT=8080
   
   # JWT
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRY=24h
   
   # Admin Account
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```
4. Install Go dependencies:
   ```bash
   cd backend
   go mod download
   ```
5. Run the application:
   ```bash
   go run main.go
   ```

### Docker (Backend Only)

You can run just the backend using Docker:

```bash
cd backend
docker build -t saas-backend .
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=platform \
  saas-backend
```

## Database Migrations

Database migrations are handled automatically by GORM when the application starts. To add new tables or modify existing ones:

1. Update or add model definitions in the `models/` directory
2. Register the models in `db/migrations.go`

## API Endpoints

### Authentication

- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/refresh` - Refresh access token
- POST `/api/v1/auth/forgot-password` - Request password reset
- POST `/api/v1/auth/reset-password` - Reset password

### Users

- GET `/api/v1/users/me` - Get current user
- PUT `/api/v1/users/me` - Update current user
- DELETE `/api/v1/users/me` - Delete current user

### Organizations

- GET `/api/v1/organizations` - List organizations
- POST `/api/v1/organizations` - Create organization
- GET `/api/v1/organizations/:id` - Get organization
- PUT `/api/v1/organizations/:id` - Update organization
- DELETE `/api/v1/organizations/:id` - Delete organization

### Projects

- GET `/api/v1/projects` - List projects
- POST `/api/v1/projects` - Create project
- GET `/api/v1/projects/:id` - Get project
- PUT `/api/v1/projects/:id` - Update project
- DELETE `/api/v1/projects/:id` - Delete project

### Subscriptions

- GET `/api/v1/subscriptions` - List subscriptions
- GET `/api/v1/subscriptions/:id` - Get subscription 
