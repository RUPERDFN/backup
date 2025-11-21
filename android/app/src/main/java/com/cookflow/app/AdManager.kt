package com.cookflow.app

import android.app.Activity
import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.LoadAdError

object AdManager {
    private const val TAG = "AdManager"
    private const val PREFS_NAME = "ad_manager_prefs"
    private const val KEY_ACTION_COUNT = "action_count"
    private const val KEY_SESSION_REWARDS_COUNT = "session_rewards_count"

    private var interstitial: InterstitialAd? = null
    private var isInitialized = false
    private lateinit var prefs: SharedPreferences
    private var actionCount = 0
    private var sessionRewardsCount = 0

    /**
     * Initialize AdManager with consent gating
     * Only call this AFTER consent has been obtained
     */
    fun init(context: Context) {
        if (isInitialized) return

        // Check consent before initializing
        if (!ConsentManager.canRequestAds(context)) {
            Log.w(TAG, "❌ Cannot initialize ads - no consent")
            return
        }

        if (!ConfigManager.getAdsConfig().enabled) {
            Log.w(TAG, "❌ Cannot initialize ads - disabled in config")
            return
        }

        Log.d(TAG, "✅ Initializing AdMob...")
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        // Load counters from preferences
        actionCount = prefs.getInt(KEY_ACTION_COUNT, 0)
        sessionRewardsCount = 0 // Reset on new session

        MobileAds.initialize(context) { initializationStatus ->
            Log.d(TAG, "✅ AdMob initialized: $initializationStatus")
            isInitialized = true
        }
    }

    /**
     * Create banner ad view with consent and config gating
     */
    fun newBannerAdView(context: Context): AdView? {
        if (!canShowAds(context) || !ConfigManager.isAdTypeEnabled("banner")) {
            Log.d(TAG, "Banner ads not allowed")
            return null
        }

        val adView = AdView(context)
        adView.setAdSize(AdSize.BANNER) // Changed line
        adView.adUnitId = AdIds.BANNER
        adView.adListener = object : AdListener() {
            override fun onAdFailedToLoad(error: LoadAdError) {
                Log.w(TAG, "Banner failed: ${error.message}")
            }
            override fun onAdLoaded() {
                Log.d(TAG, "✅ Banner loaded successfully")
            }
        }
        adView.loadAd(AdRequest.Builder().build())
        return adView
    }

    /**
     * Preload interstitial ad with gating
     */
    fun preloadInterstitial(activity: Activity) {
        if (interstitial != null || !canShowAds(activity) || !ConfigManager.isAdTypeEnabled("interstitial")) {
            return
        }

        InterstitialAd.load(
            activity,
            AdIds.INTERSTITIAL,
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitial = ad
                    Log.d(TAG, "✅ Interstitial preloaded")
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitial = null
                    Log.w(TAG, "Interstitial failed to load: ${error.message}")
                }
            }
        )
    }

    /**
     * Maybe show interstitial based on action count from config
     */
    fun onUserAction(activity: Activity) {
        if (!canShowAds(activity) || !ConfigManager.isAdTypeEnabled("interstitial")) {
            return
        }

        actionCount++
        prefs.edit().putInt(KEY_ACTION_COUNT, actionCount).apply()

        val capInterstitial = ConfigManager.getAdsConfig().capInterstitial

        if (actionCount >= capInterstitial) {
            val shown = maybeShowInterstitial(activity)
            if (shown) {
                actionCount = 0 // Reset counter
                prefs.edit().putInt(KEY_ACTION_COUNT, 0).apply()
                Log.d(TAG, "📱 Interstitial shown, counter reset")
            }
        }
    }

    /**
     * Try to show interstitial if ready
     */
    private fun maybeShowInterstitial(activity: Activity): Boolean {
        val ad = interstitial ?: return false

        ad.fullScreenContentCallback = object : com.google.android.gms.ads.FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                interstitial = null
                preloadInterstitial(activity)
            }
            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                interstitial = null
                Log.e(TAG, "Interstitial show failed: ${adError.message}")
            }
            override fun onAdShowedFullScreenContent() {
                Log.d(TAG, "✅ Interstitial displayed")
            }
        }
        ad.show(activity)
        return true
    }

    /**
     * Check if ads can be shown (consent + config + premium status)
     */
    fun canShowAds(context: Context): Boolean {
        return isInitialized &&
               ConsentManager.canRequestAds(context) &&
               ConfigManager.getAdsConfig().enabled
    }

    /**
     * Check if rewarded ads are within session limit
     */
    fun canShowRewardedAd(): Boolean {
        val capRewarded = ConfigManager.getAdsConfig().capRewarded
        return sessionRewardsCount < capRewarded
    }

    /**
     * Increment session rewards count
     */
    fun onRewardedAdShown() {
        sessionRewardsCount++
        Log.d(TAG, "Rewarded ads shown this session: $sessionRewardsCount")
    }

    /**
     * Reset session counters (call on app resume)
     */
    fun resetSessionCounters() {
        sessionRewardsCount = 0
        Log.d(TAG, "Session counters reset")
    }

    /**
     * Get current action count for debugging
     */
    fun getActionCount(): Int = actionCount
}