"use client";

// ─── Generic Reusable Pitch SVG ───────────────────────────────────────────────

interface PitchSVGProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** If true, pitch is rendered horizontally (landscape) */
  horizontal?: boolean;
}

export const PITCH_PAD = 16;

export function PitchSVG({
  width = 340,
  height = 480,
  children,
  style,
  horizontal = false,
}: PitchSVGProps) {
  const W = horizontal ? (height || 480) : (width || 340);
  const H = horizontal ? (width || 340) : (height || 480);
  const pad = PITCH_PAD;

  // Internal dimensions for the grass area
  const IW = W - 2 * pad;
  const IH = H - 2 * pad;

  return (
    <svg
      width={W}
      height={H}
      style={{ display: "block", borderRadius: 8, overflow: "hidden", flexShrink: 0, ...style }}
      viewBox={`0 0 ${W} ${H}`}
    >
      {/* Background */}
      <rect x={0} y={0} width={W} height={H} fill="#0a3d1a" />

      {/* Grass stripes */}
      {Array.from({ length: 10 }).map((_, i) => {
        const stripeSize = horizontal ? IH / 10 : IW / 10;
        return (
          <rect
            key={i}
            x={horizontal ? pad : pad + i * stripeSize}
            y={horizontal ? pad + i * stripeSize : pad}
            width={horizontal ? IW : stripeSize}
            height={horizontal ? stripeSize : IH}
            fill={i % 2 === 0 ? "#0f4d1f" : "#0d4520"}
          />
        );
      })}

      {/* Pitch outline */}
      <rect x={pad} y={pad} width={IW} height={IH}
        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} />

      {/* Centre line */}
      {horizontal ? (
        <line x1={W / 2} y1={pad} x2={W / 2} y2={H - pad} stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      ) : (
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      )}

      {/* Centre circle */}
      <circle cx={W / 2} cy={H / 2} r={Math.min(IW, IH) * 0.18}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <circle cx={W / 2} cy={H / 2} r={2} fill="rgba(255,255,255,0.40)" />

      {/* Penalty areas */}
      {!horizontal ? (
        <>
          {/* Top (away) */}
          <rect x={pad + IW * 0.22} y={pad} width={IW * 0.56} height={IH * 0.18} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
          {/* Bottom (home) */}
          <rect x={pad + IW * 0.22} y={H - pad - IH * 0.18} width={IW * 0.56} height={IH * 0.18} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        </>
      ) : (
        <>
          {/* Left (home) */}
          <rect x={pad} y={pad + IH * 0.22} width={IW * 0.18} height={IH * 0.56} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
          {/* Right (away) */}
          <rect x={W - pad - IW * 0.18} y={pad + IH * 0.22} width={IW * 0.18} height={IH * 0.56} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        </>
      )}

      {/* Goals */}
      {!horizontal ? (
        <>
          <rect x={pad + IW * 0.42} y={pad - 2} width={IW * 0.16} height={6} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
          <rect x={pad + IW * 0.42} y={H - pad - 4} width={IW * 0.16} height={6} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
        </>
      ) : (
        <>
          <rect x={pad - 4} y={pad + IH * 0.42} width={6} height={IH * 0.16} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
          <rect x={W - pad - 2} y={pad + IH * 0.42} width={6} height={IH * 0.16} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
        </>
      )}

      {/* Children (overlays) */}
      {children}
    </svg>
  );
}

// Helper to convert relative coords to absolute SVG coords
export function relToAbs(rx: number, ry: number, W: number, H: number) {
  return {
    x: PITCH_PAD + rx * (W - 2 * PITCH_PAD),
    y: PITCH_PAD + ry * (H - 2 * PITCH_PAD),
  };
}
