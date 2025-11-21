package com.cookflow.app

import android.content.Context
import android.os.Bundle
import android.util.Log
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.ktx.Firebase

/**
 * Complete Firebase Analytics implementation for TheCookFlow
 * Tracks user behavior, conversion events, and app performance
 */
object AnalyticsManager {
    
    private const val TAG = "AnalyticsManager"
    private lateinit var firebaseAnalytics: FirebaseAnalytics
    private var isInitialized = false
    
    /**
     * Initialize Firebase Analytics
     */
    fun init(context: Context) {
        if (isInitialized) return
        
        try {
            firebaseAnalytics = Firebase.analytics
            isInitialized = true
            Log.d(TAG, "✅ Firebase Analytics initialized")
            
            // Track app start
            logEvent("app_start", Bundle().apply {
                putString("platform", "android")
                putString("app_version", BuildConfig.VERSION_NAME)
            })
            
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to initialize Firebase Analytics", e)
        }
    }
    
    /**
     * Track user events with parameters
     */
    fun logEvent(eventName: String, parameters: Bundle? = null) {
        if (!isInitialized) {
            Log.w(TAG, "Analytics not initialized, skipping event: $eventName")
            return
        }
        
        try {
            firebaseAnalytics.logEvent(eventName, parameters)
            Log.d(TAG, "📊 Event logged: $eventName")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to log event: $eventName", e)
        }
    }
    
    /**
     * Set user properties for segmentation
     */
    fun setUserProperty(name: String, value: String?) {
        if (!isInitialized) return
        
        try {
            firebaseAnalytics.setUserProperty(name, value)
            Log.d(TAG, "👤 User property set: $name = $value")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to set user property: $name", e)
        }
    }
    
    // MARK: - Predefined Events for TheCookFlow
    
    /**
     * Track when user starts premium trial
     */
    fun trackTrialStarted() {
        logEvent("trial_started", Bundle().apply {
            putString("subscription_type", "premium")
            putDouble("trial_duration_days", 7.0)
            putDouble("subscription_price", 1.99)
            putString("currency", "EUR")
        })
    }
    
    /**
     * Track successful premium subscription
     */
    fun trackSubscriptionPurchased(purchaseToken: String) {
        logEvent("subscription_purchased", Bundle().apply {
            putString("subscription_type", "premium")
            putDouble("price", 1.99)
            putString("currency", "EUR")
            putString("purchase_token", purchaseToken.take(20)) // Only first 20 chars for privacy
        })
    }
    
    /**
     * Track subscription cancellation
     */
    fun trackSubscriptionCanceled(reason: String) {
        logEvent("subscription_canceled", Bundle().apply {
            putString("cancellation_reason", reason)
            putString("subscription_type", "premium")
        })
    }
    
    /**
     * Track menu generation requests
     */
    fun trackMenuGenerated(aiProvider: String, success: Boolean, menuType: String) {
        logEvent("menu_generated", Bundle().apply {
            putString("ai_provider", aiProvider)
            putBoolean("success", success)
            putString("menu_type", menuType)
        })
    }
    
    /**
     * Track ingredient recognition usage
     */
    fun trackIngredientRecognition(success: Boolean, ingredientCount: Int) {
        logEvent("ingredient_recognition", Bundle().apply {
            putBoolean("success", success)
            putInt("ingredient_count", ingredientCount)
        })
    }
    
    /**
     * Track shopping list creation
     */
    fun trackShoppingListCreated(itemCount: Int, source: String) {
        logEvent("shopping_list_created", Bundle().apply {
            putInt("item_count", itemCount)
            putString("source", source) // "menu", "manual", "recipe"
        })
    }
    
    /**
     * Track Amazon Fresh integration usage
     */
    fun trackAmazonFreshClick(productCount: Int) {
        logEvent("amazon_fresh_clicked", Bundle().apply {
            putInt("product_count", productCount)
            putString("integration", "amazon_fresh")
        })
    }
    
    /**
     * Track ad interactions
     */
    fun trackAdEvent(adType: String, event: String, adUnitId: String? = null) {
        logEvent("ad_${event}", Bundle().apply {
            putString("ad_type", adType) // "banner", "interstitial", "rewarded"
            putString("ad_event", event) // "shown", "clicked", "closed", "reward_earned"
            adUnitId?.let { putString("ad_unit_id", it) }
        })
    }
    
    /**
     * Track user engagement with recipes
     */
    fun trackRecipeViewed(recipeId: String, recipeType: String, isPremium: Boolean) {
        logEvent("recipe_viewed", Bundle().apply {
            putString("recipe_id", recipeId)
            putString("recipe_type", recipeType)
            putBoolean("is_premium", isPremium)
        })
    }
    
    /**
     * Track paywall interactions
     */
    fun trackPaywallShown(source: String) {
        logEvent("paywall_shown", Bundle().apply {
            putString("source", source) // "recipe_limit", "ad_free", "menu_generation"
        })
    }
    
    fun trackPaywallDismissed(source: String, action: String) {
        logEvent("paywall_dismissed", Bundle().apply {
            putString("source", source)
            putString("action", action) // "close", "back", "outside_tap"
        })
    }
    
    /**
     * Track app lifecycle events
     */
    fun trackAppForeground() {
        logEvent("app_foreground")
    }
    
    fun trackAppBackground() {
        logEvent("app_background")
    }
    
    /**
     * Track user retention milestones
     */
    fun trackRetentionMilestone(days: Int) {
        logEvent("retention_milestone", Bundle().apply {
            putInt("days_since_install", days)
        })
    }
    
    /**
     * Track errors for debugging
     */
    fun trackError(errorType: String, errorMessage: String, context: String) {
        logEvent("app_error", Bundle().apply {
            putString("error_type", errorType)
            putString("error_message", errorMessage.take(100)) // Limit message length
            putString("error_context", context)
        })
    }
    
    /**
     * Track feature usage
     */
    fun trackFeatureUsed(featureName: String, isPremium: Boolean) {
        logEvent("feature_used", Bundle().apply {
            putString("feature_name", featureName)
            putBoolean("is_premium_user", isPremium)
        })
    }
    
    /**
     * Set user as premium for segmentation
     */
    fun setUserPremiumStatus(isPremium: Boolean) {
        setUserProperty("user_type", if (isPremium) "premium" else "free")
        setUserProperty("subscription_status", if (isPremium) "active" else "none")
    }
    
    /**
     * Set user preferences for analytics
     */
    fun setUserPreferences(language: String, region: String) {
        setUserProperty("user_language", language)
        setUserProperty("user_region", region)
    }
}