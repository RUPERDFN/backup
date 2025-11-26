import { Router } from 'express';
import { authenticateToken } from '../auth';

const router = Router();

// Admin middleware (protect admin routes)
const isAdmin = (req: any, res: any, next: any) => {
  // In production, check if user has admin role
  const userEmail = req.user?.claims?.email;
  const adminEmails = ['admin@thecookflow.com', 'dev@thecookflow.com'];
  
  if (!adminEmails.includes(userEmail)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Business dashboard overview
router.get('/admin/dashboard', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const dashboard = {
      kpis: {
        ltv: {
          current: 8.45,
          target: 10.0,
          change: +12.3,
          trend: 'up'
        },
        churn: {
          day7: 15.2,
          day30: 35.8,
          day90: 58.1,
          monthly: 5.2
        },
        arpu: {
          current: 2.15,
          lastMonth: 1.98,
          change: +8.6,
          target: 2.50
        },
        conversionRates: {
          trialToPaid: 28.5,
          visitToTrial: 3.2,
          onboardingCompletion: 78.4,
          paywallConversion: 19.1
        }
      },
      
      revenue: {
        today: Math.random() * 150 + 80, // €80-230
        thisMonth: Math.random() * 3500 + 2500, // €2500-6000
        mrr: Math.random() * 2800 + 1800, // €1800-4600 MRR
        arr: Math.random() * 35000 + 22000, // €22k-57k ARR
        growth: {
          mom: Math.random() * 25 + 5, // 5-30% month over month
          yoy: Math.random() * 150 + 80 // 80-230% year over year
        }
      },
      
      users: {
        total: Math.floor(Math.random() * 5000 + 2000), // 2k-7k total
        activeThisMonth: Math.floor(Math.random() * 1500 + 800), // 800-2300 MAU
        newThisMonth: Math.floor(Math.random() * 400 + 200), // 200-600 new
        premiumUsers: Math.floor(Math.random() * 300 + 150), // 150-450 premium
        trialUsers: Math.floor(Math.random() * 100 + 50) // 50-150 in trial
      },
      
      content: {
        menusGenerated: Math.floor(Math.random() * 15000 + 8000), // 8k-23k total
        recipesViewed: Math.floor(Math.random() * 45000 + 25000), // 25k-70k
        shoppingListsCreated: Math.floor(Math.random() * 12000 + 6000), // 6k-18k
        sharedMenus: Math.floor(Math.random() * 800 + 400), // 400-1200
        avgMenusPerUser: Math.random() * 4 + 2 // 2-6 menus per user
      },
      
      ads: {
        impressions: Math.floor(Math.random() * 50000 + 25000), // 25k-75k
        clicks: Math.floor(Math.random() * 1500 + 750), // 750-2250
        revenue: Math.random() * 400 + 200, // €200-600
        rpm: Math.random() * 8 + 4, // €4-12 RPM
        fillRate: Math.random() * 15 + 80 // 80-95%
      }
    };
    
    res.json(dashboard);
    
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      error: 'Failed to load admin dashboard'
    });
  }
});

// User management
router.get('/admin/users', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const { page = 1, limit = 50, filter = 'all' } = req.query;
    
    // Mock user data
    const users = Array.from({ length: parseInt(limit) }, (_, i) => ({
      id: `user_${i + (page - 1) * limit}`,
      email: `user${i + (page - 1) * limit}@example.com`,
      name: `Usuario ${i + (page - 1) * limit}`,
      status: Math.random() > 0.8 ? 'premium' : Math.random() > 0.6 ? 'trial' : 'free',
      signupDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      menusGenerated: Math.floor(Math.random() * 20 + 1),
      revenue: Math.random() * 50 + 5,
      referrals: Math.floor(Math.random() * 5),
      country: ['ES', 'MX', 'AR', 'CO', 'CL'][Math.floor(Math.random() * 5)]
    }));
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 20,
        totalUsers: 1000,
        limit: parseInt(limit)
      },
      filters: {
        all: 1000,
        premium: 150,
        trial: 85,
        free: 765,
        churned: 45
      }
    });
    
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      error: 'Failed to load users'
    });
  }
});

// Revenue detailed breakdown
router.get('/admin/revenue', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const { period = '30d', country } = req.query;
    
    const revenueData = {
      summary: {
        totalRevenue: Math.random() * 8000 + 4000, // €4k-12k
        subscriptionRevenue: Math.random() * 6000 + 3000, // €3k-9k
        packRevenue: Math.random() * 1500 + 500, // €500-2k
        adRevenue: Math.random() * 800 + 200, // €200-1k
        refunds: Math.random() * 200 + 50 // €50-250
      },
      
      byCountry: [
        { country: 'ES', revenue: Math.random() * 3000 + 2000, users: 450, arpu: 6.2 },
        { country: 'MX', revenue: Math.random() * 1500 + 800, users: 280, arpu: 4.1 },
        { country: 'AR', revenue: Math.random() * 800 + 400, users: 150, arpu: 3.8 },
        { country: 'CO', revenue: Math.random() * 600 + 300, users: 120, arpu: 3.5 },
        { country: 'CL', revenue: Math.random() * 500 + 250, users: 90, arpu: 4.0 }
      ],
      
      subscriptions: {
        newSubscriptions: Math.floor(Math.random() * 80 + 40), // 40-120
        renewals: Math.floor(Math.random() * 200 + 100), // 100-300
        cancellations: Math.floor(Math.random() * 40 + 20), // 20-60
        upgrades: Math.floor(Math.random() * 15 + 5), // 5-20
        downgrades: Math.floor(Math.random() * 8 + 2) // 2-10
      },
      
      cohortLTV: [
        { cohort: '2024-12', ltv: 8.5, users: 120, maturity: '1 month' },
        { cohort: '2024-11', ltv: 12.2, users: 95, maturity: '2 months' },
        { cohort: '2024-10', ltv: 15.8, users: 85, maturity: '3 months' },
        { cohort: '2024-09', ltv: 18.4, users: 78, maturity: '4 months' }
      ],
      
      projections: {
        nextMonth: Math.random() * 10000 + 5000, // €5k-15k
        nextQuarter: Math.random() * 35000 + 18000, // €18k-53k
        confidence: Math.random() * 25 + 70 // 70-95%
      }
    };
    
    res.json(revenueData);
    
  } catch (error) {
    console.error('Admin revenue error:', error);
    res.status(500).json({
      error: 'Failed to load revenue data'
    });
  }
});

// Content moderation
router.get('/admin/moderation', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const moderation = {
      queue: [
        {
          id: 'mod_001',
          type: 'shared_menu',
          content: 'Menú vegano semanal',
          user: 'user_123',
          reportReason: 'inappropriate_content',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mod_002',
          type: 'user_review',
          content: 'Excelente app, muy recomendable...',
          user: 'user_456',
          reportReason: 'spam',
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ],
      
      stats: {
        pendingReviews: 12,
        approvedToday: 28,
        rejectedToday: 4,
        averageReviewTime: 25, // minutes
        falsePositiveRate: 2.1 // %
      },
      
      autoModeration: {
        enabled: true,
        rulesActive: 15,
        autoApproved: 89, // % automatically approved
        flaggedForReview: 11, // % flagged for manual review
        confidence: 94.2 // % confidence in auto decisions
      }
    };
    
    res.json(moderation);
    
  } catch (error) {
    console.error('Admin moderation error:', error);
    res.status(500).json({
      error: 'Failed to load moderation data'
    });
  }
});

// System health for admin
router.get('/admin/system', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const systemHealth = {
      services: {
        database: { status: 'healthy', responseTime: 15, uptime: 99.9 },
        openai: { status: 'healthy', responseTime: 2800, uptime: 98.5 },
        perplexity: { status: 'healthy', responseTime: 1950, uptime: 97.2 },
        googleCloud: { status: 'healthy', responseTime: 450, uptime: 99.7 },
        playBilling: { status: 'healthy', responseTime: 1200, uptime: 99.1 }
      },
      
      performance: {
        avgResponseTime: 280, // ms
        errorRate: 0.8, // %
        throughput: 45, // requests/minute
        p95ResponseTime: 1200, // ms
        memoryUsage: 65 // %
      },
      
      errors: {
        last24h: 23,
        critical: 1,
        warnings: 8,
        resolved: 19,
        topErrors: [
          { error: 'OpenAI timeout', count: 8, lastSeen: '2h ago' },
          { error: 'Database connection pool', count: 5, lastSeen: '4h ago' },
          { error: 'Invalid menu format', count: 4, lastSeen: '1h ago' }
        ]
      },
      
      infrastructure: {
        deploymentStatus: 'stable',
        lastDeploy: '2025-01-09T07:32:00Z',
        environment: 'production',
        version: '1.0.0',
        buildNumber: 'build-456',
        rollbackAvailable: true
      }
    };
    
    res.json(systemHealth);
    
  } catch (error) {
    console.error('Admin system error:', error);
    res.status(500).json({
      error: 'Failed to load system health'
    });
  }
});

export default router;