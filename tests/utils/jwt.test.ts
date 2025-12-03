import { generateToken, verifyToken, TokenPayload } from '../../src/utils/jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utility', () => {
  const testPayload: TokenPayload = {
    userId: '123',
    email: 'test@example.com',
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = generateToken({ userId: '1', email: 'user1@test.com' });
      const token2 = generateToken({ userId: '2', email: 'user2@test.com' });
      
      expect(token1).not.toBe(token2);
    });

    it('should include payload data in token', () => {
      const token = generateToken(testPayload);
      const decoded = jwt.decode(token) as TokenPayload;
      
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow('Invalid or expired token');
    });

    it('should throw error for expired token', () => {
      // Create a token that expires immediately
      const expiredToken = jwt.sign(
        testPayload,
        process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production-not-secure',
        { expiresIn: '-1h' }
      );
      
      expect(() => {
        verifyToken(expiredToken);
      }).toThrow('Invalid or expired token');
    });

    it('should throw error for token with wrong secret', () => {
      const token = jwt.sign(testPayload, 'wrong-secret', { expiresIn: '1h' });
      
      expect(() => {
        verifyToken(token);
      }).toThrow('Invalid or expired token');
    });
  });
});

