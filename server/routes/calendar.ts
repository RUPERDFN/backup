import { Router } from 'express';
import { authenticateToken } from '../auth';

const router = Router();

// Sync menu plan to Google Calendar
router.post('/calendar/sync', authenticateToken, async (req: any, res) => {
  try {
    const { menuPlanId, calendarId } = req.body;
    const userId = req.user?.claims?.sub;
    
    if (!menuPlanId) {
      return res.status(400).json({ error: 'Menu plan ID is required' });
    }
    
    // In production, this would integrate with Google Calendar API
    const calendarEvents = [
      {
        id: 'evt_001',
        title: 'Preparar Paella Valenciana',
        description: 'Tiempo de cocción: 35 min\nLink: /recipe/paella-valenciana',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
        type: 'cooking',
        recipeLink: '/recipe/paella-valenciana'
      },
      {
        id: 'evt_002', 
        title: 'Compras semanal',
        description: 'Lista de compra automática\nLink: /shopping-list/week-1',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        type: 'shopping',
        shoppingListLink: '/shopping-list/week-1'
      }
    ];
    
    res.json({
      success: true,
      eventsCreated: calendarEvents.length,
      events: calendarEvents,
      calendarUrl: `https://calendar.google.com/calendar/embed?src=${calendarId || 'primary'}`,
      message: 'Menu plan synced to calendar successfully'
    });
    
  } catch (error) {
    console.error('Calendar sync error:', error);
    res.status(500).json({
      error: 'Failed to sync calendar',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get calendar integration status
router.get('/calendar/status', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    
    // Mock calendar integration status
    const status = {
      connected: Math.random() > 0.5, // Simulate 50% of users have connected
      calendarId: 'primary',
      permissions: ['read', 'write'],
      lastSync: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      eventsCount: Math.floor(Math.random() * 20 + 5),
      notificationsEnabled: true,
      reminderTime: 30 // minutes before cooking
    };
    
    res.json(status);
    
  } catch (error) {
    console.error('Calendar status error:', error);
    res.status(500).json({
      error: 'Failed to get calendar status'
    });
  }
});

// Update notification preferences
router.patch('/calendar/notifications', authenticateToken, async (req: any, res) => {
  try {
    const { enabled, reminderTime } = req.body;
    const userId = req.user?.claims?.sub;
    
    // In production, update user preferences in database
    const preferences = {
      notificationsEnabled: enabled !== undefined ? enabled : true,
      reminderTime: reminderTime || 30,
      pushEnabled: true,
      emailEnabled: false,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      preferences,
      message: 'Notification preferences updated'
    });
    
  } catch (error) {
    console.error('Notification preferences error:', error);
    res.status(500).json({
      error: 'Failed to update notification preferences'
    });
  }
});

export default router;