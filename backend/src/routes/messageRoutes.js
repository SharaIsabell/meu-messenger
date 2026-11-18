import { Router } from 'express';
import { messageController } from '../controllers/messageController.js';

const router = Router();

router.get('/:contactId', messageController.history);

export default router;