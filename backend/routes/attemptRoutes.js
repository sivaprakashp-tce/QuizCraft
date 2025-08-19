import express from 'express';
import {
    submitQuizAttempt,
    getUserAttempts,
    getQuizAttempts,
    getUserQuizAttempt,
    getQuizAttemptsSummary
} from '../controllers/attemptController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Attempt routes (for all authenticated users)
router.post('/quiz/attended', submitQuizAttempt);
router.get('/quiz/attended/:userId', getUserAttempts);
router.get('/quiz/attempts/:userId/:quizId', getUserQuizAttempt);
router.get('/quiz/attempts/:quizId', getQuizAttempts);
router.get('/quiz/attempts/summary/:quizId', getQuizAttemptsSummary);

export default router;
