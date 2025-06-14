import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: [], message: 'Notifications retrieved successfully' });
}));

export default router;
