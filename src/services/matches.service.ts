import prisma from '../database';
import { AppError } from '../middleware/error-handler';
import { cache } from '../utils/redis';
import OpenAI from 'openai';
import { config } from '../config/env';

const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

interface CreateMatchInput {
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  status?: 'scheduled' | 'live' | 'finished';
}

interface UpdateMatchInput {
  date?: Date;
  status?: 'scheduled' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
}

interface MatchPrediction {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability: number;
  predictedScore?: {
    home: number;
    away: number;
  };
  confidence: number;
}

async function generatePrediction(homeTeamName: string, awayTeamName: string): Promise<MatchPrediction> {
  if (!openai) {
    // Fallback prediction without AI
    return {
      homeWinProbability: 0.35,
      awayWinProbability: 0.35,
      drawProbability: 0.30,
      predictedScore: { home: 1, away: 1 },
      confidence: 0.5,
    };
  }

  try {
    const prompt = `You are a sports analyst. Predict the outcome of a match between ${homeTeamName} (home) and ${awayTeamName} (away).

Return a JSON object with this exact structure:
{
  "homeWinProbability": number (0-1),
  "awayWinProbability": number (0-1),
  "drawProbability": number (0-1),
  "predictedScore": { "home": number, "away": number },
  "confidence": number (0-1)
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful sports analyst. Always return valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]) as MatchPrediction;
  } catch (error) {
    console.error('AI prediction error:', error);
    // Fallback prediction
    return {
      homeWinProbability: 0.35,
      awayWinProbability: 0.35,
      drawProbability: 0.30,
      predictedScore: { home: 1, away: 1 },
      confidence: 0.5,
    };
  }
}

export const matchesService = {
  async getAll(status?: string) {
    const cacheKey = status ? `matches:status:${status}` : 'matches:all';
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const where = status ? { status } : {};
    
    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    await cache.set(cacheKey, JSON.stringify(matches), 300);

    return matches;
  },

  async getById(id: string) {
    const cacheKey = `match:${id}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new AppError('Match not found', 404);
    }

    await cache.set(cacheKey, JSON.stringify(match), 300);

    return match;
  },

  async create(data: CreateMatchInput) {
    // Verify teams exist
    const [homeTeam, awayTeam] = await Promise.all([
      prisma.team.findUnique({ where: { id: data.homeTeamId } }),
      prisma.team.findUnique({ where: { id: data.awayTeamId } }),
    ]);

    if (!homeTeam || !awayTeam) {
      throw new AppError('One or both teams not found', 404);
    }

    if (data.homeTeamId === data.awayTeamId) {
      throw new AppError('Home and away teams must be different', 400);
    }

    // Generate AI prediction if scheduled
    let prediction = null;
    if (data.status === 'scheduled' || !data.status) {
      prediction = await generatePrediction(homeTeam.name, awayTeam.name);
    }

    const match = await prisma.match.create({
      data: {
        ...data,
        status: data.status || 'scheduled',
        prediction: prediction ? JSON.parse(JSON.stringify(prediction)) : null,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // Invalidate cache
    await cache.delete('matches:all');
    await cache.delete(`matches:status:scheduled`);
    await cache.delete(`team:${data.homeTeamId}`);
    await cache.delete(`team:${data.awayTeamId}`);

    return match;
  },

  async update(id: string, data: UpdateMatchInput) {
    const match = await prisma.match.update({
      where: { id },
      data,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // Invalidate cache
    await cache.delete('matches:all');
    await cache.delete(`match:${id}`);
    if (data.status) {
      await cache.delete(`matches:status:${data.status}`);
    }
    await cache.delete(`team:${match.homeTeamId}`);
    await cache.delete(`team:${match.awayTeamId}`);

    return match;
  },

  async delete(id: string) {
    const match = await prisma.match.findUnique({
      where: { id },
      select: { homeTeamId: true, awayTeamId: true },
    });

    if (!match) {
      throw new AppError('Match not found', 404);
    }

    await prisma.match.delete({
      where: { id },
    });

    // Invalidate cache
    await cache.delete('matches:all');
    await cache.delete(`match:${id}`);
    await cache.delete(`team:${match.homeTeamId}`);
    await cache.delete(`team:${match.awayTeamId}`);
  },

  async getPrediction(id: string) {
    const match = await this.getById(id);
    
    if (match.prediction) {
      return match.prediction as MatchPrediction;
    }

    // Generate new prediction if not exists
    const prediction = await generatePrediction(
      match.homeTeam.name,
      match.awayTeam.name
    );

    // Update match with prediction
    await prisma.match.update({
      where: { id },
      data: {
        prediction: JSON.parse(JSON.stringify(prediction)),
      },
    });

    await cache.delete(`match:${id}`);

    return prediction;
  },
};
