let fame = 0, money = 100, skill = 50, hype = 10; // Added Hype
let songs = [];
let albums = [];

const out = document.getElementById('output');

// --- SAVE/LOAD SYSTEM ---
function saveGame() {
  const gameState = { fame, money, skill, songs, albums, hype };
  localStorage.setItem('musicianManagerV5', JSON.stringify(gameState));
}

function loadGame() {
  const savedData = localStorage.getItem('musicianManagerV5');
  if (savedData) {
    const data = JSON.parse(savedData);
    fame = data.fame; money = data.money; skill = data.skill;
    songs = data.songs; albums = data.albums; 
    hype = data.hype || 10;
    print("<b>V5 Save Loaded.</b> Welcome back.");
  }
  updateStatus();
}

// --- CORE UTILITIES ---
function getFameLevel() {
  if (fame >= 100000) return "👑 Global Legend";
  if (fame >= 50000)  return "🌟 Superstar";
  if (fame >= 35000)  return "🎤 Mainstream Artist";
  if (fame >= 25000)  return "📈 Rising Star";
  if (fame >= 5500)   return "🎸 Local Hero";
  if (fame >= 500)    return "🎧 Indie Artist";
  return "🏠 Bedroom Producer";
}

function print(txt) {
  out.innerHTML += txt + '<br>';
  out.scrollTop = out.scrollHeight;
}

function updateStatus() {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.innerHTML = `
      <span>[${getFameLevel()}]</span>
      <span>FAME: ${fame}</span> 
      <span>CASH: $${money}</span> 
      <span>HYPE: ${hype}%</span>
      <span>SONGS: ${songs.length}</span>
    `;
  }
  saveGame();
}

// --- V5 NEW MECHANICS ---

function createSong() {
  let name = prompt("Song name:");
  if (!name) return;
  let quality = Math.floor(Math.random() * 10) + Math.floor(skill / 10);
  songs.push({ name, quality, released: false });
  hype += 5; // Creating music builds hype
  print(`<b>New Track:</b> '${name}' created. Hype increased!`);
  updateStatus();
}

function releaseSong() {
  let unreleased = songs.filter(s => !s.released);
  if (unreleased.length === 0) return;
  showSongs();
  let idx = parseInt(prompt("Release song number:")) - 1;
  if (songs[idx] && !songs[idx].released) {
    songs[idx].released = true;
    hype += 15; // Releasing music is a major hype booster
    fame += Math.floor(songs[idx].quality * 5);
    money += Math.floor(songs[idx].quality * 10);
    print(`<b>RELEASED:</b> '${songs[idx].name}'. The internet is talking!`);
    updateStatus();
  }
}

/**
 * V5 TOUR SYSTEM: Venue Selection & Ticket Math
 */
function startTour() {
  if (songs.length < 3) { print("Need 3+ songs to tour."); return; }

  const venues = [
    { name: "Dive Bar", cost: 50, capacity: 100, reqFame: 0 },
    { name: "Music Hall", cost: 500, capacity: 1000, reqFame: 5000 },
    { name: "Arena", cost: 5000, capacity: 15000, reqFame: 25000 },
    { name: "Stadium", cost: 50000, capacity: 80000, reqFame: 60000 }
  ];

  let choice = prompt(`Select Venue:\n1: Dive Bar ($50)\n2: Music Hall ($500)\n3: Arena ($5k)\n4: Stadium ($50k)`);
  let v = venues[parseInt(choice) - 1];

  if (!v) return;
  if (money < v.cost) { print("<span style='color:red;'>Not enough cash for the rental fee!</span>"); return; }

  money -= v.cost;
  print(`<b>Touring: ${v.name}...</b>`);

  // Calculate Attendance based on Fame vs ReqFame + Hype
  let fameRatio = (fame + 1) / (v.reqFame + 1);
  if (fameRatio > 1.2) fameRatio = 1.2; // Cap at 120% sold out (standing room)
  
  let attendancePercent = (fameRatio * (hype / 100)) + (Math.random() * 0.2);
  if (attendancePercent > 1.2) attendancePercent = 1.2;
  
  let ticketsSold = Math.floor(v.capacity * attendancePercent);
  let ticketPrice = (v.cost / (v.capacity * 0.5)); // Dynamic pricing
  let totalRevenue = Math.floor(ticketsSold * ticketPrice * 2);
  let fameGain = Math.floor(ticketsSold * 0.1);

  money += totalRevenue;
  fame += fameGain;
  hype = Math.floor(hype * 0.7); // Hype resets/cools down after a tour

  print(`--- TOUR REPORT: ${v.name} ---`);
  print(`Attendance: ${ticketsSold} / ${v.capacity}`);
  print(`Revenue: $${totalRevenue} (Profit: $${totalRevenue - v.cost})`);
  print(`Fame Gained: +${fameGain}`);
  
  if (totalRevenue < v.cost) {
    print("<span style='color:red;'>Ouch. You didn't even cover the venue cost.</span>");
  } else if (attendancePercent > 0.9) {
    print("<span style='color:var(--accent);'>SOLD OUT! The crowd went wild!</span>");
  }

  updateStatus();
}

function practice() {
  if (money < 50) return;
  money -= 50; skill += 5;
  print("Practiced hard. Skill +5.");
  updateStatus();
}

function showSongs() {
  out.innerHTML = "<b>--- DISCOGRAPHY ---</b><br>";
  songs.forEach((s, i) => print(`${i+1}. ${s.name} (Q:${s.quality}) ${s.released ? '[Released]' : ''}`));
}

function resetGame() {
  if (confirm("Reset everything?")) { localStorage.removeItem('musicianManagerV5'); location.reload(); }
}

loadGame();
