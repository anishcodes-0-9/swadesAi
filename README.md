# SwadesAI

AI-powered multi-agent customer support system — built as a fullstack engineering assessment.

**Live Demo:** [https://swades-ai-web-qfd9.vercel.app/](https://swades-ai-web-qfd9.vercel.app/)

---

## Overview

SwadesAI routes user queries to specialized AI agents based on intent:

- **Support Agent** — troubleshooting and general help
- **Order Agent** — order status, shipping, and tracking
- **Billing Agent** — invoices, payments, and refunds

Conversations are persisted in PostgreSQL, responses are streamed, and a chat UI ties it all together.

---

## Tech Stack

| Layer    | Tech                                  |
| -------- | ------------------------------------- |
| Frontend | React, Vite, TypeScript               |
| Backend  | Hono, TypeScript, Vercel AI SDK       |
| AI       | OpenAI API                            |
| Database | PostgreSQL, Drizzle ORM               |
| Infra    | Turborepo, pnpm, Vercel, Render, Neon |

---

## Features

- AI router agent for intent classification
- Specialized support, order, and billing agents
- Streamed responses from backend to UI
- PostgreSQL-backed conversation and message persistence
- Sidebar-based conversation switching and new chat flow
- Request validation and structured error responses

### API Endpoints

```
GET    /health
GET    /agents
GET    /agents/:type/capabilities
GET    /conversations
GET    /conversations/:id
DELETE /conversations/:id
POST   /messages
POST   /messages/stream
```

---

## Monorepo Structure

```
.
├── apps/
│   ├── api/        # Hono backend
│   └── web/        # React + Vite frontend
├── packages/
│   └── db/         # Drizzle schema, client, migrations, seed
└── turbo.json
```

---

## How To Run Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL
brew services start postgresql@14

# 3. Create the database
createdb swades_ai

# 4. Add environment variables (.env at root)
DATABASE_URL=postgres://YOUR_USERNAME@localhost:5432/swades_ai
OPENAI_API_KEY=your_openai_api_key_here

# 5. Migrate and seed
export $(grep -v '^#' .env | xargs)
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 6. Run backend (http://localhost:3001)
pnpm --filter api dev

# 7. Run frontend (http://localhost:5173)
pnpm --filter web dev
```

---

## Environment Variables

**Backend**

```env
DATABASE_URL=your_neon_connection_string
OPENAI_API_KEY=your_openai_api_key
PORT=10000
```

**Frontend**

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

---

## Suggested Test Prompts

| Agent   | Prompt                                                    |
| ------- | --------------------------------------------------------- |
| Support | `I can't log in to my account. What should I do?`         |
| Order   | `Where is my order? Can you show me the tracking status?` |
| Billing | `Did my payment go through? Check my invoice status.`     |
| Mixed   | `My order was cancelled and I need a refund.`             |

---

## Architectural Notes

- **Hono** — lightweight and fast, ideal for a TypeScript backend without boilerplate
- **Drizzle ORM** — typed schema definitions, clean migrations, minimal overhead
- **Multi-agent separation** — support, order, and billing are distinct enough to warrant focused agents
- **Streaming** — creates a realistic assistant UX matching modern chat expectations
- **Render + Vercel + Neon** — fastest reliable deployment path for this stack

---

## Known Tradeoffs

- Demo-style identity model (no auth)
- Conversation titles generated simply from the first prompt
- Multi-intent routing not yet deeply optimized
- Delete chat not yet surfaced in the frontend UI

---

## Future Improvements

- Smarter conversation title generation
- Improved multi-intent routing
- Delete chat in the frontend
- Rate limiting and context compaction
- Richer streaming indicators and agent status chips

---

## Author

Built by **Anish Krishnan** as a fullstack engineering assessment.
