"use client";

import { useState, useMemo } from "react";
import { MATCHES, MATCH_STATS, BARS_IN_POSSESSION, BARS_OUT_POSSESSION } from "@/data/enzo-millot-extended";
import type { MatchResult } from "@/data/enzo-millot-extended";

type Filter = "Tous" | "Titulaire" | "Remplaçant" | "Victoires" | "Défaites";

const RESULT_COLORS: Record<MatchResult, string> = {
  V: "#22C55E", N: "#EAB308", D: "#EF4444",
};

function cellColor(percentile: number): string {
  if (percentile >= 85) return "#145A32";
  if (percentile >= 70) return "#1E8449";
  if (percentile >= 55) return "#ABEBC6";
  if (percentile >= 45) return "var(--color-neutral-800)";
  if (percentile >= 30) return "#FADBD8";
  if (percentile >= 15) return "#E74C3C";
  return "#7B241C";
}

function cellTextColor(percentile: number): string {
  if (percentile >= 55 && percentile < 85) return "#1C1C1F";
  if (percentile >= 30 && percentile < 45) return "#1C1C1F";
  return "white";
}

function computePersonalPct(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => a - b);
  const rank = sorted.filter(v => v < value).length;
  return Math.round((rank / allValues.length) * 100);
}

const COL_GROUPS = [
  {
    label: "Distribution",
    cols: [
      { key: "passes" as const, label: "Passes" },
      { key: "pass_pct" as const, label: "% passes" },
      { key: "press_passes" as const, label: "Passes press." },
      { key: "one_touch" as const, label: "1-touch" },
    ],
  },
  {
    label: "Progression",
    cols: [
      { key: "lb_att" as const, label: "LB ATT" },
      { key: "lb_mid" as const, label: "LB MIL" },
      { key: "xThreat" as const, label: "xThreat" },
      { key: "prog_carries" as const, label: "Carries prog." },
    ],
  },
  {
    label: "Défensif",
    cols: [
      { key: "pressures" as const, label: "Pressions" },
      { key: "def_duel_pct" as const, label: "% duel déf." },
      { key: "counter_press" as const, label: "Contrep." },
      { key: "second_balls" as const, label: "2e balles" },
    ],
  },
  {
    label: "Physique",
    cols: [
      { key: "peak_sprint" as const, label: "Sprint max" },
      { key: "hi_runs" as const, label: "HI runs" },
      { key: "total_dist" as const, label: "Distance" },
    ],
  },
];

type StatKey = keyof (typeof MATCH_STATS)[number];

function pctBarColor(pct: number): string {
  if (pct >= 91) return "#7B1E2E";
  if (pct >= 75) return "#C0392B";
  if (pct >= 58) return "#E67E22";
  if (pct >= 41) return "#F1C40F";
  if (pct >= 25) return "#27AE60";
  if (pct >= 8)  return "#2980B9";
  return "#16A085";
}


import { Brain } from "lucide-react";
import { FinitionSection } from "./FinitionSection";

type Category = "global" | "finition" | "possession" | "out_possession" | "intelligence";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "global",         label: "Vue Globale" },
  { id: "finition",       label: "Finition" },
  { id: "possession",     label: "In Possession" },
  { id: "out_possession", label: "Out of Possession" },
  { id: "intelligence",   label: "Intelligence de jeu" },
];

function PercentileBarsSection({ bars, title }: { bars: typeof BARS_IN_POSSESSION; title: string }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
          {title}
        </h3>
        <span className="text-[10px] text-neutral-500 font-medium">Percentile vs Benchmark Poste</span>
      </div>
      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-[11px] text-neutral-400 font-medium">{bar.label}</span>
              <span className="text-[11px] text-white font-bold" style={{ fontFamily: "var(--font-dm-sans)" }}>{bar.raw}</span>
            </div>
            <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden relative">
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${bar.pct}%`,
                  backgroundColor: pctBarColor(bar.pct),
                  borderRadius: 99,
                }}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-[9px] text-neutral-500">P{bar.pct}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PerformancesTab() {
  const [activeCat, setActiveCat] = useState<Category>("global");
  const [filter, setFilter] = useState<Filter>("Tous");

  const filteredIds = useMemo(() => {
    return MATCHES.filter((m) => {
      if (filter === "Titulaire")  return m.minutes >= 60;
      if (filter === "Remplaçant") return m.minutes < 60;
      if (filter === "Victoires")  return m.result === "V";
      if (filter === "Défaites")   return m.result === "D";
      return true;
    }).map((m) => m.id);
  }, [filter]);

  const visibleStats = MATCH_STATS.filter((s) => filteredIds.includes(s.matchId));
  const visibleMatches = MATCHES.filter((m) => filteredIds.includes(m.id));

  // Compute personal percentiles
  const allCols: StatKey[] = COL_GROUPS.flatMap(g => g.cols.map(c => c.key));
  const colValues: Record<string, number[]> = {};
  allCols.forEach(col => {
    colValues[col] = MATCH_STATS.map(s => s[col] as number);
  });

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
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-4">
              {(["Tous","Titulaire","Remplaçant","Victoires","Défaites"] as Filter[]).map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1 rounded-full text-xs transition-colors"
                    style={{
                      backgroundColor: active ? "rgba(196,43,71,0.18)" : "var(--color-neutral-800)",
                      border: `1px solid ${active ? "rgba(196,43,71,0.50)" : "var(--color-neutral-600)"}`,
                      color: active ? "var(--color-primary-300)" : "var(--color-neutral-400)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Match heatmap matrix */}
            <div
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
            >
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "max-content", minWidth: "100%" }}>
                  <thead>
                    {/* Group headers */}
                    <tr style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
                      <th style={{ minWidth: 200, padding: "8px 12px", textAlign: "left", backgroundColor: "var(--color-neutral-800)", position: "sticky", left: 0, zIndex: 2, borderRight: "1px solid var(--color-neutral-700)" }} />
                      {COL_GROUPS.map((grp) => (
                        <th
                          key={grp.label}
                          colSpan={grp.cols.length}
                          style={{
                            padding: "6px 8px",
                            textAlign: "center",
                            color: "var(--color-neutral-300)",
                            fontSize: 10,
                            fontWeight: 600,
                            backgroundColor: "var(--color-neutral-900)",
                            borderRight: "1px solid var(--color-neutral-700)",
                          }}
                        >
                          {grp.label}
                        </th>
                      ))}
                    </tr>
                    {/* Column headers */}
                    <tr style={{ borderBottom: "1px solid var(--color-neutral-600)" }}>
                      <th
                        style={{
                          minWidth: 200, padding: "6px 12px", textAlign: "left",
                          backgroundColor: "var(--color-neutral-800)",
                          position: "sticky", left: 0, zIndex: 2,
                          borderRight: "1px solid var(--color-neutral-700)",
                          color: "var(--color-neutral-500)", fontSize: 10,
                        }}
                      >
                        Match
                      </th>
                      {COL_GROUPS.flatMap((grp, gi) =>
                        grp.cols.map((col, ci) => (
                          <th
                            key={`${gi}-${ci}`}
                            style={{
                              padding: "6px 8px",
                              color: "var(--color-neutral-400)",
                              fontSize: 9,
                              fontWeight: 500,
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              backgroundColor: "var(--color-neutral-800)",
                              borderRight: ci === grp.cols.length - 1 ? "1px solid var(--color-neutral-700)" : undefined,
                            }}
                          >
                            {col.label}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStats.map((stats, ri) => {
                      const match = visibleMatches[ri];
                      if (!match) return null;
                      return (
                        <tr
                          key={stats.matchId}
                          style={{ borderBottom: "1px solid var(--color-neutral-700)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {/* Identity cell */}
                          <td
                            style={{
                              padding: "0 12px",
                              height: 44,
                              backgroundColor: "var(--color-neutral-800)",
                              position: "sticky", left: 0, zIndex: 1,
                              borderRight: "1px solid var(--color-neutral-700)",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ backgroundColor: "var(--color-neutral-700)", color: "var(--color-neutral-300)", fontSize: 8 }}
                              >
                                {match.abbr.slice(0, 3)}
                              </div>
                              <div>
                                <p className="text-xs font-medium" style={{ color: "var(--color-neutral-200)", fontSize: 11 }}>
                                  {match.opponent}
                                </p>
                                <p style={{ color: "var(--color-neutral-500)", fontSize: 9 }}>
                                  {match.home ? "D" : "E"} · {match.date}
                                </p>
                              </div>
                              <span
                                className="ml-auto text-xs font-bold"
                                style={{ color: RESULT_COLORS[match.result], fontSize: 10 }}
                              >
                                {match.result}
                              </span>
                            </div>
                          </td>
                          {/* Stat cells */}
                          {COL_GROUPS.flatMap((grp, gi) =>
                            grp.cols.map((col, ci) => {
                              const val = stats[col.key] as number;
                              const pct = computePersonalPct(val, colValues[col.key]);
                              const bg = cellColor(pct);
                              const fg = cellTextColor(pct);
                              const display = col.key === "xThreat"
                                ? val.toFixed(2)
                                : col.key === "pass_pct" || col.key === "def_duel_pct"
                                  ? `${val}%`
                                  : col.key === "total_dist" ? `${val}` : String(val);
                              return (
                                <td
                                  key={`${gi}-${ci}`}
                                  style={{
                                    padding: "0 8px",
                                    height: 44,
                                    backgroundColor: bg,
                                    textAlign: "center",
                                    fontSize: 11,
                                    color: fg,
                                    borderRight: ci === grp.cols.length - 1 ? "1px solid var(--color-neutral-700)" : undefined,
                                  }}
                                >
                                  {display}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeCat === "possession" && (
          <div className="max-w-2xl">
            <PercentileBarsSection bars={BARS_IN_POSSESSION} title="Avec le ballon — In Possession" />
          </div>
        )}

        {activeCat === "out_possession" && (
          <div className="max-w-2xl">
            <PercentileBarsSection bars={BARS_OUT_POSSESSION} title="Sans le ballon — Out of Possession" />
          </div>
        )}

        {activeCat === "finition" && (
          <FinitionSection />
        )}

        {activeCat === "intelligence" && (
          <div className="space-y-6">
            <div 
              className="rounded-xl border border-dashed border-neutral-700 p-8 flex flex-col items-center justify-center text-neutral-500 gap-4"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                <Brain size={24} className="text-neutral-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-300">Intelligence de jeu & Off-ball runs</p>
                <p className="text-xs mt-1">Données SkillCorner prochainement disponibles</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 h-32 flex items-center justify-center text-[10px] uppercase tracking-widest text-neutral-600">
                Phase of Play Analysis
              </div>
              <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 h-32 flex items-center justify-center text-[10px] uppercase tracking-widest text-neutral-600">
                Decision Making Metrics
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
