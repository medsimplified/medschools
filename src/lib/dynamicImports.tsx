/**
 * Dynamic import helpers for heavy components
 * Use these to lazy load components and reduce initial bundle size
 */

import dynamic from 'next/dynamic';
import React from 'react';

// Video Player - Heavy library, lazy load
export const DynamicReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  ),
});

// Modal Video - Only needed when modal is opened
export const DynamicModalVideo = dynamic(() => import('react-modal-video'), {
  ssr: false,
});

// Slick Carousel - Heavy animation library
export const DynamicSlickSlider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-pulse bg-gray-200 h-48 w-full rounded"></div>
    </div>
  ),
});

// Framer Motion components - Animation library (basic example)
export const createDynamicMotion = (component: string) =>
  dynamic(
    () => import('framer-motion').then((mod: any) => (mod.motion as any)[component]),
    { ssr: false }
  );

// Animated Cursor - Only for desktop
export const DynamicAnimatedCursor = dynamic(
  () => import('react-animated-cursor'),
  {
    ssr: false,
  }
);

// Export a helper function to check if component should be loaded
export const shouldLoadComponent = (condition: boolean, Component: any, Fallback: any = null) => {
  return condition ? Component : Fallback;
};

/**
 * Usage Examples:
 * 
 * // Video Player
 * import { DynamicReactPlayer } from '@/lib/dynamicImports';
 * <DynamicReactPlayer url={videoUrl} />
 * 
 * // Slick Slider
 * import { DynamicSlickSlider } from '@/lib/dynamicImports';
 * <DynamicSlickSlider {...settings}>{slides}</DynamicSlickSlider>
 * 
 * // Conditional loading
 * import { shouldLoadComponent, DynamicAnimatedCursor } from '@/lib/dynamicImports';
 * {shouldLoadComponent(isDesktop, <DynamicAnimatedCursor />)}
 */

