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

// ─── Sub-components for Visualizations ───────────────────────────────────────

function CornerViz({ sub }: { sub: string }) {
  return (
    <div className="w-full aspect-[4/5] min-h-[400px] border-2 border-[var(--color-neutral-800)] rounded-lg relative bg-[#0f1710] overflow-hidden">
      {/* Large Box */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-2 border-[var(--color-neutral-800)]" />
      {/* Small Box */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border-2 border-[var(--color-neutral-800)]" />
      {/* Goal */}
      <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-[15%] h-[4px] bg-white rounded-t shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      
      {/* Trajectories (Mock) */}
      <svg className="absolute inset-0 w-full h-full">
         <path 
            d="M 10 10 Q 150 150 250 80" 
            fill="none" 
            stroke="#C42B47" 
            strokeWidth="3" 
            strokeDasharray="6 4"
            className="animate-pulse"
         />
         {/* Impact zones */}
         <circle cx="250" cy="80" r="20" fill="rgba(196,43,71,0.2)" stroke="#C42B47" strokeWidth="1" />
         <circle cx="230" cy="90" r="15" fill="rgba(196,43,71,0.15)" stroke="#C42B47" strokeWidth="1" opacity="0.6" />
         <circle cx="270" cy="75" r="12" fill="rgba(196,43,71,0.15)" stroke="#C42B47" strokeWidth="1" opacity="0.4" />
      </svg>
      
      {/* Player dots */}
      <div className="absolute top-[80px] left-[250px] w-3 h-3 bg-[#C42B47] rounded-full shadow-[0_0_8px_#C42B47] border border-white -translate-x-1/2 -translate-y-1/2" />
      
      {/* Overlay info */}
      <div className="absolute bottom-6 left-6 bg-[var(--color-neutral-800)]/90 backdrop-blur border border-[var(--color-neutral-700)] p-4 rounded-lg shadow-2xl">
         <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-bold">Zone Prioritaire</div>
         <div className="text-sm font-black text-white">Premier Poteau</div>
         <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#22C55E]">+12% xG</span>
            <span className="text-[10px] text-[var(--color-neutral-400)]">vs Moyenne Ligue</span>
         </div>
      </div>
    </div>
  );
}

function FreeKickViz({ sub }: { sub: string }) {
  return (
    <div className="w-full aspect-[4/5] min-h-[400px] border-2 border-[var(--color-neutral-800)] rounded-lg relative bg-[#0f1710] overflow-hidden">
      {/* Large Box */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-2 border-[var(--color-neutral-800)]" />
      {/* Small Box */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border-2 border-[var(--color-neutral-800)]" />
      {/* Goal */}
      <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-[15%] h-[4px] bg-white rounded-t shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      
      {/* Trajectories (Mock) */}
      <svg className="absolute inset-0 w-full h-full">
         <path 
            d="M 350 350 Q 280 200 250 50" 
            fill="none" 
            stroke="#C42B47" 
            strokeWidth="3" 
            strokeDasharray="6 4"
            className="animate-pulse"
         />
         {/* Impact zones */}
         <circle cx="250" cy="50" r="20" fill="rgba(196,43,71,0.2)" stroke="#C42B47" strokeWidth="1" />
         <circle cx="230" cy="60" r="15" fill="rgba(196,43,71,0.15)" stroke="#C42B47" strokeWidth="1" opacity="0.6" />
         <circle cx="270" cy="45" r="12" fill="rgba(196,43,71,0.15)" stroke="#C42B47" strokeWidth="1" opacity="0.4" />
      </svg>
      
      {/* Player dots */}
      <div className="absolute top-[50px] left-[250px] w-3 h-3 bg-[#C42B47] rounded-full shadow-[0_0_8px_#C42B47] border border-white -translate-x-1/2 -translate-y-1/2" />
      
      {/* Overlay info */}
      <div className="absolute bottom-6 left-6 bg-[var(--color-neutral-800)]/90 backdrop-blur border border-[var(--color-neutral-700)] p-4 rounded-lg shadow-2xl">
         <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-bold">Zone Prioritaire</div>
         <div className="text-sm font-black text-white">Cadré / Plein Axe</div>
         <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#22C55E]">+8% xG</span>
            <span className="text-[10px] text-[var(--color-neutral-400)]">vs Moyenne Ligue</span>
         </div>
      </div>
    </div>
  );
}

function ThrowInViz({ sub }: { sub: string }) {
  return (
    <div className="w-full aspect-[4/5] min-h-[400px] border-2 border-[var(--color-neutral-800)] rounded-lg relative bg-[#0f1710] overflow-hidden flex items-start justify-center">
      <div className="w-full h-[60%] border-b-2 border-[var(--color-neutral-800)] relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[70%] border-2 border-[var(--color-neutral-800)]" />
         <div className="absolute top-0 left-0 h-full w-[5%] bg-yellow-500/10 border-r border-dashed border-yellow-500/30" />
         <div className="absolute top-0 right-0 h-full w-[5%] bg-yellow-500/10 border-l border-dashed border-yellow-500/30" />
         
         {/* Trajectory for throw-in */}
         <svg className="absolute inset-0 w-full h-full">
            <path d="M 20 150 Q 150 50 280 80" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="280" cy="80" r="15" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1" />
         </svg>
         <div className="absolute top-[80px] left-[280px] w-2.5 h-2.5 bg-yellow-500 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
         
         <div className="absolute bottom-4 left-6 text-[9px] text-[var(--color-neutral-500)] uppercase font-bold tracking-widest bg-black/40 px-2 py-1 rounded z-10">Dernier Tiers</div>
      </div>
      
      {/* Overlay info */}
      <div className="absolute bottom-6 left-6 bg-[var(--color-neutral-800)]/90 backdrop-blur border border-[var(--color-neutral-700)] p-4 rounded-lg shadow-2xl z-10">
         <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-bold">Zone Prioritaire</div>
         <div className="text-sm font-black text-white">Premier Poteau / Déviation</div>
         <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#22C55E]">+12% xG</span>
            <span className="text-[10px] text-[var(--color-neutral-400)]">vs Moyenne Ligue</span>
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
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Intelligence CPA</h1>
            <p className="text-neutral-500 text-sm">Sélectionnez une catégorie pour analyser les performances de la Ligue 2.</p>
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
                  <h3 className="text-xl font-black text-white mb-2 uppercase">{cat.label}</h3>
                  <p className="text-neutral-500 text-xs mb-6 max-w-xs">{cat.description}</p>
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
          <div className="p-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest border-b border-[var(--color-neutral-800)]">
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
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
                    <tr className="bg-black/20 text-[10px] font-black text-neutral-500 uppercase">
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
                            <span className="text-sm font-bold text-white group-hover:text-[#C42B47] transition-colors">{team.team}</span>
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
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Zones de Danger</h4>
                        </div>
                        <p className="text-[11px] text-[var(--color-neutral-400)] leading-relaxed">
                          Le tireur privilégie la force au sol. 58% des tirs sont dirigés vers le coin inférieur gauche.
                        </p>
                      </div>

                      <div className="bg-[var(--color-neutral-900)] p-6 rounded-2xl border border-[var(--color-neutral-800)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-orange-500/10 rounded-lg"><Zap size={16} className="text-orange-500" /></div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Impact Tireurs</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[var(--color-neutral-400)]">Tireur A</span>
                            <span className="font-bold text-white uppercase tracking-tighter">Précision 92%</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[var(--color-neutral-400)]">Tireur B</span>
                            <span className="font-bold text-white uppercase tracking-tighter">Précision 78%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[var(--color-neutral-900)] p-6 rounded-2xl border border-[var(--color-neutral-800)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-500/10 rounded-lg"><BarChart2 size={16} className="text-green-500" /></div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Conversion</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl font-black text-white">88%</span>
                          <div className="text-[9px] text-[var(--color-neutral-500)] uppercase font-bold leading-tight">
                            des penaltys <br /> aboutissent à un but.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Viz Area */}
                    <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl p-10 shadow-2xl">
                      <div className="text-center mb-10">
                        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Zones de Frappe (Derniers 24 mois)</h3>
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
                          <h3 className="text-xs font-black text-white uppercase tracking-widest">Terrain Parlant : {selectedTeam}</h3>
                        </div>
                        <div className="text-[10px] font-bold text-neutral-500 bg-black/30 px-2 py-1 rounded">ÉCHANTILLON : 50 DERNIERS</div>
                      </div>

                      {selectedCategory === "corners" && <CornerViz sub={activeSub} />}
                      {selectedCategory === "freekicks" && <FreeKickViz sub={activeSub} />}
                      {selectedCategory === "throwins" && <ThrowInViz sub={activeSub} />}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp size={18} className="text-green-500" />
                          <h3 className="text-xs font-black text-white uppercase tracking-widest">Insight Performance</h3>
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
                        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">Cibles / Exécutants Clés</h3>
                        <div className="space-y-3">
                          {[
                            { name: "G. Mikautadze", val: "12 occurrences", danger: "90%" },
                            { name: "I. Traoré", val: "8 occurrences", danger: "75%" },
                            { name: "K. Kouyaté", val: "7 occurrences", danger: "60%" }
                          ].map((t, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5 hover:border-[#C42B47]/30 transition-colors">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-white">{t.name}</span>
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
