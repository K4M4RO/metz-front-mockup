"use client";

import { useState } from "react";
import { SHOTS, type ShotType } from "@/data/enzo-millot";

const SVG_W = 420;
const SVG_H = 320;

const SHOT_STYLES: Record<ShotType, { fill: string; stroke: string; label: string }> = {
  goal:    { fill: "#C42B47",  stroke: "#C42B47",  label: "Buts" },
  saved:   { fill: "#D4A017",  stroke: "#D4A017",  label: "Arrêtés" },
  missed:  { fill: "#71717A",  stroke: "#71717A",  label: "Manqués" },
  blocked: { fill: "var(--color-neutral-800)", stroke: "#C42B47", label: "Bloqués" },
};

const FILTERS: { id: ShotType | "all"; label: string }[] = [
  { id: "all",     label: "Tous" },
  { id: "goal",    label: "Buts" },
  { id: "saved",   label: "Arrêtés" },
  { id: "missed",  label: "Manqués" },
  { id: "blocked", label: "Bloqués" },
];

export function ShotMap() {
  const [filter, setFilter] = useState<ShotType | "all">("all");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const visible = SHOTS.filter((s) => filter === "all" || s.type === filter);

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
      }}
    >
      {/* Header + filters */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
        >
          Shot Map
        </span>
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-2 py-0.5 rounded text-xs transition-colors"
                style={{
                  backgroundColor: active
                    ? "rgba(196,43,71,0.18)"
                    : "var(--color-neutral-700)",
                  border: `1px solid ${active ? "rgba(196,43,71,0.50)" : "var(--color-neutral-600)"}`,
                  color: active
                    ? "var(--color-primary-300)"
                    : "var(--color-neutral-400)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG half-pitch */}
      <div className="flex justify-center">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ maxWidth: "100%", height: "auto" }}
        >
          {/* Pitch background */}
          <rect width={SVG_W} height={SVG_H} fill="#132213" />

          {/* Pitch outline (half) */}
          <rect
            x={8}
            y={8}
            width={SVG_W - 16}
            height={SVG_H - 8}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />

          {/* Halfway line (bottom edge) */}
          <line
            x1={8}
            y1={SVG_H}
            x2={SVG_W - 8}
            y2={SVG_H}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />

          {/* Penalty box */}
          <rect
            x={SVG_W * 0.22}
            y={8}
            width={SVG_W * 0.56}
            height={SVG_H * 0.52}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />

          {/* 6-yard box */}
          <rect
            x={SVG_W * 0.36}
            y={8}
            width={SVG_W * 0.28}
            height={SVG_H * 0.18}
            fill="none"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth={1}
          />

          {/* Goal */}
          <rect
            x={SVG_W * 0.42}
            y={4}
            width={SVG_W * 0.16}
            height={8}
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />

          {/* Penalty spot */}
          <circle
            cx={SVG_W / 2}
            cy={SVG_H * 0.34}
            r={3}
            fill="rgba(255,255,255,0.30)"
          />

          {/* Penalty arc */}
          <path
            d={`M ${SVG_W * 0.27} ${SVG_H * 0.52} Q ${SVG_W / 2} ${SVG_H * 0.62} ${SVG_W * 0.73} ${SVG_H * 0.52}`}
            fill="none"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth={1}
          />

          {/* Shot dots */}
          {visible.map((shot, i) => {
            const style = SHOT_STYLES[shot.type];
            const isHovered = hoveredIdx === i;
            const r = shot.type === "goal" ? 7 : 5;
            return (
              <g key={i}>
                {isHovered && (
                  <circle
                    cx={shot.x}
                    cy={shot.y}
                    r={r + 5}
                    fill={style.fill}
                    opacity={0.20}
                  />
                )}
                <circle
                  cx={shot.x}
                  cy={shot.y}
                  r={r}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={shot.type === "blocked" ? 1.5 : 0}
                  opacity={0.85}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {shot.type === "goal" && (
                  <text
                    x={shot.x}
                    y={shot.y + 3.5}
                    textAnchor="middle"
                    style={{ fontSize: 7, fill: "white", pointerEvents: "none" }}
                  >
                    ⚽
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        {(Object.entries(SHOT_STYLES) as [ShotType, typeof SHOT_STYLES[ShotType]][]).map(
          ([type, style]) => {
            const count = SHOTS.filter((s) => s.type === type).length;
            return (
              <div key={type} className="flex items-center gap-1.5">
                <svg width={10} height={10}>
                  <circle
                    cx={5}
                    cy={5}
                    r={4}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={type === "blocked" ? 1.5 : 0}
                  />
                </svg>
                <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>
                  {style.label}{" "}
                  <span style={{ color: "var(--color-neutral-300)", fontWeight: 600 }}>
                    {count}
                  </span>
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
