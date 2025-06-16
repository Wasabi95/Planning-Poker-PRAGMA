// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    validate: {
      validator: function(v) {
        // 1. Check length
        if (v.length < 5 || v.length > 20) return false;
        
        // 2. Check character composition
        const validChars = /^[a-zA-Z0-9 _.,*#/-]+$/;
        if (!validChars.test(v)) return false;
        
        // 3. Check digit count
        const digitCount = (v.match(/\d/g) || []).length;
        if (digitCount > 3) return false;
        
        // 4. Check not only numbers
        if (/^\d+$/.test(v)) return false;
        
        return true;
      },
      message: 'Username must be 5-20 characters with max 3 numbers, and can only contain letters, numbers, spaces, or _.,*#/-'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'player', 'spectator'],
    default: 'player'
  },
  mode: {
    type: String,
    enum: ['player', 'spectator'],
    default: 'player'
  },
  vote: String,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  socketId: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);