# Lets Liink

A lightweight prototype for a **Host Virtual Event Dashboard** inspired by your attached screenshots.

## Features
- Event dashboard (live metrics)
- New event creation/editing layout
- Chat and message inbox
- Room request queue and question moderation
- Results + multiple stats views
- Settings: staff management, layout config, shout-outs
- Mobile-friendly card-first layout

## Quick start
```bash
cd /Users/dennyt/.openclaw/workspace/projects/lets-liink
# serve locally (no build step required)
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Folder
- `index.html`
- `app.js`
- `styles.css`
- `README.md`

## Future improvements
- Add backend APIs (WebSocket chat, room assign engine)
- Auth + role-based permissions
- Event persistence with Supabase/Firebase
- Deployment to Vercel/Netlify
