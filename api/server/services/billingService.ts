import { eq, and } from 'drizzle-orm';
import { userSubscriptions, users, googlePlayPurchases } from '/shared/schema';
import type { UserSubscription, InsertUserSubscription } from '/shared/schema';
import { db } from '../db';

const TRIAL_DURATION_DAYS = 7;
const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

export interface SubscriptionStatus {
  plan: 'free' | 'trial' | 'pro';
  trialActive: boolean;
  active: boolean;
  daysSinceStart: number;
  expiresIn: number;
  trialStartedAt?: Date | null;
  trialEndsAt?: Date | null;
  subscriptionEndsAt?: Date | null;
}

/**
 * Get the subscription status for a user
 * Handles automatic trial to PRO conversion
 */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  try {
    // Get or create user subscription
    let subscription = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId)
    });

    if (!subscription) {
      // Create default free subscription
      const [newSub] = await db.insert(userSubscriptions)
        .values({
          userId,
          plan: 'free',
          isActive: false
        })
        .returning();
      subscription = newSub;
    }

    const now = Date.now();
    
    // Calculate days since trial started
    const trialStartTime = subscription.trialStartedAt?.getTime() || now;
    const daysSinceStart = Math.floor((now - trialStartTime) / (1000 * 60 * 60 * 24));

    // Check if trial should auto-convert to PRO
    if (subscription.plan === 'trial') {
      const trialEndTime = subscription.trialEndsAt?.getTime() || (trialStartTime + TRIAL_DURATION_MS);
      
      if (now >= trialEndTime && subscription.autoConvertToPro) {
        // Auto-convert to PRO
        subscription = await convertTrialToPro(subscription);
      }
    }

    // Calculate trial status
    const trialActive = subscription.plan === 'trial' && 
                       subscription.trialEndsAt && 
                       now < subscription.trialEndsAt.getTime();
    
    const expiresIn = trialActive && subscription.trialEndsAt
      ? Math.max(0, Math.ceil((subscription.trialEndsAt.getTime() - now) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      plan: subscription.plan as 'free' | 'trial' | 'pro',
      trialActive,
      active: subscription.isActive || false,
      daysSinceStart,
      expiresIn,
      trialStartedAt: subscription.trialStartedAt,
      trialEndsAt: subscription.trialEndsAt,
      subscriptionEndsAt: subscription.subscriptionEndsAt
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      plan: 'free',
      trialActive: false,
      active: false,
      daysSinceStart: 0,
      expiresIn: 0
    };
  }
}

/**
 * Start a 7-day trial for a user
 */
export async function startTrial(userId: string): Promise<SubscriptionStatus> {
  try {
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + TRIAL_DURATION_MS);

    // Check if user already has a subscription
    const existingSub = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId)
    });

    if (existingSub) {
      // Check if user already used their trial
      if (existingSub.trialStartedAt) {
        throw new Error('Trial ya utilizado anteriormente');
      }

      // Update existing subscription to trial
      await db.update(userSubscriptions)
        .set({
          plan: 'trial',
          trialStartedAt: now,
          trialEndsAt,
          isActive: true,
          autoConvertToPro: true,
          updatedAt: now
        })
        .where(eq(userSubscriptions.userId, userId));
    } else {
      // Create new trial subscription
      await db.insert(userSubscriptions)
        .values({
          userId,
          plan: 'trial',
          trialStartedAt: now,
          trialEndsAt,
          isActive: true,
          autoConvertToPro: true
        });
    }

    // Update user's premium status
    await db.update(users)
      .set({
        isPremium: true,
        subscriptionStatus: 'active',
        updatedAt: now
      })
      .where(eq(users.id, userId));

    return getSubscriptionStatus(userId);
  } catch (error) {
    console.error('Error starting trial:', error);
    throw error;
  }
}

/**
 * Cancel a user's subscription (reverts to free plan)
 */
export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    const now = new Date();

    // Update subscription to free
    await db.update(userSubscriptions)
      .set({
        plan: 'free',
        isActive: false,
        canceledAt: now,
        autoConvertToPro: false,
        subscriptionEndsAt: now,
        updatedAt: now
      })
      .where(eq(userSubscriptions.userId, userId));

    // Update user's premium status
    await db.update(users)
      .set({
        isPremium: false,
        subscriptionStatus: 'cancelled',
        updatedAt: now
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }
}

/**
 * Verify a Google Play purchase and activate PRO plan
 */
export async function verifyGooglePlayPurchase(
  userId: string, 
  purchaseToken: string,
  productId?: string,
  subscriptionId?: string
): Promise<{ active: boolean; plan: string }> {
  try {
    const { getGooglePlayService } = await import('../googlePlayBilling');
    const googlePlayService = getGooglePlayService();

    // Use productId/subscriptionId from params or default to 'premium_monthly'
    const finalProductId = productId || subscriptionId || 'premium_monthly';
    const finalSubscriptionId = subscriptionId || productId || 'premium_monthly';

    // Always verify with Google Play Developer API (don't trust local records)
    let verificationResult;
    let isActive = false;

    try {
      verificationResult = await googlePlayService.verifySubscription(finalSubscriptionId, purchaseToken);
      isActive = googlePlayService.isSubscriptionActive(verificationResult);
      console.log(`Verified subscription ${finalSubscriptionId} with Google Play: active=${isActive}`);
    } catch (error) {
      console.error('Error verifying subscription with Google Play:', error);
      return { active: false, plan: 'free' };
    }

    if (!isActive) {
      console.log('Subscription is not active');
      // Update user to free if they were premium
      await db.update(users)
        .set({
          isPremium: false,
          subscriptionStatus: 'expired',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      return { active: false, plan: 'free' };
    }

    const now = new Date();
    const expiryTime = new Date(parseInt(verificationResult.expiryTimeMillis));

    // Update subscription to PRO
    const existingSub = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId)
    });

    if (existingSub) {
      await db.update(userSubscriptions)
        .set({
          plan: 'pro',
          isActive: true,
          subscriptionStartedAt: now,
          lastPaymentAt: now,
          nextBillingAt: expiryTime,
          canceledAt: null,
          updatedAt: now
        })
        .where(eq(userSubscriptions.userId, userId));
    } else {
      await db.insert(userSubscriptions)
        .values({
          userId,
          plan: 'pro',
          isActive: true,
          subscriptionStartedAt: now,
          lastPaymentAt: now,
          nextBillingAt: expiryTime
        });
    }

    // Update user's premium status
    await db.update(users)
      .set({
        isPremium: true,
        subscriptionStatus: 'active',
        googlePlayPurchaseToken: purchaseToken,
        subscriptionId: finalSubscriptionId,
        purchaseTime: new Date(parseInt(verificationResult.startTimeMillis)),
        expiryTime,
        autoRenewing: verificationResult.autoRenewing,
        updatedAt: now
      })
      .where(eq(users.id, userId));

    // Update or insert purchase record
    const existingPurchase = await db.query.googlePlayPurchases.findFirst({
      where: eq(googlePlayPurchases.purchaseToken, purchaseToken)
    });

    const purchaseData = {
      userId,
      purchaseToken,
      productId: finalProductId,
      subscriptionId: finalSubscriptionId,
      packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.cookflow.app',
      purchaseTime: new Date(parseInt(verificationResult.startTimeMillis)),
      purchaseState: verificationResult.paymentState === 1 ? 0 : 1,
      consumptionState: 0,
      autoRenewing: verificationResult.autoRenewing,
      acknowledged: verificationResult.acknowledgementState === 1,
      orderId: verificationResult.orderId,
      verifiedAt: now
    };

    if (existingPurchase) {
      // Update existing record with fresh data from Google Play
      await db.update(googlePlayPurchases)
        .set(purchaseData)
        .where(eq(googlePlayPurchases.id, existingPurchase.id));
      console.log('Updated existing purchase record');
    } else {
      // Insert new record
      await db.insert(googlePlayPurchases).values(purchaseData);
      console.log('Created new purchase record');
    }

    // Acknowledge if not already acknowledged
    if (verificationResult.acknowledgementState === 0) {
      try {
        await googlePlayService.acknowledgeSubscription(finalSubscriptionId, purchaseToken);
        console.log('Acknowledged subscription with Google Play');
      } catch (error) {
        console.error('Error acknowledging subscription:', error);
      }
    }

    return { active: true, plan: 'pro' };
  } catch (error) {
    console.error('Error verifying Google Play purchase:', error);
    return { active: false, plan: 'free' };
  }
}

/**
 * Convert trial to PRO (called automatically after 7 days)
 */
async function convertTrialToPro(subscription: UserSubscription): Promise<UserSubscription> {
  const now = new Date();
  
  // Update subscription to PRO
  const [updated] = await db.update(userSubscriptions)
    .set({
      plan: 'pro',
      isActive: true,
      subscriptionStartedAt: now,
      nextBillingAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      updatedAt: now
    })
    .where(eq(userSubscriptions.id, subscription.id))
    .returning();

  // Update user's premium status
  await db.update(users)
    .set({
      isPremium: true,
      subscriptionStatus: 'active',
      updatedAt: now
    })
    .where(eq(users.id, subscription.userId));

  console.log(`Trial auto-converted to PRO for user ${subscription.userId}`);
  
  return updated;
}

/**
 * Check and process expired trials (can be called periodically)
 */
export async function processExpiredTrials(): Promise<void> {
  try {
    const now = new Date();
    
    // Find all expired trials that should auto-convert
    const expiredTrials = await db.query.userSubscriptions.findMany({
      where: and(
        eq(userSubscriptions.plan, 'trial'),
        eq(userSubscriptions.autoConvertToPro, true)
      )
    });

    for (const subscription of expiredTrials) {
      if (subscription.trialEndsAt && now >= subscription.trialEndsAt) {
        await convertTrialToPro(subscription);
      }
    }
  } catch (error) {
    console.error('Error processing expired trials:', error);
  }
}