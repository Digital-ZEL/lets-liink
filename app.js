const state = {
  eventName: 'Spring Founders Mixer',
  host: 'Jordan Reed',
  attendees: 438,
  rooms: 12,
  rsvp: 286,
  joined: 154,
  questions: [
    {who:'Maya', text: 'Is there a wheelchair friendly entrance?', status: 'Queued'},
    {who: 'Toby', text: 'Can we request a Q&A at 8:30?', status: 'Answered'},
    {who: 'Luis', text: 'Will recordings be shared after event?', status: 'Pending'}
  ],
  messages: [
    {who:'Host', text:'Welcome everyone to the session! We are going live in 10 minutes.'},
    {who:'Ava', text:'Can we get the deck link?'},
    {who:'Host', text:'Absolutely. Sending now in the chat.'},
  ],
  roomRequests: [
    {name:'Jasmine', room:'Room 04', status:'Assigned'},
    {name:'Kai', room:'Room 11', status:'Pending'},
    {name:'Noah', room:'Room 08', status:'Need Follow-up'},
  ],
  staff: [
    {name:'Jordan Reed', role:'Owner', scope:'All rooms'},
    {name:'Maya Lopez', role:'Co-Host', scope:'Stage + Q&A'},
    {name:'Dina Shaw', role:'Moderator', scope:'Chat Review'},
  ],
  shoutouts: ['Welcome note from keynote speaker', 'Top contributor: @Kai', 'Shout out to Room 03 team for great activity']
};

const screen = document.getElementById('screen');
const title = document.getElementById('title');
const navButtons = Array.from(document.querySelectorAll('.nav'));

const templates = {
  dashboard: () => `
    <div class="panel">
      <div class="stat-grid">
        <div class="stat"><div class="small">Attendees</div><b>${state.attendees}</b></div>
        <div class="stat"><div class="small">RSVP</div><b>${state.rsvp}</b></div>
        <div class="stat"><div class="small">Rooms</div><b>${state.rooms}</b></div>
      </div>
      <div class="card">
        <h3>Event Snapshot</h3>
        <div class="row">
          <span class="pill">${state.eventName}</span>
          <span class="pill">Host: ${state.host}</span>
          <span class="pill">Live</span>
        </div>
        <div class="row"><button class="btn">Open Broadcast</button><button class="btn">Pause Event</button><button class="btn">Refresh Data</button></div>
      </div>
      <div class="card">
        <h3>Recent Activity</h3>
        <div class="feed">
          <div class="msg">Maya submitted a room request for Room 11.</div>
          <div class="msg">User added new question: "Will there be recordings?"</div>
          <div class="msg">11 shout-outs delivered to stage.</div>
        </div>
      </div>
    </div>
  `,

  'new-event': () => `
    <div class="panel">
      <div class="card">
        <h3>New Event</h3>
        <div class="input"><label>Event Title</label><input value="${state.eventName}" id="eventName"/></div>
        <div class="input"><label>Host Name</label><input value="${state.host}" id="hostName"/></div>
        <div class="input"><label>Event Type</label><select><option>Virtual</option><option>Hybrid</option><option>In Person</option></select></div>
        <div class="input"><label>Layout</label><select><option>Conference</option><option>Stage</option><option>Workshop Pods</option></select></div>
        <button class="btn" id="saveNewEvent">Save Event</button>
      </div>
      <div class="small">Tip: Save as draft first, then publish at your target launch time.</div>
    </div>
  `,

  chat: () => `
    <div class="panel">
      <div class="card">
        <h3>Chat</h3>
        <div class="feed">${state.messages.map(m=>`<div class="msg"><b>${m.who}:</b> ${m.text}</div>`).join('')}</div>
      </div>
    </div>
  `,

  messages: () => `
    <div class="panel">
      <div class="card">
        <h3>Messages</h3>
        <div class="list">
          ${state.messages.map(m=>`<div class="item"><span><b>${m.who}</b> • ${m.text}</span><span class="pill">Delivered</span></div>`).join('')}
        </div>
      </div>
    </div>
  `,

  'room-requests': () => `
    <div class="panel">
      <div class="card"><h3>Room Requests</h3><div class="list">
      ${state.roomRequests.map(r=>`<div class="item"><span>${r.name}</span><span>${r.room} • ${r.status}</span></div>`).join('')}
      </div></div>
    </div>
  `,

  questions: () => `
    <div class="panel">
      <div class="card"><h3>Questions</h3>
      <div class="list">${state.questions.map(q=>`<div class="item"><span>${q.who}: ${q.text}</span><span class="pill">${q.status}</span></div>`).join('')}</div>
      </div>
    </div>
  `,

  'new-question': () => `
    <div class="panel">
      <div class="card">
        <h3>New Question</h3>
        <div class="input"><label>Question</label><textarea rows="5">What time does the keynote start?</textarea></div>
        <button class="btn">Submit</button>
      </div>
    </div>
  `,

  results: () => `
    <div class="panel">
      <div class="stat-grid">
        <div class="stat"><div class="small">Correct Answers</div><b>42</b></div>
        <div class="stat"><div class="small">Avg Rating</div><b>4.8/5</b></div>
        <div class="stat"><div class="small">Polls Ran</div><b>16</b></div>
      </div>
      <div class="card"><h3>Engagement</h3><div class="small">Shout-outs and interaction points are currently above target.</div></div>
    </div>
  `,

  'stats-attending': () => pageStats('Attending', state.attendees),
  'stats-rsvp': () => pageStats('RSVP', state.rsvp),
  'stats-rooms': () => pageStats('Rooms Open', state.rooms),
  'stats-rooms-joined': () => pageStats('Rooms Joined', state.joined),
  'stats-room-details': () => `
    <div class="panel">
      <div class="card">
        <h3>Room Details</h3>
        <div class="table"><table><tr><th>Room</th><th>Capacity</th><th>Current</th><th>Status</th></tr>
        ${Array.from({length:6}).map((_,i)=>`<tr><td>Room ${i+1}</td><td>${25+i*5}</td><td>${Math.floor(Math.random()*30)}</td><td>${i%2?'Open':'Almost full'}</td></tr>`).join('')}
        </table></div>
      </div>
    </div>
  `,

  settings: () => `
    <div class="panel">
      <div class="card">
        <h3>Settings</h3>
        <div class="input"><label>Event URL</label><input value="https://link.letsliink.com/lm-spring"></div>
        <div class="input"><label>Default Theme</label><select><option>Midnight Blue</option><option>Dark</option><option>Light</option></select></div>
        <div class="row"><button class="btn">Save Changes</button><button class="btn">Restore Defaults</button></div>
      </div>
    </div>
  `,

  'settings-staff': () => `
    <div class="panel">
      <div class="card"><h3>Staff</h3>
        <div class="list">${state.staff.map(s=>`<div class="item"><span><b>${s.name}</b> • ${s.role}</span><span class="pill">${s.scope}</span></div>`).join('')}</div>
        <div class="row"><button class="btn">+ Add Staff</button><button class="btn">- Remove</button><button class="btn">Edit</button></div>
      </div>
    </div>
  `,

  'settings-layout': () => `
    <div class="panel">
      <div class="card">
        <h3>Layout</h3>
        <div class="row"><span class="pill">Chat Dock</span><span class="pill">Room Cards</span><span class="pill">Q&A Priority</span></div>
        <p class="small">Switch visual sections and reorder modules for each event mode.</p>
        <div class="row"><button class="btn">Drag Reorder</button><button class="btn">Preview</button></div>
      </div>
    </div>
  `,

  'settings-shoutouts': () => `
    <div class="panel">
      <div class="card"><h3>Shout-Outs</h3>
        <div class="list">${state.shoutouts.map(s=>`<div class="item"><span>${s}</span><span class="pill">active</span></div>`).join('')}</div>
        <div class="input"><label>Add Shout-Out</label><input placeholder="Type shout-out copy"/></div>
        <button class="btn">Queue for Broadcast</button>
      </div>
    </div>
  `,
};

function pageStats(label, value) {
  return `
    <div class="panel">
      <div class="card"><h3>${label}</h3>
        <div class="stat"><b style="font-size:34px">${value}</b><div class="small">Current live count</div></div>
      </div>
      <div class="card"><h3>Trend</h3><p class="small">Steady increase over the last 24 hours with a stable retention curve.</p></div>
    </div>
  `;
}

function setRoute(route) {
  const key = route || 'dashboard';
  title.textContent = key.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  navButtons.forEach(btn=>btn.classList.toggle('active', btn.dataset.route===key));
  const render = templates[key] || templates.dashboard;
  screen.innerHTML = render();
  const saveBtn = document.getElementById('saveNewEvent');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newName = document.getElementById('eventName').value.trim();
      const newHost = document.getElementById('hostName').value.trim();
      if (newName) state.eventName = newName;
      if (newHost) state.host = newHost;
      setRoute('dashboard');
      alert('Event saved as draft');
    });
  }
}

navButtons.forEach(button=>{
  button.addEventListener('click', ()=>setRoute(button.dataset.route));
});

setRoute('dashboard');
