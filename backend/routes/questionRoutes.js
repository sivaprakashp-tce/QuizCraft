import express from 'express';
import {
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByQuiz
} from '../controllers/questionController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Question routes (for all authenticated users)
router.get('/question/:id', getQuestion);
router.get('/quiz/questions', getQuestionsByQuiz);
router.post('/question', createQuestion);
router.put('/question/:id', updateQuestion);
router.delete('/question/:id', deleteQuestion);

export default router;
