# CricTRX (minimal prototype)

This is a minimal prototype of a Cricbuzz-like web app named "CricTRX".

Structure:
- server/: Node + Express + Socket.IO (mocks and emits live score updates)
- client/: React app (lists matches, shows details, and receives live updates)

To run locally:
1. Server
   cd server
   npm install
   npm start
   Server listens on http://localhost:4000

2. Client
   cd client
   npm install
   npm start
   React dev server runs on http://localhost:3000

Notes:
- This project currently uses mocked data and simulated updates. To use a real cricket API, replace the mocked data and update logic in server/index.js.
- If deploying, set appropriate CORS and origin restrictions and use production builds.