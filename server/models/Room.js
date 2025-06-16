/// models/Room.js
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
     minlength: [5, 'Room name must be at least 5 characters'],
    maxlength: [20, 'Room name cannot exceed 20 characters'],
     validate: [
      {
        validator: function(v) {
          // Contains only allowed characters
          return /^[a-zA-Z0-9 _.,*#/-]+$/.test(v);
        },
        message: 'Room name contains invalid characters'
      },
      {
        validator: function(v) {
          // Max 3 digits
          return (v.match(/\d/g) || []).length <= 3;
        },
        message: 'Room name can have maximum 3 numbers'
      },
      {
        validator: function(v) {
          // Not only numbers
          return !/^\d+$/.test(v);
        },
        message: 'Room name cannot consist only of numbers'
      }
    ]
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  cardMode: {
    type: String,
    enum: ['fibonacci', 't-shirt', 'standard'],
    default: 'fibonacci'
  },
  votesRevealed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);