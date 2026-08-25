import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getUserProfile, updateTypingStats } from '../controllers/userController.js';

const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
router.route('/stats').put(protect, updateTypingStats);

export default router;