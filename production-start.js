#!/usr/bin/env node

// Production startup script with path fixes
import { fileURLToPath } from 'url';
import path from 'path';

// Fix import.meta.dirname for production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment variables before importing the main server
process.env.INIT_CWD = process.env.INIT_CWD || __dirname;
process.env.SERVER_DIR = process.env.SERVER_DIR || path.join(__dirname, 'dist');
process.env.ROOT_DIR = process.env.ROOT_DIR || __dirname;
process.env.DIST_PATH = process.env.DIST_PATH || path.join(__dirname, 'dist', 'public');

// Polyfill import.meta.dirname for compatibility
if (typeof globalThis !== 'undefined' && !globalThis.importMetaDirname) {
  Object.defineProperty(globalThis, 'importMetaDirname', {
    get() {
      return __dirname;
    },
    configurable: true
  });
}

console.log('🚀 Starting TheCookFlow in production mode...');
console.log('📁 Working directory:', __dirname);
console.log('📦 Dist path:', process.env.DIST_PATH);

// Import and start the main server
import('./dist/index.js');