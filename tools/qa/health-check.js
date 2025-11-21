#!/usr/bin/env node

const base = `http://localhost:${process.env.PORT || 5000}`;

async function check(path, opts) {
  const start = Date.now();
  try {
    const r = await fetch(base + path, opts);
    const duration = Date.now() - start;
    const contentType = r.headers.get('content-type') || '';
    
    let data;
    if (contentType.includes('application/json')) {
      data = await r.json();
    } else {
      data = await r.text();
    }
    
    return { 
      ok: r.ok, 
      status: r.status,
      duration,
      data,
      isJson: contentType.includes('application/json')
    };
  } catch (err) {
    return { 
      ok: false, 
      status: 0,
      duration: Date.now() - start,
      error: err.message 
    };
  }
}

function log(test, result) {
  const icon = result.ok ? '✅' : '❌';
  const status = result.ok ? 'PASS' : 'FAIL';
  const time = `${result.duration}ms`;
  
  console.log(`${icon} [${status}] ${test.padEnd(30)} (${time})`);
  
  if (result.error) {
    console.log(`   └─ Error: ${result.error}`);
  } else if (!result.ok && result.isJson && result.data) {
    console.log(`   └─ Response: ${JSON.stringify(result.data).slice(0, 100)}`);
  }
}

(async () => {
  console.log('\n🧪 TheCookFlow Health Check - Endpoints Críticos\n');
  console.log(`📍 Base URL: ${base}\n`);
  
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  const health = await check('/api/health');
  log('Health Check', health);
  const healthValid = health.ok && health.data?.ok === true;
  healthValid ? passed++ : failed++;

  // Test 2: Google Play Billing (active)
  const verifyPro = await check('/api/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ 
      productId: 'suscripcion',
      purchaseToken: 'valid-active-token' 
    })
  });
  log('Google Play Verify (active)', verifyPro);
  const proValid = verifyPro.ok && verifyPro.data?.active !== undefined;
  proValid ? passed++ : failed++;

  // Test 3: Google Play Billing (test token)
  const verifyFree = await check('/api/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ 
      productId: 'suscripcion',
      purchaseToken: 'TEST' 
    })
  });
  log('Google Play Verify (test)', verifyFree);
  const freeValid = verifyFree.ok && verifyFree.data?.active === false;
  freeValid ? passed++ : failed++;

  // Test 4: Subscription Status (accept 401 or valid response)
  const status = await check('/api/subscription/status');
  // Custom logging for auth-required endpoints
  if (status.status === 401) {
    console.log(`✅ [PASS] Subscription Status             (${status.duration}ms)`);
    console.log(`   └─ Auth required (expected for unauthenticated request)`);
    passed++;
  } else {
    log('Subscription Status', status);
    status.ok ? passed++ : failed++;
  }

  // Test 5: Menu Generation AI
  const menu = await check('/api/menu/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      dietaryPreferences: ['vegetarian'],
      servings: 2,
      budget: 'medium',
      useMock: true // Use mock AI for faster testing
    })
  });
  log('Menu Generation AI', menu);
  menu.ok ? passed++ : failed++;

  // Test 6: Chef AI Chat
  const chef = await check('/api/chef', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message: '¿Cómo cocino pasta al dente?',
      useMock: true
    })
  });
  log('Chef AI Chat', chef);
  chef.ok ? passed++ : failed++;

  // Test 7: Vision/Fridge Analysis
  const vision = await check('/api/vision/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'data:image/png;base64,mock',
      useMock: true
    })
  });
  log('Vision Fridge Analysis', vision);
  vision.ok ? passed++ : failed++;

  // Test 8: Amazon Cart Integration
  const amazon = await check('/api/amazon/cart', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      items: [
        { name: 'Tomate', quantity: 500 }
      ]
    })
  });
  log('Amazon Cart Integration', amazon);
  amazon.ok ? passed++ : failed++;

  // Test 9: QA Smoke Suite (meta-test)
  const smoke = await check('/api/qa/smoke');
  log('QA Smoke Test Suite', smoke);
  smoke.ok ? passed++ : failed++;

  // Summary
  const total = passed + failed;
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
  
  console.log('\n' + '═'.repeat(50));
  console.log(`📊 Resumen: ${passed}/${total} tests passed (${percentage}%)`);
  console.log(`   Desglose: ${passed} passed + ${failed} failed = ${total} total`);
  console.log('═'.repeat(50) + '\n');

  if (failed > 0) {
    console.log(`❌ ${failed} test(s) failed\n`);
    process.exit(1);
  } else {
    console.log('✅ All tests passed!\n');
    process.exit(0);
  }
})().catch(err => {
  console.error('\n💥 Fatal error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
