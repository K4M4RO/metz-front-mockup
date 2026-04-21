"use client";

import { useState, useMemo } from "react";
import { Filter, ChevronRight } from "lucide-react";
import { PitchSVG, relToAbs } from "./PitchSVG";
import { ExportXMLButton } from "./ExportXMLButton";
import { HOME_TEAM, RUN_VECTORS, RUN_PROFILES } from "./data";

const PW = 380;
const PH = 460;

const ZONE_OPTIONS = ["Toutes zones", "left", "central", "right"] as const;
const PROFILE_OPTIONS = ["Tous profils", "coming-short", "pulling-wide", "ahead", "in-behind"] as const;
type Zone = (typeof ZONE_OPTIONS)[number];
type Profile = (typeof PROFILE_OPTIONS)[number];

const PROFILE_LABELS: Record<string, string> = {
  "coming-short": "Coming Short",
  "pulling-wide": "Pulling Wide",
  "ahead":        "Ahead",
  "in-behind":    "In Behind",
};

const PROFILE_COLORS: Record<string, string> = {
  "coming-short": "#22C55E",
  "pulling-wide": "#3B82F6",
  "ahead":        "#F59E0B",
  "in-behind":    "#C42B47",
};

// ─── Run Lab ──────────────────────────────────────────────────────────────────

function RunLab() {
  const [selectedZone,    setSelectedZone]    = useState<Zone>("Toutes zones");
  const [selectedProfile, setSelectedProfile] = useState<Profile>("Tous profils");

  const filtered = useMemo(() => {
    return RUN_VECTORS.filter((r) => {
      const zoneOk    = selectedZone    === "Toutes zones" || r.zone    === selectedZone;
      const profileOk = selectedProfile === "Tous profils" || r.profile === selectedProfile;
      return zoneOk && profileOk;
    });
  }, [selectedZone, selectedProfile]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Filter size={12} style={{ color: "var(--color-neutral-500)" }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {ZONE_OPTIONS.map((z) => (
            <button key={z} onClick={() => setSelectedZone(z)} style={pillStyle(selectedZone === z)}>
              {z === "left" ? "Gauche" : z === "central" ? "Centre" : z === "right" ? "Droite" : z}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 16, background: "var(--color-neutral-700)" }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {PROFILE_OPTIONS.map((p) => (
            <button key={p} onClick={() => setSelectedProfile(p)}
              style={pillStyle(selectedProfile === p, p !== "Tous profils" ? PROFILE_COLORS[p] : undefined)}>
              {p === "Tous profils" ? p : PROFILE_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {Object.entries(PROFILE_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 16, height: 2, background: PROFILE_COLORS[key], borderRadius: 1 }} />
            <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>{label}</span>
          </div>
        ))}
        <span style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>· Seuil : &gt;15 km/h</span>
      </div>

      {/* Pitch */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PitchSVG width={PW} height={PH}>
          <defs>
            {Object.entries(PROFILE_COLORS).map(([key, col]) => (
              <marker key={key} id={`arrow-${key}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M 0 0 L 7 3.5 L 0 7 z" fill={col} />
              </marker>
            ))}
          </defs>

          {filtered.map((run, i) => {
            const s = relToAbs(run.x1, run.y1, PW, PH);
            const e = relToAbs(run.x2, run.y2, PW, PH);
            const col = PROFILE_COLORS[run.profile];
            const thick = run.speed > 20 ? 2.5 : run.speed > 17 ? 2 : 1.5;

            return (
              <g key={i}>
                <line
                  x1={s.x} y1={s.y} x2={e.x} y2={e.y}
                  stroke={col}
                  strokeWidth={thick}
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${run.profile})`}
                  opacity={0.85}
                />
                {/* Speed as a small dot at start */}
                <circle cx={s.x} cy={s.y} r={4}
                  fill={col} stroke="rgba(0,0,0,0.4)" strokeWidth={1} opacity={0.9} />
                {/* Speed label for high-speed runs */}
                {run.speed > 18 && (
                  <text x={s.x + 6} y={s.y - 4}
                    fontSize={7} fontWeight={700} fill={col}
                    style={{ userSelect: "none" }}>
                    {run.speed.toFixed(1)}
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

// ─── Run Profile Table ─────────────────────────────────────────────────────────

function RunProfileTable() {
  type SortKey = keyof typeof RUN_PROFILES[0];
  const [sortBy, setSortBy] = useState<SortKey>("total");

  const sorted = useMemo(() => {
    return [...RUN_PROFILES].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
  }, [sortBy]);

  const headers: { key: SortKey; label: string; color?: string }[] = [
    { key: "playerName",  label: "Joueur"        },
    { key: "comingShort", label: "Coming Short",  color: PROFILE_COLORS["coming-short"] },
    { key: "pullingWide", label: "Pulling Wide",  color: PROFILE_COLORS["pulling-wide"] },
    { key: "ahead",       label: "Ahead",         color: PROFILE_COLORS["ahead"] },
    { key: "inBehind",    label: "In Behind",     color: PROFILE_COLORS["in-behind"] },
    { key: "total",       label: "Total"          },
  ];

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h.key}
                  onClick={() => h.key !== "playerName" ? setSortBy(h.key) : undefined}
                  style={{
                    padding: "6px 10px",
                    textAlign: h.key === "playerName" ? "left" : "center",
                    fontSize: 9, fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: sortBy === h.key ? (h.color ?? "#C42B47") : "var(--color-neutral-500)",
                    borderBottom: "1px solid var(--color-neutral-800)",
                    cursor: h.key !== "playerName" ? "pointer" : "default",
                    whiteSpace: "nowrap",
                  }}>
                  {h.label}
                  {sortBy === h.key && " ▼"}
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
                {[
                  { val: row.comingShort, color: PROFILE_COLORS["coming-short"] },
                  { val: row.pullingWide, color: PROFILE_COLORS["pulling-wide"] },
                  { val: row.ahead,       color: PROFILE_COLORS["ahead"]        },
                  { val: row.inBehind,    color: PROFILE_COLORS["in-behind"]    },
                ].map(({ val, color }, j) => (
                  <td key={j} style={{ padding: "7px 10px", textAlign: "center" }}>
                    <span style={{ fontWeight: 700, color }}>{val}</span>
                  </td>
                ))}
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  <span style={{
                    fontWeight: 800, color: "var(--color-neutral-200)", fontSize: 12,
                  }}>
                    {row.total}
                  </span>
                </td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>
                  <ExportXMLButton filename={`runs_${row.playerName}.xml`} />
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
  title: string;
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
        display: "flex", alignItems: "center",
        marginBottom: 16, paddingBottom: 10,
        borderBottom: "1px solid var(--color-neutral-800)",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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

function pillStyle(active: boolean, activeColor?: string): React.CSSProperties {
  return {
    padding: "3px 9px", borderRadius: 20, fontSize: 10,
    fontWeight: active ? 700 : 500, cursor: "pointer",
    border: "1px solid",
    background: active ? `${activeColor ?? "#C42B47"}22` : "var(--color-neutral-800)",
    borderColor: active ? `${activeColor ?? "#C42B47"}77` : "var(--color-neutral-700)",
    color: active ? (activeColor ?? "#C42B47") : "var(--color-neutral-400)",
    transition: "all 0.12s ease",
  };
}

// ─── Main Tab ──────────────────────────────────────────────────────────────────

export function TabOffBall() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "20px 24px",
      overflowY: "auto",
      height: "100%",
    }}>
      <Section title="Laboratoire Appels (&gt;15 km/h)">
        <RunLab />
      </Section>

      <Section
        title="Tableau des Profils de Courses"
        headerRight={<ExportXMLButton label="ALL" filename="runs_all.xml" size="md" />}
      >
        <RunProfileTable />
      </Section>
    </div>
  );
}
