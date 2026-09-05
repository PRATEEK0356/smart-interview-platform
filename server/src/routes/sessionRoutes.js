import express from 'express';
import {
  createSession,
  getSessionById,
  submitAnswer,
  completeSession,
  deleteSession,
  getUserSessions,
} from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createSession);
router.get('/', getUserSessions);
router.get('/:id', getSessionById);
router.patch('/:id/answer', submitAnswer);
router.patch('/:id/complete', completeSession);
router.delete('/:id', deleteSession);

export default router;
