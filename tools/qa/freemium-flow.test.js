#!/usr/bin/env node
/**
 * TheCookFlow Freemium Flow Test Suite
 * Tests the complete freemium model: trial activation, limits, ad unlocks, conversions
 */

const axios = require('axios');
const { spawn } = require('child_process');

const API_BASE = 'http://localhost:5000/api';
const TEST_USER = {
  email: 'freemium-test@thecookflow.com',
  password: 'test123'
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, type = 'info') {
  const prefix = {
    info: `${colors.blue}[INFO]${colors.reset}`,
    success: `${colors.green}[SUCCESS]${colors.reset}`,
    error: `${colors.red}[ERROR]${colors.reset}`,
    warning: `${colors.yellow}[WARNING]${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

// Test runner class
class FreemiumFlowTester {
  constructor() {
    this.token = null;
    this.userId = null;
    this.results = [];
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runTest(name, testFn) {
    try {
      log(`Testing: ${name}`, 'info');
      await testFn();
      this.results.push({ test: name, status: 'PASSED' });
      log(`✅ ${name} - PASSED`, 'success');
      return true;
    } catch (error) {
      this.results.push({ test: name, status: 'FAILED', error: error.message });
      log(`❌ ${name} - FAILED: ${error.message}`, 'error');
      return false;
    }
  }

  // Create test user
  async createTestUser() {
    try {
      const response = await axios.post(`${API_BASE}/auth/create-demo-user`, {
        email: TEST_USER.email,
        password: TEST_USER.password
      });
      
      if (response.data.success) {
        this.userId = response.data.user?.id || 'demo-user-qa-testing';
        log(`Test user created/found: ${TEST_USER.email}`, 'success');
        return true;
      }
    } catch (error) {
      log(`Failed to create test user: ${error.message}`, 'error');
      return false;
    }
  }

  // Simulate login
  async login() {
    try {
      // For testing purposes, we'll use the userId directly
      // In production, this would be a proper auth flow
      this.token = 'test-token';
      return true;
    } catch (error) {
      log(`Login failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Test: Get initial subscription status (should be FREE)
  async testInitialStatus() {
    const response = await axios.get(`${API_BASE}/freemium/status`, {
      params: { userId: this.userId }
    });
    
    if (response.data.plan !== 'free') {
      throw new Error(`Expected plan 'free', got '${response.data.plan}'`);
    }
    
    if (response.data.trialActive) {
      throw new Error('Trial should not be active initially');
    }
    
    if (response.data.dailyMenusLimit !== 1) {
      throw new Error(`Expected daily limit 1, got ${response.data.dailyMenusLimit}`);
    }
  }

  // Test: Start 7-day trial
  async testStartTrial() {
    const response = await axios.post(`${API_BASE}/freemium/start-trial`, {
      userId: this.userId
    });
    
    if (!response.data.success) {
      throw new Error('Failed to start trial');
    }
    
    if (response.data.plan !== 'trial') {
      throw new Error(`Expected plan 'trial', got '${response.data.plan}'`);
    }
    
    if (!response.data.trialActive) {
      throw new Error('Trial should be active');
    }
    
    if (response.data.trialDaysLeft !== 7) {
      throw new Error(`Expected 7 trial days, got ${response.data.trialDaysLeft}`);
    }
  }

  // Test: Verify PRO features during trial
  async testTrialFeatures() {
    const response = await axios.get(`${API_BASE}/freemium/status`, {
      params: { userId: this.userId }
    });
    
    if (response.data.dailyMenusLimit !== 999) {
      throw new Error(`Expected unlimited menus (999), got ${response.data.dailyMenusLimit}`);
    }
    
    if (!response.data.canGenerateMenu) {
      throw new Error('Should be able to generate menus during trial');
    }
  }

  // Test: Cancel subscription
  async testCancelSubscription() {
    const response = await axios.post(`${API_BASE}/freemium/cancel`, {
      userId: this.userId
    });
    
    if (!response.data.success) {
      throw new Error('Failed to cancel subscription');
    }
    
    // Verify cancellation
    const statusResponse = await axios.get(`${API_BASE}/freemium/status`, {
      params: { userId: this.userId }
    });
    
    if (statusResponse.data.autoRenewing !== false) {
      throw new Error('Auto-renewal should be disabled after cancellation');
    }
  }

  // Test: Menu generation limits for free users
  async testFreeUserLimits() {
    // Reset to free user for testing
    await axios.post(`${API_BASE}/freemium/reset-to-free`, {
      userId: this.userId
    });
    
    const response = await axios.get(`${API_BASE}/freemium/status`, {
      params: { userId: this.userId }
    });
    
    if (response.data.plan !== 'free') {
      throw new Error('User should be on free plan');
    }
    
    if (response.data.dailyMenusUsed !== 0) {
      throw new Error('Daily menu count should start at 0');
    }
    
    // Simulate menu generation
    await axios.post(`${API_BASE}/freemium/record-generation`, {
      userId: this.userId
    });
    
    const afterGeneration = await axios.get(`${API_BASE}/freemium/status`, {
      params: { userId: this.userId }
    });
    
    if (afterGeneration.data.dailyMenusUsed !== 1) {
      throw new Error('Daily menu count should increment to 1');
    }
    
    if (afterGeneration.data.canGenerateMenu) {
      throw new Error('Should not be able to generate more menus after limit');
    }
  }

  // Test: Unlock with ad viewing
  async testAdUnlock() {
    const response = await axios.post(`${API_BASE}/freemium/unlock-after-ad`, {
      userId: this.userId
    });
    
    if (!response.data.success) {
      throw new Error('Failed to unlock with ad');
    }
    
    const statusResponse = await axios.get(`${API_BASE}/freemium/status`, {
      params: { userId: this.userId }
    });
    
    if (!statusResponse.data.canGenerateMenu) {
      throw new Error('Should be able to generate after ad unlock');
    }
  }

  // Test: Google Play purchase verification (mock)
  async testPurchaseVerification() {
    const response = await axios.post(`${API_BASE}/freemium/verify-google-play-purchase`, {
      userId: this.userId,
      purchaseToken: 'test_token_OK' // Mock token that should validate
    });
    
    if (!response.data.success) {
      throw new Error('Purchase verification failed');
    }
    
    if (response.data.plan !== 'pro') {
      throw new Error(`Expected plan 'pro' after purchase, got '${response.data.plan}'`);
    }
  }

  // Run all tests
  async runAllTests() {
    log('🚀 Starting TheCookFlow Freemium Flow Tests', 'info');
    log('=========================================', 'info');
    
    // Setup
    await this.createTestUser();
    await this.login();
    
    // Run test suite
    const tests = [
      ['Initial FREE status', () => this.testInitialStatus()],
      ['Start 7-day trial', () => this.testStartTrial()],
      ['Trial PRO features', () => this.testTrialFeatures()],
      ['Cancel subscription', () => this.testCancelSubscription()],
      ['Free user limits', () => this.testFreeUserLimits()],
      ['Ad unlock feature', () => this.testAdUnlock()],
      ['Google Play purchase', () => this.testPurchaseVerification()]
    ];
    
    for (const [name, testFn] of tests) {
      await this.runTest(name, testFn);
      await this.delay(500); // Small delay between tests
    }
    
    // Print summary
    this.printSummary();
  }

  printSummary() {
    console.log('\n=========================================');
    log('📊 Test Results Summary', 'info');
    console.log('=========================================');
    
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const total = this.results.length;
    
    this.results.forEach(result => {
      const icon = result.status === 'PASSED' ? '✅' : '❌';
      const color = result.status === 'PASSED' ? colors.green : colors.red;
      console.log(`${icon} ${color}${result.test}${colors.reset}`);
      if (result.error) {
        console.log(`   ${colors.yellow}Error: ${result.error}${colors.reset}`);
      }
    });
    
    console.log('\n=========================================');
    console.log(`Total Tests: ${total}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    
    const successRate = ((passed / total) * 100).toFixed(1);
    const rateColor = successRate >= 80 ? colors.green : successRate >= 60 ? colors.yellow : colors.red;
    console.log(`${rateColor}Success Rate: ${successRate}%${colors.reset}`);
    
    if (failed === 0) {
      console.log(`\n${colors.green}🎉 All tests passed! Freemium flow working correctly.${colors.reset}`);
    } else {
      console.log(`\n${colors.red}⚠️  Some tests failed. Please review the errors above.${colors.reset}`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const tester = new FreemiumFlowTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { FreemiumFlowTester };