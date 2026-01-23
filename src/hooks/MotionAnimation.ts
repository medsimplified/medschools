// src/hooks/MotionAnimation.tsx
"use client";
import { useEffect } from 'react';
import { TweenMax } from 'gsap';

const MotionAnimation = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !TweenMax) return;

    const handleMouseMove = (e: MouseEvent) => {
      try {
        const wraps = document.querySelectorAll('.tg-motion-effects');
        if (!wraps.length) return;

        wraps.forEach((wrap) => {
          const parallaxIt = (targetClass: string, movement: number) => {
            const target = wrap.querySelector(targetClass) as HTMLElement;
            if (!target) return;

            const rect = wrap.getBoundingClientRect();
            const relX = e.pageX - rect.left;
            const relY = e.pageY - rect.top;

            TweenMax.to(target, 1, {
              x: ((relX - wrap.clientWidth / 2) / wrap.clientWidth) * movement,
              y: ((relY - wrap.clientHeight / 2) / wrap.clientHeight) * movement,
            });
          };

          parallaxIt('.tg-motion-effects1', 20);
          parallaxIt('.tg-motion-effects2', 5);
          parallaxIt('.tg-motion-effects3', -10);
          parallaxIt('.tg-motion-effects4', 30);
          parallaxIt('.tg-motion-effects5', -50);
          parallaxIt('.tg-motion-effects6', -20);
          parallaxIt('.tg-motion-effects7', 40);
        });
      } catch (error) {
        // Silently handle animation errors
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;  // important: return a valid React node
};

export default MotionAnimation;
