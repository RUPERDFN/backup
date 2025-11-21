#!/usr/bin/env node

/**
 * Cleanup Script for TheCookFlow
 * Removes build artifacts, caches, and temporary files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const CLEANUP_TARGETS = [
  // Build artifacts
  'dist',
  'build',
  '.next',
  '.turbo',
  
  // Android build artifacts
  'android/build',
  'android/.gradle',
  'android/app/build',
  'android/app/.gradle',
  
  // Cache directories (excluding Replit's)
  'node_modules/.cache',
  '.parcel-cache',
  '.vite',
  '.tmp',
  'coverage',
  'reports',
  
  // Temporary files
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  '.DS_Store',
  'Thumbs.db',
  
  // Archives
  'attached_assets/*.zip',
  'attached_assets/*.tar.gz',
  '*.tar.gz',
  '*.zip',
  
  // Python cache
  '__pycache__',
  '*.pyc',
  '.pytest_cache',
  
  // Play Store generated
  'play_store_assets/generated',
  'play_store_assets/output',
  
  // IDE files
  '.idea',
  '.vscode/settings.json',
];

async function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = join(dirPath, file.name);
      
      if (file.isDirectory()) {
        totalSize += await getDirectorySize(filePath);
      } else {
        const stats = await stat(filePath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Directory might not exist
  }
  
  return totalSize;
}

async function cleanup() {
  console.log('🧹 Starting cleanup process...\n');
  
  let totalSaved = 0;
  const startSize = await getDirectorySize('.');
  
  for (const target of CLEANUP_TARGETS) {
    const isGlob = target.includes('*');
    
    if (isGlob) {
      // Handle glob patterns
      const [dir, pattern] = target.includes('/') 
        ? [target.substring(0, target.lastIndexOf('/')), target.substring(target.lastIndexOf('/') + 1)]
        : ['.', target];
      
      try {
        const files = await readdir(dir);
        for (const file of files) {
          if (pattern === '*' || file.endsWith(pattern.replace('*', ''))) {
            const filePath = join(dir, file);
            const sizeBefore = await getDirectorySize(filePath);
            
            try {
              await rm(filePath, { recursive: true, force: true });
              totalSaved += sizeBefore;
              console.log(`  ✓ Removed: ${filePath} (${(sizeBefore / 1024 / 1024).toFixed(2)} MB)`);
            } catch (error) {
              console.log(`  ⚠ Could not remove: ${filePath}`);
            }
          }
        }
      } catch (error) {
        // Directory might not exist
      }
    } else {
      // Handle direct paths
      if (existsSync(target)) {
        const sizeBefore = await getDirectorySize(target);
        
        try {
          await rm(target, { recursive: true, force: true });
          totalSaved += sizeBefore;
          console.log(`  ✓ Removed: ${target} (${(sizeBefore / 1024 / 1024).toFixed(2)} MB)`);
        } catch (error) {
          console.log(`  ⚠ Could not remove: ${target}`);
        }
      }
    }
  }
  
  // Special handling for duplicate .md files
  console.log('\n📄 Checking for duplicate documentation files...');
  const mdFiles = await readdir('.', { withFileTypes: true });
  const mdGroups = {};
  
  for (const file of mdFiles) {
    if (file.isFile() && file.name.endsWith('.md')) {
      const base = file.name.replace(/_\d+\.md$/, '.md').replace(/\.md$/, '');
      if (!mdGroups[base]) mdGroups[base] = [];
      mdGroups[base].push(file.name);
    }
  }
  
  for (const [base, files] of Object.entries(mdGroups)) {
    if (files.length > 1) {
      // Keep the first one, remove duplicates
      for (let i = 1; i < files.length; i++) {
        const sizeBefore = (await stat(files[i])).size;
        await rm(files[i]);
        totalSaved += sizeBefore;
        console.log(`  ✓ Removed duplicate: ${files[i]}`);
      }
    }
  }
  
  const endSize = await getDirectorySize('.');
  
  console.log('\n✨ Cleanup complete!');
  console.log(`  Initial size: ${(startSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Final size: ${(endSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

cleanup().catch(console.error);