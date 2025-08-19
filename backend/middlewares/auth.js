import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided or invalid format.',
                error: 'MISSING_TOKEN'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId)
            .populate('streamId', 'streamName streamDescription')
            .populate('institutionId', 'name city country');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. User not found.',
                error: 'USER_NOT_FOUND'
            });
        }

        // Add user to request object
        req.user = user;
        next();

    } catch (error) {
        logger.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token.',
                error: 'INVALID_TOKEN'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Token expired.',
                error: 'TOKEN_EXPIRED'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.',
            error: 'INTERNAL_ERROR'
        });
    }
};
