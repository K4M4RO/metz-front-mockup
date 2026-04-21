"use client";

import { useState, useMemo } from "react";
import { ChevronRight, Download } from "lucide-react";
import { PitchSVG, relToAbs, PITCH_PAD } from "./PitchSVG";
import { ExportXMLButton } from "./ExportXMLButton";
import {
  PRESSURE_POINTS, PRESSURE_SOURCES, PRESSURE_CONSEQUENCES, DEF_ACTIONS,
} from "./data";

const PW = 340;
const PH = 420;

// ─── Heatmap + Recoveries ─────────────────────────────────────────────────────

function HeatmapPressure() {
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
    "loss":        "#EF4444",
    "success":     "#22C55E",
    "failed-pass": "#F59E0B",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          { label: "Perte de balle",        color: "#EF4444" },
          { label: "Récupération réussie",  color: "#22C55E" },
          { label: "Passe forcée ratée",    color: "#F59E0B" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 12, height: 12, borderRadius: 2,
            background: "rgba(196,43,71,0.5)",
          }} />
          <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>Intensité heatmap</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PitchSVG width={PW} height={PH}>
          {/* Heatmap grid */}
          {grid.map((row, ri) =>
            row.map((val, ci) => {
              if (val === 0) return null;
              const opacity = (val / maxCell) * 0.55;
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
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={6}
                  fill={col} stroke="rgba(0,0,0,0.4)" strokeWidth={1}
                  opacity={0.85} />
                <circle cx={cx} cy={cy} r={10}
                  fill="none" stroke={col} strokeWidth={0.8} opacity={0.4} />
              </g>
            );
          })}
        </PitchSVG>
      </div>
    </div>
  );
}

// ─── Pressure Source Pitch ────────────────────────────────────────────────────

function PressureSourcePitch() {
  const maxCount = Math.max(...PRESSURE_SOURCES.map((s) => s.count));

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <PitchSVG width={PW} height={PH}>
        {PRESSURE_SOURCES.map((src, i) => {
          const { x: cx, y: cy } = relToAbs(src.avgX, src.avgY, PW, PH);
          const r = 12 + (src.count / maxCount) * 20;
          const opacity = 0.4 + (src.count / maxCount) * 0.5;

          return (
            <g key={i}>
              {/* Pressure zone bubble */}
              <circle cx={cx} cy={cy} r={r}
                fill={`rgba(196,43,71,${opacity})`}
                stroke="rgba(196,43,71,0.7)"
                strokeWidth={1.5} />
              {/* Count */}
              <text x={cx} y={cy - 2} textAnchor="middle"
                fontSize={10} fontWeight={800} fill="white"
                style={{ userSelect: "none" }}>
                {src.count}
              </text>
              {/* Name */}
              <text x={cx} y={cy + 10} textAnchor="middle"
                fontSize={6.5} fontWeight={600} fill="rgba(255,255,255,0.8)"
                style={{ userSelect: "none" }}>
                {src.playerName}
              </text>
            </g>
          );
        })}
      </PitchSVG>
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
      {/* Row 1: Heatmap + Pressure Source side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Section title="Heatmap Pression & Récupérations">
          <HeatmapPressure />
        </Section>

        <Section title="Source de Pression — Joueurs Presseurs">
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 10 }}>
            Taille de bulle ∝ nombre de pressions exercées
          </div>
          <PressureSourcePitch />
        </Section>
      </div>

      {/* Row 2: Consequences + Target analysis */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Section title="Conséquences des Pressions">
          <PressureConsequences />
        </Section>

        <Section title="Cible de Pression">
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 12 }}>
            Joueurs adverses ayant subi le plus de pression haute intensité
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PRESSURE_SOURCES.map((src, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "var(--color-neutral-300)", fontWeight: 600 }}>
                    #{src.playerId % 40} {src.playerName}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#C42B47" }}>
                    {src.count} press.
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--color-neutral-800)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(src.count / 12) * 100}%`,
                    background: `linear-gradient(90deg, #6D071A, #C42B47)`,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

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
