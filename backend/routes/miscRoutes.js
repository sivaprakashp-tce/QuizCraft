import express from 'express';
import {
    getUserStars,
    getGlobalLeaderboard,
    getStreamLeaderboard,
    getDashboardStats
} from '../controllers/miscController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Miscellaneous routes
router.get('/stars/:userId', getUserStars);
router.get('/leaderboard', getGlobalLeaderboard);
router.get('/leaderboard/stream/:streamId', getStreamLeaderboard);
router.get('/dashboard/stats', getDashboardStats);

export default router;
