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

## Running the Backend

1. Install dependencies:

   ```
   cd backend
   npm install
   ```

2. Start the API Gateway:

   ```
   npm run dev
   ```

3. For each microservice, navigate to its directory and install dependencies:

   ```
   cd backend/health-service
   npm install
   npm run dev
   ```

   Repeat for other services (ai-service, etc.)

## Running the Frontend

1. Install dependencies for each frontend app:

   ```
   cd frontend/shell-app
   npm install
   ```

   Repeat for other apps (auth-app, nurse-app, patient-app)

2. Start the shell app:

   ```
   cd frontend/shell-app
   npm run dev
   ```

3. Start other frontend apps (in separate terminals):

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
