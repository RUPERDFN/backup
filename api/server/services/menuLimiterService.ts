import { eq, and } from 'drizzle-orm';
import { menuGenerationLimits, userSubscriptions } from '@shared/schema';
import type { MenuGenerationLimit } from '@shared/schema';
import { db } from '../db';
import { getSubscriptionStatus } from './billingService';

const MAX_FREE_MENUS_PER_DAY = 1;
const MAX_AD_UNLOCKS_PER_DAY = 2;
const AD_COOLDOWN_MINUTES = 30;

export interface MenuGenerationCheck {
  allowed: boolean;
  reason: 'first_menu_free' | 'after_ad' | 'need_ad' | 'pro_unlimited' | 'trial_unlimited' | 'daily_limit_reached';
  remainingFree: number;
  adUnlocksAvailable: number;
  nextAdAvailable?: Date;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get or create today's limits for a user
 */
async function getTodayLimits(userId: string): Promise<MenuGenerationLimit> {
  const today = getTodayString();
  
  // Check if limits exist for today
  let limits = await db.query.menuGenerationLimits.findFirst({
    where: and(
      eq(menuGenerationLimits.userId, userId),
      eq(menuGenerationLimits.date, today)
    )
  });

  // Create new limits if they don't exist
  if (!limits) {
    const [newLimits] = await db.insert(menuGenerationLimits)
      .values({
        userId,
        date: today,
        generationCount: 0,
        adUnlockedCount: 0
      })
      .returning();
    limits = newLimits;
  }

  return limits;
}

/**
 * Check if a user can generate a menu
 */
export async function canGenerateMenu(userId: string): Promise<MenuGenerationCheck> {
  try {
    // Check subscription status first
    const subscription = await getSubscriptionStatus(userId);
    
    // PRO users have unlimited generations
    if (subscription.plan === 'pro') {
      return {
        allowed: true,
        reason: 'pro_unlimited',
        remainingFree: 999,
        adUnlocksAvailable: 0
      };
    }

    // Trial users also have unlimited during trial
    if (subscription.trialActive) {
      return {
        allowed: true,
        reason: 'trial_unlimited',
        remainingFree: 999,
        adUnlocksAvailable: 0
      };
    }

    // Get today's limits for free users
    const limits = await getTodayLimits(userId);
    
    // Calculate remaining free generations
    const remainingFree = Math.max(0, MAX_FREE_MENUS_PER_DAY - limits.generationCount);
    
    // First menu of the day is free
    if (limits.generationCount < MAX_FREE_MENUS_PER_DAY) {
      return {
        allowed: true,
        reason: 'first_menu_free',
        remainingFree,
        adUnlocksAvailable: MAX_AD_UNLOCKS_PER_DAY - limits.adUnlockedCount
      };
    }

    // Check if user has pending ad unlock
    const now = new Date();
    if (limits.nextAdAvailableAt && now >= limits.nextAdAvailableAt && 
        limits.adUnlockedCount < MAX_AD_UNLOCKS_PER_DAY) {
      return {
        allowed: true,
        reason: 'after_ad',
        remainingFree: 0,
        adUnlocksAvailable: MAX_AD_UNLOCKS_PER_DAY - limits.adUnlockedCount
      };
    }

    // Check if user can watch more ads today
    if (limits.adUnlockedCount < MAX_AD_UNLOCKS_PER_DAY) {
      // Check ad cooldown
      let nextAdAvailable: Date | undefined;
      if (limits.lastAdViewedAt) {
        const cooldownEnd = new Date(limits.lastAdViewedAt.getTime() + AD_COOLDOWN_MINUTES * 60 * 1000);
        if (now < cooldownEnd) {
          nextAdAvailable = cooldownEnd;
        }
      }

      return {
        allowed: false,
        reason: 'need_ad',
        remainingFree: 0,
        adUnlocksAvailable: MAX_AD_UNLOCKS_PER_DAY - limits.adUnlockedCount,
        nextAdAvailable
      };
    }

    // Daily limit reached
    return {
      allowed: false,
      reason: 'daily_limit_reached',
      remainingFree: 0,
      adUnlocksAvailable: 0
    };
  } catch (error) {
    console.error('Error checking menu generation limits:', error);
    // On error, allow generation to avoid blocking users
    return {
      allowed: true,
      reason: 'first_menu_free',
      remainingFree: 1,
      adUnlocksAvailable: 0
    };
  }
}

/**
 * Record a menu generation
 */
export async function recordMenuGeneration(userId: string): Promise<void> {
  try {
    const limits = await getTodayLimits(userId);
    
    await db.update(menuGenerationLimits)
      .set({
        generationCount: limits.generationCount + 1,
        updatedAt: new Date()
      })
      .where(eq(menuGenerationLimits.id, limits.id));
  } catch (error) {
    console.error('Error recording menu generation:', error);
  }
}

/**
 * Unlock menu generation after watching an ad
 */
export async function unlockAfterAd(userId: string): Promise<boolean> {
  try {
    const limits = await getTodayLimits(userId);
    
    // Check if user can watch more ads
    if (limits.adUnlockedCount >= MAX_AD_UNLOCKS_PER_DAY) {
      return false;
    }

    const now = new Date();
    const nextAdAvailable = new Date(now.getTime() + AD_COOLDOWN_MINUTES * 60 * 1000);

    await db.update(menuGenerationLimits)
      .set({
        adUnlockedCount: limits.adUnlockedCount + 1,
        lastAdViewedAt: now,
        nextAdAvailableAt: nextAdAvailable,
        updatedAt: now
      })
      .where(eq(menuGenerationLimits.id, limits.id));

    return true;
  } catch (error) {
    console.error('Error unlocking after ad:', error);
    return false;
  }
}

/**
 * Get detailed limit status for a user
 */
export async function getLimitStatus(userId: string): Promise<{
  subscription: string;
  generationsToday: number;
  freeRemaining: number;
  adsWatched: number;
  adsRemaining: number;
  nextAdAvailable?: Date;
  canGenerate: boolean;
}> {
  try {
    const subscription = await getSubscriptionStatus(userId);
    const limits = await getTodayLimits(userId);
    const check = await canGenerateMenu(userId);

    return {
      subscription: subscription.plan,
      generationsToday: limits.generationCount,
      freeRemaining: check.remainingFree,
      adsWatched: limits.adUnlockedCount,
      adsRemaining: check.adUnlocksAvailable,
      nextAdAvailable: check.nextAdAvailable,
      canGenerate: check.allowed
    };
  } catch (error) {
    console.error('Error getting limit status:', error);
    return {
      subscription: 'free',
      generationsToday: 0,
      freeRemaining: 1,
      adsWatched: 0,
      adsRemaining: MAX_AD_UNLOCKS_PER_DAY,
      canGenerate: true
    };
  }
}

/**
 * Reset daily limits (can be called by a cron job at midnight)
 */
export async function resetDailyLimits(): Promise<void> {
  try {
    // This function can be called by a cron job to ensure limits are reset
    // In practice, the getTodayLimits function automatically handles new days
    console.log('Daily limits reset check completed');
  } catch (error) {
    console.error('Error resetting daily limits:', error);
  }
}