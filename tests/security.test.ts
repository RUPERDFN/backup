import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { globalErrorHandler, notFoundHandler, generateNonce } from '../server/middleware/security';

// Mock Express objects
const mockRequest = (overrides = {}) => ({
  url: '/test',
  method: 'GET',
  ip: '127.0.0.1',
  get: vi.fn(),
  path: '/test',
  ...overrides
}) as Partial<Request> as Request;

const mockResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    locals: {}
  };
  return res as Partial<Response> as Response;
};

const mockNext = vi.fn() as NextFunction;

describe('Security Middleware Tests', () => {
  vi.beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('globalErrorHandler', () => {
    it('should handle generic errors with 500 status', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Test error');

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
          message: 'Test error',
          statusCode: 500,
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle ValidationError with 400 status', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Validation failed');
      error.name = 'ValidationError';

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
          message: 'Validation Error',
          statusCode: 400
        })
      );
    });

    it('should handle UnauthorizedError with 401 status', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Unauthorized access');
      error.name = 'UnauthorizedError';

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
          message: 'Unauthorized',
          statusCode: 401
        })
      );
    });

    it('should handle CastError with 400 status', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Invalid ID');
      error.name = 'CastError';

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
          message: 'Invalid ID format',
          statusCode: 400
        })
      );
    });

    it('should handle duplicate entry error with 409 status', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Duplicate entry') as any;
      error.code = 11000;

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
          message: 'Duplicate entry',
          statusCode: 409
        })
      );
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      globalErrorHandler(error, req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: 'Error stack trace',
          details: error
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      globalErrorHandler(error, req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          stack: expect.anything()
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should log error details', () => {
      const req = mockRequest({ 
        url: '/api/test',
        method: 'POST',
        ip: '192.168.1.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0')
      });
      const res = mockResponse();
      const error = new Error('Test error');

      globalErrorHandler(error, req, res, mockNext);

      expect(console.error).toHaveBeenCalledWith(
        'Global Error:',
        expect.objectContaining({
          message: 'Test error',
          url: '/api/test',
          method: 'POST',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 for non-existent routes', () => {
      const req = mockRequest({ path: '/non-existent', method: 'GET' });
      const res = mockResponse();

      notFoundHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: 'Route not found',
        statusCode: 404,
        path: '/non-existent',
        method: 'GET',
        timestamp: expect.any(String)
      });
    });
  });

  describe('generateNonce', () => {
    it('should generate a valid base64 nonce', () => {
      const nonce = generateNonce();
      
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
      
      // Test that it's valid base64
      expect(() => Buffer.from(nonce, 'base64')).not.toThrow();
    });

    it('should generate different nonces on each call', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      
      expect(nonce1).not.toBe(nonce2);
    });

    it('should generate nonces of consistent length', () => {
      const nonces = Array.from({ length: 10 }, () => generateNonce());
      const lengths = nonces.map(n => n.length);
      
      expect(new Set(lengths).size).toBe(1); // All lengths should be the same
    });
  });

  describe('Error Response Format', () => {
    it('should always return consistent error response structure', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Test error');

      globalErrorHandler(error, req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Boolean),
          message: expect.any(String),
          statusCode: expect.any(Number),
          timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        })
      );
    });

    it('should handle errors with custom statusCode property', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Custom error') as any;
      error.statusCode = 418; // I'm a teapot

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(418);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 418
        })
      );
    });

    it('should handle errors with status property', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Custom error') as any;
      error.status = 422;

      globalErrorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 422
        })
      );
    });
  });
});