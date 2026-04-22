"use client";

import { useState } from "react";
import { 
  BarChart2, 
  CornerDownRight, 
  Zap, 
  MoveHorizontal, 
  CircleDot,
  ChevronDown,
  Info
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type CategoryId = "overview" | "corners" | "freekicks" | "throwins" | "penalties";

const CATEGORIES = [
  { id: "overview",  label: "Overview",      icon: BarChart2 },
  { id: "corners",   label: "Corners",       icon: CornerDownRight },
  { id: "freekicks", label: "Coups Francs",  icon: Zap },
  { id: "throwins",  label: "Touches",       icon: MoveHorizontal },
  { id: "penalties", label: "Penaltys",      icon: CircleDot },
] as const;

type SubFilter = { id: string; label: string };

const SUB_FILTERS: Record<CategoryId, SubFilter[]> = {
  overview: [],
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

const LEAGUE_STATS = [
  { rank: 1, team: "FC Metz", value: 0.18, goals: 5, firstContact: 62 },
  { rank: 2, team: "Stade de Reims", value: 0.16, goals: 4, firstContact: 58 },
  { rank: 3, team: "Lens", value: 0.15, goals: 3, firstContact: 55 },
  { rank: 4, team: "Lille", value: 0.14, goals: 4, firstContact: 51 },
  { rank: 5, team: "OM", value: 0.13, goals: 3, firstContact: 48 },
  { rank: 6, team: "PSG", value: 0.12, goals: 6, firstContact: 45 },
];

const INDICATORS = [
  { id: "xg", label: "xG générés / CPA" },
  { id: "goals", label: "Buts marqués" },
  { id: "contact", label: "% 1ers contacts gagnés" },
  { id: "xg_conceded", label: "xG concédés / CPA" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PenaltyGoal({ subFilter }: { subFilter: string }) {
  // Mock data for penalty zones
  const zones = [
    { id: "tl", x: "10%", y: "15%", count: 2, color: "#C42B47", label: "Top Left" },
    { id: "tr", x: "80%", y: "15%", count: 1, color: "rgba(196,43,71,0.5)", label: "Top Right" },
    { id: "bl", x: "10%", y: "70%", count: 5, color: "#C42B47", label: "Bottom Left" },
    { id: "br", x: "80%", y: "70%", count: 0, color: "rgba(255,255,255,0.05)", label: "Bottom Right" },
    { id: "mid", x: "45%", y: "60%", count: 1, color: "rgba(196,43,71,0.3)", label: "Center" },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
       <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-xs font-bold text-[var(--color-neutral-500)] uppercase mb-8">Zones de Frappe (Derniers 24 mois)</h3>
          
          <div className="relative w-full max-w-2xl h-64 border-b-8 border-r-8 border-l-8 border-[var(--color-neutral-700)] rounded-b-lg">
             {/* Netting effect */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
             
             {/* Hit Zones */}
             {zones.map(z => (
                <div 
                   key={z.id}
                   className="absolute group cursor-help transition-transform hover:scale-110"
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
       </div>
       
       {/* Shooters List */}
       <div className="grid grid-cols-2 gap-6">
          <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] p-4">
             <h4 className="text-[10px] font-black text-[var(--color-neutral-500)] uppercase mb-4">Tireurs Réguliers</h4>
             <div className="space-y-4">
                {[
                  { name: "Georges Mikautadze", rate: "92%", total: 12 },
                  { name: "Ablie Jallow", rate: "85%", total: 6 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] flex items-center justify-center text-[10px] font-bold text-white">GM</div>
                        <div>
                           <div className="text-[11px] font-bold text-white">{s.name}</div>
                           <div className="text-[9px] text-[var(--color-neutral-500)]">{s.total} tentés</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-black text-[#22C55E]">{s.rate}</div>
                        <div className="text-[8px] text-[var(--color-neutral-600)] uppercase font-bold">Conversion</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] p-4 flex flex-col justify-center items-center">
             <div className="w-16 h-16 rounded-full border-4 border-[#C42B47] flex items-center justify-center mb-3">
                <span className="text-xl font-black text-white">88%</span>
             </div>
             <div className="text-[11px] font-bold text-white">Taux de réussite global</div>
             <div className="text-[9px] text-[var(--color-neutral-500)] mt-1">Saison 2024–25</div>
          </div>
       </div>
    </div>
  );
}

function PitchVisualization({ category, subFilter }: { category: CategoryId; subFilter: string }) {
  const isThrowIn = category === "throwins";
  
  return (
    <div className="flex-1 bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] relative overflow-hidden flex flex-col">
       <div className="p-4 border-b border-[var(--color-neutral-800)] flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#C42B47]" />
             <span className="text-xs font-bold text-[var(--color-neutral-200)] uppercase tracking-widest">
                {isThrowIn ? "Focus Touches Longues" : "Visualisation Tactique"}
             </span>
          </div>
          <span className="text-[10px] text-[var(--color-neutral-500)] italic">Données Opta / SkillCorner @ 2024</span>
       </div>
       
       <div className="flex-1 relative p-8">
          {/* Pitch Mockup */}
          <div className={`w-full h-full border-2 border-[var(--color-neutral-800)] rounded-lg relative bg-[#0f1710] overflow-hidden ${isThrowIn ? "flex items-start justify-center" : ""}`}>
             {isThrowIn ? (
               /* Focus view for Throw-ins (Top third) */
               <div className="w-full h-[60%] border-b-2 border-[var(--color-neutral-800)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[70%] border-2 border-[var(--color-neutral-800)]" />
                  <div className="absolute top-0 left-0 h-full w-[5%] bg-yellow-500/10 border-r border-dashed border-yellow-500/30" />
                  <div className="absolute top-0 right-0 h-full w-[5%] bg-yellow-500/10 border-l border-dashed border-yellow-500/30" />
                  
                  {/* Trajectory for throw-in */}
                  <svg className="absolute inset-0 w-full h-full">
                     <path d="M 50 150 Q 150 50 280 80" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />
                     <circle cx="280" cy="80" r="15" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1" />
                  </svg>
                  <div className="absolute top-[80px] left-[280px] w-2.5 h-2.5 bg-yellow-500 rounded-full border border-white" />
                  
                  <div className="absolute bottom-4 left-6 text-[9px] text-[var(--color-neutral-500)] uppercase font-bold tracking-widest bg-black/40 px-2 py-1 rounded">Dernier Tiers</div>
               </div>
             ) : (
               <>
                 {/* Large Box */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-2 border-[var(--color-neutral-800)]" />
                 {/* Small Box */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border-2 border-[var(--color-neutral-800)]" />
                 {/* Goal */}
                 <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-[15%] h-[4px] bg-white rounded-t shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                 
                 {/* Trajectories (Mock) */}
                 <svg className="absolute inset-0 w-full h-full">
                    {/* Delivery Arrow */}
                    <path 
                       d={category === "corners" ? "M 10 10 Q 150 150 250 80" : "M 400 400 Q 300 200 250 50"} 
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
                 <div className="absolute top-[80px] left-[250px] w-3 h-3 bg-[#C42B47] rounded-full shadow-[0_0_8px_#C42B47] border border-white" />
               </>
             )}
          </div>
          
          {/* Overlay info */}
          <div className="absolute bottom-12 left-12 bg-[var(--color-neutral-800)]/90 backdrop-blur border border-[var(--color-neutral-700)] p-4 rounded-lg shadow-2xl">
             <div className="text-[10px] text-[var(--color-neutral-500)] mb-1 uppercase font-bold">Zone Prioritaire</div>
             <div className="text-sm font-black text-white">{isThrowIn ? "Premier Poteau / Déviation" : "Premier Poteau"}</div>
             <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-[#22C55E]">+12% xG</span>
                <span className="text-[10px] text-[var(--color-neutral-400)]">vs Moyenne Ligue</span>
             </div>
          </div>
       </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CPAPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("overview");
  const [activeSubFilter, setActiveSubFilter] = useState<string>("");
  const [indicator, setIndicator] = useState(INDICATORS[0].id);

  // Set default sub-filter when category changes
  const handleCategoryChange = (cat: CategoryId) => {
    setActiveCategory(cat);
    if (SUB_FILTERS[cat].length > 0) {
      setActiveSubFilter(SUB_FILTERS[cat][0].id);
    } else {
      setActiveSubFilter("");
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-[var(--color-neutral-950)]">
      {/* ── INTERNAL SIDEBAR ── */}
      <aside className="w-16 flex-shrink-0 border-r border-[var(--color-neutral-800)] bg-[var(--color-neutral-900)] flex flex-col items-center py-6 gap-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: isActive ? "rgba(196,43,71,0.12)" : "transparent",
              }}
            >
              <cat.icon 
                size={20} 
                className={isActive ? "text-[#C42B47]" : "text-[var(--color-neutral-500)] group-hover:text-[var(--color-neutral-300)]"} 
              />
              
              {/* Tooltip */}
              <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[var(--color-neutral-800)] text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
                {cat.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-5 bg-[#C42B47] rounded-r-full" />
              )}
            </button>
          );
        })}
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ── TOP HEADER / FILTER BAR ── */}
        <header className="h-14 flex-shrink-0 border-b border-[var(--color-neutral-800)] bg-[var(--color-neutral-900)] flex items-center px-6 justify-between">
           <div className="flex items-center gap-4">
              <h1 className="text-sm font-black text-white uppercase tracking-wider">
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h1>
              
              {/* Horizontal Filter Bar for non-overview */}
              {activeCategory !== "overview" && (
                <div className="flex items-center bg-[var(--color-neutral-950)] rounded-lg p-0.5 ml-4">
                  {SUB_FILTERS[activeCategory].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubFilter(sub.id)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        activeSubFilter === sub.id 
                          ? "bg-[var(--color-neutral-800)] text-white shadow-sm" 
                          : "text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-300)]"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
           </div>

           {/* Indicators / Right Actions */}
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] rounded-lg text-[10px] font-bold text-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-700)] transition-colors">
                 <span>Exporter Rapport</span>
              </button>
           </div>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {activeCategory === "overview" && (
            <div className="space-y-6">
               {/* Summary Cards */}
               <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "xG / Match (CPA)", value: "0.24", diff: "+4%", color: "#22C55E" },
                    { label: "Buts / 10 Corners", value: "0.85", diff: "-2%", color: "#EF4444" },
                    { label: "Taux de Conversion", value: "8.4%", diff: "+1.2%", color: "#22C55E" },
                    { label: "Alertes Défensives", value: "2", diff: "Stable", color: "#F59E0B" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[var(--color-neutral-900)] p-4 rounded-xl border border-[var(--color-neutral-800)]">
                       <p className="text-[10px] text-[var(--color-neutral-500)] font-bold mb-1 uppercase">{stat.label}</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white">{stat.value}</span>
                          <span className="text-[10px] font-bold" style={{ color: stat.color }}>{stat.diff}</span>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Table Content */}
               <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] overflow-hidden">
                  <div className="p-4 border-b border-[var(--color-neutral-800)] flex justify-between items-center">
                     <h3 className="text-xs font-bold text-white uppercase tracking-wider">Classement par Efficacité</h3>
                     
                     {/* Indicator Selector */}
                     <div className="relative group">
                        <button className="flex items-center gap-6 px-3 py-1.5 bg-[var(--color-neutral-950)] border border-[var(--color-neutral-700)] rounded-lg text-[10px] font-bold text-white transition-all">
                           {INDICATORS.find(ind => ind.id === indicator)?.label}
                           <ChevronDown size={12} className="text-[var(--color-neutral-500)]" />
                        </button>
                        {/* Mock Dropdown */}
                        <div className="absolute right-0 top-full mt-1 w-56 bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-10 overflow-hidden">
                           {INDICATORS.map((ind) => (
                             <button
                                key={ind.id}
                                onClick={() => setIndicator(ind.id)}
                                className="w-full text-left px-3 py-2 text-[10px] font-medium text-[var(--color-neutral-300)] hover:bg-[#C42B47]/10 hover:text-[#C42B47] transition-colors"
                             >
                                {ind.label}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="w-full border-collapse">
                        <thead>
                           <tr className="bg-[var(--color-neutral-950)]/50">
                              <th className="px-5 py-3 text-left text-[10px] font-black text-[var(--color-neutral-500)] uppercase">Rang</th>
                              <th className="px-5 py-3 text-left text-[10px] font-black text-[var(--color-neutral-500)] uppercase">Équipe</th>
                              <th className="px-5 py-3 text-right text-[10px] font-black text-[var(--color-neutral-500)] uppercase">xG Générés (Moy)</th>
                              <th className="px-5 py-3 text-right text-[10px] font-black text-[var(--color-neutral-500)] uppercase">Buts Marqués</th>
                              <th className="px-5 py-3 text-right text-[10px] font-black text-[var(--color-neutral-500)] uppercase">% Contacts Gagnés</th>
                              <th className="px-5 py-3 text-center text-[10px] font-black text-[var(--color-neutral-500)] uppercase">Tendances</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-neutral-800)]">
                           {LEAGUE_STATS.map((row) => (
                             <tr key={row.rank} className={row.team === "FC Metz" ? "bg-[#C42B47]/5" : "hover:bg-white/5 transition-colors"}>
                                <td className="px-5 py-4 text-[11px] font-black text-[var(--color-neutral-400)]">{row.rank}</td>
                                <td className="px-5 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 bg-[var(--color-neutral-800)] rounded flex items-center justify-center text-[8px] font-bold">EM</div>
                                      <span className={`text-[11px] font-bold ${row.team === "FC Metz" ? "text-[#C42B47]" : "text-white"}`}>
                                         {row.team}
                                      </span>
                                   </div>
                                </td>
                                <td className="px-5 py-4 text-right text-[11px] font-mono font-bold text-white">{row.value.toFixed(2)}</td>
                                <td className="px-5 py-4 text-right text-[11px] text-[var(--color-neutral-300)]">{row.goals}</td>
                                <td className="px-5 py-4 text-right">
                                   <div className="flex items-center justify-end gap-3 font-mono text-[11px]">
                                      <div className="w-16 h-1.5 bg-[var(--color-neutral-800)] rounded-full overflow-hidden">
                                         <div className="h-full bg-[#C42B47]" style={{ width: `${row.firstContact}%` }} />
                                      </div>
                                      <span className="text-[var(--color-neutral-300)]">{row.firstContact}%</span>
                                   </div>
                                </td>
                                <td className="px-5 py-4">
                                   <div className="flex items-center justify-center gap-1">
                                      {[1, 2, 3].map(i => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-[#22C55E]" />
                                      ))}
                                   </div>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeCategory !== "overview" && (
            <div className="h-full flex flex-col gap-6">
               {/* Stats Row */}
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-[var(--color-neutral-900)] p-5 rounded-xl border border-[var(--color-neutral-800)]">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><Info size={16} className="text-blue-500" /></div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zones de Danger</h4>
                     </div>
                     <p className="text-xs text-[var(--color-neutral-400)] leading-relaxed">
                        {activeCategory === "penalties" 
                          ? "Le tireur privilégie la force au sol. 58% des tirs sont dirigés vers le coin inférieur gauche."
                          : activeCategory === "throwins"
                            ? "Focus sur les déviations au premier poteau. 42% des touches longues aboutissent à un duel aérien gagné."
                            : "L'équipe adverse privilégie les trajectoires rentrantes vers le premier poteau."
                        }
                     </p>
                  </div>
                  
                  <div className="bg-[var(--color-neutral-900)] p-5 rounded-xl border border-[var(--color-neutral-800)]">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg"><Zap size={16} className="text-orange-500" /></div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Impact Tireurs</h4>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-[var(--color-neutral-400)]">Tireur A</span>
                           <span className="font-bold text-white">Précision 92%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-[var(--color-neutral-400)]">Tireur B</span>
                           <span className="font-bold text-white">Précision 78%</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[var(--color-neutral-900)] p-5 rounded-xl border border-[var(--color-neutral-800)]">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg"><BarChart2 size={16} className="text-green-500" /></div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Conversion</h4>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-white">{activeCategory === "penalties" ? "88%" : "24%"}</span>
                        <div className="text-[10px] text-[var(--color-neutral-500)] leading-tight">
                           des {activeCategory === "penalties" ? "penaltys" : "CPA"} <br /> aboutissent à un but.
                        </div>
                     </div>
                  </div>
               </div>

               {/* Visualization Area */}
               {activeCategory === "penalties" 
                 ? <PenaltyGoal subFilter={activeSubFilter} />
                 : <PitchVisualization category={activeCategory} subFilter={activeSubFilter} />
               }
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
