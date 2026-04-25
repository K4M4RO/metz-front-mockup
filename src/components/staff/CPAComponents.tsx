"use client";

import { useState } from "react";
import { Target, Info, Zap, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PenaltyShot = {
  id: string;
  x: number; // 0-100 (horizontal)
  y: number; // 0-100 (vertical, 0 is top)
  outcome: "goal" | "goalkeeper" | "blocked" | "post" | "miss";
  player: string;
  date: string;
};

export type CPAEvent = {
  id: string;
  x: number;
  y: number;
  type: "goal" | "shot" | "contact" | "fail";
  player: string;
  match: string;
  date: string;
};

export type VizMode = "distribution" | "events";

export const PENALTY_SHOTS: PenaltyShot[] = [
  { id: "p1", x: 75, y: 70, outcome: "goal", player: "G. Mikautadze", date: "12/04/24" },
  { id: "p2", x: 80, y: 75, outcome: "goal", player: "G. Mikautadze", date: "05/04/24" },
  { id: "p3", x: 72, y: 80, outcome: "goal", player: "G. Mikautadze", date: "28/03/24" },
  { id: "p4", x: 25, y: 65, outcome: "goalkeeper", player: "A. Jallow", date: "20/03/24" },
  { id: "p5", x: 30, y: 70, outcome: "goalkeeper", player: "A. Jallow", date: "15/03/24" },
  { id: "p6", x: 85, y: 82, outcome: "goal", player: "G. Mikautadze", date: "10/03/24" },
  { id: "p7", x: 15, y: 10, outcome: "miss", player: "L. Camara", date: "02/03/24" },
  { id: "p8", x: 50, y: 5, outcome: "post", player: "I. Traoré", date: "25/02/24" },
];

export const CORNER_EVENTS: CPAEvent[] = [
  { id: "1", x: 250, y: 80, type: "goal", player: "G. Mikautadze", match: "vs St Étienne", date: "12/04/24" },
  { id: "2", x: 230, y: 90, type: "shot", player: "I. Traoré", match: "vs Bordeaux", date: "05/04/24" },
  { id: "3", x: 270, y: 75, type: "contact", player: "K. Kouyaté", match: "vs Paris FC", date: "28/03/24" },
  { id: "4", x: 240, y: 110, type: "fail", player: "L. Camara", match: "vs Caen", date: "20/03/24" },
  { id: "5", x: 260, y: 85, type: "goal", player: "G. Mikautadze", match: "vs Rodez", date: "15/03/24" },
  { id: "6", x: 220, y: 100, type: "shot", player: "A. Jallow", match: "vs Grenoble", date: "10/03/24" },
  { id: "7", x: 280, y: 95, type: "contact", player: "F. Candé", match: "vs Auxerre", date: "02/03/24" },
  { id: "8", x: 250, y: 120, type: "fail", player: "M. Udol", match: "vs Amiens", date: "25/02/24" },
];

// ─── Visualizations ───────────────────────────────────────────────────────────

export function CornerViz({ mode, sub }: { mode: VizMode, sub: string }) {
  const [hoveredEvent, setHoveredEvent] = useState<CPAEvent | null>(null);

  const gridCells = [
    { x: 170, y: 40, w: 53, h: 40, count: 3, level: 3 },
    { x: 223, y: 40, w: 53, h: 40, count: 2, level: 2 },
    { x: 276, y: 40, w: 53, h: 40, count: 1, level: 1 },
    { x: 170, y: 80, w: 53, h: 40, count: 1, level: 1 },
    { x: 223, y: 80, w: 53, h: 40, count: 4, level: 3 },
    { x: 276, y: 80, w: 53, h: 40, count: 2, level: 2 },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "goal": return "#22C55E";
      case "shot": return "#F59E0B";
      case "contact": return "#3B82F6";
      default: return "#94a3b8";
    }
  };

  return (
    <div className="w-full aspect-[16/10] border border-[var(--color-neutral-800)] rounded-xl relative bg-[#f8fafc] dark:bg-[#0f1710] overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />
      <svg viewBox="0 0 500 350" className="absolute inset-0 w-full h-full">
        <g fill="none" stroke="var(--color-neutral-700)" strokeWidth="1.5" opacity="0.6">
          <rect x="100" y="0" width="300" height="150" />
          <rect x="175" y="0" width="150" height="50" />
          <line x1="0" y1="0" x2="500" y2="0" strokeWidth="3" />
          <rect x="210" y="-5" width="80" height="5" fill="var(--color-neutral-400)" />
          <path d="M 180 150 A 70 70 0 0 0 320 150" />
          <circle cx="250" cy="110" r="2" fill="var(--color-neutral-400)" />
        </g>

        {mode === "distribution" && (
          <g>
            {gridCells.map((cell, i) => (
              <g key={i}>
                <rect 
                  x={cell.x} y={cell.y} width={cell.w} height={cell.h} 
                  fill={cell.level === 3 ? "rgba(139,26,43,0.7)" : cell.level === 2 ? "rgba(139,26,43,0.4)" : "rgba(139,26,43,0.15)"}
                  stroke="rgba(139,26,43,0.4)" strokeWidth="1"
                />
                <text x={cell.x + cell.w/2} y={cell.y + cell.h/2 + 5} textAnchor="middle" fill="white" className="text-[14px] font-black pointer-events-none" style={{ fontFamily: "var(--font-display)" }}>
                  {cell.count}
                </text>
              </g>
            ))}
          </g>
        )}

        {mode === "events" && (
          <g>
            {CORNER_EVENTS.map(ev => (
              <g key={ev.id} onMouseEnter={() => setHoveredEvent(ev)} onMouseLeave={() => setHoveredEvent(null)} className="cursor-pointer">
                <circle cx={ev.x} cy={ev.y} r={hoveredEvent?.id === ev.id ? 10 : 6} fill={getEventColor(ev.type)} stroke="white" strokeWidth="2" className="transition-all duration-200" />
                {hoveredEvent?.id === ev.id && <circle cx={ev.x} cy={ev.y} r={15} fill={getEventColor(ev.type)} opacity="0.2" className="animate-ping" />}
              </g>
            ))}
          </g>
        )}
        {/* ── Trajectory Arc (Dynamic based on sub-filter) ── */}
        <path 
          d={
            sub.includes("r") 
              ? "M 480 20 Q 350 200 250 80" // Right corner
              : "M 20 20 Q 150 200 250 80"  // Left corner
          } 
          fill="none" 
          stroke={sub.includes("inswing") ? "#C42B47" : "#3B82F6"} 
          strokeWidth="3" 
          strokeDasharray="10 5" 
          opacity="0.8" 
          className="pointer-events-none animate-pulse"
        />
        {/* Start Point */}
        <circle cx={sub.includes("r") ? 480 : 20} cy={20} r={5} fill="white" stroke={sub.includes("inswing") ? "#C42B47" : "#3B82F6"} strokeWidth={2} />
      </svg>
      {hoveredEvent && mode === "events" && (
        <div className="absolute z-50 bg-white dark:bg-black/90 border border-[var(--color-neutral-700)] p-3 rounded-xl shadow-2xl pointer-events-none" style={{ left: hoveredEvent.x, top: hoveredEvent.y + 20 }}>
          <div className="text-[9px] text-neutral-500 uppercase font-black mb-1">{hoveredEvent.match} · {hoveredEvent.date}</div>
          <div className="text-sm font-black text-neutral-100">{hoveredEvent.player}</div>
          <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/10">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getEventColor(hoveredEvent.type) }} />
             <span className="text-[9px] text-neutral-400 uppercase font-black">{hoveredEvent.type}</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg">
          <div className="text-[9px] font-black text-neutral-500 uppercase mb-2 tracking-widest border-b border-black/5 dark:border-white/5 pb-1">Légende</div>
          {mode === "events" ? (
            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-100 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> But</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-100 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Tir</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-100 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Contact</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-[rgba(139,26,43,0.2)]" /><div className="w-3 h-3 rounded-sm bg-[rgba(139,26,43,0.5)]" /><div className="w-3 h-3 rounded-sm bg-[rgba(139,26,43,0.8)]" />
              </div>
              <span className="text-[9px] font-black text-neutral-400 uppercase">Intensité Cible</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FreeKickViz() {
  return (
    <div className="w-full aspect-[16/10] border border-[var(--color-neutral-800)] rounded-xl relative bg-[#f8fafc] dark:bg-[#0f1710] overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />
      <svg viewBox="0 0 500 350" className="absolute inset-0 w-full h-full">
        <g fill="none" stroke="var(--color-neutral-700)" strokeWidth="1.5" opacity="0.6">
          <rect x="100" y="0" width="300" height="150" /><rect x="175" y="0" width="150" height="50" /><line x1="0" y1="0" x2="500" y2="0" strokeWidth="3" /><rect x="210" y="-5" width="80" height="5" fill="var(--color-neutral-400)" />
        </g>
        <path d="M 350 300 Q 280 150 250 50" fill="none" stroke="var(--color-primary-500)" strokeWidth="3" strokeDasharray="8 5" className="animate-pulse" />
        <circle cx="250" cy="50" r="20" fill="rgba(139,26,43,0.15)" stroke="var(--color-primary-500)" strokeWidth="1" />
        <circle cx="250" cy="50" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="absolute bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl">
         <div className="text-[10px] text-neutral-500 mb-1 uppercase font-black tracking-widest">Zone Prioritaire</div>
         <div className="text-sm font-black text-neutral-100">Cadré / Plein Axe</div>
      </div>
    </div>
  );
}

export function ThrowInViz() {
  return (
    <div className="w-full aspect-[16/10] border border-[var(--color-neutral-800)] rounded-xl relative bg-[#f8fafc] dark:bg-[#0f1710] overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />
      <svg viewBox="0 0 500 350" className="absolute inset-0 w-full h-full">
        <g fill="none" stroke="var(--color-neutral-700)" strokeWidth="1.5" opacity="0.6">
          <rect x="100" y="0" width="300" height="150" /><line x1="0" y1="0" x2="500" y2="0" strokeWidth="3" /><line x1="0" y1="0" x2="0" y2="350" strokeWidth="2" strokeDasharray="4 4" />
        </g>
        <path d="M 10 200 Q 150 100 280 80" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="280" cy="80" r="15" fill="rgba(245,158,11,0.15)" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="280" cy="80" r="4" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="absolute bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl">
         <div className="text-[10px] text-neutral-500 mb-1 uppercase font-black tracking-widest">Zone Prioritaire</div>
         <div className="text-sm font-black text-neutral-100">Premier Poteau / Déviation</div>
      </div>
    </div>
  );
}

export function PenaltyViz() {
  const [hoveredShot, setHoveredShot] = useState<PenaltyShot | null>(null);

  const OUTCOME_COLORS = {
    goal: "#4ADE80",
    goalkeeper: "#F59E0B",
    blocked: "#FACC15",
    post: "#C084FC",
    miss: "#F87171",
  };

  const OUTCOME_LABELS = {
    goal: "But",
    goalkeeper: "Gardien",
    blocked: "Bloqué",
    post: "Poteau",
    miss: "Manqué",
  };

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#0f1710] border border-[var(--color-neutral-800)] rounded-xl p-8 shadow-inner overflow-hidden">
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-8 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-widest">FC Metz</span>
          <span className="text-[11px] text-neutral-400 tracking-tighter">• 24 matchs • penalty</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[11px] text-neutral-400">- / 8</span>
           <div className="flex gap-1">
              <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors text-neutral-400"><ChevronLeft size={14} className="rotate-0" /></button>
              <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors text-neutral-400"><ChevronRight size={14} /></button>
           </div>
        </div>
      </div>

      {/* Goal Container */}
      <div className="relative w-full max-w-2xl aspect-[2.5/1] mb-8">
        {/* The Frame (External padding for misses) */}
        <div className="absolute inset-0 flex items-end justify-center">
          {/* The Goal itself */}
          <div className="relative w-[85%] h-[85%] border-[10px] border-[#64748b] bg-white dark:bg-black/20 rounded-t-sm shadow-xl">
             {/* The Grid */}
             <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-neutral-400" />
                ))}
             </div>

             {/* Inner goal shots */}
             {PENALTY_SHOTS.filter(s => s.outcome !== "miss").map(shot => (
               <div 
                 key={shot.id}
                 className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 cursor-help"
                 style={{ 
                   left: `${shot.x}%`, 
                   top: `${shot.y}%`, 
                   backgroundColor: OUTCOME_COLORS[shot.outcome],
                   transform: "translate(-50%, -50%)"
                 }}
                 onMouseEnter={() => setHoveredShot(shot)}
                 onMouseLeave={() => setHoveredShot(null)}
               />
             ))}
          </div>
        </div>

        {/* Misses (Outside the goal) */}
        {PENALTY_SHOTS.filter(s => s.outcome === "miss").map(shot => (
          <div 
            key={shot.id}
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 cursor-help"
            style={{ 
              left: `${shot.x}%`, 
              top: `${shot.y}%`, 
              backgroundColor: OUTCOME_COLORS[shot.outcome],
              transform: "translate(-50%, -50%)"
            }}
            onMouseEnter={() => setHoveredShot(shot)}
            onMouseLeave={() => setHoveredShot(null)}
          />
        ))}

        {/* Tooltip */}
        {hoveredShot && (
          <div className="absolute z-50 bg-black/90 text-white p-2 rounded-lg text-[10px] shadow-2xl pointer-events-none" style={{ left: `${hoveredShot.x}%`, top: `${hoveredShot.y - 10}%` }}>
            <div className="font-bold">{hoveredShot.player}</div>
            <div className="text-neutral-400">{hoveredShot.date}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {(Object.keys(OUTCOME_COLORS) as Array<keyof typeof OUTCOME_COLORS>).map(outcome => (
          <div key={outcome} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: OUTCOME_COLORS[outcome] }} />
            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{OUTCOME_LABELS[outcome]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
