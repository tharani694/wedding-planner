# 💍 Wedding Planner — Full Stack AI-Powered App

A complete wedding planning application with an agentic AI assistant built on Claude.

## Tech Stack
- **Frontend**: React 19, Vite, MUI, Apollo Client, Recharts
- **Backend**: Node.js, Express, Apollo Server (GraphQL), MongoDB/Mongoose
- **AI**: Anthropic Claude (claude-sonnet-4-20250514) with tool use
- **Auth**: JWT + bcrypt
- **Deploy**: Vercel (frontend) + Render (backend) + MongoDB Atlas

## Features
- 🔐 **Auth** — Register/Login with JWT
- 📊 **Dashboard** — RSVP pie chart, budget bar chart, live stats
- 🎉 **Events** — Wedding ceremonies with sub-events and dates
- 👥 **Guests** — RSVP tracking, dietary requirements, table assignment
- 🏪 **Vendors** — Status pipeline (lead → booked → paid)
- 🛒 **Marketplace** — Browse and add vendor profiles
- 💰 **Budget** — Categories with spend tracking, AI advice
- ✅ **Checklist** — AI-generated personalized task list
- 🤖 **AI Assistant** — Claude-powered chat with real data access (tool use)

## Quick Start

### 1. Clone and install
```bash
git clone https://github.com/yourusername/wedding-planner
cd wedding-planner
npm install
cd backend && npm install && cd ..
```

### 2. Environment variables
```bash
# Root .env
cp .env.example .env
# Edit VITE_GRAPHQL_URL

# Backend .env
cp backend/.env.example backend/.env
# Edit MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
```

### 3. Run locally
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
npm run dev
```

Open http://localhost:5173

## Deploy to Production

### Backend → Render
1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Set Root Directory: `backend`
4. Build: `npm install` | Start: `npm start`
5. Add all env vars from `backend/.env.example`

### Frontend → Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Set `VITE_GRAPHQL_URL` to your Render backend URL + `/graphql`
3. Deploy!

### Database → MongoDB Atlas
1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string → set as `MONGO_URI`
3. Whitelist `0.0.0.0/0` for Render IP

## AI Features
The AI assistant uses Claude's **tool use** to query your real data:
- `get_guests` — looks up guest list and RSVP status
- `get_vendors` — checks vendor booking status and prices
- `get_budget_summary` — calculates spend vs allocated
- `get_events` — lists all events and sub-events
- `get_checklist` — gets task completion status

Example prompts:
- "Which vendors haven't been booked yet?"
- "How much budget is left after Photography?"
- "Who hasn't RSVP'd from the main guest list?"
- "Give me tips to stay under budget"
