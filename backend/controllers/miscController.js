import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { validateObjectId } from '../utils/validation.js';

export const getUserStars = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    if (!validateObjectId(userId)) {
        return next(new AppError('Invalid user ID', 400, 'INVALID_USER_ID'));
    }

    const user = await User.findById(userId)
        .select('name email starsGathered')
        .populate([
            { path: 'streamId', select: 'streamName' },
            { path: 'institutionId', select: 'name' }
        ]);

    if (!user) {
        return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
    }

    // Get user's quiz attempts count and average score
    const userStats = await Attempt.aggregate([
        { $match: { userId: user._id } },
        {
            $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                averageScore: { $avg: '$percentage' },
                bestScore: { $max: '$percentage' }
            }
        }
    ]);

    const stats = userStats[0] || {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0
    };

    res.status(200).json({
        success: true,
        message: 'User stars and statistics retrieved successfully',
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                starsGathered: user.starsGathered,
                stream: user.streamId,
                institution: user.institutionId
            },
            statistics: {
                totalAttempts: stats.totalAttempts,
                averageScore: Math.round(stats.averageScore * 100) / 100,
                bestScore: Math.round(stats.bestScore * 100) / 100
            }
        }
    });
});

export const getGlobalLeaderboard = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { streamId, institutionId } = req.query;

    // Build filter query
    const matchQuery = {};
    if (streamId && validateObjectId(streamId)) {
        matchQuery.streamId = streamId;
    }
    if (institutionId && validateObjectId(institutionId)) {
        matchQuery.institutionId = institutionId;
    }

    // Get leaderboard with user stats
    const leaderboard = await User.aggregate([
        { $match: matchQuery },
        {
            $lookup: {
                from: 'attempts',
                localField: '_id',
                foreignField: 'userId',
                as: 'attempts'
            }
        },
        {
            $lookup: {
                from: 'streams',
                localField: 'streamId',
                foreignField: '_id',
                as: 'stream'
            }
        },
        {
            $lookup: {
                from: 'institutions',
                localField: 'institutionId',
                foreignField: '_id',
                as: 'institution'
            }
        },
        {
            $addFields: {
                totalAttempts: { $size: '$attempts' },
                averageScore: {
                    $cond: {
                        if: { $gt: [{ $size: '$attempts' }, 0] },
                        then: { $avg: '$attempts.percentage' },
                        else: 0
                    }
                },
                bestScore: {
                    $cond: {
                        if: { $gt: [{ $size: '$attempts' }, 0] },
                        then: { $max: '$attempts.percentage' },
                        else: 0
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                starsGathered: 1,
                totalAttempts: 1,
                averageScore: { $round: ['$averageScore', 2] },
                bestScore: { $round: ['$bestScore', 2] },
                stream: { $arrayElemAt: ['$stream.streamName', 0] },
                institution: { $arrayElemAt: ['$institution.name', 0] },
                createdAt: 1
            }
        },
        { $sort: { starsGathered: -1, averageScore: -1, bestScore: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(matchQuery);

    // Add ranking
    const rankedLeaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: skip + index + 1
    }));

    res.status(200).json({
        success: true,
        message: 'Global leaderboard retrieved successfully',
        data: {
            leaderboard: rankedLeaderboard,
            pagination: {
                page,
                limit,
                total: totalUsers,
                pages: Math.ceil(totalUsers / limit)
            }
        }
    });
});

export const getStreamLeaderboard = catchAsync(async (req, res, next) => {
    const { streamId } = req.params;

    if (!validateObjectId(streamId)) {
        return next(new AppError('Invalid stream ID', 400, 'INVALID_STREAM_ID'));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const leaderboard = await User.aggregate([
        { $match: { streamId: streamId } },
        {
            $lookup: {
                from: 'attempts',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$userId', '$$userId'] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'quizzes',
                            localField: 'quizId',
                            foreignField: '_id',
                            as: 'quiz'
                        }
                    },
                    {
                        $match: {
                            'quiz.streamId': streamId
                        }
                    }
                ],
                as: 'streamAttempts'
            }
        },
        {
            $lookup: {
                from: 'institutions',
                localField: 'institutionId',
                foreignField: '_id',
                as: 'institution'
            }
        },
        {
            $addFields: {
                streamAttempts: { $size: '$streamAttempts' },
                streamAverageScore: {
                    $cond: {
                        if: { $gt: [{ $size: '$streamAttempts' }, 0] },
                        then: { $avg: '$streamAttempts.percentage' },
                        else: 0
                    }
                },
                streamBestScore: {
                    $cond: {
                        if: { $gt: [{ $size: '$streamAttempts' }, 0] },
                        then: { $max: '$streamAttempts.percentage' },
                        else: 0
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                starsGathered: 1,
                streamAttempts: 1,
                streamAverageScore: { $round: ['$streamAverageScore', 2] },
                streamBestScore: { $round: ['$streamBestScore', 2] },
                institution: { $arrayElemAt: ['$institution.name', 0] }
            }
        },
        { $sort: { starsGathered: -1, streamAverageScore: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    const totalUsers = await User.countDocuments({ streamId });

    const rankedLeaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: skip + index + 1
    }));

    res.status(200).json({
        success: true,
        message: 'Stream leaderboard retrieved successfully',
        data: {
            leaderboard: rankedLeaderboard,
            pagination: {
                page,
                limit,
                total: totalUsers,
                pages: Math.ceil(totalUsers / limit)
            }
        }
    });
});

export const getDashboardStats = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    // Get user's basic stats
    const userStats = await Attempt.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                averageScore: { $avg: '$percentage' },
                bestScore: { $max: '$percentage' },
                totalPointsEarned: { $sum: '$score' }
            }
        }
    ]);

    const stats = userStats[0] || {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalPointsEarned: 0
    };

    // Get recent attempts
    const recentAttempts = await Attempt.find({ userId })
        .populate('quizId', 'quizName')
        .sort({ dateOfAttempt: -1 })
        .limit(5)
        .select('quizId score percentage dateOfAttempt');

    // Get user's rank in global leaderboard
    const userRank = await User.countDocuments({
        $or: [
            { starsGathered: { $gt: req.user.starsGathered } },
            {
                starsGathered: req.user.starsGathered,
                _id: { $lt: req.user._id }
            }
        ]
    }) + 1;

    // Get total available quizzes for user's stream
    const availableQuizzes = await Quiz.countDocuments({
        streamId: req.user.streamId,
        isActive: true,
        $or: [
            { institutionOnly: false },
            { institutionId: req.user.institutionId }
        ]
    });

    res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: {
            userStats: {
                totalAttempts: stats.totalAttempts,
                averageScore: Math.round(stats.averageScore * 100) / 100,
                bestScore: Math.round(stats.bestScore * 100) / 100,
                totalPointsEarned: stats.totalPointsEarned,
                starsGathered: req.user.starsGathered,
                globalRank: userRank
            },
            recentAttempts,
            availableQuizzes
        }
    });
});
