import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import billingManager from '@/billing/billing';
import adManager from '@/ads/adManager';
import { initializeTCFBridge } from '@/lib/tcf-bridge-integration';

// Initialize billing and ads systems
(async () => {
  // Initialize billing first (for TWA/PWA Play Billing)
  const billingAvailable = await billingManager.init();
  if (billingAvailable) {
    console.log('Digital Goods API available - TWA mode');
  } else {
    console.log('Running in web mode');
  }
  
  // Initialize ad system with CMP
  await adManager.initCMP();
  
  // Initialize TCF Bridge (Android WebView billing integration)
  initializeTCFBridge();
  
  // Start React app after initialization
  createRoot(document.getElementById("root")!).render(<App />);
})();
