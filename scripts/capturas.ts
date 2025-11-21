import { chromium, type Browser, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';

interface ScreenshotConfig {
  name: string;
  url: string;
  width: number;
  height: number;
  waitFor?: string;
  actions?: Array<{ type: string; selector?: string; text?: string; }>;
}

const screenshots: ScreenshotConfig[] = [
  {
    name: 'home',
    url: '/',
    width: 1080,
    height: 2400,
    waitFor: 'h1'
  },
  {
    name: 'onboarding',
    url: '/tour/1-onboarding',
    width: 1080,
    height: 2400,
    waitFor: '.qa-report-container'
  },
  {
    name: 'menu-resultado',
    url: '/tour/2-menu',
    width: 1080,
    height: 2400,
    waitFor: '.qa-report-container'
  },
  {
    name: 'detalle-receta',
    url: '/tour/3-recipe',
    width: 1080,
    height: 2400,
    waitFor: '.qa-report-container'
  },
  {
    name: 'lista-compra',
    url: '/tour/4-shopping-list',
    width: 1080,
    height: 2400,
    waitFor: '.qa-report-container'
  },
  {
    name: 'paywall',
    url: '/tour/5-paywall',
    width: 1080,
    height: 2400,
    waitFor: '.qa-report-container'
  }
];

const bannerConfig: ScreenshotConfig = {
  name: 'banner-playstore',
  url: '/',
  width: 1024,
  height: 500,
  waitFor: 'h1'
};

const iconConfig: ScreenshotConfig = {
  name: 'icon-playstore',
  url: '/',
  width: 512,
  height: 512,
  waitFor: 'h1'
};

async function takeScreenshot(
  page: Page, 
  config: ScreenshotConfig, 
  outputDir: string
): Promise<void> {
  try {
    console.log(`📸 Taking screenshot: ${config.name}`);
    
    // Set viewport
    await page.setViewportSize({ 
      width: config.width, 
      height: config.height 
    });

    // Navigate to URL
    const baseUrl = process.env.REPL_URL || 'http://localhost:5000';
    await page.goto(`${baseUrl}${config.url}`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });

    // Wait for specific element if specified
    if (config.waitFor) {
      await page.waitForSelector(config.waitFor, { timeout: 5000 });
    }

    // Perform actions if specified
    if (config.actions) {
      for (const action of config.actions) {
        switch (action.type) {
          case 'click':
            if (action.selector) {
              await page.click(action.selector);
              await page.waitForTimeout(1000);
            }
            break;
          case 'type':
            if (action.selector && action.text) {
              await page.fill(action.selector, action.text);
              await page.waitForTimeout(500);
            }
            break;
          case 'wait':
            await page.waitForTimeout(2000);
            break;
        }
      }
    }

    // Take screenshot
    const outputPath = path.join(outputDir, `${config.name}.png`);
    await page.screenshot({ 
      path: outputPath, 
      fullPage: true,
      type: 'png'
    });

    console.log(`✅ Screenshot saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Failed to take screenshot ${config.name}:`, error);
  }
}

async function generateIcon(page: Page, outputDir: string): Promise<void> {
  try {
    console.log('🎨 Generating icon...');
    
    // Create a simple icon using HTML/CSS
    const iconHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            width: 512px; 
            height: 512px; 
            background: linear-gradient(135deg, #1a4d3a 0%, #000000 50%, #1a4d3a 100%);
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-family: 'Caveat', cursive;
          }
          .icon { 
            color: #4ade80; 
            font-size: 120px; 
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
          .text {
            color: #4ade80;
            font-size: 36px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div>
          <div class="icon">🍽️</div>
          <div class="text">TCF</div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(iconHtml);
    await page.setViewportSize({ width: 512, height: 512 });
    
    const iconPath = path.join(outputDir, 'icon-512x512.png');
    await page.screenshot({ 
      path: iconPath, 
      fullPage: true,
      type: 'png'
    });

    console.log(`✅ Icon generated: ${iconPath}`);
  } catch (error) {
    console.error('❌ Failed to generate icon:', error);
  }
}

async function generateBanner(page: Page, outputDir: string): Promise<void> {
  try {
    console.log('🎨 Generating banner...');
    
    const bannerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            width: 1024px; 
            height: 500px; 
            background: linear-gradient(135deg, #1a4d3a 0%, #000000 50%, #1a4d3a 100%);
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-family: 'Caveat', cursive;
            position: relative;
            overflow: hidden;
          }
          .content {
            text-align: center;
            z-index: 2;
          }
          .title { 
            color: #4ade80; 
            font-size: 72px; 
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          }
          .subtitle {
            color: #ffffff;
            font-size: 28px;
            opacity: 0.9;
          }
          .features {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 30px;
          }
          .feature {
            color: #4ade80;
            font-size: 36px;
            text-align: center;
          }
          .feature-text {
            color: #ffffff;
            font-size: 16px;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="title">🍽️ TheCookFlow</div>
          <div class="subtitle">Tu asistente culinario con IA</div>
          <div class="features">
            <div class="feature">
              ⚡
              <div class="feature-text">Menús en 10s</div>
            </div>
            <div class="feature">
              💰
              <div class="feature-text">Ahorro garantizado</div>
            </div>
            <div class="feature">
              🎯
              <div class="feature-text">100% personalizado</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(bannerHtml);
    await page.setViewportSize({ width: 1024, height: 500 });
    
    const bannerPath = path.join(outputDir, 'banner-1024x500.png');
    await page.screenshot({ 
      path: bannerPath, 
      fullPage: true,
      type: 'png'
    });

    console.log(`✅ Banner generated: ${bannerPath}`);
  } catch (error) {
    console.error('❌ Failed to generate banner:', error);
  }
}

async function generateGalleryIndex(outputDir: string): Promise<void> {
  const indexHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,nofollow">
    <title>Screenshots Gallery - TheCookFlow</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1a4d3a 0%, #000000 50%, #1a4d3a 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #4ade80;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            font-family: 'Caveat', cursive;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .screenshot {
            background: rgba(74, 222, 128, 0.1);
            border: 1px solid rgba(74, 222, 128, 0.3);
            border-radius: 12px;
            padding: 1rem;
            text-align: center;
        }
        .screenshot img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .screenshot h3 {
            color: #4ade80;
            margin: 1rem 0 0.5rem 0;
        }
        .screenshot p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }
        .assets {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            padding: 2rem;
            margin-top: 2rem;
        }
        .assets h2 {
            color: #4ade80;
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .asset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        .asset {
            text-align: center;
            padding: 1rem;
            background: rgba(74, 222, 128, 0.1);
            border-radius: 8px;
        }
        .asset img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }
        .download-btn {
            display: inline-block;
            background: #4ade80;
            color: #1a4d3a;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 0.5rem;
        }
        .download-btn:hover {
            background: #22c55e;
        }
        .navigation {
            text-align: center;
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
        }
        .nav-link {
            display: inline-block;
            margin: 0 1rem;
            color: #4ade80;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border: 1px solid #4ade80;
            border-radius: 4px;
        }
        .nav-link:hover {
            background: rgba(74, 222, 128, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 Screenshots Gallery - TheCookFlow</h1>
        
        <div class="gallery">
            <div class="screenshot">
                <img src="home.png" alt="Home Page" loading="lazy">
                <h3>Home / Landing</h3>
                <p>Página principal con demo y características</p>
            </div>
            
            <div class="screenshot">
                <img src="onboarding.png" alt="Onboarding" loading="lazy">
                <h3>Onboarding</h3>
                <p>Configuración inicial del perfil usuario</p>
            </div>
            
            <div class="screenshot">
                <img src="menu-resultado.png" alt="Menú Resultado" loading="lazy">
                <h3>Menú Generado</h3>
                <p>Resultado de generación IA semanal</p>
            </div>
            
            <div class="screenshot">
                <img src="detalle-receta.png" alt="Detalle Receta" loading="lazy">
                <h3>Detalle Receta</h3>
                <p>Receta completa con ingredientes y pasos</p>
            </div>
            
            <div class="screenshot">
                <img src="lista-compra.png" alt="Lista Compra" loading="lazy">
                <h3>Lista de Compra</h3>
                <p>Lista generada automáticamente con precios</p>
            </div>
            
            <div class="screenshot">
                <img src="paywall.png" alt="Paywall" loading="lazy">
                <h3>Paywall Premium</h3>
                <p>Funciones premium y suscripción</p>
            </div>
        </div>
        
        <div class="assets">
            <h2>🎨 Play Store Assets</h2>
            <div class="asset-grid">
                <div class="asset">
                    <img src="banner-1024x500.png" alt="Banner Play Store" loading="lazy">
                    <h4>Banner 1024x500</h4>
                    <a href="banner-1024x500.png" download class="download-btn">Descargar</a>
                </div>
                
                <div class="asset">
                    <img src="icon-512x512.png" alt="Icon Play Store" loading="lazy">
                    <h4>Icon 512x512</h4>
                    <a href="icon-512x512.png" download class="download-btn">Descargar</a>
                </div>
            </div>
        </div>
        
        <div class="navigation">
            <a href="/qa" class="nav-link">🔧 QA Dashboard</a>
            <a href="/qa/report" class="nav-link">📊 QA Report</a>
            <a href="/qa/smoke" class="nav-link">🧪 Smoke Tests</a>
            <a href="/tour/2-menu" class="nav-link">🎭 Demo Tour</a>
        </div>
    </div>
</body>
</html>
  `;

  const indexPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(indexPath, indexHtml);
  console.log(`✅ Gallery index generated: ${indexPath}`);
}

export async function generateScreenshots(): Promise<void> {
  console.log('🚀 Starting screenshot generation...');
  
  const outputDir = path.join(process.cwd(), 'public', 'previews');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let browser: Browser | null = null;
  
  try {
    // Launch browser
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Take all screenshots
    for (const config of screenshots) {
      await takeScreenshot(page, config, outputDir);
    }
    
    // Generate banner and icon
    await generateBanner(page, outputDir);
    await generateIcon(page, outputDir);
    
    // Generate gallery index
    await generateGalleryIndex(outputDir);
    
    console.log('✅ All screenshots generated successfully!');
    
  } catch (error) {
    console.error('❌ Screenshot generation failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  generateScreenshots()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}