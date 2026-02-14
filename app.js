const screen = document.getElementById('screen');
const title = document.getElementById('title');
const navButtons = Array.from(document.querySelectorAll('.nav'));

let state = getStoredState();

const formatDate = (label) => `${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;

const setStatus = (text) => {
  const pill = document.querySelector('.status-pill');
  if (pill) pill.textContent = text;
};

const pushActivity = (text) => {
  state.activity.unshift({ id: `a${Date.now()}`, text, at: 'Just now' });
  state.activity = state.activity.slice(0, 6);
};

const templateDashboard = () => `
  <div class="panel">
    <div class="stat-grid">
      <div class="stat"><div class="small">Attendees</div><b>${state.event.attendees}</b></div>
      <div class="stat"><div class="small">RSVP</div><b>${state.event.rsvp}</b></div>
      <div class="stat"><div class="small">Rooms</div><b>${state.event.rooms}</b></div>
    </div>
    <div class="card">
      <h3>Event Snapshot</h3>
      <div class="row">
        <span class="pill">${state.event.title}</span>
        <span class="pill">Host: ${state.event.host}</span>
        <span class="pill">${state.event.status.toUpperCase()}</span>
        <span class="pill">${state.metrics.messagesIn} messages</span>
      </div>
      <div class="row">
        <button class="btn" data-action="toggle-live">${state.event.status === 'live' ? 'Pause Event' : 'Go Live'}</button>
        <button class="btn" data-action="seed-reset">Reset Demo Data</button>
        <button class="btn" data-action="seed-refresh">Refresh Data</button>
      </div>
    </div>
    <div class="card">
      <h3>Recent Activity</h3>
      <div class="feed">${state.activity.map(a => `<div class="msg">${a.text} <span class="small">· ${a.at}</span></div>`).join('')}</div>
    </div>
  </div>
`;

const templateNewEvent = () => `
  <div class="panel">
    <div class="card">
      <h3>New Event</h3>
      <div class="input"><label>Event Title</label><input value="${state.event.title}" id="eventName"/></div>
      <div class="input"><label>Host Name</label><input value="${state.event.host}" id="hostName"/></div>
      <div class="input"><label>Event Type</label><select id="eventType"><option ${state.event.type==='virtual'?'selected':''}>Virtual</option><option ${state.event.type==='hybrid'?'selected':''}>Hybrid</option><option ${state.event.type==='in-person'?'selected':''}>In Person</option></select></div>
      <div class="input"><label>Timezone</label><input value="America/New_York" id="eventTZ"/></div>
      <button class="btn" id="saveNewEvent">Save Event</button>
      <div id="newEventResult" class="small"></div>
    </div>
    <div class="small">Tip: Save as draft first, then publish at your target launch time.</div>
  </div>
`;

const templateChat = () => `
  <div class="panel">
    <div class="card">
      <h3>Chat</h3>
      <div class="feed">${state.messages.filter(m => m.scope === 'chat').map(m=>`<div class="msg"><b>${m.who}:</b> ${m.text} ${m.pinned ? '<span class="pill">pinned</span>' : ''}</div>`).join('')}</div>
      <div class="input"><label>Post chat message</label><textarea id="chatInput" rows="3" placeholder="Say hello"></textarea></div>
      <div class="row"><button class="btn" data-action="chat-send">Send</button><button class="btn" data-action="chat-clear">Clear Input</button></div>
    </div>
  </div>
`;

const templateMessages = () => `
  <div class="panel">
    <div class="card">
      <h3>Messages</h3>
      <div class="list">
        ${state.messages.map(m=>`<div class="item"><span><b>${m.who}</b> • ${m.text}</span><span>
          <button class="btn" data-action="msg-pin" data-id="${m.id}">${m.pinned ? 'Unpin' : 'Pin'}</button>
          <button class="btn" data-action="msg-remove" data-id="${m.id}">Archive</button>
        </span></div>`).join('')}
      </div>
    </div>
  </div>
`;

const templateRoomRequests = () => `
  <div class="panel">
    <div class="card"><h3>Room Requests</h3>
      <div class="list">
        ${state.roomRequests.map(req => {
          const roomName = req.roomId ? state.roomList.find(r=>r.id===req.roomId)?.name || 'Unassigned' : 'Unassigned';
          return `<div class="item">
              <span>${req.name} — ${req.status}</span>
              <span>
                <select data-action="request-room" data-id="${req.id}">${state.roomList.map(r=>`<option value="${r.id}" ${req.roomId===r.id ? 'selected' : ''}>${r.name}</option>`).join('')}<option value="">Unassign</option></select>
                <select data-action="request-status" data-id="${req.id}">
                  <option ${req.status==='Pending'?'selected':''}>Pending</option>
                  <option ${req.status==='Assigned'?'selected':''}>Assigned</option>
                  <option ${req.status==='Need follow-up'?'selected':''}>Need follow-up</option>
                </select>
              </span>
            </div>`;
        }).join('')}
      </div>
    </div>
  </div>
`;

const templateQuestions = () => `
  <div class="panel">
    <div class="card"><h3>Questions</h3>
      <div class="list">${state.questions.map(q=>`<div class="item"><span>${q.who}: ${q.text}</span><span>
        <span class="pill">${q.status}</span>
        <button class="btn" data-action="question-status" data-id="${q.id}" data-status="Answered">Mark Answered</button>
      </span></div>`).join('')}</div>
      <div class="input"><label>Ask New Question</label><textarea id="questionInput" rows="3" placeholder="Type question"></textarea></div>
      <div class="row"><button class="btn" data-action="question-submit">Submit</button></div>
    </div>
  </div>
`;

const templateNewQuestion = () => `
  <div class="panel"><div class="card"><h3>New Question</h3>
    <div class="input"><label>Question</label><textarea id="manualQuestion" rows="4">What time does the keynote start?</textarea></div>
    <div class="row"><button class="btn" data-action="question-add">Add</button></div></div></div>
`;

const templateResults = () => `
  <div class="panel">
    <div class="stat-grid">
      <div class="stat"><div class="small">Correct Answers</div><b>${state.metrics.totalQuestions}</b></div>
      <div class="stat"><div class="small">Answered</div><b>${state.metrics.answeredQuestions}</b></div>
      <div class="stat"><div class="small">Avg Rating</div><b>4.8/5</b></div>
    </div>
    <div class="card"><h3>Engagement</h3><div class="small">Shout-outs and interactions are above target this hour.</div></div>
  </div>
`;

const templateStats = (label, value) => `
  <div class="panel">
    <div class="card"><h3>${label}</h3>
      <div class="stat"><b style="font-size:34px">${value}</b><div class="small">Current live count</div></div>
    </div>
    <div class="card"><h3>Trend</h3><p class="small">Steady movement in the last 30 minutes.</p></div>
  </div>
`;

const templateRoomDetails = () => `
  <div class="panel">
    <div class="card">
      <h3>Room Details</h3>
      <div class="table"><table>
        <tr><th>Room</th><th>Capacity</th><th>Current</th><th>Status</th><th>Utilization</th></tr>
        ${state.roomList.map(r=>`<tr><td>${r.name}</td><td>${r.capacity}</td><td>${r.currentOccupancy}</td><td>${r.status}</td><td>${Math.round((r.currentOccupancy / r.capacity) * 100)}%</td></tr>`).join('')}
      </table></div>
    </div>
  </div>
`;

const templateSettings = () => `
  <div class="panel">
    <div class="card">
      <h3>Settings</h3>
      <div class="input"><label>Event URL</label><input value="https://link.letsliink.com/${state.event.slug}"></div>
      <div class="input"><label>Default Theme</label><select><option selected>Midnight Blue</option><option>Dark</option><option>Light</option></select></div>
      <div class="row"><button class="btn">Save Changes</button><button class="btn">Restore Defaults</button></div>
    </div>
  </div>
`;

const templateSettingsStaff = () => `
  <div class="panel">
    <div class="card"><h3>Staff</h3>
      <div class="input"><label>Add Staff (name/role)</label><input id="staffInput" placeholder="Name,Role"/></div>
      <div class="row"><button class="btn" data-action="staff-add">+ Add Staff</button></div>
      <div class="list">${state.staff.map(s=>`<div class="item"><span><b>${s.name}</b> • ${s.role}</span><span>
        <button class="btn" data-action="staff-remove" data-id="${s.id}">Remove</button>
      </span></div>`).join('')}</div>
    </div>
  </div>
`;

const templateSettingsLayout = () => `
  <div class="panel">
    <div class="card">
      <h3>Layout</h3>
      <div class="row"><span class="pill">Chat Dock</span><span class="pill">Room Cards</span><span class="pill">Q&A Priority</span></div>
      <p class="small">Switch sections and reorder modules for host mode.</p>
      <div class="row"><button class="btn">Enable Edit Mode</button><button class="btn">Preview</button></div>
    </div>
  </div>
`;

const templateShoutouts = () => `
  <div class="panel">
    <div class="card"><h3>Shout-Outs</h3>
      <div class="list">${state.shoutouts.map(s=>`<div class="item"><span>${s.text}</span><span class="pill">${s.status}</span><span><button class="btn" data-action="shoutout-toggle" data-id="${s.id}">Broadcast</button></span></div>`).join('')}</div>
      <div class="input"><label>Add Shout-Out</label><input id="shoutInput" placeholder="Type shout-out copy"/></div>
      <div class="row"><button class="btn" data-action="shoutout-add">Add</button></div>
    </div>
  </div>
`;

const templates = {
  dashboard: templateDashboard,
  'new-event': templateNewEvent,
  chat: templateChat,
  messages: templateMessages,
  'room-requests': templateRoomRequests,
  questions: templateQuestions,
  'new-question': templateNewQuestion,
  results: templateResults,
  'stats-attending': () => templateStats('Attending', state.event.attendees),
  'stats-rsvp': () => templateStats('RSVP', state.event.rsvp),
  'stats-rooms': () => templateStats('Rooms Open', state.event.rooms),
  'stats-rooms-joined': () => templateStats('Rooms Joined', state.event.joined),
  'stats-room-details': templateRoomDetails,
  settings: templateSettings,
  'settings-staff': templateSettingsStaff,
  'settings-layout': templateSettingsLayout,
  'settings-shoutouts': templateShoutouts,
};

function getRouteFromHash() {
  const raw = (window.location.hash || '#dashboard').replace('#', '');
  return raw || 'dashboard';
}

function setRoute(route) {
  window.location.hash = route;
  const key = templates[route] ? route : 'dashboard';
  title.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.route === key));
  screen.innerHTML = templates[key]();
  wireActions();
  setStatus(key === 'dashboard' ? 'live' : state.event.status.toUpperCase());
}

function wireActions() {
  const set = (selector, fn) => {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((el) => el.addEventListener('click', fn));
  };

  set('[data-action="toggle-live"]', () => {
    state.event.status = state.event.status === 'live' ? 'paused' : 'live';
    state.activity.unshift({ id: `a${Date.now()}`, text: `Event status changed to ${state.event.status}.`, at: formatDate() });
    persistAndRender();
  });

  set('[data-action="seed-reset"]', () => {
    state = JSON.parse(JSON.stringify(initialState));
    localStorage.removeItem('letsliink-demo-state-v1');
    persistAndRender();
  });

  set('[data-action="seed-refresh"]', () => {
    state.activity[0] = { id: `a${Date.now()}`, text: 'Refreshed dashboard data.', at: formatDate() };
    persistAndRender();
  });

  const saveBtn = document.getElementById('saveNewEvent');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const n = document.getElementById('eventName').value.trim();
      const h = document.getElementById('hostName').value.trim();
      const t = document.getElementById('eventType').value;
      const tz = document.getElementById('eventTZ').value.trim() || 'America/New_York';
      if (n && h) {
        state.event.title = n;
        state.event.host = h;
        state.event.type = t.toLowerCase();
        state.event.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        state.event.timezone = tz;
        const msg = document.getElementById('newEventResult');
        if (msg) msg.textContent = 'Event saved as draft.';
        pushActivity(`Event updated: ${n}`);
        persistAndRender();
      }
    });
  }

  set('[data-action="chat-send"]', () => {
    const msgIn = document.getElementById('chatInput');
    const text = msgIn ? msgIn.value.trim() : '';
    if (!text) return;
    state.messages.unshift({ id: `m${Date.now()}`, who: state.event.host, text, scope: 'chat', delivered: true, pinned: false });
    state.metrics.messagesIn += 1;
    msgIn.value = '';
    pushActivity('Host sent a new chat message.');
    persistAndRender();
  });

  set('[data-action="chat-clear"]', () => {
    const msgIn = document.getElementById('chatInput');
    if (msgIn) msgIn.value = '';
  });

  set('[data-action="msg-pin"]', (e) => {
    const id = e.currentTarget.dataset.id;
    const msg = state.messages.find(m => m.id === id);
    if (msg) {
      msg.pinned = !msg.pinned;
      pushActivity(`Message ${msg.pinned ? 'pinned' : 'unpinned'}: ${msg.text.slice(0, 35)}...`);
      persistAndRender();
    }
  });

  set('[data-action="msg-remove"]', (e) => {
    const id = e.currentTarget.dataset.id;
    state.messages = state.messages.filter(m => m.id !== id);
    pushActivity('A message was archived.');
    persistAndRender();
  });

  const qStatusHandler = (e) => {
    const id = e.currentTarget.dataset.id;
    const q = state.questions.find(x => x.id === id);
    if (q) {
      q.status = q.status === 'Answered' ? 'Queued' : 'Answered';
      state.metrics.answeredQuestions += q.status === 'Answered' ? 1 : -1;
      state.metrics.answeredQuestions = Math.max(0, state.metrics.answeredQuestions);
      persistAndRender();
    }
  };
  set('[data-action="question-status"]', qStatusHandler);

  const questionSubmit = () => {
    const q = document.getElementById('questionInput').value.trim();
    if (!q) return;
    state.questions.unshift({ id: `q${Date.now()}`, who: 'Host', text: q, status: 'Queued' });
    document.getElementById('questionInput').value = '';
    state.metrics.totalQuestions += 1;
    pushActivity('New question added from dashboard.');
    persistAndRender();
  };
  set('[data-action="question-submit"]', questionSubmit);

  const manualQuestion = () => {
    const q = document.getElementById('manualQuestion').value.trim();
    if (!q) return;
    state.questions.unshift({ id: `q${Date.now()}`, who: 'Host', text: q, status: 'Queued' });
    state.metrics.totalQuestions += 1;
    pushActivity('Question created in New Question screen.');
    persistAndRender();
  };
  set('[data-action="question-add"]', manualQuestion);

  set('[data-action="request-room"]', (e) => {
    const id = e.currentTarget.dataset.id;
    const value = e.currentTarget.value;
    const req = state.roomRequests.find(r => r.id === id);
    if (!req) return;
    req.roomId = value;
    req.status = value ? 'Assigned' : req.status;
    pushActivity(`Room request ${req.name} ${value ? 'assigned' : 'unassigned'}.`);
    persistAndRender();
  });

  set('[data-action="request-status"]', (e) => {
    const id = e.currentTarget.dataset.id;
    const value = e.currentTarget.value;
    const req = state.roomRequests.find(r => r.id === id);
    if (!req) return;
    req.status = value;
    persistAndRender();
  });

  set('[data-action="staff-add"]', () => {
    const input = document.getElementById('staffInput');
    const val = input?.value.trim();
    if (!val) return;
    const [name, role = 'Staff'] = val.split(',').map((s) => s.trim());
    state.staff.push({ id: `s${Date.now()}`, name, role: role || 'Staff', scope: 'Room-specific' });
    input.value = '';
    persistAndRender();
  });

  set('[data-action="staff-remove"]', (e) => {
    const id = e.currentTarget.dataset.id;
    state.staff = state.staff.filter(s => s.id !== id);
    persistAndRender();
  });

  const addShout = () => {
    const input = document.getElementById('shoutInput');
    const value = input?.value.trim();
    if (!value) return;
    state.shoutouts.push({ id: `sh${Date.now()}`, text: value, status: 'active' });
    state.metrics.shoutoutsSent += 1;
    input.value = '';
    pushActivity('Shout-out queued.');
    persistAndRender();
  };
  set('[data-action="shoutout-add"]', addShout);

  set('[data-action="shoutout-toggle"]', (e) => {
    const id = e.currentTarget.dataset.id;
    const shout = state.shoutouts.find(s => s.id === id);
    if (shout) {
      shout.status = shout.status === 'active' ? 'broadcasted' : 'active';
      persistAndRender();
    }
  });

  navButtons.forEach((button) => {
    button.onclick = () => setRoute(button.dataset.route);
  });
}

function persistAndRender() {
  saveState(state);
  const currentRoute = getRouteFromHash();
  setRoute(currentRoute);
}

setRoute(getRouteFromHash());
window.addEventListener('hashchange', () => setRoute(getRouteFromHash()));
