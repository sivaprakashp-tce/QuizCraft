import User from '../models/User.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { createSendToken } from '../utils/auth.js';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const register = catchAsync(async (req, res, next) => {
    const { name, email, password, streamId, institutionId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !streamId || !institutionId) {
        return next(new AppError('All fields are required: name, email, password, streamId, institutionId', 400, 'MISSING_FIELDS'));
    }

    // Validate email format
    if (!validateEmail(email)) {
        return next(new AppError('Please provide a valid email address', 400, 'INVALID_EMAIL'));
    }

    // Validate password strength
    if (!validatePassword(password)) {
        return next(new AppError('Password must be at least 6 characters long and contain at least one letter and one number', 400, 'WEAK_PASSWORD'));
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
        return next(new AppError('User with this email already exists', 409, 'USER_EXISTS'));
    }

    // Create new user
    const newUser = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        password,
        streamId,
        institutionId
    });

    // Populate user data for response
    await newUser.populate([
        { path: 'streamId', select: 'streamName streamDescription' },
        { path: 'institutionId', select: 'name city country' }
    ]);

    logger.info(`New user registered: ${newUser.email}`);

    createSendToken(newUser, 201, res, 'User registered successfully');
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400, 'MISSING_CREDENTIALS'));
    }

    // Validate email format
    if (!validateEmail(email)) {
        return next(new AppError('Please provide a valid email address', 400, 'INVALID_EMAIL'));
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Check if user exists and password is correct
    const user = await User.findOne({ email: sanitizedEmail })
        .select('+password')
        .populate([
            { path: 'streamId', select: 'streamName streamDescription' },
            { path: 'institutionId', select: 'name city country' }
        ]);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401, 'INVALID_CREDENTIALS'));
    }

    logger.info(`User logged in: ${user.email}`);

    createSendToken(user, 200, res, 'Login successful');
});

export const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate([
            { path: 'streamId', select: 'streamName streamDescription' },
            { path: 'institutionId', select: 'name city country' }
        ]);

    res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
            user
        }
    });
});

export const updateProfile = catchAsync(async (req, res, next) => {
    const { name, streamId, institutionId } = req.body;
    const userId = req.user._id;

    // Create update object with only provided fields
    const updateData = {};
    if (name) updateData.name = sanitizeInput(name);
    if (streamId) updateData.streamId = streamId;
    if (institutionId) updateData.institutionId = institutionId;

    // Prevent password updates through this endpoint
    if (req.body.password) {
        return next(new AppError('Password updates are not allowed through this endpoint', 400, 'PASSWORD_UPDATE_FORBIDDEN'));
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).populate([
        { path: 'streamId', select: 'streamName streamDescription' },
        { path: 'institutionId', select: 'name city country' }
    ]);

    if (!updatedUser) {
        return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
    }

    logger.info(`User profile updated: ${updatedUser.email}`);

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: updatedUser
        }
    });
});
