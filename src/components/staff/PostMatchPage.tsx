"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, ChevronRight } from "lucide-react";
import { PostMatchReport } from "@/components/match-center/post-match/PostMatchReport";

// ─── Mock Matches List ────────────────────────────────────────────────────────

const PAST_MATCHES = [
  { id: "1", date: "12 Avr", opponent: "Troyes AC", score: "2 – 1", result: "W" },
  { id: "2", date: "06 Avr", opponent: "Caen",      score: "0 – 0", result: "D" },
  { id: "3", date: "30 Mar", opponent: "Grenoble",  score: "1 – 3", result: "L" },
  { id: "metz-reims", date: "Aujourd'hui", opponent: "Stade de Reims", score: "3 – 2", result: "W", isLatest: true },
];

const R_COLOR: Record<string, string> = { W: "#22C55E", D: "#F59E0B", L: "#EF4444" };
const R_LABEL: Record<string, string> = { W: "V", D: "N", L: "D" };

export function PostMatchPage() {
  const searchParams = useSearchParams();
  const matchIdParam = searchParams.get("match");
  
  const [selectedMatch, setSelectedMatch] = useState(matchIdParam || "metz-reims");

  useEffect(() => {
    if (matchIdParam) {
      setSelectedMatch(matchIdParam);
    }
  }, [matchIdParam]);

  return (
    <div className="flex h-full overflow-hidden bg-[var(--color-neutral-950)]">
      {/* ── Match Sidebar ── */}
      <aside 
        className="w-64 flex-shrink-0 border-r flex flex-col bg-[var(--color-neutral-900)]"
        style={{ borderColor: "var(--color-neutral-800)" }}
      >
        <div className="px-5 py-4 border-b border-[var(--color-neutral-800)]">
          <h2 className="text-xs font-bold text-[var(--color-neutral-400)] uppercase tracking-wider">
            Rapports récents
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {PAST_MATCHES.map((m) => {
            const isActive = selectedMatch === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMatch(m.id)}
                className={`w-full text-left p-3 rounded-lg transition-all border ${
                  isActive 
                    ? "bg-[rgba(196,43,71,0.1)] border-[rgba(196,43,71,0.3)] shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-[var(--color-neutral-800)]"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span 
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black"
                    style={{ 
                      backgroundColor: `${R_COLOR[m.result]}22`, 
                      color: R_COLOR[m.result],
                      border: `1px solid ${R_COLOR[m.result]}44`
                    }}
                  >
                    {R_LABEL[m.result]}
                  </span>
                  <span className={`text-[13px] font-bold truncate ${isActive ? "text-[#C42B47]" : "text-[var(--color-neutral-200)]"}`}>
                    vs {m.opponent}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-7">
                  <span className="text-[11px] text-[var(--color-neutral-500)]">
                    {m.score} · {m.date}
                  </span>
                  {isActive && <ChevronRight size={14} className="text-[#C42B47] opacity-60" />}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Help footer */}
        <div className="p-4 bg-[var(--color-neutral-950)] border-t border-[var(--color-neutral-800)]">
          <div className="flex items-center gap-2 text-[10px] text-[var(--color-neutral-500)]">
            <FileText size={12} />
            <span>Sélectionnez un match pour voir le rapport broadcast.</span>
          </div>
        </div>
      </aside>

      {/* ── Main Report Content ── */}
      <main className="flex-1 overflow-hidden relative">
        {/* We reuse the PostMatchReport component which has internal tabs */}
        <PostMatchReport />
        
        {/* Optional overlay for upcoming matches if we had any */}
        {selectedMatch !== "metz-reims" && (
          <div className="absolute inset-0 bg-[var(--color-neutral-950)]/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center p-8 bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-xl max-w-sm">
              <div className="w-16 h-16 bg-[var(--color-neutral-800)] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-[var(--color-neutral-500)]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Données en cours d'analyse</h3>
              <p className="text-sm text-[var(--color-neutral-400)] mb-6">
                Le rapport broadcast interactif est actuellement disponible pour le match face à Reims.
              </p>
              <button 
                onClick={() => setSelectedMatch("metz-reims")}
                className="px-6 py-2 bg-[#C42B47] hover:bg-[#A8253D] text-white text-sm font-bold rounded-lg transition-colors"
              >
                Voir FC Metz - Reims
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
