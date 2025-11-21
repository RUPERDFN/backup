import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performDetailedHealthCheck } from '../server/healthCheck';

// Mock dependencies
vi.mock('../server/db', () => ({
  db: {
    execute: vi.fn()
  }
}));

vi.mock('../server/env', () => ({
  checkAIKeys: vi.fn(() => ({ openai: true, perplexity: true }))
}));

// Mock fetch global
global.fetch = vi.fn();

describe('Health Check System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return healthy status when all services are up', async () => {
    // Mock successful database query
    const { db } = await import('../server/db');
    vi.mocked(db.execute).mockResolvedValue([{ health_check: 1 }]);

    // Mock successful API responses
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('', { status: 200 })) // OpenAI
      .mockResolvedValueOnce(new Response('', { status: 200 })); // Perplexity

    const result = await performDetailedHealthCheck();

    expect(result.status).toBe('healthy');
    expect(result.components.database.status).toBe('up');
    expect(result.components.apis.openai.status).toBe('up');
    expect(result.components.apis.perplexity.status).toBe('up');
    expect(result.totalResponseTime).toBeGreaterThan(0);
  });

  it('should return unhealthy status when database is down', async () => {
    // Mock database failure
    const { db } = await import('../server/db');
    vi.mocked(db.execute).mockRejectedValue(new Error('Connection refused'));

    // Mock successful API responses
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('', { status: 200 }))
      .mockResolvedValueOnce(new Response('', { status: 200 }));

    const result = await performDetailedHealthCheck();

    expect(result.status).toBe('unhealthy');
    expect(result.components.database.status).toBe('down');
    expect(result.components.database.error).toBe('Connection refused');
  });

  it('should return unhealthy status when APIs are down', async () => {
    // Mock successful database
    const { db } = await import('../server/db');
    vi.mocked(db.execute).mockResolvedValue([{ health_check: 1 }]);

    // Mock API failures
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('Timeout')) // OpenAI
      .mockResolvedValueOnce(new Response('', { status: 500 })); // Perplexity

    const result = await performDetailedHealthCheck();

    expect(result.status).toBe('unhealthy');
    expect(result.components.apis.openai.status).toBe('down');
    expect(result.components.apis.perplexity.status).toBe('down');
  });

  it('should cache API results for 60 seconds', async () => {
    // Mock successful database
    const { db } = await import('../server/db');
    vi.mocked(db.execute).mockResolvedValue([{ health_check: 1 }]);

    // Mock API responses
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('', { status: 200 }))
      .mockResolvedValueOnce(new Response('', { status: 200 }));

    // First call
    const result1 = await performDetailedHealthCheck();
    expect(result1.components.apis.cached).toBe(false);

    // Second call immediately (should use cache)
    const result2 = await performDetailedHealthCheck();
    expect(result2.components.apis.cached).toBe(true);

    // Verify fetch was only called twice (not four times)
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should handle timeout errors properly', async () => {
    // Mock successful database
    const { db } = await import('../server/db');
    vi.mocked(db.execute).mockResolvedValue([{ health_check: 1 }]);

    // Mock timeout errors
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('The operation was aborted'))
      .mockRejectedValueOnce(new Error('Timeout'));

    const result = await performDetailedHealthCheck();

    expect(result.status).toBe('unhealthy');
    expect(result.components.apis.openai.error).toContain('aborted');
    expect(result.components.apis.perplexity.error).toBe('Timeout');
  });

  it('should measure response times accurately', async () => {
    // Mock successful database with delay
    const { db } = await import('../server/db');
    vi.mocked(db.execute).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve([{ health_check: 1 }]), 50))
    );

    // Mock API responses with delays
    vi.mocked(fetch)
      .mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(new Response('', { status: 200 })), 100))
      );

    const result = await performDetailedHealthCheck();

    expect(result.components.database.responseTime).toBeGreaterThanOrEqual(40);
    expect(result.components.apis.openai.responseTime).toBeGreaterThanOrEqual(90);
    expect(result.totalResponseTime).toBeGreaterThan(0);
  });
});