"use client";

import { useState } from "react";
import { TRACKING_FRAME, type TrackingPlayer } from "./live-mock";

// ─── Constants ────────────────────────────────────────────────────────────────

const PW = 320;
const PH = 480;
const PAD = 14;

const ZONE_L = 0.33;   // x < 0.33 → gauche
const ZONE_R = 0.67;   // x > 0.67 → droite

// ─── Helpers ──────────────────────────────────────────────────────────────────

function px(rx: number) { return PAD + rx * (PW - 2 * PAD); }
function py(ry: number) { return PAD + ry * (PH - 2 * PAD); }

function getZone(x: number): "gauche" | "centre" | "droite" {
  if (x < ZONE_L) return "gauche";
  if (x > ZONE_R) return "droite";
  return "centre";
}

function countByZone(players: TrackingPlayer[]) {
  return {
    gauche: players.filter(p => getZone(p.x) === "gauche").length,
    centre: players.filter(p => getZone(p.x) === "centre").length,
    droite: players.filter(p => getZone(p.x) === "droite").length,
  };
}

// Defensive line: avg Y of Metz outfield defenders (p2-p5, excluding GK p1)
function defLineY(homePlayers: TrackingPlayer[]) {
  const defenders = homePlayers.filter(p => [2, 3, 4, 5].includes(homePlayers.indexOf(p) + 1)
    || ["DCG", "DCD", "LG", "LD"].includes(p.position));
  const defs = homePlayers.filter(p => ["DCG", "DCD", "LG", "LD"].includes(p.position));
  if (!defs.length) return 0.82;
  return defs.reduce((s, p) => s + p.y, 0) / defs.length;
}

// Most advanced Metz attacker (smallest y = closest to away goal)
function mostAdvancedY(homePlayers: TrackingPlayer[]) {
  const outfield = homePlayers.filter(p => p.position !== "GB");
  return Math.min(...outfield.map(p => p.y));
}

// Compactness in meters (pitch length = 105m)
function compactnessMeters(defY: number, advY: number) {
  // The offensive line (midfield/forward zone, not GK)
  return Math.round((defY - advY) * 105);
}

// ─── Overlay type ─────────────────────────────────────────────────────────────

type Overlay = "zones" | "compacte" | "ligne";

// ─── Pitch with overlays ──────────────────────────────────────────────────────

function BlocPitch({ overlay }: { overlay: Overlay }) {
  const home  = TRACKING_FRAME.homePlayers;
  const away  = TRACKING_FRAME.awayPlayers;
  const defY  = defLineY(home);
  const advY  = mostAdvancedY(home);
  const compact = compactnessMeters(defY, advY);
  const compAlert = compact > 45;
  const stripeW = (PW - 2 * PAD) / 10;

  const homeZones = countByZone(home.filter(p => p.position !== "GB"));
  const awayZones = countByZone(away.filter(p => p.position !== "GB"));

  return (
    <svg width={PW} height={PH} style={{ display: "block", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>

      {/* Grass stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={PAD + i * stripeW} y={PAD}
          width={stripeW} height={PH - 2 * PAD}
          fill={i % 2 === 0 ? "#0f4d1f" : "#0d4520"} />
      ))}

      {/* ── OVERLAY: Zones ── */}
      {overlay === "zones" && (
        <>
          <rect x={px(0)} y={py(0)} width={px(ZONE_L) - px(0)} height={py(1) - py(0)}
            fill={awayZones.gauche > homeZones.gauche ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.04)"} />
          <rect x={px(ZONE_R)} y={py(0)} width={px(1) - px(ZONE_R)} height={py(1) - py(0)}
            fill={awayZones.droite > homeZones.droite ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.04)"} />
          <line x1={px(ZONE_L)} y1={py(0)} x2={px(ZONE_L)} y2={py(1)}
            stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={px(ZONE_R)} y1={py(0)} x2={px(ZONE_R)} y2={py(1)}
            stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 4" />
        </>
      )}

      {/* ── OVERLAY: Compacité ── */}
      {overlay === "compacte" && (
        <>
          {/* Arrow from deepest defender to most advanced attacker */}
          <line x1={PW / 2} y1={py(defY)} x2={PW / 2} y2={py(advY)}
            stroke={compAlert ? "#ef4444" : "#22c55e"}
            strokeWidth={2} strokeDasharray="6 3" strokeOpacity={0.8} />
          {/* Arrowhead up */}
          <polygon
            points={`${PW / 2 - 5},${py(advY) + 10} ${PW / 2 + 5},${py(advY) + 10} ${PW / 2},${py(advY)}`}
            fill={compAlert ? "#ef4444" : "#22c55e"} fillOpacity={0.8} />
          {/* Label */}
          <rect x={PW / 2 - 28} y={py((defY + advY) / 2) - 10} width={56} height={20} rx={4}
            fill={compAlert ? "rgba(239,68,68,0.85)" : "rgba(34,197,94,0.85)"} />
          <text x={PW / 2} y={py((defY + advY) / 2) + 4}
            textAnchor="middle" fontSize={11} fontWeight={800} fill="white"
            style={{ userSelect: "none" }}>
            {compact}m
          </text>
        </>
      )}

      {/* ── OVERLAY: Ligne défensive ── */}
      {overlay === "ligne" && (
        <>
          <line x1={px(0.05)} y1={py(defY)} x2={px(0.95)} y2={py(defY)}
            stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.85} />
          <rect x={px(0.05) - 4} y={py(defY) - 12} width={72} height={16} rx={3}
            fill="rgba(245,158,11,0.85)" />
          <text x={px(0.05)} y={py(defY) + 2}
            fontSize={9} fontWeight={700} fill="white"
            style={{ userSelect: "none" }}>
            Ligne déf. ↔
          </text>
          {/* Yard from own goal */}
          <text x={px(0.5)} y={py(defY) - 5}
            textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.55)"
            style={{ userSelect: "none" }}>
            {Math.round((1 - defY) * 105)}m du but adverse
          </text>
        </>
      )}

      {/* Pitch outline */}
      <rect x={PAD} y={PAD} width={PW - 2 * PAD} height={PH - 2 * PAD}
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      <line x1={PAD} y1={PH / 2} x2={PW - PAD} y2={PH / 2}
        stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <circle cx={PW / 2} cy={PH / 2} r={36}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PH - PAD - (PH - 2 * PAD) * 0.20}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PAD}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

      {/* Zone count labels */}
      {overlay === "zones" && (
        <>
          {(["gauche", "centre", "droite"] as const).map(z => {
            const x = z === "gauche" ? px(ZONE_L / 2) : z === "droite" ? px(ZONE_R + (1 - ZONE_R) / 2) : PW / 2;
            const hm = homeZones[z];
            const ha = awayZones[z];
            const alert = ha > hm;
            return (
              <g key={z}>
                {/* Home count */}
                <text x={x} y={py(0.88)} textAnchor="middle" fontSize={16} fontWeight={900}
                  fill="var(--color-primary-400)" style={{ userSelect: "none" }}>{hm}</text>
                {/* Separator */}
                <text x={x} y={py(0.82)} textAnchor="middle" fontSize={9}
                  fill="rgba(255,255,255,0.35)" style={{ userSelect: "none" }}>vs</text>
                {/* Away count */}
                <text x={x} y={py(0.77)} textAnchor="middle" fontSize={16} fontWeight={900}
                  fill={alert ? "#ef4444" : "var(--color-neutral-400)"} style={{ userSelect: "none" }}>{ha}</text>
                {alert && (
                  <text x={x} y={py(0.72)} textAnchor="middle" fontSize={8}
                    fill="#ef4444" style={{ userSelect: "none" }}>⚠ sous-nb</text>
                )}
              </g>
            );
          })}
        </>
      )}

      {/* Players */}
      {[...home.map(p => ({ p, isHome: true })), ...away.map(p => ({ p, isHome: false }))].map(({ p, isHome }) => {
        const cx = px(p.x);
        const cy = py(p.y);
        const R = 10;
        return (
          <g key={`${isHome}-${p.number}`}>
            <circle cx={cx + 1} cy={cy + 1} r={R} fill="rgba(0,0,0,0.3)" />
            <circle cx={cx} cy={cy} r={R}
              fill={isHome ? "var(--color-primary-400)" : "#1E2A3A"}
              stroke={isHome ? "rgba(255,255,255,0.45)" : "rgba(228,228,231,0.5)"}
              strokeWidth={1.5} />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize={8} fontWeight={700}
              fill="white" style={{ pointerEvents: "none", userSelect: "none" }}>
              {p.number}
            </text>
          </g>
        );
      })}

      {/* Ball */}
      <circle cx={px(TRACKING_FRAME.ball.x)} cy={py(TRACKING_FRAME.ball.y)} r={5}
        fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
    </svg>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, alert }: {
  label: string; value: string; sub?: string; alert?: boolean;
}) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 8,
      background: alert ? "rgba(239,68,68,0.08)" : "var(--color-neutral-900)",
      border: `1px solid ${alert ? "rgba(239,68,68,0.3)" : "var(--color-neutral-800)"}`,
    }}>
      <div style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: alert ? "#ef4444" : "var(--color-neutral-100)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: alert ? "rgba(239,68,68,0.7)" : "var(--color-neutral-500)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LiveTabBloc() {
  const [overlay, setOverlay] = useState<Overlay>("zones");

  const home = TRACKING_FRAME.homePlayers;
  const defY = defLineY(home);
  const advY = mostAdvancedY(home);
  const compact = compactnessMeters(defY, advY);
  const lineHeight = Math.round((1 - defY) * 105); // meters from own goal line

  const homeZones = countByZone(home.filter(p => p.position !== "GB"));
  const awayZones = countByZone(TRACKING_FRAME.awayPlayers.filter(p => p.position !== "GB"));

  const OVERLAYS: { id: Overlay; label: string }[] = [
    { id: "zones",    label: "Surnombres par zone" },
    { id: "compacte", label: "Compacité du bloc" },
    { id: "ligne",    label: "Ligne défensive" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* Pitch */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, gap: 12 }}>

        {/* Overlay switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          {OVERLAYS.map(o => (
            <button key={o.id} onClick={() => setOverlay(o.id)} style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600,
              cursor: "pointer", border: "1px solid",
              background: overlay === o.id ? "rgba(var(--primary-rgb),0.15)" : "transparent",
              borderColor: overlay === o.id ? "rgba(var(--primary-rgb),0.4)" : "var(--color-neutral-700)",
              color: overlay === o.id ? "var(--color-primary-400)" : "var(--color-neutral-500)",
            }}>
              {o.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: PW }}>
          <span style={{ fontSize: 9, color: "var(--color-neutral-500)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#1E2A3A", border: "1px solid #E4E4E7" }} />
            Paris FC ↑
          </span>
          <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>tracking-fast</span>
        </div>

        <BlocPitch overlay={overlay} />

        <div style={{ display: "flex", justifyContent: "flex-start", width: PW }}>
          <span style={{ fontSize: 9, color: "var(--color-primary-400)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary-400)" }} />
            FC Metz ↑
          </span>
        </div>
      </div>

      {/* Metrics panel */}
      <div style={{
        width: 230, flexShrink: 0, borderLeft: "1px solid var(--color-neutral-800)",
        overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10,
      }} className="custom-scrollbar">

        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          Métriques bloc
        </div>

        <MetricCard
          label="Compacité du bloc"
          value={`${compact}m`}
          sub={compact > 45 ? "⚠ Bloc étiré — seuil 45m dépassé" : "Bloc compact ✓"}
          alert={compact > 45}
        />
        <MetricCard
          label="Hauteur ligne défensive"
          value={`${lineHeight}m`}
          sub={`Depuis la ligne de but — bloc ${lineHeight < 20 ? "bas (défensif)" : lineHeight < 30 ? "moyen" : "haut (risqué)"}`}
          alert={false}
        />

        <div style={{ height: 1, background: "var(--color-neutral-800)", margin: "4px 0" }} />

        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Surnombres par zone
        </div>

        {(["gauche", "centre", "droite"] as const).map(z => {
          const hm = homeZones[z];
          const ha = awayZones[z];
          const alert = ha > hm;
          return (
            <div key={z} style={{
              padding: "8px 12px", borderRadius: 8,
              background: alert ? "rgba(239,68,68,0.08)" : "var(--color-neutral-900)",
              border: `1px solid ${alert ? "rgba(239,68,68,0.3)" : "var(--color-neutral-800)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "var(--color-neutral-300)", fontWeight: 600, textTransform: "capitalize" }}>{z}</span>
                {alert && <span style={{ fontSize: 8, color: "#ef4444", fontWeight: 700 }}>⚠ sous-nb</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "var(--color-primary-400)" }}>{hm}</span>
                <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>Metz vs Paris</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: alert ? "#ef4444" : "var(--color-neutral-400)" }}>{ha}</span>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 4, padding: "8px 10px", borderRadius: 6, background: "var(--color-neutral-900)", border: "1px solid var(--color-neutral-800)" }}>
          <div style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>Source · tracking-fast</div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginTop: 2 }}>xyz joueurs + ballon · {TRACKING_FRAME.gameClock}s de jeu</div>
        </div>
      </div>
    </div>
  );
}
