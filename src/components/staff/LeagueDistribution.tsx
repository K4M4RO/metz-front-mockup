"use client";

import Image from "next/image";
import { Info } from "lucide-react";

interface TeamPoint {
  id: string;
  name: string;
  value: number;
  isOpponent?: boolean;
  isMetz?: boolean;
}

interface LeagueDistributionProps {
  title: string;
  metricLabel: string;
  description: string;
  teams: TeamPoint[];
  minLabel?: string;
  maxLabel?: string;
}

export function LeagueDistribution({ 
  title, 
  metricLabel, 
  description, 
  teams,
  minLabel = "Pire",
  maxLabel = "Meilleur"
}: LeagueDistributionProps) {
  // Sorting to find extremes
  const sorted = [...teams].sort((a, b) => a.value - b.value);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const metz = teams.find(t => t.isMetz);
  const opponent = teams.find(t => t.isOpponent);

  const getPos = (val: number) => {
    const range = max.value - min.value || 1;
    return ((val - min.value) / range) * 100;
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6 transition-all hover:bg-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{title}</h4>
          <div className="group relative">
            <Info size={12} className="text-neutral-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/95 border border-white/10 rounded-lg text-[9px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {description}
            </div>
          </div>
        </div>
        <div className="text-[10px] font-bold text-[#C42B47] uppercase tracking-widest bg-[#C42B47]/10 px-2 py-1 rounded">
          {metricLabel}
        </div>
      </div>

      <div className="relative h-12 flex items-center">
        {/* The Line */}
        <div className="absolute w-full h-[1px] bg-white/20" />
        
        {/* Background Dots */}
        {teams.map((t, i) => (
          <div 
            key={i} 
            className="absolute w-1.5 h-1.5 rounded-full bg-neutral-600 transition-all"
            style={{ left: `${getPos(t.value)}%`, transform: 'translateX(-50%)' }}
          />
        ))}

        {/* Highlights: Logos */}
        
        {/* Min Team */}
        <div className="absolute flex flex-col items-center gap-1" style={{ left: '0%', transform: 'translateX(-50%)' }}>
          <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
             <span className="text-[8px] font-bold text-neutral-500">{min.name.substring(0,2).toUpperCase()}</span>
          </div>
          <span className="text-[7px] font-bold text-neutral-500 uppercase">{minLabel}</span>
        </div>

        {/* Max Team */}
        <div className="absolute flex flex-col items-center gap-1" style={{ left: '100%', transform: 'translateX(-50%)' }}>
          <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
             <span className="text-[8px] font-bold text-neutral-500">{max.name.substring(0,2).toUpperCase()}</span>
          </div>
          <span className="text-[7px] font-bold text-neutral-500 uppercase">{maxLabel}</span>
        </div>

        {/* Opponent */}
        {opponent && (
          <div className="absolute flex flex-col items-center gap-1 z-10" style={{ left: `${getPos(opponent.value)}%`, transform: 'translateX(-50%)' }}>
            <div className="w-8 h-8 rounded-full bg-white border-2 border-[#F59E0B] flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.3)]">
               <span className="text-[10px] font-black text-black">{opponent.name.substring(0,2).toUpperCase()}</span>
            </div>
            <span className="text-[8px] font-black text-[#F59E0B] uppercase">{opponent.name}</span>
          </div>
        )}

        {/* FC Metz */}
        {metz && (
          <div className="absolute flex flex-col items-center gap-1 z-20" style={{ left: `${getPos(metz.value)}%`, transform: 'translateX(-50%)' }}>
            <div className="w-10 h-10 rounded-full bg-[#C42B47] border-2 border-white flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(196,43,71,0.4)]">
               <Image src="/fc-metz-logo.png" alt="FC Metz" width={24} height={24} className="object-contain" />
            </div>
            <span className="text-[8px] font-black text-[#C42B47] uppercase tracking-tighter">FC Metz</span>
          </div>
        )}
      </div>
    </div>
  );
}
