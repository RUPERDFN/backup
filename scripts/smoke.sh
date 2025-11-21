#!/bin/bash

echo "🔥 TheCookFlow - Google Play Billing Smoke Tests"
echo "================================================"

# Get the current URL (works in Replit)
if [ ! -z "$REPL_SLUG" ] && [ ! -z "$REPL_OWNER" ]; then
    BASE_URL="https://${REPL_SLUG}.${REPL_OWNER}.replit.app"
else
    BASE_URL="http://localhost:5000"
fi

echo "Testing endpoints on: $BASE_URL"
echo ""

# Test 1: Health check
echo "1. Testing /api/health..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi
echo ""

# Test 2: Verify endpoint with test token
echo "2. Testing /api/verify with TEST token..."
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/verify" \
    -H "Content-Type: application/json" \
    -d '{"productId":"suscripcion","purchaseToken":"TEST"}')
echo "Response: $VERIFY_RESPONSE"

if echo "$VERIFY_RESPONSE" | grep -q '"active":false'; then
    echo "✅ Verify endpoint with TEST token passed"
else
    echo "❌ Verify endpoint with TEST token failed"
fi
echo ""

# Test 3: Verify endpoint with invalid productId (should fail validation)
echo "3. Testing /api/verify with invalid productId..."
INVALID_RESPONSE=$(curl -s -X POST "$BASE_URL/api/verify" \
    -H "Content-Type: application/json" \
    -d '{"productId":"invalid","purchaseToken":"TEST"}')
echo "Response: $INVALID_RESPONSE"

if echo "$INVALID_RESPONSE" | grep -q '"error".*"Validation error"'; then
    echo "✅ Validation error correctly returned"
else
    echo "❌ Validation should have failed"
fi
echo ""

# Test 4: Subscription status endpoint
echo "4. Testing /api/subscription-status with TEST token..."
STATUS_RESPONSE=$(curl -s "$BASE_URL/api/subscription-status?purchaseToken=TEST")
echo "Response: $STATUS_RESPONSE"

if echo "$STATUS_RESPONSE" | grep -q '"active":false'; then
    echo "✅ Subscription status endpoint with TEST token passed"
else
    echo "❌ Subscription status endpoint with TEST token failed"
fi
echo ""

# Test 5: Missing parameters
echo "5. Testing /api/verify with missing parameters..."
MISSING_RESPONSE=$(curl -s -X POST "$BASE_URL/api/verify" \
    -H "Content-Type: application/json" \
    -d '{}')
echo "Response: $MISSING_RESPONSE"

if echo "$MISSING_RESPONSE" | grep -q '"error"'; then
    echo "✅ Missing parameters correctly handled"
else
    echo "❌ Missing parameters should return error"
fi
echo ""

echo "🏁 Smoke tests completed!"
echo ""
echo "Instructions for testing from Replit Webview:"
echo "1. Open the Webview tab"
echo "2. Navigate to $BASE_URL/api/health"
echo "3. You should see: {\"ok\":true,\"env\":\"replit\",...}"
echo ""
echo "For manual testing with real purchase tokens:"
echo "curl -X POST $BASE_URL/api/verify -H 'Content-Type: application/json' -d '{\"productId\":\"suscripcion\",\"purchaseToken\":\"YOUR_REAL_TOKEN\"}'"