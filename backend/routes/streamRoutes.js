import express from 'express';
import {
    createStream,
    getAllStreams,
    getStream,
    updateStream,
    deleteStream
} from '../controllers/streamController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Stream routes (for all authenticated users)
router.get('/stream/:streamId', getStream);
router.post('/stream', createStream);
router.put('/stream/:streamId', updateStream);
router.delete('/stream/:streamId', deleteStream);

export default router;
