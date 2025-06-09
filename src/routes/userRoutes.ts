import { Router } from 'express';
import { register, login, logout } from '../controllers/userController';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', apiLimiter, authenticateToken, logout);

export default router; 