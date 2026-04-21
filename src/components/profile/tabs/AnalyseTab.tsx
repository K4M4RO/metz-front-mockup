"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { HeatmapPitch } from "@/components/profile/HeatmapPitch";
import { EventMap } from "@/components/profile/EventMap";
import { PerformancesTab } from "@/components/profile/tabs/PerformancesTab";
import { PhysicalTab } from "@/components/profile/tabs/PhysicalTab";
import { EnduranceTab } from "@/components/profile/tabs/EnduranceTab";
import { MATCHES, SEASON_HOTSPOTS, MATCH_HEATMAP_PATTERNS } from "@/data/enzo-millot-extended";
import type { MatchResult } from "@/data/enzo-millot-extended";

type SubTab = "couverture" | "performances" | "physique" | "endurance";
type CoverageMode = "saison" | "match";
type MatchFilter = "Tous" | "Domicile" | "Extérieur" | "Victoires" | "Défaites";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "couverture",   label: "Couverture" },
  { id: "performances", label: "Performances" },
  { id: "physique",     label: "Physique" },
  { id: "endurance",    label: "Endurance" },
];

const RESULT_COLORS: Record<MatchResult, string> = {
  V: "#22C55E", N: "#EAB308", D: "#EF4444",
};

const MATCH_FILTERS: MatchFilter[] = ["Tous", "Domicile", "Extérieur", "Victoires", "Défaites"];

interface ModalMatch { id: number; opponent: string; score: string; result: MatchResult; date: string; minutes: number; }

function CoverageSubTab() {
  const [mode, setMode]     = useState<CoverageMode>("saison");
  const [filter, setFilter] = useState<MatchFilter>("Tous");
  const [page, setPage]     = useState(1);
  const [modal, setModal]   = useState<ModalMatch | null>(null);

  const filtered = MATCHES.filter((m) => {
    if (filter === "Domicile")  return m.home;
    if (filter === "Extérieur") return !m.home;
    if (filter === "Victoires") return m.result === "V";
    if (filter === "Défaites")  return m.result === "D";
    return true;
  });

  const PAGE_SIZE = 12;
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <div className="p-6 space-y-5">
      {/* 2-col grid (≥1280px) or stacked (smaller) */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 560px), 1fr))" }}>

      {/* Left: Mode selector + heatmap */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
            Heatmap de Positionnement
          </span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as CoverageMode)}
            style={{
              appearance: "none",
              padding: "5px 28px 5px 10px",
              borderRadius: 6,
              backgroundColor: "var(--color-neutral-700)",
              border: "1px solid var(--color-neutral-600)",
              color: "var(--color-neutral-200)",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2371717a'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
            }}
          >
            <option value="saison">Saison entière</option>
            <option value="match">Par match</option>
          </select>
        </div>

        {/* Season mode */}
        {mode === "saison" && (
          <>
            <div className="overflow-hidden rounded" style={{ maxWidth: "100%" }}>
              <HeatmapPitch hotspots={SEASON_HOTSPOTS} width={800} idPrefix="season" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>Froid</span>
              <div
                className="flex-1 h-2 rounded-full"
                style={{ background: "linear-gradient(to right, #1E3A5F, #7B2D8B, #C42B47, #FF6B35)", maxWidth: 200 }}
              />
              <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>Chaud</span>
            </div>
          </>
        )}

        {/* Per-match mode */}
        {mode === "match" && (
          <>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {MATCH_FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className="px-3 py-1 rounded-full text-xs transition-colors"
                    style={{
                      backgroundColor: active ? "rgba(196,43,71,0.18)" : "var(--color-neutral-700)",
                      border: `1px solid ${active ? "rgba(196,43,71,0.50)" : "var(--color-neutral-600)"}`,
                      color: active ? "var(--color-primary-300)" : "var(--color-neutral-400)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {visible.map((match, idx) => {
                const pattern = MATCH_HEATMAP_PATTERNS[idx % MATCH_HEATMAP_PATTERNS.length];
                return (
                  <button
                    key={match.id}
                    className="rounded overflow-hidden text-left transition-all"
                    style={{ border: "1px solid var(--color-neutral-700)" }}
                    onClick={() => setModal(match)}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-700)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(196,43,71,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-700)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  >
                    <HeatmapPitch hotspots={pattern} width={200} idPrefix={`m${match.id}`} />
                    <div className="px-2 py-1.5" style={{ backgroundColor: "var(--color-neutral-900)" }}>
                      <p className="text-xs font-medium truncate" style={{ color: "var(--color-neutral-200)" }}>
                        {match.abbr} · {match.date}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span style={{ color: RESULT_COLORS[match.result], fontSize: 10, fontWeight: 700 }}>{match.result}</span>
                        <span style={{ color: "var(--color-neutral-500)", fontSize: 10 }}>{match.score}</span>
                        <span style={{ color: "var(--color-neutral-600)", fontSize: 10 }}>· {match.minutes}mn</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="mt-4 w-full py-2 rounded-lg text-xs transition-colors"
                style={{ backgroundColor: "var(--color-neutral-700)", color: "var(--color-neutral-400)", border: "1px solid var(--color-neutral-600)" }}
              >
                Charger plus ▼
              </button>
            )}
          </>
        )}
      </div>

      {/* Right: EventMap */}
      <EventMap />

      </div>{/* end 2-col grid */}

      {/* Modal */}
      {modal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-xl overflow-hidden pointer-events-auto"
              style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-600)", boxShadow: "0 24px 60px rgba(0,0,0,0.7)", width: 500 }}
            >
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)", fontSize: 15 }}>
                    {modal.opponent}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: "var(--color-neutral-400)" }}>
                    {modal.date} · {modal.minutes}mn ·{" "}
                  </span>
                  <span style={{ color: RESULT_COLORS[modal.result], fontSize: 12, fontWeight: 700 }}>
                    {modal.result} {modal.score}
                  </span>
                </div>
                <button onClick={() => setModal(null)} style={{ color: "var(--color-neutral-500)" }}>
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
              <HeatmapPitch
                hotspots={MATCH_HEATMAP_PATTERNS[MATCHES.findIndex(m => m.id === modal.id) % MATCH_HEATMAP_PATTERNS.length]}
                width={500}
                idPrefix={`modal-${modal.id}`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SubPills({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div
      className="flex items-center gap-2 px-6 py-3 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--color-neutral-700)", backgroundColor: "var(--color-neutral-900)" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: isActive ? "rgba(196,43,71,0.18)" : "var(--color-neutral-800)",
              border: `1px solid ${isActive ? "rgba(196,43,71,0.45)" : "var(--color-neutral-700)"}`,
              color: isActive ? "var(--color-primary-300)" : "var(--color-neutral-400)",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function AnalyseTab() {
  const [activeSub, setActiveSub] = useState<SubTab>("couverture");

  return (
    <div className="flex flex-col h-full">
      <SubPills tabs={SUB_TABS} active={activeSub} onChange={(id) => setActiveSub(id as SubTab)} />
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--color-neutral-900)" }}>
        {activeSub === "couverture"   && <CoverageSubTab />}
        {activeSub === "performances" && <PerformancesTab />}
        {activeSub === "physique"     && <PhysicalTab />}
        {activeSub === "endurance"    && <EnduranceTab />}
      </div>
    </div>
  );
}
