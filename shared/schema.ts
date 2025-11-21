import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,

} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - supports both email/password and OAuth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // For email/password auth (hashed)
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  provider: varchar("provider").default("email"), // "email", "replit", "google"
  providerId: varchar("provider_id"), // External provider user ID
  isEmailVerified: boolean("is_email_verified").default(false),
  // Google Play Billing fields
  isPremium: boolean("is_premium").default(false),
  subscriptionStatus: varchar("subscription_status").default("free"), // "free", "active", "cancelled", "expired"
  googlePlayPurchaseToken: varchar("google_play_purchase_token"),
  subscriptionId: varchar("subscription_id"), // Google Play subscription ID
  purchaseTime: timestamp("purchase_time"),
  expiryTime: timestamp("expiry_time"),
  autoRenewing: boolean("auto_renewing").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Weekly menu plans
export const menuPlans = pgTable("menu_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  weekStartDate: timestamp("week_start_date").notNull(),
  preferences: jsonb("preferences"), // dietary preferences, budget, cooking time
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual recipes within menu plans
export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuPlanId: varchar("menu_plan_id").notNull().references(() => menuPlans.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Monday-Sunday)
  mealType: varchar("meal_type").notNull(), // breakfast, lunch, dinner, snack
  name: varchar("name").notNull(),
  description: text("description"),
  ingredients: jsonb("ingredients").notNull(), // array of ingredient objects
  instructions: jsonb("instructions").notNull(), // array of instruction steps
  nutritionInfo: jsonb("nutrition_info"), // calories, protein, carbs, etc.
  cookingTime: integer("cooking_time"), // minutes
  servings: integer("servings").default(4),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping lists generated from menu plans
export const shoppingLists = pgTable("shopping_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuPlanId: varchar("menu_plan_id").notNull().references(() => menuPlans.id),
  items: jsonb("items").notNull(), // array of shopping list items
  totalEstimatedCost: real("total_estimated_cost"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Food recognition results from photos
export const foodRecognitions = pgTable("food_recognitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url").notNull(),
  recognizedItems: jsonb("recognized_items").notNull(), // array of recognized food items with confidence
  suggestedRecipes: jsonb("suggested_recipes"), // array of recipe suggestions
  createdAt: timestamp("created_at").defaultNow(),
});

// Google Play Billing purchase records
export const googlePlayPurchases = pgTable("google_play_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  purchaseToken: varchar("purchase_token").notNull().unique(),
  productId: varchar("product_id").notNull(), // "premium_monthly", "premium_yearly"
  packageName: varchar("package_name").notNull(),
  purchaseTime: timestamp("purchase_time").notNull(),
  purchaseState: integer("purchase_state").notNull(), // 0=purchased, 1=cancelled
  consumptionState: integer("consumption_state").notNull(), // 0=yet_to_be_consumed, 1=consumed
  autoRenewing: boolean("auto_renewing").default(false),
  acknowledged: boolean("acknowledged").default(false),
  subscriptionId: varchar("subscription_id"),
  orderId: varchar("order_id"),
  verifiedAt: timestamp("verified_at"),
  verificationMethod: varchar("verification_method").default("google_play_api"), // "google_play_api", "rsa_signature"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions and trial tracking
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  plan: varchar("plan").notNull().default("free"), // "free", "trial", "pro"
  trialStartedAt: timestamp("trial_started_at"),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStartedAt: timestamp("subscription_started_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  canceledAt: timestamp("canceled_at"),
  autoConvertToPro: boolean("auto_convert_to_pro").default(true), // Convert to PRO after trial
  isActive: boolean("is_active").default(false),
  lastPaymentAt: timestamp("last_payment_at"),
  nextBillingAt: timestamp("next_billing_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu generation limits and ad tracking
export const menuGenerationLimits = pgTable("menu_generation_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: varchar("date").notNull(), // Format: YYYY-MM-DD
  generationCount: integer("generation_count").notNull().default(0),
  adUnlockedCount: integer("ad_unlocked_count").notNull().default(0),
  lastAdViewedAt: timestamp("last_ad_viewed_at"),
  nextAdAvailableAt: timestamp("next_ad_available_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_menu_limits_user_date").on(table.userId, table.date)
]);



// Zod schemas for validation
export const insertMenuPlanSchema = createInsertSchema(menuPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
});

export const insertShoppingListSchema = createInsertSchema(shoppingLists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodRecognitionSchema = createInsertSchema(foodRecognitions).omit({
  id: true,
  createdAt: true,
});

export const insertGooglePlayPurchaseSchema = createInsertSchema(googlePlayPurchases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuGenerationLimitSchema = createInsertSchema(menuGenerationLimits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



// Types
// User types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpsertUser = typeof users.$inferInsert;

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const upsertUserSchema = createInsertSchema(users).omit({ 
  createdAt: true, 
  updatedAt: true 
});
export type MenuPlan = typeof menuPlans.$inferSelect;
export type InsertMenuPlan = z.infer<typeof insertMenuPlanSchema>;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type InsertShoppingList = z.infer<typeof insertShoppingListSchema>;
export type FoodRecognition = typeof foodRecognitions.$inferSelect;
export type InsertFoodRecognition = z.infer<typeof insertFoodRecognitionSchema>;
export type GooglePlayPurchase = typeof googlePlayPurchases.$inferSelect;
export type InsertGooglePlayPurchase = z.infer<typeof insertGooglePlayPurchaseSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type MenuGenerationLimit = typeof menuGenerationLimits.$inferSelect;
export type InsertMenuGenerationLimit = z.infer<typeof insertMenuGenerationLimitSchema>;


// Recipe library - private database for offline menu generation
export const recipeLibrary = pgTable("recipe_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  mealType: varchar("meal_type").notNull(), // breakfast, lunch, dinner, snack, midmorning
  cuisine: varchar("cuisine"), // spanish, mediterranean, vegetarian, etc.
  dietaryTags: jsonb("dietary_tags").$type<string[]>().default(sql`'[]'`), // vegetarian, vegan, keto, gluten-free, etc.
  ingredients: jsonb("ingredients").$type<Array<{
    name: string;
    amount: string;
    unit: string;
    category: string;
  }>>().notNull(),
  instructions: jsonb("instructions").$type<string[]>().notNull(),
  nutritionInfo: jsonb("nutrition_info").$type<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }>().notNull(),
  cookingTime: integer("cooking_time").notNull(), // minutes
  servings: integer("servings").notNull(),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  estimatedCost: real("estimated_cost"), // euros per serving
  seasonalTags: jsonb("seasonal_tags").$type<string[]>().default(sql`'[]'`), // spring, summer, autumn, winter
  allergens: jsonb("allergens").$type<string[]>().default(sql`'[]'`), // nuts, dairy, gluten, etc.
  isApproved: boolean("is_approved").default(false), // for quality control
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRecipeLibrarySchema = createInsertSchema(recipeLibrary).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RecipeLibrary = typeof recipeLibrary.$inferSelect;
export type InsertRecipeLibrary = z.infer<typeof insertRecipeLibrarySchema>;

// Achievements - Gamification system
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(), // unique identifier like "first_menu", "recipe_master"
  name: varchar("name").notNull(), // Display name in Spanish
  description: text("description").notNull(),
  icon: varchar("icon").notNull(), // Lucide icon name or emoji
  category: varchar("category").notNull(), // "cooking", "planning", "exploration", "social"
  tier: varchar("tier").notNull().default("bronze"), // "bronze", "silver", "gold", "platinum"
  points: integer("points").notNull().default(10), // XP points awarded
  requirement: jsonb("requirement").notNull().$type<{
    type: string; // "count", "streak", "milestone"
    target: number;
    action: string; // "menu_created", "recipe_cooked", "shopping_completed"
  }>(),
  isSecret: boolean("is_secret").default(false), // Hidden until unlocked
  createdAt: timestamp("created_at").defaultNow(),
});

// User unlocked achievements
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0), // Current progress towards requirement
  isViewed: boolean("is_viewed").default(false), // User has seen the notification
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_achievements_user").on(table.userId),
  index("idx_user_achievements_user_achievement").on(table.userId, table.achievementId),
]);

// User gamification stats
export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  menusCreated: integer("menus_created").notNull().default(0),
  recipesCooked: integer("recipes_cooked").notNull().default(0),
  shoppingCompleted: integer("shopping_completed").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0), // days
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: varchar("last_activity_date"), // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
