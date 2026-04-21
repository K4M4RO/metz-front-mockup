"use client";

import { useState, useRef, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const COMP_PLAYERS = [
  { id: "em", name: "Enzo Millot",    pos: "MC",  age: 23, club: "FC Metz",     nat: "🇫🇷", color: "#C42B47", initials: "EM" },
  { id: "ln", name: "Lucas Netz",     pos: "MC",  age: 21, club: "FC Augsburg", nat: "🇩🇪", color: "#D4A017", initials: "LN" },
  { id: "ts", name: "T. Samassékou", pos: "MDF", age: 28, club: "Reims",        nat: "🇬🇳", color: "#3B82F6", initials: "TS" },
  { id: "mv", name: "M. Veretout",   pos: "MC",  age: 31, club: "OL Lyon",      nat: "🇫🇷", color: "#22C55E", initials: "MV" },
  { id: "kc", name: "K. Camara",     pos: "MC",  age: 24, club: "OGC Nice",     nat: "🇬🇳", color: "#7C3AED", initials: "KC" },
];

const COMP_STATS: Record<string, Record<string, number>> = {
  em: { passes:72,pass_pct:83,press_passes:67,one_touch:71, lb_att:65,lb_mid:78,xThreat:83,prog_carries:79, pressures:71,def_duel_pct:74,counter_press:68,second_balls:65, sprint:78,hi_runs:80,distance:76,accel:70, stamina_h1:82,stamina_h2:76,intensity_drop:68,full_game:87,recovery:74, ww_creation:85,ww_pressing:78,ww_possession:80,ww_runs:72,ww_recovery:77 },
  ln: { passes:68,pass_pct:79,press_passes:72,one_touch:65, lb_att:75,lb_mid:81,xThreat:77,prog_carries:83, pressures:65,def_duel_pct:68,counter_press:74,second_balls:70, sprint:85,hi_runs:88,distance:82,accel:79, stamina_h1:79,stamina_h2:81,intensity_drop:75,full_game:83,recovery:79, ww_creation:72,ww_pressing:68,ww_possession:76,ww_runs:84,ww_recovery:71 },
  ts: { passes:65,pass_pct:76,press_passes:80,one_touch:58, lb_att:55,lb_mid:62,xThreat:58,prog_carries:61, pressures:86,def_duel_pct:88,counter_press:82,second_balls:79, sprint:71,hi_runs:74,distance:78,accel:65, stamina_h1:76,stamina_h2:78,intensity_drop:82,full_game:80,recovery:85, ww_creation:60,ww_pressing:89,ww_possession:72,ww_runs:65,ww_recovery:86 },
  mv: { passes:80,pass_pct:88,press_passes:62,one_touch:78, lb_att:70,lb_mid:74,xThreat:72,prog_carries:68, pressures:62,def_duel_pct:70,counter_press:60,second_balls:68, sprint:68,hi_runs:65,distance:70,accel:60, stamina_h1:72,stamina_h2:65,intensity_drop:60,full_game:75,recovery:65, ww_creation:78,ww_pressing:65,ww_possession:85,ww_runs:68,ww_recovery:70 },
  kc: { passes:70,pass_pct:81,press_passes:75,one_touch:68, lb_att:68,lb_mid:72,xThreat:70,prog_carries:74, pressures:78,def_duel_pct:80,counter_press:76,second_balls:72, sprint:82,hi_runs:79,distance:80,accel:75, stamina_h1:80,stamina_h2:77,intensity_drop:72,full_game:82,recovery:78, ww_creation:68,ww_pressing:82,ww_possession:74,ww_runs:76,ww_recovery:80 },
};

const TAB_METRICS: Record<string, { label: string; key: string }[]> = {
  overview: [],
  couverture: [
    { label: "Zone centrale",      key: "passes"       },
    { label: "Zone att. %",        key: "lb_att"       },
    { label: "Appels profondeur",  key: "prog_carries" },
    { label: "Largeur de jeu",     key: "one_touch"    },
    { label: "Vitesse déplacement",key: "sprint"       },
    { label: "Intensité press.",   key: "pressures"    },
  ],
  style: [
    { label: "Build-up %",         key: "pass_pct"      },
    { label: "Pressing",           key: "pressures"     },
    { label: "Récup. haute",       key: "counter_press" },
    { label: "Transitions",        key: "lb_mid"        },
    { label: "Organisation",       key: "def_duel_pct"  },
    { label: "Blocage ligne",      key: "second_balls"  },
  ],
  perf: [
    { label: "Passes/90",          key: "passes"        },
    { label: "% Passes",           key: "pass_pct"      },
    { label: "Pressions/90",       key: "pressures"     },
    { label: "Duels déf. %",       key: "def_duel_pct"  },
    { label: "Carries prog.",      key: "prog_carries"  },
    { label: "xThreat/90",         key: "xThreat"       },
  ],
  physique: [
    { label: "Distance km",        key: "distance"      },
    { label: "HI Dist km",         key: "hi_runs"       },
    { label: "Sprint max",         key: "sprint"        },
    { label: "Accélérations",      key: "accel"         },
    { label: "Dist/min",           key: "distance"      },
    { label: "HI runs/90",         key: "hi_runs"       },
  ],
  endurance: [
    { label: "Stamina 1ère MT",    key: "stamina_h1"    },
    { label: "Stamina 2ème MT",    key: "stamina_h2"    },
    { label: "Chute intensité",    key: "intensity_drop"},
    { label: "% Jeu complet",      key: "full_game"     },
    { label: "Récupération",       key: "recovery"      },
  ],
  ww: [
    { label: "Création",           key: "ww_creation"   },
    { label: "Pressing collectif", key: "ww_pressing"   },
    { label: "Possession",         key: "ww_possession" },
    { label: "Montées",            key: "ww_runs"       },
    { label: "Récupération",       key: "ww_recovery"   },
  ],
};

const TABS = [
  { id: "overview",   label: "Attributs"      },
  { id: "couverture", label: "Couverture"      },
  { id: "style",      label: "Style Équipe"    },
  { id: "perf",       label: "Performances"    },
  { id: "physique",   label: "Physique"        },
  { id: "endurance",  label: "Endurance"       },
  { id: "ww",         label: "With / Without"  },
];

// Radar axes for overview (same 8 as player profile)
const RADAR_AXES = [
  { label: "Finition",        key: "xThreat"       },
  { label: "Création",        key: "ww_creation"   },
  { label: "Sortie de balle", key: "pass_pct"      },
  { label: "Pressing",        key: "pressures"     },
  { label: "Duel Aérien",     key: "second_balls"  },
  { label: "Duel Sol",        key: "def_duel_pct"  },
  { label: "Vol. Physique",   key: "distance"      },
  { label: "Placement",       key: "lb_mid"        },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlayer(id: string) {
  return COMP_PLAYERS.find((p) => p.id === id)!;
}

function getStat(id: string, key: string): number {
  return COMP_STATS[id]?.[key] ?? 0;
}

// polygon points for radar
function radarPoints(playerId: string, cx: number, cy: number, r: number): string {
  return RADAR_AXES.map((axis, i) => {
    const angle = (Math.PI * 2 * i) / RADAR_AXES.length - Math.PI / 2;
    const val = getStat(playerId, axis.key) / 100;
    const x = cx + Math.cos(angle) * r * val;
    const y = cy + Math.sin(angle) * r * val;
    return `${x},${y}`;
  }).join(" ");
}

function heatColor(val: number, min: number, max: number): string {
  if (max === min) return "rgba(34,197,94,0.35)";
  const norm = (val - min) / (max - min); // 0 = worst, 1 = best
  if (norm >= 0.75) return `rgba(34,197,94,${0.25 + norm * 0.5})`;
  if (norm >= 0.5)  return `rgba(234,179,8,${0.3 + norm * 0.4})`;
  return `rgba(239,68,68,${0.25 + (1 - norm) * 0.45})`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Avatar circle
function Avatar({ player, size = 40 }: { player: typeof COMP_PLAYERS[0]; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: player.color + "30",
        border: `2px solid ${player.color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.32,
        fontWeight: 700,
        color: player.color,
        flexShrink: 0,
      }}
    >
      {player.initials}
    </div>
  );
}

// Identity card (duel mode header)
function IdentityCard({ player }: { player: typeof COMP_PLAYERS[0] }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "var(--color-neutral-800)",
        border: `1px solid ${player.color}40`,
        borderRadius: 10,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
      }}
    >
      <Avatar player={player} size={56} />
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "var(--color-neutral-100)", fontWeight: 700, fontSize: 15 }}>{player.name}</div>
        <div style={{ color: "var(--color-neutral-400)", fontSize: 12, marginTop: 2 }}>
          {player.nat} {player.pos} · {player.age} ans · {player.club}
        </div>
      </div>
    </div>
  );
}

// Radar SVG (superposed polygons for duel overview)
function DuelRadar({ playerA, playerB }: { playerA: typeof COMP_PLAYERS[0]; playerB: typeof COMP_PLAYERS[0] }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;
  const n = RADAR_AXES.length;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid */}
      {gridLevels.map((lvl) => (
        <polygon
          key={lvl}
          points={RADAR_AXES.map((_, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            return `${cx + Math.cos(angle) * r * lvl},${cy + Math.sin(angle) * r * lvl}`;
          }).join(" ")}
          fill="none"
          stroke="var(--color-neutral-700)"
          strokeWidth={0.8}
        />
      ))}
      {/* Spokes */}
      {RADAR_AXES.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(angle) * r}
            y2={cy + Math.sin(angle) * r}
            stroke="var(--color-neutral-700)"
            strokeWidth={0.8}
          />
        );
      })}
      {/* Player B (dashed, behind) */}
      <polygon
        points={radarPoints(playerB.id, cx, cy, r)}
        fill={playerB.color + "20"}
        stroke={playerB.color}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      {/* Player A (solid, front) */}
      <polygon
        points={radarPoints(playerA.id, cx, cy, r)}
        fill={playerA.color + "28"}
        stroke={playerA.color}
        strokeWidth={2}
      />
      {/* Axis labels */}
      {RADAR_AXES.map((axis, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const labelR = r + 18;
        const x = cx + Math.cos(angle) * labelR;
        const y = cy + Math.sin(angle) * labelR;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="var(--color-neutral-400)"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

// Multi-player radar (one polygon per player)
function MultiRadar({ players }: { players: typeof COMP_PLAYERS }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;
  const n = RADAR_AXES.length;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((lvl) => (
        <polygon
          key={lvl}
          points={RADAR_AXES.map((_, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            return `${cx + Math.cos(angle) * r * lvl},${cy + Math.sin(angle) * r * lvl}`;
          }).join(" ")}
          fill="none"
          stroke="var(--color-neutral-700)"
          strokeWidth={0.8}
        />
      ))}
      {RADAR_AXES.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + Math.cos(angle) * r}
            y2={cy + Math.sin(angle) * r}
            stroke="var(--color-neutral-700)" strokeWidth={0.8}
          />
        );
      })}
      {players.map((p, pi) => (
        <polygon
          key={p.id}
          points={radarPoints(p.id, cx, cy, r)}
          fill={p.color + "18"}
          stroke={p.color}
          strokeWidth={pi === 0 ? 2 : 1.5}
          strokeDasharray={pi === 0 ? undefined : pi === 1 ? "4 3" : pi === 2 ? "2 2" : "6 2"}
        />
      ))}
      {RADAR_AXES.map((axis, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const labelR = r + 18;
        const x = cx + Math.cos(angle) * labelR;
        const y = cy + Math.sin(angle) * labelR;
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="var(--color-neutral-400)">
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

// Top-5 écarts table
function EcartsTable({ playerA, playerB }: { playerA: typeof COMP_PLAYERS[0]; playerB: typeof COMP_PLAYERS[0] }) {
  const allKeys = Object.keys(COMP_STATS[playerA.id]);
  const gaps = allKeys.map((key) => {
    const aVal = getStat(playerA.id, key);
    const bVal = getStat(playerB.id, key);
    return { key, aVal, bVal, gap: Math.abs(aVal - bVal) };
  }).sort((a, b) => b.gap - a.gap).slice(0, 5);

  const maxGap = gaps[0]?.gap ?? 0;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ color: "var(--color-neutral-400)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Top 5 Écarts
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ color: "var(--color-neutral-500)", fontSize: 10, fontWeight: 500, textAlign: "left", paddingBottom: 6, paddingRight: 8 }}>Métrique</th>
            <th style={{ color: playerA.color, fontSize: 10, fontWeight: 600, textAlign: "right", paddingBottom: 6, paddingRight: 12 }}>{playerA.initials}</th>
            <th style={{ color: "var(--color-neutral-500)", fontSize: 10, fontWeight: 500, textAlign: "center", paddingBottom: 6, width: 48 }}>Δ</th>
            <th style={{ color: playerB.color, fontSize: 10, fontWeight: 600, textAlign: "left", paddingBottom: 6, paddingLeft: 12 }}>{playerB.initials}</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map(({ key, aVal, bVal, gap }) => {
            const isBold = gap === maxGap;
            const aWins = aVal > bVal;
            const delta = aWins ? `+${gap}` : `-${gap}`;
            return (
              <tr key={key} style={{ borderTop: "1px solid var(--color-neutral-800)" }}>
                <td style={{ padding: "6px 8px 6px 0", color: "var(--color-neutral-300)", fontSize: 12, fontWeight: isBold ? 700 : 400 }}>{key}</td>
                <td style={{ padding: "6px 12px 6px 0", textAlign: "right", color: "var(--color-neutral-100)", fontSize: 12, fontWeight: isBold ? 700 : 400 }}>{aVal}</td>
                <td style={{ padding: "6px 0", textAlign: "center" }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: aWins ? "#22C55E" : "#EF4444",
                    backgroundColor: (aWins ? "#22C55E" : "#EF4444") + "18",
                    borderRadius: 4,
                    padding: "1px 5px",
                  }}>{delta}</span>
                </td>
                <td style={{ padding: "6px 0 6px 12px", color: "var(--color-neutral-100)", fontSize: 12, fontWeight: isBold ? 700 : 400 }}>{bVal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Tornado chart row
function TornadoRow({ label, valA, valB, colorA, colorB, isBold }: {
  label: string; valA: number; valB: number; colorA: string; colorB: string; isBold: boolean;
}) {
  const gap = Math.abs(valA - valB);
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      {/* Left bar — Player A, right-aligned */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
        <span style={{ color: "var(--color-neutral-400)", fontSize: 11, minWidth: 22, textAlign: "right" }}>{valA}</span>
        <div style={{
          width: `${valA}%`,
          maxWidth: "100%",
          height: 20,
          backgroundColor: colorA,
          borderRadius: "4px 0 0 4px",
          opacity: 0.85,
        }} />
      </div>

      {/* Center label */}
      <div style={{ width: 128, textAlign: "center", flexShrink: 0, padding: "0 4px" }}>
        <div style={{ color: isBold ? "var(--color-neutral-100)" : "var(--color-neutral-300)", fontSize: 11, fontWeight: isBold ? 700 : 400, lineHeight: 1.3 }}>
          {label}
        </div>
        {gap > 20 && (
          <div style={{ color: "var(--color-neutral-500)", fontSize: 10, marginTop: 1 }}>
            +{gap}
          </div>
        )}
      </div>

      {/* Right bar — Player B, left-aligned */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: `${valB}%`,
          maxWidth: "100%",
          height: 20,
          backgroundColor: colorB,
          borderRadius: "0 4px 4px 0",
          opacity: 0.85,
        }} />
        <span style={{ color: "var(--color-neutral-400)", fontSize: 11, minWidth: 22 }}>{valB}</span>
      </div>
    </div>
  );
}

// Tornado chart panel (duel, non-overview tabs)
function TornadoPanel({ metrics, playerA, playerB }: {
  metrics: { label: string; key: string }[];
  playerA: typeof COMP_PLAYERS[0];
  playerB: typeof COMP_PLAYERS[0];
}) {
  if (metrics.length === 0) return null;
  const maxGap = Math.max(...metrics.map(m => Math.abs(getStat(playerA.id, m.key) - getStat(playerB.id, m.key))));
  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16 }}>
        {[playerA, playerB].map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: p.color }} />
            <span style={{ color: "var(--color-neutral-300)", fontSize: 12 }}>{p.name}</span>
          </div>
        ))}
      </div>
      {metrics.map((m) => {
        const valA = getStat(playerA.id, m.key);
        const valB = getStat(playerB.id, m.key);
        const gap = Math.abs(valA - valB);
        return (
          <TornadoRow
            key={m.key + m.label}
            label={m.label}
            valA={valA}
            valB={valB}
            colorA={playerA.color}
            colorB={playerB.color}
            isBold={gap === maxGap}
          />
        );
      })}
    </div>
  );
}

// Heatmap table (multi mode)
function HeatmapTable({ metrics, players }: {
  metrics: { label: string; key: string }[];
  players: typeof COMP_PLAYERS;
}) {
  if (metrics.length === 0) return null;

  // Compute per-column min/max
  const colStats = metrics.map((m) => {
    const vals = players.map((p) => getStat(p.id, m.key));
    return { min: Math.min(...vals), max: Math.max(...vals) };
  });

  return (
    <div style={{ padding: "16px 24px", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr>
            <th style={{
              position: "sticky", left: 0, zIndex: 2,
              backgroundColor: "var(--color-neutral-900)",
              color: "var(--color-neutral-400)", fontSize: 10, fontWeight: 500,
              textAlign: "left", padding: "8px 12px",
              borderBottom: "1px solid var(--color-neutral-700)",
            }}>
              Joueur
            </th>
            {metrics.map((m) => (
              <th key={m.key + m.label} style={{
                color: "var(--color-neutral-400)", fontSize: 10, fontWeight: 500,
                textAlign: "center", padding: "8px 8px",
                borderBottom: "1px solid var(--color-neutral-700)",
                whiteSpace: "nowrap", minWidth: 72,
              }}>
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id}>
              <td style={{
                position: "sticky", left: 0, zIndex: 1,
                backgroundColor: "var(--color-neutral-900)",
                padding: "8px 12px",
                borderBottom: "1px solid var(--color-neutral-800)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                  <Avatar player={p} size={28} />
                  <span style={{ color: "var(--color-neutral-200)", fontSize: 12, fontWeight: 600 }}>{p.name}</span>
                </div>
              </td>
              {metrics.map((m, mi) => {
                const val = getStat(p.id, m.key);
                const { min, max } = colStats[mi];
                return (
                  <td key={m.key + m.label} style={{
                    textAlign: "center",
                    padding: "8px",
                    borderBottom: "1px solid var(--color-neutral-800)",
                    backgroundColor: heatColor(val, min, max),
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}>
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Delta chips (quick comparison, top of panel, duel mode)
function DeltaChips({ playerA, playerB }: { playerA: typeof COMP_PLAYERS[0]; playerB: typeof COMP_PLAYERS[0] }) {
  const allKeys = Object.keys(COMP_STATS[playerA.id]);
  const top3 = allKeys.map((key) => {
    const aVal = getStat(playerA.id, key);
    const bVal = getStat(playerB.id, key);
    return { key, aVal, bVal, gap: Math.abs(aVal - bVal) };
  }).sort((a, b) => b.gap - a.gap).slice(0, 3);

  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: "10px 24px",
      backgroundColor: "var(--color-neutral-900)",
      borderBottom: "1px solid var(--color-neutral-800)",
      flexWrap: "wrap",
    }}>
      <span style={{ color: "var(--color-neutral-500)", fontSize: 11, alignSelf: "center", marginRight: 4 }}>
        Comparaison rapide:
      </span>
      {top3.map(({ key, aVal, bVal }) => {
        const aWins = aVal > bVal;
        const delta = Math.abs(aVal - bVal);
        return (
          <div key={key} style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            backgroundColor: "var(--color-neutral-800)",
            border: "1px solid var(--color-neutral-700)",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 11,
          }}>
            <span style={{ color: "var(--color-neutral-400)" }}>{key}</span>
            <span style={{ color: playerA.color, fontWeight: 600 }}>{aVal}</span>
            <span style={{ color: "var(--color-neutral-600)" }}>→</span>
            <span style={{ color: playerB.color, fontWeight: 600 }}>{bVal}</span>
            <span style={{
              fontWeight: 700,
              color: aWins ? "#22C55E" : "#EF4444",
              marginLeft: 2,
            }}>
              Δ{delta}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ComparateurPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["em", "ln"]);
  const [activeTab, setActiveTab] = useState("overview");
  const [mode, setMode] = useState<"duel" | "multi">("duel");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const selectedPlayers = selectedIds.map(getPlayer).filter(Boolean);
  const isDuel = selectedIds.length === 2;
  const isMulti = selectedIds.length >= 3;
  const effectiveMode = isDuel ? "duel" : "multi";

  const filteredPlayers = COMP_PLAYERS.filter((p) => {
    if (selectedIds.includes(p.id)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.initials.toLowerCase().includes(q);
  });

  function addPlayer(id: string) {
    if (selectedIds.length >= 5) return;
    setSelectedIds((prev) => [...prev, id]);
    setSearchQuery("");
    setShowDropdown(false);
  }

  function removePlayer(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  const playerA = selectedPlayers[0];
  const playerB = selectedPlayers[1];
  const metrics = TAB_METRICS[activeTab] ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--color-neutral-950)" }}>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: "var(--color-neutral-900)",
        borderBottom: "1px solid var(--color-neutral-700)",
        padding: "12px 24px 0",
        flexShrink: 0,
      }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h1 style={{ color: "var(--color-neutral-100)", fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
              Comparateur
            </h1>
            <p style={{ color: "var(--color-neutral-500)", fontSize: 13, marginTop: 2 }}>
              Analyse comparative multi-joueurs
            </p>
          </div>

          {/* Duel / Multi toggle (only when 3+ players selected) */}
          {isMulti && (
            <div style={{
              display: "flex",
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-700)",
              borderRadius: 8,
              padding: 3,
              gap: 2,
            }}>
              {(["duel", "multi"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: "4px 14px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: mode === m ? "#C42B47" : "transparent",
                    color: mode === m ? "#fff" : "var(--color-neutral-400)",
                    transition: "all 0.15s",
                  }}
                >
                  {m === "duel" ? "Duel" : "Multi"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Player tags + search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {selectedPlayers.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: p.color + "20",
                border: `1px solid ${p.color}60`,
                borderRadius: 20,
                padding: "4px 10px 4px 6px",
                fontSize: 12,
                color: p.color,
                fontWeight: 600,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                backgroundColor: p.color + "30",
                border: `1.5px solid ${p.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: 700, color: p.color,
              }}>
                {p.initials}
              </div>
              {p.name}
              <button
                onClick={() => removePlayer(p.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: p.color + "99", fontSize: 14, lineHeight: 1,
                  padding: 0, marginLeft: 2, display: "flex", alignItems: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add player */}
          {selectedIds.length < 5 && (
            <div ref={searchRef} style={{ position: "relative" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "var(--color-neutral-800)",
                border: "1px solid var(--color-neutral-700)",
                borderRadius: 20,
                padding: "4px 12px",
              }}>
                <span style={{ color: "var(--color-neutral-500)", fontSize: 16, lineHeight: 1 }}>+</span>
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Ajouter un joueur…"
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--color-neutral-200)",
                    fontSize: 12,
                    width: 150,
                  }}
                />
              </div>

              {showDropdown && filteredPlayers.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 50,
                  backgroundColor: "var(--color-neutral-800)",
                  border: "1px solid var(--color-neutral-700)",
                  borderRadius: 8,
                  overflow: "hidden",
                  minWidth: 200,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}>
                  {filteredPlayers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addPlayer(p.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        borderBottom: "1px solid var(--color-neutral-700)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-neutral-700)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        backgroundColor: p.color + "30",
                        border: `1.5px solid ${p.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, color: p.color, flexShrink: 0,
                      }}>
                        {p.initials}
                      </div>
                      <div>
                        <div style={{ color: "var(--color-neutral-100)", fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ color: "var(--color-neutral-500)", fontSize: 10 }}>{p.nat} {p.pos} · {p.club}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex",
          gap: 0,
          overflowX: "auto",
          marginBottom: -1,
        }}>
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: "relative",
                  height: 40,
                  padding: "0 16px",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--color-neutral-100)" : "var(--color-neutral-400)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-200)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)"; }}
              >
                {tab.label}
                {isActive && (
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: "#C42B47",
                    borderRadius: "2px 2px 0 0",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", backgroundColor: "var(--color-neutral-900)" }}>

        {/* Quick comparison chips (duel mode only, non-overview) */}
        {isDuel && activeTab !== "overview" && playerA && playerB && (
          <DeltaChips playerA={playerA} playerB={playerB} />
        )}

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div style={{ padding: "20px 24px" }}>
            {selectedPlayers.length < 2 ? (
              <div style={{ color: "var(--color-neutral-500)", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
                Sélectionnez au moins 2 joueurs pour comparer.
              </div>
            ) : isDuel && playerA && playerB ? (
              /* DUEL OVERVIEW */
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Identity cards */}
                <div style={{ display: "flex", gap: 12 }}>
                  <IdentityCard player={playerA} />
                  <IdentityCard player={playerB} />
                </div>

                {/* Radar */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "var(--color-neutral-800)",
                  borderRadius: 10,
                  padding: 20,
                  gap: 12,
                }}>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 24, height: 2, backgroundColor: playerA.color }} />
                      <span style={{ color: "var(--color-neutral-300)", fontSize: 12 }}>{playerA.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 24, height: 0, borderTop: `2px dashed ${playerB.color}` }} />
                      <span style={{ color: "var(--color-neutral-300)", fontSize: 12 }}>{playerB.name}</span>
                    </div>
                  </div>
                  <DuelRadar playerA={playerA} playerB={playerB} />
                </div>

                {/* Écarts table */}
                <div style={{
                  backgroundColor: "var(--color-neutral-800)",
                  borderRadius: 10,
                  padding: 16,
                }}>
                  <EcartsTable playerA={playerA} playerB={playerB} />
                </div>
              </div>
            ) : (
              /* MULTI OVERVIEW */
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Player cards row */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {selectedPlayers.map((p) => (
                    <div key={p.id} style={{
                      flex: "1 1 140px",
                      backgroundColor: "var(--color-neutral-800)",
                      border: `1px solid ${p.color}40`,
                      borderRadius: 10,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}>
                      <Avatar player={p} size={36} />
                      <div>
                        <div style={{ color: "var(--color-neutral-100)", fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                        <div style={{ color: "var(--color-neutral-500)", fontSize: 11 }}>{p.nat} {p.pos} · {p.age} ans</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Multi radar */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "var(--color-neutral-800)",
                  borderRadius: 10,
                  padding: 20,
                  gap: 12,
                }}>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                    {selectedPlayers.map((p, i) => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 20, height: 0,
                          borderTop: `2px ${i === 0 ? "solid" : i === 1 ? "dashed" : i === 2 ? "dotted" : "dashed"} ${p.color}`,
                        }} />
                        <span style={{ color: "var(--color-neutral-300)", fontSize: 11 }}>{p.name}</span>
                      </div>
                    ))}
                  </div>
                  <MultiRadar players={selectedPlayers} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NON-OVERVIEW TABS ─────────────────────────────────────────────── */}
        {activeTab !== "overview" && metrics.length > 0 && (
          <>
            {selectedPlayers.length < 2 ? (
              <div style={{ color: "var(--color-neutral-500)", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
                Sélectionnez au moins 2 joueurs pour comparer.
              </div>
            ) : (isDuel || (isMulti && mode === "duel")) && playerA && playerB ? (
              <TornadoPanel metrics={metrics} playerA={playerA} playerB={playerB} />
            ) : (
              <HeatmapTable metrics={metrics} players={selectedPlayers} />
            )}
          </>
        )}

        {/* Fallback empty */}
        {activeTab !== "overview" && metrics.length === 0 && (
          <div style={{ color: "var(--color-neutral-600)", fontSize: 12, textAlign: "center", paddingTop: 40 }}>
            Aucune métrique définie pour cet onglet.
          </div>
        )}

      </div>
    </div>
  );
}
