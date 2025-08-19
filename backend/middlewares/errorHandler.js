import logger from '../utils/logger.js';
import { NODE_ENV } from '../config/env.js';

// Custom error class
export class AppError extends Error {
    constructor(message, statusCode, errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handle Cast Errors (Invalid ObjectId)
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400, 'INVALID_ID');
};

// Handle Duplicate Fields Error
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400, 'DUPLICATE_FIELD');
};

// Handle Validation Errors
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400, 'VALIDATION_ERROR');
};

// Send error in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: err.errorCode || 'UNKNOWN_ERROR',
        message: err.message,
        stack: err.stack
    });
};

// Send error in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            error: err.errorCode || 'OPERATIONAL_ERROR',
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        logger.error('ERROR:', err);
        
        res.status(500).json({
            success: false,
            error: 'INTERNAL_ERROR',
            message: 'Something went wrong!'
        });
    }
};

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific mongoose errors
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        sendErrorProd(error, res);
    }
};

// Handle 404 errors
export const notFound = (req, res, next) => {
    const err = new AppError(`Not found - ${req.originalUrl}`, 404, 'NOT_FOUND');
    next(err);
};

// Async error wrapper
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
