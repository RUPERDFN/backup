# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# SECURITY & BILLING: Keep important classes from obfuscation
# Billing, Firebase and Ads (if used)
-keep class com.android.billingclient.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.firebase.** { *; }

# Methods exposed to JS in WebView
-keepclasseswithmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep TheCookFlow specific classes
-keep class com.cookflow.app.** { *; }

# Firebase App Check
-keep class com.google.firebase.appcheck.** { *; }
-keep class com.google.android.play.core.integrity.** { *; }

# AdMob and UMP (User Messaging Platform)
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.android.ump.** { *; }
-dontwarn com.google.android.gms.ads.**

# Keep our custom managers - CRITICAL for functionality
-keep class com.cookflow.app.GooglePlayBillingManager { *; }
-keep class com.cookflow.app.AdMobManager { *; }
-keep class com.cookflow.app.WebViewBridge { *; }
-keep class com.cookflow.app.AdManager { *; }
-keep class com.cookflow.app.ConsentManager { *; }

# Keep JavaScript Interface methods
-keepclassmembers class com.cookflow.app.WebViewBridge {
    @android.webkit.JavascriptInterface <methods>;
}

# Prevent obfuscation of billing-related classes
-keep class com.android.billingclient.api.** { *; }
-keepclassmembers class com.android.billingclient.api.** { *; }

# Keep AdMob interfaces
-keep interface com.google.android.gms.ads.** { *; }
-keep class com.google.android.gms.ads.rewarded.** { *; }
-keep class com.google.android.gms.ads.interstitial.** { *; }
-keep class com.google.android.gms.ads.nativead.** { *; }