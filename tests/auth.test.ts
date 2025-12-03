import request from 'supertest';
import app from '../src/app';
import prisma from '../src/database';
import { hashPassword } from '../src/utils/bcrypt';

describe('Authentication Routes', () => {
  let testUser: { email: string; password: string };

  beforeAll(async () => {
    // Setup test user
    testUser = {
      email: 'test@example.com',
      password: 'testpass123',
    };
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, 'newuser@example.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('newuser@example.com');
    });

    it('should fail with duplicate email', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: testUser.email,
          password: await hashPassword(testUser.password),
        },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email,
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Ensure test user exists
      await prisma.user.upsert({
        where: { email: testUser.email },
        update: {},
        create: {
          email: testUser.email,
          password: await hashPassword(testUser.password),
        },
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
