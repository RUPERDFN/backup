import { Router } from 'express';
import { authenticateToken } from '../auth';

const router = Router();

// Track events (GA4 + server-side)
router.post('/analytics/track', async (req, res) => {
  try {
    const { event, parameters, userId, sessionId } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: 'Event name is required' });
    }
    
    // Server-side event tracking
    const eventData = {
      eventName: event,
      userId: userId || 'anonymous',
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      parameters: parameters || {},
      source: 'server',
      userAgent: req.get('user-agent'),
      ip: req.ip,
      referrer: req.get('referer')
    };
    
    // Simulate sending to GA4 via Measurement Protocol
    // In production: await sendToGA4(eventData);
    
    // Log key events for internal analytics
    const keyEvents = [
      'onboarding_completed',
      'plan_generated', 
      'share_click',
      'add_to_list',
      'paywall_view',
      'trial_start',
      'sub_start',
      'sub_cancel',
      'ad_impression_native',
      'ad_impression_banner',
      'ad_impression_interstitial',
      'ad_impression_rewarded'
    ];
    
    if (keyEvents.includes(event)) {
      console.log(`📊 Key Event: ${event}`, eventData);
    }
    
    res.json({
      success: true,
      eventId: `evt_${Date.now()}`,
      tracked: true,
      timestamp: eventData.timestamp
    });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      error: 'Failed to track event'
    });
  }
});

// Get funnel data
router.get('/analytics/funnel', authenticateToken, async (req: any, res) => {
  try {
    const { timeframe = '30d', segment } = req.query;
    
    // Mock funnel data
    const funnelData = {
      timeframe,
      segment: segment || 'all_users',
      steps: [
        {
          step: 'landing_visit',
          name: 'Visita Landing',
          users: 10000,
          conversionRate: 100,
          dropOff: 0
        },
        {
          step: 'onboarding_start',
          name: 'Inicia Onboarding',
          users: 3500,
          conversionRate: 35,
          dropOff: 6500
        },
        {
          step: 'onboarding_completed',
          name: 'Completa Onboarding',
          users: 2800,
          conversionRate: 28,
          dropOff: 700
        },
        {
          step: 'plan_generated',
          name: 'Genera Primer Menú',
          users: 2520,
          conversionRate: 25.2,
          dropOff: 280
        },
        {
          step: 'paywall_view',
          name: 'Ve Paywall',
          users: 1512,
          conversionRate: 15.1,
          dropOff: 1008
        },
        {
          step: 'trial_start',
          name: 'Inicia Trial',
          users: 302,
          conversionRate: 3.02,
          dropOff: 1210
        },
        {
          step: 'sub_start',
          name: 'Se Suscribe',
          users: 91,
          conversionRate: 0.91,
          dropOff: 211
        }
      ],
      insights: [
        {
          type: 'opportunity',
          message: 'El mayor dropoff está entre onboarding start y completed (20%)',
          action: 'Simplificar proceso de onboarding'
        },
        {
          type: 'success',
          message: 'Alta conversión de trial a suscripción (30.1%)',
          action: 'Mantener estrategia de trial'
        }
      ],
      totalConversionRate: 0.91,
      benchmarks: {
        industry: 0.75,
        competitor: 0.65,
        ourGoal: 1.2
      }
    };
    
    res.json(funnelData);
    
  } catch (error) {
    console.error('Funnel analytics error:', error);
    res.status(500).json({
      error: 'Failed to get funnel data'
    });
  }
});

// Get cohort analysis
router.get('/analytics/cohorts', authenticateToken, async (req: any, res) => {
  try {
    const { metric = 'retention', period = 'weekly' } = req.query;
    
    // Mock cohort data
    const cohorts = [];
    const weeks = 12;
    
    for (let week = 0; week < weeks; week++) {
      const cohortDate = new Date(Date.now() - week * 7 * 24 * 60 * 60 * 1000);
      const cohortSize = Math.floor(Math.random() * 200 + 100); // 100-300 users
      
      const retentionData = [];
      for (let day = 0; day < 30; day++) {
        const retention = Math.max(0, 100 * Math.exp(-day * 0.08) + Math.random() * 10 - 5);
        retentionData.push(Math.round(retention * 100) / 100);
      }
      
      cohorts.push({
        cohortDate: cohortDate.toISOString().split('T')[0],
        cohortSize,
        retention: retentionData,
        revenue: cohortSize * 1.99 * (retentionData[29] / 100),
        ltv: cohortSize * 1.99 * (retentionData[29] / 100) * 3.5
      });
    }
    
    const cohortAnalysis = {
      metric,
      period,
      cohorts: cohorts.reverse(), // Most recent first
      summary: {
        avgRetentionDay1: 85.2,
        avgRetentionDay7: 45.8,
        avgRetentionDay30: 22.1,
        avgLTV: 6.75,
        bestCohort: cohorts[0]?.cohortDate,
        worstCohort: cohorts[cohorts.length - 1]?.cohortDate
      },
      insights: [
        'Las cohortes de diciembre muestran mejor retención (+15%)',
        'La retención día 7 ha mejorado consistentemente',
        'LTV promedio está por encima del objetivo (€6.75 vs €5.00)'
      ]
    };
    
    res.json(cohortAnalysis);
    
  } catch (error) {
    console.error('Cohort analytics error:', error);
    res.status(500).json({
      error: 'Failed to get cohort data'
    });
  }
});

// Get revenue analytics
router.get('/analytics/revenue', authenticateToken, async (req: any, res) => {
  try {
    const revenueData = {
      summary: {
        dailyRevenue: Math.random() * 100 + 50, // €50-150
        monthlyRecurring: Math.random() * 2000 + 1000, // €1000-3000 MRR
        totalRevenue: Math.random() * 10000 + 5000, // €5000-15000
        growth: Math.random() * 20 + 5 // 5-25% growth
      },
      
      subscriptions: {
        active: Math.floor(Math.random() * 500 + 200), // 200-700 active
        new: Math.floor(Math.random() * 50 + 20), // 20-70 new this month
        cancelled: Math.floor(Math.random() * 30 + 10), // 10-40 cancelled
        churnRate: Math.random() * 5 + 2, // 2-7%
        arpu: Math.random() * 3 + 1.5 // €1.5-4.5 ARPU
      },
      
      packs: {
        totalSales: Math.floor(Math.random() * 200 + 50), // 50-250 pack sales
        revenue: Math.random() * 800 + 200, // €200-1000 from packs
        topSelling: 'express_15min',
        conversionRate: Math.random() * 15 + 5 // 5-20%
      },
      
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subscriptions: Math.random() * 80 + 20,
        packs: Math.random() * 40 + 10,
        total: Math.random() * 120 + 30
      })).reverse(),
      
      forecast: {
        nextMonth: Math.random() * 3000 + 2000, // €2000-5000
        confidence: Math.random() * 20 + 70, // 70-90% confidence
        factors: ['Trial conversion trending up', 'Pack sales increasing', 'Churn rate stable']
      }
    };
    
    res.json(revenueData);
    
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      error: 'Failed to get revenue data'
    });
  }
});

// Get user behavior analytics
router.get('/analytics/behavior', authenticateToken, async (req: any, res) => {
  try {
    const behaviorData = {
      userFlow: {
        topPages: [
          { page: '/', sessions: 5420, avgTime: 45 },
          { page: '/onboarding', sessions: 3250, avgTime: 180 },
          { page: '/menu', sessions: 2100, avgTime: 120 },
          { page: '/recipe', sessions: 1800, avgTime: 95 },
          { page: '/shopping-list', sessions: 1200, avgTime: 75 }
        ],
        
        exitPages: [
          { page: '/onboarding', exits: 650, exitRate: 20 },
          { page: '/paywall', exits: 890, exitRate: 59 },
          { page: '/menu', exits: 420, exitRate: 20 },
          { page: '/recipe', exits: 280, exitRate: 15.5 }
        ],
        
        pathAnalysis: [
          { path: '/ → /onboarding → /menu', users: 1850, conversionRate: 85 },
          { path: '/ → /onboarding → /paywall', users: 420, conversionRate: 19 },
          { path: '/menu → /recipe → /shopping-list', users: 980, conversionRate: 54 }
        ]
      },
      
      features: {
        onboarding: {
          startRate: 65, // % of visitors who start
          completionRate: 80, // % who complete
          avgTimeToComplete: 165, // seconds
          dropoffSteps: [
            { step: 1, dropoff: 5 },
            { step: 2, dropoff: 8 },
            { step: 3, dropoff: 12 },
            { step: 4, dropoff: 7 }
          ]
        },
        
        menuGeneration: {
          usageRate: 92, // % of onboarded users who generate
          avgGenerations: 2.3,
          successRate: 96,
          avgResponseTime: 3.2, // seconds
          shareRate: 15 // % who share their menu
        },
        
        premiumFeatures: {
          paywallViews: 1250,
          trialStarts: 180,
          immediateConversions: 25,
          delayedConversions: 35
        }
      },
      
      engagement: {
        dailyActiveUsers: Math.floor(Math.random() * 300 + 150),
        weeklyActiveUsers: Math.floor(Math.random() * 800 + 400),
        monthlyActiveUsers: Math.floor(Math.random() * 2000 + 1000),
        avgSessionDuration: 4.2, // minutes
        avgPagesPerSession: 3.8,
        bounceRate: 32 // %
      },
      
      devices: {
        mobile: 78,
        desktop: 18,
        tablet: 4
      },
      
      geography: [
        { country: 'Spain', users: 2850, revenue: 5680 },
        { country: 'Mexico', users: 1200, revenue: 1440 },
        { country: 'Argentina', users: 890, revenue: 890 },
        { country: 'Colombia', users: 650, revenue: 585 },
        { country: 'Chile', users: 420, revenue: 630 }
      ]
    };
    
    res.json(behaviorData);
    
  } catch (error) {
    console.error('Behavior analytics error:', error);
    res.status(500).json({
      error: 'Failed to get behavior data'
    });
  }
});

export default router;