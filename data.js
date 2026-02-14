const initialState = {
  event: {
    id: 'event_demo_001',
    title: 'Spring Founders Mixer',
    host: 'Jordan Reed',
    attendees: 438,
    rooms: 12,
    rsvp: 286,
    joined: 154,
    status: 'live',
    type: 'virtual',
    slug: 'spring-founders-mixer',
  },
  metrics: {
    clicks: 1240,
    totalQuestions: 24,
    answeredQuestions: 15,
    messagesIn: 112,
    shoutoutsSent: 9,
  },
  roomList: [
    { id: 'r01', name: 'Room 01', capacity: 30, currentOccupancy: 18, status: 'Open' },
    { id: 'r02', name: 'Room 02', capacity: 35, currentOccupancy: 30, status: 'Almost full' },
    { id: 'r03', name: 'Room 03', capacity: 24, currentOccupancy: 12, status: 'Open' },
    { id: 'r04', name: 'Room 04', capacity: 40, currentOccupancy: 27, status: 'Open' },
    { id: 'r05', name: 'Room 05', capacity: 26, currentOccupancy: 18, status: 'Open' },
    { id: 'r06', name: 'Room 06', capacity: 28, currentOccupancy: 20, status: 'Open' },
  ],
  questions: [
    { id: 'q1', who: 'Maya', text: 'Is there a wheelchair friendly entrance?', status: 'Queued' },
    { id: 'q2', who: 'Toby', text: 'Can we request a Q&A at 8:30?', status: 'Answered' },
    { id: 'q3', who: 'Luis', text: 'Will recordings be shared after event?', status: 'Pending' },
    { id: 'q4', who: 'Noah', text: 'Can we request breakout links in the lobby?', status: 'Queued' },
  ],
  messages: [
    { id: 'm1', who: 'Host', text: 'Welcome everyone to the session! We are going live in 10 minutes.', scope: 'chat', delivered: true, pinned: false },
    { id: 'm2', who: 'Ava', text: 'Can we get the deck link?', scope: 'chat', delivered: true, pinned: false },
    { id: 'm3', who: 'Host', text: 'Absolutely. Sending now in the chat.', scope: 'chat', delivered: true, pinned: true },
  ],
  roomRequests: [
    { id: 'rr1', name: 'Jasmine', roomId: 'r04', status: 'Assigned' },
    { id: 'rr2', name: 'Kai', roomId: '', status: 'Pending' },
    { id: 'rr3', name: 'Noah', roomId: '', status: 'Need follow-up' },
  ],
  staff: [
    { id: 's1', name: 'Jordan Reed', role: 'Owner', scope: 'All rooms' },
    { id: 's2', name: 'Maya Lopez', role: 'Co-Host', scope: 'Stage + Q&A' },
    { id: 's3', name: 'Dina Shaw', role: 'Moderator', scope: 'Chat Review' },
  ],
  shoutouts: [
    { id: 'sh1', text: 'Welcome note from keynote speaker', status: 'active' },
    { id: 'sh2', text: 'Top contributor: @Kai', status: 'active' },
    { id: 'sh3', text: 'Shout out to Room 03 team for great activity', status: 'active' },
  ],
  activity: [
    { id: 'a1', text: 'Maya submitted a room request for Room 04.', at: '2m ago' },
    { id: 'a2', text: 'User added new question: "Will there be recordings?"', at: '4m ago' },
    { id: 'a3', text: '11 shout-outs delivered to stage.', at: '6m ago' },
    { id: 'a4', text: '2 room requests were assigned in under 1 minute.', at: '11m ago' },
  ],
};

const demoStorageKey = 'letsliink-demo-state-v1';

const getStoredState = () => {
  const raw = localStorage.getItem(demoStorageKey);
  if (!raw) return JSON.parse(JSON.stringify(initialState));
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(initialState));
  }
};

const saveState = (state) => {
  localStorage.setItem(demoStorageKey, JSON.stringify(state));
};
