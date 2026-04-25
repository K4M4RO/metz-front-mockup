"use client";

import Image from "next/image";
import { Info } from "lucide-react";

interface TeamPoint {
  id: string;
  name: string;
  value: number;
  isOpponent?: boolean;
  isMetz?: boolean;
}

interface LeagueDistributionProps {
  title: string;
  metricLabel: string;
  description: string;
  teams: TeamPoint[];
  minLabel?: string;
  maxLabel?: string;
}

export function LeagueDistribution({
  title,
  metricLabel,
  description,
  teams,
  minLabel = "Pire",
  maxLabel = "Meilleur"
}: LeagueDistributionProps) {
  const sorted = [...teams].sort((a, b) => a.value - b.value);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const metz = teams.find(t => t.isMetz);
  const opponent = teams.find(t => t.isOpponent);

  const getPos = (val: number) => {
    const range = max.value - min.value || 1;
    return ((val - min.value) / range) * 100;
  };

  return (
    <div
      className="w-full rounded-xl p-4 mb-6 transition-all"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-surface)")}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h4
            className="text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h4>
          <div className="group relative">
            <Info size={12} style={{ color: "var(--text-muted)" }} className="cursor-help" />
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
              style={{
                background: "var(--bg-surface-raised)",
                border: "1px solid var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              {description}
            </div>
          </div>
        </div>
        <div
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
          style={{ color: "var(--color-primary-400)", backgroundColor: "rgba(var(--primary-rgb), 0.1)" }}
        >
          {metricLabel}
        </div>
      </div>

      <div className="relative h-12 flex items-center">
        {/* The Line */}
        <div className="absolute w-full h-[1px]" style={{ background: "var(--border-default)" }} />

        {/* Background Dots */}
        {teams.filter(t =>
          t.id !== min.id &&
          t.id !== max.id &&
          !t.isMetz &&
          !t.isOpponent
        ).map((t, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: "var(--color-neutral-500)", left: `${getPos(t.value)}%`, transform: 'translateX(-50%)' }}
          />
        ))}

        {/* Min Team */}
        <div className="absolute flex flex-col items-center gap-1" style={{ left: '0%', transform: 'translateX(-50%)' }}>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}
          >
            <span className="text-[8px] font-bold" style={{ color: "var(--text-muted)" }}>{min.name.substring(0,2).toUpperCase()}</span>
          </div>
          <span className="text-[7px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{minLabel}</span>
        </div>

        {/* Max Team */}
        <div className="absolute flex flex-col items-center gap-1" style={{ left: '100%', transform: 'translateX(-50%)' }}>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-default)" }}
          >
            <span className="text-[8px] font-bold" style={{ color: "var(--text-muted)" }}>{max.name.substring(0,2).toUpperCase()}</span>
          </div>
          <span className="text-[7px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{maxLabel}</span>
        </div>

        {/* Opponent */}
        {opponent && (
          <div className="absolute flex flex-col items-center gap-1 z-10" style={{ left: `${getPos(opponent.value)}%`, transform: 'translateX(-50%)' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: "var(--bg-surface)",
                border: "2px solid var(--color-warning)",
                boxShadow: "0 0 12px rgba(var(--warning-rgb), 0.3)",
              }}
            >
               <span className="text-[10px] font-black" style={{ color: "var(--text-primary)" }}>{opponent.name.substring(0,2).toUpperCase()}</span>
            </div>
            <span className="text-[8px] font-black uppercase" style={{ color: "var(--color-warning)" }}>{opponent.name}</span>
          </div>
        )}

        {/* FC Metz — fond blanc + bordure grenat pour que le logo soit visible dans les 2 modes */}
        {metz && (
          <div className="absolute flex flex-col items-center gap-1 z-20" style={{ left: `${getPos(metz.value)}%`, transform: 'translateX(-50%)' }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: "var(--bg-surface)",
                border: "2.5px solid var(--color-primary-400)",
                boxShadow: "0 0 16px rgba(var(--primary-rgb), 0.35)",
              }}
            >
               <Image src="/fc-metz-logo.png" alt="FC Metz" width={26} height={26} className="object-contain" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter" style={{ color: "var(--color-primary-400)" }}>FC Metz</span>
          </div>
        )}
      </div>
    </div>
  );
}
