import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { validateObjectId, validateQuizAnswers } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const submitQuizAttempt = catchAsync(async (req, res, next) => {
    const { quizId, answers, timeSpent } = req.body;

    if (!quizId || !answers) {
        return next(new AppError('Quiz ID and answers are required', 400, 'MISSING_FIELDS'));
    }

    if (!validateObjectId(quizId)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    // Check if quiz exists and user has access
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    if (quiz.institutionOnly && quiz.institutionId.toString() !== req.user.institutionId.toString()) {
        return next(new AppError('You do not have access to this quiz', 403, 'ACCESS_DENIED'));
    }

    // Get all questions for the quiz
    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
        return next(new AppError('No questions found for this quiz', 400, 'NO_QUESTIONS'));
    }

    // Validate answers
    const validation = validateQuizAnswers(answers, questions);
    if (!validation.isValid) {
        return next(new AppError(validation.error, 400, 'INVALID_ANSWERS'));
    }

    // Check if user has already attempted this quiz
    const existingAttempt = await Attempt.findOne({ 
        userId: req.user._id, 
        quizId 
    });

    if (existingAttempt) {
        return next(new AppError('You have already attempted this quiz', 409, 'ALREADY_ATTEMPTED'));
    }

    // Calculate score and process answers
    let totalScore = 0;
    const totalPossibleScore = quiz.totalPoints;
    const processedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const question = questions[i];

        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        const pointsEarned = isCorrect ? question.pointsAwarded : 0;

        totalScore += pointsEarned;

        processedAnswers.push({
            questionId: question._id,
            selectedAnswer: answer.selectedAnswer,
            isCorrect,
            pointsEarned
        });
    }

    // Create attempt record
    const attempt = await Attempt.create({
        quizId,
        userId: req.user._id,
        answersRecorded: processedAnswers,
        score: totalScore,
        totalPossibleScore,
        timeSpent: timeSpent || 0
    });

    await attempt.populate([
        { path: 'quizId', select: 'quizName quizDescription' },
        { path: 'userId', select: 'name email' }
    ]);

    logger.info(`Quiz attempt submitted: ${quiz.quizName} by ${req.user.email}, Score: ${totalScore}/${totalPossibleScore}`);

    res.status(201).json({
        success: true,
        message: 'Quiz attempt submitted successfully',
        data: {
            attempt: {
                _id: attempt._id,
                score: attempt.score,
                totalPossibleScore: attempt.totalPossibleScore,
                percentage: attempt.percentage,
                timeSpent: attempt.timeSpent,
                dateOfAttempt: attempt.dateOfAttempt,
                quiz: attempt.quizId,
                answersRecorded: attempt.answersRecorded
            }
        }
    });
});

export const getUserAttempts = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    if (!validateObjectId(userId)) {
        return next(new AppError('Invalid user ID', 400, 'INVALID_USER_ID'));
    }

    // Users can only view their own attempts
    if (req.user._id.toString() !== userId) {
        return next(new AppError('You can only view your own attempts', 403, 'ACCESS_DENIED'));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const attempts = await Attempt.find({ userId })
        .populate([
            { path: 'quizId', select: 'quizName quizDescription streamId', populate: { path: 'streamId', select: 'streamName' } },
            { path: 'userId', select: 'name email' }
        ])
        .sort({ dateOfAttempt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Attempt.countDocuments({ userId });

    res.status(200).json({
        success: true,
        message: 'User attempts retrieved successfully',
        data: {
            attempts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

export const getQuizAttempts = catchAsync(async (req, res, next) => {
    const { quizId } = req.params;

    if (!validateObjectId(quizId)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    // Check if quiz exists and user owns it
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    if (quiz.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only view attempts for your own quizzes', 403, 'ACCESS_DENIED'));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const attempts = await Attempt.find({ quizId })
        .populate([
            { path: 'userId', select: 'name email starsGathered' }
        ])
        .sort({ score: -1, dateOfAttempt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Attempt.countDocuments({ quizId });

    res.status(200).json({
        success: true,
        message: 'Quiz attempts retrieved successfully',
        data: {
            attempts,
            quiz: {
                _id: quiz._id,
                quizName: quiz.quizName,
                totalPoints: quiz.totalPoints,
                numberOfQuestions: quiz.numberOfQuestions
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

export const getUserQuizAttempt = catchAsync(async (req, res, next) => {
    const { userId, quizId } = req.params;

    if (!validateObjectId(userId) || !validateObjectId(quizId)) {
        return next(new AppError('Invalid user ID or quiz ID', 400, 'INVALID_IDS'));
    }

    // Users can only view their own attempts, or quiz owners can view any
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    const canView = req.user._id.toString() === userId || 
                   quiz.userId.toString() === req.user._id.toString();

    if (!canView) {
        return next(new AppError('You do not have permission to view this attempt', 403, 'ACCESS_DENIED'));
    }

    const attempt = await Attempt.findOne({ userId, quizId })
        .populate([
            { path: 'quizId', select: 'quizName quizDescription totalPoints numberOfQuestions' },
            { path: 'userId', select: 'name email' },
            { path: 'answersRecorded.questionId', select: 'question options correctAnswer pointsAwarded' }
        ]);

    if (!attempt) {
        return next(new AppError('Attempt not found', 404, 'ATTEMPT_NOT_FOUND'));
    }

    res.status(200).json({
        success: true,
        message: 'Attempt retrieved successfully',
        data: {
            attempt
        }
    });
});

export const getQuizAttemptsSummary = catchAsync(async (req, res, next) => {
    const { quizId } = req.params;

    if (!validateObjectId(quizId)) {
        return next(new AppError('Invalid quiz ID', 400, 'INVALID_QUIZ_ID'));
    }

    // Check if quiz exists and user owns it
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppError('Quiz not found', 404, 'QUIZ_NOT_FOUND'));
    }

    if (quiz.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only view summary for your own quizzes', 403, 'ACCESS_DENIED'));
    }

    // Aggregate statistics
    const summary = await Attempt.aggregate([
        { $match: { quizId: quiz._id } },
        {
            $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                averageScore: { $avg: '$score' },
                averagePercentage: { $avg: '$percentage' },
                highestScore: { $max: '$score' },
                lowestScore: { $min: '$score' },
                averageTimeSpent: { $avg: '$timeSpent' }
            }
        }
    ]);

    const stats = summary[0] || {
        totalAttempts: 0,
        averageScore: 0,
        averagePercentage: 0,
        highestScore: 0,
        lowestScore: 0,
        averageTimeSpent: 0
    };

    // Get score distribution
    const scoreDistribution = await Attempt.aggregate([
        { $match: { quizId: quiz._id } },
        {
            $group: {
                _id: {
                    $switch: {
                        branches: [
                            { case: { $gte: ['$percentage', 90] }, then: 'A (90-100%)' },
                            { case: { $gte: ['$percentage', 80] }, then: 'B (80-89%)' },
                            { case: { $gte: ['$percentage', 70] }, then: 'C (70-79%)' },
                            { case: { $gte: ['$percentage', 60] }, then: 'D (60-69%)' },
                            { case: { $gte: ['$percentage', 50] }, then: 'E (50-59%)' }
                        ],
                        default: 'F (<50%)'
                    }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        success: true,
        message: 'Quiz attempts summary retrieved successfully',
        data: {
            quiz: {
                _id: quiz._id,
                quizName: quiz.quizName,
                totalPoints: quiz.totalPoints,
                numberOfQuestions: quiz.numberOfQuestions
            },
            summary: stats,
            scoreDistribution
        }
    });
});
