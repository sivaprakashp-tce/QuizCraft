import Question from '../models/Question.js';
import Quiz from '../models/Quiz.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { validateObjectId, sanitizeInput } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const createQuestion = catchAsync(async (req, res, next) => {
    const { quizId, question, options, correctAnswer, pointsAwarded = 1, questionType = 'multiple-choice' } = req.body;

    if (!quizId || !question || !options || typeof correctAnswer !== 'number' || !pointsAwarded) {
        return next(new AppError('All fields are required: quizId, question, options, correctAnswer, pointsAwarded', 400, 'MISSING_FIELDS'));
    }

    if (!validateObjectId(quizId)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    // Check if quiz exists and user owns it
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    if (quiz.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only add questions to your own quizzes', 403, 'ACCESS_DENIED'));
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
        return next(new AppError('At least 2 options are required', 400, 'INSUFFICIENT_OPTIONS'));
    }

    if (correctAnswer < 0 || correctAnswer >= options.length) {
        return next(new AppError('Correct answer index is out of range', 400, 'INVALID_CORRECT_ANSWER'));
    }

    // Sanitize inputs
    const sanitizedQuestion = sanitizeInput(question);
    const sanitizedOptions = options.map(option => sanitizeInput(option));

    const newQuestion = await Question.create({
        quizId,
        question: sanitizedQuestion,
        options: sanitizedOptions,
        correctAnswer,
        pointsAwarded,
        questionType
    });

    logger.info(`New question added to quiz ${quiz.quizName} by ${req.user.email}`);

    res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: {
            question: newQuestion
        }
    });
});

export const getQuestion = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid question ID', 400, 'INVALID_QUESTION_ID'));
    }

    const question = await Question.findById(id).populate({
        path: 'quizId',
        select: 'quizName userId',
        populate: {
            path: 'userId',
            select: 'name email'
        }
    });

    if (!question) {
        return next(new AppError('Question not found', 404, 'QUESTION_NOT_FOUND'));
    }

    // Check if user owns the quiz (for editing purposes) or hide correct answer for students
    const isOwner = question.quizId.userId._id.toString() === req.user._id.toString();
    
    if (!isOwner) {
        question.correctAnswer = undefined;
    }

    res.status(200).json({
        success: true,
        message: 'Question retrieved successfully',
        data: {
            question,
            isOwner
        }
    });
});

export const updateQuestion = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { question, options, correctAnswer, pointsAwarded, questionType } = req.body;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid question ID', 400, 'INVALID_QUESTION_ID'));
    }

    const existingQuestion = await Question.findById(id).populate('quizId');
    if (!existingQuestion) {
        return next(new AppError('Question not found', 404, 'QUESTION_NOT_FOUND'));
    }

    // Check if user owns the quiz
    if (existingQuestion.quizId.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only update questions in your own quizzes', 403, 'ACCESS_DENIED'));
    }

    const updateData = {};
    if (question) updateData.question = sanitizeInput(question);
    if (options) {
        if (!Array.isArray(options) || options.length < 2) {
            return next(new AppError('At least 2 options are required', 400, 'INSUFFICIENT_OPTIONS'));
        }
        updateData.options = options.map(option => sanitizeInput(option));
    }
    if (typeof correctAnswer === 'number') {
        const optionsArray = options || existingQuestion.options;
        if (correctAnswer < 0 || correctAnswer >= optionsArray.length) {
            return next(new AppError('Correct answer index is out of range', 400, 'INVALID_CORRECT_ANSWER'));
        }
        updateData.correctAnswer = correctAnswer;
    }
    if (pointsAwarded) updateData.pointsAwarded = pointsAwarded;
    if (questionType) updateData.questionType = questionType;

    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    logger.info(`Question updated in quiz ${existingQuestion.quizId.quizName} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Question updated successfully',
        data: {
            question: updatedQuestion
        }
    });
});

export const deleteQuestion = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid question ID', 400, 'INVALID_QUESTION_ID'));
    }

    const question = await Question.findById(id).populate('quizId');
    if (!question) {
        return next(new AppError('Question not found', 404, 'QUESTION_NOT_FOUND'));
    }

    // Check if user owns the quiz
    if (question.quizId.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only delete questions from your own quizzes', 403, 'ACCESS_DENIED'));
    }

    await Question.findByIdAndDelete(id);

    logger.info(`Question deleted from quiz ${question.quizId.quizName} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Question deleted successfully'
    });
});

export const getQuestionsByQuiz = catchAsync(async (req, res, next) => {
    const { quizId } = req.query;

    if (quizId && !validateObjectId(quizId)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    const query = {};
    if (quizId) query.quizId = quizId;

    const questions = await Question.find(query).populate({
        path: 'quizId',
        select: 'quizName userId',
        populate: {
            path: 'userId',
            select: 'name email'
        }
    });

    // Filter questions based on ownership for correct answers
    const filteredQuestions = questions.map(question => {
        const isOwner = question.quizId.userId._id.toString() === req.user._id.toString();
        if (!isOwner) {
            const questionObj = question.toObject();
            delete questionObj.correctAnswer;
            return questionObj;
        }
        return question;
    });

    res.status(200).json({
        success: true,
        message: 'Questions retrieved successfully',
        data: {
            questions: filteredQuestions
        }
    });
});
