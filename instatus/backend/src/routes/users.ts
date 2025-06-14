import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  res.json({ success: true, data: [], message: 'Users retrieved successfully' });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: {}, message: 'User retrieved successfully' });
}));

export default router;
