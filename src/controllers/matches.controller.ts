import { Request, Response, NextFunction } from 'express';
import { matchesService } from '../services/matches.service';

export const matchesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const matches = await matchesService.getAll(status);
      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await matchesService.getById(req.params.id);
      res.json({
        success: true,
        data: match,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await matchesService.create({
        ...req.body,
        date: new Date(req.body.date),
      });
      res.status(201).json({
        success: true,
        data: match,
        message: 'Match created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };
      const match = await matchesService.update(req.params.id, data);
      res.json({
        success: true,
        data: match,
        message: 'Match updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await matchesService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Match deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getPrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const prediction = await matchesService.getPrediction(req.params.id);
      res.json({
        success: true,
        data: prediction,
      });
    } catch (error) {
      next(error);
    }
  },
};
