"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ExternalLink, BookmarkPlus, GitCompare, Calendar, Euro } from "lucide-react";
import { type Player, STATUS_CONFIG, RATING_CONFIG, POSITION_LABELS } from "@/data/players";

// ─── Mini Radar SVG ────────────────────────────────────────────────────────────
function MiniRadar({ radar }: { radar: Player["radar"] }) {
  const cx = 110, cy = 100, R = 75;
  const axes = ["technique", "physique", "vitesse", "vision", "pressing", "dribble"] as const;
  const axisLabels = ["Technique", "Physique", "Vitesse", "Vision", "Pressing", "Dribble"];

  function getPoint(idx: number, pct: number) {
    const angle = ((idx * 60 - 90) * Math.PI) / 180;
    return { x: cx + R * pct * Math.cos(angle), y: cy + R * pct * Math.sin(angle) };
  }

  function ringPolygon(scale: number) {
    return Array.from({ length: 6 }, (_, i) => {
      const p = getPoint(i, scale);
      return `${p.x},${p.y}`;
    }).join(" ");
  }

  const playerPoints = axes
    .map((ax, i) => {
      const p = getPoint(i, radar[ax] / 100);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  function labelPos(idx: number) {
    const angle = ((idx * 60 - 90) * Math.PI) / 180;
    const r = R + 16;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  return (
    <svg viewBox="0 0 220 200" className="w-full" style={{ maxHeight: 180 }}>
      {/* Background rings */}
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={ringPolygon(s)}
          fill="none"
          stroke="var(--color-neutral-700)"
          strokeWidth={s === 1 ? 1 : 0.5}
        />
      ))}
      {/* Axis lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const p = getPoint(i, 1);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--color-neutral-700)" strokeWidth="0.5" />
        );
      })}
      {/* Player polygon */}
      <polygon
        points={playerPoints}
        fill="rgba(var(--primary-rgb), 0.18)"
        stroke="var(--color-primary-500)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Player dots */}
      {axes.map((ax, i) => {
        const p = getPoint(i, radar[ax] / 100);
        return <circle key={ax} cx={p.x} cy={p.y} r="3" fill="var(--color-primary-400)" />;
      })}
      {/* Labels */}
      {axisLabels.map((label, i) => {
        const pos = labelPos(i);
        const anchor = pos.x < cx - 10 ? "end" : pos.x > cx + 10 ? "start" : "middle";
        return (
          <text
            key={label}
            x={pos.x}
            y={pos.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="8.5"
            fill="var(--color-neutral-500)"
            fontFamily="var(--font-inter)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Metric row ────────────────────────────────────────────────────────────────
function MetricRow({ label, value, unit, pct }: { label: string; value: string; unit?: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>{label}</span>
        <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--color-neutral-200)" }}>
          {value}
          {unit && <span style={{ color: "var(--color-neutral-500)" }}> {unit}</span>}
        </span>
      </div>
      <div className="h-1 rounded" style={{ backgroundColor: "var(--color-neutral-700)" }}>
        <div
          className="h-full rounded"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: "var(--color-primary-500)" }}
        />
      </div>
    </div>
  );
}

// ─── Main drawer ───────────────────────────────────────────────────────────────
interface Props {
  player: Player | null;
  onClose: () => void;
}

export function PlayerDrawer({ player, onClose }: Props) {
  const router = useRouter();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!player) return null;

  const statusCfg = STATUS_CONFIG[player.status];
  const ratingCfg = RATING_CONFIG[player.rating];

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-30"
        style={{ backgroundColor: "var(--overlay-bg)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="absolute right-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden"
        style={{
          width: 400,
          backgroundColor: "var(--color-neutral-800)",
          borderLeft: "1px solid var(--color-neutral-600)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
          animation: "slideInRight 220ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-5 py-4 border-b flex-shrink-0"
          style={{
            borderColor: "var(--color-neutral-600)",
            background: "linear-gradient(135deg, var(--color-neutral-800) 0%, var(--color-primary-950) 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
              style={{
                backgroundColor: "var(--color-primary-900)",
                color: "var(--color-primary-200)",
                fontFamily: "var(--font-dm-sans)",
                border: "2px solid var(--color-primary-700)",
              }}
            >
              {player.initials}
            </div>
            <div>
              <h3
                className="font-bold leading-tight"
                style={{
                  color: "var(--color-neutral-100)",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 16,
                }}
              >
                {player.firstName} {player.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>
                  {player.flag} {player.age} ans
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: "rgba(var(--primary-rgb), 0.15)",
                    border: "1px solid rgba(var(--primary-rgb), 0.35)",
                    color: "var(--color-primary-400)",
                  }}
                >
                  {player.position}
                </span>
                {!player.isUE && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: "rgba(var(--danger-rgb), 0.12)",
                      border: "1px solid rgba(var(--danger-rgb), 0.30)",
                      color: "var(--color-danger)",
                    }}
                  >
                    NON-UE
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{ color: "var(--color-neutral-500)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-200)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)";
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Club info */}
        <div
          className="flex items-center gap-4 px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: "var(--color-neutral-700)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>Club</span>
            <span className="text-xs font-medium" style={{ color: "var(--color-neutral-200)" }}>{player.club}</span>
          </div>
          <div className="h-3 w-px" style={{ backgroundColor: "var(--color-neutral-700)" }} />
          <div className="flex items-center gap-1.5">
            <Calendar size={11} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)" }} />
            <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>
              Contrat jusqu&apos;à{" "}
              <span style={{ color: "var(--color-neutral-200)" }}>{player.contractEnd}</span>
            </span>
          </div>
          <div className="h-3 w-px" style={{ backgroundColor: "var(--color-neutral-700)" }} />
          <div className="flex items-center gap-1.5">
            <Euro size={11} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--color-neutral-200)" }}>
              {player.marketValue}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {/* Status + Rating */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-1 rounded font-medium"
              style={{
                backgroundColor: statusCfg.bg,
                border: `1px solid ${statusCfg.border}`,
                color: statusCfg.color,
              }}
            >
              {player.status}
            </span>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: ratingCfg.bg, border: `1px solid ${ratingCfg.border}`, color: ratingCfg.color }}
            >
              {player.rating}
            </div>
            <span className="text-xs ml-auto" style={{ color: "var(--color-neutral-500)" }}>
              Note globale{" "}
              <span className="font-semibold" style={{ color: "var(--color-neutral-300)" }}>
                {player.note.toFixed(1)}/10
              </span>
            </span>
          </div>

          {/* Radar */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-neutral-500)" }}
            >
              Profil de performance
            </h4>
            <MiniRadar radar={player.radar} />
          </div>

          {/* Key metrics */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-neutral-500)" }}
            >
              Métriques clés / 90min
            </h4>
            <div className="flex flex-col gap-3">
              <MetricRow label="Expected Goals (xG)" value={player.xG.toFixed(2)} pct={player.xG * 100} />
              <MetricRow label="Expected Assists (xA)" value={player.xA.toFixed(2)} pct={player.xA * 125} />
              <MetricRow label="Expected Threat (xT)" value={player.xThreat.toFixed(2)} pct={player.xThreat * 200} />
              <MetricRow label="Vitesse max" value={player.speed.toFixed(1)} unit="km/h" pct={(player.speed / 38) * 100} />
              <MetricRow label="Distance parcourue" value={player.distance.toFixed(1)} unit="km" pct={(player.distance / 13) * 100} />
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div
          className="flex flex-col gap-2 px-5 py-4 border-t flex-shrink-0"
          style={{ borderColor: "var(--color-neutral-600)" }}
        >
          <button
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-primary-600)",
              color: "white",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-500)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-600)")}
            onClick={() => router.push(`/recrutement/joueurs/${player.id}`)}
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            Ouvrir la fiche complète
          </button>
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: "var(--color-neutral-700)",
                color: "var(--color-neutral-300)",
                border: "1px solid var(--color-neutral-600)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-600)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)")}
            >
              <BookmarkPlus size={13} strokeWidth={1.5} />
              Shortlist
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: "var(--color-neutral-700)",
                color: "var(--color-neutral-300)",
                border: "1px solid var(--color-neutral-600)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-600)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)")}
            >
              <GitCompare size={13} strokeWidth={1.5} />
              Comparer
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
