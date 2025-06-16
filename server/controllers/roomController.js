/// server/controllers/roomController.js
import Room from '../models/Room.js';
import { generateUniqueLink } from '../utils/validation.js';

export const createRoom = async (req, res) => {
  const { name } = req.body;
  
  try {
    const link = generateUniqueLink();
    const room = new Room({ name, link });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.json(room);
  } catch (err) {
    res.status(404).json({ error: 'Room not found' });
  }
};