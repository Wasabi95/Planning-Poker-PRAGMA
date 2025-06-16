// server.js
// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};
const roomData = {}; // roomId => roomName

io.on("connection", (socket) => {
  socket.on("createRoom", ({ roomId, roomName, user }) => {
    socket.join(roomId);
    roomData[roomId] = roomName; // ✅ Store the room name

    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push({ 
      id: socket.id, 
      name: user.name,
      role: user.role || "player"
    });

    io.to(roomId).emit("updatePlayers", rooms[roomId]);
  });

  socket.on("joinRoom", ({ roomId, user }) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || [];

    rooms[roomId].push({
      id: socket.id,
      name: user.name,
      role: user.role || "player"
    });

    // ✅ Emit room name only to the user who just joined
    const roomName = roomData[roomId] || "Unknown Room";
    socket.emit("roomInfo", { roomName });

    io.to(roomId).emit("updatePlayers", rooms[roomId]);
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(p => p.id !== socket.id);
      io.to(roomId).emit("updatePlayers", rooms[roomId]);
    }
  });
});

httpServer.listen(3001, () => console.log("Server running on http://localhost:3001"));






///////// Postman /////////

//----- 1. Create Room (POST /api/rooms)--------- 1. Create Room (POST /api/rooms)----- 1. Create Room (POST /api/rooms)
//----- 1. Create Room (POST /api/rooms)--------- 1. Create Room (POST /api/rooms)----- 1. Create Room (POST /api/rooms)
//----- 1. Create Room (POST /api/rooms)--------- 1. Create Room (POST /api/rooms)----- 1. Create Room (POST /api/rooms)


// POST http://localhost:5000/api/rooms

// {
//   "name": "TeamAlpha"
// }

/// output ////
// {
//     "name": "TeamAlpha",
//     "link": "T3IP2MFP",
//     "cardMode": "fibonacci",
//     "votesRevealed": false,
//     "_id": "684d9cf9fa897ceda62e10de",
//     "createdAt": "2025-06-14T16:02:01.923Z",
//     "updatedAt": "2025-06-14T16:02:01.923Z",
//     "__v": 0
// }

//-----2. Create User (POST /api/users)----2. Create User (POST /api/users)----2. Create User (POST /api/users)
//-----2. Create User (POST /api/users)----2. Create User (POST /api/users)----2. Create User (POST /api/users)
//-----2. Create User (POST /api/users)----2. Create User (POST /api/users)----2. Create User (POST /api/users)
//-----2. Create User (POST /api/users)----2. Create User (POST /api/users)----2. Create User (POST /api/users)


// POST http://localhost:5000/api/users

// {
//   "name": "JohnDoe",
//   "mode": "player",
//   "roomId": "684d9cf9fa897ceda62e10de"
// }

// OUTPUT

// {
//     "name": "JohnDoe",
//     "role": "admin",
//     "mode": "player",
//     "room": "684d9cf9fa897ceda62e10de",
//     "_id": "684d9efb646f655d2775f2de",
//     "createdAt": "2025-06-14T16:10:35.528Z",
//     "updatedAt": "2025-06-14T16:10:35.528Z",
//     "__v": 0,
//     "roomLink": "T3IP2MFP"
// }


//-------3. Update User Mode (PUT /api/users/:id/mode)-------3. Update User Mode (PUT /api/users/:id/mode)
//-------3. Update User Mode (PUT /api/users/:id/mode)-------3. Update User Mode (PUT /api/users/:id/mode)
//-------3. Update User Mode (PUT /api/users/:id/mode)-------3. Update User Mode (PUT /api/users/:id/mode)

// PUT http://localhost:5000/api/users/684d9efb646f655d2775f2de/mode

// {
//   "mode": "spectator"
// }

// OUTPUT

// {
//     "_id": "684d9efb646f655d2775f2de",
//     "name": "JohnDoe",
//     "role": "admin",
//     "mode": "spectator",
//     "room": "684d9cf9fa897ceda62e10de",
//     "createdAt": "2025-06-14T16:10:35.528Z",
//     "updatedAt": "2025-06-14T16:15:22.289Z",
//     "__v": 0,
//     "vote": null
// }


// PUT http://localhost:5000/api/users/684d9efb646f655d2775f2de/mode

// {
//   "mode": "player"
// }

// OUTPUT

// {
//     "_id": "684d9efb646f655d2775f2de",
//     "name": "JohnDoe",
//     "role": "admin",
//     "mode": "player",
//     "room": "684d9cf9fa897ceda62e10de",
//     "createdAt": "2025-06-14T16:10:35.528Z",
//     "updatedAt": "2025-06-14T16:21:54.083Z",
//     "__v": 0,
//     "vote": null
// }




//---- 4. Submit Vote (POST /api/game/vote)----- 4. Submit Vote (POST /api/game/vote)---- 4. Submit Vote (POST /api/game/vote)
//---- 4. Submit Vote (POST /api/game/vote)----- 4. Submit Vote (POST /api/game/vote)---- 4. Submit Vote (POST /api/game/vote)
//---- 4. Submit Vote (POST /api/game/vote)----- 4. Submit Vote (POST /api/game/vote)---- 4. Submit Vote (POST /api/game/vote)

// POST http://localhost:5000/api/game/vote

// {
//   "userId": "684d9efb646f655d2775f2de",
//   "voteValue": "8"
// }

// OUTPUT

// {
//     "error": "Only players can vote"
// }


// POST http://localhost:5000/api/game/vote

// {
//   "userId": "684d9efb646f655d2775f2de",
//   "voteValue": "8"
// }

// {
//     "_id": "684d9efb646f655d2775f2de",
//     "name": "JohnDoe",
//     "role": "admin",
//     "mode": "player",
//     "room": "684d9cf9fa897ceda62e10de",
//     "createdAt": "2025-06-14T16:10:35.528Z",
//     "updatedAt": "2025-06-14T16:24:31.920Z",
//     "__v": 0,
//     "vote": "8"
// }


//------- 5. Reveal Votes (PUT /api/game/:roomId/reveal)------ 5. Reveal Votes (PUT /api/game/:roomId/reveal)
//------- 5. Reveal Votes (PUT /api/game/:roomId/reveal)------ 5. Reveal Votes (PUT /api/game/:roomId/reveal)
//------- 5. Reveal Votes (PUT /api/game/:roomId/reveal)------ 5. Reveal Votes (PUT /api/game/:roomId/reveal)
//------- 5. Reveal Votes (PUT /api/game/:roomId/reveal)------ 5. Reveal Votes (PUT /api/game/:roomId/reveal)

// PUT http://localhost:5000/api/game/684d9cf9fa897ceda62e10de/reveal

//OUTPUT

// {
//     "_id": "684d9cf9fa897ceda62e10de",
//     "name": "TeamAlpha",
//     "link": "T3IP2MFP",
//     "cardMode": "fibonacci",
//     "votesRevealed": true,
//     "createdAt": "2025-06-14T16:02:01.923Z",
//     "updatedAt": "2025-06-14T16:26:54.823Z",
//     "__v": 0
// }


//------ 6. Reset Room (PUT /api/game/:roomId/reset)----- 6. Reset Room (PUT /api/game/:roomId/reset)
//------ 6. Reset Room (PUT /api/game/:roomId/reset)----- 6. Reset Room (PUT /api/game/:roomId/reset)
//------ 6. Reset Room (PUT /api/game/:roomId/reset)----- 6. Reset Room (PUT /api/game/:roomId/reset)
//------ 6. Reset Room (PUT /api/game/:roomId/reset)----- 6. Reset Room (PUT /api/game/:roomId/reset)

// PUT http://localhost:5000/api/game/684d9cf9fa897ceda62e10de/reset

// {
//     "_id": "684d9cf9fa897ceda62e10de",
//     "name": "TeamAlpha",
//     "link": "T3IP2MFP",
//     "cardMode": "fibonacci",
//     "votesRevealed": false,
//     "createdAt": "2025-06-14T16:02:01.923Z",
//     "updatedAt": "2025-06-14T16:28:33.428Z",
//     "__v": 0
// }