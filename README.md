# Beleqet Interview Task Submission

## Candidate Information

**Name:** Mesele Abadi  
**Position:** Backend Developer Interview Task  
**GitHub Repository:** https://github.com/meseletech/beleqet-interview-task

---

# Project Overview

This repository contains my submission for the Beleqet Backend Developer Interview Task.

The project is a production-ready backend application developed using NestJS and PostgreSQL. It provides REST APIs for authentication, job management, freelance services, AI-powered candidate screening, notifications, escrow payments, and wallet management.

During this assessment, I successfully configured the development environment, started all required Docker services, synchronized the database with Prisma, and verified that the backend API was functioning correctly.

---

# Objectives Completed

The following tasks were completed successfully:

- Forked the original repository into my GitHub account.
- Cloned the repository to my local machine.
- Installed and configured Docker Desktop.
- Started Docker Engine using WSL2.
- Built all Docker images successfully.
- Started PostgreSQL, Redis, and Backend containers.
- Generated the Prisma Client.
- Synchronized the database schema.
- Verified Swagger documentation.
- Tested Authentication APIs.
- Verified protected API endpoints using JWT authentication.
- Successfully ran the backend on localhost.

---

# Development Environment

| Software | Version |
|----------|---------|
| Windows 11 | ✔ |
| Docker Desktop | ✔ |
| WSL2 | ✔ |
| Node.js | 20.x |
| PostgreSQL | 15 |
| Redis | 7 |
| Prisma | 5.x |
| NestJS | Latest |

---

# Project Setup

## 1. Clone Repository

```bash
git clone https://github.com/meseletech/beleqet-interview-task.git

cd beleqet-interview-task/backend
```

---

## 2. Start Docker

```bash
docker compose up
```

Docker automatically starts:

- PostgreSQL
- Redis
- Backend API

---

## 3. Verify Containers

```bash
docker ps
```

Running containers:

- beleqet-postgres
- beleqet-redis
- beleqet-backend

---

## 4. Backend URLs

### API

```
http://localhost:4000/api/v1
```

### Swagger

```
http://localhost:4000/api/docs
```

---

# Project Structure

```
backend/

├── prisma/
├── src/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── .env.example
```

---

# Main Modules

The backend contains the following modules:

- Authentication
- Users
- Jobs
- Applications
- Freelance
- Escrow
- Wallet
- Notifications
- Analytics
- Screening
- Uploads
- Admin

---

# Database

The application uses PostgreSQL with Prisma ORM.

Main models include:

- User
- Company
- Job
- JobCategory
- Application
- CandidateScore
- FreelanceJob
- Bid
- Contract
- Milestone
- Wallet
- WalletTransaction
- Notification
- EventLog
- EscrowTransaction

---

# Authentication Testing

## Register

```
POST /auth/register
```

Example

```json
{
  "email": "mesele@example.com",
  "password": "StrongPassword123!",
  "firstName": "Mesele",
  "lastName": "Abadi",
  "role": "JOB_SEEKER"
}
```

---

## Login

```
POST /auth/login
```

```json
{
  "email": "mesele@example.com",
  "password": "StrongPassword123!"
}
```

The login endpoint successfully returns:

- Access Token
- Refresh Token

These tokens can be used to access protected endpoints.

---

# API Verification

The following APIs were verified during testing.

## Authentication

- Register
- Login
- Refresh Token
- Logout
- Current User

---

## Users

- Profile
- Company
- Notifications

---

## Jobs

- Get Jobs
- Job Details
- Create Job
- Update Job
- Delete Job

---

## Applications

- Submit Application
- View Applications
- Update Status

---

## Freelance

- View Jobs
- Create Jobs
- Submit Bid
- Accept Bid
- Contracts
- Milestones

---

## Escrow

- Initiate Escrow
- Callback
- Release Milestone

---

## Wallet

- Wallet Balance
- Withdraw Funds

---

## Admin

- Users
- Disputes
- Suspend Users

---

# Docker Build Verification

The project built successfully using Docker Compose.

Services started successfully:

| Service | Status |
|----------|--------|
| PostgreSQL | ✅ Running |
| Redis | ✅ Running |
| Backend | ✅ Running |

---

# Runtime Verification

Backend successfully initialized with:

- Prisma connected to PostgreSQL
- Redis connected
- NestJS application started
- Swagger documentation generated
- REST API available
- Docker networking configured correctly

Application running at:

```
http://localhost:4000/api/v1
```

Swagger available at:

```
http://localhost:4000/api/docs
```

---

# Notes

During the first startup, the backend attempted to connect to PostgreSQL before the database had fully initialized. Docker automatically restarted the backend container, after which Prisma successfully connected and synchronized the database.

Warnings related to AWS credentials and Telegram Bot Token are expected because optional environment variables were not configured for local development.

The application is otherwise fully operational.

---

# Technologies Used

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- JWT Authentication
- Docker
- Docker Compose
- Swagger
- REST API

---

# Conclusion

The interview task was completed successfully.

I successfully:

- Configured the development environment.
- Started all required Docker services.
- Verified database connectivity.
- Generated the Prisma client.
- Successfully launched the backend.
- Verified the Swagger documentation.
- Tested the authentication APIs.
- Confirmed that the backend is functioning correctly.

Thank you for taking the time to review my submission.
