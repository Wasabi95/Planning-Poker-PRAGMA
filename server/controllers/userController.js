//server/controllers/userController.js
import User from '../models/User.js';
import Room from '../models/Room.js';

export const createUser = async (req, res) => {
  const { name, mode, roomId } = req.body;
  
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // First user becomes admin
    const usersInRoom = await User.countDocuments({ room: roomId });
    const role = usersInRoom === 0 ? 'admin' : 
                mode === 'spectator' ? 'spectator' : 'player';

    const user = new User({ name, role, mode, room: roomId });
    await user.save();
    
    res.status(201).json({ 
      ...user.toObject(),
      roomLink: room.link // Send room link for sharing
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Properly defined outside createUser
export const updateUserMode = async (req, res) => {
  const { mode } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { mode, ...(mode === 'spectator' && { vote: null }) },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};