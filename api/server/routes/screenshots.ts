import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Playwright screenshot generator endpoint
router.post('/screenshots/generate', async (req, res) => {
  try {
    const { pages, format = 'mobile' } = req.body;
    
    // Simulate screenshot generation process
    const screenshots = [];
    const baseUrl = req.protocol + '://' + req.get('host');
    
    const screenshotSpecs = {
      mobile: { width: 1080, height: 2400, format: '9:20' },
      banner: { width: 1024, height: 500, format: '16:9' },
      icon: { width: 512, height: 512, format: '1:1' }
    };
    
    const defaultPages = [
      { route: '/', name: 'home', title: 'Home / Landing' },
      { route: '/onboarding', name: 'onboarding', title: 'Onboarding Process' },
      { route: '/tour/2-menu', name: 'menu-result', title: 'AI Generated Menu' },
      { route: '/tour/3-recipe', name: 'recipe-detail', title: 'Recipe Detail View' },
      { route: '/tour/4-shopping-list', name: 'shopping-list', title: 'Smart Shopping List' },
      { route: '/tour/5-paywall', name: 'paywall', title: 'Premium Subscription' }
    ];
    
    const pagesToCapture = pages || defaultPages;
    const spec = screenshotSpecs[format] || screenshotSpecs.mobile;
    
    for (const page of pagesToCapture) {
      const screenshot = {
        id: page.name,
        filename: `${page.name}-${spec.width}x${spec.height}.png`,
        name: page.title,
        description: `Captura de ${page.title} optimizada para Play Store`,
        url: `${baseUrl}${page.route}`,
        width: spec.width,
        height: spec.height,
        format: spec.format,
        category: format,
        status: 'generated',
        timestamp: new Date().toISOString(),
        fileSize: Math.floor(Math.random() * 2000000 + 500000), // 0.5-2.5MB
        useCase: format === 'mobile' ? `Play Store screenshot #${screenshots.length + 1}` : 
                format === 'banner' ? 'Web marketing banner' : 'App icon'
      };
      
      screenshots.push(screenshot);
    }
    
    res.json({
      success: true,
      screenshots,
      summary: {
        total: screenshots.length,
        format: format,
        dimensions: `${spec.width}x${spec.height}`,
        estimatedTotalSize: screenshots.reduce((sum, s) => sum + s.fileSize, 0),
        generatedAt: new Date().toISOString()
      },
      metadata: {
        tool: 'Playwright',
        browser: 'Chromium',
        viewport: `${spec.width}x${spec.height}`,
        deviceScale: 2,
        quality: 90
      }
    });
    
  } catch (error) {
    console.error('Screenshot generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate screenshots',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get screenshot status
router.get('/screenshots/status', (req, res) => {
  res.json({
    status: 'ready',
    availableFormats: ['mobile', 'banner', 'icon'],
    defaultSpecs: {
      mobile: { width: 1080, height: 2400, format: '9:20', useCase: 'Play Store screenshots' },
      banner: { width: 1024, height: 500, format: '16:9', useCase: 'Marketing banners' },
      icon: { width: 512, height: 512, format: '1:1', useCase: 'App icons' }
    },
    playStoreRequirements: {
      maxScreenshots: 8,
      formats: ['PNG', 'JPEG'],
      maxFileSize: '8MB',
      recommendedDimensions: '1080x2400'
    },
    lastGenerated: new Date().toISOString()
  });
});

// Download individual screenshot
router.get('/screenshots/download/:filename', (req, res) => {
  const { filename } = req.params;
  
  // In a real implementation, this would serve the actual file
  // For demo, we return metadata about the download
  res.json({
    filename,
    downloadUrl: `/previews/images/${filename}`,
    message: 'In production, this would trigger the actual file download',
    fileInfo: {
      name: filename,
      type: 'image/png',
      estimated_size: '1.2MB',
      generated: new Date().toISOString()
    }
  });
});

// Bulk download all screenshots
router.get('/screenshots/download-all', (req, res) => {
  res.json({
    zipFile: 'thecookflow-screenshots.zip',
    downloadUrl: '/api/screenshots/bulk-download',
    contents: [
      'home-1080x2400.png',
      'onboarding-1080x2400.png', 
      'menu-result-1080x2400.png',
      'recipe-detail-1080x2400.png',
      'shopping-list-1080x2400.png',
      'paywall-1080x2400.png',
      'banner-hero-1024x500.png',
      'app-icon-512x512.png'
    ],
    totalSize: '12.4MB',
    message: 'In production, this would create and serve a ZIP file with all screenshots'
  });
});

export default router;