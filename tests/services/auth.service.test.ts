import { authService } from '../../src/services/auth.service';
import { AppError } from '../../src/middleware/error-handler';
import prisma from '../../src/database';
import { hashPassword } from '../../src/utils/bcrypt';

describe('Auth Service', () => {
  const testEmail = 'testservice@example.com';
  const testPassword = 'testPassword123';

  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testEmail, 'newuser@test.com'],
        },
      },
    });
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testEmail, 'newuser@test.com'],
        },
      },
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await authService.register({
        email: 'newuser@test.com',
        password: testPassword,
        name: 'Test User',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('newuser@test.com');
      expect(result.user.name).toBe('Test User');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should register user without name', async () => {
      const result = await authService.register({
        email: 'newuser@test.com',
        password: testPassword,
      });

      expect(result.user.email).toBe('newuser@test.com');
      expect(result.user.name).toBeNull(); // name should be null, not undefined
    });

    it('should hash password before storing', async () => {
      const result = await authService.register({
        email: 'newuser@test.com',
        password: testPassword,
      });

      // Verify user was created
      const user = await prisma.user.findUnique({
        where: { email: 'newuser@test.com' },
      });

      expect(user).toBeDefined();
      expect(user?.password).not.toBe(testPassword);
      expect(user?.password.length).toBeGreaterThan(50); // bcrypt hash is long
    });

    it('should throw error if user already exists', async () => {
      // Create user first
      await authService.register({
        email: testEmail,
        password: testPassword,
      });

      // Try to register again
      await expect(
        authService.register({
          email: testEmail,
          password: testPassword,
        })
      ).rejects.toThrow(AppError);

      await expect(
        authService.register({
          email: testEmail,
          password: testPassword,
        })
      ).rejects.toThrow('User with this email already exists');
    });

    it('should generate JWT token on registration', async () => {
      const result = await authService.register({
        email: 'newuser@test.com',
        password: testPassword,
      });

      expect(result.token).toBeDefined();
      expect(result.token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await prisma.user.create({
        data: {
          email: testEmail,
          password: await hashPassword(testPassword),
        },
      });
    });

    it('should login successfully with valid credentials', async () => {
      const result = await authService.login({
        email: testEmail,
        password: testPassword,
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(testEmail);
      expect(result.token).toBeDefined();
    });

    it('should return user without password', async () => {
      const result = await authService.login({
        email: testEmail,
        password: testPassword,
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: testPassword,
        })
      ).rejects.toThrow(AppError);

      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: testPassword,
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for wrong password', async () => {
      await expect(
        authService.login({
          email: testEmail,
          password: 'wrongPassword',
        })
      ).rejects.toThrow(AppError);

      await expect(
        authService.login({
          email: testEmail,
          password: 'wrongPassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should generate JWT token on login', async () => {
      const result = await authService.login({
        email: testEmail,
        password: testPassword,
      });

      expect(result.token).toBeDefined();
      expect(result.token.split('.')).toHaveLength(3);
    });
  });
});

