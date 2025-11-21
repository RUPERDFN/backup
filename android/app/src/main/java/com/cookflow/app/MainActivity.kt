package com.cookflow.app

import android.annotation.SuppressLint
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.*
import android.widget.FrameLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.cookflow.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    
    // Managers
    private lateinit var billingManager: GooglePlayBillingManager
    private lateinit var adMobManager: AdMobManager
    private lateinit var webViewBridge: WebViewBridge
    
    // State
    private var isPremium: Boolean = false
    private var pageCountSinceAd = 0
    private val adFrequency = 3 // Show ad every 3 page loads for free users
    
    companion object {
        private const val TAG = "MainActivity"
        private const val BASE_URL = "https://thecookflow.com"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Initialize managers first
        initializeManagers()
        
        // Setup WebView
        setupWebView()
        
        // Setup refresh
        setupSwipeRefresh()
        
        // Initialize ads with GDPR consent
        initializeAds()
        
        // Load main URL
        loadUrl(BASE_URL)
        
        Log.d(TAG, "✅ MainActivity initialized successfully")
    }

    private fun initializeManagers() {
        Log.d(TAG, "🔧 Initializing managers...")
        
        try {
            // Initialize Billing Manager
            billingManager = GooglePlayBillingManager(this) { isPremiumNow ->
                isPremium = isPremiumNow
                onPremiumStatusChanged(isPremiumNow)
            }
            billingManager.initialize()
            
            // Initialize AdMob Manager
            adMobManager = AdMobManager(this) { 
                billingManager.isPremiumUser() 
            }
            
            Log.d(TAG, "✅ Managers initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Managers initialization failed: ${e.message}", e)
        }
    }

    private fun setupWebView() {
        webView = binding.webView
        
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = true
            setSupportZoom(true)
            builtInZoomControls = false
            displayZoomControls = false
            
            // Mobile optimization
            useWideViewPort = true
            loadWithOverviewMode = true
            
            // Security settings
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            safeBrowsingEnabled = true
        }
        
        // Setup WebView Bridge
        webViewBridge = WebViewBridge(this, webView, billingManager, adMobManager)
        
        // Add JavaScript interfaces
        webView.addJavascriptInterface(webViewBridge, WebViewBridge.INTERFACE_NAME)
        webView.addJavascriptInterface(webViewBridge, WebViewBridge.ADMOB_INTERFACE_NAME)
        
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (url.contains("thecookflow.com") || url.contains("replit.app")) {
                        view?.loadUrl(url)
                        return true
                    } else {
                        // External links open in browser
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    }
                }
                
                return false
            }
            
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                swipeRefreshLayout.isRefreshing = true
            }
            
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefreshLayout.isRefreshing = false
                
                // Inject bridge script
                webViewBridge.injectBridgeScript()
                
                // Check if we should show an interstitial ad
                pageCountSinceAd++
                if (!isPremium && pageCountSinceAd >= adFrequency) {
                    showInterstitialAdIfReady()
                    pageCountSinceAd = 0
                }
                
                // Load banner ad if not premium
                if (!isPremium) {
                    loadBannerAd()
                }
                
                Log.d(TAG, "✅ Page loaded: $url")
            }
            
            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                swipeRefreshLayout.isRefreshing = false
                
                Log.e(TAG, "❌ WebView error: ${error?.description}")
                
                // Show error message
                Toast.makeText(this@MainActivity, "Error de conexión", Toast.LENGTH_SHORT).show()
            }
        }
        
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                // Progress indicator handled by SwipeRefreshLayout
            }
            
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                consoleMessage?.let {
                    Log.d(TAG, "WebView Console: ${it.message()} (${it.sourceId()}:${it.lineNumber()})")
                }
                return super.onConsoleMessage(consoleMessage)
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        swipeRefreshLayout = binding.swipeRefreshLayout
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }
    }
    
    private fun initializeAds() {
        if (isPremium) {
            Log.d(TAG, "User is premium, skipping ads initialization")
            return
        }
        
        adMobManager.initialize(this) {
            Log.d(TAG, "✅ AdMob initialized with GDPR consent")
            
            // Preload interstitial ad
            adMobManager.loadInterstitial { ad ->
                if (ad != null) {
                    Log.d(TAG, "Interstitial ad preloaded successfully")
                }
            }
            
            // Preload rewarded ad
            adMobManager.loadRewarded { ad ->
                if (ad != null) {
                    Log.d(TAG, "Rewarded ad preloaded successfully")
                }
            }
        }
    }
    
    private fun loadBannerAd() {
        val bannerContainer = binding.bannerContainer
        
        if (isPremium) {
            bannerContainer.visibility = View.GONE
            return
        }
        
        bannerContainer.visibility = View.VISIBLE
        adMobManager.loadBanner(bannerContainer)
    }
    
    private fun showInterstitialAdIfReady() {
        adMobManager.loadInterstitial { ad ->
            if (ad != null) {
                adMobManager.showInterstitial(this) {
                    Log.d(TAG, "Interstitial ad closed, preloading next one")
                    pageCountSinceAd = 0 // Reset counter after showing ad
                    // Preload next interstitial
                    adMobManager.loadInterstitial { }
                }
            } else {
                Log.d(TAG, "Interstitial not ready, will try on next page")
                pageCountSinceAd = 0 // Reset to try again soon
            }
        }
    }
    
    private fun onPremiumStatusChanged(isPremiumNow: Boolean) {
        Log.d(TAG, "Premium status changed: $isPremiumNow")
        
        runOnUiThread {
            if (isPremiumNow) {
                // Hide ads
                binding.bannerContainer.visibility = View.GONE
                adMobManager.destroyBanner()
            } else {
                // Show ads
                loadBannerAd()
            }
            
            // Notify WebView
            webViewBridge.notifyPremiumStatusChanged(isPremiumNow)
        }
    }
    
    private fun loadUrl(url: String) {
        try {
            webView.loadUrl(url)
            Log.d(TAG, "🌐 Loading URL: $url")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to load URL: ${e.message}")
            Toast.makeText(this, "Error al cargar la aplicación", Toast.LENGTH_LONG).show()
        }
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
    
    override fun onResume() {
        super.onResume()
        
        // Refresh premium status when app comes to foreground
        if (::billingManager.isInitialized) {
            billingManager.checkPremiumStatus()
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        
        // Clean up
        if (::adMobManager.isInitialized) {
            adMobManager.destroy()
        }
        
        if (::billingManager.isInitialized) {
            billingManager.destroy()
        }
        
        webView.destroy()
    }
    
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        Log.d(TAG, "📱 Configuration changed: ${newConfig.orientation}")
    }
}
