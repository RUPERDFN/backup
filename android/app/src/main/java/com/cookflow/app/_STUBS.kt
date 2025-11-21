package com.cookflow.app

import android.app.Activity
import android.content.Context
import android.util.Log

/**
 * SIMPLIFIED STUBS FOR ANDROID STUDIO COMPILATION
 * Replace these with full implementations in Android Studio
 */

// AdIds moved to separate file for production configuration

// Simplified ConfigManager
object ConfigManager {
    fun getAdsConfig() = AdsConfig()
    fun isAdTypeEnabled(type: String) = true
}

data class AdsConfig(
    val enabled: Boolean = true,
    val capInterstitial: Int = 5,
    val capRewarded: Int = 3
)

// Simplified ConsentManager
object ConsentManager {
    fun canRequestAds(context: Context) = true
    fun init(activity: Activity) = Unit
}

// Simplified ApiClient
class ApiClient {
    suspend fun post(endpoint: String, data: Any) = mapOf("success" to true)
    suspend fun get(endpoint: String) = mapOf("success" to true)
}

// BillingManager now has full implementation in separate file