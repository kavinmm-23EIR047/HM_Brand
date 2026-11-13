import { Router } from 'express';
import { leadsController } from './leads.controller';

const router = Router();

// Public endpoint for chatbot lead creation
router.post('/', leadsController.create);

// Admin endpoints for lead management
router.get('/', leadsController.getAll);
router.patch('/:id', leadsController.update);
router.delete('/:id', leadsController.delete);

export default router;

