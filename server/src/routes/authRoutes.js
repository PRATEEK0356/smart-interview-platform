import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfileImage,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile-image', protect, updateProfileImage);
router.get('/me', protect, getMe);

export default router;
