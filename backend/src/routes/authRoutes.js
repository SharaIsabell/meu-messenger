import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { credentialsSchema, recoverSchema, registerSchema } from '../validators/schemas.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(credentialsSchema), authController.login);
router.post('/recover', validate(recoverSchema), authController.recover);
router.get('/me', authenticate, authController.me);

export default router;