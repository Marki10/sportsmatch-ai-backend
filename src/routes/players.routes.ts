import { Router } from 'express';
import { playersController } from '../controllers/players.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const createPlayerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Player name is required'),
    position: z.string().min(1, 'Position is required'),
    age: z.number().int().min(16).max(50),
    teamId: z.string().uuid('Invalid team ID'),
    goals: z.number().int().min(0).optional(),
    assists: z.number().int().min(0).optional(),
    matchesPlayed: z.number().int().min(0).optional(),
    rating: z.number().min(0).max(10).optional(),
  }),
});

const updatePlayerSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
    age: z.number().int().min(16).max(50).optional(),
    teamId: z.string().uuid().optional(),
    goals: z.number().int().min(0).optional(),
    assists: z.number().int().min(0).optional(),
    matchesPlayed: z.number().int().min(0).optional(),
    rating: z.number().min(0).max(10).optional(),
  }),
});

router.get('/', playersController.getAll);
router.get('/:id', playersController.getById);

router.post(
  '/',
  authenticate,
  validate(createPlayerSchema),
  playersController.create
);

router.put(
  '/:id',
  authenticate,
  validate(updatePlayerSchema),
  playersController.update
);

router.delete('/:id', authenticate, playersController.delete);

export default router;
