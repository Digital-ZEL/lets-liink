const screen = document.getElementById('screen');
const navButtons = Array.from(document.querySelectorAll('.nav-pill button'));

let state = getDatingState();

const save = () => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

const templates = {
  discover: () => {
    const deck = state.users.map((u) => `
      <div class="card profile">
        <div class="hero">
          <div class="image" style="background: linear-gradient(130deg,#ff5fce20,#9d68ff2e), url('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80') center/cover;'></div>
          <div class="content">
            <div class="meta"><div class="name">${u.name}, ${u.age}</div><span class="pill">${u.distance}</span></div>
            <p>${u.city} · ${u.vibe}</p>
            <div class="pills">${u.interests.map((t) => `<span class="pill">${t}</span>`).join('')}</div>
            <div class="action-bar">
              <button class="btn" data-action="pass" data-id="${u.id}">Pass</button>
              <button class="btn" data-action="like" data-id="${u.id}">Like</button>
              <button class="btn primary" data-action="super" data-id="${u.id}">Super Like</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="grid">
        <div class="card">
          <h1>Discover matches</h1>
          <p class="muted">Daily picks based on your vibe score and profile settings.</p>
          <div class="slider">${state.users.slice(0, 4).map((u)=>`<div class="card-mini">${u.name}, ${u.age}<br><span class="muted">${u.city}</span></div>`).join('')}</div>
          <div class="row" style="margin-top:12px;"><span class="pill">Profile completion: 84%</span><span class="pill">Distance: 25 mi</span></div>
          <div class="progress" aria-label="profile completion" style="margin-top:10px"><span style="--v:84"></span></div>
        </div>
        <div class="profile-stack">${deck}</div>
      </div>
    `;
  },
  matches: () => {
    return `
      <div class="card">
        <h2>Your Matches</h2>
        <p class="muted">Only people who also liked you show up here.</p>
        <div class="grid" style="margin-top:10px">
          ${state.matches.map((m) => `
            <div class="match-row">
              <div class="avatar">${m.name[0]}</div>
              <div>
                <strong>${m.name}</strong><div class="small">${m.last}</div>
                <div class="muted">${m.since}</div>
              </div>
              <div class="pill">${m.unread ? `${m.unread} new` : 'open'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  messages: () => {
    const m = state.conversations[0];
    return `
      <div class="card">
        <h2>Messages</h2>
        <div class="chats">
          ${state.conversations.map((c) => `
            <div class="chat">
              <div class="line"><strong>${c.with}</strong><span class="pill">Open</span></div>
              ${c.msgs.map((msg) => `<div><span style="font-weight:700">${msg.from}</span> · ${msg.text} <span class="muted">${msg.at}</span></div>`).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  profile: () => `
    <div class="card">
      <h2>Your Profile</h2>
      <div class="row" style="align-items:stretch">
        <div class="profile-stack">
          <label>Name</label><input id="p-name" value="${state.currentUser.name}" />
          <label>Age</label><input id="p-age" type="number" value="${state.currentUser.age}" />
          <label>City</label><input id="p-city" value="${state.currentUser.city}" />
          <label>Bio</label><textarea id="p-bio" rows="4">${state.currentUser.bio}</textarea>
          <div class="row"><button class="btn primary" data-action="saveProfile">Save profile</button><button class="btn" data-action="shufflePrompt">Refresh match prompts</button></div>
        </div>
      </div>
    </div>
  `,
  activity: () => `
    <div class="card">
      <h2>Activity Feed</h2>
      <div class="feed">${state.activity.map(a => `<div class="feed-item"><strong>${a.event}</strong><div class="muted">${a.time}</div></div>`).join('')}</div>
    </div>
  `,
  settings: () => `
    <div class="card">
      <h2>Settings</h2>
      <div class="row"><label class="toggle"><input type="checkbox" ${state.currentUser.visible === false ? '' : 'checked'} data-setting="visible"/> <span>Profile is visible</span></label></div>
      <div class="row"><label class="toggle"><input type="checkbox" checked data-setting="read-receipts"/> <span>Read receipts</span></label></div>
      <div class="row"><label class="toggle"><input type="checkbox" data-setting="auto-play"/> <span>Auto-play stories</span></label></div>
      <div class="action-bar"><button class="btn primary" data-action="resetDemo">Reset demo</button><button class="btn" data-action="boost">Enable profile boost</button></div>
    </div>
  `
};

function toast(text) {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = 'position:fixed;right:18px;top:18px;background:#2b1d4e;border:1px solid #5f3ea1;padding:10px 14px;border-radius:12px;color:#fff;z-index:20;box-shadow:0 12px 24px #0007';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

function removeFromDiscover(id) {
  state.users = state.users.filter((u) => u.id !== id);
}

function setRoute(route) {
  const key = templates[route] ? route : 'discover';
  navButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.route === key));
  screen.innerHTML = templates[key]();
  setHandlers();
}

function setHandlers() {
  const on = (selector, fn) => {
    document.querySelectorAll(selector).forEach((el) => el.addEventListener('click', fn));
  };

  on('[data-action="like"]', (e) => {
    const id = e.currentTarget.dataset.id;
    removeFromDiscover(id);
    toast('Liked! If they like back, you’ll match.');
    saveState();
    setRoute('discover');
  });

  on('[data-action="pass"]', (e) => {
    const id = e.currentTarget.dataset.id;
    removeFromDiscover(id);
    toast('Passed.');
    saveState();
    setRoute('discover');
  });

  on('[data-action="super"]', (e) => {
    const id = e.currentTarget.dataset.id;
    removeFromDiscover(id);
    toast('Super like sent 💜');
    saveState();
    setRoute('discover');
  });

  on('[data-action="super-like"]', () => toast('Super like streak: 2 left today'));

  on('[data-action="saveProfile"]', () => {
    state.currentUser.name = document.getElementById('p-name').value;
    state.currentUser.age = parseInt(document.getElementById('p-age').value || '0', 10);
    state.currentUser.city = document.getElementById('p-city').value;
    state.currentUser.bio = document.getElementById('p-bio').value;
    toast('Profile saved ✅');
    saveState();
  });

  on('[data-action="shufflePrompt"]', () => {
    const prompts = ['I’m looking for someone who loves...', 'My ideal first date involves...', 'Ask me about my last trip...'];
    toast(prompts[Math.floor(Math.random()*prompts.length)]);
  });

  on('[data-action="resetDemo"]', () => {
    localStorage.removeItem('letsliink-dating-state-v1');
    state = JSON.parse(JSON.stringify(seed));
    toast('Demo reset');
    setRoute('discover');
  });

  on('[data-action="boost"]', () => toast('Profile boost queued for 30 mins'));

  document.querySelectorAll('[data-setting]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const key = checkbox.dataset.setting;
      state.currentUser[key] = checkbox.checked;
      saveState();
      toast(`${key} ${checkbox.checked ? 'enabled' : 'disabled'}`);
    });
  });

  navButtons.forEach((btn) => {
    btn.onclick = () => {
      setRoute(btn.dataset.route);
      window.location.hash = btn.dataset.route;
    };
  });
}

function saveState() {
  localStorage.setItem('letsliink-dating-state-v1', JSON.stringify(state));
}

const route = (window.location.hash || '#discover').replace('#', '');
setRoute(route);
