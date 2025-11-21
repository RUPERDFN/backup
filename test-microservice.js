#!/usr/bin/env node
import 'dotenv/config';
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

// Test del microservicio standalone
async function testMicroservice() {
  console.log('🚀 Iniciando microservicio de monetización...');
  
  // Spawn del proceso del microservicio
  const microservice = spawn('node', ['server-microservice/index.js'], {
    env: { ...process.env, PORT: '3003' },
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let startupComplete = false;
  
  // Captura logs
  microservice.stdout.on('data', (data) => {
    const log = data.toString();
    console.log('📊', log.trim());
    if (log.includes('API listening')) {
      startupComplete = true;
    }
  });

  microservice.stderr.on('data', (data) => {
    console.error('❌', data.toString().trim());
  });

  // Espera al startup
  console.log('⏳ Esperando startup...');
  await setTimeout(3000);
  
  if (!startupComplete) {
    console.log('⚠️  Startup no completado, pero continuando pruebas...');
  }

  // Pruebas
  console.log('\n🧪 Ejecutando pruebas...');
  
  try {
    // Test 1: Health
    const healthRes = await fetch('http://localhost:3003/api/health');
    const health = await healthRes.json();
    console.log('✅ Health:', health);
    
    // Test 2: Verify
    const verifyRes = await fetch('http://localhost:3003/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'suscripcion', purchaseToken: 'TEST' })
    });
    const verify = await verifyRes.json();
    console.log('✅ Verify:', verify);
    
    // Test 3: Subscription status
    const statusRes = await fetch('http://localhost:3003/api/subscription-status?purchaseToken=TEST');
    const status = await statusRes.json();
    console.log('✅ Status:', status);
    
    console.log('\n🎉 Todos los tests pasaron!');
    
  } catch (err) {
    console.error('❌ Error en tests:', err.message);
  } finally {
    microservice.kill('SIGTERM');
    console.log('🛑 Microservicio detenido');
  }
}

testMicroservice().catch(console.error);