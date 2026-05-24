/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ProjectShowcase } from "./components/ProjectShowcase";
import { ROICalculator } from "./components/ROICalculator";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Code,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Globe,
  Gauge,
  Menu,
  X,
  Layers,
  Award
} from "lucide-react";

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  // Custom scroll handler
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsNavOpen(false);
  };

  return (
    <div id="app" className="min-h-screen text-white bg-[#050505] relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* BACKGROUND GRAPHIC ORBS AND PATTERNS (Artistic Flair Spec) */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[160px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[180px] opacity-15 pointer-events-none z-0"></div>
      
      {/* FUTURISTIC BOUTIQUE GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* FIXED PREMIUM NAVBAR */}
      <nav className="w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo brand (Artistic Flair upgrade) */}
          <div className="flex flex-col text-left cursor-pointer" onClick={() => scrollTo("hero")}>
            <span className="text-[9px] uppercase tracking-[0.4em] text-blue-400 font-bold mb-0.5">Digital Experience Agency</span>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              EMMAGINATION<span className="text-blue-500">.</span>
            </h1>
          </div>

          {/* Nav menu links */}
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-slate-400 font-medium font-mono">
            <button onClick={() => scrollTo("portfolio")} className="hover:text-white transition-colors cursor-pointer pb-1 hover:border-b hover:border-blue-500">PORTFOLIO</button>
            <button onClick={() => scrollTo("roi")} className="hover:text-white transition-colors cursor-pointer pb-1 hover:border-b hover:border-blue-500">CALCULADORA ROI</button>
            <button onClick={() => scrollTo("metodo")} className="hover:text-white transition-colors cursor-pointer pb-1 hover:border-b hover:border-blue-500">PHILOSOPHY</button>
            <button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors cursor-pointer pb-1 hover:border-b hover:border-blue-500 font-bold text-white">REDESIGN 2026</button>
          </div>

          {/* Desktop Call to action Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => scrollTo("roi")}
              className="px-5 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-950/20 text-[10px] tracking-widest uppercase transition-all font-bold font-mono cursor-pointer"
            >
              Calcular Retorno →
            </button>
          </div>

          {/* Responsive Mobile burger toggle */}
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
          >
            {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-lg px-4 py-4 space-y-3 text-left font-mono"
            >
              <button onClick={() => scrollTo("portfolio")} className="block w-full py-2 hover:text-blue-400 transition-colors uppercase text-xs">Portafolio</button>
              <button onClick={() => scrollTo("roi")} className="block w-full py-2 hover:text-blue-400 transition-colors uppercase text-xs">Calculadora ROI</button>
              <button onClick={() => scrollTo("metodo")} className="block w-full py-2 hover:text-blue-400 transition-colors uppercase text-xs">Método de Conversión</button>
              <button 
                onClick={() => scrollTo("roi")}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-center text-white text-xs font-bold uppercase block"
              >
                Inicia Cotización ROI
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN LAYOUT MAIN WRAPPER CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-10 sm:py-20 space-y-32">

        {/* HERO HEADER SECTION EXPLAINING CAPABILITIES */}
        <section id="hero" className="space-y-8 pt-5 max-w-4xl mx-auto text-center relative z-10">
          
          {/* Slogan highlight badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950/20 rounded-full border border-blue-500/15">
            <Award className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-blue-300 tracking-[0.2em]">
              Líderes en Shopify Plus & Performance Web Chile
            </span>
          </div>

          {/* Heavy punchy display heading (with stroke elements) */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-display tracking-tighter text-white leading-[0.9] uppercase">
            REDISEÑOS DE <span className="text-transparent stroke-text" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)" }}>CÓDIGO</span> QUE IMPULSAN <br className="hidden sm:block" />
            VENTAS <span className="text-blue-500 font-extrabold">REALES.</span>
          </h1>

          {/* Simple subheader pitch */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Como empresa especialista en desarrollo de sitios web e-commerce, reinventamos la arquitectura visual y técnica de tu negocio con código interactivo de alta velocidad, optimización de velocidad de carga y métricas de conversión medibles.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollTo("portfolio")}
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 active:scale-95 text-[11px] font-bold tracking-widest uppercase transition-all w-full sm:w-auto cursor-pointer"
            >
              Explorar Portafolio
            </button>
            <button
              onClick={() => scrollTo("roi")}
              className="px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 hover:border-blue-500/30 text-[11px] font-bold tracking-widest uppercase transition-all text-slate-300 w-full sm:w-auto cursor-pointer"
            >
              Calcular Impacto ROI
            </button>
          </div>

          {/* Real trust metrics stats inline bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/5 text-center max-w-3xl mx-auto">
            <div className="space-y-1">
              <span className="font-mono text-3xl font-black text-blue-400 block">+150K</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Tráfico Incremental</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl font-black text-purple-400 block">+50%</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Aumento en Conversión</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl font-black text-rose-400 block">100%</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Lighthouse Score</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl font-black text-sky-400 block">Shopify</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Socio Oficial</span>
            </div>
          </div>
        </section>

        {/* PRIMARY PORTFOLIO SHOWCASE SECTION (THE REDESIGN) */}
        <section id="portfolio" className="pt-8">
          <ProjectShowcase />
        </section>

        {/* REVENUE CALCULATOR FOR BUSINESS IMPACT (METRIC REINFORCEMENT) */}
        <section id="roi" className="pt-4 scroll-mt-20">
          <ROICalculator />
        </section>

        {/* METHODOLOGY SECTION */}
        <section id="metodo" className="space-y-10 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase font-bold block">FÓRMULA DE CRECIMIENTO</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">Estrategias que generan liquidez</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              No nos limitamos a programar; estructuramos tu sitio para capturar leads, acortar el embudo y fidelizar clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Strategy 1 */}
            <div className="bg-[#0c0c0c] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 text-left transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wide">1. Velocidad de Carga Crítica</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Cada 100ms de retraso reduce tus conversiones en un 7%. Optimizamos código, comprimimos imágenes y minimizamos JS para lograr cargas instantáneas menores a 1.2 segundos.
              </p>
            </div>

            {/* Strategy 2 */}
            <div className="bg-[#0c0c0c] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 text-left transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-5">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wide">2. Arquitectura Móvil UX Directa</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                El 80% de tus ventas provienen de dispositivos móviles. Diseñamos con filosofía "Mobile-First Real" adaptando la navegación, los filtros y los checkouts a tamaños táctiles rápidos.
              </p>
            </div>

            {/* Strategy 3 */}
            <div className="bg-[#0c0c0c] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 text-left transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wide">3. Enlace SEO e Indexación AI</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Estructuramos tu código limpio con microdatos JSON-LD estructurados para motores de búsqueda, asegurando visibilidad inmediata frente a competidores y disminuyendo costo por clic.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* MINIMALIST BOUTIQUE FOOTER */}
      <footer id="contact" className="w-full border-t border-white/5 bg-[#050505] py-10 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-xs text-white">E</span>
            </div>
            <span className="text-xs font-mono text-slate-500 select-none">
              Santiago, Chile — Emmagination © 2026 · Worldwide Delivery
            </span>
          </div>

          <div className="flex gap-6 text-[10px] uppercase font-mono tracking-widest text-slate-500">
            <span className="hover:text-blue-400 transition-colors cursor-pointer" onClick={() => scrollTo("portfolio")}>Portfolio</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer" onClick={() => scrollTo("roi")}>Métricas ROI</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer" onClick={() => scrollTo("hero")}>Philosophy</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
