import { Router } from 'express';
import userRoutes from './userRoutes';
import todoRoutes from './todoRoutes';

const router = Router();

router.use('/auth', userRoutes);
router.use('/todos', todoRoutes);

export default router; 