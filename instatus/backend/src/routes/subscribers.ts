import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: [], message: 'Subscribers retrieved successfully' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: {}, message: 'Subscription created successfully' });
}));

export default router;
