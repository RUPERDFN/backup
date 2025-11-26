import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { insertAchievementSchema, insertUserStatsSchema } from '/shared/schema';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

router.get('/achievements', async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await storage.getAllAchievements();
    const userAchievements = req.user?.id 
      ? await storage.getUserAchievements(req.user.id)
      : [];
    
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
    
    const enriched = achievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      hidden: achievement.isSecret && !unlockedIds.has(achievement.id)
    }));

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.get('/my-achievements', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userAchievements = await storage.getUserAchievements(req.user.id);
    const unviewed = userAchievements.filter(ua => !ua.isViewed);

    res.json({
      achievements: userAchievements,
      unviewedCount: unviewed.length
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

router.post('/mark-viewed/:achievementId', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await storage.markAchievementViewed(req.user.id, req.params.achievementId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking achievement as viewed:', error);
    res.status(500).json({ error: 'Failed to mark achievement as viewed' });
  }
});

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let stats = await storage.getUserStats(req.user.id);
    
    if (!stats) {
      stats = await storage.createUserStats({
        userId: req.user.id,
        totalPoints: 0,
        level: 1,
        menusCreated: 0,
        recipesCooked: 0,
        shoppingCompleted: 0,
        currentStreak: 0,
        longestStreak: 0
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

router.post('/track-action', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { action } = req.body;
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    let stats = await storage.getUserStats(req.user.id);
    if (!stats) {
      stats = await storage.createUserStats({
        userId: req.user.id,
        totalPoints: 0,
        level: 1,
        menusCreated: 0,
        recipesCooked: 0,
        shoppingCompleted: 0,
        currentStreak: 0,
        longestStreak: 0
      });
    }

    const updates: any = {};
    const today = new Date().toISOString().split('T')[0];

    switch (action) {
      case 'menu_created':
        updates.menusCreated = (stats.menusCreated || 0) + 1;
        break;
      case 'recipe_cooked':
        updates.recipesCooked = (stats.recipesCooked || 0) + 1;
        break;
      case 'shopping_completed':
        updates.shoppingCompleted = (stats.shoppingCompleted || 0) + 1;
        break;
    }

    if (stats.lastActivityDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (stats.lastActivityDate === yesterday) {
        updates.currentStreak = (stats.currentStreak || 0) + 1;
        updates.longestStreak = Math.max(updates.currentStreak, stats.longestStreak || 0);
      } else {
        updates.currentStreak = 1;
      }
      updates.lastActivityDate = today;
    }

    const updatedStats = await storage.updateUserStats(req.user.id, updates);
    const newAchievements = await storage.checkAndUnlockAchievements(req.user.id, action);

    if (newAchievements.length > 0) {
      const achievementIds = newAchievements.map(ua => ua.achievementId);
      const achievements = await storage.getAllAchievements();
      
      const pointsEarned = newAchievements.reduce((sum, ua) => {
        const achievement = achievements.find(a => a.id === ua.achievementId);
        return sum + (achievement?.points || 0);
      }, 0);
      
      const newTotalPoints = (updatedStats?.totalPoints || 0) + pointsEarned;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      
      await storage.updateUserStats(req.user.id, {
        totalPoints: newTotalPoints,
        level: newLevel
      });
    }

    const finalStats = await storage.getUserStats(req.user.id);

    res.json({
      stats: finalStats,
      newAchievements: newAchievements.length,
      achievements: newAchievements
    });
  } catch (error) {
    console.error('Error tracking action:', error);
    res.status(500).json({ error: 'Failed to track action' });
  }
});

router.post('/admin/seed-achievements', async (req: AuthRequest, res: Response) => {
  try {
    const defaultAchievements = [
      {
        key: 'first_menu',
        name: 'Primer Menú',
        description: 'Creaste tu primer menú semanal',
        icon: '🎯',
        category: 'planning',
        tier: 'bronze',
        points: 10,
        requirement: { type: 'count', target: 1, action: 'menu_created' },
        isSecret: false
      },
      {
        key: 'menu_master',
        name: 'Maestro de Menús',
        description: 'Creaste 10 menús semanales',
        icon: '👨‍🍳',
        category: 'planning',
        tier: 'silver',
        points: 50,
        requirement: { type: 'count', target: 10, action: 'menu_created' },
        isSecret: false
      },
      {
        key: 'first_recipe',
        name: 'Primera Receta',
        description: 'Cocinaste tu primera receta',
        icon: '🥘',
        category: 'cooking',
        tier: 'bronze',
        points: 10,
        requirement: { type: 'count', target: 1, action: 'recipe_cooked' },
        isSecret: false
      },
      {
        key: 'chef_apprentice',
        name: 'Aprendiz de Chef',
        description: 'Cocinaste 20 recetas',
        icon: '👩‍🍳',
        category: 'cooking',
        tier: 'silver',
        points: 100,
        requirement: { type: 'count', target: 20, action: 'recipe_cooked' },
        isSecret: false
      },
      {
        key: 'master_chef',
        name: 'Chef Profesional',
        description: 'Cocinaste 50 recetas',
        icon: '⭐',
        category: 'cooking',
        tier: 'gold',
        points: 250,
        requirement: { type: 'count', target: 50, action: 'recipe_cooked' },
        isSecret: false
      },
      {
        key: 'first_shopping',
        name: 'Primera Compra',
        description: 'Completaste tu primera lista de compra',
        icon: '🛒',
        category: 'shopping',
        tier: 'bronze',
        points: 10,
        requirement: { type: 'count', target: 1, action: 'shopping_completed' },
        isSecret: false
      },
      {
        key: 'organized_shopper',
        name: 'Comprador Organizado',
        description: 'Completaste 15 listas de compra',
        icon: '📋',
        category: 'shopping',
        tier: 'silver',
        points: 75,
        requirement: { type: 'count', target: 15, action: 'shopping_completed' },
        isSecret: false
      },
      {
        key: 'week_streak',
        name: 'Racha Semanal',
        description: 'Mantén una racha de 7 días',
        icon: '🔥',
        category: 'dedication',
        tier: 'silver',
        points: 100,
        requirement: { type: 'streak', target: 7, action: 'streak_days' },
        isSecret: false
      },
      {
        key: 'month_streak',
        name: 'Racha Mensual',
        description: 'Mantén una racha de 30 días',
        icon: '💎',
        category: 'dedication',
        tier: 'platinum',
        points: 500,
        requirement: { type: 'streak', target: 30, action: 'streak_days' },
        isSecret: false
      }
    ];

    const created = [];
    for (const ach of defaultAchievements) {
      const existing = await storage.getAchievementByKey(ach.key);
      if (!existing) {
        const newAch = await storage.createAchievement(ach);
        created.push(newAch);
      }
    }

    res.json({ 
      message: `Seeded ${created.length} achievements`,
      achievements: created
    });
  } catch (error) {
    console.error('Error seeding achievements:', error);
    res.status(500).json({ error: 'Failed to seed achievements' });
  }
});

export default router;
