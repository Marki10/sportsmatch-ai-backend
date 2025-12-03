import { Request, Response, NextFunction } from 'express';
import { teamsService } from '../services/teams.service';

export const teamsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await teamsService.getAll();
      res.json({
        success: true,
        data: teams,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await teamsService.getById(req.params.id);
      res.json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await teamsService.create(req.body);
      res.status(201).json({
        success: true,
        data: team,
        message: 'Team created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await teamsService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: team,
        message: 'Team updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await teamsService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Team deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
