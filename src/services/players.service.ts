import prisma from '../database';
import { AppError } from '../middleware/error-handler';
import { cache } from '../utils/redis';

interface CreatePlayerInput {
  name: string;
  position: string;
  age: number;
  teamId: string;
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
  rating?: number;
}

interface UpdatePlayerInput {
  name?: string;
  position?: string;
  age?: number;
  teamId?: string;
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
  rating?: number;
}

export const playersService = {
  async getAll(teamId?: string) {
    const cacheKey = teamId ? `players:team:${teamId}` : 'players:all';
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const where = teamId ? { teamId } : {};
    
    const players = await prisma.player.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    await cache.set(cacheKey, JSON.stringify(players), 300);

    return players;
  },

  async getById(id: string) {
    const cacheKey = `player:${id}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
      },
    });

    if (!player) {
      throw new AppError('Player not found', 404);
    }

    await cache.set(cacheKey, JSON.stringify(player), 300);

    return player;
  },

  async create(data: CreatePlayerInput) {
    // Verify team exists
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const player = await prisma.player.create({
      data,
      include: {
        team: true,
      },
    });

    // Invalidate cache
    await cache.delete('players:all');
    await cache.delete(`players:team:${data.teamId}`);
    await cache.delete(`team:${data.teamId}`);

    return player;
  },

  async update(id: string, data: UpdatePlayerInput) {
    const player = await prisma.player.update({
      where: { id },
      data,
      include: {
        team: true,
      },
    });

    // Invalidate cache
    await cache.delete('players:all');
    await cache.delete(`player:${id}`);
    if (player.teamId) {
      await cache.delete(`players:team:${player.teamId}`);
      await cache.delete(`team:${player.teamId}`);
    }

    return player;
  },

  async delete(id: string) {
    const player = await prisma.player.findUnique({
      where: { id },
      select: { teamId: true },
    });

    if (!player) {
      throw new AppError('Player not found', 404);
    }

    await prisma.player.delete({
      where: { id },
    });

    // Invalidate cache
    await cache.delete('players:all');
    await cache.delete(`player:${id}`);
    await cache.delete(`players:team:${player.teamId}`);
    await cache.delete(`team:${player.teamId}`);
  },
};
