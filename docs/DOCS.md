# Lets Liink Demo — Runbook

## Quick start
```bash
cd /Users/dennyt/.openclaw/workspace/projects/lets-liink
python3 -m http.server 4173
# open http://127.0.0.1:4173
```

## Demo data
The app uses localStorage as state store with seed data.
- storage key: `letsliink-demo-state-v1`
- route key: URL hash (`#dashboard`, `#chat`, etc.)
- click "Reset Demo Data" to restore seed fixture

## What to expect
- Fully interactive UI demo (no backend required)
- Route persistence on refresh
- Event editing + status toggling
- Room request assignment/status updates
- Chat send/pin/archive
- Questions submission and status update
- Staff add/remove
- Shout-out create/broadcast
