import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '../lib/ga4';

const DEPTHS = [25, 50, 75, 90];

/**
 * Hook to track scroll depth milestones for GA4
 * Tracks at 25%, 50%, 75%, and 90% scroll depth
 */
export function useScrollDepth() {
  const trackedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      for (const depth of DEPTHS) {
        if (scrollPercent >= depth && !trackedRef.current.has(depth)) {
          trackedRef.current.add(depth);
          trackScrollDepth(depth);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

/**
 * Reset tracked depths (useful when navigating between pages)
 */
export function resetScrollDepthTracking() {
  // This is a no-op for the hook's internal state,
  // but can be used to trigger resets if needed
}
