# Speak it. Schedule it. Done.

A simple reminder application that converts natural-language text into scheduled reminders using a deterministic time-parsing service.

## Features
- Natural-language reminder creation (e.g. “Call the dentist after 5 days at 3 PM”)
- Deterministic date & time extraction using Duckling
- FastAPI backend with clean service abstraction
- React frontend (Vite)
- SQLite persistence
- Fully Dockerized, one-command setup

## Tech Stack
### Backend
- FastAPI
- SQLAlchemy
- Duckling (via HTTP service)

### Frontend
- React (Vite)

### Database
- SQLite

### Infrastructure
- Docker
- Docker Compose

## How Date Parsing Works

Natural-language time expressions are parsed using Duckling, an open-source temporal entity extraction service originally developed at Meta (Facebook).

Duckling is:

- Rule-based and deterministic
- Capable of handling relative time expressions like “tomorrow”, “after 5 days”, “next Monday”
- Run as a separate Docker service, keeping the backend stateless and secure
- Free to use and does not require API keys

This approach avoids brittle regex logic and does not rely on paid third-party APIs.

## Setup (One Command)

```bash
docker compose up --build
