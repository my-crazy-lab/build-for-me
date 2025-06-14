import { Router } from 'express';
import { optionalAuthenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/:slug', optionalAuthenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: {}, message: 'Status page retrieved successfully' });
}));

router.post('/:slug/subscribe', asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: {}, message: 'Subscription created successfully' });
}));

export default router;
