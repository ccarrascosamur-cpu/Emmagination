import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "../types";
import { projects } from "../projectsData";
import { RenderIllustration } from "./ProjectIllustrations";
import { BrowserPreview } from "./BrowserPreview";
import { InteractiveBeforeAfter } from "./InteractiveBeforeAfter";
import { MetricChart } from "./MetricChart";
import {
  LayoutGrid,
  Sparkles,
  Layers,
  Check,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  X,
  Gauge,
  Code2,
  Calendar,
  MessageSquare
} from "lucide-react";

export const ProjectShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"todos" | "ecommerce" | "web" | "branding">("todos");
  const [layoutMode, setLayoutMode] = useState<"bento" | "grid" | "carousel">("bento");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [carouselIdx, setCarouselIdx] = useState<number>(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", service: "Shopify Plus", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filters projects
  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "todos") return true;
    return p.category === activeCategory;
  });

  // Handle contact submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setIsContactOpen(false);
      setFormSubmitted(false);
      setContactForm({ name: "", email: "", service: "Shopify Plus", message: "" });
    }, 2500);
  };

  const handleNextCarousel = () => {
    setCarouselIdx((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIdx((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <div className="w-full flex flex-col gap-10">
      
      {/* Portfolio Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl text-left">
          {/* Subtitle label with stylized dash */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-blue-500 rounded-full" />
            <span className="font-mono text-xs uppercase tracking-widest text-blue-400 font-bold">PORTAFOLIO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
            Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">reales</span>, <br className="hidden sm:block" />
            resultados medibles
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-lg">
            No mostramos mockups genéricos. Cada uno de nuestros proyectos está vivo, integrado con código premium y generando conversiones estables día tras día.
          </p>
        </div>

        {/* Dynamic Display Layout Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          {/* Filter Categories */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#0c0c0c]/80 border border-white/5 rounded-xl">
            {(["todos", "ecommerce", "web", "branding"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCarouselIdx(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all uppercase ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat === "todos" && "Todos"}
                {cat === "ecommerce" && "E-Commerce"}
                {cat === "web" && "Sitios Web"}
                {cat === "branding" && "Branding"}
              </button>
            ))}
          </div>

          {/* Visual Layout selector */}
          <div className="flex items-center gap-1 p-1 bg-[#0c0c0c]/80 border border-white/5 rounded-xl">
            <button
              onClick={() => setLayoutMode("bento")}
              className={`p-1.5 rounded-lg transition-all ${layoutMode === "bento" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-gray-500 hover:text-gray-300"}`}
              title="Bento Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode("carousel")}
              className={`p-1.5 rounded-lg transition-all ${layoutMode === "carousel" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-gray-500 hover:text-gray-300"}`}
              title="Carrusel Inmersivo"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Project Showcase Canvas Area */}
      <AnimatePresence mode="wait">
        
        {/* BENTO GRID LAYOUT */}
        {layoutMode === "bento" && (
          <motion.div
            key="bento"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
          >
            {filteredProjects.map((project, idx) => {
              // Create dynamic spans for bento geometry
              // Matias & Portal Zen take 7 columns, some take 5, making a beautiful asymmetrical grid
              const spanClass = idx === 0 ? "lg:col-span-12 xl:col-span-7" : idx === 1 ? "lg:col-span-12 xl:col-span-5" : idx === 2 ? "lg:col-span-12 xl:col-span-5" : "lg:col-span-12 xl:col-span-7";
              
              const accentColor = project.textColor;
              const borderBg = project.color;

              return (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative rounded-2xl bg-[#0c0c0c] border border-white/5 hover:border-blue-500/30 overflow-hidden cursor-pointer flex flex-col justify-between ${project.glowColor} transition-all duration-300 ${spanClass}`}
                >
                  <div className="p-5 sm:p-6 flex flex-col gap-5">
                    
                    {/* Floating Glow dot */}
                    <span className="absolute top-4 right-4 text-[9px] font-mono tracking-widest text-slate-500 group-hover:text-purple-400 transition-colors uppercase">
                      Clic para explorar ↗
                    </span>

                    {/* Meta stack row */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] sm:text-[11px] font-mono font-extrabold tracking-wider" style={{ color: project.id === "matias-brieba" ? "#c084fc" : project.id === "portal-zen" ? "#38bdf8" : project.id === "sagrada-madre" ? "#f472b6" : "#fbbf24" }}>
                        {project.categoryLabel}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    {/* Central interactive preview SVG illustration */}
                    <div className="w-full">
                      <RenderIllustration name={project.imageAccent} isHovered />
                    </div>

                    {/* Description text */}
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed text-left">
                      {project.description}
                    </p>

                    {/* Core Performance metrics indicators box (the client's favorite results labels) */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-500/10">
                      {project.metrics.map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 text-[10.5px] font-mono"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="font-bold">{metric.value}</span>
                          <span className="text-gray-400/80 font-normal">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gradient Card Accent Border line below */}
                  <div className={`h-[3px] w-full bg-gradient-to-r ${borderBg}`} />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CAROUSEL MODE SLIDER */}
        {layoutMode === "carousel" && filteredProjects.length > 0 && (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center"
          >
            {/* Slide Info (Left) */}
            <div className="flex-1 space-y-5 text-left order-2 md:order-1">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/15 text-[10.5px] font-mono uppercase tracking-widest font-bold">
                PROYECTO DESTACADO ({carouselIdx + 1} / {filteredProjects.length})
              </span>

              <div className="space-y-1">
                <span className="text-xs font-mono text-gray-400 font-extrabold">{filteredProjects[carouselIdx].categoryLabel}</span>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {filteredProjects[carouselIdx].title}
                </h3>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {filteredProjects[carouselIdx].longDescription}
              </p>

              {/* Technologies list */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">Tecnologías Integradas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {filteredProjects[carouselIdx].techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs text-gray-400 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metric stats horizontal panel */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950/40 p-4 rounded-xl border border-purple-500/5">
                {filteredProjects[carouselIdx].metrics.map((m, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{m.label}</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Action and carousel nav row */}
              <div className="flex items-center justify-between pt-4 gap-4">
                <button
                  onClick={() => setSelectedProject(filteredProjects[carouselIdx])}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-blue-900/30 flex items-center gap-2"
                >
                  Ver Caso de Estudio
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevCarousel}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white transition-all disabled:opacity-40"
                    disabled={filteredProjects.length <= 1}
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextCarousel}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white transition-all disabled:opacity-40"
                    disabled={filteredProjects.length <= 1}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Illustration (Right / Order-1 on mobile) */}
            <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
              <div className="w-full max-w-[380px] select-none hover:scale-[1.02] transition-transform duration-300">
                <RenderIllustration name={filteredProjects[carouselIdx].imageAccent} isHovered />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED PROJECT MODAL DRAWED OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#06040C]/95 backdrop-blur-md z-50 flex justify-end overflow-hidden"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-4xl h-full bg-[#050505] border-l border-white/5 flex flex-col justify-between overflow-y-auto"
            >
              
              {/* Overlay Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0c0c0c] sticky top-0 z-30">
                <div className="flex items-center gap-3 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">{selectedProject.categoryLabel}</span>
                    <h2 className="text-xl font-bold text-white tracking-tight">{selectedProject.title}</h2>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details contents */}
              <div className="p-6 space-y-8 flex-1">
                
                {/* Intro details block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Text descriptions */}
                  <div className="md:col-span-7 space-y-4 text-left">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono uppercase tracking-widest font-bold">
                      EL DESAFÍO Y SOLUCIÓN
                    </span>
                    <p className="text-sm text-slate-100 leading-relaxed font-sans">
                      {selectedProject.longDescription}
                    </p>
                    
                    {/* Tech stack badge list */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Stack Tecnológico Aplicado</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs text-gray-300 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar stats panel */}
                  <div className="md:col-span-5 space-y-4 bg-[#0c0c0c] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 tracking-wider font-extrabold uppercase">IMPACTO EN NEGOCIO</span>
                      <h4 className="text-[14px] font-bold text-white tracking-tight mt-1 mb-3">Métricas de Crecimiento Confirmadas</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedProject.metrics.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-purple-500/10 last:border-0 last:pb-0">
                          <span className="text-xs text-gray-400">{m.label}</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-mono text-base font-extrabold text-emerald-400">{m.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-purple-400" />
                      <span className="text-[10px] text-gray-400 font-mono">Lighthouse Core Web Vitals: 100/100</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Responsive Browser preview viewport frame */}
                <div className="space-y-3">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Demostrador Interactivo</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">Experiencia e-commerce en Vivo</h3>
                  </div>
                  <BrowserPreview project={selectedProject} />
                </div>

                {/* Splitting Before and After section slider */}
                <div className="space-y-3">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Análisis Comparativo</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">Efectividad del Rediseño</h3>
                  </div>
                  <InteractiveBeforeAfter project={selectedProject} />
                </div>

                {/* Monthly conversions historic charts */}
                <div className="space-y-3">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Métricas Detalladas</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">Evolución de Rendimiento Comercial</h3>
                  </div>
                  <MetricChart
                    data={selectedProject.chartData}
                    color={selectedProject.color}
                    textColor={selectedProject.textColor}
                    id={selectedProject.id}
                  />
                </div>

              </div>

              {/* Detailed Overlay Call to action Footer */}
              <div className="p-6 border-t border-white/5 bg-[#0c0c0c] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20 font-sans">
                <div className="text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">¿Te interesa alcanzar métricas similares?</h4>
                  <p className="text-xs text-gray-400">Platiquemos acerca de la visión comercial de tu marca hoy.</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold"
                  >
                    Cerrar Detalle
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setIsContactOpen(true);
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-purple-900/30"
                  >
                    Cotizar Proyecto Similar →
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER DIRECT SUB BUTTON OR INQUIRY FORM */}
      <div className="flex flex-col items-center justify-center gap-4 bg-[#0c0c0c]/80 p-6 rounded-2xl border border-white/5 mt-4">
        <h4 className="text-sm sm:text-base font-medium text-gray-300 text-center">
          ¿Deseas reestructurar e impulsar la tasa de conversión de tu sitio web?
        </h4>
        <button
          onClick={() => setIsContactOpen(true)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:brightness-110 hover:shadow-[0_0_25px_rgba(147,51,234,0.4)] active:scale-95 text-white text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2"
        >
          ¡Quiero Rediseñar Mi Sitio!
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* QUICK INQUIRY SLIDING DRAWER FORM */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#06040C]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {formSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white">¡Solicitud Enviada con Éxito!</h3>
                  <p className="text-xs text-gray-400 font-sans max-w-sm mx-auto leading-relaxed">
                    Hemos agendado tu sesión de consultoría técnica de pre-diseño. Un analista UX senior de Emmagination se contactará contigo para analizar tu tasa de conversión.
                  </p>
                  <p className="font-mono text-[10px] text-blue-400">ESTADO: CONECTADO · REUNIÓN ASIGNADA</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">CONTACTO DIRECTO</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">Eleva tus resultados comerciales</h3>
                    <p className="text-xs text-gray-400 font-light">Cuéntanos sobre tu negocio. Nos pondremos en contacto en menos de 2 horas hábiles.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Carlos Carrasco"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Servicio de Interés</label>
                      <select
                        value={contactForm.service}
                        onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                      >
                        <option value="Shopify Plus">E-Commerce (Shopify Plus)</option>
                        <option value="Branding & Web">Branding & Sitios Web Express</option>
                        <option value="CRO Optimization">Optimización de Conversión (CRO)</option>
                        <option value="Headless Custom">Desarrollo Web Headless React</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Háblanos sobre tu proyecto</label>
                      <textarea
                        rows={3}
                        placeholder="Describe los objetivos de ventas, tu plataforma actual o detalles generales..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-sans resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-900/30 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    Enviar Solicitud B2B
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
