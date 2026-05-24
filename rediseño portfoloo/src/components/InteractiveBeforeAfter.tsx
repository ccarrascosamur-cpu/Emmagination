import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { motion } from "motion/react";
import { Project } from "../types";
import { MoveHorizontal, Sparkles } from "lucide-react";

interface InteractiveBeforeAfterProps {
  project: Project;
}

export const InteractiveBeforeAfter: React.FC<InteractiveBeforeAfterProps> = ({ project }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage (0-100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Handle position calculation
  const setPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setPosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      setPosition(e.touches[0].clientX);
    }
  };

  const handleContainerClick = (e: MouseEvent) => {
    setPosition(e.clientX);
  };

  // Inline color gradients
  const strokeColor = project.id === "matias-brieba" ? "#a816f0" : project.id === "portal-zen" ? "#0ea5e9" : project.id === "sagrada-madre" ? "#ec4899" : "#f59e0b";

  return (
    <div className="w-full bg-[#110D27]/85 border border-[#1E1940] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-mono">BEFORE vs AFTER</span>
          <h4 className="text-[14px] font-semibold text-white tracking-tight flex items-center gap-1.5">
            Interacción del Rediseño
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          </h4>
        </div>
        <p className="text-[10px] text-gray-400 font-mono hidden sm:block">Desliza el interruptor central</p>
      </div>

      {/* Interactive Drag Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={handleContainerClick}
        className="relative w-full h-48 sm:h-56 bg-slate-950 rounded-lg overflow-hidden select-none cursor-ew-resize border border-[#2B2456]"
      >
        {/* BEFORE SIDE (Left) */}
        <div className="absolute inset-0 bg-[#0c0a1a] flex items-center justify-center p-4">
          <div className="w-full text-center max-w-xs space-y-2 opacity-80 scale-95">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/10 uppercase">
              Sitio Original (Lento & Inestable)
            </span>
            <p className="text-[11px] sm:text-xs text-gray-400 font-sans leading-relaxed">
              {project.beforeDescription}
            </p>
            <div className="flex justify-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-[9px] font-mono text-red-400">Velocidad LCP ~ 6s - 8s</span>
            </div>
          </div>
        </div>

        {/* AFTER SIDE (Right / Top-Overlay) */}
        <div
          className="absolute inset-y-0 right-0 left-0 bg-[#16113A] border-l border-white/20 flex items-center justify-center p-4 overflow-hidden z-10"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <div className="absolute inset-0 bg-radial-[circle_at_50%_40%] from-purple-500/5 to-transparent pointer-events-none" />
          <div className="w-full text-center max-w-xs space-y-2 scale-95">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 uppercase" style={{ color: strokeColor, borderColor: `${strokeColor}30`, backgroundColor: `${strokeColor}10` }}>
              Resultado Emmagination (Veloz & UX Premium)
            </span>
            <p className="text-[11px] sm:text-xs text-slate-100 font-sans leading-relaxed">
              {project.afterDescription}
            </p>
            <div className="flex justify-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" style={{ backgroundColor: strokeColor }} />
              <span className="text-[9px] font-mono text-emerald-300">UX Core Vitals ~ 1.2s</span>
            </div>
          </div>
        </div>

        {/* Sliding controller line */}
        <div
          className="absolute inset-y-0 w-[2px] cursor-ew-resize bg-white z-20"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Central Handle Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg pointer-events-none border border-gray-200">
            <MoveHorizontal className="w-4 h-4 text-purple-900 font-bold" />
          </div>
        </div>

        {/* Watermarks */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 text-[8px] font-mono text-red-400 rounded border border-red-500/10 select-none pointer-events-none z-10">
          ANTES
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/40 text-[8px] font-mono text-emerald-400 rounded border border-emerald-500/10 select-none pointer-events-none z-10">
          DESPUÉS
        </div>
      </div>
    </div>
  );
};
