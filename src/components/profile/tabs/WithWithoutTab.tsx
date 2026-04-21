"use client";

import { useState } from "react";
import { OPPONENTS_WW, WW_RADAR_AXES, WW_AVEC, WW_SANS, WW_TABLE } from "@/data/enzo-millot-extended";

// ── Superposed radar ──────────────────────────────────────────────────────────
const CX = 170, CY = 165, R = 120;
const N = WW_RADAR_AXES.length;

function toRad(deg: number) { return (deg - 90) * (Math.PI / 180); }
function polarXY(r: number, i: number) {
  const angle = (360 / N) * i;
  return { x: CX + r * Math.cos(toRad(angle)), y: CY + r * Math.sin(toRad(angle)) };
}
function buildPoly(values: number[]): string {
  return values.map((v, i) => { const { x, y } = polarXY((v / 100) * R, i); return `${x},${y}`; }).join(" ");
}

interface WWTooltip { x: number; y: number; idx: number; }

function WWRadar() {
  const rings = [0.25, 0.5, 0.75, 1];
  const [tooltip, setTooltip] = useState<WWTooltip | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", flex: 1 }}
    >
      <span className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
        Radar With / Without
      </span>

      <div style={{ position: "relative" }}>
        <svg
          width={340} height={330} viewBox="0 0 340 330"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            if (tooltip) setTooltip((t) => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Rings */}
          {rings.map((ratio, ri) => {
            const pts = Array.from({ length: N }, (_, i) => { const { x, y } = polarXY(R * ratio, i); return `${x},${y}`; }).join(" ");
            return <polygon key={ri} points={pts} fill="none" stroke="var(--color-neutral-700)" strokeWidth={0.8} />;
          })}
          {/* Axis lines */}
          {Array.from({ length: N }, (_, i) => {
            const outer = polarXY(R, i);
            return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="var(--color-neutral-700)" strokeWidth={0.8} />;
          })}
          {/* "Sans" polygon — gold dashed */}
          <polygon points={buildPoly(WW_SANS)} fill="rgba(212,160,23,0.12)" stroke="#D4A017" strokeWidth={1.5} strokeDasharray="4 3" />
          {/* "Avec" polygon — grenat solid */}
          <polygon points={buildPoly(WW_AVEC)} fill="rgba(196,43,71,0.18)" stroke="#C42B47" strokeWidth={2} />

          {/* Auto-annotations where gap > 10 */}
          {WW_RADAR_AXES.map((_, i) => {
            const gap = WW_AVEC[i] - WW_SANS[i];
            if (Math.abs(gap) <= 10) return null;
            const midR = ((WW_AVEC[i] / 100) * R) + 12;
            const { x, y } = polarXY(midR, i);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" style={{ fill: gap > 0 ? "#22C55E" : "#EF4444", fontSize: 8, fontWeight: 700 }}>
                {gap > 0 ? "+" : ""}{gap}%
              </text>
            );
          })}

          {/* Labels + hover zones per axis */}
          {WW_RADAR_AXES.map((label, i) => {
            const { x, y } = polarXY(R + 18, i);
            const textAnchor = x < CX - 8 ? "end" : x > CX + 8 ? "start" : "middle";
            // Hover zone at outer tip
            const tip = polarXY(R + 8, i);
            return (
              <g
                key={i}
                onMouseEnter={() => setTooltip({ x: mousePos.x, y: mousePos.y, idx: i })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "crosshair" }}
              >
                <circle cx={tip.x} cy={tip.y} r={16} fill="transparent" />
                <text x={x} y={y + 3} textAnchor={textAnchor} style={{ fill: "var(--color-neutral-400)", fontSize: 9, fontFamily: "var(--font-sans)" }}>
                  {label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (() => {
          const i = tooltip.idx;
          const avec = WW_AVEC[i];
          const sans = WW_SANS[i];
          const gap = avec - sans;
          return (
            <div
              style={{
                position: "absolute",
                left: tooltip.x + 12,
                top: Math.max(tooltip.y - 72, 0),
                backgroundColor: "#1C1C1F",
                border: "1px solid #C42B47",
                borderRadius: 6,
                padding: "7px 11px",
                pointerEvents: "none",
                zIndex: 50,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <p style={{ color: "white", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                {WW_RADAR_AXES[i]}
              </p>
              <p style={{ color: "#C42B47", fontSize: 10, marginBottom: 2 }}>
                Avec <span style={{ fontWeight: 700 }}>{avec}</span>
              </p>
              <p style={{ color: "#D4A017", fontSize: 10, marginBottom: 2 }}>
                Sans <span style={{ fontWeight: 700 }}>{sans}</span>
              </p>
              <p style={{ color: gap > 0 ? "#22C55E" : "#EF4444", fontSize: 10, fontWeight: 700 }}>
                {gap > 0 ? "+" : ""}{gap}%
              </p>
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: "#C42B47" }} />
          <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>Avec Enzo Millot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: "#D4A017", borderBottom: "2px dashed #D4A017", height: 0 }} />
          <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>Sans Enzo Millot</span>
        </div>
      </div>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────────
function WWTable() {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", flex: 1 }}
    >
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
          Métriques d&apos;Équipe
        </span>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{ backgroundColor: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.35)", color: "#EAB308" }}
        >
          ⚠ 24 matchs avec / 4 matchs sans
        </span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
            <th style={{ padding: "8px 16px", textAlign: "left", color: "var(--color-neutral-500)", fontSize: 10 }}>Métrique</th>
            <th style={{ padding: "8px 12px", textAlign: "center", color: "#C42B47", fontSize: 10 }}>Avec</th>
            <th style={{ padding: "8px 12px", textAlign: "center", color: "#D4A017", fontSize: 10 }}>Sans</th>
          </tr>
        </thead>
        <tbody>
          {WW_TABLE.map((row) => (
            <tr key={row.metric} style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
              <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--color-neutral-300)" }}>{row.metric}</td>
              <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, fontWeight: 700, color: row.betterWith ? "#22C55E" : "var(--color-neutral-300)" }}>
                {row.avec}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, fontWeight: 700, color: !row.betterWith ? "#22C55E" : "#EF4444" }}>
                {row.sans}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WithWithoutTab() {
  const [activeOpp, setActiveOpp] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-4">
      {/* Opponent selector */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveOpp(null)}
            className="px-3 py-1 rounded-full text-xs transition-colors"
            style={{
              backgroundColor: activeOpp === null ? "rgba(196,43,71,0.18)" : "var(--color-neutral-700)",
              border: `1px solid ${activeOpp === null ? "rgba(196,43,71,0.50)" : "var(--color-neutral-600)"}`,
              color: activeOpp === null ? "var(--color-primary-300)" : "var(--color-neutral-400)",
            }}
          >
            Tous
          </button>
          {["Top 6", "Mid-table", "Bas de tableau"].map((grp) => (
            <button
              key={grp}
              className="px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)", color: "var(--color-neutral-400)" }}
            >
              {grp}
            </button>
          ))}
          <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--color-neutral-600)" }} />
          {OPPONENTS_WW.map((opp) => {
            const active = activeOpp === opp.abbr;
            return (
              <button
                key={opp.abbr}
                onClick={() => setActiveOpp(active ? null : opp.abbr)}
                title={opp.abbr}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor: opp.color,
                  color: "white",
                  fontSize: 8,
                  outline: active ? "2px solid #C42B47" : "2px solid transparent",
                  outlineOffset: 2,
                }}
              >
                {opp.abbr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radar + Table side by side */}
      <div className="flex gap-4">
        <WWRadar />
        <WWTable />
      </div>
    </div>
  );
}
