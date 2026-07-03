import { Router } from 'express';
import { register, login, me } from '../controllers/AuthController.js';
import { registerValidator, loginValidator } from '../validators/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Public routes
router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);

// Protected routes
router.get('/me', authenticate, me);

export default router;
