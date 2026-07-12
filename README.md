# Collab Canvas

A real-time collaborative whiteboard where multiple users can draw, sketch, and build diagrams together on a shared canvas — with live sync, in-room chat, and instant updates as changes happen.

---

## Overview

Collab Canvas lets a group of users join a shared room and see each other's drawings, shapes, and edits appear on the canvas in real time. Whether it's brainstorming, sketching out an idea, or mapping a workflow together, everyone in the room sees the same canvas update live as it's being drawn — powered by a fabric.js canvas synced over Socket.IO.

Alongside the shared canvas, each room has its own live chat, so collaborators can talk through what they're drawing without leaving the board.

---

## Key Features

- **Real-time collaborative canvas** — freehand drawing and shapes sync instantly across everyone in the room
- **Drawing tools** — pencil/freehand drawing, rectangle, circle, triangle, line, and ellipse shapes, plus a fill bucket and eraser
- **Text tool** — add text elements directly to the canvas
- **Customizable stroke & fill** — adjustable brush color, brush width, stroke color, and stroke width
- **Room-based sessions** — join a specific room via a shareable room ID; canvas state syncs to anyone who joins
- **Live participant tracking** — see how many users are currently in the room, with join/leave notifications
- **In-room live chat** — text chat alongside the canvas for real-time discussion
- **Export as image** — download the current canvas as a PNG
- **User authentication** — signup/login with session-based auth

---

## How It Works

1. When a user opens a room, their canvas connects over Socket.IO and joins a room identified by the room ID in the URL.
2. Every canvas change (drawing, adding a shape, moving an object) is serialized with fabric.js's `toJSON()` and broadcast to everyone else in the room.
3. Other clients in the room receive the update and reload the canvas state via `loadFromJSON()`, keeping every participant's view in sync.
4. The server tracks room membership and participant counts in memory, and broadcasts join/leave events so everyone sees who's currently collaborating.
5. Chat messages are scoped to the room and broadcast the same way, via a separate Socket.IO event.

> **Note:** canvas state is currently held in server memory per room rather than persisted to a database — boards exist for the lifetime of the room/server process. Persistent, database-backed board storage is a natural next step (see [Roadmap](#roadmap)).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Canvas | Fabric.js |
| Real-time Sync | Socket.IO |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) — user accounts |
| Auth | Express sessions |
| Routing | React Router |

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── WhiteBoard.jsx    # Core canvas — drawing tools, real-time sync, chat
│   │   ├── Home.jsx
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── contexts/               # User context
│   ├── socket.js               # Socket.IO client setup
│   └── App.jsx

server/
├── index.js               # Express + Socket.IO server, auth routes, room/socket event handling
└── lib/
    ├── connectDB.js
    └── user.model.js         # Mongoose user schema
```

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/collabcanvas
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Roadmap

- [ ] Persist canvas/board state to a database so rooms survive server restarts
- [ ] Sticky notes
- [ ] Board history / undo-redo across collaborators
- [ ] Video/audio calling alongside the canvas
- [ ] Board list & saved boards per user

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**MD Rehan**
[GitHub](https://github.com/mdrehan369) · [LinkedIn](https://linkedin.com/in/md-rehan-169411232)
