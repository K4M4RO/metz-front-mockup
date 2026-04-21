import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ENDURANCE_DATA } from "@/data/enzo-millot-extended";

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: readonly { value?: unknown }[]; label?: string | number; unit: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-600)", boxShadow: "var(--shadow-dropdown)" }}>
      <p style={{ color: "var(--color-neutral-300)", fontWeight: 600 }}>{label}</p>
      <p style={{ color: "var(--color-neutral-400)" }}>{payload[0].value as number} {unit}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-4 flex-1" style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}>
      <span className="text-xs font-semibold block mb-3" style={{ color: "var(--color-neutral-400)" }}>{title}</span>
      {children}
    </div>
  );
}

export function EnduranceTab() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        {/* Stamina */}
        <ChartCard title="Stamina — Distance/min (m/min)">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ENDURANCE_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-700)" vertical={false} />
              <XAxis dataKey="interval" tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[100, 140]} tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={(p) => <ChartTooltip {...p} unit="m/min" />} />
              <Line type="monotone" dataKey="stamina" stroke="#22C55E" strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2, stroke: "#22C55E" }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Intensity */}
        <ChartCard title="Intensité — HI Distance/min (m/min)">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ENDURANCE_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-700)" vertical={false} />
              <XAxis dataKey="interval" tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[20, 45]} tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={(p) => <ChartTooltip {...p} unit="m/min" />} />
              <Line type="monotone" dataKey="intensity" stroke="#F39C12" strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2, stroke: "#F39C12" }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Time played */}
        <ChartCard title="Temps joué par tranche (%)">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ENDURANCE_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-700)" vertical={false} />
              <XAxis dataKey="interval" tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[70, 92]} tick={{ fill: "var(--color-neutral-500)", fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={(p) => <ChartTooltip {...p} unit="%" />} />
              <Bar dataKey="timePct" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                {ENDURANCE_DATA.map((_, i) => (
                  <Cell key={i} fill="#C42B47" opacity={0.7 + i * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Legend */}
      <p className="text-xs text-center" style={{ color: "var(--color-neutral-500)" }}>
        Basé sur 20 matchs · Minimum 60 min jouées · Source : SkillCorner
      </p>
    </div>
  );
}
