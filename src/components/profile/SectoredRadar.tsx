"use client";

import { useState } from "react";
import type { SectorDatum } from "@/data/enzo-millot-extended";

// Percentile → color (Section 15.1)
function pctColor(pct: number): string {
  if (pct >= 91) return "#7B1E2E";
  if (pct >= 75) return "#C0392B";
  if (pct >= 58) return "#E67E22";
  if (pct >= 41) return "#F1C40F";
  if (pct >= 25) return "#27AE60";
  if (pct >= 8)  return "#2980B9";
  return "#16A085";
}

function toRad(deg: number) { return (deg - 90) * (Math.PI / 180); }

function polarXY(cx: number, cy: number, r: number, deg: number) {
  return { x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) };
}

function sectorPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const s = polarXY(cx, cy, r, startDeg);
  const e = polarXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)} Z`;
}

interface TooltipState {
  x: number;
  y: number;
  label: string;
  value: number;
  displayText: string;
}

interface Props {
  sectors: SectorDatum[];
  title: string;
  size?: number;
}

export function SectoredRadar({ sectors, title, size = 220 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const N = sectors.length;
  const span = 360 / N;
  const GAP = 2;

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="rounded-lg p-4 flex flex-col items-center"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
        flex: 1,
        position: "relative",
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider mb-3 text-center"
        style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em", fontSize: 10 }}
      >
        {title}
      </span>

      <div style={{ position: "relative" }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Background rings */}
          {[0.33, 0.67, 1].map((ratio, ri) => (
            <circle
              key={ri}
              cx={cx} cy={cy} r={R * ratio}
              fill="none"
              stroke="var(--color-neutral-700)"
              strokeWidth={0.6}
              strokeDasharray={ri < 2 ? "2 2" : undefined}
            />
          ))}

          {sectors.map((sector, i) => {
            const startDeg = i * span + GAP / 2;
            const endDeg = (i + 1) * span - GAP / 2;
            const midDeg = (startDeg + endDeg) / 2;
            const fillR = (sector.value / 100) * R;
            const color = pctColor(sector.value);

            const textR = Math.max(fillR * 0.55, 12);
            const textPos = polarXY(cx, cy, textR, midDeg);

            const labelR = R + 16;
            const labelPos = polarXY(cx, cy, labelR, midDeg);
            const textAnchor =
              Math.abs(labelPos.x - cx) < 5 ? "middle" :
              labelPos.x < cx ? "end" : "start";

            return (
              <g
                key={i}
                onMouseEnter={() =>
                  setTooltip({
                    x: mousePos.x,
                    y: mousePos.y,
                    label: sector.label,
                    value: sector.value,
                    displayText: sector.displayText,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "crosshair" }}
              >
                {/* Background sector — full radius, always hoverable */}
                <path
                  d={sectorPath(cx, cy, R, startDeg, endDeg)}
                  fill="var(--color-neutral-700)"
                  opacity={0.4}
                />
                {/* Filled sector */}
                {fillR > 2 && (
                  <path
                    d={sectorPath(cx, cy, fillR, startDeg, endDeg)}
                    fill={color}
                    opacity={0.85}
                  />
                )}
                {/* Rank text inside */}
                {fillR > 14 && (
                  <text
                    x={textPos.x}
                    y={textPos.y + 3}
                    textAnchor="middle"
                    style={{
                      fill: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      fontFamily: "var(--font-dm-sans)",
                      pointerEvents: "none",
                    }}
                  >
                    {sector.displayText}
                  </text>
                )}
                {/* Outer label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 3}
                  textAnchor={textAnchor}
                  style={{
                    fill: "var(--color-neutral-400)",
                    fontSize: 8,
                    fontFamily: "var(--font-sans)",
                    pointerEvents: "none",
                  }}
                >
                  {sector.label}
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
              left: mousePos.x + 12,
              top: mousePos.y - 44,
              backgroundColor: "#1C1C1F",
              border: "1px solid #C42B47",
              borderRadius: 6,
              padding: "6px 10px",
              pointerEvents: "none",
              zIndex: 50,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <p style={{ color: "white", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>
              {tooltip.label}
            </p>
            <p style={{ color: "#C42B47", fontSize: 10 }}>
              Percentile <span style={{ fontWeight: 700 }}>{tooltip.value}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
