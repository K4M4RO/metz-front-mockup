"use client";

import { useState, useMemo } from "react";
import { MATCHES, MATCH_STATS, BARS_IN_POSSESSION, BARS_OUT_POSSESSION } from "@/data/enzo-millot-extended";
import { SectoredRadar } from "@/components/profile/SectoredRadar";
import type { MatchResult } from "@/data/enzo-millot-extended";
import { Info } from "lucide-react";




import { FinitionSection } from "./FinitionSection";

type Category = "global" | "finition" | "possession" | "out_possession";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "global",         label: "Vue Globale" },
  { id: "finition",       label: "Finition" },
  { id: "possession",     label: "In Possession" },
  { id: "out_possession", label: "Out of Possession" },
];



function MatchStatsModal({ matchId, onClose }: { matchId: number, onClose: () => void }) {
  const stats = MATCH_STATS.find(s => s.matchId === matchId);
  const match = MATCHES.find(m => m.id === matchId);
  
  if (!stats || !match) return null;

  // Simple mapping to percentiles for the radar (simulated for the match profile)
  const distSectors: { label: string, v: any, p: number }[] = [
    { label: "Passes", v: stats.passes, p: Math.min(100, stats.passes * 1.5) },
    { label: "% Passes", v: stats.pass_pct, p: stats.pass_pct },
    { label: "P. Press.", v: stats.press_passes, p: stats.press_passes * 10 },
    { label: "1-Touch", v: stats.one_touch, p: stats.one_touch * 15 },
  ];

  const progSectors: { label: string, v: any, p: number }[] = [
    { label: "LB ATT", v: stats.lb_att, p: stats.lb_att * 25 },
    { label: "LB MIL", v: stats.lb_mid, p: stats.lb_mid * 20 },
    { label: "xThreat", v: stats.xThreat.toFixed(2), p: stats.xThreat * 500 },
    { label: "Carries", v: stats.prog_carries, p: stats.prog_carries * 12 },
  ];

  const defSectors: { label: string, v: any, p: number }[] = [
    { label: "Pressions", v: stats.pressures, p: stats.pressures * 6 },
    { label: "% Duel", v: stats.def_duel_pct, p: stats.def_duel_pct },
    { label: "Contrep.", v: stats.counter_press, p: stats.counter_press * 12 },
    { label: "2e balles", v: stats.second_balls, p: stats.second_balls * 10 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-5xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-bottom border-neutral-800 flex justify-between items-start bg-neutral-800/40">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-0.5 rounded bg-[#C42B47]/20 text-[#C42B47] text-[10px] font-black uppercase tracking-widest border border-[#C42B47]/30">Match Report</span>
               <h3 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>vs {match.opponent}</h3>
            </div>
            <p className="text-sm text-neutral-400 font-medium">{match.date} · Score final : {match.score} ({match.result})</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all hover:rotate-90">
            ✕
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-black/20">
          <SectoredRadar 
            title="Distribution" 
            size={240} 
            sectors={distSectors.map(s => ({ label: s.label || "N/A", value: s.p, displayText: String(s.v), category: "offensive" }))} 
          />
          <SectoredRadar 
            title="Progression" 
            size={240} 
            sectors={progSectors.map(s => ({ label: s.label || "N/A", value: s.p, displayText: String(s.v), category: "offensive" }))} 
          />
          <SectoredRadar 
            title="Défensif" 
            size={240} 
            sectors={defSectors.map(s => ({ label: s.label || "N/A", value: s.p, displayText: String(s.v), category: "defensive" }))} 
          />
        </div>
        
        <div className="p-6 bg-neutral-800/40 border-t border-neutral-800 flex justify-between items-center px-10">
           <div className="flex gap-8">
              <div className="flex flex-col">
                 <span className="text-[10px] text-neutral-500 font-bold uppercase">Temps de jeu</span>
                 <span className="text-sm font-bold text-white">{match.minutes}'</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] text-neutral-500 font-bold uppercase">Impact Score</span>
                 <span className="text-sm font-bold text-[#C42B47]">Excellent</span>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="px-10 py-3 rounded-xl bg-neutral-100 text-neutral-900 text-xs font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105"
           >
             Fermer le rapport
           </button>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ m, type, onShowStats }: { m: any, type: "top" | "worst" | "typical", onShowStats: (id: number) => void }) {
  const ratingColor = type === "top" ? "#22C55E" : type === "worst" ? "#EF4444" : "#3B82F6";
  return (
    <div 
      className="p-4 rounded-xl transition-all hover:scale-[1.02] cursor-default"
      style={{ 
        backgroundColor: "var(--color-neutral-800)", 
        border: "1px solid var(--color-neutral-700)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{m.date}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{m.score}</span>
          </div>
          <h4 className="text-sm font-bold text-white leading-tight">vs {m.opponent}</h4>
        </div>
        <div 
          className="px-2 py-1 rounded-lg flex flex-col items-center justify-center min-w-[36px]"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", border: `1px solid ${ratingColor}44` }}
        >
          <span className="text-[10px] text-neutral-500 font-bold leading-none">NOTE</span>
          <span className="text-xs font-black mt-1" style={{ color: ratingColor }}>{m.rating}</span>
        </div>
      </div>
      <p className="text-[11px] text-neutral-400 leading-relaxed italic">
        "{m.note}"
      </p>
      
      <div className="mt-4">
         <button 
           onClick={() => onShowStats(m.id)}
           className="w-full py-2 rounded-md bg-neutral-700/50 hover:bg-neutral-700 text-[10px] font-bold text-neutral-300 transition-colors uppercase tracking-wider"
         >
           Voir les Statistiques
         </button>
      </div>
    </div>
  );
}

export function PerformancesTab() {
  const [activeCat, setActiveCat] = useState<Category>("global");
  const [selectedMatchStats, setSelectedMatchStats] = useState<number | null>(null);




const RECOMMENDED_MATCHES = {
  tops: [
    { id: 10, opponent: "Brest", date: "23/11", score: "3-0", rating: 9.2, note: "Masterclass technique. Domination totale du milieu, créateur des 3 buts." },
    { id: 14, opponent: "Montpellier", date: "21/12", score: "4-1", rating: 8.8, note: "Volume de jeu exceptionnel. 12km parcourus et une efficacité redoutable." },
    { id: 22, opponent: "Monaco", date: "15/03", score: "2-1", rating: 8.7, note: "Décisif dans un grand match. A porté l'équipe sous pression." },
  ],
  worst: [
    { id: 1, opponent: "PSG", date: "03/08", score: "1-3", rating: 5.4, note: "Difficulté face au pressing intense. Beaucoup de pertes de balles évitables." },
    { id: 11, opponent: "Reims", date: "30/11", score: "0-1", rating: 5.8, note: "Manque d'influence. Trop de jeu latéral sans casser les lignes." },
    { id: 23, opponent: "Lyon", date: "22/03", score: "1-3", rating: 5.6, note: "Frustration visible. Manque de discipline tactique en phase défensive." },
  ],
  typical: [
    { id: 2, opponent: "Marseille", date: "10/08", score: "2-1", rating: 7.4, note: "Propre et efficace. Travail de l'ombre essentiel à la transition." },
    { id: 12, opponent: "Toulouse", date: "07/12", score: "2-1", rating: 7.2, note: "Régulateur du tempo. Ce qu'il apporte 80% du temps à l'équipe." },
    { id: 21, opponent: "Marseille", date: "08/03", score: "0-0", rating: 7.5, note: "Solidité et justesse. Match référence pour son équilibre ATT/DEF." },
  ]
};

  return (
    <div className="flex min-h-[600px]">
      {/* Internal Sidebar */}
      <div 
        className="w-[220px] flex-shrink-0 border-r border-neutral-800 p-4 sticky" 
        style={{ top: 88, height: "calc(100vh - 88px)" }}
      >
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: isActive ? "rgba(196,43,71,0.12)" : "transparent",
                  color: isActive ? "var(--color-primary-300)" : "var(--color-neutral-400)",
                  border: isActive ? "1px solid rgba(196,43,71,0.3)" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {activeCat === "global" && (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>Recommandations de Visionnage</h2>
              <p className="text-sm text-neutral-400">Sélection curatée par l'IA pour comprendre le profil de Millot en 9 matchs clés.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TOPS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 group relative">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Sommets & Prime</h3>
                  <div className="cursor-help text-neutral-600 hover:text-neutral-400 transition-colors">
                    <Info size={12} />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                    Les 3 matchs où le joueur a atteint son plus haut niveau de performance cette saison.
                  </div>
                </div>
                {RECOMMENDED_MATCHES.tops.map(m => (
                  <MatchCard key={m.id} m={m} type="top" onShowStats={setSelectedMatchStats} />
                ))}
              </div>

              {/* TYPICAL */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 group relative">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Le Standard Millot</h3>
                  <div className="cursor-help text-neutral-600 hover:text-neutral-400 transition-colors">
                    <Info size={12} />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                    Les 3 matchs qui illustrent son niveau moyen et les prestations qu'il produit le plus fréquemment.
                  </div>
                </div>
                {RECOMMENDED_MATCHES.typical.map(m => (
                  <MatchCard key={m.id} m={m} type="typical" onShowStats={setSelectedMatchStats} />
                ))}
              </div>

              {/* WORST */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 group relative">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Leçons & Difficultés</h3>
                  <div className="cursor-help text-neutral-600 hover:text-neutral-400 transition-colors">
                    <Info size={12} />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                    Les 3 matchs où le joueur a le plus souffert, utiles pour identifier ses limites tactiques ou physiques.
                  </div>
                </div>
                {RECOMMENDED_MATCHES.worst.map(m => (
                  <MatchCard key={m.id} m={m} type="worst" onShowStats={setSelectedMatchStats} />
                ))}
              </div>
            </div>

            {/* Insight Note */}
            <div className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50 flex gap-4 items-center">
               <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-700">
                 <span className="text-lg">💡</span>
               </div>
               <div>
                 <p className="text-xs font-semibold text-neutral-300">Conseil de Recrutement</p>
                 <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                   Millot performe au maximum de son potentiel dans des systèmes à haute possession où il est le pivot des transitions. 
                   Évitez les matchs contre des blocs très bas et physiques pour juger sa créativité pure.
                 </p>
               </div>
            </div>
          </div>
        )}

        {activeCat === "possession" && (
          <div className="max-w-3xl mx-auto">
            <SectoredRadar 
              title="Avec le ballon — In Possession"
              size={340}
              sectors={BARS_IN_POSSESSION.map(b => ({
                label: b.label,
                value: b.pct,
                displayText: b.raw,
                category: "offensive"
              }))}
            />
          </div>
        )}

        {activeCat === "out_possession" && (
          <div className="max-w-3xl mx-auto">
            <SectoredRadar 
              title="Sans le ballon — Out of Possession"
              size={340}
              sectors={BARS_OUT_POSSESSION.map(b => ({
                label: b.label,
                value: b.pct,
                displayText: b.raw,
                category: "defensive"
              }))}
            />
          </div>
        )}

        {activeCat === "finition" && (
          <FinitionSection />
        )}

        {selectedMatchStats && (
          <MatchStatsModal 
            matchId={selectedMatchStats} 
            onClose={() => setSelectedMatchStats(null)} 
          />
        )}
      </div>
    </div>
  );
}
