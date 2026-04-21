"use client";

import { useState, useMemo } from "react";
import { Filter, ChevronRight } from "lucide-react";
import { PitchSVG, relToAbs, PITCH_PAD } from "./PitchSVG";
import { ExportXMLButton } from "./ExportXMLButton";
import {
  HOME_TEAM, PASSES, LINE_BREAKS, DESEQUILIBRE_TIMELINE, PassLine,
} from "./data";

const PW = 380;
const PH = 460;

// ─── Pass Lab ─────────────────────────────────────────────────────────────────

const PHASES = ["Tous", "Build Up", "Create", "Finish", "Transition", "Direct"];
const LINE_COLORS: Record<PassLine["lineBreaking"], string> = {
  none:  "rgba(164,164,180,0.45)",
  first: "rgba(59,130,246,0.8)",
  mid:   "rgba(245,158,11,0.85)",
  last:  "rgba(196,43,71,0.95)",
};

function PassLab() {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [selectedPhase,  setSelectedPhase]  = useState("Tous");

  const filtered = useMemo(() => {
    return PASSES.filter((p) => {
      const playerOk = selectedPlayer === null || p.playerId === selectedPlayer;
      const phaseOk  = selectedPhase === "Tous" || p.phase === selectedPhase;
      return playerOk && phaseOk;
    });
  }, [selectedPlayer, selectedPhase]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Filters row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Filter size={12} style={{ color: "var(--color-neutral-500)" }} />

        {/* Player pills */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedPlayer(null)}
            style={pillStyle(selectedPlayer === null)}
          >
            Tous joueurs
          </button>
          {HOME_TEAM.starters.slice(0, 6).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlayer(selectedPlayer === p.id ? null : p.id)}
              style={pillStyle(selectedPlayer === p.id)}
            >
              {p.number} {p.name.split(" ").pop()}
            </button>
          ))}
        </div>
      </div>

      {/* Phase pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {PHASES.map((ph) => (
          <button
            key={ph}
            onClick={() => setSelectedPhase(ph)}
            style={pillStyle(selectedPhase === ph, "phase")}
          >
            {ph}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["none", "first", "mid", "last"] as const).map((key) => {
          const labels: Record<string, string> = {
            none: "Passes simples",
            first: "Ligne 1 brisée",
            mid: "Milieu brisé",
            last: "Dernière ligne",
          };
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 16, height: 2, borderRadius: 1,
                background: LINE_COLORS[key],
              }} />
              <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>{labels[key]}</span>
            </div>
          );
        })}
      </div>

      {/* Pitch */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PitchSVG width={PW} height={PH}>
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6"
              refX="5" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(255,255,255,0.7)" />
            </marker>
          </defs>
          {filtered.map((pass, i) => {
            const s = relToAbs(pass.x1, pass.y1, PW, PH);
            const e = relToAbs(pass.x2, pass.y2, PW, PH);
            const color = LINE_COLORS[pass.lineBreaking];
            const thick = pass.lineBreaking === "last" ? 2.2 : pass.lineBreaking === "none" ? 1 : 1.6;
            return (
              <g key={i}>
                <line
                  x1={s.x} y1={s.y} x2={e.x} y2={e.y}
                  stroke={color} strokeWidth={thick}
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
                {/* xPV label */}
                {pass.xpv > 0.10 && (
                  <text
                    x={(s.x + e.x) / 2} y={(s.y + e.y) / 2 - 4}
                    textAnchor="middle"
                    fontSize={7} fontWeight={700}
                    fill="rgba(255,255,255,0.8)"
                    style={{ userSelect: "none" }}
                  >
                    +{pass.xpv.toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
        </PitchSVG>
      </div>
    </div>
  );
}

// ─── Line Break Table ──────────────────────────────────────────────────────────

function LineBreakTable() {
  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              {["Joueur", "1ère Ligne", "Milieu", "Dernière Ligne"].map((h) => (
                <th key={h} style={{
                  padding: "6px 10px", textAlign: h === "Joueur" ? "left" : "center",
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", color: "var(--color-neutral-500)",
                  borderBottom: "1px solid var(--color-neutral-800)",
                }}>
                  {h}
                </th>
              ))}
              <th style={{
                padding: "6px 10px", fontSize: 9, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: "var(--color-neutral-500)",
                borderBottom: "1px solid var(--color-neutral-800)",
                textAlign: "right",
              }}>
                Export
              </th>
            </tr>
          </thead>
          <tbody>
            {LINE_BREAKS.map((row, i) => (
              <tr key={i} style={{
                borderBottom: "1px solid var(--color-neutral-800)",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
              }}>
                <td style={{ padding: "7px 10px", color: "var(--color-neutral-200)", fontWeight: 600 }}>
                  <span style={{
                    display: "inline-block",
                    width: 20, height: 20, lineHeight: "20px",
                    textAlign: "center",
                    background: "var(--color-neutral-800)",
                    borderRadius: 4, fontSize: 9, fontWeight: 800,
                    color: "#C42B47", marginRight: 6,
                  }}>
                    {row.number}
                  </span>
                  {row.playerName}
                </td>
                {/* First line */}
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, color: "#3B82F6" }}>{row.firstLine}</span>
                    <ExportXMLButton filename={`${row.playerName}_ligne1.xml`} />
                  </div>
                </td>
                {/* Mid line */}
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, color: "#F59E0B" }}>{row.midLine}</span>
                    <ExportXMLButton filename={`${row.playerName}_milieu.xml`} />
                  </div>
                </td>
                {/* Last line */}
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, color: "#C42B47" }}>{row.lastLine}</span>
                    <ExportXMLButton filename={`${row.playerName}_derniere.xml`} />
                  </div>
                </td>
                {/* Global export */}
                <td style={{ padding: "7px 10px", textAlign: "right" }}>
                  <ExportXMLButton filename={`${row.playerName}_all.xml`} label="ALL" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Déséquilibre Timeline ─────────────────────────────────────────────────────

function DesequilibreTimeline() {
  const maxScore = Math.max(...DESEQUILIBRE_TIMELINE.map((d) => d.score));
  const BAR_HEIGHT = 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, lineHeight: 1.5 }}>
        Score agrégé du déséquilibre infligé à l&apos;adversaire lors des phases de possession.{" "}
        <span style={{ color: "#C42B47", fontWeight: 700 }}>Rouge = phase de domination.</span>
      </div>

      {/* Chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: BAR_HEIGHT + 24 }}>
        {DESEQUILIBRE_TIMELINE.map((seg, i) => {
          const barH = (seg.score / maxScore) * BAR_HEIGHT;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1 }}>
              {/* Score label */}
              <span style={{
                fontSize: 8, fontWeight: 700,
                color: seg.isHigh ? "#C42B47" : "var(--color-neutral-400)",
                marginBottom: 2,
              }}>
                {seg.score.toFixed(1)}
              </span>
              {/* Bar */}
              <div style={{
                width: "100%",
                height: barH,
                borderRadius: "3px 3px 0 0",
                background: seg.isHigh
                  ? "linear-gradient(180deg, #D43A55, #6D071A)"
                  : "var(--color-neutral-700)",
                transition: "height 0.5s ease",
                position: "relative",
              }}>
                {seg.isHigh && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "3px 3px 0 0",
                    boxShadow: "0 0 8px rgba(196,43,71,0.5)",
                  }} />
                )}
              </div>
              {/* Label */}
              <span style={{ fontSize: 7.5, color: "var(--color-neutral-500)", whiteSpace: "nowrap" }}>
                {seg.segment}
              </span>
            </div>
          );
        })}
      </div>

      {/* Threshold line annotation */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "var(--color-neutral-500)" }}>
        <div style={{ width: 16, height: 2, background: "#C42B47", borderRadius: 1 }} />
        Tranches de domination identifiées : 20–30&apos;, 50–60&apos;, 60–70&apos;
      </div>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, children, headerRight }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
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
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {icon}
          <span style={{
            fontSize: 11, fontWeight: 800,
            color: "var(--color-neutral-200)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            {title}
          </span>
          <ChevronRight size={12} style={{ color: "var(--color-neutral-600)" }} />
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

// ─── Pill style helper ─────────────────────────────────────────────────────────

function pillStyle(active: boolean, variant: "player" | "phase" = "player"): React.CSSProperties {
  return {
    padding: "3px 9px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.12s ease",
    background: active
      ? variant === "phase" ? "rgba(245,158,11,0.15)" : "rgba(196,43,71,0.15)"
      : "var(--color-neutral-800)",
    borderColor: active
      ? variant === "phase" ? "rgba(245,158,11,0.5)" : "rgba(196,43,71,0.5)"
      : "var(--color-neutral-700)",
    color: active
      ? variant === "phase" ? "#F59E0B" : "#C42B47"
      : "var(--color-neutral-400)",
  };
}

// ─── Main Tab ──────────────────────────────────────────────────────────────────

export function TabOnBall() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "20px 24px",
      overflowY: "auto",
      height: "100%",
    }}>
      <Section title="Laboratoire Passes & xPV">
        <PassLab />
      </Section>

      <Section
        title="Tableau des Lignes Brisées"
        headerRight={<ExportXMLButton label="ALL" filename="lignes_brisees_all.xml" size="md" />}
      >
        <LineBreakTable />
      </Section>

      <Section title="Chronologie du Déséquilibre">
        <DesequilibreTimeline />
      </Section>
    </div>
  );
}
