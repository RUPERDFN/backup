#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://localhost:3000}"

echo "[1/3] Health..."
curl -sf "$BASE/api/health" | grep -q '"ok":true' && echo "✅ /api/health OK" || (echo "❌ /api/health FAIL"; exit 1)

echo "[2/3] Verify (token dummy)..."
RES=$(curl -sf -X POST "$BASE/api/verify" -H 'Content-Type: application/json' \
  -d '{"productId":"suscripcion","purchaseToken":"TEST"}' || true)
echo "$RES" | grep -q '"ok":true' && echo "✅ /api/verify responde" || echo "⚠️ /api/verify no responde OK (revisa logs)"

echo "[3/3] Subscription status..."
RES2=$(curl -sf "$BASE/api/subscription-status?purchaseToken=TEST" || true)
echo "$RES2" | grep -q '"ok":true' && echo "✅ /api/subscription-status OK" || echo "⚠️ /api/subscription-status issue"

echo "Smoke done."