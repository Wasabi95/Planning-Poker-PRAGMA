// server/utils/validation.js
import { customAlphabet } from 'nanoid';

// Room name validation
export const validateRoomName = (name) => {
  return /^[a-zA-Z0-9 _.,*#/-]{5,20}$/.test(name) &&
         (name.match(/\d/g) || []).length <= 3 &&
         !/^\d+$/.test(name);
};

// Generate unique room link
export const generateUniqueLink = () => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 8);
  return nanoid();
};
