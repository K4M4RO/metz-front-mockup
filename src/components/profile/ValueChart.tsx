"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { VALUE_HISTORY } from "@/data/enzo-millot";

interface TooltipPayloadItem {
  value: number;
}

function ValueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-600)",
        boxShadow: "var(--shadow-dropdown)",
      }}
    >
      <p
        className="font-semibold"
        style={{
          color: "var(--color-neutral-200)",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        {label}
      </p>
      <p style={{ color: "#C42B47", fontWeight: 700, fontSize: 13 }}>
        {val}M€
      </p>
    </div>
  );
}

export function ValueChart() {
  const data = VALUE_HISTORY.map((d) => ({
    month: d.month.replace(" 20", " '"),
    value: d.value,
    age: d.age,
  }));

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
        >
          Valeur Marchande — 5 ans
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className="font-bold"
            style={{
              color: "#22C55E",
              fontSize: 18,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            12M€
          </span>
          <span className="text-xs" style={{ color: "#22C55E" }}>
            ↑
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C42B47" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#C42B47" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-neutral-700)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip content={<ValueTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#C42B47"
            strokeWidth={2}
            fill="url(#valueGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#C42B47" }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
