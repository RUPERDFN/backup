package com.cookflow.app

import android.app.Activity
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONObject

class WebViewBridge(
    private val activity: Activity,
    private val webView: WebView,
    private val billingManager: GooglePlayBillingManager,
    private val adMobManager: AdMobManager
) {

    companion object {
        private const val TAG = "WebViewBridge"
        const val INTERFACE_NAME = "Android"
        const val ADMOB_INTERFACE_NAME = "TCFAdMob"
    }

    // ============================================
    // ANDROID INTERFACE (window.Android)
    // ============================================

    @JavascriptInterface
    fun getUserId(): String {
        Log.d(TAG, "getUserId() called from JavaScript")
        val prefs = activity.getSharedPreferences("app_prefs", android.content.Context.MODE_PRIVATE)
        val userId = prefs.getString("user_id", null)
        
        if (userId != null) {
            Log.d(TAG, "Returning stored userId: $userId")
            return userId
        }
        
        // Generate temporary ID if not authenticated
        val tempId = "android_user_${System.currentTimeMillis()}"
        Log.d(TAG, "No userId stored, returning temp ID: $tempId")
        return tempId
    }
    
    @JavascriptInterface
    fun setUserId(userId: String) {
        Log.d(TAG, "setUserId() called from JavaScript with userId: $userId")
        
        if (userId.isNotEmpty()) {
            val prefs = activity.getSharedPreferences("app_prefs", android.content.Context.MODE_PRIVATE)
            prefs.edit().putString("user_id", userId).apply()
            Log.d(TAG, "UserId saved to preferences")
        }
    }

    @JavascriptInterface
    fun isPremium(): Boolean {
        val isPremium = billingManager.isPremiumUser()
        Log.d(TAG, "isPremium() called from JavaScript: $isPremium")
        return isPremium
    }

    @JavascriptInterface
    fun getSubscriptionStatus(): String {
        val status = if (billingManager.isPremiumUser()) "premium" else "free"
        Log.d(TAG, "getSubscriptionStatus() called from JavaScript: $status")
        
        val json = JSONObject().apply {
            put("status", status)
            put("isPremium", billingManager.isPremiumUser())
            put("platform", "android")
        }
        
        return json.toString()
    }

    @JavascriptInterface
    fun purchasePremium(planType: String = "monthly") {
        Log.d(TAG, "purchasePremium() called from JavaScript with plan: $planType")
        
        activity.runOnUiThread {
            val isMonthly = planType.lowercase() == "monthly"
            billingManager.launchPurchaseFlow(activity, isMonthly)
        }
    }

    @JavascriptInterface
    fun openSubscriptionSettings() {
        Log.d(TAG, "openSubscriptionSettings() called from JavaScript")
        
        activity.runOnUiThread {
            // Open Google Play subscription settings
            try {
                val intent = android.content.Intent(android.content.Intent.ACTION_VIEW).apply {
                    data = android.net.Uri.parse(
                        "https://play.google.com/store/account/subscriptions"
                    )
                }
                activity.startActivity(intent)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to open subscription settings", e)
                notifyJavaScript("error", "Failed to open subscription settings")
            }
        }
    }

    @JavascriptInterface
    fun refreshPremiumStatus() {
        Log.d(TAG, "refreshPremiumStatus() called from JavaScript")
        billingManager.checkPremiumStatus()
    }

    // ============================================
    // ADMOB INTERFACE (window.TCFAdMob)
    // ============================================

    @JavascriptInterface
    fun showInterstitial() {
        Log.d(TAG, "showInterstitial() called from JavaScript")
        
        if (billingManager.isPremiumUser()) {
            Log.d(TAG, "User is premium, skipping interstitial ad")
            notifyJavaScript("adClosed", "premium_user")
            return
        }

        activity.runOnUiThread {
            adMobManager.showInterstitial(activity) {
                notifyJavaScript("adClosed", "interstitial")
            }
        }
    }

    @JavascriptInterface
    fun showRewarded(rewardType: String = "menu_unlock") {
        Log.d(TAG, "showRewarded() called from JavaScript for: $rewardType")
        
        if (billingManager.isPremiumUser()) {
            Log.d(TAG, "User is premium, granting reward directly")
            notifyJavaScript("rewardEarned", JSONObject().apply {
                put("type", rewardType)
                put("amount", 1)
                put("source", "premium")
            }.toString())
            return
        }

        activity.runOnUiThread {
            adMobManager.showRewarded(
                activity,
                onRewardEarned = { amount ->
                    val rewardData = JSONObject().apply {
                        put("type", rewardType)
                        put("amount", amount)
                        put("source", "ad")
                    }
                    notifyJavaScript("rewardEarned", rewardData.toString())
                },
                onAdClosed = {
                    notifyJavaScript("adClosed", "rewarded")
                }
            )
        }
    }

    @JavascriptInterface
    fun loadBanner(): Boolean {
        Log.d(TAG, "loadBanner() called from JavaScript")
        
        if (billingManager.isPremiumUser()) {
            Log.d(TAG, "User is premium, skipping banner")
            return false
        }

        // Banner loading is handled in MainActivity
        // This is just a signal to JavaScript
        return true
    }

    @JavascriptInterface
    fun isAdReady(adType: String): Boolean {
        val ready = when (adType.lowercase()) {
            "banner", "interstitial", "rewarded" -> adMobManager.isReady()
            else -> false
        }
        
        Log.d(TAG, "isAdReady($adType) called from JavaScript: $ready")
        return ready
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private fun notifyJavaScript(event: String, data: String) {
        activity.runOnUiThread {
            val script = """
                if (window.AndroidBridge && window.AndroidBridge.handleEvent) {
                    window.AndroidBridge.handleEvent('$event', '$data');
                } else if (window.tcf && window.tcf.handleNativeEvent) {
                    window.tcf.handleNativeEvent('$event', '$data');
                }
            """.trimIndent()
            
            webView.evaluateJavascript(script) { result ->
                Log.d(TAG, "Notified JavaScript: $event -> $data (result: $result)")
            }
        }
    }

    fun notifyPremiumStatusChanged(isPremium: Boolean) {
        val status = if (isPremium) "premium" else "free"
        notifyJavaScript("premiumStatusChanged", status)
    }

    fun injectBridgeScript() {
        val script = """
            (function() {
                console.log('[TCF Bridge] Initializing Android bridge...');
                
                // Create bridge object if it doesn't exist
                window.AndroidBridge = window.AndroidBridge || {
                    events: {},
                    on: function(event, callback) {
                        this.events[event] = callback;
                    },
                    handleEvent: function(event, data) {
                        if (this.events[event]) {
                            this.events[event](data);
                        }
                    }
                };
                
                // Alias for compatibility
                window.tcf = window.tcf || {};
                window.tcf.handleNativeEvent = function(event, data) {
                    window.AndroidBridge.handleEvent(event, data);
                };
                
                console.log('[TCF Bridge] Android bridge ready');
                console.log('[TCF Bridge] Available: window.Android, window.TCFAdMob');
            })();
        """.trimIndent()

        activity.runOnUiThread {
            webView.evaluateJavascript(script, null)
        }
    }
}
