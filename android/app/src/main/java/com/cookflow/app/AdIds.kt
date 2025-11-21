package com.cookflow.app

/**
 * AdMob Ad Unit IDs for TheCookFlow
 * 
 * IMPORTANT: Replace TEST IDs with REAL production IDs before publishing
 * Get your real ad unit IDs from: https://admob.google.com/
 */
object AdIds {
    
    // REAL AdMob App ID for TheCookFlow
    const val ADMOB_APP_ID = "ca-app-pub-7982290772698799~6190992844" // REAL PRODUCTION ID
    
    // Banner Ad IDs - REAL PRODUCTION IDs
    const val BANNER_TEST = "ca-app-pub-3940256099942544/6300978111"
    const val BANNER_PROD = "ca-app-pub-7982290772698799/7257867786" // REAL BANNER ID
    val BANNER: String get() = if (BuildConfig.DEBUG) BANNER_TEST else BANNER_PROD
    
    // Interstitial Ad IDs - REAL PRODUCTION IDs  
    const val INTERSTITIAL_TEST = "ca-app-pub-3940256099942544/1033173712"
    const val INTERSTITIAL_PROD = "ca-app-pub-7982290772698799/8325501869" // REAL INTERSTITIAL ID
    val INTERSTITIAL: String get() = if (BuildConfig.DEBUG) INTERSTITIAL_TEST else INTERSTITIAL_PROD
    
    // Rewarded Ad IDs - Using App Open for now (implement Rewarded later)
    const val REWARDED_TEST = "ca-app-pub-3940256099942544/5224354917"
    const val REWARDED_PROD = "ca-app-pub-7982290772698799/2139367466" // APP OPEN ID (temporary for rewarded)
    val REWARDED: String get() = if (BuildConfig.DEBUG) REWARDED_TEST else REWARDED_PROD
    
    // Additional Ad Unit IDs for future implementation
    const val APP_OPEN_PROD = "ca-app-pub-7982290772698799/2139367466" // App Open Ad
    const val NATIVE_PROD = "ca-app-pub-7982290772698799/1052967761" // Native Ad
    
    /**
     * ✅ REAL AdMob IDs CONFIGURED for TheCookFlow
     * 
     * Publisher ID: ca-app-pub-7982290772698799
     * 
     * ✅ IMPLEMENTED:
     * - Banner: ca-app-pub-7982290772698799/7257867786
     * - Interstitial: ca-app-pub-7982290772698799/8325501869  
     * - App Open: ca-app-pub-7982290772698799/2139367466 (used as Rewarded temporarily)
     * 
     * 📋 TODO - IMPLEMENT IN ANDROID STUDIO:
     * - Native Ad: ca-app-pub-7982290772698799/1052967761
     * - Proper Rewarded Video Ad unit
     * - App Open Ad implementation
     */
}