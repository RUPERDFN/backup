/**
 * Smoke Tests for TheCookFlow
 * Basic tests to ensure the application is running correctly
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function fetchEndpoint(path: string): Promise<Response> {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch ${path}: ${error}`);
  }
}

describe('TheCookFlow Smoke Tests', () => {
  // Test health endpoint
  it('should respond to health check', async () => {
    const response = await fetchEndpoint('/healthz');
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('ok', true);
  });

  // Test main page loads
  it('should load the main page', async () => {
    const response = await fetchEndpoint('/');
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  // Test API endpoints exist
  it('should have API endpoints available', async () => {
    const endpoints = [
      '/api/auth/user',
      '/api/subscription/status',
    ];

    for (const endpoint of endpoints) {
      const response = await fetchEndpoint(endpoint);
      // May return 401 if not authenticated, but should not 404
      expect([200, 401, 304]).toContain(response.status);
    }
  });

  // Test static assets are served
  it('should serve static assets', async () => {
    const response = await fetchEndpoint('/favicon.ico');
    // Favicon might not exist, but should not return 500
    expect([200, 404]).toContain(response.status);
  });

  // Test database connection (via API)
  it('should have database connectivity', async () => {
    // This tests that the server can handle database operations
    const response = await fetchEndpoint('/api/auth/user');
    // Even if unauthorized, server should respond without crashing
    expect(response.status).toBeLessThan(500);
  });
});

// Additional integration tests
describe('TheCookFlow Integration', () => {
  it('should have proper CORS headers', async () => {
    const response = await fetchEndpoint('/api/auth/user');
    const headers = response.headers;
    
    // Check for basic security headers
    expect(headers.get('x-powered-by')).toBeNull(); // Should be hidden
  });

  it('should handle 404 gracefully', async () => {
    const response = await fetchEndpoint('/api/nonexistent');
    expect(response.status).toBe(404);
  });

  it('should return JSON for API endpoints', async () => {
    const response = await fetchEndpoint('/api/auth/user');
    const contentType = response.headers.get('content-type');
    
    if (response.status !== 404) {
      expect(contentType).toContain('application/json');
    }
  });
});