"use client";

// ─── Donut Chart SVG ──────────────────────────────────────────────────────────

interface DonutChartProps {
  value: number;       // 0–100
  label: string;
  sublabel?: string;
  size?: number;
  color?: string;
  trackColor?: string;
}

export function DonutChart({
  value,
  label,
  sublabel,
  size = 96,
  color = "#C42B47",
  trackColor = "rgba(255,255,255,0.08)",
}: DonutChartProps) {
  const r = (size - 16) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke={trackColor} strokeWidth={10} />
          {/* Progress */}
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth={10}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        {/* Center value */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontSize: 18,
            fontWeight: 800,
            color: "var(--color-neutral-100)",
            lineHeight: 1,
          }}>
            {value}%
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-200)" }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginTop: 2 }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
