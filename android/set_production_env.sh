#!/bin/bash

# TheCookFlow - Production AdMob Environment Variables
# Run this script before building release version

echo "🎯 Setting TheCookFlow Production AdMob IDs..."

# Production AdMob IDs
export ADMOB_APP_ID="ca-app-pub-7982290772698799~1854089866"
export ADMOB_BANNER_ID="ca-app-pub-7982290772698799/7257867786"
export ADMOB_INTERSTITIAL_ID="ca-app-pub-7982290772698799/8325501869"
export ADMOB_APP_OPEN_ID="ca-app-pub-7982290772698799/2139367466"

echo "✅ Production environment variables set:"
echo "   BANNER: $ADMOB_BANNER_ID"
echo "   INTERSTITIAL: $ADMOB_INTERSTITIAL_ID"
echo "   APP_OPEN: $ADMOB_APP_OPEN_ID"
echo ""
echo "🚀 Ready to build release version with:"
echo "   ./gradlew clean :app:bundleRelease"
echo ""
echo "💡 For debug builds, test IDs will be used automatically"