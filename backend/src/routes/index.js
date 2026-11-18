import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './authRoutes.js';
import contactRoutes from './contactRoutes.js';
import messageRoutes from './messageRoutes.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

router.use('/auth', authLimiter, authRoutes);
router.use('/contacts', authenticate, contactRoutes);
router.use('/messages', authenticate, messageRoutes);

export default router;