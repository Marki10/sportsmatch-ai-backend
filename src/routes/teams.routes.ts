import { Router } from 'express';
import { teamsController } from '../controllers/teams.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Team name is required'),
    country: z.string().min(1, 'Country is required'),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()),
    stadium: z.string().min(1, 'Stadium name is required'),
  }),
});

const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    stadium: z.string().min(1).optional(),
  }),
});

router.get('/', teamsController.getAll);
router.get('/:id', teamsController.getById);

router.post(
  '/',
  authenticate,
  validate(createTeamSchema),
  teamsController.create
);

router.put(
  '/:id',
  authenticate,
  validate(updateTeamSchema),
  teamsController.update
);

router.delete('/:id', authenticate, teamsController.delete);

export default router;
