# Lets Liink

A lightweight host dashboard for live virtual events.

## What this demo includes
- Interactive route-based dashboard inspired by provided screenshots
- Local storage-backed state (event, messages, questions, room requests, staff, shout-outs)
- URL hash routing (`#dashboard`, `#chat`, etc.)
- Room request assignment workflows
- Chat send + pin/archive
- Question queue + answer status
- Staff add/remove
- Settings + shout-out creation

## Files
- `index.html`
- `app.js`
- `data.js`
- `styles.css`
- `README.md`
- `engineering-plan.md`
- `docs/DOCS.md`
- `docs/API-CONTRACT.md`

## Local dev
```bash
cd /Users/dennyt/.openclaw/workspace/projects/lets-liink
python3 -m http.server 4173
```
Then open `http://127.0.0.1:4173`.

## Useful routes
- `#dashboard`
- `#chat`
- `#messages`
- `#room-requests`
- `#questions`
- `#settings-staff`
