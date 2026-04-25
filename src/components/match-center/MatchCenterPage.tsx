"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Clock, TrendingUp, AlertTriangle, ChevronRight, FileText, Radio } from "lucide-react";
import { PostMatchReport } from "./post-match/PostMatchReport";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player {
  id: number;
  name: string;
  number: number;
  x: number; // 0–1 relative to pitch width
  y: number; // 0–1 relative to pitch height
  team: "metz" | "away";
  position: string;
  rating?: number;
}

interface BenchPlayer {
  id: number;
  name: string;
  number: number;
  position: string;
  fatigue: "fresh" | "ready" | "warm" | "alert";
  warming: boolean;
}

interface MatchEvent {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub" | "chance";
  team: "metz" | "away";
  text: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const METZ_PLAYERS: Player[] = [
  { id: 1,  name: "Oukidja",     number: 16, x: 0.50, y: 0.93, team: "metz", position: "GB"  },
  { id: 2,  name: "Kouyaté",     number: 5,  x: 0.18, y: 0.80, team: "metz", position: "DC"  },
  { id: 3,  name: "Traoré",      number: 4,  x: 0.50, y: 0.80, team: "metz", position: "DC"  },
  { id: 4,  name: "Jallow",      number: 25, x: 0.82, y: 0.80, team: "metz", position: "DC"  },
  { id: 5,  name: "Centonze",    number: 26, x: 0.88, y: 0.67, team: "metz", position: "LD"  },
  { id: 6,  name: "Delaine",     number: 3,  x: 0.12, y: 0.67, team: "metz", position: "LG"  },
  { id: 7,  name: "Sarr",        number: 8,  x: 0.30, y: 0.55, team: "metz", position: "MDC" },
  { id: 8,  name: "Ambrose",     number: 21, x: 0.70, y: 0.55, team: "metz", position: "MDC" },
  { id: 9,  name: "Gakpa",       number: 7,  x: 0.15, y: 0.33, team: "metz", position: "AG"  },
  { id: 10, name: "Angban",      number: 6,  x: 0.50, y: 0.42, team: "metz", position: "MO"  },
  { id: 11, name: "Mikautadze",  number: 9,  x: 0.50, y: 0.22, team: "metz", position: "AT"  },
];

const AWAY_PLAYERS: Player[] = [
  { id: 12, name: "Penneteau",  number: 1,  x: 0.50, y: 0.07, team: "away", position: "GB"  },
  { id: 13, name: "Gravillon",  number: 5,  x: 0.20, y: 0.20, team: "away", position: "DC"  },
  { id: 14, name: "Faes",       number: 4,  x: 0.50, y: 0.20, team: "away", position: "DC"  },
  { id: 15, name: "Foket",      number: 2,  x: 0.80, y: 0.20, team: "away", position: "DC"  },
  { id: 16, name: "Sabaly",     number: 22, x: 0.88, y: 0.33, team: "away", position: "LD"  },
  { id: 17, name: "Munetsi",    number: 6,  x: 0.12, y: 0.33, team: "away", position: "LG"  },
  { id: 18, name: "Cajuste",    number: 8,  x: 0.30, y: 0.43, team: "away", position: "MC"  },
  { id: 19, name: "Lopy",       number: 29, x: 0.70, y: 0.43, team: "away", position: "MC"  },
  { id: 20, name: "Ito",        number: 7,  x: 0.14, y: 0.56, team: "away", position: "AG"  },
  { id: 21, name: "Flips",      number: 10, x: 0.86, y: 0.56, team: "away", position: "AD"  },
  { id: 22, name: "Balogun",    number: 9,  x: 0.50, y: 0.68, team: "away", position: "AT"  },
];

const BENCH: BenchPlayer[] = [
  { id: 30, name: "Niane",      number: 11, position: "AT",  fatigue: "ready",  warming: true  },
  { id: 31, name: "Maziz",      number: 14, position: "MO",  fatigue: "fresh",  warming: false },
  { id: 32, name: "N'Doram",    number: 17, position: "MDC", fatigue: "ready",  warming: false },
  { id: 33, name: "Udol",       number: 20, position: "DC",  fatigue: "fresh",  warming: false },
  { id: 34, name: "Bronn",      number: 2,  position: "LD",  fatigue: "fresh",  warming: false },
  { id: 35, name: "Diallo",     number: 23, position: "GB",  fatigue: "fresh",  warming: false },
];

const EVENTS: MatchEvent[] = [
  { minute: 12, type: "goal",    team: "metz",  text: "But ! Mikautadze (Assist. Gakpa)" },
  { minute: 28, type: "yellow",  team: "away",  text: "Avertissement Faes" },
  { minute: 34, type: "goal",    team: "away",  text: "Égalisation Balogun (tête)" },
  { minute: 51, type: "goal",    team: "metz",  text: "But ! Angban (frappe 25m)" },
  { minute: 58, type: "sub",     team: "away",  text: "Remplacement : Ito ← Berisha" },
  { minute: 65, type: "chance",  team: "metz",  text: "Énorme occasion Mikautadze (poteau)" },
  { minute: 71, type: "yellow",  team: "metz",  text: "Avertissement Sarr" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FATIGUE_CONFIG = {
  fresh: { label: "Frais",  color: "var(--color-success)", bg: "rgba(var(--success-rgb), 0.12)" },
  ready: { label: "Prêt",   color: "var(--rating-b)",      bg: "rgba(var(--rating-b-rgb), 0.12)" },
  warm:  { label: "Chaud",  color: "var(--color-warning)", bg: "rgba(var(--warning-rgb), 0.12)" },
  alert: { label: "Alerte", color: "var(--color-danger)",  bg: "rgba(var(--danger-rgb),  0.12)" },
};

const EVENT_ICON: Record<MatchEvent["type"], string> = {
  goal:   "⚽",
  yellow: "🟨",
  red:    "🟥",
  sub:    "🔄",
  chance: "💥",
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function modeBtnStyle(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.15s ease",
    background: active ? "rgba(var(--primary-rgb), 0.15)" : "transparent",
    borderColor: active ? "rgba(var(--primary-rgb), 0.4)" : "var(--color-neutral-700)",
    color: active ? "var(--color-primary-400)" : "var(--color-neutral-400)",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const PW = 340;
const PH = 500;
const PAD = 14;
const R = 13;

function Pitch({ hoveredPlayer, onHover }: {
  hoveredPlayer: number | null;
  onHover: (id: number | null) => void;
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; player: Player } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function handleEnter(e: React.MouseEvent<SVGCircleElement>, p: Player) {
    onHover(p.id);
    const rect = svgRef.current!.getBoundingClientRect();
    const cx = PAD + p.x * (PW - 2 * PAD);
    const cy = PAD + p.y * (PH - 2 * PAD);
    setTooltip({
      x: rect.left + cx,
      y: rect.top + cy,
      player: p,
    });
  }

  function handleLeave() {
    onHover(null);
    setTooltip(null);
  }

  const stripeW = (PW - 2 * PAD) / 10;

  return (
    <>
      <svg
        ref={svgRef}
        width={PW}
        height={PH}
        style={{ display: "block", borderRadius: 8, overflow: "hidden" }}
      >
        {/* Grass stripes */}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={i}
            x={PAD + i * stripeW}
            y={PAD}
            width={stripeW}
            height={PH - 2 * PAD}
            fill={i % 2 === 0 ? "#0f4d1f" : "#0d4520"}
          />
        ))}

        {/* Pitch outline */}
        <rect x={PAD} y={PAD} width={PW - 2 * PAD} height={PH - 2 * PAD}
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />

        {/* Centre line */}
        <line x1={PAD} y1={PH / 2} x2={PW - PAD} y2={PH / 2}
          stroke="rgba(255,255,255,0.22)" strokeWidth={1} />

        {/* Centre circle */}
        <circle cx={PW / 2} cy={PH / 2} r={40}
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        <circle cx={PW / 2} cy={PH / 2} r={2} fill="rgba(255,255,255,0.4)" />

        {/* Penalty areas */}
        {/* Metz (bottom) */}
        <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PH - PAD - (PH - 2 * PAD) * 0.20}
          width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        {/* Away (top) */}
        <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PAD}
          width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />

        {/* 6-yard boxes */}
        <rect x={PAD + (PW - 2 * PAD) * 0.36} y={PH - PAD - (PH - 2 * PAD) * 0.085}
          width={(PW - 2 * PAD) * 0.28} height={(PH - 2 * PAD) * 0.085}
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        <rect x={PAD + (PW - 2 * PAD) * 0.36} y={PAD}
          width={(PW - 2 * PAD) * 0.28} height={(PH - 2 * PAD) * 0.085}
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

        {/* Penalty spots */}
        <circle cx={PW / 2} cy={PAD + (PH - 2 * PAD) * 0.13} r={2} fill="rgba(255,255,255,0.35)" />
        <circle cx={PW / 2} cy={PH - PAD - (PH - 2 * PAD) * 0.13} r={2} fill="rgba(255,255,255,0.35)" />

        {/* Ball */}
        <circle cx={PW * 0.62} cy={PH * 0.28} r={5}
          fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
        <circle cx={PW * 0.62} cy={PH * 0.28} r={7}
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />

        {/* Players */}
        {[...METZ_PLAYERS, ...AWAY_PLAYERS].map((p) => {
          const cx = PAD + p.x * (PW - 2 * PAD);
          const cy = PAD + p.y * (PH - 2 * PAD);
          const isMetz = p.team === "metz";
          const isHov = hoveredPlayer === p.id;

          return (
            <g key={p.id}>
              {/* Glow on hover */}
              {isHov && (
                <circle cx={cx} cy={cy} r={R + 5}
                  fill={isMetz ? "rgba(var(--primary-rgb),0.25)" : "rgba(228,228,231,0.15)"}
                />
              )}

              {/* Shadow */}
              <circle cx={cx + 1} cy={cy + 1} r={R}
                fill="rgba(0,0,0,0.35)" />

              {/* Circle fill */}
              <circle
                cx={cx} cy={cy} r={R}
                fill={isMetz ? (isHov ? "#D43A55" : "var(--color-primary-400)") : (isHov ? "#374151" : "#1E2A3A")}
                stroke={isMetz ? (isHov ? "#F87191" : "rgba(255,255,255,0.5)") : (isHov ? "#E4E4E7" : "rgba(228,228,231,0.6)")}
                strokeWidth={isHov ? 2 : 1.5}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => handleEnter(e, p)}
                onMouseLeave={handleLeave}
              />

              {/* Number */}
              <text cx={cx} cy={cy} x={cx} y={cy + 4}
                textAnchor="middle"
                fontSize={9}
                fontWeight={700}
                fill="white"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {p.number}
              </text>

              {/* Name label */}
              <text x={cx} y={cy + R + 9}
                textAnchor="middle"
                fontSize={7}
                fontWeight={600}
                fill="rgba(255,255,255,0.75)"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {p.name.split(" ").pop()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: tooltip.x + 16,
          top: tooltip.y - 32,
          zIndex: 9999,
          background: "var(--color-neutral-900)",
          border: "1px solid var(--color-neutral-700)",
          borderRadius: 6,
          padding: "6px 10px",
          pointerEvents: "none",
          minWidth: 120,
        }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--color-neutral-100)" }}>
            {tooltip.player.name}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-400)", marginTop: 2 }}>
            #{tooltip.player.number} · {tooltip.player.position}
          </div>
          <div style={{ fontSize: 10, color: tooltip.player.team === "metz" ? "var(--color-primary-400)" : "var(--color-neutral-400)", marginTop: 2 }}>
            {tooltip.player.team === "metz" ? "FC Metz" : "Stade de Reims"}
          </div>
        </div>
      )}
    </>
  );
}

function StatBar({ label, metzVal, awayVal, metzRaw, awayRaw, unit = "" }: {
  label: string;
  metzVal: number;
  awayVal: number;
  metzRaw?: string;
  awayRaw?: string;
  unit?: string;
}) {
  const total = metzVal + awayVal || 1;
  const metzPct = (metzVal / total) * 100;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary-400)" }}>
          {metzRaw ?? `${metzVal}${unit}`}
        </span>
        <span style={{ fontSize: 10, color: "var(--color-neutral-400)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-neutral-300)" }}>
          {awayRaw ?? `${awayVal}${unit}`}
        </span>
      </div>
      <div style={{
        height: 6,
        borderRadius: 3,
        background: "var(--color-neutral-800)",
        overflow: "hidden",
        display: "flex",
      }}>
        <div style={{
          width: `${metzPct}%`,
          background: "linear-gradient(90deg, #6D071A, #C42B47)",
          borderRadius: "3px 0 0 3px",
          transition: "width 0.6s ease",
        }} />
        <div style={{
          flex: 1,
          background: "var(--color-neutral-600)",
          borderRadius: "0 3px 3px 0",
        }} />
      </div>
    </div>
  );
}

function XgBar({ metz, away }: { metz: number; away: number }) {
  const max = Math.max(metz, away, 2);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-primary-400)" }}>{metz.toFixed(2)}</span>
        <span style={{ fontSize: 10, color: "var(--color-neutral-400)", textTransform: "uppercase", letterSpacing: "0.05em" }}>xG</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-neutral-300)" }}>{away.toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", gap: 3, alignItems: "center", height: 22 }}>
        {/* Metz bar (right-aligned) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            height: 18,
            width: `${(metz / max) * 100}%`,
            background: "linear-gradient(270deg, #C42B47, #6D071A)",
            borderRadius: "4px 0 0 4px",
          }} />
        </div>
        {/* Centre divider */}
        <div style={{ width: 1, height: 22, background: "var(--color-neutral-600)" }} />
        {/* Away bar */}
        <div style={{ flex: 1 }}>
          <div style={{
            height: 18,
            width: `${(away / max) * 100}%`,
            background: "var(--color-neutral-600)",
            borderRadius: "0 4px 4px 0",
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function MatchCenterPage() {
  const START_SECONDS = 72 * 60 + 14;
  const [elapsed, setElapsed] = useState(START_SECONDS);
  const [livePulse, setLivePulse] = useState(true);
  const [hoveredPlayer, setHoveredPlayer] = useState<number | null>(null);
  const [mode, setMode] = useState<"live" | "post-match">("live");

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    const pulse = setInterval(() => setLivePulse((v) => !v), 800);
    return () => { clearInterval(timer); clearInterval(pulse); };
  }, []);

  const minute = Math.floor(elapsed / 60);

  // ── POST MATCH MODE ──────────────────────────────────────────────────────
  if (mode === "post-match") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Mode switcher bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 20px",
          background: "var(--color-neutral-900)",
          borderBottom: "1px solid var(--color-neutral-800)",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setMode("live")}
            style={modeBtnStyle(false)}
          >
            <Radio size={12} /> Live
          </button>
          <button
            onClick={() => setMode("post-match")}
            style={modeBtnStyle(true)}
          >
            <FileText size={12} /> Post-Match Report
          </button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <PostMatchReport />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--color-neutral-950)",
      color: "var(--color-neutral-100)",
      overflow: "hidden",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        background: "var(--color-neutral-900)",
        borderBottom: "1px solid var(--color-neutral-800)",
        flexShrink: 0,
      }}>
        {/* Mode Switcher inside header area (Left) */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
          <button onClick={() => setMode("live")} style={modeBtnStyle(true)}>
            <Radio size={12} /> Live
          </button>
          <button onClick={() => setMode("post-match")} style={modeBtnStyle(false)}>
            <FileText size={12} /> Post-Match
          </button>
        </div>

        {/* Left: LIVE badge + competition */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--color-danger)",
              opacity: livePulse ? 1 : 0.3,
              transition: "opacity 0.3s",
              boxShadow: livePulse ? "0 0 6px #EF4444" : "none",
            }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--color-danger)", letterSpacing: "0.12em" }}>
              LIVE
            </span>
          </div>
          <span style={{ fontSize: 11, color: "var(--color-neutral-500)" }}>
            Ligue 2 BKT · J.32
          </span>
        </div>

        {/* Centre: Score */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Metz */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-neutral-200)", marginBottom: 2 }}>
              FC Metz
            </div>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>Domicile</div>
          </div>

          {/* Scoreboard */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            background: "var(--color-neutral-950)",
            border: "1px solid var(--color-neutral-700)",
            borderRadius: 10,
            padding: "6px 4px",
          }}>
            <span style={{
              fontSize: 36,
              fontWeight: 900,
              color: "var(--color-primary-400)",
              width: 52,
              textAlign: "center",
              lineHeight: 1,
            }}>2</span>
            <span style={{ fontSize: 20, color: "var(--color-neutral-600)", margin: "0 2px" }}>—</span>
            <span style={{
              fontSize: 36,
              fontWeight: 900,
              color: "var(--color-neutral-400)",
              width: 52,
              textAlign: "center",
              lineHeight: 1,
            }}>1</span>
          </div>

          {/* Away */}
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-neutral-200)", marginBottom: 2 }}>
              Stade de Reims
            </div>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>Extérieur</div>
          </div>
        </div>

        {/* Right: Timer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} style={{ color: "var(--color-neutral-400)" }} />
            <span style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-neutral-100)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.04em",
            }}>
              {formatTime(elapsed)}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "var(--color-neutral-500)", marginTop: 2 }}>
            {minute}ème minute
          </span>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        gap: 0,
      }}>

        {/* ─── LEFT PANEL ──────────────────────────────────────────────── */}
        <div style={{
          width: 260,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--color-neutral-800)",
          overflowY: "auto",
          flexShrink: 0,
        }}>
          {/* Bench section */}
          <div style={{ padding: "14px 14px 10px" }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--color-neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <TrendingUp size={12} /> Remplaçants FC Metz
            </div>

            {BENCH.map((p) => {
              const fc = FATIGUE_CONFIG[p.fatigue];
              return (
                <div key={p.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 8px",
                  marginBottom: 4,
                  borderRadius: 6,
                  background: p.warming ? "rgba(var(--primary-rgb),0.08)" : "var(--color-neutral-900)",
                  border: `1px solid ${p.warming ? "rgba(var(--primary-rgb),0.25)" : "var(--color-neutral-800)"}`,
                  cursor: "default",
                }}>
                  {/* Number badge */}
                  <div style={{
                    width: 24, height: 24, borderRadius: 4,
                    background: p.warming ? "var(--color-primary-400)" : "var(--color-neutral-800)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: "white",
                    flexShrink: 0,
                  }}>
                    {p.number}
                  </div>

                  {/* Name + position */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{
                      fontSize: 11, fontWeight: 600,
                      color: p.warming ? "var(--color-neutral-100)" : "var(--color-neutral-300)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>{p.position}</div>
                  </div>

                  {/* Fatigue badge */}
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: fc.color,
                    background: fc.bg,
                    padding: "2px 5px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>
                    {p.warming ? "⚡ Chauffe" : fc.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--color-neutral-800)", margin: "0 14px" }} />

          {/* Event timeline */}
          <div style={{ padding: "14px 14px 16px" }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: "var(--color-neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <Activity size={12} /> Fil des événements
            </div>

            {[...EVENTS].reverse().map((ev, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                opacity: i > 4 ? 0.5 : 1,
              }}>
                {/* Minute */}
                <div style={{
                  fontSize: 9, fontWeight: 700,
                  color: "var(--color-neutral-500)",
                  minWidth: 22, paddingTop: 2,
                  textAlign: "right",
                }}>
                  {ev.minute}'
                </div>

                {/* Icon */}
                <div style={{ fontSize: 12, paddingTop: 1 }}>{EVENT_ICON[ev.type]}</div>

                {/* Text */}
                <div style={{
                  fontSize: 10,
                  color: ev.team === "metz" ? "var(--color-neutral-200)" : "var(--color-neutral-400)",
                  lineHeight: 1.4,
                  flex: 1,
                }}>
                  {ev.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CENTRE: PITCH ───────────────────────────────────────────── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          gap: 12,
          overflow: "hidden",
        }}>
          {/* Team labels above pitch */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            width: PW,
            paddingBottom: 4,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: "var(--color-neutral-500)",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1E2A3A", border: "1.5px solid #E4E4E7" }} />
              Stade de Reims (Attaque →)
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)" }}>
              Formation : 4-2-3-1
            </div>
          </div>

          <Pitch hoveredPlayer={hoveredPlayer} onHover={setHoveredPlayer} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            width: PW,
            paddingTop: 4,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: "var(--color-primary-400)",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary-400)" }} />
              FC Metz (Attaque →)
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)" }}>
              Formation : 3-4-3
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL ─────────────────────────────────────────────── */}
        <div style={{
          width: 260,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--color-neutral-800)",
          overflowY: "auto",
          flexShrink: 0,
          padding: "14px 16px",
        }}>
          {/* Title */}
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: "var(--color-neutral-500)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 16,
          }}>
            Statistiques Live
          </div>

          {/* xG */}
          <XgBar metz={1.87} away={0.72} />

          {/* Stats */}
          <StatBar label="Possession" metzVal={58} awayVal={42} metzRaw="58%" awayRaw="42%" />
          <StatBar label="Tirs (Cadrés)" metzVal={8} awayVal={5} metzRaw="8 (5)" awayRaw="5 (3)" />
          <StatBar label="Passes" metzVal={312} awayVal={241} />
          <StatBar label="Duels gagnés" metzVal={27} awayVal={21} />
          <StatBar label="Corners" metzVal={6} awayVal={2} />
          <StatBar label="Fautes" metzVal={9} awayVal={13} />
          <StatBar label="Distance (km)" metzVal={58} awayVal={54} metzRaw="58.2" awayRaw="54.1" />

          {/* Divider */}
          <div style={{ height: 1, background: "var(--color-neutral-800)", margin: "8px 0 14px" }} />

          {/* Alert section */}
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: "var(--color-neutral-500)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <AlertTriangle size={12} style={{ color: "var(--color-warning)" }} /> Alertes Staff
          </div>

          {[
            { name: "Sarr",       msg: "Avertissement reçu · 71'",                    color: "var(--color-warning)", icon: "🟨" },
            { name: "Mikautadze", msg: "Distance parcourue : 9.8km — surveillance",  color: "var(--color-danger)",  icon: "⚠️" },
            { name: "Niane",      msg: "Prêt à entrer — chauffe terminée",            color: "var(--color-success)", icon: "⚡" },
          ].map((alert, i) => (
            <div key={i} style={{
              padding: "8px 10px",
              borderRadius: 6,
              background: "var(--color-neutral-900)",
              border: `1px solid var(--color-neutral-800)`,
              marginBottom: 6,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 13 }}>{alert.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: alert.color }}>{alert.name}</div>
                <div style={{ fontSize: 10, color: "var(--color-neutral-400)", marginTop: 1, lineHeight: 1.4 }}>
                  {alert.msg}
                </div>
              </div>
            </div>
          ))}

          {/* Spacer then Momentum */}
          <div style={{ height: 1, background: "var(--color-neutral-800)", margin: "10px 0 14px" }} />

          <div style={{
            fontSize: 10, fontWeight: 700,
            color: "var(--color-neutral-500)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}>
            Momentum (10 dernières min)
          </div>

          <div style={{
            display: "flex",
            gap: 2,
            height: 36,
            alignItems: "flex-end",
          }}>
            {[0.3, 0.5, 0.7, 0.6, 0.8, 0.9, 0.75, 0.85, 0.7, 0.95].map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{
                  height: 36 * v,
                  background: i >= 7 ? "var(--color-primary-400)" : "var(--color-neutral-700)",
                  borderRadius: "2px 2px 0 0",
                  transition: "height 0.5s",
                }} />
              </div>
            ))}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            fontSize: 8,
            color: "var(--color-neutral-600)",
          }}>
            <span>62'</span><span>67'</span><span>72'</span>
          </div>
        </div>

      </div>
    </div>
  );
}
