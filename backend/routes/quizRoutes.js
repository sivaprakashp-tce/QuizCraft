import express from 'express';
import {
    getQuizzesByStream,
    getQuizById,
    getQuizQuestions,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getTeacherQuizzes
} from '../controllers/quizController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Quiz routes (for all authenticated users)
router.get('/quizzes/:stream', getQuizzesByStream);
router.get('/quiz/:id', getQuizById);
router.get('/quiz/questions/:quizId', getQuizQuestions);
router.post('/quiz', createQuiz);
router.put('/quiz/:id', updateQuiz);
router.delete('/quiz/:id', deleteQuiz);
router.get('/teacher/quizzes', getTeacherQuizzes);

export default router;
