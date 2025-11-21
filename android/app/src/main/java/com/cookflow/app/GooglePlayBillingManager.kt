package com.cookflow.app

import android.app.Activity
import android.content.Context
import android.util.Log
import com.android.billingclient.api.*
import kotlinx.coroutines.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class GooglePlayBillingManager(
    private val context: Context,
    private val onPremiumStatusChanged: (Boolean) -> Unit
) : PurchasesUpdatedListener {

    private var billingClient: BillingClient? = null
    private var isPremium = false
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private val httpClient = OkHttpClient()

    companion object {
        private const val TAG = "BillingManager"
        private const val MONTHLY_SKU = "premium_monthly"
        private const val YEARLY_SKU = "premium_yearly"
        private const val BACKEND_URL = "https://thecookflow.replit.app" // Update if using custom domain
        
        // Trial configuration
        const val TRIAL_DAYS = 7
        const val MONTHLY_PRICE_EUROS = "1.99"
    }

    fun initialize() {
        Log.d(TAG, "Initializing Google Play Billing...")
        
        billingClient = BillingClient.newBuilder(context)
            .setListener(this)
            .enablePendingPurchases()
            .build()

        billingClient?.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "Billing client connected successfully")
                    checkPremiumStatus()
                } else {
                    Log.e(TAG, "Billing setup failed: ${billingResult.debugMessage}")
                }
            }

            override fun onBillingServiceDisconnected() {
                Log.w(TAG, "Billing service disconnected. Attempting to reconnect...")
                // Retry connection
                scope.launch {
                    delay(1000)
                    billingClient?.startConnection(this@GooglePlayBillingManager)
                }
            }
        })
    }

    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        when (billingResult.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                purchases?.forEach { purchase ->
                    handlePurchase(purchase)
                }
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                Log.d(TAG, "User canceled the purchase")
            }
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                Log.d(TAG, "User already owns this item")
                checkPremiumStatus()
            }
            else -> {
                Log.e(TAG, "Purchase failed: ${billingResult.debugMessage}")
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        scope.launch {
            try {
                if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
                    // Verify purchase on backend
                    val isValid = verifyPurchaseOnBackend(purchase)
                    
                    if (isValid && !purchase.isAcknowledged) {
                        acknowledgePurchase(purchase)
                    }
                    
                    if (isValid) {
                        isPremium = true
                        onPremiumStatusChanged(true)
                        Log.d(TAG, "Premium activated successfully")
                    }
                } else if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
                    Log.d(TAG, "Purchase pending, waiting for completion")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error handling purchase", e)
            }
        }
    }

    private suspend fun acknowledgePurchase(purchase: Purchase) {
        withContext(Dispatchers.IO) {
            val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.purchaseToken)
                .build()

            billingClient?.acknowledgePurchase(acknowledgePurchaseParams) { billingResult ->
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "Purchase acknowledged successfully")
                } else {
                    Log.e(TAG, "Failed to acknowledge purchase: ${billingResult.debugMessage}")
                }
            }
        }
    }

    private suspend fun verifyPurchaseOnBackend(purchase: Purchase): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                // Get userId from WebViewBridge if available
                val userId = getUserIdFromWebView()
                
                // Get productId/subscriptionId from purchase
                val productId = purchase.products.firstOrNull() ?: ""
                
                val json = JSONObject().apply {
                    if (userId != null) {
                        put("userId", userId)
                    }
                    put("purchaseToken", purchase.purchaseToken)
                    put("productId", productId)
                    put("subscriptionId", productId) // For subscriptions, productId == subscriptionId
                }
                
                val requestBody = json.toString()
                    .toRequestBody("application/json; charset=utf-8".toMediaType())
                
                val request = Request.Builder()
                    .url("$BACKEND_URL/api/freemium/verify-google-play-purchase")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Verifying purchase with backend: productId=$productId, token=${purchase.purchaseToken.take(10)}...")
                
                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                
                if (response.isSuccessful) {
                    val jsonResponse = JSONObject(responseBody)
                    val success = jsonResponse.optBoolean("success", false)
                    val active = jsonResponse.optBoolean("active", false)
                    
                    Log.d(TAG, "Backend verification result: success=$success, active=$active")
                    return@withContext success && active
                } else {
                    Log.e(TAG, "Backend verification failed: ${response.code} - $responseBody")
                    return@withContext false
                }
            } catch (e: IOException) {
                Log.e(TAG, "Network error during backend verification", e)
                false
            } catch (e: Exception) {
                Log.e(TAG, "Error verifying purchase on backend", e)
                false
            }
        }
    }
    
    private fun getUserIdFromWebView(): String? {
        return try {
            // This will be set by WebViewBridge when user logs in
            context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
                .getString("user_id", null)
        } catch (e: Exception) {
            Log.w(TAG, "Could not get userId from preferences", e)
            null
        }
    }

    fun checkPremiumStatus() {
        scope.launch {
            try {
                val params = QueryPurchasesParams.newBuilder()
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build()

                val purchasesResult = withContext(Dispatchers.IO) {
                    billingClient?.queryPurchasesAsync(params)
                }

                val activePurchases = purchasesResult?.purchasesList?.filter { purchase ->
                    purchase.purchaseState == Purchase.PurchaseState.PURCHASED
                }

                val hasPremium = !activePurchases.isNullOrEmpty()
                isPremium = hasPremium
                onPremiumStatusChanged(hasPremium)
                
                Log.d(TAG, "Premium status checked: isPremium=$hasPremium")
            } catch (e: Exception) {
                Log.e(TAG, "Error checking premium status", e)
            }
        }
    }

    fun launchPurchaseFlow(activity: Activity, isMonthly: Boolean = true) {
        scope.launch {
            try {
                val productId = if (isMonthly) MONTHLY_SKU else YEARLY_SKU
                
                val productList = listOf(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build()
                )

                val params = QueryProductDetailsParams.newBuilder()
                    .setProductList(productList)
                    .build()

                val productDetailsResult = withContext(Dispatchers.IO) {
                    billingClient?.queryProductDetails(params)
                }

                val productDetails = productDetailsResult?.productDetailsList?.firstOrNull()

                if (productDetails != null) {
                    // Find trial offer first, fallback to regular subscription
                    val offerDetails = productDetails.subscriptionOfferDetails
                    
                    // Priority: Trial offer > Regular offer
                    val selectedOffer = offerDetails?.find { 
                        it.pricingPhases.pricingPhaseList.any { phase ->
                            phase.priceAmountMicros == 0L // Free trial phase
                        }
                    } ?: offerDetails?.firstOrNull()
                    
                    val offerToken = selectedOffer?.offerToken
                    
                    if (offerToken != null) {
                        Log.d(TAG, "Using offer: ${selectedOffer.offerId ?: "default"}")
                        
                        val productDetailsParamsList = listOf(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                .setProductDetails(productDetails)
                                .setOfferToken(offerToken)
                                .build()
                        )

                        val billingFlowParams = BillingFlowParams.newBuilder()
                            .setProductDetailsParamsList(productDetailsParamsList)
                            .build()

                        withContext(Dispatchers.Main) {
                            val result = billingClient?.launchBillingFlow(activity, billingFlowParams)
                            if (result?.responseCode != BillingClient.BillingResponseCode.OK) {
                                Log.e(TAG, "Billing flow error: ${result?.debugMessage}")
                            }
                        }
                        
                        Log.d(TAG, "Billing flow launched for $productId with trial")
                    } else {
                        Log.e(TAG, "No offer token found for product")
                    }
                } else {
                    Log.e(TAG, "Product details not found for $productId. Configure in Play Console.")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error launching purchase flow", e)
            }
        }
    }

    fun isPremiumUser(): Boolean = isPremium

    fun destroy() {
        scope.cancel()
        billingClient?.endConnection()
        billingClient = null
    }
}
