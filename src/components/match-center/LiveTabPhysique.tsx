"use client";

import { useState } from "react";
import { PHYSICAL_METZ, TEAM_PHYSICAL, PhysicalPlayer } from "./live-mock";

// ─── Speed zone config ────────────────────────────────────────────────────────

const ZONES = [
  { key: "percentDistanceWalking",          label: "Marche",       color: "#64748b" },
  { key: "percentDistanceJogging",           label: "Trot",         color: "#3b82f6" },
  { key: "percentDistanceLowSpeedRunning",   label: "Course lente", color: "#22c55e" },
  { key: "percentDistanceHighSpeedRunning",  label: "Course rapide",color: "#f59e0b" },
  { key: "percentDistanceSprinting",         label: "Sprint",       color: "#ef4444" },
] as const;

type Context = "full" | "inPlay" | "inPossession" | "outPossession";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtKm(m: number) { return (m / 1000).toFixed(2); }
function fmtDist(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
}

function getContextDist(p: PhysicalPlayer, ctx: Context): number {
  if (ctx === "inPlay")         return p.totalDistanceInPlay;
  if (ctx === "inPossession")   return p.totalDistanceInPossession;
  if (ctx === "outPossession")  return p.totalDistanceOutPossession;
  return p.totalDistance;
}

function topSpeedColor(s: number) {
  if (s >= 33) return "#ef4444";
  if (s >= 31) return "#f59e0b";
  if (s >= 29) return "#22c55e";
  return "var(--color-neutral-400)";
}

// ─── Speed Zone Bar ───────────────────────────────────────────────────────────

function ZoneBar({ player }: { player: PhysicalPlayer }) {
  return (
    <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", gap: 0.5 }}>
      {ZONES.map(z => (
        <div
          key={z.key}
          title={`${z.label}: ${player[z.key].toFixed(1)}%`}
          style={{
            width: `${player[z.key]}%`,
            background: z.color,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Player Row ───────────────────────────────────────────────────────────────

function PlayerRow({ player, maxDist, ctx }: {
  player: PhysicalPlayer;
  maxDist: number;
  ctx: Context;
}) {
  const dist = getContextDist(player, ctx);
  const distPct = (dist / maxDist) * 100;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "28px 130px 1fr 64px 56px 48px 48px",
      alignItems: "center",
      gap: 10,
      padding: "8px 16px",
      borderBottom: "1px solid var(--color-neutral-800)",
    }}>
      {/* Number */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-500)", textAlign: "center" }}>
        {player.number}
      </div>

      {/* Name + position */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-100)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {player.name}
        </div>
        <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginTop: 1 }}>
          {player.position} · {player.minutesPlayed}'
        </div>
      </div>

      {/* Distance bar */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-primary-400)" }}>
            {fmtKm(dist)} km
          </span>
        </div>
        <div style={{ height: 5, background: "var(--color-neutral-800)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${distPct}%`,
            background: "linear-gradient(90deg, var(--color-primary-600), var(--color-primary-400))",
            borderRadius: 3,
          }} />
        </div>
        <div style={{ marginTop: 3 }}>
          <ZoneBar player={player} />
        </div>
      </div>

      {/* Top speed */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: topSpeedColor(player.topSpeed) }}>
          {player.topSpeed.toFixed(1)}
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>km/h</div>
      </div>

      {/* Sprint distance */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-neutral-200)" }}>
          {fmtDist(player.distanceSprinting)}
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>sprint</div>
      </div>

      {/* Sprint count */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: player.countSprinting >= 20 ? "#ef4444" : "var(--color-neutral-200)" }}>
          {player.countSprinting}
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>nb spr.</div>
      </div>

      {/* HSR */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-300)" }}>
          {fmtDist(player.distanceHighSpeedRunning)}
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>HSR</div>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LiveTabPhysique() {
  const [ctx, setCtx] = useState<Context>("full");

  const maxDist = Math.max(...PHYSICAL_METZ.map(p => getContextDist(p, ctx)));
  const home = TEAM_PHYSICAL.home;
  const away = TEAM_PHYSICAL.away;

  const CTX_OPTIONS: { id: Context; label: string }[] = [
    { id: "full",           label: "Match complet" },
    { id: "inPlay",         label: "Ballon en jeu" },
    { id: "inPossession",   label: "Avec ballon" },
    { id: "outPossession",  label: "Sans ballon" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* Team comparison bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gap: 0, borderBottom: "1px solid var(--color-neutral-800)", flexShrink: 0,
        background: "var(--color-neutral-900)",
      }}>
        {[
          { label: "Distance totale", home: `${(home.totalDistance / 1000).toFixed(1)} km`, away: `${(away.totalDistance / 1000).toFixed(1)} km` },
          { label: "Top Speed",       home: `${home.topSpeed} km/h`, away: `${away.topSpeed} km/h` },
          { label: "Dist. Sprint",    home: fmtDist(home.distanceSprinting), away: fmtDist(away.distanceSprinting) },
          { label: "Nb Sprints",      home: `${home.countSprinting}`, away: `${away.countSprinting}` },
          { label: "Vitesse moy.",    home: `${home.avgSpeed} km/h`, away: `${away.avgSpeed} km/h` },
        ].map((s, i) => (
          <div key={i} style={{ padding: "10px 14px", borderRight: i < 4 ? "1px solid var(--color-neutral-800)" : "none" }}>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--color-primary-400)" }}>{s.home}</span>
              <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>vs</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--color-neutral-400)" }}>{s.away}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Context switcher + column headers */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px", borderBottom: "1px solid var(--color-neutral-800)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {CTX_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setCtx(opt.id)}
              style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: "pointer", border: "1px solid",
                background: ctx === opt.id ? "rgba(var(--primary-rgb),0.15)" : "transparent",
                borderColor: ctx === opt.id ? "rgba(var(--primary-rgb),0.4)" : "var(--color-neutral-700)",
                color: ctx === opt.id ? "var(--color-primary-400)" : "var(--color-neutral-500)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {ZONES.map(z => (
            <div key={z.key} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: z.color }} />
              <span style={{ fontSize: 8, color: "var(--color-neutral-500)" }}>{z.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "28px 130px 1fr 64px 56px 48px 48px",
        gap: 10, padding: "6px 16px",
        borderBottom: "1px solid var(--color-neutral-800)",
        background: "var(--color-neutral-900)", flexShrink: 0,
      }}>
        <div />
        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Joueur</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Distance + zones</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>Top Spd</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>Sprint</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>Nb</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>HSR</div>
      </div>

      {/* Player rows */}
      <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
        {PHYSICAL_METZ.map(p => (
          <PlayerRow key={p.playerId} player={p} maxDist={maxDist} ctx={ctx} />
        ))}
      </div>
    </div>
  );
}
