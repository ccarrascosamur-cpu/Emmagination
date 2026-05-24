import React, { useState } from "react";
import { motion } from "motion/react";
import { ChartDataPoint } from "../types";

interface MetricChartProps {
  data: ChartDataPoint[];
  color: string;
  textColor: string;
  id: string;
}

export const MetricChart: React.FC<MetricChartProps> = ({ data, color, textColor, id }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const padding = 25;
  const width = 450;
  const height = 180;
  
  // Find min & max to scale values
  const allValues = data.flatMap(d => [d.before, d.after]);
  const maxValue = Math.max(...allValues, 10) * 1.1; 
  const minValue = 0;

  const pointsCount = data.length;

  // Convert coordinate functions
  const getX = (index: number) => {
    return padding + (index * (width - padding * 2)) / (pointsCount - 1);
  };

  const getY = (val: number) => {
    const scale = (height - padding * 2) / (maxValue - minValue);
    return height - padding - (val - minValue) * scale;
  };

  // Generate SVG path for "after" (Emmagination's redesigned performance)
  const afterCoords = data.map((d, i) => ({ x: getX(i), y: getY(d.after) }));
  const afterLinePath = afterCoords.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );
  const afterAreaPath = `${afterLinePath} L ${afterCoords[afterCoords.length - 1].x} ${height - padding} L ${afterCoords[0].x} ${height - padding} Z`;

  // Generate SVG path for "before" (legacy website performance)
  const beforeCoords = data.map((d, i) => ({ x: getX(i), y: getY(d.before) }));
  const beforeLinePath = beforeCoords.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );
  const beforeAreaPath = `${beforeLinePath} L ${beforeCoords[beforeCoords.length - 1].x} ${height - padding} L ${beforeCoords[0].x} ${height - padding} Z`;

  // Color mappings
  const strokeColor = id === "matias" ? "#a816f0" : id === "portal-zen" ? "#0ea5e9" : id === "sagrada-madre" ? "#ec4899" : "#f59e0b";
  const glowId = `areaGlow-${id}`;

  return (
    <div className="w-full bg-[#110D27]/85 border border-[#1E1940] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 font-mono">RENDIMIENTO HISTÓRICO (12 MESES)</span>
          <h4 className="text-[14px] font-semibold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
            Tráfico / Conversión Mensual
            <span className="text-[11px] font-normal px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 font-mono">
              + ROI Optimizada
            </span>
          </h4>
        </div>
        
        {/* Legends */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="text-gray-400">Antes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
            <span className="text-white">Después (Emmagination)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={glowId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="beforeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
          <line x1={padding} y1={(padding + height - padding) / 2} x2={width - padding} y2={(padding + height - padding) / 2} stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.07)" />

          {/* Area under 'Before' */}
          <path d={beforeAreaPath} fill="url(#beforeGrad)" />
          {/* Line for 'Before' */}
          <path d={beforeLinePath} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.65" />

          {/* Area under 'After' */}
          <motion.path
            d={afterAreaPath}
            fill={`url(#${glowId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Line for 'After' */}
          <motion.path
            d={afterLinePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Y Axis Mini labels */}
          <text x={padding - 5} y={padding + 4} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" textAnchor="end">MAX</text>
          <text x={padding - 5} y={height - padding + 3} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" textAnchor="end">MIN</text>

          {/* Month labels along X Axis */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIdx === i;
            return (
              <g key={d.month}>
                {i % 2 === 0 && (
                  <text
                    x={x}
                    y={height - padding + 13}
                    fill={isHovered ? "white" : "rgba(255,255,255,0.3)"}
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="transition-colors duration-200"
                  >
                    {d.month}
                  </text>
                )}
                {/* Interactive slide-over trigger areas */}
                <rect
                  x={x - (width - padding * 2) / (pointsCount - 1) / 2}
                  y={0}
                  width={(width - padding * 2) / (pointsCount - 1)}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                />
              </g>
            );
          })}

          {/* Interactive Highlight Details */}
          {hoveredIdx !== null && (
            <g>
              {/* Vertical guideline */}
              <line
                x1={getX(hoveredIdx)}
                y1={padding}
                x2={getX(hoveredIdx)}
                y2={height - padding}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="2"
              />

              {/* Red marker 'Before' */}
              <circle
                cx={getX(hoveredIdx)}
                cy={getY(data[hoveredIdx].before)}
                r="4.5"
                fill="#ef4444"
                stroke="#090710"
                strokeWidth="1.5"
              />

              {/* Accent marker 'After' */}
              <circle
                cx={getX(hoveredIdx)}
                cy={getY(data[hoveredIdx].after)}
                r="5.5"
                fill={strokeColor}
                stroke="#090710"
                strokeWidth="2"
              />
              <circle
                cx={getX(hoveredIdx)}
                cy={getY(data[hoveredIdx].after)}
                r="9"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Details overlay */}
        {hoveredIdx !== null && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/90 border border-[#2E2856] rounded-md shadow-lg flex items-center gap-2.5 z-10 font-mono text-[10px]">
            <span className="text-white font-bold">{data[hoveredIdx].month}:</span>
            <div className="flex items-center gap-1.5 text-red-400">
              <span>Antes:</span>
              <span className="font-semibold">{data[hoveredIdx].before}x</span>
            </div>
            <div className="w-px h-2.5 bg-[#2E2856]" />
            <div className="flex items-center gap-1.5" style={{ color: strokeColor }}>
              <span>Ahora:</span>
              <span className="font-bold">{data[hoveredIdx].after}x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
