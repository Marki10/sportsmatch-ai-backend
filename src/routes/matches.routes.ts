import { Router } from 'express';
import { matchesController } from '../controllers/matches.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const createMatchSchema = z.object({
  body: z.object({
    homeTeamId: z.string().uuid('Invalid home team ID'),
    awayTeamId: z.string().uuid('Invalid away team ID'),
    date: z.string().datetime('Invalid date format'),
    status: z.enum(['scheduled', 'live', 'finished']).optional(),
  }),
});

const updateMatchSchema = z.object({
  body: z.object({
    date: z.string().datetime().optional(),
    status: z.enum(['scheduled', 'live', 'finished']).optional(),
    homeScore: z.number().int().min(0).optional(),
    awayScore: z.number().int().min(0).optional(),
  }),
});

router.get('/', matchesController.getAll);
router.get('/:id', matchesController.getById);
router.get('/:id/prediction', matchesController.getPrediction);

router.post(
  '/',
  authenticate,
  validate(createMatchSchema),
  matchesController.create
);

router.put(
  '/:id',
  authenticate,
  validate(updateMatchSchema),
  matchesController.update
);

router.delete('/:id', authenticate, matchesController.delete);

export default router;
