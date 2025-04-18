# COMP308 Healthcare Project

This project consists of a microservices-based backend with multiple frontend applications built using React and Vite.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Project Structure

```
├── backend/             # Backend services
│   ├── Gateway.js       # API Gateway
│   ├── health-service/  # Health microservice
│   ├── ai-service/      # AI microservice
│   └── AI-training/     # AI training data and models
└── frontend/            # Frontend applications
    ├── shell-app/       # Main application shell
    ├── auth-app/        # Authentication module
    ├── nurse-app/       # Nurse dashboard
    └── patient-app/     # Patient dashboard
```

## Installation

1. Install root dependencies:

   ```
   npm install
   ```

2. Install dependencies for each service:

   ```
   cd backend
   npm install

   cd backend/health-service
   npm install

   cd backend/ai-service
   npm install

   cd frontend/shell-app
   npm install

   cd frontend/auth-app
   npm install

   cd frontend/nurse-app
   npm install

   cd frontend/patient-app
   npm install
   ```

## Running the Application

The project uses `concurrently` to run multiple services simultaneously. You can start the entire application with just two commands:

1. Start all backend services:

   ```
   npm run start:backend
   ```

2. Start all frontend applications:
   ```
   npm run start:frontend
   ```

Alternatively, you can run individual services as described below:

### Running Individual Backend Services

1. Start the API Gateway:

   ```
   cd backend
   npm run dev
   ```

2. Start the Health Service:

   ```
   cd backend/health-service
   npm run dev
   ```

3. Start the AI Service:
   ```
   cd backend/ai-service
   npm run dev
   ```

### Running Individual Frontend Applications

1. Start the shell app:

   ```
   cd frontend/shell-app
   npm run dev
   ```

2. Start other frontend apps:

   ```
   cd frontend/auth-app
   npm run deploy

   cd frontend/nurse-app
   npm run deploy

   cd frontend/patient-app
   npm run deploy
   ```

## Accessing the Application

- Frontend shell: http://localhost:3000
- API Gateway: http://localhost:4001

## Environment Variables

The backend uses environment variables defined in `.env` files. The default configuration includes:

- PORT=4001 (Gateway)
- HEALTH_SERVICE_URL=http://localhost:4000/graphql
- AI_SERVICE_URL=http://localhost:4003/graphql
