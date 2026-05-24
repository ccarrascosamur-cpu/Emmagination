import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "../types";
import { Laptop, Smartphone, Tablet, ExternalLink, Globe, Wifi, CheckCircle2 } from "lucide-react";

interface BrowserPreviewProps {
  project: Project;
}

export const BrowserPreview: React.FC<BrowserPreviewProps> = ({ project }) => {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getUrl = () => {
    switch (project.id) {
      case "matias-brieba":
        return "matiasbrieba.cl";
      case "portal-zen":
        return "portalzen.cl";
      case "sagrada-madre":
        return "sagradamadre.cl";
      case "fogar":
        return "fogar.cl";
      default:
        return "emmagination.cl";
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 805);
  };

  const strokeColor = project.id === "matias" ? "#a816f0" : project.id === "portal-zen" ? "#0ea5e9" : project.id === "sagrada-madre" ? "#ec4899" : "#f59e0b";

  return (
    <div className="w-full h-full flex flex-col bg-[#0F0A23] border border-[#2E2856] rounded-xl overflow-hidden shadow-2xl">
      {/* Browser Controls Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0A0718] border-b border-[#2E2856] gap-3">
        {/* Browser window circles */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 max-w-sm sm:max-w-md bg-[#130E29] rounded-md px-3 py-1 flex items-center gap-2 border border-purple-500/10">
          <Globe className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="font-mono text-[10px] sm:text-[11px] text-gray-400 truncate tracking-wide">
            https://www.{getUrl()}
          </span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-[9px] text-emerald-400">SSL</span>
          </div>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setViewMode("desktop")}
            className={`p-1 rounded-md transition-all ${viewMode === "desktop" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}
            title="Desktop View"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("tablet")}
            className={`p-1 rounded-md transition-all ${viewMode === "tablet" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`p-1 rounded-md transition-all ${viewMode === "mobile" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Live Viewport Area */}
      <div className="flex-1 bg-[#0A0713]/80 p-3 sm:p-5 flex items-center justify-center overflow-y-auto min-h-[300px]">
        <motion.div
          animate={{
            width: viewMode === "desktop" ? "100%" : viewMode === "tablet" ? "70%" : "36%",
            maxWidth: viewMode === "desktop" ? "100%" : viewMode === "tablet" ? "480px" : "320px",
            height: viewMode === "desktop" ? "320px" : "360px"
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="relative bg-[#120E27] border border-[#2E2856] rounded-lg shadow-xl overflow-hidden flex flex-col"
        >
          {/* Refresh Animation Screen */}
          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0F0A23] z-20 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <span className="font-mono text-xs text-purple-300">Conectando...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Site Navbar */}
          <div className="px-3 py-2 border-b border-[#211B40] flex items-center justify-between bg-[#150F2F]">
            {/* Site Logo */}
            <span className="font-bold text-xs text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
              {project.title}
            </span>
            {/* Nav links */}
            {viewMode === "desktop" && (
              <div className="flex items-center gap-2.5 text-[8.5px] text-gray-400 font-mono">
                <span className="hover:text-white cursor-pointer transition-colors">Colecciones</span>
                <span className="hover:text-white cursor-pointer transition-colors">Sustentable</span>
                <span className="hover:text-white cursor-pointer transition-colors font-bold" style={{ color: strokeColor }}>Ver Ofertas</span>
              </div>
            )}
            <span className="w-4 h-3 flex flex-col justify-between cursor-pointer py-0.5 sm:hidden">
              <span className="w-full h-0.5 bg-white rounded-full" />
              <span className="w-3/4 h-0.5 bg-white rounded-full align-right self-end" />
            </span>
          </div>

          {/* Site Canvas Content body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-4 font-sans text-left">
            {/* Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center pt-2">
              <div className="space-y-2">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest text-[#C084FC] bg-purple-500/10 inline-block uppercase">
                  {project.tags[0]}
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {project.id === "matias-brieba" && "Fotografía Sin Fronteras Terrenales"}
                  {project.id === "portal-zen" && "Paz Mental en Cada Rincón"}
                  {project.id === "sagrada-madre" && "Aromas Naturales Para Tu Alma"}
                  {project.id === "fogar" && "Logística de Carga Pesada sin Interrupciones"}
                </h3>
                <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  <button className="px-2.5 py-1 text-[9px] font-medium text-white rounded-md transition-all hover:brightness-110 active:scale-95 flex items-center gap-1" style={{ backgroundColor: strokeColor }}>
                    Explorar
                    <ExternalLink className="w-2 h-2" />
                  </button>
                  <button className="px-2.5 py-1 text-[9px] font-medium text-gray-400 bg-white/5 rounded-md hover:bg-white/10 hover:text-white transition-all">
                    Saber Más
                  </button>
                </div>
              </div>

              {/* Graphic representation side */}
              {viewMode !== "mobile" && (
                <div className="relative rounded-lg overflow-hidden border border-[#231A47] bg-slate-950/40 p-2 flex items-center justify-center min-h-[95px]">
                  <div className="absolute inset-0 bg-radial-[circle_at_50%_40%] from-purple-500/5 to-transparent pointer-events-none" />
                  
                  {project.id === "matias-brieba" && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full border border-purple-500/30 flex items-center justify-center bg-[#150F2C]">
                        <span className="w-6 h-6 rounded-full border border-purple-500 bg-purple-950/40 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-16 bg-white/10 rounded" />
                        <div className="h-1.5 w-10 bg-white/5 rounded" />
                      </div>
                    </div>
                  )}

                  {project.id === "portal-zen" && (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center animate-bounce">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      </div>
                      <span className="text-[7.5px] font-mono text-sky-400">MEDITACIÓN ACTIVA</span>
                    </div>
                  )}

                  {project.id === "sagrada-madre" && (
                    <div className="w-full flex items-center justify-around">
                      <div className="w-8 h-10 bg-[#ec4899]/10 border border-[#ec4899]/20 rounded-md flex flex-col justify-end p-1">
                        <div className="h-1 bg-[#ec4899] w-full rounded-sm" />
                      </div>
                      <div className="w-8 h-10 bg-[#d946ef]/10 border border-[#d946ef]/20 rounded-md flex flex-col justify-end p-1">
                        <div className="h-3 bg-[#d946ef] w-full rounded-sm" />
                      </div>
                      <div className="w-8 h-10 bg-[#86198f]/10 border border-violet-500/20 rounded-md flex flex-col justify-end p-1">
                        <div className="h-2 bg-violet-600 w-full rounded-sm" />
                      </div>
                    </div>
                  )}

                  {project.id === "fogar" && (
                    <div className="flex flex-col gap-1 w-full p-1.5">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-amber-400">
                        <span>Ruta Santiago - Mendoza</span>
                        <span className="text-green-400">Activo</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-3/4 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Simulated product showcase / metric grid */}
            <div className="space-y-1.5 pt-1.5 border-t border-[#251F45]">
              <h4 className="text-[8.5px] font-mono text-gray-400 tracking-wider">RESULTADOS CLANDESTINOS DEL PROYECTO</h4>
              <div className="grid grid-cols-2 gap-2">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="bg-[#1C163C] border border-[#2B2359] rounded p-1.5 flex flex-col justify-center items-center">
                    <span className="text-[8px] font-mono text-gray-400 text-center truncate w-full">{m.label}</span>
                    <span className="text-xs font-bold text-emerald-400 mt-0.5">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Informational tech banner */}
            <div className="bg-[#181235] border border-violet-500/10 rounded-md p-2 flex items-center gap-2">
              <Wifi className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
              <p className="text-[8px] text-gray-300">
                Optimizado para motores de búsqueda con arquitectura <strong className="text-purple-300">Fast-Hydration</strong> e indexación inmediata.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Frame details footer */}
      <div className="px-4 py-2 bg-[#0C081B] border-t border-[#2E2856] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-gray-300 font-mono">Lighthouse Score:</span>
          <span className="text-[10px] font-bold text-emerald-400 font-mono">100/100</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400">Stack:</span>
          <div className="flex gap-1">
            {project.techStack.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-gray-400 font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
