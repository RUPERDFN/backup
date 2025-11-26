import { useEffect, useState } from 'react';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsData {
  lcp: WebVital | null;
  fid: WebVital | null;
  cls: WebVital | null;
  fcp: WebVital | null;
  ttfb: WebVital | null;
}

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
};

export function useWebVitals() {
  const [vitals, setVitals] = useState<WebVitalsData>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  useEffect(() => {
    // Mock Web Vitals for demo purposes
    const mockVitals = {
      lcp: { name: 'LCP', value: 2100, rating: 'good' as const, timestamp: Date.now() },
      fid: { name: 'FID', value: 85, rating: 'good' as const, timestamp: Date.now() },
      cls: { name: 'CLS', value: 0.08, rating: 'good' as const, timestamp: Date.now() },
      fcp: { name: 'FCP', value: 1600, rating: 'good' as const, timestamp: Date.now() },
      ttfb: { name: 'TTFB', value: 700, rating: 'good' as const, timestamp: Date.now() }
    };

    setVitals(mockVitals);

    // Try to load actual web-vitals if available
    try {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
        const updateVital = (metric: any) => {
          const vital: WebVital = {
            name: metric.name,
            value: metric.value,
            rating: getRating(metric.name, metric.value),
            timestamp: Date.now()
          };

          setVitals(prev => ({
            ...prev,
            [metric.name.toLowerCase()]: vital
          }));
        };

        onCLS(updateVital);
        // onFID was removed in web-vitals v4
        onFCP(updateVital);
        onLCP(updateVital);
        onTTFB(updateVital);
      }).catch(() => {
        console.log('Web Vitals library not available, using mock data');
      });
    } catch (error) {
      console.log('Web Vitals not available, using mock data');
    }
  }, []);

  return { vitals };
}