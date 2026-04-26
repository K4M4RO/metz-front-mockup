"use client";

import { useState, useMemo, useCallback } from "react";
import {
  EM_SHOTS, EM_PASSES, EM_PRESSIONS, EM_DUELS, EM_CARRIES, EM_DEFS,
} from "@/data/enzo-millot-events";
import { SEASON_HOTSPOTS, MATCH_HEATMAP_PATTERNS, MATCHES } from "@/data/enzo-millot-extended";
import type { ShotEv, PassEv, PressionEv, DuelEv, CarryEv, DefEv } from "@/data/enzo-millot-events";
import { HeatmapPitch } from "@/components/profile/HeatmapPitch";

// ── Pitch constants ───────────────────────────────────────────────────────────
const VW = 680, VH = 442;
const PA_D = 107, PA_W = 262, PA_Y = (VH - PA_W) / 2;
const GB_D = 35,  GB_W = 119,  GB_Y = (VH - GB_W) / 2;
const CCX = VW / 2, CCY = VH / 2, CCR = 60;
const PSX_L = 72, PSX_R = VW - PSX_L;

// ── Types ─────────────────────────────────────────────────────────────────────
type EventType = "tout" | "tirs" | "passes" | "pressions" | "duels" | "conduites" | "defensives";

// ── Categories (sidebar) ──────────────────────────────────────────────────────
const CATEGORIES: { id: EventType; label: string; icon: string }[] = [
  { id: "tout",        label: "Tout (Positionnement)", icon: "◈" },
  { id: "tirs",        label: "Tirs",               icon: "◎" },
  { id: "passes",      label: "Passes",              icon: "→" },
  { id: "pressions",   label: "Pressions",           icon: "★" },
  { id: "duels",       label: "Duels",               icon: "◆" },
  { id: "conduites",   label: "Conduites",           icon: "↝" },
  { id: "defensives",  label: "Actions Défensives",  icon: "✕" },
];

// ── Match options ─────────────────────────────────────────────────────────────
const MATCH_OPTIONS = [
  { id: "all",        label: "Saison Entière" },
  { id: "psg",        label: "vs PSG (2-0)" },
  { id: "lyon",       label: "vs Lyon (1-1)" },
  { id: "monaco",     label: "vs Monaco (0-1)" },
  { id: "rennes",     label: "vs Rennes (3-1)" },
  { id: "marseille",  label: "vs Marseille (1-0)" },
  { id: "lens",       label: "vs Lens (2-2)" },
  { id: "brest",      label: "vs Brest (1-0)" },
];

// ── Grouped sub-filters ───────────────────────────────────────────────────────
type SFItem = { id: string; label: string };
type SFGroup = { label: string; items: SFItem[] };

const GROUPED_SF: Record<EventType, SFGroup[]> = {
  tirs: [
    { label: "Résultat",  items: [{ id:"but",label:"But" },{ id:"arrete",label:"Arrêté" },{ id:"manque",label:"Manqué" },{ id:"bloque",label:"Bloqué" },{ id:"poteau",label:"Poteau" }] },
    { label: "Pied",      items: [{ id:"D",label:"Pied droit" },{ id:"G",label:"Pied gauche" },{ id:"T",label:"Tête" }] },
    { label: "xG",        items: [{ id:"xg_high",label:"xG ≥ 0.30" },{ id:"xg_med",label:"xG 0.10–0.30" },{ id:"xg_low",label:"xG < 0.10" }] },
  ],
  passes: [
    { label: "Résultat",  items: [{ id:"reussie",label:"Réussie" },{ id:"ratee",label:"Ratée" }] },
    { label: "Distance",  items: [{ id:"courte",label:"Courte <15m" },{ id:"moyenne",label:"Moyenne" },{ id:"longue",label:"Longue >30m" }] },
    { label: "Type",      items: [{ id:"progressive",label:"Progressive" },{ id:"decisive",label:"Décisive" },{ id:"profondeur",label:"En profondeur" }] },
  ],
  pressions: [
    { label: "Résultat",  items: [{ id:"reussie",label:"Réussie" },{ id:"ratee",label:"Ratée" }] },
    { label: "Zone",      items: [{ id:"haute",label:"Haute" },{ id:"basse",label:"Basse" }] },
    { label: "Type",      items: [{ id:"contrepression",label:"Contrepression" }] },
  ],
  duels: [
    { label: "Résultat",  items: [{ id:"gagne",label:"Gagné" },{ id:"perdu",label:"Perdu" }] },
    { label: "Type",      items: [{ id:"aerien",label:"Aérien" },{ id:"sol",label:"Sol" }] },
    { label: "Phase",     items: [{ id:"defensif",label:"Défensif" },{ id:"offensif",label:"Offensif" }] },
  ],
  conduites: [
    { label: "Direction", items: [{ id:"progressive",label:"Progressive" },{ id:"laterale",label:"Latérale" },{ id:"reculee",label:"Reculée" }] },
    { label: "Dribble",   items: [{ id:"dribble_reussi",label:"Réussi" },{ id:"dribble_rate",label:"Raté" }] },
    { label: "Issue",     items: [{ id:"perdue",label:"Perte" }] },
  ],
  defensives: [
    { label: "Tacle",       items: [{ id:"tacle_reussi",label:"Réussi" },{ id:"tacle_rate",label:"Raté" }] },
    { label: "Récupération",items: [{ id:"interception",label:"Interception" },{ id:"recuperation",label:"Récupération" }] },
    { label: "Autre",       items: [{ id:"degagement",label:"Dégagement" },{ id:"faute",label:"Faute provoquée" }] },
  ],
  tout: [],
};

// ── Event counts (for sidebar badges) ────────────────────────────────────────
const EVENT_COUNTS: Record<EventType, number> = {
  tout: 100, // Score de présence global
  tirs: EM_SHOTS.length,
  passes: EM_PASSES.length,
  pressions: EM_PRESSIONS.length,
  duels: EM_DUELS.length,
  conduites: EM_CARRIES.length,
  defensives: EM_DEFS.length,
};

// ── Color maps ────────────────────────────────────────────────────────────────
const SHOT_COLORS: Record<string, string> = {
  but: "#C42B47", arrete: "#D4A017", manque: "#6B7280", bloque: "#D1D5DB", poteau: "#7C3AED",
};
const DEF_COLORS: Record<string, string> = {
  tacle_reussi: "#C42B47", tacle_rate: "#EF4444", interception: "#3B82F6",
  degagement: "#D4A017", recuperation: "#22C55E", faute: "#F59E0B",
};
const CARRY_COLORS: Record<string, string> = {
  progressive: "#C42B47", laterale: "#3B82F6", reculee: "#6B7280",
};

// ── SVG helpers ───────────────────────────────────────────────────────────────
function arrowHead(x1: number, y1: number, x2: number, y2: number, color: string, size = 7) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 2) return null;
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * size, ay = y2 - uy * size;
  return (
    <polygon
      points={`${x2},${y2} ${ax + uy * size * 0.4},${ay - ux * size * 0.4} ${ax - uy * size * 0.4},${ay + ux * size * 0.4}`}
      fill={color} opacity={0.9}
    />
  );
}

function Diamond({ cx, cy, size, fill, stroke = "none" }: { cx:number; cy:number; size:number; fill:string; stroke?:string }) {
  return <polygon points={`${cx},${cy-size} ${cx+size},${cy} ${cx},${cy+size} ${cx-size},${cy}`} fill={fill} stroke={stroke} strokeWidth={1} />;
}

function Star({ cx, cy, r, color }: { cx:number; cy:number; r:number; color:string }) {
  const pts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.48;
    pts.push(`${(cx + radius * Math.cos(a)).toFixed(2)},${(cy + radius * Math.sin(a)).toFixed(2)}`);
  }
  return <polygon points={pts.join(" ")} fill={color} opacity={0.9} />;
}

// ── Pitch base ────────────────────────────────────────────────────────────────
function PitchBase({ zones }: { zones: boolean }) {
  const lc = "rgba(255,255,255,0.20)";
  const lcs = "rgba(255,255,255,0.10)";
  return (
    <g>
      <rect width={VW} height={VH} fill="#0A1A0A" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={i * (VW / 8)} y={0} width={VW / 8} height={VH}
          fill={i % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent"} />
      ))}
      <rect x={1} y={1} width={VW - 2} height={VH - 2} fill="none" stroke={lc} strokeWidth={0.8} />
      <line x1={CCX} y1={1} x2={CCX} y2={VH - 1} stroke={lc} strokeWidth={0.8} />
      <circle cx={CCX} cy={CCY} r={CCR} fill="none" stroke={lc} strokeWidth={0.8} />
      <circle cx={CCX} cy={CCY} r={2.5} fill="rgba(255,255,255,0.25)" />
      <rect x={1} y={PA_Y} width={PA_D} height={PA_W} fill="none" stroke={lc} strokeWidth={0.8} />
      <rect x={1} y={GB_Y} width={GB_D} height={GB_W} fill="none" stroke={lcs} strokeWidth={0.6} />
      <rect x={VW - PA_D - 1} y={PA_Y} width={PA_D} height={PA_W} fill="none" stroke={lc} strokeWidth={0.8} />
      <rect x={VW - GB_D - 1} y={GB_Y} width={GB_D} height={GB_W} fill="none" stroke={lcs} strokeWidth={0.6} />
      <circle cx={PSX_L} cy={CCY} r={1.5} fill="rgba(255,255,255,0.25)" />
      <circle cx={PSX_R} cy={CCY} r={1.5} fill="rgba(255,255,255,0.25)" />
      <text x={VW - 8} y={CCY + 4} textAnchor="end"
        style={{ fill:"rgba(255,255,255,0.15)", fontSize:8, fontFamily:"var(--font-sans)", letterSpacing:"0.05em" }}>
        ATTAQUE →
      </text>
      {zones && (
        <g>
          <line x1={VW*0.333} y1={0} x2={VW*0.333} y2={VH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="5 4" />
          <line x1={VW*0.667} y1={0} x2={VW*0.667} y2={VH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="5 4" />
          <text x={VW*0.333/2} y={14} textAnchor="middle" style={{ fill:"rgba(255,255,255,0.2)", fontSize:8 }}>Défensif</text>
          <text x={VW*0.5}     y={14} textAnchor="middle" style={{ fill:"rgba(255,255,255,0.2)", fontSize:8 }}>Milieu</text>
          <text x={VW*0.333*2.5} y={14} textAnchor="middle" style={{ fill:"rgba(255,255,255,0.2)", fontSize:8 }}>Offensif</text>
        </g>
      )}
    </g>
  );
}

// ── Tooltip type ──────────────────────────────────────────────────────────────
interface TooltipState { x: number; y: number; lines: string[]; }

// ── Event layers ──────────────────────────────────────────────────────────────
function ShotLayer({ shots, onHover, onLeave }: { shots: ShotEv[]; onHover:(e:React.MouseEvent<SVGElement>,l:string[])=>void; onLeave:()=>void }) {
  const goalX = VW, goalY = CCY;
  return (
    <g>
      {shots.map((s) => {
        const cx = s.x * VW, cy = s.y * VH;
        const r = 5 + s.xG * 52;
        const color = SHOT_COLORS[s.tags[0]] ?? "#6B7280";
        const isGoal = s.tags.includes("but");
        const isBlocked = s.tags.includes("bloque");
        const foot = s.foot === "D" ? "Pied droit" : s.foot === "G" ? "Pied gauche" : "Tête";
        const tipLines = [`${s.minute}' · xG ${s.xG.toFixed(2)}`, s.tags[0].charAt(0).toUpperCase() + s.tags[0].slice(1), foot];
        return (
          <g key={s.id} style={{ cursor:"crosshair" }} onMouseEnter={(e)=>onHover(e,tipLines)} onMouseLeave={onLeave}>
            <line x1={cx} y1={cy} x2={goalX * 0.985} y2={goalY} stroke={color} strokeWidth={0.6} opacity={0.2} />
            <circle cx={cx} cy={cy} r={r} fill={isGoal ? color : "transparent"}
              stroke={color} strokeWidth={isBlocked ? 2 : 1.5} opacity={0.85}
              strokeDasharray={isBlocked ? "3 2" : undefined} />
            {isGoal && <circle cx={cx} cy={cy} r={r+4} fill="none" stroke={color} strokeWidth={0.8} opacity={0.3} />}
          </g>
        );
      })}
    </g>
  );
}

function PassLayer({ passes, onHover, onLeave }: { passes: PassEv[]; onHover:(e:React.MouseEvent<SVGElement>,l:string[])=>void; onLeave:()=>void }) {
  return (
    <g>
      {passes.map((p) => {
        const x1=p.x1*VW,y1=p.y1*VH,x2=p.x2*VW,y2=p.y2*VH;
        const ok = p.tags.includes("reussie");
        const isLong = p.tags.includes("longue");
        const isMed = p.tags.includes("moyenne");
        const color = ok ? "#C42B47" : "#EF4444";
        const sw = isLong ? 2 : isMed ? 1.5 : 1;
        const typeLabel = p.tags.filter(t=>!["reussie","ratee"].includes(t)).join(", ");
        return (
          <g key={p.id} style={{ cursor:"crosshair" }} onMouseEnter={(e)=>onHover(e,[`${p.distance}m`, typeLabel||"Passe", ok?"Réussie":"Ratée"])} onMouseLeave={onLeave}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} strokeDasharray={isLong?"5 3":undefined} opacity={0.8} />
            {arrowHead(x1,y1,x2,y2,color,6)}
            <circle cx={x1} cy={y1} r={2.5} fill={color} opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
}

function PressionLayer({ pressions, onHover, onLeave }: { pressions: PressionEv[]; onHover:(e:React.MouseEvent<SVGElement>,l:string[])=>void; onLeave:()=>void }) {
  return (
    <g>
      {pressions.map((p) => {
        const cx=p.x*VW,cy=p.y*VH;
        const isCP=p.tags.includes("contrepression");
        const ok=p.tags.includes("reussie");
        const color=isCP?"#F39C12":ok?"#C42B47":"#6B7280";
        const r=5+p.speed*8;
        const result=isCP?"Contrepression":ok?"Réussie":"Ratée";
        return (
          <g key={p.id} style={{ cursor:"crosshair" }} onMouseEnter={(e)=>onHover(e,[p.x>0.65?"Zone haute":"Zone centrale",result,`${p.minute}'`])} onMouseLeave={onLeave}>
            <Star cx={cx} cy={cy} r={r} color={color} />
            <circle cx={cx} cy={cy} r={r+2} fill="none" stroke={color} strokeWidth={0.5} opacity={0.3} />
          </g>
        );
      })}
    </g>
  );
}

function DuelLayer({ duels, onHover, onLeave }: { duels: DuelEv[]; onHover:(e:React.MouseEvent<SVGElement>,l:string[])=>void; onLeave:()=>void }) {
  return (
    <g>
      {duels.map((d) => {
        const cx=d.x*VW,cy=d.y*VH;
        const won=d.tags.includes("gagne");
        const aerial=d.tags.includes("aerien");
        const color=won?"#C42B47":"#EF4444";
        const cat=d.tags.includes("offensif")?"Offensif":"Défensif";
        return (
          <g key={d.id} style={{ cursor:"crosshair" }} onMouseEnter={(e)=>onHover(e,[`${aerial?"Aérien":"Sol"} · ${cat}`,won?"Gagné":"Perdu",`${d.minute}'`])} onMouseLeave={onLeave}>
            <Diamond cx={cx} cy={cy} size={7} fill={color} stroke={won?"rgba(255,255,255,0.25)":"none"} />
            <text x={cx} y={cy+3} textAnchor="middle" style={{ fill:"white", fontSize:7, fontWeight:700, pointerEvents:"none" }}>
              {aerial ? "↑" : "—"}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function CarryLayer({ carries, onHover, onLeave }: { carries: CarryEv[]; onHover:(e:React.MouseEvent<SVGElement>,l:string[])=>void; onLeave:()=>void }) {
  return (
    <g>
      {carries.map((c) => {
        const x1=c.x1*VW,y1=c.y1*VH,x2=c.x2*VW,y2=c.y2*VH;
        const dir=c.tags.includes("progressive")?"progressive":c.tags.includes("laterale")?"laterale":"reculee";
        const color=CARRY_COLORS[dir];
        const dribble=c.tags.includes("dribble_reussi")||c.tags.includes("dribble_rate");
        const lost=c.tags.includes("perdue");
        const dirLabel=dir.charAt(0).toUpperCase()+dir.slice(1);
        const issue=dribble?(c.tags.includes("dribble_reussi")?"Dribble réussi":"Dribble raté"):(lost?"Perdue":"Conservée");
        return (
          <g key={c.id} style={{ cursor:"crosshair" }} onMouseEnter={(e)=>onHover(e,[dirLabel,`${c.distance}m`,issue])} onMouseLeave={onLeave}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeDasharray={dribble?"4 3":undefined} opacity={0.8} strokeLinecap="round" />
            {arrowHead(x1,y1,x2,y2,color,7)}
            <circle cx={x1} cy={y1} r={3} fill={color} />
            <circle cx={x2} cy={y2} r={3.5} fill={lost?"#EF4444":"#22C55E"} opacity={0.9} />
          </g>
        );
      })}
    </g>
  );
}

function DefLayer({ defs, onHover, onLeave }: { defs: DefEv[]; onHover:(e:React.MouseEvent<SVGElement>,l:string[])=>void; onLeave:()=>void }) {
  const TYPE_LABELS: Record<string,string> = {
    tacle_reussi:"Tacle réussi",tacle_rate:"Tacle raté",interception:"Interception",
    degagement:"Dégagement",recuperation:"Récupération",faute:"Faute provoquée",
  };
  return (
    <g>
      {defs.map((d) => {
        const cx=d.x*VW,cy=d.y*VH;
        const type=d.tags[0];
        const color=DEF_COLORS[type]??"#6B7280";
        const s=4+d.importance*5;
        return (
          <g key={d.id} style={{ cursor:"crosshair" }} onMouseEnter={(e)=>onHover(e,[TYPE_LABELS[type]??type,`${d.minute}'`])} onMouseLeave={onLeave}>
            <circle cx={cx} cy={cy} r={s+4} fill={color} opacity={0.12} />
            <line x1={cx-s} y1={cy-s} x2={cx+s} y2={cy+s} stroke={color} strokeWidth={2} strokeLinecap="round" />
            <line x1={cx+s} y1={cy-s} x2={cx-s} y2={cy+s} stroke={color} strokeWidth={2} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

// ── Legend definitions ────────────────────────────────────────────────────────
const LEGENDS: Record<EventType, { color:string; label:string; shape?:"circle"|"diamond"|"star"|"line" }[]> = {
  tirs: [
    { color:"#C42B47",label:"But" },
    { color:"#D4A017",label:"Arrêté" },
    { color:"#6B7280",label:"Manqué" },
    { color:"#7C3AED",label:"Poteau" },
    { color:"#D1D5DB",label:"Bloqué" },
  ],
  passes: [
    { color:"#C42B47",label:"Réussie",shape:"line" },
    { color:"#EF4444",label:"Ratée",shape:"line" },
  ],
  pressions: [
    { color:"#C42B47",label:"Réussie",shape:"star" },
    { color:"#6B7280",label:"Ratée",shape:"star" },
    { color:"#F39C12",label:"Contrepression",shape:"star" },
  ],
  duels: [
    { color:"#C42B47",label:"Gagné",shape:"diamond" },
    { color:"#EF4444",label:"Perdu",shape:"diamond" },
  ],
  conduites: [
    { color:"#C42B47",label:"Progressive",shape:"line" },
    { color:"#3B82F6",label:"Latérale",shape:"line" },
    { color:"#6B7280",label:"Reculée",shape:"line" },
  ],
  defensives: Object.entries(DEF_COLORS).map(([k,c]) => ({
    color: c,
    label: { tacle_reussi:"Tacle réussi",tacle_rate:"Tacle raté",interception:"Interception",degagement:"Dégagement",recuperation:"Récupération",faute:"Faute" }[k] ?? k,
  })),
  tout: [
    { color: "#C42B47", label: "Haute intensité" },
    { color: "#1E3A5F", label: "Zone de couverture" },
  ],
};

// ── Pill component ────────────────────────────────────────────────────────────
function Pill({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 10,
        cursor: "pointer",
        whiteSpace: "nowrap",
        backgroundColor: active ? "rgba(var(--primary-rgb), 0.2)" : "var(--color-neutral-700)",
        border: `1px solid ${active ? "rgba(var(--primary-rgb), 0.5)" : "var(--color-neutral-600)"}`,
        color: active ? "var(--color-primary-400)" : "var(--color-neutral-300)",
        transition: "all 0.15s",
        fontFamily: "var(--font-sans)",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function EventMap() {
  const [eventType,    setEventType]    = useState<EventType>("tout");
  const [matchFilter,  setMatchFilter]  = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [activeSF,     setActiveSF]     = useState<Set<string>>(new Set());
  const [zoneOverlay,  setZoneOverlay]  = useState(false);
  const [tooltip,      setTooltip]      = useState<TooltipState | null>(null);

  const handleTypeChange = useCallback((t: EventType) => {
    setEventType(t);
    setActiveSF(new Set());
  }, []);

  const toggleSF = useCallback((id: string) => {
    setActiveSF((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const applyFilters = useCallback(<T extends { tags: string[] }>(arr: T[]): T[] =>
    arr.filter(e => activeSF.size === 0 || e.tags.some(t => activeSF.has(t))),
  [activeSF]);

  const filteredCount = useMemo(() => {
    switch (eventType) {
      case "tout":       return 100;
      case "tirs":       return applyFilters(EM_SHOTS).length;
      case "passes":     return applyFilters(EM_PASSES).length;
      case "pressions":  return applyFilters(EM_PRESSIONS).length;
      case "duels":      return applyFilters(EM_DUELS).length;
      case "conduites":  return applyFilters(EM_CARRIES).length;
      case "defensives": return applyFilters(EM_DEFS).length;
    }
  }, [eventType, applyFilters]);

  const onHover = useCallback((e: React.MouseEvent<SVGElement>, lines: string[]) => {
    const rect = (e.currentTarget.closest("svg") as SVGElement)?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, lines });
  }, []);
  const onLeave = useCallback(() => setTooltip(null), []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 220px 1fr",
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
        borderRadius: 12,
        overflow: "hidden",
        minHeight: 520,
      }}
    >
      {/* ── Left Sidebar ── */}
      <div style={{ borderRight: "1px solid var(--color-neutral-700)", display:"flex", flexDirection:"column" }}>
        {/* Sidebar header */}
        <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid var(--color-neutral-700)" }}>
          <span style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--color-neutral-500)" }}>
            Catégorie
          </span>
        </div>

        {/* Category nav */}
        <nav style={{ flex:1, paddingTop:6, paddingBottom:6 }}>
          {CATEGORIES.map((cat) => {
            const active = eventType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTypeChange(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 16px",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  borderLeft: active ? "2px solid #C42B47" : "2px solid transparent",
                  backgroundColor: active ? "rgba(var(--primary-rgb), 0.12)" : "transparent",
                  color: active ? "var(--color-primary-400)" : "var(--color-neutral-400)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                <span style={{ fontSize:14, opacity: active ? 1 : 0.6, color: active ? "#C42B47" : "currentColor", width:16, textAlign:"center", flexShrink:0 }}>
                  {cat.icon}
                </span>
                <span style={{ fontSize:12, fontWeight: active ? 600 : 400, flex:1 }}>
                  {cat.label}
                </span>
                <span style={{
                  fontSize:10, fontWeight:600,
                  padding:"1px 6px", borderRadius:999,
                  backgroundColor: active ? "rgba(var(--primary-rgb), 0.25)" : "var(--bg-surface-raised)",
                  color: active ? "var(--color-primary-400)" : "var(--color-neutral-600)",
                }}>
                  {EVENT_COUNTS[cat.id]}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Legend (Moved back) */}
        <div style={{ padding:"14px 16px", borderTop:"1px solid var(--color-neutral-700)", flexShrink: 0, backgroundColor: "rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--color-neutral-500)", marginBottom: 10 }}>
            Légende
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {LEGENDS[eventType].map((item) => (
              <div key={item.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                {item.shape === "diamond" ? (
                  <svg width={10} height={10} viewBox="0 0 10 10">
                    <polygon points="5,0 10,5 5,10 0,5" fill={item.color} />
                  </svg>
                ) : item.shape === "star" ? (
                  <svg width={10} height={10} viewBox="0 0 10 10">
                    <polygon points="5,0 6.2,3.8 10,3.8 7,6 8.1,10 5,7.5 1.9,10 3,6 0,3.8 3.8,3.8" fill={item.color} />
                  </svg>
                ) : item.shape === "line" ? (
                  <svg width={14} height={10} viewBox="0 0 14 10">
                    <line x1={0} y1={5} x2={14} y2={5} stroke={item.color} strokeWidth={2} />
                    <polygon points="14,5 10,3 10,7" fill={item.color} />
                  </svg>
                ) : (
                  <span style={{ width:8, height:8, borderRadius:"50%", backgroundColor:item.color, display:"inline-block" }} />
                )}
                <span style={{ fontSize:10, color:"var(--color-neutral-300)", fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
            {eventType === "tirs" && (
              <span style={{ fontSize:9, color:"var(--color-neutral-500)", fontStyle: "italic", marginTop: 2 }}>Taille = xG</span>
            )}
          </div>
        </div>
      </div>



      {/* ── Column 2: Match & Advanced Filters ── */}
      <div style={{ display:"flex", flexDirection:"column", borderRight:"1px solid var(--color-neutral-700)", backgroundColor: "rgba(0,0,0,0.05)" }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--color-neutral-700)" }}>
          <div style={{ fontSize:9, color:"var(--color-neutral-500)", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Match / Période</div>
          <div style={{ position:"relative" }}>
            <select
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              style={{
                width:"100%", appearance:"none", padding:"6px 28px 6px 10px", borderRadius:6,
                backgroundColor:"var(--color-neutral-700)", border:"1px solid var(--color-neutral-600)",
                color:"var(--color-neutral-200)", fontSize:11, cursor:"pointer",
              }}
            >
              {MATCH_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <span style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--color-neutral-500)", fontSize:9 }}>▼</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
          {eventType !== "tout" ? (
            <>
              <div style={{ fontSize:9, color:"var(--color-neutral-500)", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Filtres Avancés</div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {GROUPED_SF[eventType].map((group) => (
                  <div key={group.label} style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <span style={{ fontSize:9, color:"var(--color-neutral-600)", fontWeight:700 }}>{group.label}</span>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {group.items.map(item => (
                        <Pill key={item.id} label={item.label} active={activeSF.has(item.id)} onClick={() => toggleSF(item.id)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {activeSF.size > 0 && (
                <button
                  onClick={() => setActiveSF(new Set())}
                  style={{
                    marginTop:16, width:"100%", padding:"5px", borderRadius:4, fontSize:10,
                    backgroundColor:"transparent", border:"1px solid var(--color-neutral-700)",
                    color:"var(--color-neutral-500)", cursor:"pointer"
                  }}
                >
                  Réinitialiser
                </button>
              )}
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:42, fontWeight:900, color:"#C42B47", fontFamily:"var(--font-dm-sans)" }}>8.4</div>
              <div style={{ fontSize:10, color:"var(--color-neutral-500)", textTransform:"uppercase" }}>Indice de présence</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main area: Pitch ── */}
      <div style={{ display:"flex", flexDirection:"column", flex: 1 }}>
        <div style={{
          padding:"10px 16px", borderBottom: "1px solid var(--color-neutral-700)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:9, color:"var(--color-neutral-500)", textTransform:"uppercase" }}>Rendu tactique</div>
            <button
              onClick={() => setZoneOverlay(v => !v)}
              style={{
                display:"flex", alignItems:"center", gap:4, padding:"4px 8px", borderRadius:4,
                backgroundColor: zoneOverlay ? "rgba(var(--primary-rgb), 0.1)" : "var(--color-neutral-700)",
                border:`1px solid ${zoneOverlay ? "rgba(var(--primary-rgb), 0.3)" : "var(--color-neutral-600)"}`,
                color: zoneOverlay ? "var(--color-primary-400)" : "var(--color-neutral-500)",
                fontSize:10, cursor:"pointer",
              }}
            >
              Afficher Zones
            </button>
          </div>

          <div style={{ fontSize:12, fontWeight:700, color:"#C42B47", fontFamily:"var(--font-dm-sans)" }}>
            {eventType === "tout" ? "8.4 / 10" : `${filteredCount} / ${EVENT_COUNTS[eventType]}`}
            <span style={{ fontSize:9, color:"var(--color-neutral-500)", fontWeight:400, marginLeft:6, textTransform:"uppercase" }}>Événements</span>
          </div>
        </div>



        {/* Pitch area */}
        <div style={{ position:"relative", flex:1 }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width:"100%", display:"block", maxHeight: 480 }}
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip(t => t ? { ...t, x:e.clientX-rect.left, y:e.clientY-rect.top } : null);
            }}
            onMouseLeave={onLeave}
          >
            {eventType === "tout" && (
               <foreignObject x="0" y="0" width={VW} height={VH}>
                  <div style={{ width: "100%", height: "100%", padding: 0 }}>
                    <HeatmapPitch 
                      hotspots={matchFilter === 'all' 
                        ? SEASON_HOTSPOTS 
                        : MATCH_HEATMAP_PATTERNS[Math.abs(matchFilter.split('').reduce((a,b)=>a+b.charCodeAt(0),0)) % MATCH_HEATMAP_PATTERNS.length] || SEASON_HOTSPOTS
                      } 
                      width={VW} 
                      idPrefix="event-tout" 
                    />
                  </div>
               </foreignObject>
            )}
            {eventType !== "tout" && <PitchBase zones={zoneOverlay} />}
            {eventType === "tirs"       && <ShotLayer      shots={applyFilters(EM_SHOTS)}       onHover={onHover} onLeave={onLeave} />}
            {eventType === "passes"     && <PassLayer      passes={applyFilters(EM_PASSES)}     onHover={onHover} onLeave={onLeave} />}
            {eventType === "pressions"  && <PressionLayer  pressions={applyFilters(EM_PRESSIONS)} onHover={onHover} onLeave={onLeave} />}
            {eventType === "duels"      && <DuelLayer      duels={applyFilters(EM_DUELS)}       onHover={onHover} onLeave={onLeave} />}
            {eventType === "conduites"  && <CarryLayer     carries={applyFilters(EM_CARRIES)}   onHover={onHover} onLeave={onLeave} />}
            {eventType === "defensives" && <DefLayer       defs={applyFilters(EM_DEFS)}         onHover={onHover} onLeave={onLeave} />}
          </svg>

          {tooltip && (
            <div style={{
              position:"absolute",
              left: Math.min(tooltip.x + 14, 320),
              top: Math.max(tooltip.y - 58, 4),
              backgroundColor:"#13131A",
              border:"1px solid #C42B47",
              borderRadius:7,
              padding:"7px 12px",
              pointerEvents:"none",
              zIndex:50,
              whiteSpace:"nowrap",
              boxShadow:"0 4px 16px rgba(0,0,0,0.6)",
            }}>
              {tooltip.lines.map((l, i) => (
                <p key={i} style={{
                  color: i===0 ? "white" : "var(--color-neutral-400)",
                  fontSize: i===0 ? 11 : 10,
                  fontWeight: i===0 ? 600 : 400,
                  marginBottom: i < tooltip.lines.length-1 ? 3 : 0,
                }}>
                  {l}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
