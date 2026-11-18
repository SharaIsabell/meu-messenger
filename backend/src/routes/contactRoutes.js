import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { validate } from '../middlewares/validate.js';
import { addContactSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', contactController.list);
router.post('/', validate(addContactSchema), contactController.add);

export default router;