import React from "react";
import { motion } from "motion/react";

interface IllustrationProps {
  isHovered?: boolean;
}

export const MatiasBriebaIllustration: React.FC<IllustrationProps> = ({ isHovered = false }) => {
  return (
    <div className="relative w-full h-full min-h-[180px] sm:min-h-[220px] rounded-lg overflow-hidden bg-slate-950/40 border border-purple-500/10 flex items-center justify-center p-4">
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-purple-500/15 via-transparent to-transparent pointer-events-none" />
      
      <svg className="w-32 h-32 md:w-36 md:h-36 overflow-visible" viewBox="0 0 100 100" fill="none">
        {/* Outer rotating camera lens ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#purpleGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 8 20 6"
          animate={{ rotate: isHovered ? 360 : 60 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Camera Apperture blades */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          stroke="rgba(168, 22, 240, 0.2)"
          strokeWidth="1"
          strokeDasharray="10 5"
          animate={{ rotate: isHovered ? -180 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Cinematic Filmstrip elements */}
        <g stroke="rgba(168, 22, 240, 0.4)" strokeWidth="1" opacity={isHovered ? 0.9 : 0.6}>
          <line x1="10" y1="20" x2="25" y2="20" />
          <line x1="10" y1="23" x2="25" y2="23" />
          <line x1="10" y1="26" x2="25" y2="26" />
          <p />
          <rect x="12" y="10" width="10" height="8" rx="1" strokeWidth="0.75" />
          <circle cx="17" cy="14" r="1.5" fill="rgba(168, 22, 240, 0.9)" />
        </g>
        
        {/* Core lens elements */}
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="rgba(11, 8, 22, 0.85)"
          stroke="url(#purpleGrad)"
          strokeWidth="2"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Inner lens glass reflection */}
        <motion.path
          d="M38 42 C 43 35, 57 35, 62 42"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: isHovered ? 0.9 : 0.4, y: isHovered ? -1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Focal Dot Indicator */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="#d946ef"
          animate={{
            scale: isHovered ? [1, 1.4, 1] : 1,
            opacity: isHovered ? [0.8, 1, 0.8] : 0.8
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a816f0" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Overlay UI element */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 bg-purple-950/40 border border-purple-500/20 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        <span className="font-mono text-[9px] text-purple-300 uppercase tracking-widest">ISO 100 · F/2.8</span>
      </div>
    </div>
  );
};

export const PortalZenIllustration: React.FC<IllustrationProps> = ({ isHovered = false }) => {
  return (
    <div className="relative w-full h-full min-h-[180px] sm:min-h-[220px] rounded-lg overflow-hidden bg-slate-950/40 border border-blue-500/10 flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-blue-500/15 via-transparent to-transparent pointer-events-none" />
      
      <svg className="w-32 h-32 md:w-36 md:h-36 overflow-visible" viewBox="0 0 100 100" fill="none">
        {/* Concentric meditation ripple waves */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgba(14, 165, 233, 0.15)"
          strokeWidth="1"
          animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 0.4 : 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="32"
          stroke="rgba(14, 165, 233, 0.25)"
          strokeWidth="1.2"
          animate={{ scale: isHovered ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Floating sacred geometry pattern */}
        <motion.path
          d="M 50 15 L 85 50 L 50 85 L 15 50 Z"
          stroke="rgba(14, 165, 233, 0.3)"
          strokeWidth="0.75"
          animate={{ rotate: isHovered ? -90 : -45 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Radiant central Zen orb */}
        <motion.circle
          cx="50"
          cy="50"
          r="16"
          fill="url(#blueOrbg)"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          animate={{
            boxShadow: isHovered ? "0 0 20px #0ea5e9" : "0 0 10px #0ea5e9",
            scale: isHovered ? [1, 1.08, 1] : [1, 1.03, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Minimalist Lotus flower floating above card */}
        <motion.path
          d="M 50 40 C 47 47, 42 47, 42 50 C 42 53, 47 53, 50 50 C 53 53, 58 53, 58 50 C 58 47, 53 47, 50 40 Z"
          fill="rgba(255, 255, 255, 0.85)"
          stroke="#38bdf8"
          strokeWidth="0.75"
          animate={{ y: isHovered ? -3 : 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.path
          d="M 50 45 C 45 48, 40 48, 38 50 C 41 51, 46 51, 50 50 M 50 50 C 54 51, 59 51, 62 50 C 60 48, 55 48, 50 45 Z"
          fill="rgba(255, 255, 255, 0.5)"
          stroke="#38bdf8"
          strokeWidth="0.5"
          animate={{ y: isHovered ? -3 : 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />

        <defs>
          <radialGradient id="blueOrbg" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Top right indicator tag */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-blue-950/40 border border-blue-500/20 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="font-mono text-[9px] text-blue-300 uppercase tracking-widest">MINDFULNESS INDEX</span>
      </div>
    </div>
  );
};

export const SagradaMadreIllustration: React.FC<IllustrationProps> = ({ isHovered = false }) => {
  return (
    <div className="relative w-full h-full min-h-[180px] sm:min-h-[220px] rounded-lg overflow-hidden bg-slate-950/40 border border-pink-500/10 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-pink-500/15 via-transparent to-transparent pointer-events-none" />
      
      <svg className="w-32 h-32 md:w-36 md:h-36 overflow-visible" viewBox="0 0 100 100" fill="none">
        {/* Glowing crescent celestial moon background */}
        <motion.path
          d="M 68 22 A 25 25 0 1 0 78 48 A 20 20 0 1 1 68 22 Z"
          fill="rgba(236, 72, 153, 0.15)"
          stroke="url(#pinkGrad)"
          strokeWidth="0.75"
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? -5 : 0
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Minimalist botanical branches surrounding or emerging from the incense holder */}
        <motion.path
          d="M 30 75 Q 38 60 30 45 Q 25 55 30 75 Z"
          stroke="rgba(244, 114, 182, 0.4)"
          strokeWidth="1"
          fill="rgba(244, 114, 182, 0.05)"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M 32 60 Q 42 50 38 35"
          stroke="rgba(244, 114, 182, 0.3)"
          strokeWidth="0.75"
        />

        {/* Minimalist Incense holder base */}
        <path
          d="M 28 80 L 72 80 C 65 77 35 77 28 80 Z"
          fill="rgba(236, 72, 153, 0.4)"
          stroke="url(#pinkGrad)"
          strokeWidth="1.2"
        />
        
        {/* Incense stick */}
        <line x1="60" y1="78" x2="40" y2="55" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="55" r="1.5" fill="#f472b6" />

        {/* Organic rising smoke waves (Hand-drawn path animates upward) */}
        <motion.path
          d="M 40 55 C 38 48, 44 42, 41 35 C 38 28, 46 22, 42 15"
          stroke="url(#pinkGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40"
          animate={{
            strokeDashoffset: isHovered ? [40, 0, -40] : [40, 0],
            opacity: isHovered ? [0.6, 1, 0.6] : 0.7
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.path
          d="M 42 53 C 45 46, 39 39, 44 32 C 48 25, 40 18, 45 10"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="40"
          animate={{
            strokeDashoffset: isHovered ? [0, -40, 0] : 0,
            opacity: isHovered ? [0.3, 0.7, 0.3] : 0.4
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <defs>
          <linearGradient id="pinkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Bottom left label */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 bg-pink-950/40 border border-pink-500/20 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
        <span className="font-mono text-[9px] text-pink-300 uppercase tracking-widest">BOTANICAL ESSENCE</span>
      </div>
    </div>
  );
};

export const FogarIllustration: React.FC<IllustrationProps> = ({ isHovered = false }) => {
  return (
    <div className="relative w-full h-full min-h-[180px] sm:min-h-[220px] rounded-lg overflow-hidden bg-slate-950/40 border border-amber-500/10 flex items-center justify-center p-4">
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
      
      <svg className="w-32 h-32 md:w-36 md:h-36 overflow-visible" viewBox="0 0 100 100" fill="none">
        {/* Geometric Perspective Grid representation (Logistics layout) */}
        <g stroke="rgba(245, 158, 11, 0.1)" strokeWidth="0.75">
          <line x1="5" y1="85" x2="95" y2="85" />
          <line x1="10" y1="70" x2="90" y2="70" />
          <line x1="20" y1="55" x2="80" y2="55" />
          <line x1="30" y1="40" x2="70" y2="40" />
          
          <line x1="50" y1="40" x2="50" y2="85" />
          <line x1="30" y1="40" x2="5" y2="85" />
          <line x1="70" y1="40" x2="95" y2="85" />
        </g>
        
        {/* Glowing routes wireframe */}
        <motion.path
          d="M 15 30 L 35 48 L 65 35 L 85 55"
          stroke="rgba(245, 158, 11, 0.3)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Moving glowing signal truck delivery nodes */}
        <motion.circle
          cx="15"
          cy="30"
          r="4"
          fill="#f59e0b"
          animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="35"
          cy="48"
          r="4"
          fill="#d97706"
        />
        <motion.circle
          cx="65"
          cy="35"
          r="4"
          fill="#ea580c"
        />
        <motion.circle
          cx="85"
          cy="55"
          r="4"
          fill="#f59e0b"
          animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />

        {/* Delivery vehicle sleek stylized cabin body in neon wireframe */}
        <g stroke="url(#amberGrad)" strokeWidth="1.5" fill="rgba(15, 23, 42, 0.9)">
          <motion.path
            d="M 35 65 L 60 65 L 65 72 L 65 78 L 30 78 L 30 72 Z"
            animate={{
              y: isHovered ? [0, -1.5, 0] : 0
            }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Truck windshield */}
          <motion.path
            d="M 52 65 L 58 65 L 61 70 L 52 70 Z"
            fill="rgba(245, 158, 11, 0.2)"
            animate={{
              y: isHovered ? [0, -1.5, 0] : 0
            }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
        
        {/* Truck Wheels */}
        <g fill="#1e293b" stroke="url(#amberGrad)" strokeWidth="1">
          <motion.circle
            cx="38"
            cy="78"
            r="4.5"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="57"
            cy="78"
            r="4.5"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </g>
        
        {/* High speed motion aerodynamic lines behind */}
        <motion.g stroke="#f59e0b" strokeWidth="1" opacity={isHovered ? 0.8 : 0.3}>
          <line x1="22" y1="68" x2="12" y2="68" />
          <line x1="25" y1="73" x2="16" y2="73" />
        </motion.g>

        <defs>
          <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Top Left dynamic telemetry label */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/40 border border-amber-500/20 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="font-mono text-[9px] text-amber-300 uppercase tracking-widest">LOGISTICS ENGINE v1.2</span>
      </div>
    </div>
  );
};

export const RenderIllustration: React.FC<{ name: string; isHovered?: boolean }> = ({ name, isHovered = false }) => {
  switch (name) {
    case "matias":
      return <MatiasBriebaIllustration isHovered={isHovered} />;
    case "zen":
      return <PortalZenIllustration isHovered={isHovered} />;
    case "sagrada":
      return <SagradaMadreIllustration isHovered={isHovered} />;
    case "fogar":
      return <FogarIllustration isHovered={isHovered} />;
    default:
      return null;
  }
};
