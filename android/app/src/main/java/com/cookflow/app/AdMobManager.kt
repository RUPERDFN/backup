package com.cookflow.app

import android.app.Activity
import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.google.android.gms.ads.*
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.nativead.NativeAd
import com.google.android.gms.ads.nativead.NativeAdOptions
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform

class AdMobManager(
    private val context: Context,
    private val isPremiumUser: () -> Boolean
) {

    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null
    private var currentBannerAd: AdView? = null
    private var consentInformation: ConsentInformation? = null
    
    private var isConsentGiven = false
    private var isInitialized = false

    companion object {
        private const val TAG = "AdMobManager"
    }

    fun initialize(activity: Activity, onConsentComplete: () -> Unit) {
        Log.d(TAG, "Initializing AdMob...")

        // Check if premium user (premium users don't see ads)
        if (isPremiumUser()) {
            Log.d(TAG, "Premium user detected, skipping ads")
            isInitialized = true
            isConsentGiven = true // Mark as ready even if premium
            onConsentComplete()
            return
        }

        // Initialize Mobile Ads SDK
        MobileAds.initialize(context) {
            Log.d(TAG, "Mobile Ads SDK initialized")
            
            // Request GDPR consent BEFORE marking as initialized
            requestConsent(activity) {
                isInitialized = true
                onConsentComplete()
            }
        }
    }

    private fun requestConsent(activity: Activity, onComplete: () -> Unit) {
        val params = ConsentRequestParameters.Builder()
            .setTagForUnderAgeOfConsent(false)
            .build()

        consentInformation = UserMessagingPlatform.getConsentInformation(context)
        
        consentInformation?.requestConsentInfoUpdate(
            activity,
            params,
            {
                // Consent info updated successfully
                if (consentInformation?.isConsentFormAvailable == true) {
                    loadConsentForm(activity, onComplete)
                } else {
                    isConsentGiven = true
                    onComplete()
                }
            },
            { requestConsentError ->
                Log.e(TAG, "Consent request error: ${requestConsentError.message}")
                // Continue anyway - ads may be limited
                isConsentGiven = true
                onComplete()
            }
        )
    }

    private fun loadConsentForm(activity: Activity, onComplete: () -> Unit) {
        UserMessagingPlatform.loadConsentForm(
            context,
            { consentForm ->
                if (consentInformation?.consentStatus == ConsentInformation.ConsentStatus.REQUIRED) {
                    consentForm.show(activity) { formError ->
                        if (formError != null) {
                            Log.e(TAG, "Consent form error: ${formError.message}")
                        }
                        isConsentGiven = true
                        onComplete()
                    }
                } else {
                    isConsentGiven = true
                    onComplete()
                }
            },
            { formError ->
                Log.e(TAG, "Consent form load error: ${formError.message}")
                isConsentGiven = true
                onComplete()
            }
        )
    }

    fun loadBanner(container: ViewGroup): AdView? {
        if (isPremiumUser() || !isReady()) {
            Log.d(TAG, "Skipping banner: premium=${isPremiumUser()}, ready=${isReady()}")
            return null
        }

        try {
            currentBannerAd?.destroy()
            
            val adView = AdView(context).apply {
                adUnitId = BuildConfig.BANNER_AD_UNIT_ID
                setAdSize(AdSize.BANNER)
            }

            val adRequest = AdRequest.Builder().build()
            
            adView.adListener = object : AdListener() {
                override fun onAdLoaded() {
                    Log.d(TAG, "Banner ad loaded successfully")
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    Log.e(TAG, "Banner ad failed to load: ${error.message}")
                }
            }

            container.removeAllViews()
            container.addView(adView)
            adView.loadAd(adRequest)
            
            currentBannerAd = adView
            return adView
        } catch (e: Exception) {
            Log.e(TAG, "Error loading banner ad", e)
            return null
        }
    }

    fun loadInterstitial(onAdLoaded: (InterstitialAd?) -> Unit) {
        if (isPremiumUser() || !isReady()) {
            Log.d(TAG, "Skipping interstitial: premium=${isPremiumUser()}, ready=${isReady()}")
            onAdLoaded(null)
            return
        }

        val adRequest = AdRequest.Builder().build()

        InterstitialAd.load(
            context,
            BuildConfig.INTERSTITIAL_AD_UNIT_ID,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    Log.d(TAG, "Interstitial ad loaded successfully")
                    interstitialAd = ad
                    onAdLoaded(ad)
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    Log.e(TAG, "Interstitial ad failed to load: ${error.message}")
                    interstitialAd = null
                    onAdLoaded(null)
                }
            }
        )
    }

    fun showInterstitial(activity: Activity, onAdClosed: () -> Unit) {
        if (isPremiumUser()) {
            onAdClosed()
            return
        }

        if (interstitialAd != null) {
            interstitialAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    Log.d(TAG, "Interstitial ad dismissed")
                    interstitialAd = null
                    onAdClosed()
                }

                override fun onAdFailedToShowFullScreenContent(error: AdError) {
                    Log.e(TAG, "Interstitial ad failed to show: ${error.message}")
                    interstitialAd = null
                    onAdClosed()
                }

                override fun onAdShowedFullScreenContent() {
                    Log.d(TAG, "Interstitial ad showed")
                }
            }
            
            interstitialAd?.show(activity)
        } else {
            Log.d(TAG, "Interstitial ad not ready, preloading for next time")
            loadInterstitial { }
            onAdClosed()
        }
    }

    fun loadRewarded(onAdLoaded: (RewardedAd?) -> Unit) {
        if (isPremiumUser() || !isReady()) {
            Log.d(TAG, "Skipping rewarded: premium=${isPremiumUser()}, ready=${isReady()}")
            onAdLoaded(null)
            return
        }

        val adRequest = AdRequest.Builder().build()

        RewardedAd.load(
            context,
            BuildConfig.REWARDED_AD_UNIT_ID,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    Log.d(TAG, "Rewarded ad loaded successfully")
                    rewardedAd = ad
                    onAdLoaded(ad)
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    Log.e(TAG, "Rewarded ad failed to load: ${error.message}")
                    rewardedAd = null
                    onAdLoaded(null)
                }
            }
        )
    }

    fun showRewarded(activity: Activity, onRewardEarned: (Int) -> Unit, onAdClosed: () -> Unit) {
        if (isPremiumUser()) {
            onAdClosed()
            return
        }

        if (rewardedAd != null) {
            rewardedAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    Log.d(TAG, "Rewarded ad dismissed")
                    rewardedAd = null
                    onAdClosed()
                }

                override fun onAdFailedToShowFullScreenContent(error: AdError) {
                    Log.e(TAG, "Rewarded ad failed to show: ${error.message}")
                    rewardedAd = null
                    onAdClosed()
                }

                override fun onAdShowedFullScreenContent() {
                    Log.d(TAG, "Rewarded ad showed")
                }
            }

            rewardedAd?.show(activity) { rewardItem ->
                val amount = rewardItem.amount
                Log.d(TAG, "User earned reward: $amount")
                onRewardEarned(amount)
            }
        } else {
            Log.d(TAG, "Rewarded ad not ready")
            onAdClosed()
        }
    }

    fun loadNative(onAdLoaded: (NativeAd?) -> Unit) {
        if (isPremiumUser() || !isReady()) {
            Log.d(TAG, "Skipping native: premium=${isPremiumUser()}, ready=${isReady()}")
            onAdLoaded(null)
            return
        }

        val adLoader = AdLoader.Builder(context, BuildConfig.NATIVE_AD_UNIT_ID)
            .forNativeAd { nativeAd ->
                Log.d(TAG, "Native ad loaded successfully")
                onAdLoaded(nativeAd)
            }
            .withAdListener(object : AdListener() {
                override fun onAdFailedToLoad(error: LoadAdError) {
                    Log.e(TAG, "Native ad failed to load: ${error.message}")
                    onAdLoaded(null)
                }
            })
            .withNativeAdOptions(
                NativeAdOptions.Builder()
                    .setRequestMultipleImages(true)
                    .build()
            )
            .build()

        adLoader.loadAd(AdRequest.Builder().build())
    }

    fun destroyBanner() {
        currentBannerAd?.destroy()
        currentBannerAd = null
    }

    fun destroy() {
        destroyBanner()
        interstitialAd = null
        rewardedAd = null
    }

    fun isReady(): Boolean = isInitialized && isConsentGiven
}
