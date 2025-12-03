import prisma from '../database';
import { AppError } from '../middleware/error-handler';
import { cache } from '../utils/redis';

interface CreateTeamInput {
  name: string;
  country: string;
  foundedYear: number;
  stadium: string;
}

interface UpdateTeamInput {
  name?: string;
  country?: string;
  foundedYear?: number;
  stadium?: string;
}

export const teamsService = {
  async getAll() {
    const cacheKey = 'teams:all';
    
    // Try to get from cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const teams = await prisma.team.findMany({
      include: {
        players: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Cache for 5 minutes
    await cache.set(cacheKey, JSON.stringify(teams), 300);

    return teams;
  },

  async getById(id: string) {
    const cacheKey = `team:${id}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: true,
        homeMatches: {
          include: {
            awayTeam: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: 5,
        },
        awayMatches: {
          include: {
            homeTeam: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    await cache.set(cacheKey, JSON.stringify(team), 300);

    return team;
  },

  async create(data: CreateTeamInput) {
    const team = await prisma.team.create({
      data,
      include: {
        players: true,
      },
    });

    // Invalidate cache
    await cache.delete('teams:all');

    return team;
  },

  async update(id: string, data: UpdateTeamInput) {
    const team = await prisma.team.update({
      where: { id },
      data,
      include: {
        players: true,
      },
    });

    // Invalidate cache
    await cache.delete('teams:all');
    await cache.delete(`team:${id}`);

    return team;
  },

  async delete(id: string) {
    await prisma.team.delete({
      where: { id },
    });

    // Invalidate cache
    await cache.delete('teams:all');
    await cache.delete(`team:${id}`);
  },
};
