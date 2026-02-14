# Lets Liink — Engineering Plan (Initial) 

## 1) What’s currently in the repo

### Scope built so far
This is a frontend-only MVP scaffold inspired by the attached dashboard screenshots.

Files:
- `index.html` — shell + sidebar navigation + content mount point
- `styles.css` — dark dashboard UI styling, responsive cards, nav, tables, chips
- `app.js` — in-memory state and route-driven template rendering
- `README.md` — quick start + feature list

### Existing implemented screens
- Dashboard (`dashboard`)
- New Event (`new-event`)
- Chat (`chat`)
- Messages (`messages`)
- Room Requests (`room-requests`)
- Questions (`questions`)
- New Question (`new-question`)
- Results (`results`)
- Stats views
  - `stats-attending`
  - `stats-rsvp`
  - `stats-rooms`
  - `stats-rooms-joined`
  - `stats-room-details`
- Settings
  - `settings`
  - `settings-staff`
  - `settings-layout`
  - `settings-shoutouts`

Repository is currently a static prototype with mock state (hardcoded arrays) and no persistence.

---

## 2) Current app state assessment (engineering view)

### What’s good
- Clean shell separation between navigation + content area.
- Fast, no build-step dev setup.
- Good screen coverage vs screenshot set.
- Reusable data-driven rendering (e.g., cards/list views from state arrays).

### Gaps to close before production
- No real backend (no API/storage/auth).
- No routing persistence (page reload resets route/state).
- No WebSocket / live sync (chat/messages are static).
- No room assignment + moderation workflows.
- No admin access control (anyone can act on host features).
- Randomized room data in `stats-room-details` means inconsistent UI (non-deterministic behavior).
- Repeated hardcoded text in multiple screens should be normalized.
- No tests, linting, CI, or type safety.
- No deployment config (Vercel/Netlify/Cloudflare Pages wiring not added).

---

## 3) Recommended engineering direction

Given this is a dashboard app with real-time interaction, the path I recommend:

### Phase 1: Stabilize MVP (2–3 days)
- Convert to framework app (React + Vite) for maintainability.
- Replace inline `alert()` with inline toast/notification.
- Move state into typed stores/services.
- Persist route + event in local URL state.
- Fix mock data issues.
- Add form validation and basic UI tests.

### Phase 2: Build core backend APIs (4–6 days)
- Add backend service (FastAPI/Node) with auth + event CRUD:
  - `POST /api/events`
  - `GET /api/events/:id`
  - `PATCH /api/events/:id`
  - `GET /api/events/:id/metrics`
  - `GET /api/events/:id/rooms`
  - `POST /api/events/:id/messages`
  - `POST /api/events/:id/questions`
  - `PATCH /api/events/:id/requests/:id`
- Add persistent storage (PostgreSQL).
- Add role model: **Owner, Co-host, Moderator, Viewer**.

### Phase 3: Real-time layer (3–4 days)
- Add WebSocket/WS (or SSE for read-mostly parts) for:
  - chat stream
  - live room request updates
  - new questions
  - shout-outs and status banners
- Add optimistic UI updates + reconciliation.

### Phase 4: Production hardening (2–3 days)
- Auth/session flow (email/OAuth)
- Permissions per feature by role
- Audit logs (who assigned what, who removed users, moderation actions)
- Input sanitization + rate limits
- API auth, CORS, and error handling

### Phase 5: UX refinement + launch (2–3 days)
- Align all screens to design tokens + spacing tokens
- Empty/error/loading states
- Full mobile behavior (including fixed CTA, sticky actions)
- Add onboarding and sample data mode
- Deployment pipeline (GitHub Actions + deploy to Vercel)

---

## 4) Suggested architecture (target)

### Frontend
- **Framework:** React (Vite) + TypeScript
- **State:** React Query + Zustand/Redux Toolkit (light)
- **UI:** Tailwind (or CSS modules + tokens)
- **Routing:** React Router (`/dashboard`, `/events/:eventId/...`)

### Backend
- **Option A (fast):** Next.js API routes + Prisma + Neon/Postgres
- **Option B:** FastAPI + SQLModel + PostgreSQL
- **Real-time:** Socket.IO or WebSocket + Redis pub/sub for scaling

### Data model (core)
- `users`, `events`, `rooms`, `messages`, `questions`, `requests`, `shoutouts`, `staff_roles`, `event_metrics`

### Deployment
- Frontend + backend in one monorepo
- Vercel + managed Postgres (or Supabase)
- GitHub Actions for lint/test/build

---

## 5) Detailed feature map (from attached screenshot set)

| Screenshot group | Required feature |
|---|---|
| Dashboard | KPI cards (attendees/RSVP/rooms), live status, activity stream |
| Chat/Messages | real-time feed, moderation flagging, pin/archive |
| Room Requests | request queue, assign/reassign, room capacity checks |
| Questions | Q&A submit/reply/status, featured queue |
| Results/Stats | attendance + RSVP breakdown, room metrics, details table |
| New Event | event metadata + draft/publish + settings copy |
| Settings > Staff | role assignment, invite/remove/update role |
| Settings > Layout | modular component ordering + section toggles |
| Settings > Shout-outs | compose/shcedule/broadcast messages |

---

## 6) Minimum viable backend contract (v1)

### Event
- `id`, `title`, `slug`, `type`, `hostId`, `status`, `startTime`, `timezone`, `createdAt`

### Room
- `id`, `eventId`, `name`, `capacity`, `status`, `currentOccupancy`

### Message
- `id`, `eventId`, `authorId`, `body`, `scope(chat|system)`, `createdAt`, `deletedAt?`, `isPinned?`

### Question
- `id`, `eventId`, `body`, `askedBy`, `status`, `createdAt`, `answeredAt?`

### Request
- `id`, `eventId`, `requesterId`, `roomId`, `priority`, `status`, `createdAt`, `resolvedAt?`

### Shoutout
- `id`, `eventId`, `text`, `status` (draft/queued/live/archive), `createdAt`

---

## 7) Quality plan

### Tests
- Unit: state helpers, formatting, validation (Vitest)
- Component: core views + actions (Playwright/Cypress)
- API: endpoint contracts (supertest/fetch)
- E2E: host flow
  - create event
  - receive request
  - assign room
  - send shout-out
  - answer question

### Monitoring
- Basic usage metrics
- Error rates + WS disconnect events
- P95 route latency
- Retry/reconnect visibility

### Security
- CSRF if session-based auth; otherwise signed JWT with short expiry
- Per-action RBAC
- Rate limits on message/question endpoints
- Input sanitization on all user-generated content

---

## 8) Proposed implementation plan (2-week rollout)

### Week 1
1. **Day 1–2:** Foundation + route/state cleanup + deterministic UI state
2. **Day 3–4:** API scaffolding + DB schema + auth starter
3. **Day 5:** Event + room + message endpoints + tests

### Week 2
1. **Day 1–2:** Real-time pipeline + moderation endpoints
2. **Day 3:** Settings flows + staff/roles + shout-outs
3. **Day 4:** QA + accessibility + mobile fixes
4. **Day 5:** Deployment + launch checklist

---

## 9) Immediate next actions (you can approve)

1. I should now:
   - remove `Math.random()` room values and replace with backend-like deterministic mock fixture,
   - add a `docs/` folder containing this plan + API contract,
   - and scaffold the project as Vite + React (if you want that direction).

2. After sign-off, I’ll branch to either:
   - **`react-restructure`** (cleaner long-term build), or
   - **`static-hardening`** (keep HTML/CSS/JS for faster delivery).

---

## 10) Repo links

- GitHub: https://github.com/Digital-ZEL/lets-liink
- Local path: `/Users/dennyt/.openclaw/workspace/projects/lets-liink`
