# Holdings and Trades Chatbot

A React + Node.js application to analyze financial holdings and trades data via a conversational interface.

## Prerequisites
- Node.js (v16+)
- npm

## Quick Start (Recommended)
Simply run the startup script from the project root:
```bash
./start.sh
```
This will install all dependencies and launch both the backend and frontend automatically.

## Manual Setup & Run

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Start the backend server (runs on port 3001):
```bash
npm start
```

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 3. Usage
- Open your browser at the URL shown by Vite (usually `http://localhost:3000` or `5173`).
- Ask questions like:
  - "How many holdings does Garfield have?"
  - "Compare performance of all funds"
  - "What is the total market value of Heather's portfolio?"

## Data
The application uses CSV files located in `backend/data/`.
- `holdings.csv`
- `trades.csv`

Dummy data has been generated for testing. You can replace these files with real data matching the PRD schema.
