const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Mock matches data
let matches = [
  {
    id: 'm1',
    teams: { home: 'India', away: 'Australia' },
    status: 'LIVE',
    innings: [
      { team: 'India', runs: 180, wickets: 4, overs: '32.1' }
    ],
    commentary: [
      { time: Date.now(), text: 'India 180/4 (32.1)' }
    ]
  },
  {
    id: 'm2',
    teams: { home: 'England', away: 'Pakistan' },
    status: 'UPCOMING',
    start_time: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    innings: [],
    commentary: []
  }
];

app.get('/api/matches', (req, res) => {
  res.json(matches);
});

app.get('/api/matches/:id', (req, res) => {
  const m = matches.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: 'Match not found' });
  res.json(m);
});

// Socket.io for live updates
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  // Optionally client can join a room for a match
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Simulate live updates every 6 seconds for live matches
setInterval(() => {
  const liveMatches = matches.filter(m => m.status === 'LIVE');
  liveMatches.forEach(match => {
    // Simulate incremental score change
    const inning = match.innings[0];
    const addRuns = Math.floor(Math.random() * 7); // 0-6
    inning.runs += addRuns;
    // random wicket event
    if (Math.random() < 0.08) {
      inning.wickets += 1;
      match.commentary.unshift({
        time: Date.now(),
        text: `WICKET! ${match.teams.home} lost a wicket. ${inning.runs}/${inning.wickets} (${inning.overs})`
      });
    } else {
      match.commentary.unshift({
        time: Date.now(),
        text: `${addRuns} runs. ${inning.runs}/${inning.wickets} (${inning.overs})`
      });
    }
    // bump overs (simple)
    const [ovInt, ovDec] = inning.overs.split('.').map(Number);
    let newBalls = ovDec + 1;
    let newOvers = ovInt;
    if (newBalls >= 6) {
      newOvers += 1;
      newBalls = 0;
    }
    inning.overs = `${newOvers}.${newBalls}`;

    // keep commentary trimmed
    match.commentary = match.commentary.slice(0, 50);

    // emit update to all clients and to match room
    io.emit('scoreUpdate', { matchId: match.id, match });
    io.to(match.id).emit('scoreUpdate', { matchId: match.id, match });
  });
}, 6000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`CricTRX server listening on ${PORT}`);
});