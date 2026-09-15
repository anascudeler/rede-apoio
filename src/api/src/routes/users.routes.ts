import { Router } from 'express';
import { getMe, searchUsers } from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.get('/search', authMiddleware, searchUsers);

export default router;
