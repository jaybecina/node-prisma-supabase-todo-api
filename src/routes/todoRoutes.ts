import { Router } from 'express';
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';
import { todoLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);
router.use(todoLimiter);

router.post('/', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router; 