import Stream from '../models/Stream.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { validateObjectId, sanitizeInput } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const createStream = catchAsync(async (req, res, next) => {
    const { streamName, streamDescription } = req.body;

    if (!streamName || !streamDescription) {
        return next(new AppError('Stream name and description are required', 400, 'MISSING_FIELDS'));
    }

    // Check if stream already exists
    const existingStream = await Stream.findOne({ 
        streamName: { $regex: `^${sanitizeInput(streamName)}$`, $options: 'i' }
    });

    if (existingStream) {
        return next(new AppError('Stream with this name already exists', 409, 'STREAM_EXISTS'));
    }

    const stream = await Stream.create({
        streamName: sanitizeInput(streamName),
        streamDescription: sanitizeInput(streamDescription)
    });

    logger.info(`New stream created: ${stream.streamName} by ${req.user.email}`);

    res.status(201).json({
        success: true,
        message: 'Stream created successfully',
        data: {
            stream
        }
    });
});

export const getAllStreams = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    // Build search query
    const query = {};
    if (search) {
        query.$or = [
            { streamName: { $regex: search, $options: 'i' } },
            { streamDescription: { $regex: search, $options: 'i' } }
        ];
    }

    const streams = await Stream.find(query)
        .sort({ streamName: 1 })
        .skip(skip)
        .limit(limit);

    const total = await Stream.countDocuments(query);

    res.status(200).json({
        success: true,
        message: 'Streams retrieved successfully',
        data: {
            streams,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

export const getStream = catchAsync(async (req, res, next) => {
    const { streamId } = req.params;

    if (!validateObjectId(streamId)) {
        return next(new AppError('Invalid stream ID', 400, 'INVALID_STREAM_ID'));
    }

    const stream = await Stream.findById(streamId);

    if (!stream) {
        return next(new AppError('Stream not found', 404, 'STREAM_NOT_FOUND'));
    }

    // Get some statistics about the stream
    const Quiz = await import('../models/Quiz.js');
    const User = await import('../models/User.js');

    const [quizCount, userCount] = await Promise.all([
        Quiz.default.countDocuments({ streamId }),
        User.default.countDocuments({ streamId })
    ]);

    res.status(200).json({
        success: true,
        message: 'Stream retrieved successfully',
        data: {
            stream,
            statistics: {
                totalQuizzes: quizCount,
                totalUsers: userCount
            }
        }
    });
});

export const updateStream = catchAsync(async (req, res, next) => {
    const { streamId } = req.params;
    const { streamName, streamDescription } = req.body;

    if (!validateObjectId(streamId)) {
        return next(new AppError('Invalid stream ID', 400, 'INVALID_STREAM_ID'));
    }

    const stream = await Stream.findById(streamId);
    if (!stream) {
        return next(new AppError('Stream not found', 404, 'STREAM_NOT_FOUND'));
    }

    const updateData = {};
    if (streamName) {
        // Check if new name conflicts with existing streams
        const existingStream = await Stream.findOne({ 
            _id: { $ne: streamId },
            streamName: { $regex: `^${sanitizeInput(streamName)}$`, $options: 'i' }
        });

        if (existingStream) {
            return next(new AppError('Stream with this name already exists', 409, 'STREAM_EXISTS'));
        }

        updateData.streamName = sanitizeInput(streamName);
    }
    if (streamDescription) updateData.streamDescription = sanitizeInput(streamDescription);

    const updatedStream = await Stream.findByIdAndUpdate(streamId, updateData, {
        new: true,
        runValidators: true
    });

    logger.info(`Stream updated: ${updatedStream.streamName} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Stream updated successfully',
        data: {
            stream: updatedStream
        }
    });
});

export const deleteStream = catchAsync(async (req, res, next) => {
    const { streamId } = req.params;

    if (!validateObjectId(streamId)) {
        return next(new AppError('Invalid stream ID', 400, 'INVALID_STREAM_ID'));
    }

    const stream = await Stream.findById(streamId);
    if (!stream) {
        return next(new AppError('Stream not found', 404, 'STREAM_NOT_FOUND'));
    }

    // Check if any users or quizzes are associated with this stream
    const User = await import('../models/User.js');
    const Quiz = await import('../models/Quiz.js');
    
    const [usersCount, quizzesCount] = await Promise.all([
        User.default.countDocuments({ streamId }),
        Quiz.default.countDocuments({ streamId })
    ]);

    if (usersCount > 0 || quizzesCount > 0) {
        return next(new AppError(`Cannot delete stream. ${usersCount} users and ${quizzesCount} quizzes are still associated with it.`, 400, 'STREAM_IN_USE'));
    }

    await Stream.findByIdAndDelete(streamId);

    logger.info(`Stream deleted: ${stream.streamName} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Stream deleted successfully'
    });
});
