import express from 'express';
import {
    createInstitution,
    getInstitution,
    getAllInstitutions,
    updateInstitution,
    deleteInstitution
} from '../controllers/institutionController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Institution routes (for all authenticated users)
router.get('/institutions', getAllInstitutions);
router.get('/institution/:id', getInstitution);
router.post('/institution', createInstitution);
router.put('/institution/:id', updateInstitution);
router.delete('/institution/:id', deleteInstitution);

export default router;
