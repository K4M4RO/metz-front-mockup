"use client";

import { useState } from "react";
import { ChevronRight, Users, Activity, Download, Plus, ExternalLink } from "lucide-react";
import { PitchSVG, relToAbs, PITCH_PAD } from "./PitchSVG";
import { DonutChart } from "./DonutChart";
import {
  HOME_TEAM, AWAY_TEAM, GOALS, MATCH_INFO,
  PHASE_BREAKDOWN, TACTICAL_SHAPES, POSSESSION_EFFICIENCY,
  TeamData, PMPlayer, TacticalPhase, BallZone
} from "./data";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PW = 300;
const PH = 440;

// ─── Formation Interactive Block ──────────────────────────────────────────────

function PlayerRow({
  player,
  isHome,
  isHighlighted,
  onEnter,
  onLeave,
}: {
  player: PMPlayer;
  isHome: boolean;
  isHighlighted: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "2px 4px",
        borderRadius: 4,
        marginBottom: 4,
        cursor: "default",
        background: isHighlighted ? "rgba(255,255,255,0.05)" : "transparent",
        transition: "background 0.1s",
      }}
    >
      {/* Number */}
      <div style={{
        fontSize: 16,
        fontWeight: 900,
        color: isHome ? "#C42B47" : "#3B5CB8",
        width: 22,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
      }}>
        {player.number}
      </div>

      {/* Name and Position */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-neutral-300)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {player.name}
        </div>
        <div style={{
          fontSize: 9,
          color: "var(--color-neutral-500)",
          fontStyle: "italic",
        }}>
          {player.position}
        </div>
      </div>

      {/* Timeline Icons */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {player.yellowCard && (
          <div style={{
            width: 8, height: 11, background: "#FACC15", borderRadius: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 6, fontWeight: 800, color: "black",
          }}>
            {player.yellowCardMin}&apos;
          </div>
        )}
        {player.subOff && (
          <div style={{ display: "flex", alignItems: "center", color: "#C42B47" }}>
            <span style={{ fontSize: 10 }}>▶</span>
            <span style={{ fontSize: 8, fontWeight: 700, marginLeft: 1 }}>{player.subOff}&apos;</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamColumn({
  team,
  isHome,
  highlightedId,
  setHighlightedId,
}: {
  team: TeamData;
  isHome: boolean;
  highlightedId: number | null;
  setHighlightedId: (id: number | null) => void;
}) {
  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Manager */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: isHome ? "#C42B47" : "#3B5CB8" }}>{isHome ? "Home Team" : "Away Team"}</div>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--color-neutral-200)" }}>Manager</div>
        <div style={{ fontSize: 11, color: "var(--color-neutral-400)" }}>{team.manager}</div>
      </div>

      {/* Starting Eleven */}
      <div style={{
        fontSize: 12, fontWeight: 900, color: isHome ? "#C42B47" : "#3B5CB8",
        textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8,
      }}>
        Starting Eleven
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {team.starters.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            isHome={isHome}
            isHighlighted={highlightedId === p.id}
            onEnter={() => setHighlightedId(p.id)}
            onLeave={() => setHighlightedId(null)}
          />
        ))}
      </div>

      {/* Substitutes */}
      <div style={{
        fontSize: 12, fontWeight: 900, color: isHome ? "#C42B47" : "#3B5CB8",
        textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 8,
      }}>
        Substitutes
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {team.substitutes.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 4px", marginBottom: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: isHome ? "#C42B47" : "#3B5CB8", width: 22, textAlign: "center" }}>
              {p.number}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-neutral-400)" }}>{p.name}</div>
            </div>
            {p.subOn && (
              <div style={{ display: "flex", alignItems: "center", color: "#16A34A" }}>
                <span style={{ fontSize: 10 }}>▶</span>
                <span style={{ fontSize: 8, fontWeight: 700, marginLeft: 1 }}>{p.subOn}&apos;</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormationPitch({ highlightedId, setHighlightedId }: {
  highlightedId: number | null;
  setHighlightedId: (id: number | null) => void;
}) {
  const PW_PITCH = 440;
  const PH_PITCH = 500;
  const R = 15;
  const allPlayers = [...HOME_TEAM.starters, ...AWAY_TEAM.starters];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      {/* Pitch Header: Kickoff / Venue */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 20, marginBottom: 8,
        fontSize: 11, color: "var(--color-neutral-400)", fontWeight: 700,
      }}>
        <div>Kickoff: <span style={{ color: "var(--color-neutral-200)" }}>{MATCH_INFO.kickoff}, {MATCH_INFO.date}</span></div>
        <div>Venue: <span style={{ color: "var(--color-neutral-200)" }}>{MATCH_INFO.venue}</span></div>
      </div>

      <div style={{ position: "relative", width: PW_PITCH, height: PH_PITCH }}>
        <PitchSVG width={PW_PITCH} height={PH_PITCH}>
          {allPlayers.map((p) => {
            const isHome = HOME_TEAM.starters.some((h) => h.id === p.id);
            const { x, y } = relToAbs(p.x, p.y, PW_PITCH, PH_PITCH);
            const isHov = highlightedId === p.id;
            const teamColor = isHome ? "#C42B47" : "#3B5CB8";

            return (
              <g key={p.id}
                onMouseEnter={() => setHighlightedId(p.id)}
                onMouseLeave={() => setHighlightedId(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow */}
                {isHov && (
                  <circle cx={x} cy={y} r={R + 8} fill={`${teamColor}44`} />
                )}
                {/* Shadow */}
                <circle cx={x + 2} cy={y + 2} r={R} fill="rgba(0,0,0,0.4)" />
                {/* Outer Ring */}
                <circle cx={x} cy={y} r={R} fill={teamColor} stroke="white" strokeWidth={1} />
                {/* Number */}
                <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fontWeight={900} fill="white" style={{ pointerEvents: "none" }}>
                  {p.number}
                </text>
                {/* Label Box */}
                <rect x={x - 22} y={y + R + 3} width={44} height={12} fill="rgba(0,0,0,0.6)" rx={2} />
                <text x={x} y={y + R + 11} textAnchor="middle" fontSize={7.5} fontWeight={800} fill="white" style={{ pointerEvents: "none" }}>
                  {p.position.split(" ").map(w => w[0]).join("")}
                </text>

                {/* Card/Sub indicators on pitch */}
                {p.yellowCard && (
                  <rect x={x + R - 6} y={y - R - 2} width={7} height={10} fill="#FACC15" rx={1} />
                )}
                {p.subOff && (
                  <path d={`M ${x-R-4} ${y-R} L ${x-R+2} ${y-R-4} L ${x-R-4} ${y-R-8} Z`} fill="#C42B47" />
                )}
              </g>
            );
          })}
        </PitchSVG>

        {/* Formations and Goals Footer */}
        <div style={{
          position: "absolute", bottom: -20, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          padding: "0 10px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "var(--color-neutral-400)" }}>Formation: {HOME_TEAM.formation}</div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Goals:</div>
            <div style={{ display: "flex", gap: 10 }}>
              {GOALS.map((g, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: g.team === "home" ? "#C42B47" : "#3B5CB8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 900, color: "white", border: "2px solid rgba(255,255,255,0.2)",
                  }}>
                    {g.team === "home" ? HOME_TEAM.starters.find(s=>s.name.includes(g.playerName))?.number || "?" : AWAY_TEAM.starters.find(s=>s.name.includes(g.playerName))?.number || "?"}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "var(--color-neutral-200)", marginTop: 2 }}>{g.minute}&apos;</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 900, color: "var(--color-neutral-400)" }}>Formation: {AWAY_TEAM.formation}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase Breakdown Block ─────────────────────────────────────────────────────

function PhaseBreakdown() {
  const maxVal = Math.max(...PHASE_BREAKDOWN.map((p) => Math.max(p.home, p.away)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#C42B47" }} />
          <span style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>FC Metz</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#3B5CB8" }} />
          <span style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>Paris FC</span>
        </div>
      </div>

      {PHASE_BREAKDOWN.map((phase) => {
        const homePct = (phase.home / maxVal) * 100;
        const awayPct = (phase.away / maxVal) * 100;
        return (
          <div key={phase.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#C42B47", minWidth: 28 }}>{phase.home}</span>
              <span style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {phase.label}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#3B5CB8", minWidth: 28, textAlign: "right" }}>{phase.away}</span>
            </div>
            <div style={{ display: "flex", gap: 3, height: 8, alignItems: "center" }}>
              {/* Home bar (right-aligned) */}
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  height: 8, width: `${homePct}%`,
                  background: "linear-gradient(270deg, #C42B47, #6D071A)",
                  borderRadius: "4px 0 0 4px",
                  transition: "width 0.6s ease",
                }} />
              </div>
              {/* Divider */}
              <div style={{ width: 1, height: 14, background: "var(--color-neutral-600)", flexShrink: 0 }} />
              {/* Away bar */}
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 8, width: `${awayPct}%`,
                  background: "linear-gradient(90deg, #3B5CB8, #1E3A7A)",
                  borderRadius: "0 4px 4px 0",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Team Shape Block ──────────────────────────────────────────────────────────

function TeamShape() {
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
  const [selectedPhase, setSelectedPhase] = useState<TacticalPhase>("all");
  const [ballZone, setBallZone] = useState<BallZone>("center");

  const SW = 260;
  const SH = 340;
  const R = 9;

  // Get base positions
  const baseShape = TACTICAL_SHAPES[selectedTeam][selectedPhase];

  // Apply Ball Zone Offset (Simulated coulissement)
  const getOffset = (zone: BallZone) => {
    if (zone === "left") return -0.05;
    if (zone === "right") return 0.05;
    return 0;
  };

  const offset = getOffset(ballZone);
  const players = baseShape.map(p => ({
    ...p,
    // GB doesn't move as much as field players
    x: p.pos === "GB" ? p.x : Math.max(0.1, Math.min(0.9, p.x + offset))
  }));

  // Bounding box computation for length/width badges
  const xs = players.map((p) => PITCH_PAD + p.x * (SW - 2 * PITCH_PAD));
  const ys = players.map((p) => PITCH_PAD + p.y * (SH - 2 * PITCH_PAD));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Simulated metrics based on dispersion
  const lengthM = ((maxY - minY) / (SH - 2 * PITCH_PAD) * 105).toFixed(1);
  const widthM  = ((maxX - minX) / (SW - 2 * PITCH_PAD) * 68).toFixed(1);

  const PHASES: { id: TacticalPhase; label: string }[] = [
    { id: "all",       label: "Toutes" },
    { id: "build-up",  label: "Relance" },
    { id: "creation",  label: "Attaque" },
    { id: "recovery",  label: "Transition" },
    { id: "low-block", label: "Bloc Bas" },
  ];

  const teamColor = selectedTeam === "home" ? "#C42B47" : "#3B5CB8";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      {/* Tactical Filter Bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8, padding: 8,
        background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-neutral-800)",
        borderRadius: 12,
      }}>
        {/* Team Selector */}
        <div className="flex gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          {(["home", "away"] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedTeam(t)}
              style={{
                padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6,
                background: selectedTeam === t ? (t === "home" ? "#C42B47" : "#3B5CB8") : "transparent",
                color: selectedTeam === t ? "white" : "var(--color-neutral-500)",
                transition: "all 0.2s",
              }}
            >
              {t === "home" ? "METZ" : "PARIS FC"}
            </button>
          ))}
        </div>

        {/* Phase Selector */}
        <div className="flex gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 flex-1 min-w-[200px]">
          {PHASES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPhase(p.id)}
              style={{
                flex: 1, padding: "4px 6px", fontSize: 9, fontWeight: 700, borderRadius: 6,
                background: selectedPhase === p.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: selectedPhase === p.id ? "white" : "var(--color-neutral-500)",
                transition: "all 0.2s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Ball Zone */}
        <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
           <span className="text-[9px] font-bold text-neutral-600 px-1 uppercase tracking-wider">Ballon :</span>
           <div className="flex gap-1">
             {(["left", "center", "right"] as BallZone[]).map(z => (
               <button
                 key={z}
                 onClick={() => setBallZone(z)}
                 style={{
                   width: 24, height: 20, fontSize: 9, fontWeight: 800, borderRadius: 4,
                   background: ballZone === z ? teamColor : "rgba(255,255,255,0.05)",
                   color: ballZone === z ? "white" : "var(--color-neutral-600)",
                   border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                 }}
               >
                 {z === "left" ? "G" : z === "center" ? "C" : "D"}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {/* Metrics */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{
            padding: "4px 10px",
            background: `${teamColor}15`,
            border: `1px solid ${teamColor}33`,
            borderRadius: 6, fontSize: 10, fontWeight: 700,
            color: "var(--color-neutral-300)",
          }}>
            Longueur : <span style={{ color: teamColor }}>{lengthM}m</span>
          </div>
          <div style={{
            padding: "4px 10px",
            background: `${teamColor}15`,
            border: `1px solid ${teamColor}33`,
            borderRadius: 6, fontSize: 10, fontWeight: 700,
            color: "var(--color-neutral-300)",
          }}>
            Largeur : <span style={{ color: teamColor }}>{widthM}m</span>
          </div>
        </div>

        {/* Pitch */}
        <div style={{ position: "relative", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
          <PitchSVG width={SW} height={SH}>
            {/* Bounding box */}
            <rect
              x={minX} y={minY}
              width={maxX - minX} height={maxY - minY}
              fill={`${teamColor}08`}
              stroke={`${teamColor}35`}
              strokeWidth={1}
              strokeDasharray="4 3"
              style={{ transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />

            {players.map((p, i) => {
              const cx = PITCH_PAD + p.x * (SW - 2 * PITCH_PAD);
              const cy = PITCH_PAD + p.y * (SH - 2 * PITCH_PAD);
              return (
                <g key={`${selectedTeam}-${p.pos}-${i}`} style={{ transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <circle cx={cx} cy={cy} r={R}
                    fill={teamColor} stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
                  <text x={cx} y={cy + 3.5} textAnchor="middle"
                    fontSize={6} fontWeight={800} fill="white"
                    style={{ userSelect: "none", pointerEvents: "none" }}>
                    {p.pos}
                  </text>
                </g>
              );
            })}
          </PitchSVG>

          {/* Phase indicator overlay */}
          <div style={{
            position: "absolute", top: 10, right: 10,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(4px)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: teamColor, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: "white", textTransform: "uppercase" }}>{selectedPhase}</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Possession Efficiency Block ───────────────────────────────────────────────

function PossessionEfficiency() {
  const colors = {
    progression: "#C42B47",
    recycling:   "#3B82F6",
    losses:      "#EF4444",
  };

  return (
    <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
      <DonutChart
        value={POSSESSION_EFFICIENCY.progression.value}
        label={POSSESSION_EFFICIENCY.progression.label}
        sublabel={POSSESSION_EFFICIENCY.progression.sublabel}
        color={colors.progression}
        size={100}
      />
      <DonutChart
        value={POSSESSION_EFFICIENCY.recycling.value}
        label={POSSESSION_EFFICIENCY.recycling.label}
        sublabel={POSSESSION_EFFICIENCY.recycling.sublabel}
        color={colors.recycling}
        size={100}
      />
      <DonutChart
        value={POSSESSION_EFFICIENCY.losses.value}
        label={POSSESSION_EFFICIENCY.losses.label}
        sublabel={POSSESSION_EFFICIENCY.losses.sublabel}
        color={colors.losses}
        size={100}
      />
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, children }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--color-neutral-900)",
      border: "1px solid var(--color-neutral-800)",
      borderRadius: 10,
      padding: "16px 20px",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 16,
        paddingBottom: 10,
        borderBottom: "1px solid var(--color-neutral-800)",
      }}>
        {icon}
        <span style={{
          fontSize: 11, fontWeight: 800,
          color: "var(--color-neutral-200)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {title}
        </span>
        <ChevronRight size={12} style={{ color: "var(--color-neutral-600)", marginLeft: 2 }} />
      </div>
      {children}
    </div>
  );
}

export function TabMatchSummary() {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const PW_PITCH = 340;
  const PH_PITCH = 480;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      padding: "24px 32px",
      overflowY: "auto",
      height: "100%",
      background: "var(--color-neutral-950)",
    }}>
      {/* ── SCORECARD HEADER ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <div style={{ fontSize: 32, fontWeight: 950, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#C42B47" }}>{HOME_TEAM.name} {MATCH_INFO.homeScore}</span>
          <span style={{ color: "var(--color-neutral-700)" }}>—</span>
          <span style={{ color: "#3B5CB8" }}>{MATCH_INFO.awayScore} {AWAY_TEAM.name}</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--color-neutral-400)", fontWeight: 700 }}>
          <div>Kickoff: <span style={{ color: "var(--color-neutral-200)" }}>{MATCH_INFO.kickoff}, {MATCH_INFO.date}</span></div>
          <div>Venue: <span style={{ color: "var(--color-neutral-200)" }}>{MATCH_INFO.venue}</span></div>
        </div>
      </div>

      {/* ── 3-COLUMN STARTING FORMATIONS area ─────────────────────────────── */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--color-neutral-800)",
        borderRadius: 16,
        padding: "28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 24,
      }}>
        {/* Left Column: Home */}
        <TeamColumn
          team={HOME_TEAM}
          isHome={true}
          highlightedId={highlightedId}
          setHighlightedId={setHighlightedId}
        />

        {/* Center content: Pitch + Goals */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <PitchSVG width={PW_PITCH} height={PH_PITCH} horizontal={false}>
              {[...HOME_TEAM.starters, ...AWAY_TEAM.starters].map((p) => {
                const isHome = HOME_TEAM.starters.some((h) => h.id === p.id);
                const { x, y } = relToAbs(p.x, p.y, PW_PITCH, PH_PITCH);
                const isHov = highlightedId === p.id;
                const teamColor = isHome ? "#C42B47" : "#3B5CB8";
                const R = 15;

                return (
                  <g key={p.id}
                    onMouseEnter={() => setHighlightedId(p.id)}
                    onMouseLeave={() => setHighlightedId(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {isHov && <circle cx={x} cy={y} r={R + 8} fill={`${teamColor}33`} />}
                    <circle cx={x + 2} cy={y + 2} r={R} fill="rgba(0,0,0,0.4)" />
                    <circle cx={x} cy={y} r={R} fill={teamColor} stroke="white" strokeWidth={1} />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize={11} fontWeight={900} fill="white" style={{ pointerEvents: "none" }}>
                      {p.number}
                    </text>
                    {/* Position initials label */}
                    <rect x={x - 18} y={y + R + 2} width={36} height={10} fill="rgba(0,0,0,0.6)" rx={2} />
                    <text x={x} y={y + R + 10} textAnchor="middle" fontSize={7} fontWeight={950} fill="white" style={{ pointerEvents: "none" }}>
                      {p.position.split(" ").map(w => w[0]).join("")}
                    </text>
                  </g>
                );
              })}
            </PitchSVG>

            {/* Formation Labels on pitch */}
            <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 10, fontWeight: 900, color: "var(--color-neutral-400)" }}>
              {HOME_TEAM.formation}
            </div>
            <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 900, color: "var(--color-neutral-400)" }}>
              {AWAY_TEAM.formation}
            </div>
          </div>

          {/* Goals section below pitch */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 950, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Goals</div>
            <div style={{ display: "flex", gap: 12 }}>
              {GOALS.map((g, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: g.team === "home" ? "#C42B47" : "#3B5CB8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 950, color: "white", border: "1.5px solid rgba(255,255,255,0.2)",
                  }}>
                    {g.team === "home" ? HOME_TEAM.starters.find(s=>s.name.includes(g.playerName))?.number || "?" : AWAY_TEAM.starters.find(s=>s.name.includes(g.playerName))?.number || "?"}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "var(--color-neutral-300)" }}>{g.minute}&apos;</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Away */}
        <TeamColumn
          team={AWAY_TEAM}
          isHome={false}
          highlightedId={highlightedId}
          setHighlightedId={setHighlightedId}
        />
      </div>

      {/* ── ADDITIONAL STATS ─────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Section title="Phase Breakdown" icon={<Activity size={14} style={{ color: "#C42B47" }} />}>
          <PhaseBreakdown />
        </Section>
        <Section title="Team Shape — FC Metz" icon={<Users size={14} style={{ color: "#C42B47" }} />}>
          <TeamShape />
        </Section>
      </div>

      <Section title="Efficacité des Possessions">
        <PossessionEfficiency />
      </Section>
    </div>
  );
}
