import winston from 'winston';
import { NODE_ENV } from '../config/env.js';

const logger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} ${level}: ${stack || message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        })
    ]
});

// Create logs directory if it doesn't exist
import { promises as fs } from 'fs';
import path from 'path';

(async () => {
    try {
        await fs.mkdir(path.join(process.cwd(), 'logs'), { recursive: true });
    } catch (error) {
        // Directory already exists or other error
    }
})();

export default logger;
