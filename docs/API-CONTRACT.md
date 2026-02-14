# Lets Liink API Contract (Demo Scope)

This repo currently runs as a client-only demo. Backend endpoints below are for the next phase.

## v1 (Planned)

### GET /api/events/:eventId
Returns event metadata and dashboard aggregates.

### PATCH /api/events/:eventId
Update event title, host, type, timezone, status.

### GET /api/events/:eventId/rooms
Returns room list with occupancy and status.

### POST /api/events/:eventId/rooms/:roomId/assign
Assign requester to room.

### GET /api/events/:eventId/requests
Returns room requests.

### PATCH /api/events/:eventId/requests/:requestId
Update request status/assigned room.

### GET /api/events/:eventId/messages
Return chat/messages.

### POST /api/events/:eventId/messages
Post message.

### GET /api/events/:eventId/questions
Return queue.

### PATCH /api/events/:eventId/questions/:questionId
Answer/unanswer/review questions.

### GET /api/events/:eventId/results
Return stats object.

### POST /api/events/:eventId/staff
Add staff member.

### DELETE /api/events/:eventId/staff/:staffId
Remove staff member.

### POST /api/events/:eventId/shoutouts
Add shoutout.

### POST /api/events/:eventId/shoutouts/:id/broadcast
Broadcast shoutout.
