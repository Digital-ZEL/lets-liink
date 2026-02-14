const seed = {
  currentUser: { name: 'Maya Chen', age: 29, city: 'New York', pronouns: 'she/her', bio: 'Weekend hiker, foodie, and startup junkie. Looking for meaningful conversations and great coffee.', vibe: 'Honest, goofy, and curious.' },
  users: [
    { id: 'u1', name: 'Jordan', age: 31, city: 'New York', distance: '2 mi', interests: ['Coffee', 'Travel', 'Jazz'], vibe: 'Warm and spontaneous' },
    { id: 'u2', name: 'Lena', age: 27, city: 'Brooklyn', distance: '4 mi', interests: ['Reading', 'Food', 'Pilates'], vibe: 'Calm, reflective, and funny' },
    { id: 'u3', name: 'Noah', age: 33, city: 'Jersey City', distance: '9 mi', interests: ['Rock climbing', 'Comedy', 'Running'], vibe: 'Active and direct' },
    { id: 'u4', name: 'Amara', age: 26, city: 'Queens', distance: '11 mi', interests: ['K-pop', 'Keto', 'Museums'], vibe: 'Creative and chill' },
    { id: 'u5', name: 'Rae', age: 30, city: 'Manhattan', distance: '5 mi', interests: ['Startup', 'Cycling', 'Sushi'], vibe: 'Ambitious and playful' }
  ],
  matches: [
    { id: 'm1', name: 'Lena', last: 'Would love to meet up for tacos 🍽', unread: 2, active: true, since: 'Matched today' },
    { id: 'm2', name: 'Rae', last: 'Your photo at the beach is awesome.', unread: 0, active: true, since: 'Yesterday' },
    { id: 'm3', name: 'Amara', last: 'No pressure, whenever you are ready.', unread: 1, active: true, since: '2 days ago' }
  ],
  conversations: [
    { with: 'Lena', msgs: [
      { from: 'Lena', text: 'Hey! Are you free this weekend?', at: '10:10 AM' },
      { from: 'You', text: 'Yes, what did you have in mind?', at: '10:12 AM' },
      { from: 'Lena', text: 'Coffee + walk around the East River. Fair?', at: '10:13 AM' },
    ]},
    { with: 'Rae', msgs: [
      { from: 'Rae', text: 'Your profile says you like jazz ☕', at: '9:04 PM' },
      { from: 'You', text: 'Only when it comes with pastries.', at: '9:06 PM' }
    ]}
  ],
  activity: [
    { event: 'Liked Jordan', time: 'Now' },
    { event: 'Super liked Lena', time: '10m ago' },
    { event: 'Noah sent new story', time: '22m ago' }
  ]
};

const storageKey = 'letsliink-dating-state-v1';

const getDatingState = () => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return JSON.parse(JSON.stringify(seed));
  try { return JSON.parse(raw); } catch { return JSON.parse(JSON.stringify(seed)); }
};
