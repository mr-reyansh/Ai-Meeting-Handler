# AI Meeting Intelligence System

A full-stack application that converts meeting transcripts into structured summaries, tasks, and decisions using an AI service and a relational database.

## Current Technology Stack

- **Frontend:** React 18 with Vite and Axios
- **Backend:** Node.js with Express and Axios
- **Runtime database:** SQLite, initialized by `backend/db.js`
- **AI service:** OpenAI Chat Completions API
- **Development:** npm, Nodemon, Docker Compose

The repository also retains [`schema.sql`](schema.sql) as the original Oracle SQL reference for the assignment. The current application runtime uses SQLite and does not require Oracle.

## Repository Structure

```text
frontend/                 React/Vite application
backend/                  Express API, AI integration, and SQLite access
database/                 Database documentation and schema notes
design/                   Architecture, Figma, and assignment deliverables
docker-compose.yml        Local multi-container development configuration
schema.sql                Original Oracle SQL reference
docs/                     Additional project documentation when added
```

## Application Features

- Submit a meeting title and transcript for AI processing
- Extract a summary, assigned tasks, and key decisions
- Browse meetings and meeting details from the dashboard
- Update task status and retain task update history
- Persist application data in SQLite

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend health check |
| `POST` | `/api/meeting` | Create a meeting from a transcript |
| `GET` | `/api/meetings` | List meetings and item counts |
| `GET` | `/api/meeting/:meetingId` | Get one meeting |
| `GET` | `/api/tasks/:meetingId` | Get meeting tasks |
| `POST` | `/api/tasks/update` | Update task status and history |
| `GET` | `/api/decisions/:meetingId` | Get meeting decisions |

## Software Design

### Architecture

The system follows a modular layered client-server architecture. The main request flow is:

```text
User
  -> React Frontend
  -> REST API
  -> Node.js/Express Backend
  -> AI Service
  -> Database
```

The React client provides the user interface, the Express server exposes the REST API and coordinates application work, the AI service extracts structured meeting information, and SQLite stores the resulting records. Docker Compose packages the frontend and backend into repeatable local services; deployment can use the same separated service boundaries with environment-specific configuration and secrets.

[View Architecture Diagram](./design/architecture/AI-Meeting-Architecture.png)

The architecture source and exported PNG are included in [`design/architecture/`](design/architecture/).

### UI Design

The Review 2 design scope covers six primary screens:

1. Login
2. Dashboard
3. Upload Transcript
4. Meeting Details
5. Tasks
6. Profile

The current implementation includes the upload, dashboard/meeting-details, and task-management workflows. Login and profile are part of the design deliverable scope and are not currently implemented as application routes.

- [Login Screen](./design/figma/login.png)
- [Dashboard](./design/figma/dashboard.png)
- [Upload Transcript](./design/figma/upload-transcript.png)
- [Meeting Details](./design/figma/meeting-details.png)
- [Tasks](./design/figma/tasks.png)
- [Profile](./design/figma/profile.png)

The six final Figma exports are included in [`design/figma/`](design/figma/).

### Design Principles

- **Abstraction:** Database and AI access are isolated behind backend modules.
- **Modularity:** Frontend components, API routes, database access, and AI integration have focused responsibilities.
- **High cohesion:** Each module groups behavior around one concern, such as task operations or transcript extraction.
- **Low coupling:** The frontend communicates through HTTP endpoints rather than depending on database implementation details.
- **Separation of concerns:** Presentation, API orchestration, external AI calls, persistence, and deployment configuration remain distinct.

### Design Decisions

1. **REST API separation:** A REST boundary keeps the React client independent from backend and database implementation changes.
2. **Reusable frontend components:** Upload, dashboard, and task components isolate user workflows and make later screen changes localized.
3. **Service-layer separation:** AI extraction lives in `backend/ai.js`, while persistence lives in `backend/db.js`, so providers and storage can evolve independently.
4. **Docker-based development:** Compose gives the frontend and backend consistent local startup commands without embedding secrets in images.
5. **Centralized error handling:** Express middleware and route-level responses provide a consistent API error path for clients and operators.

### Maintainability

The layered structure makes future changes easier because AI providers, database implementations, UI components, APIs, and deployment infrastructure can be changed independently where practical. The SQLite schema is initialized by the backend for local development, while the database boundary leaves room for a managed relational database in a later deployment.

## Quick Start – Local Development

### Prerequisites

- Git
- Node.js 16 or later
- npm
- Docker Desktop (for the container workflow)
- An OpenAI API key for transcript processing

### Clone

```bash
git clone https://github.com/mr-reyansh/Ai-Meeting-Handler.git
cd Ai-Meeting-Handler
```

### Environment

Copy `backend/.env.example` to `backend/.env` and set `OPENAI_API_KEY`. `PORT` defaults to `5000`; `DB_PATH` defaults to `backend/database.sqlite` when the variable is omitted. Never commit `.env` or real credentials.

### Docker

Docker Desktop must be installed locally before running these commands. Docker was not tested in the current development environment because Docker is not installed there.

From the repository root:

```bash
docker compose build
docker compose up
```

The Compose setup stores SQLite data in a named volume and passes the OpenAI key through the host environment. Stop the services with:

```bash
docker compose down
```

Set `OPENAI_API_KEY` in the shell or an untracked root `.env` file before starting Compose if transcript processing is required.

### Local URLs

- Frontend: http://localhost:3000
- Backend health check: http://localhost:5000/
- Backend API base: http://localhost:5000/api

### Run Without Docker

Backend terminal:

```bash
cd backend
npm install
npm start
```

Frontend terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development proxy forwards `/api` requests to `http://localhost:5000` by default. Docker overrides that target with the backend service name.

## Local Development Tools

- VS Code
- Git and GitHub
- Node.js and npm
- Docker Desktop and Docker Compose
- Figma and Draw.io for assignment design deliverables
- SQLite-compatible database tools for inspecting local runtime data

## Branching Strategy

This project uses GitHub Flow:

```text
main
  -> feature/<feature-name>
  -> Pull Request
  -> Review
  -> Merge into main
```

For this assignment, the changes are on the `feature/software-design` branch.

## Database Design

The runtime database contains meetings, transcripts, tasks, decisions, and task update history. Foreign keys preserve relationships, and task updates retain status-change history. The backend creates the SQLite tables automatically on startup.

The original Oracle DDL is retained in [`schema.sql`](schema.sql) as an assignment reference; it is not the active runtime schema.

## Assignment Deliverables

The final software design deliverables are included in the repository:

- [Architecture source](./design/architecture/AI-Meeting-Architecture.drawio)
- [Architecture diagram](./design/architecture/AI-Meeting-Architecture.png)
- [Software Design Document](./design/Software-Design-Document.pdf)

The six final Figma screen exports are available in [`design/figma/`](design/figma/).
