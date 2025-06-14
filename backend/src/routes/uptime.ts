import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: [], message: 'Uptime checks retrieved successfully' });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: {}, message: 'Uptime check created successfully' });
}));

export default router;
