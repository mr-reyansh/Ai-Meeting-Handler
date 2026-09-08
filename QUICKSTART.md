# Quick Start Guide

## Prerequisites

- Node.js 16 or later
- npm
- An OpenAI API key for transcript processing
- Docker Desktop, if using the container workflow

## Local Development

Create the backend environment file:

```bash
cd backend
cp .env.example .env
```

Set `OPENAI_API_KEY` in `backend/.env`. The backend uses SQLite and creates its tables automatically; no separate database server is required.

Start the backend in one terminal:

```bash
npm install
npm start
```

Start the frontend in another terminal:

```bash
cd ../frontend
npm install
npm run dev
```

Open http://localhost:3000. The backend health check is available at http://localhost:5000/.

## Docker

From the repository root:

```bash
docker compose build
docker compose up
```

Stop the services with `docker compose down`. SQLite data is stored in the Compose `meeting-data` volume.

## Verify the API

```bash
curl http://localhost:5000/
```

Expected response:

```json
{"message":"AI Meeting Intelligence API is running"}
```

For the full architecture, design deliverables, API list, and environment notes, see [README.md](README.md).
