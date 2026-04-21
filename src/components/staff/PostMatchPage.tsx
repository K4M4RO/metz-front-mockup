"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface PostPlayer {
  num: number; name: string; pos: string; x: number; y: number;
  mins: number; goals: number; assists: number;
  xG: number; xA: number; touches: number; passes: number;
  passPct: number; duelPct: number; distance: number; rating: number;
}

const PAST_MATCHES = [
  { id: 1, date: "12 Avr", opponent: "Troyes AC", score: "2 – 1", result: "W" },
  { id: 2, date: "06 Avr", opponent: "Caen",      score: "0 – 0", result: "D" },
  { id: 3, date: "30 Mar", opponent: "Grenoble",  score: "1 – 3", result: "L" },
];

const MATCH_LINEUP: PostPlayer[] = [
  { num: 1,  name: "Caillard",  pos: "GK", x: 0.50, y: 0.91, mins: 90, goals: 0, assists: 0, xG: 0.00, xA: 0.00, touches: 38, passes: 26, passPct: 81, duelPct: 100, distance: 5.2, rating: 6.8 },
  { num: 3,  name: "Nzinga",   pos: "LB", x: 0.13, y: 0.73, mins: 90, goals: 0, assists: 1, xG: 0.05, xA: 0.18, touches: 62, passes: 48, passPct: 88, duelPct: 55,  distance: 9.4, rating: 7.1 },
  { num: 5,  name: "Kouyaté",  pos: "CB", x: 0.37, y: 0.73, mins: 90, goals: 1, assists: 0, xG: 0.42, xA: 0.00, touches: 72, passes: 58, passPct: 91, duelPct: 72,  distance: 8.8, rating: 7.6 },
  { num: 4,  name: "Traoré",   pos: "CB", x: 0.63, y: 0.73, mins: 90, goals: 0, assists: 0, xG: 0.04, xA: 0.00, touches: 68, passes: 55, passPct: 89, duelPct: 78,  distance: 8.6, rating: 7.0 },
  { num: 2,  name: "Celestine",pos: "RB", x: 0.87, y: 0.73, mins: 90, goals: 0, assists: 0, xG: 0.02, xA: 0.08, touches: 58, passes: 44, passPct: 86, duelPct: 60,  distance: 9.1, rating: 6.9 },
  { num: 6,  name: "Angban",   pos: "DM", x: 0.36, y: 0.55, mins: 90, goals: 0, assists: 0, xG: 0.12, xA: 0.10, touches: 84, passes: 70, passPct: 93, duelPct: 64,  distance: 10.8, rating: 7.3 },
  { num: 8,  name: "Kouassi",  pos: "DM", x: 0.64, y: 0.55, mins: 76, goals: 0, assists: 1, xG: 0.08, xA: 0.22, touches: 66, passes: 54, passPct: 87, duelPct: 58,  distance: 9.2, rating: 7.0 },
  { num: 7,  name: "Lopy",     pos: "LW", x: 0.16, y: 0.36, mins: 68, goals: 0, assists: 0, xG: 0.28, xA: 0.06, touches: 44, passes: 32, passPct: 78, duelPct: 47,  distance: 8.4, rating: 6.5 },
  { num: 10, name: "Mendes",   pos: "AM", x: 0.50, y: 0.36, mins: 90, goals: 1, assists: 1, xG: 0.68, xA: 0.40, touches: 76, passes: 54, passPct: 85, duelPct: 54,  distance: 10.2, rating: 8.1 },
  { num: 11, name: "Camara",   pos: "RW", x: 0.84, y: 0.36, mins: 90, goals: 0, assists: 0, xG: 0.35, xA: 0.14, touches: 50, passes: 34, passPct: 76, duelPct: 44,  distance: 9.6, rating: 7.2 },
  { num: 9,  name: "Jallow",   pos: "ST", x: 0.50, y: 0.17, mins: 90, goals: 1, assists: 0, xG: 1.14, xA: 0.04, touches: 46, passes: 28, passPct: 68, duelPct: 52,  distance: 8.9, rating: 7.8 },
];

const SUBS = [
  { num: 14, name: "Boulaya",    pos: "MF", min: 68 },
  { num: 17, name: "Mikautadze", pos: "FW", min: 76 },
  { num: 20, name: "Gakpa",      pos: "FW", min: 83 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const R_COLOR: Record<string, string> = { W: "#22C55E", D: "#F59E0B", L: "#EF4444" };
const R_LABEL: Record<string, string> = { W: "V", D: "N", L: "D" };

function ratingColor(r: number) {
  if (r >= 8) return "#22C55E";
  if (r >= 7) return "#86EFAC";
  if (r >= 6) return "#F59E0B";
  return "#EF4444";
}

// ─── Pitch Shell ──────────────────────────────────────────────────────────────

function PitchShell({ w, h, children }: { w: number; h: number; children?: React.ReactNode }) {
  return (
    <svg width={w} height={h} style={{ display: "block", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
      <rect x={0} y={0} width={w} height={h} fill="#1a2e1a" />
      <rect x={10} y={10} width={w - 20} height={h - 20} fill="none" stroke="#2d4a2d" strokeWidth={1.5} />
      <line x1={10} y1={h / 2} x2={w - 10} y2={h / 2} stroke="#2d4a2d" strokeWidth={1} />
      <circle cx={w / 2} cy={h / 2} r={28} fill="none" stroke="#2d4a2d" strokeWidth={1} />
      <rect x={w * 0.22} y={10} width={w * 0.56} height={h * 0.18} fill="none" stroke="#2d4a2d" strokeWidth={1} />
      <rect x={w * 0.22} y={h - 10 - h * 0.18} width={w * 0.56} height={h * 0.18} fill="none" stroke="#2d4a2d" strokeWidth={1} />
      <rect x={w * 0.36} y={10} width={w * 0.28} height={h * 0.08} fill="none" stroke="#2d4a2d" strokeWidth={1} />
      <rect x={w * 0.36} y={h - 10 - h * 0.08} width={w * 0.28} height={h * 0.08} fill="none" stroke="#2d4a2d" strokeWidth={1} />
      {children}
    </svg>
  );
}

// ─── Player Stats Panel ───────────────────────────────────────────────────────

function PlayerStatsPanel({ player, onClose }: { player: PostPlayer; onClose: () => void }) {
  const statRows = [
    { label: "Minutes jouées",  value: `${player.mins}'` },
    { label: "Buts",            value: player.goals },
    { label: "Passes décisives", value: player.assists },
    { label: "xG",              value: player.xG.toFixed(2) },
    { label: "xA",              value: player.xA.toFixed(2) },
    { label: "Touches",         value: player.touches },
    { label: "Passes",          value: `${player.passes} (${player.passPct}%)` },
    { label: "Duels gagnés",    value: `${player.duelPct}%` },
    { label: "Distance (km)",   value: player.distance.toFixed(1) },
  ];

  return (
    <div style={{
      position: "absolute", top: 0, right: -260, width: 248, zIndex: 50,
      background: "var(--color-neutral-900)", border: "1px solid rgba(196,43,71,0.4)",
      borderRadius: 10, boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
        borderBottom: "1px solid var(--color-neutral-800)",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: "#C42B47",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
        }}>{player.num}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--color-neutral-100)" }}>{player.name}</div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>{player.pos}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: ratingColor(player.rating) }}>{player.rating.toFixed(1)}</div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>Note</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-neutral-500)", padding: 2 }}>
          <X size={14} />
        </button>
      </div>

      {/* Stats */}
      <div style={{ padding: "10px 14px" }}>
        {statRows.map((s, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 0", borderBottom: i < statRows.length - 1 ? "1px solid var(--color-neutral-800)" : "none",
          }}>
            <span style={{ fontSize: 11, color: "var(--color-neutral-500)" }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-200)" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Match View ───────────────────────────────────────────────────────────────

function MatchView({ match }: { match: typeof PAST_MATCHES[0] }) {
  const [selected, setSelected] = useState<PostPlayer | null>(null);

  const PW = 340, PH = 480;

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", height: "100%" }}>

      {/* Left: Titulaires */}
      <div style={{
        width: 138, flexShrink: 0, background: "var(--color-neutral-800)", borderRadius: 10,
        border: "1px solid var(--color-neutral-700)", overflow: "hidden",
      }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-neutral-700)" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-500)" }}>Titulaires</div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-400)", marginTop: 2 }}>4-2-3-1</div>
        </div>
        {MATCH_LINEUP.map(p => (
          <button
            key={p.num}
            onClick={() => setSelected(selected?.num === p.num ? null : p)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "6px 10px",
              background: selected?.num === p.num ? "rgba(196,43,71,0.1)" : "transparent",
              border: "none", cursor: "pointer", textAlign: "left",
              borderLeft: selected?.num === p.num ? "2px solid #C42B47" : "2px solid transparent",
            }}
          >
            <span style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              background: selected?.num === p.num ? "#C42B47" : "var(--color-neutral-700)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 800,
              color: selected?.num === p.num ? "#fff" : "var(--color-neutral-400)",
              border: `1px solid ${selected?.num === p.num ? "#C42B47" : "var(--color-neutral-600)"}`,
            }}>{p.num}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: selected?.num === p.num ? "#C42B47" : "var(--color-neutral-200)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>{p.pos} · {p.mins}'</div>
            </div>
            {(p.goals > 0 || p.assists > 0) && (
              <Star size={9} style={{ color: "#F59E0B", flexShrink: 0 }} fill="#F59E0B" />
            )}
          </button>
        ))}
      </div>

      {/* Center: Pitch */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        {/* Match header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 16px",
          background: "var(--color-neutral-800)", borderRadius: 8, border: "1px solid var(--color-neutral-700)", width: "100%",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 5,
            background: `${R_COLOR[match.result]}22`, color: R_COLOR[match.result],
            border: `1px solid ${R_COLOR[match.result]}44`,
          }}>{R_LABEL[match.result]}</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-neutral-100)" }}>
            FC Metz {match.score} {match.opponent}
          </span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--color-neutral-500)" }}>{match.date}</span>
        </div>

        {/* Hint */}
        <p style={{ fontSize: 10, color: "var(--color-neutral-600)", margin: "0 0 8px", alignSelf: "flex-start" }}>
          Cliquer sur un joueur pour voir ses statistiques
        </p>

        {/* Pitch */}
        <div style={{ position: "relative" }}>
          <PitchShell w={PW} h={PH} />
          <svg
            width={PW} height={PH}
            style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
          >
            {MATCH_LINEUP.map(p => {
              const cx = p.x * PW, cy = p.y * PH;
              const isSelected = selected?.num === p.num;
              const hasEvent = p.goals > 0 || p.assists > 0;
              return (
                <g key={p.num} transform={`translate(${cx},${cy})`} style={{ cursor: "pointer" }}
                  onClick={() => setSelected(selected?.num === p.num ? null : p)}>
                  {isSelected && <circle r={20} fill="rgba(196,43,71,0.2)" />}
                  <circle r={15} fill={isSelected ? "#C42B47" : "#2a4a2a"} stroke={isSelected ? "#fff" : "#4a7a4a"} strokeWidth={isSelected ? 2 : 1.5} />
                  <text textAnchor="middle" dy={4} fontSize={9} fontWeight={800} fill={isSelected ? "#fff" : "#a0d4a0"}>{p.num}</text>
                  <text textAnchor="middle" dy={28} fontSize={8} fontWeight={600} fill="rgba(255,255,255,0.75)">{p.name.split(" ")[0]}</text>
                  {hasEvent && (
                    <circle cx={11} cy={-11} r={5} fill="#F59E0B" stroke="#1a2e1a" strokeWidth={1} />
                  )}
                  {p.goals > 0 && (
                    <text x={11} y={-7} textAnchor="middle" fontSize={7} fill="#fff" fontWeight={800}>{p.goals}</text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Stats Panel */}
          {selected && (
            <PlayerStatsPanel player={selected} onClose={() => setSelected(null)} />
          )}
        </div>
      </div>

      {/* Right: Remplaçants + Coach */}
      <div style={{
        width: 130, flexShrink: 0, background: "var(--color-neutral-800)", borderRadius: 10,
        border: "1px solid var(--color-neutral-700)", overflow: "hidden",
      }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-neutral-700)" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-500)" }}>Remplaçants</div>
        </div>
        {SUBS.map(s => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderBottom: "1px solid var(--color-neutral-800)" }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              background: "var(--color-neutral-700)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 800, color: "var(--color-neutral-400)",
              border: "1px solid var(--color-neutral-600)",
            }}>{s.num}</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-neutral-300)" }}>{s.name}</div>
              <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>{s.pos} · {s.min}'</div>
            </div>
          </div>
        ))}

        <div style={{ padding: "10px 12px", marginTop: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 6 }}>
            Coach
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-neutral-300)" }}>L. Bölöni</div>
        </div>

        {/* Team ratings */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid var(--color-neutral-700)", marginTop: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 6 }}>
            Notes du match
          </div>
          {[...MATCH_LINEUP].sort((a, b) => b.rating - a.rating).slice(0, 5).map(p => (
            <div key={p.num} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
              <span style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>{p.name.split(" ")[0]}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: ratingColor(p.rating) }}>{p.rating.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PostMatchPage() {
  const [selectedMatch, setSelectedMatch] = useState(PAST_MATCHES[0].id);
  const match = PAST_MATCHES.find(m => m.id === selectedMatch)!;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Match list */}
      <div style={{
        width: 200, flexShrink: 0, borderRight: "1px solid var(--color-neutral-700)",
        display: "flex", flexDirection: "column", background: "var(--color-neutral-900)",
      }}>
        <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid var(--color-neutral-800)" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Derniers matchs
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
          {PAST_MATCHES.map(m => {
            const isActive = m.id === selectedMatch;
            return (
              <button key={m.id} onClick={() => setSelectedMatch(m.id)} style={{
                width: "100%", textAlign: "left", padding: "10px 10px", borderRadius: 8,
                marginBottom: 4, cursor: "pointer",
                background: isActive ? "rgba(196,43,71,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(196,43,71,0.3)" : "1px solid transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 4, fontSize: 8, fontWeight: 800, flexShrink: 0,
                    background: `${R_COLOR[m.result]}22`, color: R_COLOR[m.result],
                    border: `1px solid ${R_COLOR[m.result]}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{R_LABEL[m.result]}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#C42B47" : "var(--color-neutral-200)" }}>
                    vs {m.opponent}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "var(--color-neutral-500)", paddingLeft: 25 }}>{m.score} · {m.date}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Match view */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <MatchView key={match.id} match={match} />
      </div>
    </div>
  );
}
