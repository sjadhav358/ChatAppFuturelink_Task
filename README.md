# MERN AI Flow App

A ready-to-run MERN task solution based on the provided PDF.

## Features
- React + React Flow frontend
- Input Node and Result Node connected by edge
- Run Flow button
- Backend API with Express
- OpenRouter AI call from backend
- MongoDB save functionality
- Saved history display (bonus)

## Project Structure
- `client/` - React + Vite frontend
- `server/` - Express + MongoDB backend

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env
# update OPENROUTER_API_KEY and MONGO_URI in .env
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Notes
- Use MongoDB local 
PORT=5000
MONGO_URI="mongodb://127.0.0.1:27017/admin"
OPENROUTER_API_KEY=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

- Current model: `openrouter/free`
- The PDF-listed free model IDs may be outdated on OpenRouter, so `openrouter/free` is used to automatically route to a currently available free model.