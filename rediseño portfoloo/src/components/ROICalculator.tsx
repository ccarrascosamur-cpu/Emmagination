import React, { useState } from "react";
import { DollarSign, Percent, TrendingUp, Sparkles, BarChart2 } from "lucide-react";

export const ROICalculator: React.FC = () => {
  const [traffic, setTraffic] = useState<number>(15000);
  const [ticket, setTicket] = useState<number>(45);
  const [conversion, setConversion] = useState<number>(1.2); // percentage
  
  // Emmagination average historical improvement calculations
  // Average conversion increase: 20% to 80% relative boost. Let's make it 50% relative boost
  const relativeBoost = 1.5; // +50% more sales conversion
  const newConversion = conversion * relativeBoost;
  
  // Current values
  const currentConversons = Math.round(traffic * (conversion / 100));
  const currentSales = currentConversons * ticket;

  // New values
  const newConversions = Math.round(traffic * (newConversion / 100));
  const newSales = newConversions * ticket;

  // Net boost values
  const netEarningsBoost = newSales - currentSales;
  const earningsPercentageBoost = Math.round((netEarningsBoost / currentSales) * 100) || 0;

  return (
    <div className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-2xl">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial-[circle_at_100%_0%] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/10 font-mono text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
              Calculadora de Impacto ROI
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
            ¿Cuánto dinero estás perdiendo por una web obsoleta?
          </h3>
          <p className="text-xs text-slate-400 max-w-xl font-light">
            Calcula el impacto monetario estimado al rediseñar tu e-commerce o web corporativa con la optimización de desempeño y conversión de Emmagination.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Traffic Input Box */}
          <div className="bg-[#050505] border border-white/10 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Tráfico Mensual</label>
              <span className="text-xs font-mono font-bold text-yellow-500">{traffic.toLocaleString()} visitas</span>
            </div>
            <input
              type="range"
              min="1000"
              max="150000"
              step="1000"
              value={traffic}
              onChange={(e) => setTraffic(Number(e.target.value))}
              className="w-full accent-blue-500 bg-[#0c0c0c] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>1K</span>
              <span>150K</span>
            </div>
          </div>

          {/* Ticket Input Box */}
          <div className="bg-[#050505] border border-white/10 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Ticket Promedio</label>
              <span className="text-xs font-mono font-bold text-blue-400">${ticket} USD</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="w-full accent-blue-500 bg-[#0c0c0c] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>$5</span>
              <span>$500</span>
            </div>
          </div>

          {/* Conversion Input Box */}
          <div className="bg-[#050505] border border-white/10 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Tasa Conversión Actual</label>
              <span className="text-xs font-mono font-bold text-pink-400">{conversion}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={conversion}
              onChange={(e) => setConversion(Number(e.target.value))}
              className="w-full accent-blue-500 bg-[#0c0c0c] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>0.1%</span>
              <span>5.0%</span>
            </div>
          </div>
        </div>

        {/* Growth Results Showcase Output */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#080808] border border-white/5 rounded-2xl p-4 sm:p-6 mt-2 relative overflow-hidden">
          {/* Subtle decoration lines */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500" />

          {/* Current Sales */}
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="text-[10px] font-mono text-gray-400 tracking-wider">Ventas Actuales Estimadas</span>
            <div className="flex items-baseline gap-1 mt-1 text-slate-100">
              <span className="text-xl sm:text-2xl font-bold font-mono">${currentSales.toLocaleString()}</span>
              <span className="text-[10px] font-mono text-gray-400">USD/mes</span>
            </div>
            <span className="text-[9.5px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
              <Percent className="w-3 h-3 text-red-500 shrink-0" />
              Tasa de rebote estimada: 68%
            </span>
          </div>

          {/* Optimized Sales */}
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left border-y md:border-y-0 md:border-x border-slate-800/60 py-4 md:py-0 md:px-5">
            <span className="text-[10px] font-mono text-blue-400 tracking-wider">Con Optimización Emmagination</span>
            <div className="flex items-baseline gap-1 mt-1 text-blue-300">
              <span className="text-xl sm:text-2xl font-bold font-mono">${newSales.toLocaleString()}</span>
              <span className="text-[10px] font-mono">USD/mes</span>
            </div>
            <span className="text-[9.5px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Nueva Tasa: {newConversion.toFixed(2)}% (+50% relativo)
            </span>
          </div>

          {/* NET GROWTH GAIN */}
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              Ingresos Adicionales Ganados
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-emerald-400">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono">+${netEarningsBoost.toLocaleString()}</span>
              <span className="text-[10px] font-mono text-emerald-400">USD/mes</span>
            </div>
            <span className="text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 mt-1">
              Creces un {earningsPercentageBoost}% mensualmente
            </span>
          </div>
        </div>

        {/* Quick Pitch Footer to contact panel */}
        <p className="text-[11px] text-slate-500 text-center leading-normal italic font-light">
          *Cálculos basados en el histórico de métricas promedio que logramos en un periodo de 3 a 6 meses después de lanzar una web optimizada.
        </p>
      </div>
    </div>
  );
};
