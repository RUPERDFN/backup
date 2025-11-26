import {
  users,
  menuPlans,
  recipes,
  shoppingLists,
  foodRecognitions,
  googlePlayPurchases,
  achievements,
  userAchievements,
  userStats,
  type User,
  type UpsertUser,
  type MenuPlan,
  type InsertMenuPlan,
  type Recipe,
  type InsertRecipe,
  type ShoppingList,
  type InsertShoppingList,
  type FoodRecognition,
  type InsertFoodRecognition,
  type GooglePlayPurchase,
  type InsertGooglePlayPurchase,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type UserStats,
  type InsertUserStats,
} from "/shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray, lte, gte } from "drizzle-orm";

export interface IStorage {
  // User operations - supports both email/password and OAuth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Menu plan operations
  createMenuPlan(menuPlan: InsertMenuPlan): Promise<MenuPlan>;
  getUserMenuPlans(userId: string): Promise<MenuPlan[]>;
  getMenuPlan(id: string): Promise<MenuPlan | undefined>;
  updateMenuPlan(id: string, updates: Partial<InsertMenuPlan>): Promise<MenuPlan | undefined>;
  deleteMenuPlan(id: string): Promise<void>;
  
  // Recipe operations
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getMenuPlanRecipes(menuPlanId: string): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  updateRecipe(id: string, updates: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: string): Promise<void>;
  
  // Shopping list operations
  createShoppingList(shoppingList: InsertShoppingList): Promise<ShoppingList>;
  getMenuPlanShoppingList(menuPlanId: string): Promise<ShoppingList | undefined>;
  updateShoppingList(id: string, updates: Partial<InsertShoppingList>): Promise<ShoppingList | undefined>;
  
  // Food recognition operations
  createFoodRecognition(recognition: InsertFoodRecognition): Promise<FoodRecognition>;
  getUserFoodRecognitions(userId: string): Promise<FoodRecognition[]>;
  getFoodRecognition(id: string): Promise<FoodRecognition | undefined>;
  
  // Price comparison operations (placeholder)
  createPriceComparison(comparison: any): Promise<any>;
  getUserPriceComparisons(userId: string): Promise<any[]>;
  getRecentPriceComparisons(searchQuery: string): Promise<any[]>;
  
  // Google Play Billing operations
  createGooglePlayPurchase(purchase: InsertGooglePlayPurchase): Promise<GooglePlayPurchase>;
  getGooglePlayPurchase(purchaseToken: string): Promise<GooglePlayPurchase | undefined>;
  getUserGooglePlayPurchases(userId: string): Promise<GooglePlayPurchase[]>;
  updateGooglePlayPurchase(id: string, updates: Partial<InsertGooglePlayPurchase>): Promise<GooglePlayPurchase | undefined>;
  updateUserSubscription(userId: string, subscriptionData: {
    isPremium: boolean;
    subscriptionStatus: string;
    googlePlayPurchaseToken?: string;
    subscriptionId?: string;
    purchaseTime?: Date;
    expiryTime?: Date;
    autoRenewing?: boolean;
  }): Promise<User | undefined>;
  
  // Gamification operations
  getAllAchievements(): Promise<Achievement[]>;
  getAchievementByKey(key: string): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats | undefined>;
  unlockAchievement(userId: string, achievementId: string, progress?: number): Promise<UserAchievement>;
  markAchievementViewed(userId: string, achievementId: string): Promise<void>;
  checkAndUnlockAchievements(userId: string, action: string): Promise<UserAchievement[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Google Play Billing methods
  async createGooglePlayPurchase(purchase: InsertGooglePlayPurchase): Promise<GooglePlayPurchase> {
    const [created] = await db.insert(googlePlayPurchases).values({
      ...purchase,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return created;
  }

  async getGooglePlayPurchase(purchaseToken: string): Promise<GooglePlayPurchase | undefined> {
    const [purchase] = await db
      .select()
      .from(googlePlayPurchases)
      .where(eq(googlePlayPurchases.purchaseToken, purchaseToken));
    return purchase;
  }

  async getUserGooglePlayPurchases(userId: string): Promise<GooglePlayPurchase[]> {
    return await db
      .select()
      .from(googlePlayPurchases)
      .where(eq(googlePlayPurchases.userId, userId))
      .orderBy(desc(googlePlayPurchases.createdAt));
  }

  async updateGooglePlayPurchase(id: string, updates: Partial<InsertGooglePlayPurchase>): Promise<GooglePlayPurchase | undefined> {
    const [updated] = await db
      .update(googlePlayPurchases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(googlePlayPurchases.id, id))
      .returning();
    return updated;
  }

  async updateUserSubscription(userId: string, subscriptionData: {
    isPremium: boolean;
    subscriptionStatus: string;
    googlePlayPurchaseToken?: string;
    subscriptionId?: string;
    purchaseTime?: Date;
    expiryTime?: Date;
    autoRenewing?: boolean;
  }): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        isPremium: subscriptionData.isPremium,
        subscriptionStatus: subscriptionData.subscriptionStatus,
        googlePlayPurchaseToken: subscriptionData.googlePlayPurchaseToken,
        subscriptionId: subscriptionData.subscriptionId,
        purchaseTime: subscriptionData.purchaseTime,
        expiryTime: subscriptionData.expiryTime,
        autoRenewing: subscriptionData.autoRenewing,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, stripeCustomerId)) // Changed from stripeCustomerId to id;
    return user;
  }

  // Menu plan operations
  async createMenuPlan(menuPlan: InsertMenuPlan): Promise<MenuPlan> {
    const [created] = await db.insert(menuPlans).values(menuPlan).returning();
    return created;
  }

  async getMenuPlan(id: string): Promise<MenuPlan | undefined> {
    const [menuPlan] = await db.select().from(menuPlans).where(eq(menuPlans.id, id));
    return menuPlan;
  }

  async updateMenuPlan(id: string, updates: Partial<InsertMenuPlan>): Promise<MenuPlan | undefined> {
    const [updated] = await db
      .update(menuPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(menuPlans.id, id))
      .returning();
    return updated;
  }

  async getUserMenuPlans(userId: string): Promise<MenuPlan[]> {
    return await db
      .select()
      .from(menuPlans)
      .where(eq(menuPlans.userId, userId))
      .orderBy(desc(menuPlans.createdAt));
  }

  async deleteMenuPlan(id: string): Promise<void> {
    // Delete related recipes first
    await db.delete(recipes).where(eq(recipes.menuPlanId, id));
    
    // Delete related shopping lists
    await db.delete(shoppingLists).where(eq(shoppingLists.menuPlanId, id));
    
    // Delete the menu plan
    await db.delete(menuPlans).where(eq(menuPlans.id, id));
  }

  // Recipe operations
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [created] = await db.insert(recipes).values(recipe).returning();
    return created;
  }

  async getMenuPlanRecipes(menuPlanId: string): Promise<Recipe[]> {
    return await db
      .select()
      .from(recipes)
      .where(eq(recipes.menuPlanId, menuPlanId))
      .orderBy(recipes.dayOfWeek, recipes.mealType);
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async updateRecipe(id: string, updates: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const [updated] = await db
      .update(recipes)
      .set(updates)
      .where(eq(recipes.id, id))
      .returning();
    return updated;
  }

  async deleteRecipe(id: string): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  // Shopping list operations
  async createShoppingList(shoppingList: InsertShoppingList): Promise<ShoppingList> {
    const [created] = await db.insert(shoppingLists).values(shoppingList).returning();
    return created;
  }

  async getMenuPlanShoppingList(menuPlanId: string): Promise<ShoppingList | undefined> {
    const [shoppingList] = await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.menuPlanId, menuPlanId))
      .orderBy(desc(shoppingLists.createdAt))
      .limit(1);
    return shoppingList;
  }

  async updateShoppingList(id: string, updates: Partial<InsertShoppingList>): Promise<ShoppingList | undefined> {
    const [updated] = await db
      .update(shoppingLists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(shoppingLists.id, id))
      .returning();
    return updated;
  }

  // Food recognition operations
  async createFoodRecognition(recognition: InsertFoodRecognition): Promise<FoodRecognition> {
    const [created] = await db.insert(foodRecognitions).values(recognition).returning();
    return created;
  }

  async getUserFoodRecognitions(userId: string): Promise<FoodRecognition[]> {
    return await db
      .select()
      .from(foodRecognitions)
      .where(eq(foodRecognitions.userId, userId))
      .orderBy(desc(foodRecognitions.createdAt));
  }

  async getFoodRecognition(id: string): Promise<FoodRecognition | undefined> {
    const [recognition] = await db.select().from(foodRecognitions).where(eq(foodRecognitions.id, id));
    return recognition;
  }

  // Placeholder for price comparison operations (to be implemented)
  async createPriceComparison(comparison: any): Promise<any> {
    throw new Error('Price comparison not implemented yet');
  }

  async getUserPriceComparisons(userId: string): Promise<any[]> {
    return [];
  }

  async getRecentPriceComparisons(searchQuery: string): Promise<any[]> {
    return [];
  }
  
  // Gamification operations
  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.category, achievements.tier);
  }

  async getAchievementByKey(key: string): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.key, key));
    return achievement;
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const [created] = await db.insert(achievements).values(achievementData).returning();
    return created;
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const results = await db
      .select()
      .from(userAchievements)
      .leftJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
    
    return results.map(row => ({
      ...row.user_achievements!,
      achievement: row.achievements!
    }));
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async createUserStats(statsData: InsertUserStats): Promise<UserStats> {
    const [created] = await db.insert(userStats).values({
      ...statsData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return created;
  }

  async updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats | undefined> {
    const [updated] = await db
      .update(userStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return updated;
  }

  async unlockAchievement(userId: string, achievementId: string, progress: number = 100): Promise<UserAchievement> {
    const [unlocked] = await db.insert(userAchievements).values({
      userId,
      achievementId,
      progress,
      isViewed: false,
      unlockedAt: new Date(),
      createdAt: new Date()
    }).returning();
    return unlocked;
  }

  async markAchievementViewed(userId: string, achievementId: string): Promise<void> {
    await db
      .update(userAchievements)
      .set({ isViewed: true })
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));
  }

  async checkAndUnlockAchievements(userId: string, action: string): Promise<UserAchievement[]> {
    const stats = await this.getUserStats(userId);
    if (!stats) return [];

    const allAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.requirement, sql`${action}`));

    const userUnlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    
    const unlockedIds = new Set(userUnlocked.map(ua => ua.achievementId));
    const newUnlocks: UserAchievement[] = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;
      
      const req = achievement.requirement as { type: string; target: number; action: string };
      let currentValue = 0;

      switch (req.action) {
        case 'menu_created':
          currentValue = stats.menusCreated;
          break;
        case 'recipe_cooked':
          currentValue = stats.recipesCooked;
          break;
        case 'shopping_completed':
          currentValue = stats.shoppingCompleted;
          break;
        case 'streak_days':
          currentValue = stats.currentStreak;
          break;
      }

      if (currentValue >= req.target) {
        const unlocked = await this.unlockAchievement(userId, achievement.id, req.target);
        newUnlocks.push(unlocked);
      }
    }

    return newUnlocks;
  }
}

export const storage = new DatabaseStorage();

// Simple in-memory cache for Google Play verifications (reduces quota usage)
class VerificationCache {
  private cache = new Map<string, { data: any; timestamp: number; expiresAt: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTTL;
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });

    // Cleanup expired entries if cache is getting large
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      defaultTTL: this.defaultTTL
    };
  }
}

export const verificationCache = new VerificationCache();
