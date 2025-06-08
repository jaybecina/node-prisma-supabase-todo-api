import { Router } from 'express';
import { register, login, logout } from '../controllers/userController';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authLimiter, logout);

export default router; 