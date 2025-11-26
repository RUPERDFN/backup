import express from 'express';
import { performDetailedHealthCheck } from '../healthCheck';
import { logger } from '../logger';

const router = express.Router();

// Simple health check
router.get('/health', (req, res) => {
  const healthData = { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
  
  logger.debug('Simple health check requested');
  res.json(healthData);
});

// Detailed health check with database and external APIs
router.get('/health/detailed', async (req, res) => {
  const startTime = Date.now();
  
  logger.info('Detailed health check requested');
  
  try {
    const healthReport = await performDetailedHealthCheck();
    const totalTime = Date.now() - startTime;
    
    // Determinar código de estado HTTP basado en el estado
    const statusCode = healthReport.status === 'healthy' ? 200 : 
                      healthReport.status === 'unhealthy' ? 503 : 500;
    
    logger.info(
      { 
        statusCode, 
        status: healthReport.status, 
        totalTime,
        requestIp: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 100)
      }, 
      'Detailed health check completed'
    );
    
    res.status(statusCode).json({
      ...healthReport,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    });
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logger.error(
      { 
        error: errorMessage, 
        totalTime,
        requestIp: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 100)
      }, 
      'Detailed health check failed with exception'
    );
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      totalResponseTime: totalTime,
      error: errorMessage,
      uptime: process.uptime()
    });
  }
});

// Simple health endpoint for load balancers (keep existing)
router.get('/health/simple', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe
router.get('/health/ready', async (req, res) => {
  try {
    // Check critical dependencies
    const checks = {
      database: true, // Would check actual DB connection
      env: process.env.NODE_ENV !== undefined,
      secrets: process.env.OPENAI_API_KEY !== undefined,
      diskSpace: true // Would check actual disk space
    };
    
    const allReady = Object.values(checks).every(check => check === true);
    
    if (allReady) {
      res.json({
        status: 'READY',
        checks,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'NOT_READY',
        checks,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness probe
router.get('/health/live', (req, res) => {
  res.json({
    status: 'ALIVE',
    pid: process.pid,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;