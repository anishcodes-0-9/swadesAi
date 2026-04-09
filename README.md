# SwadesAI

Fullstack engineering assessment project for an AI-powered customer support system with a multi-agent architecture.

## Goal

Build a fullstack application where a router agent analyzes incoming customer queries and delegates work to specialized sub-agents:

- Support Agent
- Order Agent
- Billing Agent

The system should maintain conversational context across messages, stream AI responses, and persist conversation history in a PostgreSQL database.

## Planned Stack

### Frontend

- React
- Vite
- TypeScript

### Backend

- Hono
- Vercel AI SDK
- TypeScript

### Database

- PostgreSQL
- Drizzle ORM

### Architecture

- Turborepo monorepo
- Hono RPC for end-to-end type safety
- Controller/service separation
- Middleware-based error handling

## Planned Monorepo Structure

```text
.
├── apps/
│   ├── api/        # Hono backend
│   └── web/        # React + Vite frontend
├── packages/
│   └── db/         # Drizzle schema, queries, seed scripts
└── turbo.json
```

## Features We Plan To Build

### Core

- Multi-agent backend with Router, Support, Order, and Billing agents
- AI-powered routing and fallback handling
- Streaming chat responses
- Conversation and message persistence
- User conversation history
- Database-backed tools for each agent
- Seeded sample business data for orders, payments, invoices, and conversations
- Clean API design with proper error handling

### Bonus Targets

- Turborepo monorepo setup
- Hono RPC end-to-end typing
- Agent reasoning / status loader in the UI
- Basic rate limiting
- Live deployment

## Planned API Surface

- `POST /messages` - send a new message
- `GET /conversations/:id` - fetch one conversation with history
- `GET /conversations` - list conversations
- `DELETE /conversations/:id` - delete a conversation
- `GET /agents` - list available agents
- `GET /agents/:type/capabilities` - fetch agent capabilities
- `GET /health` - health check

## Planned Database Models

- `conversations`
- `messages`
- `orders`
- `payments`
- `invoices`

## Delivery Plan

1. Scaffold Turborepo with `apps/web`, `apps/api`, and `packages/db`
2. Add PostgreSQL + Drizzle schema and seed data
3. Build router and sub-agent services with database-backed tools
4. Implement streaming Hono API endpoints
5. Build React chat UI with conversation list and thread view
6. Add loading states, typing indicators, and error handling
7. Deploy frontend and backend
8. Record Loom walkthrough and submit GitHub repo

## Deployment Plan

- Frontend: Vercel
- Backend: Railway or Render
- Database: Neon or Supabase Postgres

## Status

This repository is currently in the setup phase. The first milestone is scaffolding the monorepo and establishing the shared database package.
