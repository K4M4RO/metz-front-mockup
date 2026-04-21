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

function PercentileBarsSection() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {[
        { title: "Avec le ballon — In Possession", bars: BARS_IN_POSSESSION },
        { title: "Sans le ballon — Out of Possession", bars: BARS_OUT_POSSESSION },
      ].map(({ title, bars }) => (
        <div
          key={title}
          className="rounded-lg p-4"
          style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
        >
          <span className="text-xs font-semibold block mb-3" style={{ color: "var(--color-neutral-400)" }}>
            {title}
          </span>
          <div className="space-y-2">
            {bars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="text-xs flex-shrink-0" style={{ color: "var(--color-neutral-400)", width: 140, fontSize: 10 }}>
                  {bar.label}
                </span>
                <span className="text-xs flex-shrink-0" style={{ color: "var(--color-neutral-300)", width: 32, textAlign: "right", fontFamily: "var(--font-dm-sans)" }}>
                  {bar.raw}
                </span>
                <div className="flex-1 relative" style={{ height: 14, backgroundColor: "var(--color-neutral-700)", borderRadius: 3 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${bar.pct}%`,
                      backgroundColor: pctBarColor(bar.pct),
                      borderRadius: 3,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {bar.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PerformancesTab() {
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
    <div className="p-6 space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
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

      {/* Percentile bars */}
      <PercentileBarsSection />
    </div>
  );
}
