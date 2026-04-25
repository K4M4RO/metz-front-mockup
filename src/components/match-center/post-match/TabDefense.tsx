"use client";

import { useState, useMemo } from "react";
import { ChevronRight, Download, HelpCircle, Info } from "lucide-react";
import { PitchSVG, relToAbs, PITCH_PAD } from "./PitchSVG";
import { ExportXMLButton } from "./ExportXMLButton";
import {
  PRESSURE_POINTS, PRESSURE_SOURCES, PRESSURE_CONSEQUENCES, DEF_ACTIONS,
  PRESSURE_SCORES, RESISTANCE_SCORES, RECEIVED_PRESSURE_POINTS, HOME_TEAM, RECEIVED_CONSEQUENCES
} from "./data";

const PW = 340;
const PH = 420;

// ─── Heatmap + Recoveries ─────────────────────────────────────────────────────

function HeatmapPressure() {
  const [hoveredPt, setHoveredPt] = useState<any>(null);
  
  // Build a simple grid heatmap from pressure points
  const GRID_W = 8;
  const GRID_H = 10;
  const cellW = (PW - 2 * PITCH_PAD) / GRID_W;
  const cellH = (PH - 2 * PITCH_PAD) / GRID_H;

  const grid = useMemo(() => {
    const g: number[][] = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(0));
    PRESSURE_POINTS.forEach((p) => {
      const col = Math.min(Math.floor(p.x * GRID_W), GRID_W - 1);
      const row = Math.min(Math.floor(p.y * GRID_H), GRID_H - 1);
      g[row][col] += p.intensity;
    });
    return g;
  }, []);

  const maxCell = Math.max(...grid.flat());

  const OUTCOME_COLORS: Record<string, string> = {
    "loss":        "#22C55E", // Récupération (Success for us)
    "success":     "#3B82F6", // Pression efficace (shape kept)
    "failed-pass": "#F59E0B", // Erreur forcée
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Récupération",         color: "#22C55E" },
          { label: "Pression efficace",    color: "#3B82F6" },
          { label: "Passe forcée ratée",   color: "#F59E0B" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PitchSVG width={PW} height={PH}>
          {/* Heatmap grid */}
          {grid.map((row, ri) =>
            row.map((val, ci) => {
              if (val === 0) return null;
              const opacity = (val / maxCell) * 0.45;
              return (
                <rect key={`${ri}-${ci}`}
                  x={PITCH_PAD + ci * cellW}
                  y={PITCH_PAD + ri * cellH}
                  width={cellW}
                  height={cellH}
                  fill={`rgba(196,43,71,${opacity})`}
                />
              );
            })
          )}

          {/* Recovery / pressure points */}
          {PRESSURE_POINTS.map((p, i) => {
            const { x: cx, y: cy } = relToAbs(p.x, p.y, PW, PH);
            const col = OUTCOME_COLORS[p.outcome];
            const presser = HOME_TEAM.starters.find(s => s.id === p.presserId)?.name || "Joueur";
            
            return (
              <g key={i} 
                 onMouseEnter={() => setHoveredPt({ ...p, playerName: presser })}
                 onMouseLeave={() => setHoveredPt(null)}
                 style={{ cursor: "pointer" }}>
                <circle cx={cx} cy={cy} r={hoveredPt?.x === p.x ? 8 : 6}
                  fill={col} stroke="#fff" strokeWidth={hoveredPt?.x === p.x ? 1.5 : 0.5}
                  opacity={hoveredPt && hoveredPt.x !== p.x ? 0.3 : 0.9} 
                  style={{ transition: "all 0.2s" }} />
                <circle cx={cx} cy={cy} r={12}
                  fill="none" stroke={col} strokeWidth={0.8} opacity={hoveredPt?.x === p.x ? 0.6 : 0.2} />
              </g>
            );
          })}
        </PitchSVG>

        {hoveredPt && (
          <div style={{
            position: "absolute",
            left: hoveredPt.x * (PW - 2*PITCH_PAD) + PITCH_PAD,
            top: hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD > 60 ? hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD - 10 : hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD + 10,
            transform: hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD > 60 ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            background: "var(--color-neutral-900)",
            border: "1px solid var(--color-neutral-700)",
            padding: "6px 12px",
            borderRadius: "8px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 50,
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", gap: 2
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "white", textTransform: "uppercase" }}>{hoveredPt.playerName}</div>
            <div style={{ fontSize: 9, color: OUTCOME_COLORS[hoveredPt.outcome], fontWeight: 700 }}>{hoveredPt.action}</div>
            <div style={{ fontSize: 8, color: "var(--color-neutral-500)" }}>Intensité: {(hoveredPt.intensity * 100).toFixed(0)}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pressure Source Pitch ────────────────────────────────────────────────────

function PressureScoreSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "var(--color-neutral-400)", fontWeight: 600 }}>
          Efficacité du pressing individuel
        </span>
        <div style={{ cursor: "help" }} title="Score calculé sur l'intensité, le positionnement et les issues (récupérations, erreurs forcées) des actions de pressing.">
          <HelpCircle size={12} style={{ color: "var(--color-neutral-600)" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PRESSURE_SCORES.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-100)" }}>{p.name}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#C42B47" }}>{p.score}</span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--color-neutral-800)", overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${p.pos}%`, height: "100%", background: "#22C55E", transition: "width 0.8s ease" }} />
              <div style={{ width: `${p.neg}%`, height: "100%", background: "#EF4444", transition: "width 0.8s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>
              <span style={{ color: "#22C55E" }}>Efficace: {p.pos}%</span>
              <span style={{ color: "#EF4444" }}>Neutre/Négatif: {p.neg}%</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", padding: "10px", background: "rgba(196,43,71,0.05)", borderRadius: 8, border: "1px dashed rgba(196,43,71,0.2)" }}>
        <div style={{ fontSize: 9, color: "#C42B47", fontWeight: 800, marginBottom: 4 }}>DÉTAIL DU CALCUL</div>
        <div style={{ fontSize: 9, color: "var(--color-neutral-400)", lineHeight: "1.4" }}>
          Score = (HI Récupérations × 2.5 + Passes forcées ratées × 1.5 + Pressions HI × 0.5) / Minutes jouées.
        </div>
      </div>
    </div>
  );
}

function HeatmapResistance() {
  const [hoveredPt, setHoveredPt] = useState<any>(null);
  const GRID_W = 8, GRID_H = 10;
  const cellW = (PW - 2 * PITCH_PAD) / GRID_W, cellH = (PH - 2 * PITCH_PAD) / GRID_H;

  const grid = useMemo(() => {
    const g = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(0));
    RECEIVED_PRESSURE_POINTS.forEach((p) => {
      const col = Math.min(Math.floor(p.x * GRID_W), GRID_W - 1), row = Math.min(Math.floor(p.y * GRID_H), GRID_H - 1);
      g[row][col] += p.intensity;
    });
    return g;
  }, []);

  const maxCell = Math.max(...grid.flat());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Ballon conservé",  color: "#22C55E" },
          { label: "Ballon perdu",     color: "#EF4444" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PitchSVG width={PW} height={PH}>
          {grid.map((row, ri) => row.map((val, ci) => {
            if (val === 0) return null;
            return <rect key={`${ri}-${ci}`} x={PITCH_PAD + ci * cellW} y={PITCH_PAD + ri * cellH} width={cellW} height={cellH} fill={`rgba(34,197,94,${(val / maxCell) * 0.4})`} />;
          }))}

          {RECEIVED_PRESSURE_POINTS.map((p, i) => {
            const { x: cx, y: cy } = relToAbs(p.x, p.y, PW, PH);
            const col = p.outcome === "kept" ? "#22C55E" : "#EF4444";
            const player = HOME_TEAM.starters.find(s => s.id === p.playerId)?.name || "Joueur";
            return (
              <g key={i} onMouseEnter={() => setHoveredPt({ ...p, playerName: player })} onMouseLeave={() => setHoveredPt(null)} style={{ cursor: "pointer" }}>
                <circle cx={cx} cy={cy} r={hoveredPt?.x === p.x ? 8 : 6} fill={col} stroke="#fff" strokeWidth={hoveredPt?.x === p.x ? 1.5 : 0.5} opacity={0.9} />
              </g>
            );
          })}
        </PitchSVG>

        {hoveredPt && (
          <div style={{
            position: "absolute", left: hoveredPt.x * (PW - 2*PITCH_PAD) + PITCH_PAD,
            top: hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD > 60 ? hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD - 10 : hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD + 10,
            transform: hoveredPt.y * (PH - 2*PITCH_PAD) + PITCH_PAD > 60 ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            background: "var(--color-neutral-900)", border: "1px solid var(--color-neutral-700)", padding: "6px 12px", borderRadius: "8px", pointerEvents: "none", zIndex: 50, boxShadow: "0 4px 15px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: 2
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "white", textTransform: "uppercase" }}>{hoveredPt.playerName}</div>
            <div style={{ fontSize: 9, color: hoveredPt.outcome === "kept" ? "#22C55E" : "#EF4444", fontWeight: 700 }}>{hoveredPt.action}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResistanceScoreSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "var(--color-neutral-400)", fontWeight: 600 }}>Résistance individuelle au pressing</span>
        <div style={{ cursor: "help" }} title="Capacité à conserver le ballon ou à trouver un partenaire sous une pression de haute intensité.">
          <HelpCircle size={12} style={{ color: "var(--color-neutral-600)" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {RESISTANCE_SCORES.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-100)" }}>{p.name}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#22C55E" }}>{p.score}</span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--color-neutral-800)", overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${p.pos}%`, height: "100%", background: "#22C55E", transition: "width 0.8s ease" }} />
              <div style={{ width: `${p.neg}%`, height: "100%", background: "#EF4444", transition: "width 0.8s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>
              <span style={{ color: "#22C55E" }}>Balle gardée: {p.pos}%</span>
              <span style={{ color: "#EF4444" }}>Balle perdue: {p.neg}%</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", padding: "10px", background: "rgba(34,197,94,0.05)", borderRadius: 8, border: "1px dashed rgba(34,197,94,0.2)" }}>
        <div style={{ fontSize: 9, color: "#22C55E", fontWeight: 800, marginBottom: 4 }}>DÉTAIL DU CALCUL</div>
        <div style={{ fontSize: 9, color: "var(--color-neutral-400)", lineHeight: "1.4" }}>
          Score = (Possessions conservées sous pression HI / Total phases de pression subies) × 100.
        </div>
      </div>
    </div>
  );
}

// ─── Pressure Consequences ────────────────────────────────────────────────────

function PressureConsequences() {
  const data = [
    { label: "Pertes de balle",     value: PRESSURE_CONSEQUENCES.losses.pct,        color: "#EF4444", icon: "💥" },
    { label: "Passes forcées OK",   value: PRESSURE_CONSEQUENCES.successPasses.pct,  color: "#22C55E", icon: "✓"  },
    { label: "Passes forcées ratées", value: PRESSURE_CONSEQUENCES.failedPasses.pct, color: "#F59E0B", icon: "✗"  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "var(--color-neutral-300)" }}>
              {d.icon} {d.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, color: d.color }}>{d.value}%</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "var(--color-neutral-800)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${d.value}%`,
              background: `linear-gradient(90deg, ${d.color}88, ${d.color})`,
              borderRadius: 4,
              transition: "width 0.7s ease",
            }} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginTop: 4 }}>
        Base : {PRESSURE_CONSEQUENCES.losses.count + PRESSURE_CONSEQUENCES.successPasses.count + PRESSURE_CONSEQUENCES.failedPasses.count} actions de pressing haute intensité
      </div>
    </div>
  );
}


function ReceivedConsequences() {
  const data = [
    { label: "Ballon conservé",    value: RECEIVED_CONSEQUENCES.kept.pct,         color: "#22C55E", icon: "🛡️" },
    { label: "Ballon perdu",       value: RECEIVED_CONSEQUENCES.lost.pct,         color: "#EF4444", icon: "💥" },
    { label: "Erreur forcée (Passe ratée)", value: RECEIVED_CONSEQUENCES.forcedError.pct, color: "#F59E0B", icon: "✗"  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "var(--color-neutral-300)" }}>
              {d.icon} {d.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, color: d.color }}>{d.value}%</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "var(--color-neutral-800)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${d.value}%`,
              background: `linear-gradient(90deg, ${d.color}88, ${d.color})`,
              borderRadius: 4,
              transition: "width 0.7s ease",
            }} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginTop: 4 }}>
        Base : {RECEIVED_CONSEQUENCES.kept.count + RECEIVED_CONSEQUENCES.lost.count + RECEIVED_CONSEQUENCES.forcedError.count} phases de pression subies
      </div>
    </div>
  );
}

// ─── Defensive Actions Table ──────────────────────────────────────────────────

function DefActionsTable() {
  type SortKey = keyof typeof DEF_ACTIONS[0];
  const [sortKey, setSortKey] = useState<SortKey>("hiPressures");
  const sorted = useMemo(() => {
    return [...DEF_ACTIONS].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return bv - av;
      return 0;
    });
  }, [sortKey]);

  const cols: { key: SortKey; label: string; color?: string }[] = [
    { key: "playerName",    label: "Joueur" },
    { key: "hiPressures",   label: "Press. HI",    color: "#C42B47" },
    { key: "hiRecoveries",  label: "Récup. HI",    color: "#F59E0B" },
    { key: "tackles",       label: "Tacles",        color: "#3B82F6" },
    { key: "interceptions", label: "Interceptions", color: "#22C55E" },
  ];

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={String(c.key)}
                  onClick={() => c.key !== "playerName" && setSortKey(c.key)}
                  style={{
                    padding: "6px 10px",
                    textAlign: c.key === "playerName" ? "left" : "center",
                    fontSize: 9, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    color: sortKey === c.key ? (c.color ?? "#C42B47") : "var(--color-neutral-500)",
                    borderBottom: "1px solid var(--color-neutral-800)",
                    cursor: c.key !== "playerName" ? "pointer" : "default",
                    whiteSpace: "nowrap",
                  }}>
                  {c.label}{sortKey === c.key && " ▼"}
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
            {sorted.map((row, i) => (
              <tr key={i} style={{
                borderBottom: "1px solid var(--color-neutral-800)",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
              }}>
                <td style={{ padding: "7px 10px", color: "var(--color-neutral-200)", fontWeight: 600 }}>
                  <span style={{
                    display: "inline-block", width: 20, height: 20, lineHeight: "20px",
                    textAlign: "center", background: "var(--color-neutral-800)",
                    borderRadius: 4, fontSize: 9, fontWeight: 800,
                    color: "#C42B47", marginRight: 6,
                  }}>
                    {row.number}
                  </span>
                  {row.playerName}
                </td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700, color: "#C42B47" }}>
                  {row.hiPressures}
                </td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700, color: "#F59E0B" }}>
                  {row.hiRecoveries}
                </td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700, color: "#3B82F6" }}>
                  {row.tackles}
                </td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700, color: "#22C55E" }}>
                  {row.interceptions}
                </td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>
                  <ExportXMLButton filename={`defense_${row.playerName}.xml`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────

function Section({ title, children, headerRight }: {
  title: string; children: React.ReactNode; headerRight?: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--color-neutral-900)",
      border: "1px solid var(--color-neutral-800)",
      borderRadius: 10,
      padding: "16px 20px",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        marginBottom: 16, paddingBottom: 10,
        borderBottom: "1px solid var(--color-neutral-800)",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 800,
            color: "var(--color-neutral-200)",
            textTransform: "uppercase", letterSpacing: "0.08em",
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

// ─── Main Tab ──────────────────────────────────────────────────────────────────

export function TabDefense() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "20px 24px",
      overflowY: "auto",
      height: "100%",
    }}>
      {/* Row 1: Pressure Exercised (HI Pressing) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Section title="Efficacité du Pressing Exercé (HI)">
          <HeatmapPressure />
        </Section>

        <Section title="Score de Pression — Top 5 Presseurs">
          <PressureScoreSection />
        </Section>
      </div>
      
      {/* Conséquences Pressing Exercé */}
      <Section title="Conséquences du Pressing Exercé">
        <PressureConsequences />
      </Section>

      {/* Row 2: Pressure Received (Resistance) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Section title="Analyse de la Pression Subie">
          <HeatmapResistance />
        </Section>

        <Section title="Score de Résistance au Pressing — Top 5">
          <ResistanceScoreSection />
        </Section>
      </div>

      {/* Conséquences Pressing Subi */}
      <Section title="Conséquences de la Pression Subie">
        <ReceivedConsequences />
      </Section>

      {/* Row 3: Full-width defensive actions table */}
      <Section
        title="Tableau des Actions Défensives"
        headerRight={
          <div style={{ display: "flex", gap: 6 }}>
            <ExportXMLButton label="TOUS" filename="defense_all.xml" size="md" />
          </div>
        }
      >
        <DefActionsTable />
      </Section>
    </div>
  );
}
