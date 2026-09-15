import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as supportController from '../controllers/support.controller';

const router = Router();

router.use(authMiddleware);

router.post('/request', supportController.requestSupport);
router.get('/', supportController.listSupport);
router.patch('/:id/accept', supportController.acceptSupport);
router.patch('/:id/reject', supportController.rejectSupport);
router.delete('/:id', supportController.removeSupport);

export default router;
