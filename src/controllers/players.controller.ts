import { Request, Response, NextFunction } from 'express';
import { playersService } from '../services/players.service';

export const playersController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const teamId = req.query.teamId as string | undefined;
      const players = await playersService.getAll(teamId);
      res.json({
        success: true,
        data: players,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const player = await playersService.getById(req.params.id);
      res.json({
        success: true,
        data: player,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const player = await playersService.create(req.body);
      res.status(201).json({
        success: true,
        data: player,
        message: 'Player created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const player = await playersService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: player,
        message: 'Player updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await playersService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Player deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
