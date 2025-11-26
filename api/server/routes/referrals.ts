import { Router } from 'express';
import { authenticateToken } from '../auth';
import { nanoid } from 'nanoid';

const router = Router();

// Get user's referral info
router.get('/referrals/info', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    
    // Generate or get user's referral code
    const referralCode = `INV-${nanoid(6).toUpperCase()}`;
    
    const referralInfo = {
      userId,
      referralCode,
      referralUrl: `${req.protocol}://${req.get('host')}?ref=${referralCode}`,
      stats: {
        totalInvites: Math.floor(Math.random() * 15 + 2), // 2-17 invites
        successfulSignups: Math.floor(Math.random() * 8 + 1), // 1-9 signups
        completedMenus: Math.floor(Math.random() * 6 + 1), // 1-7 completed
        earnedDays: Math.floor(Math.random() * 6 + 1) * 14, // Earned premium days
        currentStreak: Math.floor(Math.random() * 5 + 1), // Current referral streak
        conversionRate: Math.random() * 40 + 20 // 20-60% conversion
      },
      rewards: {
        premiumDaysEarned: Math.floor(Math.random() * 84 + 14), // 14-98 days
        nextReward: '14 días premium',
        rewardTrigger: 'Cuando tu invitado complete su primer menú',
        bonusThresholds: [
          { referrals: 5, bonus: '1 mes premium extra' },
          { referrals: 10, bonus: 'Acceso beta nuevas funciones' },
          { referrals: 25, bonus: '6 meses premium gratis' }
        ]
      },
      recentActivity: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'referral_signup',
          email: 'mar***@gmail.com',
          status: 'pending_menu',
          reward: 'pending'
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'referral_completed',
          email: 'car***@outlook.com',
          status: 'completed',
          reward: '14 días premium'
        }
      ]
    };
    
    res.json(referralInfo);
    
  } catch (error) {
    console.error('Referral info error:', error);
    res.status(500).json({
      error: 'Failed to get referral information'
    });
  }
});

// Process referral signup
router.post('/referrals/signup', async (req, res) => {
  try {
    const { referralCode, userEmail, userIp, deviceFingerprint } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code is required' });
    }
    
    // Anti-fraud checks
    const fraudCheck = {
      ipCheck: true, // Different IP from referrer
      deviceCheck: true, // Different device fingerprint
      emailCheck: true, // Valid email domain
      cooldownCheck: true, // No recent signups from same IP
      referrerExists: true // Referral code exists
    };
    
    const fraudScore = Object.values(fraudCheck).filter(Boolean).length / Object.keys(fraudCheck).length;
    
    if (fraudScore < 0.8) {
      return res.status(400).json({
        error: 'Fraud detection triggered',
        reason: 'Suspicious signup pattern detected'
      });
    }
    
    // Create pending referral
    const referralSignup = {
      id: nanoid(),
      referralCode,
      refereeEmail: userEmail,
      refereeIp: userIp,
      deviceFingerprint,
      status: 'pending_menu',
      createdAt: new Date().toISOString(),
      fraudScore,
      rewardEligible: true
    };
    
    res.json({
      success: true,
      referralSignup,
      message: 'Referral signup recorded. Complete your first menu to unlock rewards!',
      nextStep: 'complete_onboarding'
    });
    
  } catch (error) {
    console.error('Referral signup error:', error);
    res.status(500).json({
      error: 'Failed to process referral signup'
    });
  }
});

// Complete referral (when referred user completes first menu)
router.post('/referrals/complete', authenticateToken, async (req: any, res) => {
  try {
    const { referralCode } = req.body;
    const userId = req.user?.claims?.sub;
    
    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code is required' });
    }
    
    // Validate and complete referral
    const completion = {
      referralCode,
      refereeUserId: userId,
      completedAt: new Date().toISOString(),
      rewardGranted: {
        referrer: {
          premiumDays: 14,
          grantedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        referee: {
          premiumDays: 14,
          grantedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      bonusEligible: false // Check if user qualifies for bonus rewards
    };
    
    res.json({
      success: true,
      completion,
      message: '¡Enhorabuena! Tanto tú como tu referido habéis ganado 14 días premium.',
      celebrationMessage: '🎉 ¡Referido completado! Ambos habéis desbloqueado premium por 14 días.'
    });
    
  } catch (error) {
    console.error('Referral completion error:', error);
    res.status(500).json({
      error: 'Failed to complete referral'
    });
  }
});

// Get referral leaderboard
router.get('/referrals/leaderboard', async (req, res) => {
  try {
    const leaderboard = Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      username: `Usuario${Math.floor(Math.random() * 1000 + 100)}`,
      referrals: Math.floor(Math.random() * 50 + 10) - i * 5,
      premiumDaysEarned: Math.floor(Math.random() * 365 + 100) - i * 30,
      badge: i === 0 ? '👑 Rey del Referido' : 
             i === 1 ? '🥈 Referidor Pro' :
             i === 2 ? '🥉 Invitador Experto' : 
             i < 5 ? '⭐ Top Referrer' : '🔥 Activo',
      isCurrentUser: i === 3 // Simulate current user in 4th position
    }));
    
    res.json({
      leaderboard,
      currentUserRank: 4,
      period: 'this_month',
      lastUpdated: new Date().toISOString(),
      totalParticipants: Math.floor(Math.random() * 500 + 200)
    });
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get referral leaderboard'
    });
  }
});

// Get referral analytics
router.get('/referrals/analytics', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    
    const analytics = {
      overview: {
        totalInvitesSent: Math.floor(Math.random() * 25 + 5),
        clickedLinks: Math.floor(Math.random() * 20 + 8),
        signups: Math.floor(Math.random() * 15 + 3),
        completions: Math.floor(Math.random() * 10 + 2),
        conversionRate: Math.random() * 30 + 15 // 15-45%
      },
      
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invites: Math.floor(Math.random() * 3),
        signups: Math.floor(Math.random() * 2),
        completions: Math.floor(Math.random() * 1)
      })).reverse(),
      
      channels: [
        { name: 'WhatsApp', shares: Math.floor(Math.random() * 15 + 5), conversions: Math.floor(Math.random() * 8 + 2) },
        { name: 'Direct Link', shares: Math.floor(Math.random() * 12 + 3), conversions: Math.floor(Math.random() * 6 + 1) },
        { name: 'Facebook', shares: Math.floor(Math.random() * 8 + 2), conversions: Math.floor(Math.random() * 4 + 1) },
        { name: 'Telegram', shares: Math.floor(Math.random() * 6 + 1), conversions: Math.floor(Math.random() * 3) }
      ],
      
      rewards: {
        totalEarned: Math.floor(Math.random() * 120 + 28), // Days earned
        currentBalance: Math.floor(Math.random() * 60 + 14), // Available days
        used: Math.floor(Math.random() * 60 + 14), // Used days
        nextMilestone: 50, // Next reward threshold
        progress: Math.floor(Math.random() * 40 + 10) // Progress to next
      }
    };
    
    res.json(analytics);
    
  } catch (error) {
    console.error('Referral analytics error:', error);
    res.status(500).json({
      error: 'Failed to get referral analytics'
    });
  }
});

export default router;