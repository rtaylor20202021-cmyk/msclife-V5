let fame = 0, money = 100, skill = 50, hype = 10;
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
    print("<b>Save Loaded.</b> Picking up the tour bus where we left off.");
  }
  updateStatus();
}

// --- UTILITIES ---
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

// --- ACTIONS ---

function createSong() {
  let name = prompt("Song name:");
  if (!name) return;
  let quality = Math.floor(Math.random() * 10) + Math.floor(skill / 10);
  songs.push({ name, quality, released: false });
  hype += 5;
  print(`<b>New Track:</b> '${name}' written. (Quality: ${quality})`);
  updateStatus();
}

/**
 * Perform Gig: Single show version of the Tour logic
 */
function perform() {
  const venues = [
    { name: "Dive Bar", cost: 50, capacity: 100, reqFame: 0 },
    { name: "Music Hall", cost: 500, capacity: 1000, reqFame: 5500 },
    { name: "Arena", cost: 5000, capacity: 15000, reqFame: 25000 },
    { name: "Stadium", cost: 50000, capacity: 80000, reqFame: 50000 }
  ];

  let choice = prompt(`Select Venue for Tonight:\n1: Dive Bar ($50)\n2: Music Hall ($500)\n3: Arena ($5k)\n4: Stadium ($50k)`);
  let v = venues[parseInt(choice) - 1];

  if (!v) return;
  if (money < v.cost) { print("<span style='color:red;'>Not enough cash for rent!</span>"); return; }

  money -= v.cost;
  
  // Logic: Attendance based on Fame vs Venue Requirement + Hype
  let fameRatio = (fame + 50) / (v.reqFame + 50);
  let attendancePercent = (fameRatio * (hype / 100)) + (Math.random() * 0.15);
  if (attendancePercent > 1.1) attendancePercent = 1.1; // Slight standing room
  
  let ticketsSold = Math.floor(v.capacity * attendancePercent);
  if (ticketsSold < 0) ticketsSold = 0;

  let ticketPrice = (v.cost / (v.capacity * 0.4)); 
  let totalRevenue = Math.floor(ticketsSold * ticketPrice);
  let fameGain = Math.floor(ticketsSold * 0.05);

  money += totalRevenue;
  fame += fameGain;
  hype += 2; // Small hype boost for playing a show

  print(`<b>Gig Report: ${v.name}</b>`);
  print(`Sold ${ticketsSold} tickets. Revenue: $${totalRevenue}. Fame: +${fameGain}`);
  
  if (totalRevenue < v.cost) print("<span style='color:red;'>The show was a financial loss.</span>");
  updateStatus();
}

function startTour() {
  if (songs.length < 5) { print("You need at least 5 songs for a full tour setlist."); return; }
  
  const tourTypes = [
    { name: "Local Tour", stops: 4, cost: 300, venueIdx: 0 },
    { name: "National Tour", stops: 8, cost: 4000, venueIdx: 1 },
    { name: "World Tour", stops: 12, cost: 45000, venueIdx: 3 }
  ];

  let choice = prompt(`Select Tour Package:\n1: Local ($300)\n2: National ($4k)\n3: World ($45k)`);
  let t = tourTypes[parseInt(choice) - 1];
  if (!t) return;
  if (money < t.cost) { print("Insufficient funds for tour logistics."); return; }

  money -= t.cost;
  print(`<b>Starting ${t.name}...</b>`);
  
  let totalRev = 0;
  let totalFame = 0;

  for(let i=0; i < t.stops; i++) {
    // Re-using simplified gig math for each stop
    let fGain = Math.floor(Math.random() * (fame/10)) + 20;
    let mGain = Math.floor(fGain * 2.5);
    totalRev += mGain;
    totalFame += fGain;
  }

  money += totalRev;
  fame += totalFame;
  hype = Math.floor(hype * 0.5); // Major hype burnout after tour

  print(`--- ${t.name} Complete ---`);
  print(`Total Revenue: $${totalRev} | Fame Gained: +${totalFame}`);
  updateStatus();
}

function practice() {
  if (money < 50) return;
  money -= 50; skill += 5;
  print("Vocal cords warmed up. Skill +5.");
  updateStatus();
}

function releaseSong() {
  let unreleased = songs.filter(s => !s.released);
  if (unreleased.length === 0) return;
  let idx = songs.findIndex(s => !s.released);
  songs[idx].released = true;
  hype += 20;
  money += (songs[idx].quality * 10);
  fame += (songs[idx].quality * 5);
  print(`<b>Released:</b> ${songs[idx].name}. Hype is building!`);
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
