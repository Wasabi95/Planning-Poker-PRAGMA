// // server.js
// // server.js
// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import handleSocketEvents from './socketHandlers.js';


// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = {};
// const roomData = {}; 

// io.on("connection", (socket) => {
//   socket.on("createRoom", ({ roomId, roomName, user }) => {
//     socket.join(roomId);
//     roomData[roomId] = roomName; 

//     rooms[roomId] = rooms[roomId] || [];
//     rooms[roomId].push({ 
//       id: socket.id, 
//       name: user.name,
//       role: user.role || "player"
//     });

//     io.to(roomId).emit("updatePlayers", rooms[roomId]);
//   });

//   socket.on("joinRoom", ({ roomId, user }) => {
//     socket.join(roomId);
//     rooms[roomId] = rooms[roomId] || [];

//     rooms[roomId].push({
//       id: socket.id,
//       name: user.name,
//       role: user.role || "player"
//     });

   
//     const roomName = roomData[roomId] || "Unknown Room";
//     socket.emit("roomInfo", { roomName });

//     io.to(roomId).emit("updatePlayers", rooms[roomId]);
//   });

//   socket.on("disconnect", () => {
//     for (const roomId in rooms) {
//       rooms[roomId] = rooms[roomId].filter(p => p.id !== socket.id);
//       io.to(roomId).emit("updatePlayers", rooms[roomId]);
//     }
//   });
// });

// httpServer.listen(3001, () => console.log("Server running on http://localhost:3001"));


import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Enhanced room storage
const rooms = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create room handler
  socket.on("createRoom", ({ roomId, roomName, user }) => {
    socket.join(roomId);
    
    // Initialize room with enhanced structure
    rooms[roomId] = {
      roomName,
      players: [],
      stories: [],
      currentStory: null,
      votes: {},
      voteStatus: "hidden"
    };
    
    // Add creator as first player
    const newUser = { 
      id: socket.id, 
      ...user,
      isModerator: true 
    };
    rooms[roomId].players.push(newUser);
    
    // Send room info to creator
    socket.emit("roomInfo", { roomName, user: newUser });
    
    // Broadcast to all in room
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
  });

  // Join room handler
  socket.on("joinRoom", ({ roomId, user }) => {
    if (!rooms[roomId]) {
      socket.emit("error", "Room does not exist");
      return;
    }
    
    socket.join(roomId);
    
    // Add new player
    const newUser = { 
      id: socket.id, 
      ...user,
      isModerator: false 
    };
    rooms[roomId].players.push(newUser);
    
    // Send room info to new player
    socket.emit("roomInfo", { 
      roomName: rooms[roomId].roomName, 
      user: newUser,
      currentState: {
        players: rooms[roomId].players,
        currentStory: rooms[roomId].currentStory,
        voteStatus: rooms[roomId].voteStatus,
        votes: rooms[roomId].votes
      }
    });
    
    // Broadcast to all in room
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
  });

  // Submit vote handler
  socket.on("submitVote", ({ roomId, userId, vote }) => {
    if (!rooms[roomId]) return;
    
    rooms[roomId].votes[userId] = vote;
    io.to(roomId).emit("voteReceived", { userId, vote });
  });

  // Reveal votes handler
  socket.on("revealVotes", (roomId) => {
    if (!rooms[roomId]) return;
    
    rooms[roomId].voteStatus = "revealed";
    io.to(roomId).emit("votesRevealed", rooms[roomId].votes);
  });

  // Next story handler
  socket.on("nextStory", (roomId) => {
    if (!rooms[roomId]) return;
    
    // Reset votes for new story
    rooms[roomId].votes = {};
    rooms[roomId].voteStatus = "voting";
    
    // Get next story from backlog
    if (rooms[roomId].stories.length > 0) {
      rooms[roomId].currentStory = rooms[roomId].stories.shift();
    } else {
      rooms[roomId].currentStory = null;
    }
    
    io.to(roomId).emit("newStoryStarted", rooms[roomId].currentStory);
  });

  // Add story handler
  socket.on("addStory", ({ roomId, story }) => {
    if (!rooms[roomId]) return;
    
    const newStory = {
      id: nanoid(8),
      ...story,
      status: "pending"
    };
    
    rooms[roomId].stories.push(newStory);
    io.to(roomId).emit("storyAdded", newStory);
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Remove player
        const [disconnectedPlayer] = room.players.splice(playerIndex, 1);
        
        // Remove votes
        if (room.votes[disconnectedPlayer.id]) {
          delete room.votes[disconnectedPlayer.id];
        }
        
        // Check if room is now empty
        if (room.players.length === 0) {
          // Clean up empty room after delay
          setTimeout(() => {
            if (rooms[roomId] && rooms[roomId].players.length === 0) {
              delete rooms[roomId];
              console.log(`Room ${roomId} deleted due to inactivity`);
            }
          }, 300000); // 5 minutes
        } else {
          // Transfer moderator if needed
          if (disconnectedPlayer.isModerator) {
            const newModerator = room.players[0];
            newModerator.isModerator = true;
            io.to(roomId).emit("newModerator", newModerator.id);
          }
          
          io.to(roomId).emit("updatePlayers", room.players);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));



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