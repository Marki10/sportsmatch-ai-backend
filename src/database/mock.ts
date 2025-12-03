// Simple UUID generator using crypto (Node.js built-in)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older Node versions
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mock database types matching Prisma schema
interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MockTeam {
  id: string;
  name: string;
  country: string;
  foundedYear: number;
  stadium: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MockPlayer {
  id: string;
  name: string;
  position: string;
  age: number;
  goals: number;
  assists: number;
  matchesPlayed: number;
  rating: number | null;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MockMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  prediction: any | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
class MockDatabase {
  private users: Map<string, MockUser> = new Map();
  private teams: Map<string, MockTeam> = new Map();
  private players: Map<string, MockPlayer> = new Map();
  private matches: Map<string, MockMatch> = new Map();

  // Initialize with some sample data
  initialize() {
    // Create sample teams
    const team1Id = generateUUID();
    const team2Id = generateUUID();

    this.teams.set(team1Id, {
      id: team1Id,
      name: 'Manchester United',
      country: 'England',
      foundedYear: 1878,
      stadium: 'Old Trafford',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.teams.set(team2Id, {
      id: team2Id,
      name: 'Liverpool FC',
      country: 'England',
      foundedYear: 1892,
      stadium: 'Anfield',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create sample players
    const player1Id = generateUUID();
    const player2Id = generateUUID();

    this.players.set(player1Id, {
      id: player1Id,
      name: 'John Doe',
      position: 'Forward',
      age: 25,
      goals: 15,
      assists: 8,
      matchesPlayed: 30,
      rating: 8.5,
      teamId: team1Id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.players.set(player2Id, {
      id: player2Id,
      name: 'Jane Smith',
      position: 'Midfielder',
      age: 23,
      goals: 5,
      assists: 12,
      matchesPlayed: 28,
      rating: 7.8,
      teamId: team2Id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create sample match
    const matchId = generateUUID();
    this.matches.set(matchId, {
      id: matchId,
      homeTeamId: team1Id,
      awayTeamId: team2Id,
      date: new Date('2024-12-31T20:00:00Z'),
      status: 'scheduled',
      homeScore: null,
      awayScore: null,
      prediction: {
        homeWinProbability: 0.45,
        awayWinProbability: 0.35,
        drawProbability: 0.20,
        predictedScore: { home: 2, away: 1 },
        confidence: 0.75,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Mock database initialized with sample data');
  }

  // User operations
  user = {
    findUnique: async (args: { where: { id?: string; email?: string } }) => {
      let user: MockUser | undefined;
      if (args.where.id) {
        user = this.users.get(args.where.id);
      } else if (args.where.email) {
        user = Array.from(this.users.values()).find((u) => u.email === args.where.email);
      }
      return user || null;
    },

    findMany: async () => {
      return Array.from(this.users.values());
    },

    create: async (args: { data: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>; select?: any }) => {
      const id = generateUUID();
      const now = new Date();
      const user: MockUser = {
        id,
        ...args.data,
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(id, user);

      if (args.select) {
        const selected: any = {};
        Object.keys(args.select).forEach((key) => {
          if (args.select[key] && user.hasOwnProperty(key)) {
            selected[key] = (user as any)[key];
          }
        });
        return selected;
      }
      return user;
    },

    update: async (args: {
      where: { id: string };
      data: Partial<Omit<MockUser, 'id' | 'createdAt'>>;
      select?: any;
    }) => {
      const user = this.users.get(args.where.id);
      if (!user) throw new Error('User not found');

      const updated: MockUser = {
        ...user,
        ...args.data,
        updatedAt: new Date(),
      };
      this.users.set(args.where.id, updated);

      if (args.select) {
        const selected: any = {};
        Object.keys(args.select).forEach((key) => {
          if (args.select[key] && updated.hasOwnProperty(key)) {
            selected[key] = (updated as any)[key];
          }
        });
        return selected;
      }
      return updated;
    },

    delete: async (args: { where: { id: string } }) => {
      this.users.delete(args.where.id);
    },

    deleteMany: async (args: { where?: any }) => {
      if (args.where?.email) {
        const users = Array.from(this.users.values());
        const toDelete = users.filter((u) => {
          if (args.where.email?.in) {
            return args.where.email.in.includes(u.email);
          }
          return u.email === args.where.email;
        });
        toDelete.forEach((u) => this.users.delete(u.id));
        return { count: toDelete.length };
      }
      const count = this.users.size;
      this.users.clear();
      return { count };
    },

    upsert: async (args: {
      where: { email: string };
      update: Partial<MockUser>;
      create: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>;
    }) => {
      const existing = Array.from(this.users.values()).find((u) => u.email === args.where.email);
      if (existing) {
        const updated = { ...existing, ...args.update, updatedAt: new Date() };
        this.users.set(existing.id, updated);
        return updated;
      } else {
        return await this.user.create({ data: args.create });
      }
    },
  };

  // Team operations
  team = {
    findUnique: async (args: {
      where: { id: string };
      include?: any;
      select?: any;
    }) => {
      const team = this.teams.get(args.where.id);
      if (!team) return null;

      if (args.include || args.select) {
        const result: any = { ...team };

        if (args.include?.players) {
          result.players = Array.from(this.players.values()).filter((p) => p.teamId === team.id);
        }

        if (args.include?.homeMatches) {
          const homeMatches = Array.from(this.matches.values())
            .filter((m) => m.homeTeamId === team.id)
            .slice(0, args.include.homeMatches?.take || 10)
            .map((m) => ({
              ...m,
              awayTeam: this.teams.get(m.awayTeamId),
            }));
          result.homeMatches = homeMatches;
        }

        if (args.include?.awayMatches) {
          const awayMatches = Array.from(this.matches.values())
            .filter((m) => m.awayTeamId === team.id)
            .slice(0, args.include.awayMatches?.take || 10)
            .map((m) => ({
              ...m,
              homeTeam: this.teams.get(m.homeTeamId),
            }));
          result.awayMatches = awayMatches;
        }

        return result;
      }

      return team;
    },

    findMany: async (args?: { include?: any; orderBy?: any }) => {
      let teams = Array.from(this.teams.values());

      if (args?.orderBy) {
        const [key, direction] = Object.entries(args.orderBy)[0];
        teams.sort((a, b) => {
          const aVal = (a as any)[key];
          const bVal = (b as any)[key];
          if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      if (args?.include?.players) {
        teams = teams.map((team) => ({
          ...team,
          players: Array.from(this.players.values())
            .filter((p) => p.teamId === team.id)
            .map((p) => ({ id: p.id, name: p.name, position: p.position })),
        }));
      }

      return teams;
    },

    create: async (args: {
      data: Omit<MockTeam, 'id' | 'createdAt' | 'updatedAt'>;
      include?: any;
    }) => {
      const id = generateUUID();
      const now = new Date();
      const team: MockTeam = {
        id,
        ...args.data,
        createdAt: now,
        updatedAt: now,
      };
      this.teams.set(id, team);

      if (args.include?.players) {
        return {
          ...team,
          players: [],
        };
      }

      return team;
    },

    update: async (args: {
      where: { id: string };
      data: Partial<Omit<MockTeam, 'id' | 'createdAt'>>;
      include?: any;
    }) => {
      const team = this.teams.get(args.where.id);
      if (!team) throw new Error('Team not found');

      const updated: MockTeam = {
        ...team,
        ...args.data,
        updatedAt: new Date(),
      };
      this.teams.set(args.where.id, updated);

      if (args.include?.players) {
        return {
          ...updated,
          players: Array.from(this.players.values()).filter((p) => p.teamId === updated.id),
        };
      }

      return updated;
    },

    delete: async (args: { where: { id: string } }) => {
      // Delete related players
      Array.from(this.players.values())
        .filter((p) => p.teamId === args.where.id)
        .forEach((p) => this.players.delete(p.id));

      // Delete related matches
      Array.from(this.matches.values())
        .filter((m) => m.homeTeamId === args.where.id || m.awayTeamId === args.where.id)
        .forEach((m) => this.matches.delete(m.id));

      this.teams.delete(args.where.id);
    },
  };

  // Player operations
  player = {
    findUnique: async (args: {
      where: { id: string };
      include?: any;
    }) => {
      const player = this.players.get(args.where.id);
      if (!player) return null;

      if (args.include?.team) {
        return {
          ...player,
          team: this.teams.get(player.teamId),
        };
      }

      return player;
    },

    findMany: async (args?: {
      where?: { teamId?: string };
      include?: any;
      orderBy?: any;
    }) => {
      let players = Array.from(this.players.values());

      if (args?.where?.teamId) {
        players = players.filter((p) => p.teamId === args.where!.teamId);
      }

      if (args?.orderBy) {
        const [key, direction] = Object.entries(args.orderBy)[0];
        players.sort((a, b) => {
          const aVal = (a as any)[key] ?? 0;
          const bVal = (b as any)[key] ?? 0;
          if (direction === 'desc') {
            return bVal > aVal ? 1 : -1;
          } else {
            return aVal > bVal ? 1 : -1;
          }
        });
      }

      if (args?.include?.team) {
        players = players.map((player) => ({
          ...player,
          team: this.teams.get(player.teamId),
        }));
      }

      return players;
    },

    create: async (args: {
      data: Omit<MockPlayer, 'id' | 'createdAt' | 'updatedAt'>;
      include?: any;
    }) => {
      const id = generateUUID();
      const now = new Date();
      const player: MockPlayer = {
        id,
        ...args.data,
        goals: args.data.goals ?? 0,
        assists: args.data.assists ?? 0,
        matchesPlayed: args.data.matchesPlayed ?? 0,
        rating: args.data.rating ?? null,
        createdAt: now,
        updatedAt: now,
      };
      this.players.set(id, player);

      if (args.include?.team) {
        return {
          ...player,
          team: this.teams.get(player.teamId),
        };
      }

      return player;
    },

    update: async (args: {
      where: { id: string };
      data: Partial<Omit<MockPlayer, 'id' | 'createdAt'>>;
      include?: any;
    }) => {
      const player = this.players.get(args.where.id);
      if (!player) throw new Error('Player not found');

      const updated: MockPlayer = {
        ...player,
        ...args.data,
        updatedAt: new Date(),
      };
      this.players.set(args.where.id, updated);

      if (args.include?.team) {
        return {
          ...updated,
          team: this.teams.get(updated.teamId),
        };
      }

      return updated;
    },

    delete: async (args: { where: { id: string } }) => {
      this.players.delete(args.where.id);
    },
  };

  // Match operations
  match = {
    findUnique: async (args: {
      where: { id: string };
      include?: any;
      select?: any;
    }) => {
      const match = this.matches.get(args.where.id);
      if (!match) return null;

      if (args.include) {
        const result: any = { ...match };

        if (args.include.homeTeam) {
          result.homeTeam = this.teams.get(match.homeTeamId);
        }

        if (args.include.awayTeam) {
          result.awayTeam = this.teams.get(match.awayTeamId);
        }

        return result;
      }

      if (args.select) {
        const selected: any = {};
        Object.keys(args.select).forEach((key) => {
          if (args.select[key] && match.hasOwnProperty(key)) {
            selected[key] = (match as any)[key];
          }
        });
        return selected;
      }

      return match;
    },

    findMany: async (args?: {
      where?: { status?: string };
      include?: any;
      orderBy?: any;
    }) => {
      let matches = Array.from(this.matches.values());

      if (args?.where?.status) {
        matches = matches.filter((m) => m.status === args.where!.status);
      }

      if (args?.orderBy) {
        const [key, direction] = Object.entries(args.orderBy)[0];
        matches.sort((a, b) => {
          const aVal = (a as any)[key];
          const bVal = (b as any)[key];
          if (direction === 'desc') {
            return bVal > aVal ? 1 : -1;
          } else {
            return aVal > bVal ? 1 : -1;
          }
        });
      }

      if (args?.include) {
        matches = matches.map((match) => {
          const result: any = { ...match };

          if (args.include?.homeTeam) {
            result.homeTeam = args.include.homeTeam.select
              ? Object.fromEntries(
                  Object.keys(args.include.homeTeam.select)
                    .filter((k) => args.include.homeTeam.select[k])
                    .map((k) => [k, (this.teams.get(match.homeTeamId) as any)?.[k]])
                )
              : this.teams.get(match.homeTeamId);
          }

          if (args.include?.awayTeam) {
            result.awayTeam = args.include.awayTeam.select
              ? Object.fromEntries(
                  Object.keys(args.include.awayTeam.select)
                    .filter((k) => args.include.awayTeam.select[k])
                    .map((k) => [k, (this.teams.get(match.awayTeamId) as any)?.[k]])
                )
              : this.teams.get(match.awayTeamId);
          }

          return result;
        });
      }

      return matches;
    },

    create: async (args: {
      data: Omit<MockMatch, 'id' | 'createdAt' | 'updatedAt'>;
      include?: any;
    }) => {
      const id = generateUUID();
      const now = new Date();
      const match: MockMatch = {
        id,
        ...args.data,
        status: args.data.status || 'scheduled',
        createdAt: now,
        updatedAt: now,
      };
      this.matches.set(id, match);

      if (args.include) {
        const result: any = { ...match };
        if (args.include.homeTeam) {
          result.homeTeam = this.teams.get(match.homeTeamId);
        }
        if (args.include.awayTeam) {
          result.awayTeam = this.teams.get(match.awayTeamId);
        }
        return result;
      }

      return match;
    },

    update: async (args: {
      where: { id: string };
      data: Partial<Omit<MockMatch, 'id' | 'createdAt'>>;
      include?: any;
      select?: any;
    }) => {
      const match = this.matches.get(args.where.id);
      if (!match) throw new Error('Match not found');

      const updated: MockMatch = {
        ...match,
        ...args.data,
        updatedAt: new Date(),
      };
      this.matches.set(args.where.id, updated);

      if (args.include) {
        const result: any = { ...updated };
        if (args.include.homeTeam) {
          result.homeTeam = this.teams.get(updated.homeTeamId);
        }
        if (args.include.awayTeam) {
          result.awayTeam = this.teams.get(updated.awayTeamId);
        }
        return result;
      }

      return updated;
    },

    delete: async (args: { where: { id: string } }) => {
      this.matches.delete(args.where.id);
    },
  };

  // Prisma-like disconnect (no-op for mock)
  async $disconnect() {
    // Nothing to disconnect
  }
}

export const mockDb = new MockDatabase();

// Export a Prisma-like interface
export const mockPrisma = {
  user: mockDb.user,
  team: mockDb.team,
  player: mockDb.player,
  match: mockDb.match,
  $disconnect: () => mockDb.$disconnect(),
};
