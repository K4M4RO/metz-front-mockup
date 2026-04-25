"use client";

import { useState } from "react";
import {
  CornerDownRight,
  Zap,
  MoveHorizontal,
  CircleDot,
  ChevronDown,
  Info,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart2
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type CategoryId = "corners" | "freekicks" | "throwins" | "penalties";

const CATEGORIES = [
  { id: "corners", label: "Corners", icon: CornerDownRight, description: "Analyse des trajectoires rentrantes, sortantes et zones d'impact.", count: 242 },
  { id: "freekicks", label: "Coups Francs", icon: Zap, description: "Analyse des coups francs directs et excentrés par zone.", count: 156 },
  { id: "throwins", label: "Touches", icon: MoveHorizontal, description: "Efficacité des touches longues et schémas de déviation.", count: 89 },
  { id: "penalties", label: "Penaltys", icon: CircleDot, description: "Historique des tireurs et patterns des gardiens adverses.", count: 32 },
] as const;

type SubFilter = { id: string; label: string };

const SUB_FILTERS: Record<CategoryId, SubFilter[]> = {
  corners: [
    { id: "inswing_l", label: "Rentrant Gauche" },
    { id: "inswing_r", label: "Rentrant Droit" },
    { id: "outswing_l", label: "Sortant Gauche" },
    { id: "outswing_r", label: "Sortant Droit" },
    { id: "short", label: "Joués à deux" },
  ],
  freekicks: [
    { id: "wide_l", label: "Excentré Gauche" },
    { id: "wide_r", label: "Excentré Droit" },
    { id: "direct", label: "Directs" },
    { id: "deep", label: "Lointains / Axiaux" },
  ],
  throwins: [
    { id: "long", label: "Touches Longues" },
    { id: "short", label: "Touches Courtes" },
  ],
  penalties: [
    { id: "shooters", label: "Tireurs" },
    { id: "history", label: "Historique" },
  ],
};

const LEAGUE_RANKING = [
  { rank: 1, team: "FC Metz", value: "18.4%", goals: 6, contact: "64%" },
  { rank: 2, team: "Stade de Reims", value: "16.2%", goals: 4, contact: "58%" },
  { rank: 3, team: "AJ Auxerre", value: "15.8%", goals: 5, contact: "55%" },
  { rank: 4, team: "Paris FC", value: "14.5%", goals: 3, contact: "52%" },
  { rank: 5, team: "Lorient", value: "13.9%", goals: 4, contact: "50%" },
];

type CPAEvent = {
  id: string;
  x: number;
  y: number;
  type: "goal" | "shot" | "contact" | "fail";
  player: string;
  match: string;
  date: string;
};

const CORNER_EVENTS: CPAEvent[] = [
  { id: "1", x: 250, y: 80, type: "goal", player: "G. Mikautadze", match: "vs St Étienne", date: "12/04/24" },
  { id: "2", x: 230, y: 90, type: "shot", player: "I. Traoré", match: "vs Bordeaux", date: "05/04/24" },
  { id: "3", x: 270, y: 75, type: "contact", player: "K. Kouyaté", match: "vs Paris FC", date: "28/03/24" },
  { id: "4", x: 240, y: 110, type: "fail", player: "L. Camara", match: "vs Caen", date: "20/03/24" },
  { id: "5", x: 260, y: 85, type: "goal", player: "G. Mikautadze", match: "vs Rodez", date: "15/03/24" },
  { id: "6", x: 220, y: 100, type: "shot", player: "A. Jallow", match: "vs Grenoble", date: "10/03/24" },
  { id: "7", x: 280, y: 95, type: "contact", player: "F. Candé", match: "vs Auxerre", date: "02/03/24" },
  { id: "8", x: 250, y: 120, type: "fail", player: "M. Udol", match: "vs Amiens", date: "25/02/24" },
];

type VizMode = "distribution" | "events";

// ─── Sub-components for Visualizations ───────────────────────────────────────

function CornerViz({ sub, mode }: { sub: string, mode: VizMode }) {
  const [hoveredEvent, setHoveredEvent] = useState<CPAEvent | null>(null);

  // Stats distribution logic
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
    <div className="w-full aspect-[16/10] min-h-[450px] border border-[var(--color-neutral-800)] rounded-xl relative bg-[#f8fafc] dark:bg-[#0f1710] overflow-hidden shadow-inner">
      {/* ── Background Grid ── */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />

      <svg viewBox="0 0 500 350" className="absolute inset-0 w-full h-full">
        {/* ── Pitch Markings (Professional Style) ── */}
        <g fill="none" stroke="var(--color-neutral-700)" strokeWidth="1.5" opacity="0.6">
          {/* Main Box */}
          <rect x="100" y="0" width="300" height="150" />
          {/* Small Box */}
          <rect x="175" y="0" width="150" height="50" />
          {/* Goal Line */}
          <line x1="0" y1="0" x2="500" y2="0" strokeWidth="3" />
          {/* Goal Frame */}
          <rect x="210" y="-5" width="80" height="5" fill="var(--color-neutral-400)" />
          {/* Penalty Arc */}
          <path d="M 180 150 A 70 70 0 0 0 320 150" />
          {/* Penalty Spot */}
          <circle cx="250" cy="110" r="2" fill="var(--color-neutral-400)" />
        </g>

        {/* ── Distribution Mode (Heatmap Squares) ── */}
        {mode === "distribution" && (
          <g>
            {gridCells.map((cell, i) => (
              <g key={i} className="transition-all duration-500">
                <rect 
                  x={cell.x} y={cell.y} width={cell.w} height={cell.h} 
                  fill={cell.level === 3 ? "rgba(139,26,43,0.7)" : cell.level === 2 ? "rgba(139,26,43,0.4)" : "rgba(139,26,43,0.15)"}
                  stroke="rgba(139,26,43,0.4)" strokeWidth="1"
                  className="animate-in fade-in duration-500"
                />
                <text 
                  x={cell.x + cell.w/2} y={cell.y + cell.h/2 + 5} 
                  textAnchor="middle" fill="white" 
                  className="text-[14px] font-black pointer-events-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cell.count}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* ── Events Mode (Dots) ── */}
        {mode === "events" && (
          <g>
            {CORNER_EVENTS.map(ev => (
              <g key={ev.id} 
                 onMouseEnter={() => setHoveredEvent(ev)}
                 onMouseLeave={() => setHoveredEvent(null)}
                 className="cursor-pointer"
              >
                <circle 
                  cx={ev.x} cy={ev.y} r={hoveredEvent?.id === ev.id ? 10 : 6} 
                  fill={getEventColor(ev.type)} 
                  stroke="white" strokeWidth="2"
                  className="transition-all duration-200"
                />
                {hoveredEvent?.id === ev.id && (
                  <circle cx={ev.x} cy={ev.y} r={15} fill={getEventColor(ev.type)} opacity="0.2" className="animate-ping" />
                )}
              </g>
            ))}
          </g>
        )}

        {/* ── Trajectory Arc (Subtle) ── */}
        <path 
          d="M 20 20 Q 150 200 250 80" 
          fill="none" 
          stroke="var(--color-primary-500)" 
          strokeWidth="2" 
          strokeDasharray="8 5" 
          opacity="0.3" 
          className="pointer-events-none"
        />
      </svg>
      
      {/* ── Tooltip ── */}
      {hoveredEvent && mode === "events" && (
        <div 
          className="absolute z-50 bg-white dark:bg-black/90 border border-[var(--color-neutral-700)] p-3 rounded-xl shadow-2xl pointer-events-none animate-in zoom-in-95 duration-200" 
          style={{ left: hoveredEvent.x, top: hoveredEvent.y + 20 }}
        >
          <div className="text-[9px] text-[var(--color-neutral-500)] uppercase font-black mb-1 tracking-tighter">
            {hoveredEvent.match} · {hoveredEvent.date}
          </div>
          <div className="text-sm font-black text-[var(--color-neutral-100)]" style={{ fontFamily: "var(--font-display)" }}>
            {hoveredEvent.player}
          </div>
          <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/10">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getEventColor(hoveredEvent.type) }} />
             <span className="text-[9px] text-neutral-400 uppercase font-black tracking-widest">{hoveredEvent.type}</span>
          </div>
        </div>
      )}

      {/* ── Legend Overlay ── */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg">
          <div className="text-[9px] font-black text-[var(--color-neutral-500)] uppercase mb-2 tracking-widest border-b border-black/5 dark:border-white/5 pb-1">
            Légende {mode === "events" ? "Événements" : "Distribution"}
          </div>
          {mode === "events" ? (
            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-neutral-100)] uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> But</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-neutral-100)] uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Tir</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-neutral-100)] uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Contact</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-[rgba(139,26,43,0.2)]" />
                <div className="w-3 h-3 rounded-sm bg-[rgba(139,26,43,0.5)]" />
                <div className="w-3 h-3 rounded-sm bg-[rgba(139,26,43,0.8)]" />
              </div>
              <span className="text-[9px] font-black text-[var(--color-neutral-400)] uppercase">Intensité Cible</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FreeKickViz({ sub }: { sub: string }) {
  return (
    <div className="w-full aspect-[16/10] min-h-[450px] border border-[var(--color-neutral-800)] rounded-xl relative bg-[#f8fafc] dark:bg-[#0f1710] overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />
      <svg viewBox="0 0 500 350" className="absolute inset-0 w-full h-full">
        <g fill="none" stroke="var(--color-neutral-700)" strokeWidth="1.5" opacity="0.6">
          <rect x="100" y="0" width="300" height="150" />
          <rect x="175" y="0" width="150" height="50" />
          <line x1="0" y1="0" x2="500" y2="0" strokeWidth="3" />
          <rect x="210" y="-5" width="80" height="5" fill="var(--color-neutral-400)" />
        </g>
        
        <path d="M 350 300 Q 280 150 250 50" fill="none" stroke="var(--color-primary-500)" strokeWidth="3" strokeDasharray="8 5" className="animate-pulse" />
        <circle cx="250" cy="50" r="20" fill="rgba(139,26,43,0.15)" stroke="var(--color-primary-500)" strokeWidth="1" />
        <circle cx="250" cy="50" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="1.5" />
      </svg>
      
      <div className="absolute bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl">
         <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-black tracking-widest">Zone Prioritaire</div>
         <div className="text-sm font-black text-[var(--color-neutral-100)]" style={{ fontFamily: "var(--font-display)" }}>Cadré / Plein Axe</div>
         <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#22C55E] font-bold">+8% xG</span>
            <span className="text-[10px] text-[var(--color-neutral-400)] font-medium">vs Moyenne Ligue</span>
         </div>
      </div>
    </div>
  );
}

function ThrowInViz({ sub }: { sub: string }) {
  return (
    <div className="w-full aspect-[16/10] min-h-[450px] border border-[var(--color-neutral-800)] rounded-xl relative bg-[#f8fafc] dark:bg-[#0f1710] overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />
      <svg viewBox="0 0 500 350" className="absolute inset-0 w-full h-full">
        <g fill="none" stroke="var(--color-neutral-700)" strokeWidth="1.5" opacity="0.6">
          <rect x="100" y="0" width="300" height="150" />
          <line x1="0" y1="0" x2="500" y2="0" strokeWidth="3" />
          <line x1="0" y1="0" x2="0" y2="350" strokeWidth="2" strokeDasharray="4 4" />
        </g>
        
        <path d="M 10 200 Q 150 100 280 80" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="280" cy="80" r="15" fill="rgba(245,158,11,0.15)" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="280" cy="80" r="4" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
      </svg>
      
      <div className="absolute bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl">
         <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-black tracking-widest">Zone Prioritaire</div>
         <div className="text-sm font-black text-[var(--color-neutral-100)]" style={{ fontFamily: "var(--font-display)" }}>Premier Poteau / Déviation</div>
         <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#22C55E] font-bold">+12% xG</span>
            <span className="text-[10px] text-[var(--color-neutral-400)] font-medium">vs Moyenne Ligue</span>
         </div>
      </div>
    </div>
  );
}

function PenaltyViz({ sub }: { sub: string }) {
  const zones = [
    { id: "tl", x: "10%", y: "15%", count: 2, color: "#C42B47", label: "Top Left" },
    { id: "tr", x: "80%", y: "15%", count: 1, color: "rgba(196,43,71,0.5)", label: "Top Right" },
    { id: "bl", x: "10%", y: "70%", count: 5, color: "#C42B47", label: "Bottom Left" },
    { id: "br", x: "80%", y: "70%", count: 0, color: "rgba(255,255,255,0.05)", label: "Bottom Right" },
    { id: "mid", x: "45%", y: "60%", count: 1, color: "rgba(196,43,71,0.3)", label: "Center" },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center relative rounded-lg bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] p-12">
       <div className="w-full max-w-4xl relative h-[450px] border-b-8 border-r-8 border-l-8 border-[var(--color-neutral-700)] rounded-b-lg">
          {/* Netting effect */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
          
          {/* Hit Zones */}
          {zones.map(z => (
             <div 
                key={z.id}
                className="absolute group cursor-help transition-transform hover:scale-110 -translate-x-1/2 -translate-y-1/2"
                style={{ left: z.x, top: z.y }}
             >
                <div 
                   className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-white/20 shadow-lg"
                   style={{ backgroundColor: z.color }}
                >
                   <span className="text-xl font-black text-white">{z.count}</span>
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                   {z.label}: {z.count} tirs
                </div>
             </div>
          ))}
       </div>
       <div className="absolute top-6 left-6 bg-[var(--color-neutral-800)]/90 backdrop-blur border border-[var(--color-neutral-700)] p-3 rounded-lg shadow-2xl">
          <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-bold">Zones de Frappe</div>
          <div className="text-xs font-black text-white">Derniers 24 mois</div>
       </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CPAPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [activeSub, setActiveSub] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [vizMode, setVizMode] = useState<VizMode>("distribution");

  const handleSelectCategory = (id: CategoryId) => {
    setSelectedCategory(id);
    setActiveSub(SUB_FILTERS[id][0].id);
    setSelectedTeam(null);
  };

  if (!selectedCategory) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[var(--color-neutral-950)] p-12">
        <div className="max-w-5xl w-full">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-[var(--color-neutral-100)] mb-2 uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Intelligence CPA</h1>
            <p className="text-[var(--color-neutral-500)] text-sm">Sélectionnez une catégorie pour analyser les performances de la Ligue 2.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] p-8 rounded-2xl text-left hover:border-[#C42B47]/50 transition-all hover:shadow-[0_0_40px_rgba(196,43,71,0.1)] overflow-hidden"
              >
                <div className="absolute -right-8 -bottom-8 text-white/5 group-hover:text-[#C42B47]/10 transition-colors">
                  <cat.icon size={160} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#C42B47]/10 flex items-center justify-center text-[#C42B47] mb-6 border border-[#C42B47]/20">
                    <cat.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-[var(--color-neutral-100)] mb-2 uppercase" style={{ fontFamily: "var(--font-display)" }}>{cat.label}</h3>
                  <p className="text-[var(--color-neutral-500)] text-xs mb-6 max-w-xs">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {cat.count} Événements analysés
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-neutral-800)] flex items-center justify-center group-hover:bg-[#C42B47] transition-colors">
                      <ChevronRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-neutral-950)] overflow-hidden">
      {/* ── TOP HORIZONTAL TABS ── */}
      <header className="flex-shrink-0 bg-[var(--color-neutral-900)] border-b border-[var(--color-neutral-800)] px-6 pt-2">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mr-4 p-2 hover:bg-white/5 rounded-lg transition-colors text-neutral-500"
          >
            <ChevronRight size={16} className="rotate-180" />
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`py-4 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${selectedCategory === cat.id
                  ? "border-[#C42B47] text-[#C42B47]"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT VERTICAL SIDEBAR ── */}
        <aside className="w-64 flex-shrink-0 bg-[var(--color-neutral-900)] border-r border-[var(--color-neutral-800)] flex flex-col">
          <div className="p-4 text-[10px] font-bold text-[var(--color-neutral-100)] uppercase tracking-widest border-b border-[var(--color-neutral-800)]" style={{ fontFamily: "var(--font-display)" }}>
            Variantes Tactics
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {SUB_FILTERS[selectedCategory].map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${activeSub === sub.id
                    ? "bg-[#C42B47]/10 border-[#C42B47]/30 text-[#C42B47]"
                    : "bg-transparent border-transparent text-neutral-400 hover:bg-white/5"
                  }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Header: Dynamic based on whether a team is selected */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {selectedTeam && (
                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-neutral-500"
                    >
                      <ChevronRight size={14} className="rotate-180" />
                    </button>
                  )}
                  <h2 className="text-2xl font-black text-[var(--color-neutral-100)] uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {selectedTeam ? `Analyse : ${selectedTeam}` : `Classement : ${SUB_FILTERS[selectedCategory].find(s => s.id === activeSub)?.label}`}
                  </h2>
                </div>
                <p className="text-xs text-neutral-500">
                  {selectedTeam
                    ? `Détails tactiques et zones de danger pour ${selectedTeam} sur ${SUB_FILTERS[selectedCategory].find(s => s.id === activeSub)?.label}.`
                    : `Efficacité basée sur les 50 dernières occurrences par équipe.`}
                </p>
              </div>
              {!selectedTeam && (
                <div className="flex gap-4">
                  <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] px-4 py-2 rounded-xl">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Moyenne Ligue xG</div>
                    <div className="text-lg font-black text-white">0.14</div>
                  </div>
                </div>
              )}
            </div>

            {!selectedTeam ? (
              /* Ranking Table View */
              <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 text-[10px] font-black text-[var(--color-neutral-400)] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                      <th className="px-6 py-4">Rang</th>
                      <th className="px-6 py-4">Équipe</th>
                      <th className="px-6 py-4">Conversion</th>
                      <th className="px-6 py-4">Buts</th>
                      <th className="px-6 py-4">1er Contact</th>
                      <th className="px-6 py-4 text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-neutral-800)]">
                    {LEAGUE_RANKING.map(team => (
                      <tr
                        key={team.rank}
                        onClick={() => setSelectedTeam(team.team)}
                        className="group hover:bg-[#C42B47]/5 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm font-black text-neutral-600">{team.rank}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-[10px] font-bold">EM</div>
                            <span className="text-sm font-bold text-[var(--color-neutral-100)] group-hover:text-[#C42B47] transition-colors">{team.team}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-500 font-mono">{team.value}</td>
                        <td className="px-6 py-4 text-sm text-neutral-300">{team.goals}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div className="h-full bg-[#C42B47]" style={{ width: team.contact }} />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-400">{team.contact}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-neutral-600 group-hover:text-[#C42B47]">
                            VOIR ANALYSE
                            <ChevronRight size={14} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Detailed Team View */
              /* Detailed Team View */
              <div className="animate-in fade-in zoom-in-95 duration-300">
                {selectedCategory === "penalties" ? (
                  <div className="space-y-6">
                    {/* Stats Row for Penalties */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-[var(--color-neutral-900)] p-6 rounded-2xl border border-[var(--color-neutral-800)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-500/10 rounded-lg"><Info size={16} className="text-blue-500" /></div>
                          <h4 className="text-[10px] font-black text-[var(--color-neutral-100)] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>Zones de Danger</h4>
                        </div>
                        <p className="text-[11px] text-[var(--color-neutral-400)] leading-relaxed">
                          Le tireur privilégie la force au sol. 58% des tirs sont dirigés vers le coin inférieur gauche.
                        </p>
                      </div>

                      <div className="bg-[var(--color-neutral-900)] p-6 rounded-2xl border border-[var(--color-neutral-800)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-orange-500/10 rounded-lg"><Zap size={16} className="text-orange-500" /></div>
                          <h4 className="text-[10px] font-black text-[var(--color-neutral-100)] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>Impact Tireurs</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[var(--color-neutral-400)]">Tireur A</span>
                            <span className="font-bold text-[var(--color-neutral-100)] uppercase tracking-tighter">Précision 92%</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[var(--color-neutral-400)]">Tireur B</span>
                            <span className="font-bold text-[var(--color-neutral-100)] uppercase tracking-tighter">Précision 78%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[var(--color-neutral-900)] p-6 rounded-2xl border border-[var(--color-neutral-800)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-500/10 rounded-lg"><BarChart2 size={16} className="text-green-500" /></div>
                          <h4 className="text-[10px] font-black text-[var(--color-neutral-100)] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>Conversion</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl font-black text-[var(--color-neutral-100)]">88%</span>
                          <div className="text-[9px] text-[var(--color-neutral-500)] uppercase font-bold leading-tight">
                            des penaltys <br /> aboutissent à un but.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Viz Area */}
                    <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl p-10 shadow-2xl">
                      <div className="text-center mb-10">
                        <h3 className="text-[10px] font-black text-[var(--color-neutral-400)] uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-display)" }}>Zones de Frappe (Derniers 24 mois)</h3>
                      </div>
                      <PenaltyViz sub={activeSub} />
                    </div>

                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5"
                    >
                      Retour au Classement
                    </button>
                  </div>
                ) : (
                  /* Standard 2-column layout for other categories */
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Target size={18} className="text-[#C42B47]" />
                          <h3 className="text-xs font-black text-[var(--color-neutral-100)] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>Terrain Parlant : {selectedTeam}</h3>
                        </div>
                        
                        {/* Viz Mode Selector */}
                        <div className="flex bg-[var(--color-neutral-800)] p-1 rounded-lg border border-white/5">
                          <button 
                            onClick={() => setVizMode("distribution")}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${vizMode === "distribution" ? "bg-[#C42B47] text-white" : "text-neutral-500 hover:text-white"}`}
                          >
                            Distribution
                          </button>
                          <button 
                            onClick={() => setVizMode("events")}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${vizMode === "events" ? "bg-[#C42B47] text-white" : "text-neutral-500 hover:text-white"}`}
                          >
                            Événements
                          </button>
                        </div>
                      </div>

                      {selectedCategory === "corners" && <CornerViz sub={activeSub} mode={vizMode} />}
                      {selectedCategory === "freekicks" && <FreeKickViz sub={activeSub} />}
                      {selectedCategory === "throwins" && <ThrowInViz sub={activeSub} />}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp size={18} className="text-green-500" />
                          <h3 className="text-xs font-black text-[var(--color-neutral-100)] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>Insight Performance</h3>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed italic">
                          {selectedCategory === "corners"
                            ? `"${selectedTeam} surperforme sur les ${activeSub.replace('_', ' ')} grâce à une excellente synchronisation des courses. 85% des ballons sont dirigés vers le premier poteau."`
                            : selectedCategory === "freekicks"
                              ? `"${selectedTeam} privilégie les frappes directes puissantes sur les ${activeSub}. Le mur adverse est souvent sollicité en début de match avant de chercher les angles."`
                              : selectedCategory === "throwins"
                                ? `"${selectedTeam} utilise les ${activeSub} comme de véritables centres. La zone de déviation est systématiquement occupée par l'attaquant de pointe."`
                                : ""
                          }
                        </p>
                      </div>

                      <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl p-6">
                        <h3 className="text-[10px] font-black text-[var(--color-neutral-400)] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-display)" }}>Cibles / Exécutants Clés</h3>
                        <div className="space-y-3">
                          {[
                            { name: "G. Mikautadze", val: "12 occurrences", danger: "90%" },
                            { name: "I. Traoré", val: "8 occurrences", danger: "75%" },
                            { name: "K. Kouyaté", val: "7 occurrences", danger: "60%" }
                          ].map((t, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5 hover:border-[#C42B47]/30 transition-colors">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[var(--color-neutral-100)]">{t.name}</span>
                                <span className="text-[9px] text-neutral-500">{t.val}</span>
                              </div>
                              <span className="text-[10px] font-black text-[#C42B47]">{t.danger} DANGER</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTeam(null)}
                        className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5"
                      >
                        Retour au Classement
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
