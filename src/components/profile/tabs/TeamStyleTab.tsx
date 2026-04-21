"use client";

import { SectoredRadar } from "@/components/profile/SectoredRadar";
import {
  RADAR_IN_POSSESSION, RADAR_TRANSITIONS, RADAR_OUT_POSSESSION,
  STANDINGS,
} from "@/data/enzo-millot-extended";
import type { Standing } from "@/data/enzo-millot-extended";

const RESULT_COLORS: Record<string, string> = {
  V: "#22C55E", N: "#EAB308", D: "#EF4444",
};

function FitScoreWidget() {
  const score = 78;
  const R = 54;
  const circ = 2 * Math.PI * R;
  const dash = (score / 100) * circ;

  return (
    <div
      className="rounded-lg p-5 flex flex-col items-center"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
        flex: 1,
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider mb-4 text-center"
        style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
      >
        Fit Score &amp; Similarity
      </span>
      <svg width={130} height={130}>
        <circle cx={65} cy={65} r={R} fill="none" stroke="var(--color-neutral-700)" strokeWidth={8} />
        <circle
          cx={65} cy={65} r={R} fill="none"
          stroke="#C42B47" strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }}
        />
        <text x={65} y={60} textAnchor="middle" style={{ fill: "var(--color-neutral-100)", fontSize: 30, fontWeight: 800, fontFamily: "var(--font-dm-sans)" }}>
          {score}
        </text>
        <text x={65} y={77} textAnchor="middle" style={{ fill: "var(--color-neutral-500)", fontSize: 11 }}>
          /100
        </text>
      </svg>
      <p className="text-xs text-center mt-2" style={{ color: "var(--color-neutral-400)" }}>
        Compatible avec le
        <span style={{ color: "var(--color-primary-300)", fontWeight: 600 }}> 4-3-3 pressing </span>
        de FC Metz
      </p>
      <div
        className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg w-full"
        style={{ backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: "var(--color-primary-900)", color: "var(--color-primary-300)" }}
        >FB</div>
        <p className="text-xs" style={{ color: "var(--color-neutral-300)" }}>
          Ressemble à <strong>92%</strong> à{" "}
          <span style={{ color: "var(--color-primary-300)" }}>Farid Boulaya</span>
          <span style={{ color: "var(--color-neutral-500)" }}> (cadre FC Metz)</span>
        </p>
      </div>
    </div>
  );
}

function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider block mb-3"
        style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
      >
        Classement Ligue 1
      </span>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
              {["#","Club","J","V","N","D","Pts","Forme"].map((h) => (
                <th key={h} style={{ color: "var(--color-neutral-500)", fontSize: 10, fontWeight: 500, padding: "4px 6px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const isMetz = row.abbr === "FCM";
              return (
                <tr
                  key={row.rank}
                  style={{
                    backgroundColor: isMetz ? "rgba(196,43,71,0.12)" : "transparent",
                    borderBottom: "1px solid var(--color-neutral-700)",
                  }}
                >
                  <td style={{ padding: "6px", fontSize: 11, color: isMetz ? "var(--color-primary-300)" : "var(--color-neutral-400)", fontWeight: isMetz ? 700 : 400 }}>{row.rank}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: isMetz ? "var(--color-primary-200)" : "var(--color-neutral-200)", fontWeight: isMetz ? 700 : 400, whiteSpace: "nowrap" }}>{row.club}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: "var(--color-neutral-400)" }}>{row.j}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: "#22C55E" }}>{row.v}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: "#EAB308" }}>{row.n}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: "#EF4444" }}>{row.d}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: isMetz ? "var(--color-primary-300)" : "var(--color-neutral-200)", fontWeight: 700 }}>{row.pts}</td>
                  <td style={{ padding: "6px" }}>
                    <div className="flex gap-0.5">
                      {row.form.split("").map((r, fi) => (
                        <span
                          key={fi}
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: RESULT_COLORS[r] ?? "#555", fontSize: 7, color: "white", fontWeight: 700 }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TeamStyleTab() {
  return (
    <div className="p-6 space-y-4">
      {/* 3 sectored radars */}
      <div className="flex gap-4">
        <SectoredRadar sectors={RADAR_IN_POSSESSION}  title="In Possession"     size={220} />
        <SectoredRadar sectors={RADAR_TRANSITIONS}    title="Transitions"       size={220} />
        <SectoredRadar sectors={RADAR_OUT_POSSESSION} title="Out of Possession" size={220} />
        <FitScoreWidget />
      </div>
      <StandingsTable standings={STANDINGS} />
    </div>
  );
}
