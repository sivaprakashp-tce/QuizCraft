import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { validateObjectId, sanitizeInput } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const getQuizzesByStream = catchAsync(async (req, res, next) => {
    const { stream } = req.params;

    if (!validateObjectId(stream)) {
        return next(new AppError('Invalid stream ID', 400, 'INVALID_STREAM_ID'));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on user's institution and quiz settings
    const query = {
        streamId: stream,
        isActive: true
    };

    // If quiz is institution-only, filter by user's institution
    const institutionOnlyQuizzes = await Quiz.find({
        ...query,
        institutionOnly: true,
        institutionId: req.user.institutionId
    }).populate([
        { path: 'userId', select: 'name email' },
        { path: 'streamId', select: 'streamName' },
        { path: 'institutionId', select: 'name' }
    ]).skip(skip).limit(limit);

    const publicQuizzes = await Quiz.find({
        ...query,
        institutionOnly: false
    }).populate([
        { path: 'userId', select: 'name email' },
        { path: 'streamId', select: 'streamName' },
        { path: 'institutionId', select: 'name' }
    ]).skip(skip).limit(limit);

    const quizzes = [...institutionOnlyQuizzes, ...publicQuizzes];

    const total = await Quiz.countDocuments(query);

    res.status(200).json({
        success: true,
        message: 'Quizzes retrieved successfully',
        data: {
            quizzes,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

export const getQuizById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    const quiz = await Quiz.findById(id)
        .populate([
            { path: 'userId', select: 'name email' },
            { path: 'streamId', select: 'streamName streamDescription' },
            { path: 'institutionId', select: 'name city country' }
        ]);

    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    // Check if user has access to this quiz
    if (quiz.institutionOnly && quiz.institutionId._id.toString() !== req.user.institutionId.toString()) {
        return next(new AppError('You do not have access to this quiz', 403, 'ACCESS_DENIED'));
    }

    res.status(200).json({
        success: true,
        message: 'Quiz retrieved successfully',
        data: {
            quiz
        }
    });
});

export const getQuizQuestions = catchAsync(async (req, res, next) => {
    const { quizId } = req.params;

    if (!validateObjectId(quizId)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    // Check if user has access to this quiz
    if (quiz.institutionOnly && quiz.institutionId.toString() !== req.user.institutionId.toString()) {
        return next(new AppError('You do not have access to this quiz', 403, 'ACCESS_DENIED'));
    }

    const questions = await Question.find({ quizId }).select('-correctAnswer -__v');

    res.status(200).json({
        success: true,
        message: 'Quiz questions retrieved successfully',
        data: {
            questions,
            quizInfo: {
                id: quiz._id,
                name: quiz.quizName,
                description: quiz.quizDescription,
                totalPoints: quiz.totalPoints,
                numberOfQuestions: quiz.numberOfQuestions
            }
        }
    });
});

export const createQuiz = catchAsync(async (req, res, next) => {
    const { quizName, quizDescription, institutionOnly = false } = req.body;

    if (!quizName || !quizDescription) {
        return next(new AppError('Quiz name and description are required', 400, 'MISSING_FIELDS'));
    }

    const quiz = await Quiz.create({
        userId: req.user._id,
        streamId: req.user.streamId,
        institutionId: req.user.institutionId,
        quizName: sanitizeInput(quizName),
        quizDescription: sanitizeInput(quizDescription),
        institutionOnly
    });

    await quiz.populate([
        { path: 'userId', select: 'name email' },
        { path: 'streamId', select: 'streamName' },
        { path: 'institutionId', select: 'name' }
    ]);

    logger.info(`New quiz created: ${quiz.quizName} by ${req.user.email}`);

    res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: {
            quiz
        }
    });
});

export const updateQuiz = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { quizName, quizDescription, institutionOnly } = req.body;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    // Check if user owns the quiz
    if (quiz.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only update your own quizzes', 403, 'ACCESS_DENIED'));
    }

    const updateData = {};
    if (quizName) updateData.quizName = sanitizeInput(quizName);
    if (quizDescription) updateData.quizDescription = sanitizeInput(quizDescription);
    if (typeof institutionOnly === 'boolean') updateData.institutionOnly = institutionOnly;

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate([
        { path: 'userId', select: 'name email' },
        { path: 'streamId', select: 'streamName' },
        { path: 'institutionId', select: 'name' }
    ]);

    logger.info(`Quiz updated: ${updatedQuiz.quizName} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Quiz updated successfully',
        data: {
            quiz: updatedQuiz
        }
    });
});

export const deleteQuiz = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    // Check if user owns the quiz
    if (quiz.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only delete your own quizzes', 403, 'ACCESS_DENIED'));
    }

    // Delete all questions and attempts associated with this quiz
    await Question.deleteMany({ quizId: id });
    await Attempt.deleteMany({ quizId: id });
    await Quiz.findByIdAndDelete(id);

    logger.info(`Quiz deleted: ${quiz.quizName} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Quiz and all associated data deleted successfully'
    });
});

export const getTeacherQuizzes = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find({ userId: req.user._id })
        .populate([
            { path: 'streamId', select: 'streamName' },
            { path: 'institutionId', select: 'name' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Quiz.countDocuments({ userId: req.user._id });

    res.status(200).json({
        success: true,
        message: 'Teacher quizzes retrieved successfully',
        data: {
            quizzes,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});
