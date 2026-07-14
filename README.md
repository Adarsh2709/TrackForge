

## Architecture Overview

TrackForge adopts a decoupled architecture:

*   **Backend System**: A RESTful API built with Spring Boot 3.5.3 and Java 22. It utilizes Spring Security for robust JWT-based authentication and MongoDB as the primary persistence layer.
*   **Frontend System**: A modern single-page application built with Next.js 15 (App Router) and TypeScript. The user interface leverages Tailwind CSS, Shadcn UI components, and Framer Motion for a sophisticated, highly responsive user experience.

## Technology Stack

### Backend
*   Java 22
*   Spring Boot 3.5.3
*   Spring Security (JWT Authentication)
*   Spring Data MongoDB
*   Lombok
*   Gradle

### Frontend
*   Next.js 15 (App Router)
*   TypeScript
*   Tailwind CSS v4
*   Shadcn UI (Radix Primitives)
*   React Hook Form + Zod (Validation)
*   Axios

## Prerequisites

Ensure the following dependencies are installed on your system before proceeding:

*   Java Development Kit (JDK) 22
*   Node.js (v18.0 or later) and npm
*   MongoDB (running locally on default port 27017)

## Getting Started

### 1. Database Configuration

Ensure your local MongoDB instance is running. TrackForge expects a local MongoDB connection without authentication by default:
`mongodb://localhost:27017/trackforge`

If your MongoDB requires authentication, create an `application-local.properties` file in `backend/src/main/resources/` with the appropriate connection string.

### 2. Backend Initialization

Navigate to the `backend` directory, compile the application, and start the Spring Boot server.

```bash
cd backend
./gradlew build
./gradlew bootRun
```

The REST API will initialize and bind to `http://localhost:8080`.

### 3. Frontend Initialization

Open a secondary terminal session. Navigate to the `frontend` directory, install the required node modules, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

The Next.js frontend will initialize and bind to `http://localhost:3000`. 

## AWS ECS Deployment

TrackForge can be deployed to AWS Elastic Container Service (ECS) using Fargate. 

### 1. Build and Push Images
Build the Docker images and push them to your Amazon ECR repositories (`trackforge-backend` and `trackforge-frontend`). Ensure your AWS CLI is authenticated.

### 2. Infrastructure Setup
Provision the following AWS resources via the AWS Console or Infrastructure as Code:
- **ECS Cluster**: Create a Fargate cluster.
- **Task Definitions**: Define tasks for backend and frontend. The frontend task requires the `NEXT_PUBLIC_API_URL` environment variable pointing to the backend's Application Load Balancer. The backend task requires `SPRING_DATA_MONGODB_URI` and `GEMINI_API_KEY`.
- **Services & ALBs**: Create ECS services for both tasks and attach them to Application Load Balancers for public accessibility.

## Core Features

*   **Secure Authentication**: Role-based access control and JWT session management.
*   **Issue Lifecycle Management**: Create, view, update, and manage the state of software issues.
*   **Advanced Data Visualization**: Comprehensive dashboard metrics identifying system bottlenecks, critical alerts, and completion ratios.
*   **Adaptive Theming**: Native support for system-integrated Light and Dark mode interfaces.
*   **RESTful Integrations**: Standardized JSON endpoints allowing integration with third-party CI/CD tools or custom clients.

## API Specification

The backend exposes the following primary endpoints under the `/api/v1` namespace:

### Authentication
*   `POST /auth/register` - Register a new user account.
*   `POST /auth/login` - Authenticate an existing user and retrieve a JWT.

### Issues (Requires Bearer Token)
*   `GET /issues` - Retrieve all issues.
*   `GET /issues/{id}` - Retrieve detailed information for a specific issue.
*   `POST /issues` - Create a new issue.
*   `PUT /issues/{id}` - Update the state or metadata of an existing issue.
*   `DELETE /issues/{id}` - Remove an issue from the system.

All secured endpoints require the `Authorization` header to be present with the format `Bearer <token>`.

## License

This project is proprietary and confidential. Unauthorized copying or distribution of this software is strictly prohibited.
