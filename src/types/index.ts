import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: JwtPayload & { userId: string; email: string };
}

export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  teamId: string;
  stats: PlayerStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
  rating?: number;
}

export interface Team {
  id: string;
  name: string;
  country: string;
  foundedYear: number;
  stadium: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  status: 'scheduled' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  prediction?: MatchPrediction;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchPrediction {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability: number;
  predictedScore?: {
    home: number;
    away: number;
  };
  confidence: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
