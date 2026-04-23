"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ShortlistPlayer {
  id: number;
  initials: string;
  name: string;
  position: string;
  age: number;
  club: string;
  league: string;
  contractEnd: string;
  marketValue: string;
  note: number;
  rating: string;
  flag: string;
  status: string;
}

interface Shortlist {
  id: string;
  name: string;
  icon: string;
  count: number;
  players: ShortlistPlayer[];
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const SHORTLISTS: Shortlist[] = [
  {
    id: "md2025",
    name: "Milieux défensifs 2025",
    icon: "🛡️",
    count: 14,
    players: [
      { id:1,  initials:"TS", name:"T. Samassékou",  position:"MDF", age:28, club:"Reims",        league:"Ligue 1",        contractEnd:"Jun 2026", marketValue:"8M€",   note:7.8, rating:"B", flag:"🇬🇳", status:"Observation" },
      { id:2,  initials:"NK", name:"N. Kaboré",      position:"MDF", age:23, club:"Burnley",      league:"Championship",   contractEnd:"Jun 2025", marketValue:"5M€",   note:7.4, rating:"B", flag:"🇧🇫", status:"Identifié"   },
      { id:3,  initials:"YY", name:"Y. Yildiz",      position:"MC",  age:20, club:"Juventus",     league:"Serie A",        contractEnd:"Jun 2027", marketValue:"12M€",  note:8.1, rating:"A", flag:"🇩🇪", status:"À suivre"    },
      { id:4,  initials:"AB", name:"A. Bissouma",    position:"MDF", age:28, club:"Tottenham",    league:"Premier League", contractEnd:"Jun 2026", marketValue:"18M€",  note:7.9, rating:"B", flag:"🇲🇱", status:"Identifié"   },
      { id:5,  initials:"RC", name:"R. Camavinga",   position:"MC",  age:22, club:"Real Madrid",  league:"La Liga",        contractEnd:"Jun 2029", marketValue:"90M€",  note:8.6, rating:"A", flag:"🇫🇷", status:"À suivre"    },
      { id:6,  initials:"MJ", name:"M. Jakić",       position:"MDF", age:27, club:"Eintracht",    league:"Bundesliga",     contractEnd:"Jun 2026", marketValue:"14M€",  note:7.6, rating:"B", flag:"🇷🇸", status:"Contacté"    },
      { id:7,  initials:"WZ", name:"W. Zaïre-Emery", position:"MC",  age:18, club:"PSG",          league:"Ligue 1",        contractEnd:"Jun 2028", marketValue:"40M€",  note:8.4, rating:"A", flag:"🇫🇷", status:"À suivre"    },
      { id:8,  initials:"FN", name:"F. Nmecha",      position:"MC",  age:25, club:"Chelsea",      league:"Premier League", contractEnd:"Jun 2027", marketValue:"22M€",  note:7.7, rating:"B", flag:"🇩🇪", status:"Identifié"   },
      { id:30, initials:"MD", name:"Mo Dahoud",      position:"MDF", age:28, club:"Stuttgart",    league:"Bundesliga",     contractEnd:"Jun 2026", marketValue:"6M€",   note:7.5, rating:"B", flag:"🇩🇪", status:"À suivre"    },
      { id:31, initials:"AO", name:"Amadou Onana",   position:"MDF", age:23, club:"Aston Villa",  league:"Premier League", contractEnd:"Jun 2028", marketValue:"50M€",  note:8.2, rating:"A", flag:"🇧🇪", status:"À suivre"    },
      { id:32, initials:"KG", name:"K. Gladbach",    position:"MDF", age:22, club:"Mönchengladbach", league:"Bundesliga", contractEnd:"Jun 2027", marketValue:"9M€",   note:7.3, rating:"B", flag:"🇩🇪", status:"Identifié"   },
    ],
  },
  {
    id: "prio",
    name: "Cibles prioritaires",
    icon: "⭐",
    count: 5,
    players: [
      { id:10, initials:"EM", name:"Enzo Millot",  position:"MC",  age:23, club:"FC Metz",    league:"Ligue 1",       contractEnd:"Jun 2026", marketValue:"12M€",  note:8.3, rating:"A", flag:"🇫🇷", status:"Contacté"    },
      { id:11, initials:"LN", name:"Lucas Netz",   position:"MC",  age:21, club:"Augsburg",   league:"Bundesliga",    contractEnd:"Jun 2026", marketValue:"7M€",   note:7.9, rating:"B", flag:"🇩🇪", status:"Observation" },
      { id:12, initials:"GF", name:"G. Ferreira",  position:"AD",  age:22, club:"Vitória SC", league:"Liga Portugal", contractEnd:"Jun 2025", marketValue:"4M€",   note:7.6, rating:"B", flag:"🇵🇹", status:"Contacté"    },
      { id:13, initials:"RE", name:"R. Esteves",   position:"LG",  age:23, club:"SC Braga",   league:"Liga Portugal", contractEnd:"Jun 2026", marketValue:"6M€",   note:8.2, rating:"A", flag:"🇵🇹", status:"Pré-accord"  },
      { id:14, initials:"FA", name:"F. Abdou",     position:"MDF", age:25, club:"FC Sète",    league:"Ligue 2",       contractEnd:"Jun 2025", marketValue:"1.5M€", note:8.5, rating:"A", flag:"🇫🇷", status:"Pré-accord"  },
    ],
  },
  {
    id: "shadow",
    name: "Shadow Squad FC Metz",
    icon: "⚽",
    count: 11,
    players: [
      { id:20, initials:"AM", name:"A. Mandanda",   position:"GK",  age:39, club:"FC Metz",    league:"Ligue 1",       contractEnd:"Jun 2026", marketValue:"2M€",   note:7.2, rating:"B", flag:"🇫🇷", status:"Priorité"    },
      { id:21, initials:"KD", name:"K. Diallo",     position:"LD",  age:25, club:"AS Monaco",  league:"Ligue 1",       contractEnd:"Jun 2026", marketValue:"8M€",   note:6.8, rating:"C", flag:"🇬🇳", status:"Observation" },
      { id:22, initials:"JN", name:"J. Niasse",     position:"DC",  age:27, club:"FC Metz",    league:"Ligue 1",       contractEnd:"Jun 2027", marketValue:"3M€",   note:7.0, rating:"B", flag:"🇸🇳", status:"Priorité"    },
      { id:23, initials:"TH", name:"T. Hountondji", position:"DC",  age:29, club:"FC Metz",    league:"Ligue 1",       contractEnd:"Jun 2026", marketValue:"4M€",   note:7.1, rating:"B", flag:"🇧🇯", status:"Priorité"    },
      { id:24, initials:"RE", name:"R. Esteves",    position:"LG",  age:23, club:"SC Braga",   league:"Liga Portugal", contractEnd:"Jun 2026", marketValue:"6M€",   note:8.2, rating:"A", flag:"🇵🇹", status:"Pré-accord"  },
      { id:25, initials:"EM", name:"Enzo Millot",   position:"MC",  age:23, club:"FC Metz",    league:"Ligue 1",       contractEnd:"Jun 2026", marketValue:"12M€",  note:8.3, rating:"A", flag:"🇫🇷", status:"Contacté"    },
      { id:26, initials:"TS", name:"T. Samassékou", position:"MDF", age:28, club:"Reims",      league:"Ligue 1",       contractEnd:"Jun 2026", marketValue:"8M€",   note:7.8, rating:"B", flag:"🇬🇳", status:"Observation" },
      { id:27, initials:"GF", name:"G. Ferreira",   position:"AD",  age:22, club:"Vitória SC", league:"Liga Portugal", contractEnd:"Jun 2025", marketValue:"4M€",   note:7.6, rating:"B", flag:"🇵🇹", status:"Contacté"    },
      { id:28, initials:"FA", name:"F. Abdou",      position:"AT",  age:25, club:"FC Sète",    league:"Ligue 2",       contractEnd:"Jun 2025", marketValue:"1.5M€", note:8.5, rating:"A", flag:"🇫🇷", status:"Pré-accord"  },
      { id:40, initials:"GK", name:"G. Kobel",      position:"GK",  age:26, club:"Dortmund",   league:"Bundesliga",    contractEnd:"Jun 2028", marketValue:"40M€",  note:8.1, rating:"A", flag:"🇨🇭", status:"À suivre"    },
      { id:41, initials:"MM", name:"M. Maignan",    position:"GK",  age:29, club:"AC Milan",   league:"Serie A",       contractEnd:"Jun 2026", marketValue:"45M€",  note:8.4, rating:"A", flag:"🇫🇷", status:"À suivre"    },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  "Identifié":   { bg:"rgba(59,130,246,0.12)",  border:"rgba(59,130,246,0.35)",  color:"#93C5FD" },
  "Observation": { bg:"rgba(168,85,247,0.12)",  border:"rgba(168,85,247,0.35)",  color:"#C4B5FD" },
  "Contacté":    { bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.35)",  color:"#FCD34D" },
  "Pré-accord":  { bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.35)",  color:"#6EE7B7" },
  "À suivre":    { bg:"rgba(107,114,128,0.12)", border:"rgba(107,114,128,0.35)", color:"#9CA3AF" },
  "Priorité":    { bg:"rgba(196,43,71,0.12)",   border:"rgba(196,43,71,0.35)",   color:"#F87171" },
  "Écarté":      { bg:"rgba(75,85,99,0.10)",    border:"rgba(75,85,99,0.3)",     color:"#6B7280"  },
};

const RATING_COLOR: Record<string, string> = {
  A: "#10B981", B: "#F59E0B", C: "#F97316", D: "#EF4444", E: "#6B7280",
};

function noteColor(note: number): string {
  if (note >= 8.5) return "#10B981";
  if (note >= 7.5) return "#F59E0B";
  if (note >= 7.0) return "#F97316";
  return "#EF4444";
}

// ─── Badges ────────────────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: string }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 600,
        padding: "2px 7px", borderRadius: 4,
        backgroundColor: "rgba(196,43,71,0.12)", border: "1px solid rgba(196,43,71,0.35)",
        color: "var(--color-primary-300)", whiteSpace: "nowrap",
      }}
    >
      {pos}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_STYLE[status] ?? STATUS_STYLE["Identifié"];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 500,
        padding: "2px 8px", borderRadius: 4, backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`, color: cfg.color, whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function RatingBadge({ rating }: { rating: string }) {
  const color = RATING_COLOR[rating] ?? "#9CA3AF";
  return (
    <div
      style={{
        width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 12, fontWeight: 700, margin: "0 auto",
        backgroundColor: color + "1A", border: `1.5px solid ${color}55`, color,
      }}
    >
      {rating}
    </div>
  );
}

// ─── Liste view ────────────────────────────────────────────────────────────────

function ShortlistTable({ players }: { players: ShortlistPlayer[] }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
        <thead>
          <tr style={{ backgroundColor: "var(--color-neutral-800)", borderBottom: "1px solid var(--color-neutral-700)" }}>
            {["#", "Joueur", "Poste", "Club / Championnat", "Valeur", "Contrat", "Note", "Statut"].map((h, i) => (
              <th key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--color-neutral-500)", textAlign: i === 0 || i === 2 || i === 6 || i === 7 ? "center" : "left", whiteSpace: "nowrap", userSelect: "none" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => {
            const isHov = hoveredRow === p.id;
            const contractWarning = parseInt(p.contractEnd.split(" ").pop() ?? "2099", 10) <= 2025;
            return (
              <tr
                key={p.id}
                onMouseEnter={() => setHoveredRow(p.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  height: 48, cursor: "pointer",
                  backgroundColor: isHov ? "rgba(196,43,71,0.05)" : idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderBottom: "1px solid var(--color-neutral-700)", transition: "background-color 80ms ease-out",
                }}
              >
                <td style={{ padding: "0 12px", textAlign: "center", width: 36 }}>
                  <span style={{ fontSize: 11, color: "var(--color-neutral-600)", fontVariantNumeric: "tabular-nums" }}>{idx + 1}</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, backgroundColor: "var(--color-primary-900)", color: "var(--color-primary-300)" }}>
                      {p.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-neutral-100)" }}>{p.flag} {p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-neutral-500)" }}>{p.age} ans</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "0 12px", textAlign: "center" }}><PosBadge pos={p.position} /></td>
                <td style={{ padding: "0 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-neutral-200)" }}>{p.club}</div>
                  <div style={{ fontSize: 11, color: "var(--color-neutral-500)" }}>{p.league}</div>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-neutral-200)", fontVariantNumeric: "tabular-nums" }}>{p.marketValue}</span>
                </td>
                <td style={{ padding: "0 12px" }}>
                  <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: contractWarning ? "#F59E0B" : "var(--color-neutral-400)" }}>{p.contractEnd}</span>
                </td>
                <td style={{ padding: "0 12px", textAlign: "center" }}><RatingBadge rating={p.rating} /></td>
                <td style={{ padding: "0 12px", textAlign: "center" }}><StatusBadge status={p.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Terrain constants ─────────────────────────────────────────────────────────

const PW = 310;
const PH = 470;
const R  = 12;    // player circle radius
const SH = 28;    // horizontal step between players in same group

type FormationKey = "4-3-3" | "4-2-3-1" | "4-4-2" | "3-5-2";
const FORMATIONS: FormationKey[] = ["4-3-3", "4-2-3-1", "4-4-2", "3-5-2"];

interface PosCoord { x: number; y: number; label: string }

// Per formation: normalized position abbreviation → pitch coordinates + display label
const FORMATION_COORDS: Record<FormationKey, Record<string, PosCoord>> = {
  "4-3-3": {
    GK:  { x:0.50, y:0.87, label:"GB"  },
    LG:  { x:0.13, y:0.73, label:"LG"  },
    DG:  { x:0.13, y:0.73, label:"LG"  },
    DC:  { x:0.50, y:0.75, label:"DC"  },
    LD:  { x:0.87, y:0.73, label:"LD"  },
    DD:  { x:0.87, y:0.73, label:"LD"  },
    MDF: { x:0.50, y:0.55, label:"MDF" },
    MDC: { x:0.50, y:0.55, label:"MDF" },
    MC:  { x:0.50, y:0.48, label:"MC"  },
    MOC: { x:0.50, y:0.40, label:"MO"  },
    MO:  { x:0.50, y:0.40, label:"MO"  },
    AG:  { x:0.16, y:0.25, label:"AG"  },
    AD:  { x:0.84, y:0.25, label:"AD"  },
    AT:  { x:0.50, y:0.17, label:"AT"  },
    BU:  { x:0.50, y:0.17, label:"AT"  },
  },
  "4-2-3-1": {
    GK:  { x:0.50, y:0.87, label:"GB"  },
    LG:  { x:0.13, y:0.73, label:"LG"  },
    DG:  { x:0.13, y:0.73, label:"LG"  },
    DC:  { x:0.50, y:0.75, label:"DC"  },
    LD:  { x:0.87, y:0.73, label:"LD"  },
    DD:  { x:0.87, y:0.73, label:"LD"  },
    MDF: { x:0.50, y:0.62, label:"MDF" },
    MDC: { x:0.50, y:0.62, label:"MDF" },
    MC:  { x:0.50, y:0.44, label:"MO"  },
    MOC: { x:0.50, y:0.44, label:"MO"  },
    MO:  { x:0.50, y:0.44, label:"MO"  },
    AG:  { x:0.22, y:0.32, label:"AI"  },
    AD:  { x:0.78, y:0.32, label:"AI"  },
    AT:  { x:0.50, y:0.17, label:"AT"  },
    BU:  { x:0.50, y:0.17, label:"AT"  },
  },
  "4-4-2": {
    GK:  { x:0.50, y:0.87, label:"GB"  },
    LG:  { x:0.13, y:0.73, label:"LG"  },
    DG:  { x:0.13, y:0.73, label:"LG"  },
    DC:  { x:0.50, y:0.75, label:"DC"  },
    LD:  { x:0.87, y:0.73, label:"LD"  },
    DD:  { x:0.87, y:0.73, label:"LD"  },
    MDF: { x:0.50, y:0.52, label:"MC"  },
    MDC: { x:0.50, y:0.52, label:"MC"  },
    MC:  { x:0.50, y:0.52, label:"MC"  },
    MOC: { x:0.50, y:0.46, label:"MO"  },
    MO:  { x:0.50, y:0.46, label:"MO"  },
    AG:  { x:0.13, y:0.52, label:"MG"  },
    AD:  { x:0.87, y:0.52, label:"MD"  },
    AT:  { x:0.50, y:0.20, label:"AT"  },
    BU:  { x:0.50, y:0.20, label:"AT"  },
  },
  "3-5-2": {
    GK:  { x:0.50, y:0.87, label:"GB"  },
    LG:  { x:0.11, y:0.56, label:"PG"  },
    DG:  { x:0.11, y:0.56, label:"PG"  },
    DC:  { x:0.50, y:0.76, label:"DC"  },
    LD:  { x:0.89, y:0.56, label:"PD"  },
    DD:  { x:0.89, y:0.56, label:"PD"  },
    MDF: { x:0.50, y:0.52, label:"MDF" },
    MDC: { x:0.50, y:0.52, label:"MDF" },
    MC:  { x:0.50, y:0.46, label:"MC"  },
    MOC: { x:0.50, y:0.39, label:"MO"  },
    MO:  { x:0.50, y:0.39, label:"MO"  },
    AG:  { x:0.30, y:0.22, label:"AT"  },
    AD:  { x:0.70, y:0.22, label:"AT"  },
    AT:  { x:0.50, y:0.17, label:"AT"  },
    BU:  { x:0.50, y:0.17, label:"AT"  },
  },
};

function normalizePos(pos: string) { return pos.split("/")[0].trim(); }

// ─── Terrain view ──────────────────────────────────────────────────────────────

function TerrainView({ players, formation }: { players: ShortlistPlayer[]; formation: FormationKey }) {
  const coordMap = FORMATION_COORDS[formation];

  // Build groups: merge players that land on the same pitch coordinate
  const byCoordKey = new Map<string, { coords: PosCoord; players: ShortlistPlayer[] }>();
  const unknown: ShortlistPlayer[] = [];

  for (const p of players) {
    const coords = coordMap[normalizePos(p.position)];
    if (!coords) { unknown.push(p); continue; }
    const key = `${coords.x.toFixed(3)},${coords.y.toFixed(3)}`;
    if (!byCoordKey.has(key)) byCoordKey.set(key, { coords, players: [] });
    byCoordKey.get(key)!.players.push(p);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "820px", minWidth: "1100px", backgroundColor: "#061506", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--color-neutral-800)", boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)" }}>
      {/* Pitch Lines Decoration */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none" }}>
        <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" height="100%" preserveAspectRatio="none">
          <rect x={10} y={10} width={PW-20} height={PH-20} fill="none" stroke="white" strokeWidth={1} />
          <line x1={10} y1={PH/2} x2={PW-10} y2={PH/2} stroke="white" strokeWidth={1} />
          <circle cx={PW/2} cy={PH/2} r={40} fill="none" stroke="white" strokeWidth={1} />
          <rect x={PW/2-60} y={10} width={120} height={80} fill="none" stroke="white" strokeWidth={1} />
          <rect x={PW/2-60} y={PH-90} width={120} height={80} fill="none" stroke="white" strokeWidth={1} />
        </svg>
      </div>

      {/* Position Lists Grid */}
      {Array.from(byCoordKey.values()).map(({ coords, players: group }, groupIdx) => {
        const left = `${coords.x * 100}%`;
        const top = `${coords.y * 100}%`;

        return (
          <div
            key={groupIdx}
            style={{
              position: "absolute",
              left,
              top,
              transform: "translate(-50%, -50%)",
              width: "200px",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.4))"
            }}
          >
            {/* Position Header Label */}
            <div style={{
              backgroundColor: "#C42B47",
              color: "white",
              fontSize: "10px",
              fontWeight: 900,
              padding: "3px 10px",
              borderRadius: "4px 4px 0 0",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              width: "fit-content",
              margin: "0 auto",
              border: "1px solid rgba(255,255,255,0.2)",
              borderBottom: "none"
            }}>
              {coords.label}
            </div>

            {/* List Container */}
            <div style={{
              backgroundColor: "rgba(17, 24, 39, 0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--color-neutral-700)",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              {group.map((p, pIdx) => {
                const rc = RATING_COLOR[p.rating] ?? "#9CA3AF";
                const nc = noteColor(p.note);

                return (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderBottom: pIdx === group.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {/* Player Avatar */}
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-primary-900)",
                      color: "var(--color-primary-300)",
                      fontSize: "10px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: `1.5px solid ${rc}`
                    }}>
                      {p.initials}
                    </div>

                    {/* Name & Age */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "9px", color: "var(--color-neutral-500)", marginTop: "1px" }}>
                        {p.age} ans · {p.club}
                      </div>
                    </div>

                    {/* Note Badge */}
                    <div style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: nc,
                      backgroundColor: `${nc}15`,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: `1px solid ${nc}33`
                    }}>
                      {p.note.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Unmapped Players (Hidden/Bottom) */}
      {unknown.length > 0 && (
        <div style={{ position: "absolute", bottom: "24px", left: "24px", zIndex: 5 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-neutral-500)", marginBottom: "8px", textTransform: "uppercase" }}>Hors Formation ({unknown.length})</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {unknown.map(p => (
              <div key={p.id} style={{ padding: "4px 8px", backgroundColor: "var(--color-neutral-900)", border: "1px solid var(--color-neutral-800)", borderRadius: "4px", fontSize: "10px", color: "var(--color-neutral-400)" }}>
                {p.initials} {p.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function ShortlistsPage() {
  const [activeId,       setActiveId]       = useState("md2025");
  const [viewMode,       setViewMode]       = useState<"liste" | "terrain">("liste");
  const [formation,      setFormation]      = useState<FormationKey>("4-3-3");
  const [formationOpen,  setFormationOpen]  = useState(false);

  const active = SHORTLISTS.find((s) => s.id === activeId) ?? SHORTLISTS[0];

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", backgroundColor: "var(--color-neutral-950)" }}>

      {/* ── Left sidebar ── */}
      <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", backgroundColor: "var(--color-neutral-900)", borderRight: "1px solid var(--color-neutral-700)", overflow: "hidden" }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--color-neutral-700)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-neutral-100)", letterSpacing: "0.02em", textTransform: "uppercase" }}>
            Mes Shortlists
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 10, backgroundColor: "var(--color-neutral-700)", color: "var(--color-neutral-400)" }}>
            {SHORTLISTS.length}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {SHORTLISTS.map((sl) => {
            const isActive = sl.id === activeId;
            return (
              <button
                key={sl.id}
                onClick={() => setActiveId(sl.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", backgroundColor: isActive ? "var(--color-neutral-800)" : "transparent", borderLeft: isActive ? "3px solid #C42B47" : "3px solid transparent", border: "none", textAlign: "left", transition: "background-color 120ms ease" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-800)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{sl.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--color-primary-300)" : "var(--color-neutral-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {sl.name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 10, backgroundColor: "var(--color-neutral-700)", color: isActive ? "var(--color-neutral-300)" : "var(--color-neutral-500)", flexShrink: 0 }}>
                  {sl.count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--color-neutral-700)", flexShrink: 0 }}>
          <button
            style={{ width: "100%", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: "pointer", backgroundColor: "transparent", border: "1px solid #C42B47", color: "#C42B47", transition: "background-color 120ms ease" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,43,71,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <Plus size={13} strokeWidth={2} />
            Nouvelle liste
          </button>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-neutral-700)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, backgroundColor: "var(--color-neutral-900)", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{active.icon}</span>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-neutral-100)", margin: 0 }}>{active.name}</h2>
              <p style={{ fontSize: 11, color: "var(--color-neutral-500)", margin: "2px 0 0" }}>
                {active.players.length} joueur{active.players.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* Formation selector — only in terrain mode */}
            {viewMode === "terrain" && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setFormationOpen((o) => !o)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700, borderRadius: 6, cursor: "pointer", backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-600)", color: "var(--color-neutral-200)", letterSpacing: "0.02em" }}
                >
                  {formation}
                  <ChevronDown size={12} strokeWidth={2.5} style={{ opacity: 0.6, transform: formationOpen ? "rotate(180deg)" : "none", transition: "transform 150ms ease" }} />
                </button>
                {formationOpen && (
                  <div
                    style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-600)", borderRadius: 8, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.45)", minWidth: 110 }}
                    onMouseLeave={() => setFormationOpen(false)}
                  >
                    {FORMATIONS.map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFormation(f); setFormationOpen(false); }}
                        style={{ width: "100%", padding: "9px 14px", fontSize: 12, fontWeight: f === formation ? 700 : 400, textAlign: "left", cursor: "pointer", backgroundColor: f === formation ? "rgba(196,43,71,0.14)" : "transparent", border: "none", color: f === formation ? "#F87191" : "var(--color-neutral-300)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
                        onMouseEnter={(e) => { if (f !== formation) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)"; }}
                        onMouseLeave={(e) => { if (f !== formation) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        {f}
                        {f === formation && (
                          <span style={{ fontSize: 10, color: "#F87191" }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Liste / Terrain toggle */}
            <div style={{ display: "flex", backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", borderRadius: 6, overflow: "hidden" }}>
              {(["liste", "terrain"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", backgroundColor: viewMode === mode ? "#C42B47" : "transparent", color: viewMode === mode ? "white" : "var(--color-neutral-400)", transition: "background-color 120ms ease, color 120ms ease" }}
                >
                  {mode === "liste" ? "Liste" : "Terrain"}
                </button>
              ))}
            </div>

            {/* Add player */}
            <button
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: "pointer", backgroundColor: "#C42B47", border: "none", color: "white", transition: "background-color 120ms ease" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#A8233C")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#C42B47")}
            >
              <Plus size={13} strokeWidth={2.5} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: viewMode === "terrain" ? "20px" : 0 }}>
          {viewMode === "liste"
            ? <ShortlistTable players={active.players} />
            : <TerrainView players={active.players} formation={formation} />
          }
        </div>
      </div>
    </div>
  );
}
