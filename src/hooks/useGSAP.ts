import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  extra?: gsap.TweenVars;
}

export function useGSAPReveal(selector: string, options: RevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(selector);
    if (!els.length) return;

    const ctx = gsap.context(() => {
      gsap.from(els, {
        opacity: 0,
        y: options.y ?? 40,
        duration: options.duration ?? 0.75,
        stagger: options.stagger ?? 0.12,
        ease: options.ease ?? 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: options.start ?? 'top 85%',
          toggleActions: 'play none none none',
        },
        ...options.extra,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useGSAPHeroLines() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-line-inner', {
        yPercent: 110,
        duration: 1,
        stagger: 0.14,
        ease: 'power4.out',
        delay: 0.1,
      });
      gsap.from('.hero-badge', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        delay: 0.05,
      });
      gsap.from('.hero-sub', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
      });
      gsap.from('.hero-ctas', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        delay: 0.78,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };
