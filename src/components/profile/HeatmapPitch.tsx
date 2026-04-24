"use client";

import type { HeatSpot } from "@/data/enzo-millot-extended";

function intensityColor(i: number): string {
  if (i > 0.78) return "#FF6B35";
  if (i > 0.55) return "#C42B47";
  if (i > 0.35) return "#7B2D8B";
  return "#1E3A5F";
}

interface Props {
  hotspots: HeatSpot[];
  width?: number;
  idPrefix?: string;
}

export function HeatmapPitch({ hotspots, width = 800, idPrefix = "hm" }: Props) {
  const W = width;
  const H = Math.round(W * 68 / 105);

  return (
    <svg 
      width="100%" 
      height="auto" 
      viewBox={`0 0 ${W} ${H}`} 
      style={{ display: "block", borderRadius: 4, overflow: "hidden" }}
    >
      {/* Green pitch background */}
      <rect width={W} height={H} fill="#0A2E0A" />

      {/* Heatmap blobs */}
      <defs>
        {hotspots.map((s, i) => (
          <radialGradient key={i} id={`${idPrefix}-g${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={intensityColor(s.intensity)} stopOpacity={s.intensity * 0.82} />
            <stop offset="50%"  stopColor={intensityColor(s.intensity * 0.6)} stopOpacity={s.intensity * 0.40} />
            <stop offset="100%" stopColor={intensityColor(0.1)} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {hotspots.map((s, i) => (
        <ellipse
          key={i}
          cx={s.x * W}
          cy={s.y * H}
          rx={s.r * W}
          ry={s.r * W * 0.68}
          fill={`url(#${idPrefix}-g${i})`}
        />
      ))}

      {/* Pitch lines on top */}
      {/* Outer boundary */}
      <rect x={4} y={4} width={W - 8} height={H - 8} fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth={1} />
      {/* Halfway */}
      <line x1={W/2} y1={4} x2={W/2} y2={H-4} stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
      {/* Center circle */}
      <ellipse cx={W/2} cy={H/2} rx={H*0.22} ry={H*0.22} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
      {/* Left penalty box */}
      <rect x={4} y={H*0.22} width={W*0.168} height={H*0.56} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      {/* Right penalty box */}
      <rect x={W-4-W*0.168} y={H*0.22} width={W*0.168} height={H*0.56} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      {/* Left 6-yard */}
      <rect x={4} y={H*0.36} width={W*0.056} height={H*0.28} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />
      {/* Right 6-yard */}
      <rect x={W-4-W*0.056} y={H*0.36} width={W*0.056} height={H*0.28} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />
      {/* Goals */}
      <rect x={0} y={H*0.40} width={4} height={H*0.20} fill="rgba(255,255,255,0.20)" />
      <rect x={W-4} y={H*0.40} width={4} height={H*0.20} fill="rgba(255,255,255,0.20)" />
    </svg>
  );
}
