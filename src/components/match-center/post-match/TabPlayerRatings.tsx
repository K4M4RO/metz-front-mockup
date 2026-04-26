"use client";

import { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { PitchSVG } from "./PitchSVG";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatRow {
  label: string;
  season: number;
  match: number;
  max: number;
  higherIsBetter: boolean;
}

interface HeatZone {
  x: number; // 0–1 relative to pitch width
  y: number; // 0–1 relative to pitch height
  r: number; // blob radius 0–1 relative
  intensity: number; // 0–1
}

interface PlayerEval {
  id: number;
  number: number;
  name: string;
  shortName: string;
  position: string;
  posLabel: string;
  minutesPlayed: number;
  rating: number;
  comment: string;
  stats: StatRow[];
  heat: HeatZone[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PLAYERS: PlayerEval[] = [
  {
    id: 1, number: 61, name: "Pape Mamadou Sy", shortName: "P.M. Sy",
    position: "Gardien", posLabel: "GB", minutesPlayed: 90, rating: 5.5,
    comment: "Peu sollicité en 1ère mi-temps mais fautif sur le 3e but adverse — mauvaise relance dans les pieds de Kebbal.",
    stats: [
      { label: "Arrêts", season: 2.8, match: 3, max: 6, higherIsBetter: true },
      { label: "Sorties aériennes", season: 1.4, match: 0, max: 4, higherIsBetter: true },
      { label: "Passes longues réussies", season: 4.1, match: 2, max: 8, higherIsBetter: true },
      { label: "% passes réussies", season: 71, match: 58, max: 100, higherIsBetter: true },
      { label: "Relances sous pression", season: 1.2, match: 3, max: 5, higherIsBetter: false },
    ],
    heat: [
      { x: 0.50, y: 0.93, r: 0.18, intensity: 1.0 },
      { x: 0.40, y: 0.87, r: 0.10, intensity: 0.5 },
      { x: 0.60, y: 0.87, r: 0.10, intensity: 0.5 },
    ],
  },
  {
    id: 2, number: 15, name: "Terry Yegbe", shortName: "T. Yegbe",
    position: "Défenseur central G", posLabel: "DCG", minutesPlayed: 74, rating: 5.0,
    comment: "Défense individuelle correcte mais sortie prématurée. A perdu son duel sur le 2e but.",
    stats: [
      { label: "Duels défensifs gagnés", season: 3.2, match: 1, max: 8, higherIsBetter: true },
      { label: "1v1 défensifs réussis", season: 0.5, match: 0, max: 3, higherIsBetter: true },
      { label: "Duels aériens gagnés", season: 1.3, match: 2, max: 5, higherIsBetter: true },
      { label: "Interceptions", season: 4.3, match: 5, max: 8, higherIsBetter: true },
      { label: "Récupérations", season: 9.3, match: 9, max: 15, higherIsBetter: true },
      { label: "Fautes", season: 0.9, match: 0, max: 4, higherIsBetter: false },
      { label: "Pertes de balle ds camp", season: 2.6, match: 1, max: 6, higherIsBetter: false },
      { label: "Passes longues réussies", season: 3.2, match: 1, max: 7, higherIsBetter: true },
      { label: "Passes progressives", season: 9.8, match: 8, max: 14, higherIsBetter: true },
    ],
    heat: [
      { x: 0.33, y: 0.83, r: 0.16, intensity: 1.0 },
      { x: 0.25, y: 0.75, r: 0.10, intensity: 0.7 },
      { x: 0.42, y: 0.70, r: 0.08, intensity: 0.4 },
    ],
  },
  {
    id: 3, number: 38, name: "Sadibou Sané", shortName: "S. Sané",
    position: "Défenseur central D", posLabel: "DCD", minutesPlayed: 90, rating: 6.5,
    comment: "Solide défensivement. Bonne lecture sur les centres. A bien géré Immobile dans la surface.",
    stats: [
      { label: "Duels défensifs gagnés", season: 3.8, match: 5, max: 8, higherIsBetter: true },
      { label: "1v1 défensifs réussis", season: 0.7, match: 1, max: 3, higherIsBetter: true },
      { label: "Duels aériens gagnés", season: 2.1, match: 3, max: 5, higherIsBetter: true },
      { label: "Interceptions", season: 3.9, match: 4, max: 8, higherIsBetter: true },
      { label: "Récupérations", season: 8.7, match: 11, max: 15, higherIsBetter: true },
      { label: "Fautes", season: 1.1, match: 1, max: 4, higherIsBetter: false },
      { label: "Pertes de balle ds camp", season: 1.9, match: 2, max: 6, higherIsBetter: false },
      { label: "Passes progressives", season: 7.2, match: 9, max: 14, higherIsBetter: true },
    ],
    heat: [
      { x: 0.65, y: 0.83, r: 0.16, intensity: 1.0 },
      { x: 0.72, y: 0.74, r: 0.10, intensity: 0.6 },
      { x: 0.55, y: 0.70, r: 0.08, intensity: 0.4 },
    ],
  },
  {
    id: 4, number: 4, name: "Urie-Michel Mboula", shortName: "U. Mboula",
    position: "Latéral gauche", posLabel: "LG", minutesPlayed: 57, rating: 4.5,
    comment: "Carton jaune tôt (13') qui a pesé sur sa prise de risque. Remplacé à la mi-temps suite à un manque de disponibilité offensive.",
    stats: [
      { label: "Duels défensifs gagnés", season: 2.4, match: 1, max: 6, higherIsBetter: true },
      { label: "Duels offensifs gagnés", season: 1.8, match: 0, max: 5, higherIsBetter: true },
      { label: "Centres réussis", season: 1.2, match: 0, max: 4, higherIsBetter: true },
      { label: "Passes progressives", season: 6.4, match: 3, max: 12, higherIsBetter: true },
      { label: "Fautes", season: 1.3, match: 2, max: 4, higherIsBetter: false },
      { label: "Pertes de balle", season: 3.1, match: 4, max: 8, higherIsBetter: false },
    ],
    heat: [
      { x: 0.12, y: 0.78, r: 0.14, intensity: 1.0 },
      { x: 0.08, y: 0.62, r: 0.10, intensity: 0.8 },
      { x: 0.15, y: 0.50, r: 0.07, intensity: 0.4 },
    ],
  },
  {
    id: 5, number: 39, name: "Koffi Franck Kouao", shortName: "K. Kouao",
    position: "Latéral droit", posLabel: "LD", minutesPlayed: 90, rating: 6.0,
    comment: "Bonne présence défensive côté droit. A limité l'impact de Koleosho. Quelques montées intéressantes en 2e mi-temps.",
    stats: [
      { label: "Duels défensifs gagnés", season: 2.9, match: 4, max: 6, higherIsBetter: true },
      { label: "Duels offensifs gagnés", season: 1.5, match: 1, max: 5, higherIsBetter: true },
      { label: "Centres réussis", season: 1.0, match: 1, max: 4, higherIsBetter: true },
      { label: "Passes progressives", season: 5.8, match: 7, max: 12, higherIsBetter: true },
      { label: "Fautes", season: 1.5, match: 2, max: 4, higherIsBetter: false },
    ],
    heat: [
      { x: 0.88, y: 0.78, r: 0.14, intensity: 1.0 },
      { x: 0.92, y: 0.62, r: 0.10, intensity: 0.7 },
      { x: 0.82, y: 0.48, r: 0.08, intensity: 0.4 },
    ],
  },
  {
    id: 6, number: 20, name: "Jessy Deminguet", shortName: "J. Deminguet",
    position: "MDC gauche", posLabel: "MDC", minutesPlayed: 74, rating: 5.5,
    comment: "Influence limitée sur la construction. A perdu trop de duels au milieu contre Chergui et Matondo.",
    stats: [
      { label: "Passes progressives", season: 11.2, match: 7, max: 18, higherIsBetter: true },
      { label: "Duels milieu gagnés", season: 4.7, match: 2, max: 9, higherIsBetter: true },
      { label: "Récupérations", season: 7.3, match: 5, max: 12, higherIsBetter: true },
      { label: "Passes clés", season: 1.8, match: 1, max: 5, higherIsBetter: true },
      { label: "Pertes de balle", season: 4.2, match: 5, max: 9, higherIsBetter: false },
      { label: "Fautes commises", season: 1.4, match: 2, max: 5, higherIsBetter: false },
    ],
    heat: [
      { x: 0.38, y: 0.70, r: 0.13, intensity: 1.0 },
      { x: 0.45, y: 0.60, r: 0.09, intensity: 0.6 },
      { x: 0.30, y: 0.62, r: 0.08, intensity: 0.5 },
    ],
  },
  {
    id: 7, number: 5, name: "Jean-Philippe Gbamin", shortName: "JP. Gbamin",
    position: "MDC droit", posLabel: "MDC", minutesPlayed: 90, rating: 6.5,
    comment: "Solide récupérateur. A compensé les lacunes de Deminguet. Meilleur passeur du milieu de terrain ce soir.",
    stats: [
      { label: "Passes progressives", season: 10.4, match: 12, max: 18, higherIsBetter: true },
      { label: "Duels milieu gagnés", season: 5.1, match: 6, max: 9, higherIsBetter: true },
      { label: "Récupérations", season: 8.0, match: 10, max: 12, higherIsBetter: true },
      { label: "Passes clés", season: 1.6, match: 2, max: 5, higherIsBetter: true },
      { label: "Pertes de balle", season: 3.5, match: 3, max: 9, higherIsBetter: false },
      { label: "Fautes commises", season: 1.8, match: 1, max: 5, higherIsBetter: false },
    ],
    heat: [
      { x: 0.62, y: 0.70, r: 0.13, intensity: 1.0 },
      { x: 0.70, y: 0.60, r: 0.09, intensity: 0.6 },
      { x: 0.52, y: 0.58, r: 0.08, intensity: 0.5 },
    ],
  },
  {
    id: 8, number: 7, name: "Georgiy Tsitaishvili", shortName: "G. Tsitaishvili",
    position: "Ailier gauche", posLabel: "AG", minutesPlayed: 90, rating: 7.0,
    comment: "Le plus actif offensivement. 3 dribbles réussis, 2 tirs. A créé le plus de danger dans l'axe gauche.",
    stats: [
      { label: "Dribbles réussis", season: 2.1, match: 3, max: 6, higherIsBetter: true },
      { label: "Passes clés", season: 1.4, match: 2, max: 5, higherIsBetter: true },
      { label: "Centres réussis", season: 0.9, match: 1, max: 4, higherIsBetter: true },
      { label: "Tirs cadrés", season: 0.8, match: 1, max: 4, higherIsBetter: true },
      { label: "Duels offensifs gagnés", season: 2.6, match: 4, max: 7, higherIsBetter: true },
      { label: "Pertes de balle", season: 3.8, match: 3, max: 8, higherIsBetter: false },
    ],
    heat: [
      { x: 0.15, y: 0.58, r: 0.13, intensity: 1.0 },
      { x: 0.22, y: 0.45, r: 0.12, intensity: 0.9 },
      { x: 0.10, y: 0.35, r: 0.09, intensity: 0.6 },
    ],
  },
  {
    id: 9, number: 10, name: "Gauthier Hein", shortName: "G. Hein",
    position: "Milieu offensif", posLabel: "MO", minutesPlayed: 90, rating: 5.0,
    comment: "Peu présent entre les lignes. A raté 2 occasions nettes dont une face au gardien. Déchet technique élevé.",
    stats: [
      { label: "Dribbles réussis", season: 1.8, match: 0, max: 5, higherIsBetter: true },
      { label: "Passes clés", season: 2.3, match: 1, max: 6, higherIsBetter: true },
      { label: "Tirs cadrés", season: 1.2, match: 0, max: 5, higherIsBetter: true },
      { label: "Passes progressives", season: 8.9, match: 6, max: 14, higherIsBetter: true },
      { label: "Pertes de balle", season: 4.1, match: 6, max: 9, higherIsBetter: false },
      { label: "xA (expected assists)", season: 0.18, match: 0.04, max: 0.6, higherIsBetter: true },
    ],
    heat: [
      { x: 0.50, y: 0.60, r: 0.13, intensity: 0.9 },
      { x: 0.40, y: 0.48, r: 0.10, intensity: 0.7 },
      { x: 0.60, y: 0.45, r: 0.09, intensity: 0.6 },
    ],
  },
  {
    id: 10, number: 34, name: "Nathan Mbala", shortName: "N. Mbala",
    position: "Ailier droit", posLabel: "AD", minutesPlayed: 74, rating: 5.5,
    comment: "Discret dans le couloir droit. Difficultés à éliminer face à un Hamari Traoré en grande forme.",
    stats: [
      { label: "Dribbles réussis", season: 1.9, match: 1, max: 6, higherIsBetter: true },
      { label: "Centres réussis", season: 1.1, match: 0, max: 4, higherIsBetter: true },
      { label: "Passes clés", season: 1.2, match: 1, max: 5, higherIsBetter: true },
      { label: "Duels offensifs gagnés", season: 2.2, match: 1, max: 7, higherIsBetter: true },
      { label: "Pertes de balle", season: 3.3, match: 4, max: 8, higherIsBetter: false },
    ],
    heat: [
      { x: 0.85, y: 0.58, r: 0.13, intensity: 1.0 },
      { x: 0.78, y: 0.46, r: 0.10, intensity: 0.6 },
      { x: 0.90, y: 0.40, r: 0.08, intensity: 0.4 },
    ],
  },
  {
    id: 11, number: 30, name: "Habib Diallo", shortName: "H. Diallo",
    position: "Avant-centre", posLabel: "AC", minutesPlayed: 30, rating: 6.0,
    comment: "But décisif à la 31' sur un beau mouvement collectif. Sorti tôt sur blessure — à surveiller.",
    stats: [
      { label: "Tirs cadrés", season: 1.4, match: 1, max: 4, higherIsBetter: true },
      { label: "Buts", season: 0.42, match: 1, max: 2, higherIsBetter: true },
      { label: "Duels offensifs gagnés", season: 3.2, match: 2, max: 7, higherIsBetter: true },
      { label: "Passes clés", season: 0.9, match: 0, max: 4, higherIsBetter: true },
      { label: "xG (expected goals)", season: 0.35, match: 0.48, max: 1.5, higherIsBetter: true },
    ],
    heat: [
      { x: 0.50, y: 0.48, r: 0.13, intensity: 1.0 },
      { x: 0.42, y: 0.38, r: 0.08, intensity: 0.5 },
      { x: 0.58, y: 0.36, r: 0.07, intensity: 0.4 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ratingColor(r: number): string {
  if (r >= 7.5) return "#22c55e";
  if (r >= 6.5) return "#84cc16";
  if (r >= 5.5) return "#eab308";
  if (r >= 4.5) return "#f97316";
  return "#ef4444";
}

function ratingBg(r: number): string {
  if (r >= 7.5) return "rgba(34,197,94,0.12)";
  if (r >= 6.5) return "rgba(132,204,22,0.12)";
  if (r >= 5.5) return "rgba(234,179,8,0.12)";
  if (r >= 4.5) return "rgba(249,115,22,0.12)";
  return "rgba(239,68,68,0.12)";
}

// ─── SVG Heatmap ──────────────────────────────────────────────────────────────

function HeatmapOverlay({ zones, W, H }: { zones: HeatZone[]; W: number; H: number }) {
  const pad = 16;
  const IW = W - 2 * pad;
  const IH = H - 2 * pad;

  return (
    <>
      <defs>
        {zones.map((z, i) => {
          const cx = pad + z.x * IW;
          const cy = pad + z.y * IH;
          const r = z.r * Math.min(IW, IH);
          const id = `hg-${i}`;
          return (
            <radialGradient key={id} id={id} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={z.intensity > 0.7 ? "#ff2200" : z.intensity > 0.4 ? "#ff8800" : "#ffee00"} stopOpacity={z.intensity * 0.85} />
              <stop offset="40%"  stopColor={z.intensity > 0.7 ? "#ff6600" : "#ffcc00"} stopOpacity={z.intensity * 0.5} />
              <stop offset="100%" stopColor="#00cc44" stopOpacity={0} />
            </radialGradient>
          );
        })}
      </defs>
      {zones.map((z, i) => {
        const cx = pad + z.x * IW;
        const cy = pad + z.y * IH;
        const r = z.r * Math.min(IW, IH);
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.85} fill={`url(#hg-${i})`} />
        );
      })}
    </>
  );
}

// ─── Bilateral Bar Row ────────────────────────────────────────────────────────

function BilateralRow({ row }: { row: StatRow }) {
  const seasonPct = Math.min(row.season / row.max, 1);
  const matchPct  = Math.min(row.match  / row.max, 1);

  // Which side is "better"?
  const seasonBetter = row.higherIsBetter ? row.season > row.match : row.season < row.match;
  const matchBetter  = row.higherIsBetter ? row.match > row.season : row.match < row.season;
  const equal        = row.season === row.match;

  const GREEN  = "#22c55e";
  const GREY   = "var(--color-neutral-700)";
  const DIMBAR = "var(--color-neutral-800)";

  const seasonColor = equal ? GREY : seasonBetter ? GREEN : GREY;
  const matchColor  = equal ? GREY : matchBetter  ? GREEN : GREY;
  const seasonValBg = equal ? "transparent" : seasonBetter ? "rgba(34,197,94,0.15)" : "transparent";
  const matchValBg  = equal ? "transparent" : matchBetter  ? "rgba(34,197,94,0.15)" : "transparent";
  const seasonValColor = seasonBetter ? GREEN : "var(--color-neutral-400)";
  const matchValColor  = matchBetter  ? GREEN : "var(--color-neutral-400)";

  const seasonDisplay = Number.isInteger(row.season) ? row.season : row.season.toFixed(1);
  const matchDisplay  = Number.isInteger(row.match)  ? row.match  : row.match.toFixed(2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "52px 1fr auto 1fr 52px", alignItems: "center", gap: 6, padding: "4px 0" }}>
      {/* Season value */}
      <div style={{
        textAlign: "right", fontSize: 12, fontWeight: 700,
        color: seasonValColor, background: seasonValBg,
        borderRadius: 4, padding: "1px 6px",
      }}>
        {seasonDisplay}
      </div>

      {/* Season bar (right-aligned) */}
      <div style={{ height: 6, background: DIMBAR, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${seasonPct * 100}%`,
          background: seasonColor, borderRadius: 3,
          marginLeft: "auto",
        }} />
      </div>

      {/* Label */}
      <div style={{ fontSize: 10, color: "var(--color-neutral-400)", textAlign: "center", whiteSpace: "nowrap", minWidth: 140, maxWidth: 160 }}>
        {row.label}
      </div>

      {/* Match bar (left-aligned) */}
      <div style={{ height: 6, background: DIMBAR, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${matchPct * 100}%`,
          background: matchColor, borderRadius: 3,
        }} />
      </div>

      {/* Match value */}
      <div style={{
        textAlign: "left", fontSize: 12, fontWeight: 700,
        color: matchValColor, background: matchValBg,
        borderRadius: 4, padding: "1px 6px",
      }}>
        {matchDisplay}
      </div>
    </div>
  );
}

// ─── Player Detail View ───────────────────────────────────────────────────────

const PW = 180;
const PH = 280;

function PlayerDetail({ player, onBack }: { player: PlayerEval; onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 24px",
        borderBottom: "1px solid var(--color-neutral-800)", flexShrink: 0,
        background: "var(--color-neutral-900)",
      }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: 6,
            background: "var(--color-neutral-800)", border: "none", cursor: "pointer",
            color: "var(--color-neutral-300)", fontSize: 11, fontWeight: 600,
          }}
        >
          <ArrowLeft size={13} /> Retour
        </button>

        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "var(--color-neutral-800)",
          border: "2px solid var(--color-primary-500)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 900, color: "var(--color-primary-400)",
        }}>
          {player.number}
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--color-neutral-100)" }}>{player.name}</div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>{player.position} · {player.minutesPlayed}' joués</div>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: ratingColor(player.rating), lineHeight: 1 }}>
            {player.rating.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Note</div>
        </div>
      </div>

      {/* Body — scroll */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }} className="custom-scrollbar">

        {/* Comment */}
        <div style={{
          padding: "10px 14px", borderRadius: 8, marginBottom: 20,
          background: "var(--color-neutral-900)",
          border: "1px solid var(--color-neutral-800)",
          fontSize: 12, color: "var(--color-neutral-300)", lineHeight: 1.6,
          borderLeft: `3px solid ${ratingColor(player.rating)}`,
        }}>
          {player.comment}
        </div>

        {/* Two-column layout: bars + heatmap */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* Bilateral bars */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "52px 1fr auto 1fr 52px", gap: 6, marginBottom: 8 }}>
              <div style={{ textAlign: "right", fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", paddingRight: 6 }}>
                Moy. / 90' saison
              </div>
              <div />
              <div />
              <div />
              <div style={{ textAlign: "left", fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", paddingLeft: 6 }}>
                Ce match
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {player.stats.map((row, i) => (
                <BilateralRow key={i} row={row} />
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, textAlign: "center" }}>
              Zones d'activité
            </div>
            <div style={{ position: "relative" }}>
              <PitchSVG width={PW} height={PH}>
                <HeatmapOverlay zones={player.heat} W={PW} H={PH} />
              </PitchSVG>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Player Card (grid item) ──────────────────────────────────────────────────

function PlayerCard({ player, onClick }: { player: PlayerEval; onClick: () => void }) {
  const col = ratingColor(player.rating);
  const bg  = ratingBg(player.rating);

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: 10, textAlign: "left", width: "100%",
        background: "var(--color-neutral-900)",
        border: "1px solid var(--color-neutral-800)",
        cursor: "pointer", transition: "all 0.15s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-700)";
        (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-850, #1c1c1c)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-800)";
        (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-900)";
      }}
    >
      {/* Number */}
      <div style={{
        width: 34, height: 34, borderRadius: 6, flexShrink: 0,
        background: "var(--color-neutral-800)",
        border: `1.5px solid var(--color-neutral-700)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 900, color: "var(--color-neutral-300)",
      }}>
        {player.number}
      </div>

      {/* Name + position */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-neutral-100)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {player.shortName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
            background: "rgba(var(--primary-rgb), 0.12)",
            color: "var(--color-primary-400)",
          }}>
            {player.posLabel}
          </span>
          <span style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>{player.minutesPlayed}'</span>
        </div>
      </div>

      {/* Rating */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: bg, border: `1.5px solid ${col}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 900, color: col,
      }}>
        {player.rating.toFixed(1)}
      </div>
    </button>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function TabPlayerRatings() {
  const [selected, setSelected] = useState<PlayerEval | null>(null);

  if (selected) {
    return (
      <div style={{ height: "100%", background: "var(--color-neutral-950)" }}>
        <PlayerDetail player={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  const avgRating = (PLAYERS.reduce((s, p) => s + p.rating, 0) / PLAYERS.length).toFixed(1);
  const best = PLAYERS.reduce((a, b) => b.rating > a.rating ? b : a);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: "1px solid var(--color-neutral-800)",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--color-neutral-100)" }}>Notes joueurs</div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginTop: 1 }}>
            Cliquez sur un joueur pour voir son analyse détaillée
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>Note collective</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: ratingColor(parseFloat(avgRating)) }}>{avgRating}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>Meilleur</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e" }}>{best.shortName}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#22c55e" }}>{best.rating.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }} className="custom-scrollbar">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
          {PLAYERS.map(p => (
            <PlayerCard key={p.id} player={p} onClick={() => setSelected(p)} />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--color-neutral-800)", justifyContent: "center" }}>
          {[
            { label: "Exceptionnel", color: "#22c55e", range: "≥ 7.5" },
            { label: "Bon",          color: "#84cc16", range: "6.5–7.4" },
            { label: "Moyen",        color: "#eab308", range: "5.5–6.4" },
            { label: "Insuffisant",  color: "#f97316", range: "4.5–5.4" },
            { label: "Mauvais",      color: "#ef4444", range: "< 4.5" },
          ].map(({ label, color, range }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Star size={10} fill={color} color={color} />
              <span style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>{label}</span>
              <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>{range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
