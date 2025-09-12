import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PORT, NODE_ENV } from './config/env.js';
import connectToDB from './database/mongodb.js';
import logger from './utils/logger.js';
import { globalErrorHandler, notFound } from './middlewares/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import attemptRoutes from './routes/attemptRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import { getAllInstitutions } from './controllers/institutionController.js';
import { getAllStreams } from './controllers/streamController.js';

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow localhost origins
        if (NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        // In production, specify allowed origins
        const allowedOrigins = [
            'http://localhost:5500',
            'http://localhost:5173',
            'https://quizcraft-tce.netlify.app'
            // Add your production frontend URLs here
        ];
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        error: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

// API routes
app.get('/api/institutions', getAllInstitutions);
app.get('/api/streams', getAllStreams);
app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);
app.use('/api', questionRoutes);
app.use('/api', attemptRoutes);
app.use('/api', institutionRoutes);
app.use('/api', streamRoutes);
app.use('/api', miscRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Quiz Platform API',
        version: '1.0.0',
        documentation: {
            auth: {
                'POST /api/auth/register': 'User registration',
                'POST /api/auth/login': 'User login',
                'GET /api/auth/user': 'Get user profile',
                'PUT /api/auth/user/update': 'Update user profile'
            },
            quiz: {
                'GET /api/quizzes/:stream': 'Get quizzes by stream',
                'GET /api/quiz/:id': 'Get quiz by ID',
                'GET /api/quiz/questions/:quizId': 'Get quiz questions',
                'POST /api/quiz': 'Create quiz (Teacher/Admin)',
                'PUT /api/quiz/:id': 'Update quiz (Teacher/Admin)',
                'DELETE /api/quiz/:id': 'Delete quiz (Teacher/Admin)',
                'GET /api/teacher/quizzes': 'Get teacher quizzes'
            },
            question: {
                'POST /api/question': 'Create question (Teacher/Admin)',
                'GET /api/question/:id': 'Get question by ID',
                'PUT /api/question/:id': 'Update question (Teacher/Admin)',
                'DELETE /api/question/:id': 'Delete question (Teacher/Admin)',
                'GET /api/quiz/questions': 'Get questions by quiz ID'
            },
            attempt: {
                'POST /api/quiz/attended': 'Submit quiz attempt',
                'GET /api/quiz/attended/:userId': 'Get user attempts',
                'GET /api/quiz/attempts/:quizId': 'Get quiz attempts (Teacher/Admin)',
                'GET /api/quiz/attempts/:userId/:quizId': 'Get specific attempt',
                'GET /api/quiz/attempts/summary/:quizId': 'Get quiz summary (Teacher/Admin)'
            },
            institution: {
                'GET /api/institutions': 'Get all institutions',
                'GET /api/institution/:id': 'Get institution by ID',
                'POST /api/institution': 'Create institution (Admin)',
                'PUT /api/institution/:id': 'Update institution (Admin)',
                'DELETE /api/institution/:id': 'Delete institution (Admin)'
            },
            stream: {
                'GET /api/streams': 'Get all streams',
                'GET /api/stream/:streamId': 'Get stream by ID',
                'POST /api/stream': 'Create stream (Teacher/Admin)',
                'PUT /api/stream/:streamId': 'Update stream (Admin)',
                'DELETE /api/stream/:streamId': 'Delete stream (Admin)'
            },
            misc: {
                'GET /api/stars/:userId': 'Get user stars',
                'GET /api/leaderboard': 'Get global leaderboard',
                'GET /api/leaderboard/stream/:streamId': 'Get stream leaderboard',
                'GET /api/dashboard/stats': 'Get dashboard statistics'
            }
        }
    });
});

// Handle undefined routes
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectToDB();
        
        // Start server
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT} in ${NODE_ENV} mode`);
            logger.info(`📚 API Documentation available at: http://localhost:${PORT}/api`);
            logger.info(`🏥 Health check available at: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

startServer();

export default app;
