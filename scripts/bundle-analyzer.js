#!/usr/bin/env node

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

console.log('🔍 Analizando bundle de TheCookFlow...\n');

async function runAnalysis() {
  try {
    // Build the project first
    console.log('📦 Building project...');
    const buildResult = await execAsync('npm run build');
    console.log(buildResult.stdout);
    
    // Extract bundle info from build output
    const bundleLines = buildResult.stdout
      .split('\n')
      .filter(line => line.includes('assets/') && (line.includes('.js') || line.includes('.css')));
    
    console.log('📊 Bundle Analysis:');
    console.log('='.repeat(50));
    
    let totalSize = 0;
    let totalGzipSize = 0;
    
    bundleLines.forEach(line => {
      const match = line.match(/assets\/([^\s]+)\s+([0-9.]+)\s+([KkMm]B)\s+.*gzip:\s+([0-9.]+)\s+([KkMm]B)/);
      if (match) {
        const [, filename, size, sizeUnit, gzipSize, gzipUnit] = match;
        
        const sizeInKB = sizeUnit.toLowerCase() === 'mb' ? parseFloat(size) * 1024 : parseFloat(size);
        const gzipSizeInKB = gzipUnit.toLowerCase() === 'mb' ? parseFloat(gzipSize) * 1024 : parseFloat(gzipSize);
        
        totalSize += sizeInKB;
        totalGzipSize += gzipSizeInKB;
        
        console.log(`📄 ${filename}`);
        console.log(`   Size: ${size} ${sizeUnit} | Gzip: ${gzipSize} ${gzipUnit}`);
        console.log('');
      }
    });
    
    console.log('📈 Summary:');
    console.log(`Total Size: ${totalSize.toFixed(2)} kB`);
    console.log(`Total Gzipped: ${totalGzipSize.toFixed(2)} kB`);
    console.log(`Compression Ratio: ${((1 - totalGzipSize/totalSize) * 100).toFixed(1)}%`);
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    if (totalGzipSize > 200) {
      console.log('⚠️  Bundle size is large (>200kB gzipped)');
      console.log('   Consider implementing code splitting');
    } else if (totalGzipSize > 100) {
      console.log('✅ Bundle size is acceptable but could be optimized');
    } else {
      console.log('🎉 Excellent bundle size!');
    }
    
    // Check for specific optimizations
    const jsFiles = bundleLines.filter(line => line.includes('.js'));
    if (jsFiles.length === 1) {
      console.log('📦 Single JS bundle detected - consider code splitting');
    } else {
      console.log(`📦 ${jsFiles.length} JS chunks - good code splitting!`);
    }
    
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
    process.exit(1);
  }
}

runAnalysis();