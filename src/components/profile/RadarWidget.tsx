"use client";

import { useState } from "react";
import { RADAR_AXES, RADAR_PLAYER, RADAR_BENCHMARK } from "@/data/enzo-millot";

const CX = 160;
const CY = 155;
const R = 110;
const N = RADAR_AXES.length;

function polarToXY(angle: number, r: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

function buildPolygon(values: readonly number[]) {
  return values
    .map((v, i) => {
      const angle = (360 / N) * i;
      const r = (v / 100) * R;
      const { x, y } = polarToXY(angle, r);
      return `${x},${y}`;
    })
    .join(" ");
}

interface TooltipState {
  x: number;
  y: number;
  label: string;
  playerVal: number;
  benchVal: number;
}

export function RadarWidget() {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const rings = [0.25, 0.5, 0.75, 1];
  const axes = RADAR_AXES.map((_, i) => {
    const angle = (360 / N) * i;
    const outer = polarToXY(angle, R);
    return { inner: polarToXY(angle, 0), outer };
  });

  return (
    <div
      className="rounded-lg p-4 flex flex-col"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
        >
          Radar de Performance
        </span>
        <button
          onClick={() => setShowBenchmark((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors"
          style={{
            backgroundColor: showBenchmark ? "rgba(59,130,246,0.15)" : "var(--color-neutral-700)",
            border: `1px solid ${showBenchmark ? "rgba(59,130,246,0.4)" : "var(--color-neutral-600)"}`,
            color: showBenchmark ? "#3B82F6" : "var(--color-neutral-400)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: showBenchmark ? "#3B82F6" : "var(--color-neutral-500)" }}
          />
          Benchmark
        </button>
      </div>

      {/* SVG Radar */}
      <div className="flex justify-center" style={{ position: "relative" }}>
        <svg
          width={320}
          height={310}
          viewBox="0 0 320 310"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            if (tooltip) setTooltip((t) => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Background rings */}
          {rings.map((ratio, ri) => {
            const pts = Array.from({ length: N }, (_, i) => {
              const angle = (360 / N) * i;
              const { x, y } = polarToXY(angle, R * ratio);
              return `${x},${y}`;
            }).join(" ");
            return (
              <polygon
                key={ri}
                points={pts}
                fill="none"
                stroke="var(--color-neutral-700)"
                strokeWidth={0.8}
              />
            );
          })}

          {/* Axis lines */}
          {axes.map((ax, i) => (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={ax.outer.x} y2={ax.outer.y}
              stroke="var(--color-neutral-700)"
              strokeWidth={0.8}
            />
          ))}

          {/* Benchmark polygon */}
          {showBenchmark && (
            <>
              <polygon
                points={buildPolygon(RADAR_BENCHMARK)}
                fill="rgba(59,130,246,0.12)"
                stroke="#3B82F6"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              {RADAR_BENCHMARK.map((v, i) => {
                const angle = (360 / N) * i;
                const r = (v / 100) * R;
                const { x, y } = polarToXY(angle, r);
                return <circle key={i} cx={x} cy={y} r={2.5} fill="#3B82F6" />;
              })}
            </>
          )}

          {/* Player polygon */}
          <polygon
            points={buildPolygon(RADAR_PLAYER)}
            fill="rgba(196,43,71,0.20)"
            stroke="#C42B47"
            strokeWidth={2}
          />
          {RADAR_PLAYER.map((v, i) => {
            const angle = (360 / N) * i;
            const r = (v / 100) * R;
            const { x, y } = polarToXY(angle, r);
            return <circle key={i} cx={x} cy={y} r={3} fill="#C42B47" />;
          })}

          {/* Axis labels + hover zones */}
          {RADAR_AXES.map((label, i) => {
            const angle = (360 / N) * i;
            const labelR = R + 20;
            const { x, y } = polarToXY(angle, labelR);
            const playerVal = RADAR_PLAYER[i];
            const benchVal = RADAR_BENCHMARK[i];

            const textAnchor = x < CX - 10 ? "end" : x > CX + 10 ? "start" : "middle";
            const dy = y < CY - 10 ? -2 : y > CY + 10 ? 10 : 4;

            // Outer tip of axis — hover target
            const tipR = R + 8;
            const tip = polarToXY(angle, tipR);

            return (
              <g
                key={i}
                onMouseEnter={() =>
                  setTooltip({ x: mousePos.x, y: mousePos.y, label, playerVal, benchVal })
                }
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "crosshair" }}
              >
                {/* Invisible hover circle at axis tip */}
                <circle cx={tip.x} cy={tip.y} r={18} fill="transparent" />
                <text
                  x={x} y={y + dy}
                  textAnchor={textAnchor}
                  style={{ fill: "var(--color-neutral-400)", fontSize: 10, fontFamily: "var(--font-sans)" }}
                >
                  {label}
                </text>
                <text
                  x={x} y={y + dy + 12}
                  textAnchor={textAnchor}
                  style={{ fill: "#C42B47", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-dm-sans)" }}
                >
                  {playerVal}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x + 12,
              top: Math.max(tooltip.y - 64, 0),
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
              {tooltip.label}
            </p>
            <p style={{ color: "#C42B47", fontSize: 10, marginBottom: 2 }}>
              Enzo Millot <span style={{ fontWeight: 700 }}>{tooltip.playerVal}</span>
            </p>
            {showBenchmark && (
              <p style={{ color: "#3B82F6", fontSize: 10 }}>
                Benchmark <span style={{ fontWeight: 700 }}>{tooltip.benchVal}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-1">
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(196,43,71,0.20)", border: "2px solid #C42B47" }}
          />
          <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>Enzo Millot</span>
        </div>
        {showBenchmark && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: "rgba(59,130,246,0.12)", border: "2px dashed #3B82F6" }}
            />
            <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>
              Moy. Milieux Centraux
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
