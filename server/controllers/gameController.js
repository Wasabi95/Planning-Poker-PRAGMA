//server/controllers/gameController.js
import Room from '../models/Room.js';
import User from '../models/User.js';

export const vote = async (req, res) => {
  const { userId, voteValue } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || user.mode !== 'player') {
      return res.status(403).json({ error: 'Only players can vote' });
    }

    user.vote = voteValue;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const revealVotes = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      { votesRevealed: true },
      { new: true }
    );
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetRoom = async (req, res) => {
  try {
    await User.updateMany(
      { room: req.params.roomId },
      { vote: null }
    );
    
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      { votesRevealed: false },
      { new: true }
    );
    
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};