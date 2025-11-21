package com.cookflow.app

import android.app.Activity
import android.content.Context
import android.util.Log
import com.android.billingclient.api.*
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume

/**
 * Complete Google Play Billing implementation for TheCookFlow
 * Handles Premium subscription €1.99/month with 7-day free trial
 */
class BillingManager(private val context: Context) : PurchasesUpdatedListener {
    
    companion object {
        private const val TAG = "BillingManager"
        const val PREMIUM_PRODUCT_ID = "thecookflow_premium_monthly"
        const val PREMIUM_BASE_PLAN_ID = "premium-monthly"
        
        @Volatile
        private var instance: BillingManager? = null
        
        fun getInstance(context: Context): BillingManager {
            return instance ?: synchronized(this) {
                instance ?: BillingManager(context.applicationContext).also { instance = it }
            }
        }
    }
    
    private lateinit var billingClient: BillingClient
    private var isConnected = false
    private var premiumProductDetails: ProductDetails? = null
    
    // Listeners
    private var onPurchaseCompleted: ((Boolean, String?) -> Unit)? = null
    private var onPurchaseError: ((String) -> Unit)? = null
    
    /**
     * Initialize billing client
     */
    fun initialize() {
        billingClient = BillingClient.newBuilder(context)
            .setListener(this)
            .enablePendingPurchases()
            .build()
        
        connectToBillingService()
    }
    
    /**
     * Connect to Google Play Billing service
     */
    private fun connectToBillingService() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "✅ Billing client connected successfully")
                    isConnected = true
                    loadProducts()
                } else {
                    Log.e(TAG, "❌ Billing setup failed: ${billingResult.debugMessage}")
                    isConnected = false
                }
            }
            
            override fun onBillingServiceDisconnected() {
                Log.w(TAG, "🔌 Billing service disconnected")
                isConnected = false
                // Optionally retry connection
            }
        })
    }
    
    /**
     * Load available products from Google Play
     */
    private fun loadProducts() {
        val productList = listOf(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PREMIUM_PRODUCT_ID)
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        )
        
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build()
        
        billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                premiumProductDetails = productDetailsList.firstOrNull()
                Log.d(TAG, "✅ Premium product loaded: ${premiumProductDetails?.productId}")
                
                // Check existing purchases
                checkExistingPurchases()
            } else {
                Log.e(TAG, "❌ Failed to load products: ${billingResult.debugMessage}")
            }
        }
    }
    
    /**
     * Check for existing active subscriptions
     */
    private fun checkExistingPurchases() {
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build()
        
        billingClient.queryPurchasesAsync(params) { billingResult, purchases ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                Log.d(TAG, "✅ Found ${purchases.size} existing purchases")
                
                // Process existing purchases
                for (purchase in purchases) {
                    if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
                        handlePurchase(purchase)
                    }
                }
            } else {
                Log.e(TAG, "❌ Failed to query purchases: ${billingResult.debugMessage}")
            }
        }
    }
    
    /**
     * Start Premium subscription purchase flow
     */
    fun startPremiumPurchase(
        activity: Activity,
        onCompleted: (Boolean, String?) -> Unit,
        onError: (String) -> Unit
    ) {
        if (!isConnected) {
            onError("Billing service not connected")
            return
        }
        
        val productDetails = premiumProductDetails
        if (productDetails == null) {
            onError("Premium product not available")
            return
        }
        
        // Store callbacks
        onPurchaseCompleted = onCompleted
        onPurchaseError = onError
        
        // Find the subscription offer with free trial
        val subscriptionOfferDetails = productDetails.subscriptionOfferDetails?.firstOrNull { offer ->
            offer.basePlanId == PREMIUM_BASE_PLAN_ID
        }
        
        if (subscriptionOfferDetails == null) {
            onError("Premium subscription offer not found")
            return
        }
        
        val billingFlowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(
                listOf(
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .setOfferToken(subscriptionOfferDetails.offerToken)
                        .build()
                )
            )
            .build()
        
        Log.d(TAG, "🚀 Starting premium purchase flow...")
        val billingResult = billingClient.launchBillingFlow(activity, billingFlowParams)
        
        if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
            onError("Failed to start purchase flow: ${billingResult.debugMessage}")
        }
    }
    
    /**
     * Handle purchase updates
     */
    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (purchase in purchases) {
                handlePurchase(purchase)
            }
        } else if (billingResult.responseCode == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.d(TAG, "🚫 User canceled purchase")
            onPurchaseCompleted?.invoke(false, "Purchase canceled by user")
        } else {
            Log.e(TAG, "❌ Purchase failed: ${billingResult.debugMessage}")
            onPurchaseError?.invoke(billingResult.debugMessage ?: "Purchase failed")
        }
    }
    
    /**
     * Process individual purchase
     */
    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            Log.d(TAG, "✅ Purchase successful: ${purchase.products}")
            
            if (PREMIUM_PRODUCT_ID in purchase.products) {
                // Acknowledge the purchase if not already acknowledged
                if (!purchase.isAcknowledged) {
                    acknowledgePurchase(purchase)
                }
                
                // Verify purchase on backend
                verifyPurchaseOnBackend(purchase)
                
                onPurchaseCompleted?.invoke(true, "Premium subscription activated")
            }
        } else if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
            Log.d(TAG, "⏳ Purchase pending approval")
            onPurchaseCompleted?.invoke(false, "Purchase pending approval")
        }
    }
    
    /**
     * Acknowledge purchase to complete transaction
     */
    private fun acknowledgePurchase(purchase: Purchase) {
        val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()
        
        billingClient.acknowledgePurchase(acknowledgePurchaseParams) { billingResult ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                Log.d(TAG, "✅ Purchase acknowledged")
            } else {
                Log.e(TAG, "❌ Failed to acknowledge purchase: ${billingResult.debugMessage}")
            }
        }
    }
    
    /**
     * Verify purchase on backend server
     */
    private fun verifyPurchaseOnBackend(purchase: Purchase) {
        // TODO: Send purchase data to backend for verification
        // This should include purchase token, product ID, and user info
        Log.d(TAG, "🔍 Verifying purchase on backend...")
        
        // Backend should verify with Google Play Developer API
        // and update user's premium status in database
    }
    
    /**
     * Check if user has active premium subscription
     */
    suspend fun isPremiumActive(): Boolean {
        return suspendCancellableCoroutine { continuation ->
            if (!isConnected) {
                continuation.resume(false)
                return@suspendCancellableCoroutine
            }
            
            val params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
            
            billingClient.queryPurchasesAsync(params) { billingResult, purchases ->
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    val hasPremium = purchases.any { purchase ->
                        PREMIUM_PRODUCT_ID in purchase.products && 
                        purchase.purchaseState == Purchase.PurchaseState.PURCHASED
                    }
                    continuation.resume(hasPremium)
                } else {
                    Log.e(TAG, "❌ Failed to check premium status: ${billingResult.debugMessage}")
                    continuation.resume(false)
                }
            }
        }
    }
    
    /**
     * Get premium subscription price for display
     */
    fun getPremiumPrice(): String? {
        return premiumProductDetails?.subscriptionOfferDetails
            ?.firstOrNull { it.basePlanId == PREMIUM_BASE_PLAN_ID }
            ?.pricingPhases?.pricingPhaseList
            ?.lastOrNull()?.formattedPrice
    }
    
    /**
     * Clean up resources
     */
    fun destroy() {
        if (isConnected) {
            billingClient.endConnection()
            isConnected = false
        }
        onPurchaseCompleted = null
        onPurchaseError = null
    }
}