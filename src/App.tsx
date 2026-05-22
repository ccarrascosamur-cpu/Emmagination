import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import SEO from './components/SEO';
import WhatsAppButton from './components/WhatsAppButton';
import Hero from './sections/Hero';
import StatsBar from './sections/StatsBar';
import Marquee from './sections/Marquee';
import SelectedWork from './sections/SelectedWork';
import Approach from './sections/Approach';
import Process from './sections/Process';
import Calculadora from './sections/Calculadora';
import Testimonial from './sections/Testimonial';
import CTABanner from './sections/CTABanner';
import AuditoriaSEO from './sections/AuditoriaSEO';
import Footer from './sections/Footer';
import PortfolioPage from './pages/PortfolioPage';
import ServicePage from './pages/ServicePage';
import ProjectCasePage from './pages/ProjectCasePage';
import { homeSeo } from './lib/route-seo';

gsap.registerPlugin(ScrollTrigger);

function HomePage({ lenisRef }: { lenisRef: React.MutableRefObject<Lenis | null> }) {
  return (
    <main>
      <SEO {...homeSeo} />
      <Hero lenisRef={lenisRef} />
      <StatsBar />
      <Marquee />
      <SelectedWork />
      <Approach />
      <Process />
      <Calculadora />
      <Testimonial />
      <CTABanner />
      <AuditoriaSEO />
      <Footer />
    </main>
  );
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll progress bar
    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        gsap.set('#scroll-progress', { width: `${self.progress * 100}%` });
      },
    });

    // Page load animation
    gsap.fromTo(
      document.body,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out' }
    );

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector(location.hash);
    if (!target) return;

    const timeoutId = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);

  return (
    <div className="relative">
      <div
        id="scroll-progress"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: '0%',
          zIndex: 9999,
          background: 'linear-gradient(90deg, #7C3AED, #CC26D3)',
          pointerEvents: 'none',
        }}
      />
      <Navigation lenisRef={lenisRef} />
      <Routes>
        <Route path="/" element={<HomePage lenisRef={lenisRef} />} />
        <Route path="/portafolio" element={<PortfolioPage />} />
        <Route path="/servicios/:slug" element={<ServicePage />} />
        <Route path="/proyectos/:slug" element={<ProjectCasePage />} />
      </Routes>
      <WhatsAppButton />
    </div>
  );
}
