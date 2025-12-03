import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError } from '../../src/middleware/error-handler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('AppError', () => {
    it('should create AppError with default status code', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });

    it('should create AppError with custom status code', () => {
      const error = new AppError('Not found', 404);
      
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError with correct status code', () => {
      const error = new AppError('Custom error', 400);
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Custom error',
      });
    });

    it('should handle generic Error with 500 status code', () => {
      const error = new Error('Generic error');
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Generic error',
      });
    });

    it('should use default message for error without message', () => {
      const error = new Error();
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error',
      });
    });

    it('should log error in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not log error in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error');
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});

