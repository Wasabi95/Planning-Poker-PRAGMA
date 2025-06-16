// server/routes/gameRoutes.js
import express from 'express';
import { vote, revealVotes, resetRoom } from '../controllers/gameController.js';

const router = express.Router();

router.post('/vote', vote);
router.put('/:roomId/reveal', revealVotes);
router.put('/:roomId/reset', resetRoom);

export default router;