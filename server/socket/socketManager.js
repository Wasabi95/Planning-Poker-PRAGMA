//server/socket/socketManager.js
import { io } from 'socket.io-client';
import User from '../models/User.js';
import Room from '../models/Room.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate and join room
    socket.on('authenticate', async ({ userId, roomId }, callback) => {
      try {
        const user = await User.findById(userId);
        const room = await Room.findById(roomId);
        
        if (!user || !room || user.room.toString() !== roomId) {
          return callback({ error: 'Invalid credentials' });
        }
        
        socket.userId = userId;
        socket.roomId = roomId;
        socket.role = user.role;
        socket.join(roomId);
        
        // Notify room that user joined (except the new user)
        socket.broadcast.to(roomId).emit('userJoined', user);
        
        // Send current users to the new user
        const users = await User.find({ room: roomId });
        socket.emit('currentUsers', users);
        
        callback({ success: true });
      } catch (err) {
        callback({ error: 'Authentication failed' });
      }
    });

    // Handle votes
    socket.on('vote', async ({ voteValue }) => {
      try {
        // Verify user exists and is a player
        const user = await User.findById(socket.userId);
        if (!user || user.mode !== 'player') {
          return;
        }

        user.vote = voteValue;
        await user.save();
        
        // Broadcast to room (hide vote value until reveal)
        io.to(socket.roomId).emit('userVoted', {
          userId: socket.userId,
          hasVoted: true
        });
      } catch (err) {
        console.error('Vote failed:', err);
      }
    });

    // Handle mode changes
    socket.on('changeMode', async ({ mode }) => {
      try {
        const user = await User.findByIdAndUpdate(
          socket.userId,
          { mode },
          { new: true }
        );
        
        // Broadcast mode change to room
        io.to(socket.roomId).emit('userModeChanged', {
          userId: socket.userId,
          newMode: mode
        });
      } catch (err) {
        console.error('Mode change failed:', err);
      }
    });

    // Admin-only: Reveal votes
    socket.on('revealVotes', async () => {
      try {
        // Verify admin privileges
        const user = await User.findById(socket.userId);
        if (!user || user.role !== 'admin') return;

        // Update room state
        await Room.findByIdAndUpdate(
          socket.roomId,
          { votesRevealed: true },
          { new: true }
        );

        // Get all votes
        const users = await User.find({ room: socket.roomId });
        
        // Broadcast revealed votes
        io.to(socket.roomId).emit('votesRevealed', users);
      } catch (err) {
        console.error('Reveal failed:', err);
      }
    });

    // Admin-only: Reset room
    socket.on('resetRoom', async () => {
      try {
        // Verify admin privileges
        const user = await User.findById(socket.userId);
        if (!user || user.role !== 'admin') return;

        // Reset user votes
        await User.updateMany(
          { room: socket.roomId },
          { $unset: { vote: 1 } }
        );
        
        // Reset room state
        await Room.findByIdAndUpdate(
          socket.roomId,
          { votesRevealed: false }
        );
        
        // Broadcast reset to room
        io.to(socket.roomId).emit('roomReset');
      } catch (err) {
        console.error('Reset failed:', err);
      }
    });

    // Handle disconnections
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      if (socket.roomId) {
        // Notify room that user left
        io.to(socket.roomId).emit('userLeft', socket.userId);
        
        // Clean up empty rooms after delay
        setTimeout(async () => {
          const userCount = await User.countDocuments({ room: socket.roomId });
          if (userCount === 0) {
            await Room.findByIdAndDelete(socket.roomId);
            console.log(`Room ${socket.roomId} deleted (no users)`);
          }
        }, 30000); // 30-second delay
      }
    });
  });
};