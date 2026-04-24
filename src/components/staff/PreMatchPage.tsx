"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, TrendingUp, TrendingDown, Minus,
  ArrowUpDown, LayoutGrid, FlaskConical, ChevronDown, ChevronRight,
  Shield, Zap
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "summary" | "lab" | "players" | "cpa";
type StatSide = "FOR" | "AGAINST";
type ViewMode = "grid" | "lab";

// ─── Static Data ─────────────────────────────────────────────────────────────

const UPCOMING_MATCHES = [
  { id: 1, date: "26 Avr", time: "20h00", opponent: "Laval", venue: "Domicile", competition: "Ligue 2" },
  { id: 2, date: "03 Mai", time: "18h30", opponent: "Annecy FC", venue: "Extérieur", competition: "Ligue 2" },
  { id: 3, date: "10 Mai", time: "19h00", opponent: "Rodez AF", venue: "Domicile", competition: "Ligue 2" },
  { id: 4, date: "17 Mai", time: "20h00", opponent: "Caen", venue: "Extérieur", competition: "Ligue 2" },
  { id: 5, date: "24 Mai", time: "20h00", opponent: "Concarneau", venue: "Domicile", competition: "Ligue 2" },
];

const FORM_RESULTS = ["W", "D", "L", "W", "W"];

// ─── Formation positions (anonymous dots) ────────────────────────────────────

const FORMATION_POSITIONS: Record<string, { x: number; y: number }[]> = {
  "4-3-3": [
    { x: 0.50, y: 0.91 },
    { x: 0.13, y: 0.72 }, { x: 0.37, y: 0.72 }, { x: 0.63, y: 0.72 }, { x: 0.87, y: 0.72 },
    { x: 0.25, y: 0.50 }, { x: 0.50, y: 0.50 }, { x: 0.75, y: 0.50 },
    { x: 0.16, y: 0.22 }, { x: 0.50, y: 0.18 }, { x: 0.84, y: 0.22 },
  ],
  "4-2-3-1": [
    { x: 0.50, y: 0.91 },
    { x: 0.13, y: 0.72 }, { x: 0.37, y: 0.72 }, { x: 0.63, y: 0.72 }, { x: 0.87, y: 0.72 },
    { x: 0.36, y: 0.56 }, { x: 0.64, y: 0.56 },
    { x: 0.16, y: 0.37 }, { x: 0.50, y: 0.37 }, { x: 0.84, y: 0.37 },
    { x: 0.50, y: 0.17 },
  ],
  "4-5-1": [
    { x: 0.50, y: 0.91 },
    { x: 0.13, y: 0.72 }, { x: 0.37, y: 0.72 }, { x: 0.63, y: 0.72 }, { x: 0.87, y: 0.72 },
    { x: 0.10, y: 0.48 }, { x: 0.30, y: 0.48 }, { x: 0.50, y: 0.48 }, { x: 0.70, y: 0.48 }, { x: 0.90, y: 0.48 },
    { x: 0.50, y: 0.18 },
  ],
  "3-4-3": [
    { x: 0.50, y: 0.91 },
    { x: 0.25, y: 0.73 }, { x: 0.50, y: 0.73 }, { x: 0.75, y: 0.73 },
    { x: 0.13, y: 0.52 }, { x: 0.38, y: 0.52 }, { x: 0.62, y: 0.52 }, { x: 0.87, y: 0.52 },
    { x: 0.16, y: 0.22 }, { x: 0.50, y: 0.18 }, { x: 0.84, y: 0.22 },
  ],
  "5-3-2": [
    { x: 0.50, y: 0.91 },
    { x: 0.08, y: 0.68 }, { x: 0.27, y: 0.68 }, { x: 0.50, y: 0.68 }, { x: 0.73, y: 0.68 }, { x: 0.92, y: 0.68 },
    { x: 0.25, y: 0.48 }, { x: 0.50, y: 0.48 }, { x: 0.75, y: 0.48 },
    { x: 0.35, y: 0.20 }, { x: 0.65, y: 0.20 },
  ],
};

// ─── Opponent tactical history ────────────────────────────────────────────────

const OPPONENT_HISTORY = [
  { id: 1, date: "12 Avr", vs: "Troyes", formation: "4-3-3", result: "W", score: "2-1" },
  { id: 2, date: "06 Avr", vs: "Guingamp", formation: "4-3-3", result: "D", score: "1-1" },
  { id: 3, date: "30 Mar", vs: "Pau FC", formation: "4-5-1", result: "L", score: "0-2" },
  { id: 4, date: "23 Mar", vs: "Caen", formation: "4-3-3", result: "W", score: "1-0" },
  { id: 5, date: "16 Mar", vs: "Rodez", formation: "3-4-3", result: "W", score: "3-1" },
  { id: 6, date: "09 Mar", vs: "Annecy", formation: "4-3-3", result: "D", score: "0-0" },
  { id: 7, date: "02 Mar", vs: "Grenoble", formation: "4-5-1", result: "W", score: "2-0" },
  { id: 8, date: "23 Fév", vs: "Metz", formation: "4-3-3", result: "L", score: "1-2" },
  { id: 9, date: "16 Fév", vs: "Concarn.", formation: "3-4-3", result: "W", score: "2-1" },
  { id: 10, date: "09 Fév", vs: "Amiens", formation: "4-5-1", result: "D", score: "1-1" },
];

// ─── Team Stats categories ────────────────────────────────────────────────────

const TEAM_STATS_CATEGORIES = [
  {
    id: "defense", label: "Défense", vizType: "defense",
    metrics: [
      { label: "PPDA", valueFor: 8.2, valueAgainst: 11.4, unit: "", allTeams: [6.1, 6.8, 7.4, 7.9, 8.2, 8.5, 9.1, 9.6, 10.2, 10.8, 11.4, 11.9, 12.5, 13.2, 14.1, 15.0, 16.4, 17.8], advIdx: 10 },
      { label: "Pressing réussi P90", valueFor: 4.1, valueAgainst: 3.3, unit: "", allTeams: [1.8, 2.1, 2.5, 2.9, 3.3, 3.7, 4.1, 4.4, 4.8, 5.1, 5.5, 5.9, 6.2, 6.6, 7.0, 7.5, 8.0, 8.6], advIdx: 4 },
      { label: "Duels déf. gagnés %", valueFor: 54, valueAgainst: 48, unit: "%", allTeams: [38, 40, 42, 44, 46, 48, 50, 52, 54, 55, 56, 57, 58, 59, 60, 62, 64, 67], advIdx: 5 },
    ],
  },
  {
    id: "build-up", label: "Build-Up", vizType: "buildup",
    metrics: [
      { label: "Passes courtes %", valueFor: 71, valueAgainst: 65, unit: "%", allTeams: [52, 55, 58, 60, 62, 65, 67, 69, 71, 72, 73, 74, 75, 76, 77, 79, 81, 84], advIdx: 5 },
      { label: "Progression avg (m)", valueFor: 38, valueAgainst: 42, unit: "m", allTeams: [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63], advIdx: 7 },
    ],
  },
  {
    id: "progression", label: "Progression", vizType: "progression",
    metrics: [
      { label: "Passes progressives P90", valueFor: 42, valueAgainst: 38, unit: "", allTeams: [22, 25, 28, 31, 34, 38, 40, 42, 44, 46, 48, 50, 52, 55, 58, 60, 63, 68], advIdx: 5 },
      { label: "Carries progressives P90", valueFor: 28, valueAgainst: 24, unit: "", allTeams: [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 47, 51], advIdx: 5 },
    ],
  },
  {
    id: "finition", label: "Finition", vizType: "shots",
    metrics: [
      { label: "xG P90", valueFor: 1.42, valueAgainst: 1.18, unit: "", allTeams: [0.5, 0.65, 0.78, 0.9, 1.0, 1.1, 1.18, 1.28, 1.35, 1.42, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.15, 2.4], advIdx: 6 },
      { label: "Tirs cadrés %", valueFor: 38, valueAgainst: 32, unit: "%", allTeams: [22, 25, 27, 29, 31, 32, 34, 36, 38, 40, 42, 44, 46, 48, 51, 54, 57, 61], advIdx: 5 },
    ],
  },
  {
    id: "duels", label: "Duels", vizType: "duels",
    metrics: [
      { label: "Duels aériens gagnés %", valueFor: 52, valueAgainst: 48, unit: "%", allTeams: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 72], advIdx: 6 },
      { label: "Duels sol gagnés %", valueFor: 50, valueAgainst: 47, unit: "%", allTeams: [36, 38, 40, 42, 44, 46, 47, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 70], advIdx: 6 },
    ],
  },
  {
    id: "lbp", label: "LBP", vizType: "lbp",
    metrics: [
      { label: "Longues balles précises %", valueFor: 44, valueAgainst: 52, unit: "%", allTeams: [28, 31, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 61, 64, 68], advIdx: 11 },
    ],
  },
  {
    id: "high-turnovers", label: "High Turnovers", vizType: "turnovers",
    metrics: [
      { label: "Récupérations haut %", valueFor: 28, valueAgainst: 22, unit: "%", allTeams: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 45, 49], advIdx: 5 },
    ],
  },
  {
    id: "off-ball", label: "Courses H. Bal.", vizType: "runs",
    metrics: [
      { label: "Courses en profondeur P90", valueFor: 18, valueAgainst: 14, unit: "", allTeams: [6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 25, 27, 30], advIdx: 7 },
    ],
  },
];

const PLAYERS = [
  { name: "Caillard", pos: "GK", mins: 810, goals: 0, assists: 0, xG: 0.0, passes90: 32, duelPct: 70, progCarries: 0.2 },
  { name: "Kouyaté", pos: "CB", mins: 810, goals: 1, assists: 0, xG: 0.8, passes90: 52, duelPct: 58, progCarries: 3.1 },
  { name: "Jallow", pos: "FW", mins: 720, goals: 4, assists: 2, xG: 3.2, passes90: 22, duelPct: 44, progCarries: 5.8 },
  { name: "Mendes", pos: "MF", mins: 870, goals: 2, assists: 3, xG: 1.9, passes90: 61, duelPct: 51, progCarries: 6.2 },
  { name: "Kouassi", pos: "MF", mins: 540, goals: 0, assists: 1, xG: 0.4, passes90: 55, duelPct: 49, progCarries: 4.5 },
  { name: "Camara", pos: "FW", mins: 480, goals: 3, assists: 1, xG: 2.6, passes90: 18, duelPct: 40, progCarries: 7.1 },
  { name: "Angban", pos: "MF", mins: 900, goals: 1, assists: 2, xG: 1.1, passes90: 68, duelPct: 54, progCarries: 4.8 },
  { name: "Traoré", pos: "CB", mins: 900, goals: 0, assists: 0, xG: 0.2, passes90: 48, duelPct: 62, progCarries: 2.4 },
  { name: "Nzinga", pos: "FB", mins: 660, goals: 0, assists: 2, xG: 0.5, passes90: 58, duelPct: 47, progCarries: 5.2 },
];

const PLAYER_NAMES = ["Caillard", "Nzinga", "Kouyaté", "Traoré", "Celestine", "Angban", "Kouassi", "Lopy", "Mendes", "Camara", "Jallow"];

// ─── Mock pitch events ─────────────────────────────────────────────────────────

const EVT = {
  passes: [
    { x1: .3, y1: .7, x2: .5, y2: .55, ok: true }, { x1: .5, y1: .55, x2: .7, y2: .4, ok: true },
    { x1: .2, y1: .6, x2: .45, y2: .35, ok: false }, { x1: .6, y1: .65, x2: .8, y2: .5, ok: true },
    { x1: .15, y1: .72, x2: .38, y2: .55, ok: true }, { x1: .38, y1: .55, x2: .16, y2: .36, ok: false },
    { x1: .64, y1: .55, x2: .84, y2: .36, ok: true }, { x1: .84, y1: .36, x2: .50, y2: .17, ok: true },
    { x1: .87, y1: .73, x2: .64, y2: .55, ok: true }, { x1: .36, y1: .55, x2: .50, y2: .36, ok: true },
  ],
  carries: [
    { x1: .36, y1: .55, x2: .45, y2: .40 }, { x1: .64, y1: .55, x2: .72, y2: .42 },
    { x1: .16, y1: .36, x2: .28, y2: .25 }, { x1: .84, y1: .36, x2: .72, y2: .24 },
    { x1: .13, y1: .73, x2: .20, y2: .58 }, { x1: .87, y1: .73, x2: .80, y2: .60 },
    { x1: .50, y1: .36, x2: .50, y2: .22 }, { x1: .50, y1: .17, x2: .58, y2: .12 },
  ],
  shots: [
    { x: .50, y: .15, xG: .42, outcome: "goal" }, { x: .40, y: .20, xG: .18, outcome: "saved" },
    { x: .60, y: .18, xG: .25, outcome: "saved" }, { x: .35, y: .28, xG: .08, outcome: "off" },
    { x: .65, y: .25, xG: .12, outcome: "off" }, { x: .50, y: .32, xG: .05, outcome: "saved" },
    { x: .28, y: .35, xG: .03, outcome: "off" }, { x: .55, y: .22, xG: .15, outcome: "goal" },
  ],
  heatmap: Array.from({ length: 8 }, (_, row) => Array.from({ length: 12 }, (_, col) => {
    const cx = col / 11, cy = row / 7;
    return Math.min(1,
      Math.exp(-((cx - .3) ** 2 + (cy - .4) ** 2) / .04) * .8 +
      Math.exp(-((cx - .7) ** 2 + (cy - .5) ** 2) / .05) * .6 +
      Math.exp(-((cx - .5) ** 2 + (cy - .2) ** 2) / .03) * 1.0 +
      Math.random() * .08
    );
  })),
  duels: [
    { x: .2, y: .7, won: true }, { x: .5, y: .65, won: false }, { x: .8, y: .6, won: true }, { x: .3, y: .5, won: true },
    { x: .7, y: .45, won: false }, { x: .15, y: .4, won: true }, { x: .85, y: .35, won: true }, { x: .4, y: .3, won: false },
    { x: .6, y: .25, won: true }, { x: .5, y: .8, won: false }, { x: .25, y: .6, won: true }, { x: .75, y: .55, won: false },
    { x: .45, y: .7, won: true }, { x: .55, y: .4, won: true }, { x: .35, y: .35, won: false },
  ],
  turnovers: [
    { x: .3, y: .25, shot: true, sx: .5, sy: .15 }, { x: .6, y: .3, shot: false, sx: 0, sy: 0 },
    { x: .2, y: .35, shot: true, sx: .4, sy: .2 }, { x: .7, y: .28, shot: false, sx: 0, sy: 0 },
    { x: .45, y: .22, shot: true, sx: .55, sy: .18 }, { x: .8, y: .32, shot: false, sx: 0, sy: 0 },
    { x: .35, y: .3, shot: false, sx: 0, sy: 0 }, { x: .65, y: .25, shot: true, sx: .5, sy: .17 },
  ],
  lbp: [
    { x1: .2, y1: .6, x2: .6, y2: .45, line: .55 }, { x1: .3, y1: .65, x2: .7, y2: .38, line: .55 },
    { x1: .15, y1: .72, x2: .5, y2: .35, line: .38 }, { x1: .5, y1: .55, x2: .8, y2: .22, line: .38 },
    { x1: .35, y1: .5, x2: .65, y2: .3, line: .55 }, { x1: .4, y1: .6, x2: .6, y2: .2, line: .38 },
  ],
  runs: [
    { x1: .30, y1: .45, x2: .45, y2: .22 }, { x1: .70, y1: .45, x2: .60, y2: .20 },
    { x1: .20, y1: .50, x2: .30, y2: .28 }, { x1: .80, y1: .50, x2: .72, y2: .25 },
    { x1: .50, y1: .40, x2: .50, y2: .18 }, { x1: .15, y1: .60, x2: .22, y2: .35 },
    { x1: .85, y1: .60, x2: .78, y2: .38 }, { x1: .60, y1: .50, x2: .68, y2: .28 },
  ],
};

// ─── Lab configs per category ─────────────────────────────────────────────────

interface FilterGroup { label: string; color: string; items: string[] }

const LAB_CONFIG: Record<string, { filterGroups: FilterGroup[]; legendItems: { color: string; label: string }[]; description: string }> = {
  defense: {
    description: "Zones de récupération + intensité de pressing",
    legendItems: [
      { color: "#ef4444", label: "Zone haute intensité" }, { color: "#f59e0b", label: "Intensité moyenne" },
      { color: "#4ade80", label: "Point de récupération" },
    ],
    filterGroups: [
      { label: "Acteurs", color: "#C42B47", items: PLAYER_NAMES.slice(0, 6) },
      { label: "Type d'action défensive", color: "#EF4444", items: ["Pression haute", "Récupération", "Tacle", "Interception", "Faute commise"] },
      { label: "Zones", color: "#3B82F6", items: ["Tiers défensif", "Milieu", "Dernier tiers"] },
    ],
  },
  buildup: {
    description: "Passes + carries dans la moitié de terrain",
    legendItems: [
      { color: "#22C55E", label: "Passe réussie" }, { color: "#EF4444", label: "Passe ratée" }, { color: "#3B82F6", label: "Carry" },
    ],
    filterGroups: [
      { label: "Joueur (Départ)", color: "#C42B47", items: PLAYER_NAMES.slice(0, 5) },
      { label: "Joueur (Cible)", color: "#3B82F6", items: PLAYER_NAMES.slice(1, 6) },
      { label: "Type d'action", color: "#22C55E", items: ["Passe courte", "Passe longue", "Carry"] },
      { label: "Contexte", color: "#A855F7", items: ["Sous pression : Oui", "Sous pression : Non", "Réussite : Oui", "Réussite : Non"] },
    ],
  },
  progression: {
    description: "Vecteurs progressifs vers le dernier tiers + xPV heatmap",
    legendItems: [
      { color: "#C42B47", label: "Heatmap xPV (fond)" }, { color: "#60A5FA", label: "Passe progressive" }, { color: "#A78BFA", label: "Centre" },
    ],
    filterGroups: [
      { label: "Joueur (Départ)", color: "#C42B47", items: PLAYER_NAMES.slice(0, 5) },
      { label: "Joueur (Cible)", color: "#3B82F6", items: PLAYER_NAMES.slice(5, 10) },
      { label: "Type d'action", color: "#22C55E", items: ["Passe progressive", "Passe clé", "Centre"] },
      { label: "Zone de destination", color: "#F59E0B", items: ["Surface de réparation", "Couloirs", "Axe"] },
    ],
  },
  shots: {
    description: "Shot Map — taille proportionnelle à l'xG",
    legendItems: [
      { color: "#22C55E", label: "But" }, { color: "#F59E0B", label: "Cadré / arrêté" }, { color: "#EF4444", label: "Hors cadre / bloqué" },
    ],
    filterGroups: [
      { label: "Tireur", color: "#C42B47", items: PLAYER_NAMES.slice(5, 11) },
      { label: "Passeur décisif", color: "#3B82F6", items: PLAYER_NAMES.slice(0, 6) },
      { label: "Résultat", color: "#22C55E", items: ["But", "Cadré", "Hors cadre", "Bloqué"] },
      { label: "Type de tir", color: "#F59E0B", items: ["Pied droit", "Pied gauche", "Tête", "Coup franc"] },
      { label: "Contexte", color: "#A855F7", items: ["Attaque placée", "Contre-attaque", "CPA"] },
    ],
  },
  duels: {
    description: "Zones de combat physique (vert = gagné, rouge = perdu)",
    legendItems: [
      { color: "#22C55E", label: "Duel gagné" }, { color: "#EF4444", label: "Duel perdu" },
    ],
    filterGroups: [
      { label: "Acteurs", color: "#C42B47", items: PLAYER_NAMES.slice(0, 7) },
      { label: "Type de duel", color: "#3B82F6", items: ["Aérien", "Au sol"] },
      { label: "Phase de jeu", color: "#22C55E", items: ["Duel offensif (avec ballon)", "Duel défensif (sans ballon)"] },
    ],
  },
  lbp: {
    description: "Passes franchissant les lignes défensives adverses",
    legendItems: [
      { color: "#60A5FA", label: "LBP réussie" }, { color: "#EF4444", label: "LBP ratée" }, { color: "rgba(255,255,255,0.2)", label: "Ligne franchie" },
    ],
    filterGroups: [
      { label: "Ligne franchie", color: "#F59E0B", items: ["Première ligne (Attaquants)", "Ligne du Milieu", "Dernière ligne (Défenseurs)"] },
      { label: "Type de franchissement", color: "#A855F7", items: ["À travers le bloc (Through)", "Contournement (Around)"] },
      { label: "Lanceur", color: "#C42B47", items: PLAYER_NAMES.slice(0, 5) },
      { label: "Receveur", color: "#3B82F6", items: PLAYER_NAMES.slice(5, 10) },
    ],
  },
  turnovers: {
    description: "Récupérations hautes + enchaînements vers le but",
    legendItems: [
      { color: "#F59E0B", label: "Point de récupération" }, { color: "#C42B47", label: "Tir consécutif" }, { color: "rgba(255,255,255,0.3)", label: "Liaison récup → tir" },
    ],
    filterGroups: [
      { label: "Conséquence", color: "#22C55E", items: ["A généré un tir : Oui", "A généré un tir : Non", "A généré un but : Oui"] },
      { label: "Zone de récupération", color: "#F59E0B", items: ["Surface adverse", "Entrée de surface", "Ailes"] },
    ],
  },
  runs: {
    description: "Courses hors ballon — déplacements offensifs",
    legendItems: [
      { color: "#A855F7", label: "Course dans le dos" }, { color: "#60A5FA", label: "Appel croisé" }, { color: "#F59E0B", label: "Dédoublement" },
    ],
    filterGroups: [
      { label: "Acteurs (coureur)", color: "#C42B47", items: PLAYER_NAMES.slice(5, 11) },
      { label: "Profil de course", color: "#A855F7", items: ["Dans le dos (In Behind)", "Appui (Coming Short)", "Appel croisé", "Dédoublement (Overlap)"] },
      { label: "Zone de départ", color: "#3B82F6", items: ["Couloirs", "Demi-espaces", "Axe"] },
    ],
  },
};

// ─── Shared Components ────────────────────────────────────────────────────────

function PitchShell({ w, h, children }: { w: number; h: number; children?: React.ReactNode }) {
  return (
    <svg width={w} height={h} style={{ display: "block", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
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

function LinearRankingBar({ allTeams, advIdx, metzValue, unit }: { allTeams: number[]; advIdx: number; metzValue: number; unit: string }) {
  const sorted = [...allTeams].sort((a, b) => a - b);
  const min = sorted[0], max = sorted[sorted.length - 1];
  const avg = sorted.reduce((s, v) => s + v, 0) / sorted.length;
  const range = max - min || 1;
  const pct = (v: number) => ((v - min) / range) * 100;
  const advValue = allTeams[advIdx];
  const W = 400, TRACK_Y = 22, TRACK_H = 5;
  return (
    <svg width={W} height={40} style={{ overflow: "visible" }}>
      <rect x={0} y={TRACK_Y} width={W} height={TRACK_H} rx={3} fill="var(--color-neutral-700)" />
      {sorted.map((v, i) => {
        if (Math.abs(v - advValue) < .001 || Math.abs(v - metzValue) < .001) return null;
        return <circle key={i} cx={(pct(v) / 100) * W} cy={TRACK_Y + TRACK_H / 2} r={3} fill="var(--color-neutral-600)" />;
      })}
      <line x1={(pct(avg) / 100) * W} y1={TRACK_Y - 5} x2={(pct(avg) / 100) * W} y2={TRACK_Y + TRACK_H + 5} stroke="var(--color-neutral-500)" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={(pct(advValue) / 100) * W} cy={TRACK_Y + TRACK_H / 2} r={6} fill="#F59E0B" />
      <text x={(pct(advValue) / 100) * W} y={TRACK_Y - 8} textAnchor="middle" fontSize={9} fill="#F59E0B" fontWeight={700}>{advValue}{unit}</text>
      <circle cx={(pct(metzValue) / 100) * W} cy={TRACK_Y + TRACK_H / 2} r={6} fill="#C42B47" />
      <text x={(pct(metzValue) / 100) * W} y={TRACK_Y - 8} textAnchor="middle" fontSize={9} fill="#C42B47" fontWeight={700}>{metzValue}{unit}</text>
      <text x={0} y={40} fontSize={8} fill="var(--color-neutral-600)">{min}{unit}</text>
      <text x={W} y={40} fontSize={8} fill="var(--color-neutral-600)" textAnchor="end">{max}{unit}</text>
    </svg>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>{label}</span>
    </div>
  );
}

function FilterPill({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} style={{
      padding: "3px 7px", borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: "pointer",
      background: active ? `${color}22` : "var(--color-neutral-700)",
      color: active ? color : "var(--color-neutral-500)",
      border: active ? `1px solid ${color}55` : "1px solid var(--color-neutral-600)",
    }}>{label}</button>
  );
}

function FilterSection({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "flex", alignItems: "center", gap: 5, width: "100%",
        background: "none", border: "none", cursor: "pointer", padding: "0 0 5px 0",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <ChevronDown size={10} style={{ color, marginLeft: "auto", transform: open ? "none" : "rotate(-90deg)", transition: "transform 150ms" }} />
      </button>
      {open && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{children}</div>}
    </div>
  );
}

// ─── Pitch Visualizations ─────────────────────────────────────────────────────

function arrow(x1: number, y1: number, x2: number, y2: number, color: string, dash?: boolean) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 8 - uy * 4, ay = y2 - uy * 8 + ux * 4;
  const bx = x2 - ux * 8 + uy * 4, by = y2 - uy * 8 - ux * 4;
  return (
    <g opacity={0.85}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.8} strokeDasharray={dash ? "5 3" : undefined} />
      <circle cx={x1} cy={y1} r={3} fill={color} opacity={0.7} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
    </g>
  );
}

function VizDefense({ w, h }: { w: number; h: number }) {
  return (
    <PitchShell w={w} h={h}>
      {EVT.heatmap.map((row, ri) => row.map((val, ci) => {
        const cw = (w - 20) / 12, ch = (h - 20) / 8;
        const r = Math.floor(val * 220 + 35), g = Math.floor((1 - val) * 80), b = Math.floor((1 - val) * 30);
        return <rect key={`${ri}-${ci}`} x={10 + ci * cw} y={10 + ri * ch} width={cw} height={ch} fill={`rgb(${r},${g},${b})`} opacity={val * .65 + .05} />;
      }))}
      {EVT.turnovers.map((pt, i) => (
        <circle key={i} cx={pt.x * w} cy={pt.y * h} r={5} fill="#4ade80" stroke="#fff" strokeWidth={1} opacity={0.9} />
      ))}
    </PitchShell>
  );
}

function VizBuildup({ w, h }: { w: number; h: number }) {
  return (
    <PitchShell w={w} h={h}>
      {/* Only own half (y > 0.5) */}
      {EVT.passes.filter(p => p.y1 > 0.5).map((p, i) =>
        <g key={i}>{arrow(p.x1 * w, p.y1 * h, p.x2 * w, p.y2 * h, p.ok ? "#22C55E" : "#EF4444")}</g>
      )}
      {EVT.carries.filter(c => c.y1 > 0.5).map((c, i) => (
        <g key={`c${i}`}>
          <line x1={c.x1 * w} y1={c.y1 * h} x2={c.x2 * w} y2={c.y2 * h} stroke="#3B82F6" strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />
          <circle cx={c.x1 * w} cy={c.y1 * h} r={3} fill="#3B82F6" opacity={0.6} />
        </g>
      ))}
    </PitchShell>
  );
}

function VizProgression({ w, h }: { w: number; h: number }) {
  return (
    <PitchShell w={w} h={h}>
      {/* xPV heatmap in background (upper half) */}
      {EVT.heatmap.slice(0, 4).map((row, ri) => row.map((val, ci) => {
        const cw = (w - 20) / 12, ch = (h - 20) / 8;
        return <rect key={`${ri}-${ci}`} x={10 + ci * cw} y={10 + ri * ch} width={cw} height={ch} fill="#C42B47" opacity={val * .35} />;
      }))}
      {/* Progressive passes toward last third */}
      {EVT.lbp.map((p, i) =>
        <g key={i}>{arrow(p.x1 * w, p.y1 * h, p.x2 * w, p.y2 * h, "#60A5FA")}</g>
      )}
      {EVT.carries.filter(c => c.y2 < 0.45).map((c, i) =>
        <g key={`run${i}`}>{arrow(c.x1 * w, c.y1 * h, c.x2 * w, c.y2 * h, "#A78BFA", true)}</g>
      )}
    </PitchShell>
  );
}

function VizShots({ w, h }: { w: number; h: number }) {
  const S_COLOR: Record<string, string> = { goal: "#22C55E", saved: "#F59E0B", off: "#EF4444" };
  return (
    <PitchShell w={w} h={h}>
      <rect x={w * .42} y={10} width={w * .16} height={8} fill="#fff" opacity={0.25} />
      {EVT.shots.map((s, i) => {
        const cx = s.x * w, cy = s.y * h, r = 6 + s.xG * 22, c = S_COLOR[s.outcome];
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={c} opacity={0.2} />
            <circle cx={cx} cy={cy} r={r * .45} fill={c} opacity={0.9} />
            <text x={cx} y={cy + 3} textAnchor="middle" fontSize={7} fill="#fff" fontWeight={700}>{s.xG.toFixed(2)}</text>
          </g>
        );
      })}
    </PitchShell>
  );
}

function VizDuels({ w, h }: { w: number; h: number }) {
  return (
    <PitchShell w={w} h={h}>
      {EVT.duels.map((d, i) => (
        <g key={i}>
          <circle cx={d.x * w} cy={d.y * h} r={7} fill={d.won ? "#22C55E" : "#EF4444"} opacity={0.8} />
          <text x={d.x * w} y={d.y * h + 4} textAnchor="middle" fontSize={8} fill="#fff" fontWeight={800}>{d.won ? "✓" : "✕"}</text>
        </g>
      ))}
    </PitchShell>
  );
}

function VizLBP({ w, h }: { w: number; h: number }) {
  const lineYs = [0.55, 0.38, 0.22];
  return (
    <PitchShell w={w} h={h}>
      {lineYs.map((ly, i) => (
        <line key={i} x1={10} y1={ly * h} x2={w - 10} y2={ly * h} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} strokeDasharray="6 4" />
      ))}
      {EVT.lbp.map((p, i) => {
        const crossesLine = lineYs.some(ly => (p.y1 > ly && p.y2 < ly));
        return <g key={i}>{arrow(p.x1 * w, p.y1 * h, p.x2 * w, p.y2 * h, crossesLine ? "#60A5FA" : "rgba(100,140,255,0.5)")}</g>;
      })}
    </PitchShell>
  );
}

function VizTurnovers({ w, h }: { w: number; h: number }) {
  return (
    <PitchShell w={w} h={h}>
      {/* Opponent half only — upper portion */}
      <rect x={10} y={10} width={w - 20} height={(h - 20) / 2} fill="rgba(196,43,71,0.03)" />
      {EVT.turnovers.map((pt, i) => (
        <g key={i}>
          {pt.shot && (
            <>
              <line x1={pt.x * w} y1={pt.y * h} x2={pt.sx * w} y2={pt.sy * h} stroke="rgba(255,255,255,0.3)" strokeWidth={1.2} strokeDasharray="4 3" />
              <circle cx={pt.sx * w} cy={pt.sy * h} r={5} fill="#C42B47" opacity={0.85} />
            </>
          )}
          <circle cx={pt.x * w} cy={pt.y * h} r={7} fill="#F59E0B" stroke="#fff" strokeWidth={1.2} opacity={0.9} />
        </g>
      ))}
    </PitchShell>
  );
}

function VizRuns({ w, h }: { w: number; h: number }) {
  const colors = ["#A855F7", "#60A5FA", "#F59E0B", "#A855F7", "#60A5FA", "#F59E0B", "#A855F7", "#60A5FA"];
  return (
    <PitchShell w={w} h={h}>
      {EVT.runs.map((r, i) =>
        <g key={i}>{arrow(r.x1 * w, r.y1 * h, r.x2 * w, r.y2 * h, colors[i % colors.length], true)}</g>
      )}
    </PitchShell>
  );
}

function renderViz(vizType: string, w: number, h: number) {
  switch (vizType) {
    case "defense": return <VizDefense w={w} h={h} />;
    case "buildup": return <VizBuildup w={w} h={h} />;
    case "progression": return <VizProgression w={w} h={h} />;
    case "shots": return <VizShots w={w} h={h} />;
    case "duels": return <VizDuels w={w} h={h} />;
    case "lbp": return <VizLBP w={w} h={h} />;
    case "turnovers": return <VizTurnovers w={w} h={h} />;
    case "runs": return <VizRuns w={w} h={h} />;
    default: return <VizDefense w={w} h={h} />;
  }
}

// ─── Smart Visual Lab ─────────────────────────────────────────────────────────

function SmartVisualLab({ vizType, opponent }: { vizType: string; opponent: string }) {
  const cfg = LAB_CONFIG[vizType] ?? LAB_CONFIG.defense;
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  function toggle(group: string, item: string) {
    setActiveFilters(prev => {
      const cur = prev[group] ?? [];
      return { ...prev, [group]: cur.includes(item) ? cur.filter(x => x !== item) : [...cur, item] };
    });
  }

  const totalActive = Object.values(activeFilters).flat().length;

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Filter panel */}
      <div style={{
        width: 184, flexShrink: 0, background: "var(--color-neutral-800)", borderRadius: 10,
        border: "1px solid var(--color-neutral-700)", padding: "12px",
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 10 }}>
          Filtres dynamiques
        </div>
        {cfg.filterGroups.map(g => (
          <FilterSection key={g.label} label={g.label} color={g.color}>
            {g.items.map(item => (
              <FilterPill
                key={item} label={item}
                active={(activeFilters[g.label] ?? []).includes(item)}
                onClick={() => toggle(g.label, item)}
                color={g.color}
              />
            ))}
          </FilterSection>
        ))}
        {totalActive > 0 && (
          <button onClick={() => setActiveFilters({})} style={{
            width: "100%", marginTop: 6, padding: "6px", borderRadius: 6, cursor: "pointer",
            fontSize: 10, fontWeight: 700, color: "var(--color-neutral-400)",
            background: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)",
          }}>
            Réinitialiser ({totalActive})
          </button>
        )}
      </div>

      {/* Pitch */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "var(--color-neutral-500)", marginBottom: 8 }}>{cfg.description} — {opponent}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          {cfg.legendItems.map(l => <LegendItem key={l.label} color={l.color} label={l.label} />)}
        </div>
        {renderViz(vizType, 380, 480)}
      </div>
    </div>
  );
}

// ─── Tactical History (Summary Tab) ──────────────────────────────────────────

function MiniPitch({ formation, size = 90 }: { formation: string; size?: number }) {
  const positions = FORMATION_POSITIONS[formation] ?? FORMATION_POSITIONS["4-3-3"];
  const W = size, H = size * 1.3;
  return (
    <svg width={W} height={H} style={{ borderRadius: 5, overflow: "hidden", flexShrink: 0 }}>
      <rect x={0} y={0} width={W} height={H} fill="#1a2e1a" />
      <rect x={3} y={3} width={W - 6} height={H - 6} fill="none" stroke="#2d4a2d" strokeWidth={1} />
      <line x1={3} y1={H / 2} x2={W - 3} y2={H / 2} stroke="#2d4a2d" strokeWidth={0.7} />
      <rect x={W * .3} y={3} width={W * .4} height={H * .15} fill="none" stroke="#2d4a2d" strokeWidth={0.7} />
      <rect x={W * .3} y={H - 3 - H * .15} width={W * .4} height={H * .15} fill="none" stroke="#2d4a2d" strokeWidth={0.7} />
      {positions.map((p, i) => (
        <circle key={i} cx={p.x * W} cy={p.y * H} r={4.5} fill="#C42B47" stroke="#fff" strokeWidth={0.8} opacity={0.9} />
      ))}
    </svg>
  );
}

function TacticalHistorySection({ opponent }: { opponent: string }) {
  const [expanded, setExpanded] = useState<string | null>("4-3-3");

  // Group by formation
  const grouped = OPPONENT_HISTORY.reduce<Record<string, typeof OPPONENT_HISTORY>>((acc, m) => {
    (acc[m.formation] ??= []).push(m);
    return acc;
  }, {});

  const sorted = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  const R_COLOR: Record<string, string> = { W: "#22C55E", D: "#F59E0B", L: "#EF4444" };
  const R_LABEL: Record<string, string> = { W: "V", D: "N", L: "D" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-neutral-300)", marginBottom: 2 }}>
        Historique tactique — {opponent} (10 derniers matchs)
      </div>
      {sorted.map(([formation, matches]) => {
        const isOpen = expanded === formation;
        const winRate = Math.round((matches.filter(m => m.result === "W").length / matches.length) * 100);
        return (
          <div key={formation} style={{
            background: "var(--color-neutral-800)", borderRadius: 10,
            border: isOpen ? "1px solid rgba(196,43,71,0.35)" : "1px solid var(--color-neutral-700)",
            overflow: "hidden",
          }}>
            {/* Header row */}
            <button
              onClick={() => setExpanded(isOpen ? null : formation)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <MiniPitch formation={formation} size={72} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--color-neutral-100)", marginBottom: 2 }}>
                  {formation}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
                    background: "rgba(196,43,71,0.15)", color: "#C42B47",
                    border: "1px solid rgba(196,43,71,0.3)",
                  }}>
                    Utilisé {matches.length}× / 10
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-neutral-500)" }}>
                    {winRate}% victoires
                  </span>
                </div>
                {/* Form dots */}
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {matches.map((m, i) => (
                    <span key={i} style={{
                      width: 16, height: 16, borderRadius: 3, fontSize: 8, fontWeight: 800,
                      background: `${R_COLOR[m.result]}22`, color: R_COLOR[m.result],
                      border: `1px solid ${R_COLOR[m.result]}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{R_LABEL[m.result]}</span>
                  ))}
                </div>
              </div>
              <ChevronDown size={16} style={{
                color: "var(--color-neutral-500)", flexShrink: 0,
                transform: isOpen ? "none" : "rotate(-90deg)", transition: "transform 150ms",
              }} />
            </button>

            {/* Match list */}
            {isOpen && (
              <div style={{ borderTop: "1px solid var(--color-neutral-700)" }}>
                {matches.map(m => (
                  <div key={m.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
                    borderBottom: "1px solid var(--color-neutral-700)",
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 4, fontSize: 9, fontWeight: 800, flexShrink: 0,
                      background: `${R_COLOR[m.result]}22`, color: R_COLOR[m.result],
                      border: `1px solid ${R_COLOR[m.result]}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{R_LABEL[m.result]}</span>
                    <span style={{ fontSize: 11, color: "var(--color-neutral-400)", width: 50, flexShrink: 0 }}>{m.date}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-neutral-200)", flex: 1 }}>
                      vs {m.vs}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-300)", width: 32, textAlign: "center" }}>{m.score}</span>
                    <Link
                      href={`/staff/post-match?match=${m.id}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 5,
                        fontSize: 10, fontWeight: 700, textDecoration: "none",
                        background: "rgba(196,43,71,0.1)", color: "#C42B47",
                        border: "1px solid rgba(196,43,71,0.25)", flexShrink: 0,
                      }}
                    >
                      Post-Match <ChevronRight size={10} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Summary ─────────────────────────────────────────────────────────────

function TabSummary({ opponent }: { opponent: string }) {
  const insights = {
    strengths: ["Pressing haut organisé (PPDA 8.2)", "Transitions rapides en contre", "Efficacité sur coups de pied arrêtés"],
    struggles: ["Duels aériens en défense (54%)", "Construction sous pression adverse", "Gestion des temps forts adverses"],
    vulnerabilities: ["Flanc gauche exposé sur contre", "Faible taux récupérations hautes", "Défaillances sur longues balles"],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, padding: "16px",
        background: "var(--color-neutral-800)", borderRadius: 10, border: "1px solid var(--color-neutral-700)",
      }}>
        {[
          { label: "Forme (5 derniers)", isForm: true },
          { label: "xG moy. / match", value: "1.42" },
          { label: "xGA moy. / match", value: "1.18" },
          { label: "Points vs xPoints", value: "36 / 32" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginBottom: 4 }}>{s.label}</div>
            {s.isForm ? (
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {FORM_RESULTS.map((r, ri) => {
                  const c = r === "W" ? "#22C55E" : r === "D" ? "#F59E0B" : "#EF4444";
                  return (
                    <span key={ri} style={{
                      width: 18, height: 18, borderRadius: 4, fontSize: 9, fontWeight: 800,
                      background: `${c}22`, color: c, border: `1px solid ${c}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{r === "W" ? "V" : r}</span>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-neutral-100)" }}>{s.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Tactical history + insights side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <TacticalHistorySection opponent={opponent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Forces", items: insights.strengths, color: "#22C55E", icon: <TrendingUp size={12} /> },
            { label: "Faiblesses", items: insights.struggles, color: "#F59E0B", icon: <Minus size={12} /> },
            { label: "Vulnérabilités", items: insights.vulnerabilities, color: "#EF4444", icon: <TrendingDown size={12} /> },
          ].map(g => (
            <div key={g.label} style={{
              background: "var(--color-neutral-800)", borderRadius: 10, padding: "12px 14px",
              border: "1px solid var(--color-neutral-700)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ color: g.color }}>{g.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: g.color }}>{g.label}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                {g.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11, color: "var(--color-neutral-300)" }}>
                    <span style={{ color: g.color, marginTop: 2, flexShrink: 0 }}>•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Team Stats ──────────────────────────────────────────────────────────

function TabTeamStats({ opponent, defaultMode = "grid" }: { opponent: string; defaultMode?: ViewMode }) {
  const [activeCat, setActiveCat] = useState(TEAM_STATS_CATEGORIES[0].id);
  const [side, setSide] = useState<StatSide>("FOR");
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);

  const cat = TEAM_STATS_CATEGORIES.find(c => c.id === activeCat)!;

  function selectCat(id: string) { setActiveCat(id); setViewMode("grid"); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 0 }}>
      <div style={{ borderRight: "1px solid var(--color-neutral-700)", paddingRight: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        {TEAM_STATS_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => selectCat(c.id)} style={{
            padding: "7px 10px", borderRadius: 7, fontSize: 11, fontWeight: activeCat === c.id ? 700 : 500,
            textAlign: "left", cursor: "pointer",
            background: activeCat === c.id ? "rgba(196,43,71,0.12)" : "transparent",
            color: activeCat === c.id ? "#C42B47" : "var(--color-neutral-400)",
            border: activeCat === c.id ? "1px solid rgba(196,43,71,0.25)" : "1px solid transparent",
          }}>{c.label}</button>
        ))}
      </div>

      <div style={{ paddingLeft: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 2, background: "var(--color-neutral-800)", borderRadius: 7, padding: 2, border: "1px solid var(--color-neutral-700)" }}>
            <button onClick={() => setViewMode("grid")} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 5,
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: viewMode === "grid" ? "rgba(196,43,71,0.15)" : "transparent",
              color: viewMode === "grid" ? "#C42B47" : "var(--color-neutral-400)",
              border: viewMode === "grid" ? "1px solid rgba(196,43,71,0.35)" : "1px solid transparent",
            }}>
              <LayoutGrid size={12} /> Grille
            </button>
            <button onClick={() => setViewMode("lab")} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 5,
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: viewMode === "lab" ? "rgba(59,130,246,0.15)" : "transparent",
              color: viewMode === "lab" ? "#60A5FA" : "var(--color-neutral-400)",
              border: viewMode === "lab" ? "1px solid rgba(59,130,246,0.35)" : "1px solid transparent",
            }}>
              <FlaskConical size={12} /> Labo Visuel
            </button>
          </div>
          {viewMode === "grid" && (["FOR", "AGAINST"] as StatSide[]).map(s => (
            <button key={s} onClick={() => setSide(s)} style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: side === s ? "rgba(196,43,71,0.15)" : "var(--color-neutral-800)",
              color: side === s ? "#C42B47" : "var(--color-neutral-400)",
              border: side === s ? "1px solid rgba(196,43,71,0.35)" : "1px solid var(--color-neutral-700)",
            }}>
              {s === "FOR" ? "Pour (Metz attaque)" : "Contre (Metz défend)"}
            </button>
          ))}
        </div>

        {viewMode === "grid" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <LegendItem color="#C42B47" label="FC Metz" />
              <LegendItem color="#F59E0B" label={opponent} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="var(--color-neutral-500)" strokeWidth={1.5} strokeDasharray="3 2" /></svg>
                <span style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>Moyenne L2</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {cat.metrics.map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-neutral-300)", marginBottom: 8 }}>{m.label}</div>
                  <LinearRankingBar allTeams={m.allTeams} advIdx={m.advIdx} metzValue={side === "FOR" ? m.valueFor : m.valueAgainst} unit={m.unit} />
                </div>
              ))}
            </div>
          </>
        )}

        {viewMode === "lab" && <SmartVisualLab vizType={cat.vizType} opponent={opponent} />}
      </div>
    </div>
  );
}

// ─── Tab: Players ─────────────────────────────────────────────────────────────

type SortKey = "goals" | "assists" | "xG" | "passes90" | "duelPct" | "progCarries";

function TabPlayers() {
  const [posFilter, setPosFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("xG");
  const [sortAsc, setSortAsc] = useState(false);
  const cols: { key: SortKey; label: string }[] = [
    { key: "goals", label: "Buts" }, { key: "assists", label: "Passes D." },
    { key: "xG", label: "xG" }, { key: "passes90", label: "Passes P90" },
    { key: "duelPct", label: "Duels %" }, { key: "progCarries", label: "Carries P90" },
  ];
  const filtered = PLAYERS
    .filter(p => posFilter === "ALL" || p.pos === posFilter)
    .sort((a, b) => sortAsc ? (a[sortKey] as number) - (b[sortKey] as number) : (b[sortKey] as number) - (a[sortKey] as number));

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["ALL", "GK", "CB", "FB", "MF", "FW"].map(p => (
          <button key={p} onClick={() => setPosFilter(p)} style={{
            padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: posFilter === p ? "rgba(196,43,71,0.15)" : "var(--color-neutral-800)",
            color: posFilter === p ? "#C42B47" : "var(--color-neutral-400)",
            border: posFilter === p ? "1px solid rgba(196,43,71,0.35)" : "1px solid var(--color-neutral-700)",
          }}>{p}</button>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
              <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--color-neutral-500)", fontWeight: 700, fontSize: 10 }}>Joueur</th>
              <th style={{ textAlign: "center", padding: "8px 6px", color: "var(--color-neutral-500)", fontWeight: 700, fontSize: 10 }}>Pos.</th>
              <th style={{ textAlign: "center", padding: "8px 6px", color: "var(--color-neutral-500)", fontWeight: 700, fontSize: 10 }}>Min.</th>
              {cols.map(c => (
                <th key={c.key} onClick={() => { if (sortKey === c.key) setSortAsc(v => !v); else { setSortKey(c.key); setSortAsc(false); } }}
                  style={{ textAlign: "center", padding: "8px 6px", cursor: "pointer", color: sortKey === c.key ? "#C42B47" : "var(--color-neutral-500)", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap", userSelect: "none" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{c.label}<ArrowUpDown size={9} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--color-neutral-800)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <td style={{ padding: "8px 10px", fontWeight: 600, color: "var(--color-neutral-200)" }}>{p.name}</td>
                <td style={{ padding: "8px 6px", textAlign: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4, background: "var(--color-neutral-700)", color: "var(--color-neutral-400)" }}>{p.pos}</span>
                </td>
                <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--color-neutral-500)" }}>{p.mins}</td>
                {cols.map(c => (
                  <td key={c.key} style={{ padding: "8px 6px", textAlign: "center", fontWeight: sortKey === c.key ? 700 : 400, color: sortKey === c.key ? "var(--color-neutral-100)" : "var(--color-neutral-300)" }}>
                    {p[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Report View ──────────────────────────────────────────────────────────────

// ─── Tab: Strategy CPA ────────────────────────────────────────────────────────
function TabStrategyCPA({ opponent }: { opponent: string }) {
  const [activeSub, setActiveSub] = useState("target-hunter");
  const subs = [
    { id: "target-hunter", label: "Target Hunter" },
    { id: "corners", label: "Corners" },
    { id: "freekicks", label: "Coups Francs" },
    { id: "throwins", label: "Touches" },
    { id: "penalties", label: "Penaltys" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
        {subs.map(s => (
          <button key={s.id} onClick={() => setActiveSub(s.id)} style={{
            padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer",
            background: activeSub === s.id ? "rgba(196,43,71,0.15)" : "var(--color-neutral-800)",
            color: activeSub === s.id ? "#C42B47" : "var(--color-neutral-400)",
            border: activeSub === s.id ? "1px solid rgba(196,43,71,0.35)" : "1px solid var(--color-neutral-700)",
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ background: "var(--color-neutral-900)", borderRadius: 12, border: "1px solid var(--color-neutral-800)", padding: 24, minHeight: 400 }}>
        {activeSub === "target-hunter" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "white", marginBottom: 16 }}>Analyse des Cibles (Target Hunter)</h3>
              <p style={{ fontSize: 12, color: "var(--color-neutral-400)", marginBottom: 24 }}>
                Identification des joueurs adverses les plus sollicités sur CPA et préconisations de marquage pour {opponent}.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { name: "Joueur Cible n°1", zone: "Premier Poteau", danger: "Trés Élevé", rec: "Marquage individuel strict (Kouyaté)" },
                  { name: "Joueur Cible n°2", zone: "Point de Penalty", danger: "Élevé", rec: "Blocage de course au départ" },
                ].map((target, i) => (
                  <div key={i} style={{ padding: 16, background: "var(--color-neutral-800)", borderRadius: 10, border: "1px solid var(--color-neutral-700)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>{target.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444" }}>DANGER {target.danger}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-neutral-400)" }}>Zone : {target.zone}</div>
                    <div style={{ fontSize: 11, color: "#C42B47", fontWeight: 700, marginTop: 4 }}>Préconisation : {target.rec}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--color-neutral-800)", borderRadius: 10, padding: 20, border: "1px solid var(--color-neutral-700)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-500)", textTransform: "uppercase", marginBottom: 12 }}>Visualisation Zones</div>
              <PitchShell w={260} h={320}>
                <circle cx={130} cy={60} r={40} fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 2" />
                <circle cx={70} cy={45} r={25} fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 2" opacity={0.6} />
                <text x={130} y={65} textAnchor="middle" fontSize={10} fill="white" fontWeight={700}>Zone A</text>
              </PitchShell>
            </div>
          </div>
        )}

        {activeSub !== "target-hunter" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Defensive Prep (Opponent Attacks) */}
            <div style={{ background: "var(--color-neutral-800)", borderRadius: 10, padding: 20, border: "1px solid var(--color-neutral-700)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Shield size={14} className="text-[#EF4444]" />
                <h4 style={{ fontSize: 11, fontWeight: 800, color: "white", uppercase: "true", letterSpacing: "0.05em" }}>ANALYSE ADVERSE (DÉFENSE)</h4>
              </div>
              <p style={{ fontSize: 10, color: "var(--color-neutral-400)", marginBottom: 16 }}>Leurs patterns habituels sur {activeSub}.</p>

              <div style={{ height: 220, background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid var(--color-neutral-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activeSub === "corners" && (
                  <svg viewBox="0 0 100 100" style={{ width: "80%", height: "80%" }}>
                    <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <path d="M 5 5 Q 40 40 50 15" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" />
                    <circle cx="50" cy="15" r="8" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="0.5" />
                  </svg>
                )}
                {activeSub === "freekicks" && (
                  <svg viewBox="0 0 100 100" style={{ width: "80%", height: "80%" }}>
                    <rect x="10" y="0" width="80" height="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="2" fill="#F59E0B" />
                    <path d="M 50 50 L 50 10" fill="none" stroke="#F59E0B" strokeWidth="1" />
                  </svg>
                )}
                {activeSub === "throwins" && (
                  <div style={{ fontSize: 9, color: "var(--color-neutral-500)", fontWeight: 700 }}>PATTERN TOUCHES LONGUES</div>
                )}
                {activeSub === "penalties" && (
                  <div style={{ fontSize: 9, color: "var(--color-neutral-500)", fontWeight: 700 }}>CLUSTERS TIREURS</div>
                )}
              </div>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, color: "var(--color-neutral-300)" }}><span style={{ color: "#EF4444" }}>•</span> Danger principal : Premier poteau</div>
                <div style={{ fontSize: 10, color: "var(--color-neutral-300)" }}><span style={{ color: "#EF4444" }}>•</span> Tireur préférentiel : Pied gauche rentrant</div>
              </div>
            </div>

            {/* Offensive Prep (Our Plan) */}
            <div style={{ background: "rgba(34,197,94,0.05)", borderRadius: 10, padding: 20, border: "1px solid rgba(34,197,94,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Zap size={14} className="text-[#22C55E]" />
                <h4 style={{ fontSize: 11, fontWeight: 800, color: "white", uppercase: "true", letterSpacing: "0.05em" }}>NOTRE PLAN (OFFENSE)</h4>
              </div>
              <p style={{ fontSize: 10, color: "var(--color-neutral-400)", marginBottom: 16 }}>Exploiter leurs faiblesses sur {activeSub}.</p>

              <div style={{ height: 220, background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#22C55E", fontWeight: 800, marginBottom: 4 }}>FAILLE DÉTECTÉE</div>
                  <div style={{ fontSize: 12, color: "white", fontWeight: 700 }}>Second Poteau Isolé</div>
                  <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginTop: 8 }}>Blocage du gardien par Millot</div>
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, color: "var(--color-neutral-300)" }}><span style={{ color: "#22C55E" }}>•</span> Combinaison : "L'écran"</div>
                <div style={{ fontSize: 10, color: "var(--color-neutral-300)" }}><span style={{ color: "#22C55E" }}>•</span> Cible : Traoré lancé</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportView({ match }: { match: typeof UPCOMING_MATCHES[0] }) {
  const [tab, setTab] = useState<TabId>("summary");
  const tabs: { id: TabId; label: string }[] = [
    { id: "summary", label: "Profil Opposant" },
    { id: "lab", label: "Analyse Lab" },
    { id: "players", label: "Effectif" },
    { id: "cpa", label: "Stratégie CPA" },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ background: "var(--color-neutral-800)", borderRadius: 10, padding: "14px 16px", marginBottom: 16, border: "1px solid var(--color-neutral-700)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--color-neutral-100)" }}>FC Metz vs {match.opponent}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
              {[{ icon: <Calendar size={11} />, val: match.date }, { icon: <Clock size={11} />, val: match.time }, { icon: <MapPin size={11} />, val: match.venue }].map((item, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-neutral-400)" }}>{item.icon} {item.val}</span>
              ))}
            </div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 5, background: "rgba(196,43,71,0.12)", border: "1px solid rgba(196,43,71,0.3)", color: "#C42B47" }}>
            {match.competition}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 16, borderBottom: "1px solid var(--color-neutral-700)", paddingBottom: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: "6px 6px 0 0", fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: tab === t.id ? "var(--color-neutral-800)" : "transparent",
            color: tab === t.id ? "#C42B47" : "var(--color-neutral-400)",
            border: tab === t.id ? "1px solid var(--color-neutral-700)" : "1px solid transparent",
            borderBottom: tab === t.id ? "1px solid var(--color-neutral-800)" : "1px solid transparent",
            marginBottom: tab === t.id ? -1 : 0,
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        {tab === "summary" && <TabSummary opponent={match.opponent} />}
        {tab === "lab" && <TabTeamStats opponent={match.opponent} defaultMode="lab" />}
        {tab === "players" && <TabPlayers />}
        {tab === "cpa" && <TabStrategyCPA opponent={match.opponent} />}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PreMatchPage() {
  const [selectedId, setSelectedId] = useState(UPCOMING_MATCHES[0].id);
  const selected = UPCOMING_MATCHES.find(m => m.id === selectedId)!;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{
        width: 210, flexShrink: 0, borderRight: "1px solid var(--color-neutral-700)",
        display: "flex", flexDirection: "column", background: "var(--color-neutral-900)",
      }}>
        <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid var(--color-neutral-800)" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Prochains matchs
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
          {UPCOMING_MATCHES.map(m => {
            const isActive = m.id === selectedId;
            const isHome = m.venue === "Domicile";
            return (
              <button key={m.id} onClick={() => setSelectedId(m.id)} style={{
                width: "100%", textAlign: "left", padding: "10px 10px", borderRadius: 8, marginBottom: 4, cursor: "pointer",
                background: isActive ? "rgba(196,43,71,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(196,43,71,0.3)" : "1px solid transparent",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#C42B47" : "var(--color-neutral-200)", marginBottom: 3 }}>
                  vs {m.opponent}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>{m.date}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
                    background: isHome ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                    color: isHome ? "#22C55E" : "#F59E0B",
                  }}>{m.venue}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <ReportView key={selected.id} match={selected} />
      </div>
    </div>
  );
}
