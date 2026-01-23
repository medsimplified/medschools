"use client";

import { useEffect } from 'react';

/**
 * Web Vitals Performance Monitor
 * Tracks Core Web Vitals and sends to analytics
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and in browser
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    // Dynamic import of web-vitals to avoid bundling in development
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      // Cumulative Layout Shift
      onCLS((metric) => {
        console.log('[Performance] CLS:', metric.value);
        sendToAnalytics(metric);
      });

      // First Input Delay (or Interaction to Next Paint in newer browsers)
      onFID((metric) => {
        console.log('[Performance] FID:', metric.value);
        sendToAnalytics(metric);
      });

      // Interaction to Next Paint
      onINP((metric) => {
        console.log('[Performance] INP:', metric.value);
        sendToAnalytics(metric);
      });

      // First Contentful Paint
      onFCP((metric) => {
        console.log('[Performance] FCP:', metric.value);
        sendToAnalytics(metric);
      });

      // Largest Contentful Paint
      onLCP((metric) => {
        console.log('[Performance] LCP:', metric.value);
        sendToAnalytics(metric);
      });

      // Time to First Byte
      onTTFB((metric) => {
        console.log('[Performance] TTFB:', metric.value);
        sendToAnalytics(metric);
      });
    });
  }, []);

  return null; // This component doesn't render anything
}

function sendToAnalytics(metric: any) {
  // You can send to Google Analytics, Vercel Analytics, or your own analytics service
  // Example with Google Analytics:
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // You can also send to your own API endpoint:
  /*
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(console.error);
  */
}

/**
 * Usage: Add to root layout or app component
 * 
 * <PerformanceMonitor />
 */
