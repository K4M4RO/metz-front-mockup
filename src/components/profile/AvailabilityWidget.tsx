"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { AVAILABILITY } from "@/data/enzo-millot";

// ── Circular gauge ────────────────────────────────────────────────────────────
function CircularGauge({ pct, played, total }: { pct: number; played: number; total: number }) {
  const R = 46;
  const circumference = 2 * Math.PI * R;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center" style={{ minWidth: 120 }}>
      <svg width={112} height={112} viewBox="0 0 112 112">
        {/* Track */}
        <circle
          cx={56}
          cy={56}
          r={R}
          fill="none"
          stroke="var(--color-neutral-700)"
          strokeWidth={8}
        />
        {/* Grenat arc */}
        <circle
          cx={56}
          cy={56}
          r={R}
          fill="none"
          stroke="#C42B47"
          strokeWidth={8}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
          style={{ transform: "rotate(-90deg)", transformOrigin: "56px 56px" }}
        />
        {/* Center text */}
        <text
          x={56}
          y={52}
          textAnchor="middle"
          style={{
            fill: "var(--color-neutral-100)",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {pct}%
        </text>
        <text
          x={56}
          y={67}
          textAnchor="middle"
          style={{
            fill: "var(--color-neutral-500)",
            fontSize: 10,
            fontFamily: "var(--font-sans)",
          }}
        >
          {played}/{total} matchs
        </text>
      </svg>
      <span
        className="text-xs mt-1 text-center"
        style={{ color: "var(--color-neutral-400)" }}
      >
        Disponibilité saison
      </span>
    </div>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
interface TooltipPayloadItem {
  value: number;
}

function MinutageTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const mins = payload[0].value;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-600)",
        boxShadow: "var(--shadow-dropdown)",
      }}
    >
      <p style={{ color: "var(--color-neutral-300)", fontWeight: 600 }}>
        JJ {label}
      </p>
      {mins === 0 ? (
        <p style={{ color: "var(--color-warning)" }}>Blessure / absent</p>
      ) : (
        <p style={{ color: "var(--color-neutral-400)" }}>{mins} minutes</p>
      )}
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export function AvailabilityWidget() {
  const data = AVAILABILITY.minutes.map((mins, i) => ({
    jj: i + 1,
    minutes: mins,
  }));

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider block mb-4"
        style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
      >
        Disponibilité & Minutage
      </span>

      <div className="flex gap-5 items-start">
        {/* Circular gauge */}
        <CircularGauge
          pct={AVAILABILITY.pct}
          played={AVAILABILITY.played}
          total={AVAILABILITY.total}
        />

        {/* Line chart */}
        <div className="flex-1" style={{ minHeight: 120 }}>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-neutral-700)"
                vertical={false}
              />
              <XAxis
                dataKey="jj"
                tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                domain={[0, 120]}
                tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                ticks={[0, 45, 90]}
              />
              <Tooltip content={<MinutageTooltip />} />
              <ReferenceLine
                y={90}
                stroke="var(--color-neutral-600)"
                strokeDasharray="4 3"
                strokeWidth={1}
              />
              {/* Injury zones */}
              {AVAILABILITY.injuries.map((inj, i) => (
                <ReferenceArea
                  key={i}
                  x1={inj.start}
                  x2={inj.end}
                  fill="rgba(234,179,8,0.10)"
                  stroke="rgba(234,179,8,0.30)"
                  strokeWidth={1}
                />
              ))}
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#C42B47"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#C42B47" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {[
              { label: `${AVAILABILITY.played} matchs`, color: "var(--color-neutral-300)" },
              { label: `${AVAILABILITY.pct}% dispo`, color: "#C42B47" },
              { label: "20 titulaire", color: "var(--color-neutral-400)" },
              { label: "4 remplaçant", color: "var(--color-neutral-400)" },
            ].map((b) => (
              <span
                key={b.label}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--color-neutral-700)",
                  color: b.color,
                  border: "1px solid var(--color-neutral-600)",
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
