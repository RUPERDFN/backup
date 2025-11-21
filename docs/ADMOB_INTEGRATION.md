# AdMob Integration Guide for TheCookFlow

## Production Ad Unit IDs

```
Publisher ID: ca-app-pub-7982290772698799
Banner:       ca-app-pub-7982290772698799/7257867786
App Open:     ca-app-pub-7982290772698799/2139367466
Interstitial: ca-app-pub-7982290772698799/8325501869
Native:       ca-app-pub-7982290772698799/1052967761
```

## Android App Setup

### 1. Add AdMob Dependencies (build.gradle)

```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
}
```

### 2. Add AdMob App ID (AndroidManifest.xml)

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-7982290772698799~9874678193"/>
```

### 3. Initialize AdMob in MainActivity

```kotlin
// Initialize AdMob
MobileAds.initialize(this) { }

// Add JavaScript interface for ads
webView.addJavascriptInterface(AdMobBridge(this), "Android")
```

### 4. Create AdMob Bridge Class

```kotlin
class AdMobBridge(private val activity: Activity) {
    
    @JavascriptInterface
    fun initializeAds(adIdsJson: String) {
        // Parse ad IDs and initialize
    }
    
    @JavascriptInterface
    fun loadBannerAd(adUnitId: String, position: String) {
        activity.runOnUiThread {
            val adView = AdView(activity)
            adView.adUnitId = adUnitId
            adView.setAdSize(AdSize.SMART_BANNER)
            
            val adRequest = AdRequest.Builder().build()
            adView.loadAd(adRequest)
        }
    }
    
    @JavascriptInterface
    fun loadInterstitialAd(adUnitId: String) {
        InterstitialAd.load(activity, adUnitId, 
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    ad.show(activity)
                }
            }
        )
    }
}
```

## Web App Integration

### 1. Include AdMob Script

The script is automatically loaded from `/admob-integration.js`

### 2. React Component Usage

```tsx
import { useAdMob } from '@/hooks/useAdMob';

function MyComponent() {
  const { showInterstitialAd, showRewardedAdForUnlock } = useAdMob();
  
  // Show interstitial after action
  const handleMenuGeneration = async () => {
    // Generate menu...
    showInterstitialAd((shown) => {
      console.log('Ad shown:', shown);
    });
  };
  
  // Show rewarded ad for unlock
  const handleUnlock = async () => {
    const success = await showRewardedAdForUnlock();
    if (success) {
      // User watched ad, unlock feature
    }
  };
}
```

### 3. Ad Components

#### Banner Ad
```tsx
import { AdBanner } from '@/components/ads/AdBanner';

<AdBanner position="bottom" />
```

#### Native Ad
```tsx
import { AdNative } from '@/components/ads/AdNative';

<AdNative variant="recipe" />
```

## Freemium Flow Integration

### 1. Daily Limits
- Free users: 1 menu generation per day
- Watch ad: Unlock 1 additional generation
- Premium: Unlimited generations

### 2. Ad Display Rules
- Never show ads to premium users
- Require GDPR consent before showing ads
- Interstitial cooldown: 5 minutes
- App open ad cooldown: 60 minutes

### 3. Ad Placement Strategy
- **Banner**: Bottom of screen on main pages
- **Interstitial**: After menu generation (with cooldown)
- **Native**: In recipe lists and feed
- **App Open**: On cold start and resume

## Testing

### Test Device Setup

Add test device IDs in `admob.ts`:

```typescript
consent: {
  testDeviceIds: [
    'YOUR_TEST_DEVICE_ID_HERE'
  ]
}
```

### Test Mode

Set `testMode: true` in `admob.ts` during development:

```typescript
testMode: true, // Enable test ads
```

## Revenue Optimization

### Best Practices
1. **Don't overwhelm users** - Limit ad frequency
2. **Strategic placement** - Show ads at natural breaks
3. **Reward engagement** - Use rewarded ads for unlocks
4. **Monitor performance** - Track CTR and revenue

### Expected Revenue
- Banner: €0.10-0.50 CPM
- Interstitial: €1-3 CPM  
- Native: €0.50-1.50 CPM
- App Open: €2-5 CPM

## Compliance

### GDPR Requirements
1. Request consent before showing ads
2. Provide privacy policy link
3. Allow users to change consent
4. Respect user's choice

### Google Play Policies
1. Clearly disclose ads in app description
2. Don't place ads near interactive elements
3. Don't show ads during app startup
4. Follow AdMob content policies

## Troubleshooting

### Ads Not Showing
1. Check GDPR consent status
2. Verify user is not premium
3. Check internet connection
4. Ensure ad unit IDs are correct
5. Check for rate limiting/cooldown

### Low Revenue
1. Optimize ad placement
2. Increase user engagement
3. Use mediation for better fill rates
4. Monitor and block low-performing ads

### Implementation Issues
1. Ensure AdMob SDK is updated
2. Check ProGuard rules
3. Verify manifest configuration
4. Test on real devices