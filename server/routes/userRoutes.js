/// server/routes/userRoutes.js
import express from 'express';
import { createUser, updateUserMode } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.put('/:id/mode', updateUserMode);

export default router;