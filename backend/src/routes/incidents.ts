import { Router } from 'express';
import { authenticate, requireIncidentOwnership } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/:id', authenticate, requireIncidentOwnership, asyncHandler(async (req, res) => {
  res.json({ success: true, data: {}, message: 'Incident retrieved successfully' });
}));

router.put('/:id', authenticate, requireIncidentOwnership, asyncHandler(async (req, res) => {
  res.json({ success: true, data: {}, message: 'Incident updated successfully' });
}));

router.delete('/:id', authenticate, requireIncidentOwnership, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Incident deleted successfully' });
}));

export default router;
