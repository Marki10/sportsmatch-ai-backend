import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../src/middleware/auth';
import { generateToken } from '../../src/utils/jwt';
import { AuthRequest } from '../../src/types';

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      headers: {},
    };
    
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next() with valid token', () => {
      const token = generateToken({ userId: '123', email: 'test@example.com' });
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      authenticate(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.userId).toBe('123');
      expect(mockRequest.user?.email).toBe('test@example.com');
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should return 401 if no authorization header', () => {
      mockRequest.headers = {};

      authenticate(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'No token provided',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header does not start with Bearer', () => {
      mockRequest.headers = {
        authorization: 'Invalid token',
      };

      authenticate(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'No token provided',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid.token.here',
      };

      authenticate(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer header', () => {
      const token = generateToken({ userId: '456', email: 'user@test.com' });
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      authenticate(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user?.userId).toBe('456');
      expect(mockRequest.user?.email).toBe('user@test.com');
    });
  });
});

