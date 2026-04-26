// ─── POST-MATCH REPORT — MOCK DATA ────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PMPlayer {
  id: number;
  number: number;
  name: string;
  position: string;
  x: number; // 0–1 relative pitch width
  y: number; // 0–1 relative pitch height
  yellowCard?: boolean;
  yellowCardMin?: number;
  redCard?: boolean;
  subOff?: number; // minute replaced out
  subOn?: number;  // minute entered (for subs)
  rating?: number;
}

export interface SubPlayer {
  id: number;
  number: number;
  name: string;
  position: string;
  subOn?: number;
}

export interface TeamData {
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  manager: string;
  formation: string;
  starters: PMPlayer[];
  substitutes: SubPlayer[];
}

export interface GoalEvent {
  minute: number;
  playerId: number;
  playerName: string;
  team: "home" | "away";
  assist?: string;
  type?: "goal" | "penalty" | "own-goal";
}

export interface PassLine {
  x1: number; y1: number;
  x2: number; y2: number;
  playerId: number;
  phase: string;
  xpv: number; // expected pass value
  lineBreaking: "none" | "first" | "mid" | "last";
}

export interface CarryLine {
  x1: number; y1: number;
  x2: number; y2: number;
  playerId: number;
  distance: number;
  xThreat: number;
}

export interface RunVector {
  x1: number; y1: number;
  x2: number; y2: number;
  playerId: number;
  zone: "left" | "central" | "right";
  profile: "coming-short" | "pulling-wide" | "ahead" | "in-behind";
  speed: number; // km/h
}

export interface PressurePoint {
  x: number; y: number;
  intensity: number; // 0–1
  presserId: number;
  pressedId: number;
  outcome: "loss" | "success" | "failed-pass";
  action?: string;
}

export interface ReceivedPressurePoint {
  x: number; y: number;
  intensity: number;
  playerId: number;
  outcome: "kept" | "lost";
  action?: string;
}

// ── Match Header ──────────────────────────────────────────────────────────────

export const MATCH_INFO = {
  competition: "Ligue 2 BKT",
  matchday: "Journée 32",
  date: "19 avril 2026",
  venue: "Stade Saint-Symphorien",
  kickoff: "15:15 UTC",
  homeScore: 1,
  awayScore: 3,
};

// ── Team Data ─────────────────────────────────────────────────────────────────

export const HOME_TEAM: TeamData = {
  name: "Metz",
  shortName: "Metz",
  color: "#C42B47",
  secondaryColor: "#6D071A",
  manager: "Benoît Tavenot",
  formation: "4231",
  starters: [
    { id: 1, number: 61, name: "Pape Mamadou Sy", position: "Goalkeeper", x: 0.50, y: 0.94 },
    { id: 2, number: 15, name: "Terry Yegbe", position: "Left Centre Back", x: 0.35, y: 0.84, subOff: 74 },
    { id: 3, number: 38, name: "Sadibou Sané", position: "Right Centre Back", x: 0.65, y: 0.84 },
    { id: 4, number: 4, name: "Urie-Michel Mboula", position: "Left Back", x: 0.15, y: 0.82, yellowCard: true, yellowCardMin: 13, subOff: 57 },
    { id: 5, number: 39, name: "Koffi Franck Kouao", position: "Right Back", x: 0.85, y: 0.82, yellowCard: true, yellowCardMin: 38 },
    { id: 6, number: 20, name: "Jessy Deminguet", position: "Left Defensive Midfielder", x: 0.38, y: 0.72, subOff: 74 },
    { id: 7, number: 5, name: "Jean-Philippe Gbamin", position: "Right Defensive Midfielder", x: 0.62, y: 0.72 },
    { id: 8, number: 7, name: "Georgiy Tsitaishvili", position: "Left Wing", x: 0.15, y: 0.60 },
    { id: 9, number: 10, name: "Gauthier Hein", position: "Centre Attacking Midfielder", x: 0.50, y: 0.62 },
    { id: 10, number: 34, name: "Nathan Mbala", position: "Right Wing", x: 0.85, y: 0.60, subOff: 74 },
    { id: 11, number: 30, name: "Habib Diallo", position: "Centre Forward", x: 0.50, y: 0.54, subOff: 30 },
  ],
  substitutes: [
    { id: 20, number: 11, name: "Giorgi Kvilitaia", position: "Centre Forward", subOn: 30 },
    { id: 21, number: 19, name: "Lucas Michal", position: "Left Wing", subOn: 74 },
    { id: 22, number: 21, name: "Benjamin Stambouli", position: "Defensive Midfielder", subOn: 74 },
    { id: 23, number: 35, name: "Jahyann Pandore", position: "Centre Back", subOn: 74 },
    { id: 24, number: 70, name: "Rouna Sarr", position: "Goalkeeper" },
  ],
};

export const AWAY_TEAM: TeamData = {
  name: "Paris FC",
  shortName: "Paris FC",
  color: "#3B5CB8",
  secondaryColor: "#1E3A7A",
  manager: "Antoine Kombouaré",
  formation: "4231",
  starters: [
    { id: 30, number: 16, name: "Obed Nkambadio", position: "Goalkeeper", x: 0.50, y: 0.06 },
    { id: 31, number: 6, name: "Otávio", position: "Left Centre Back", x: 0.35, y: 0.16, yellowCard: true, yellowCardMin: 62 },
    { id: 32, number: 42, name: "Diego Coppola", position: "Right Centre Back", x: 0.65, y: 0.16 },
    { id: 33, number: 28, name: "Thibault De Smet", position: "Left Back", x: 0.15, y: 0.18, subOff: 87 },
    { id: 34, number: 14, name: "Hamari Traoré", position: "Right Back", x: 0.85, y: 0.18, subOff: 77 },
    { id: 35, number: 31, name: "Samir Chergui", position: "Right Defensive Midfielder", x: 0.38, y: 0.28 },
    { id: 36, number: 23, name: "Rudy Matondo", position: "Left Defensive Midfielder", x: 0.62, y: 0.28 },
    { id: 37, number: 24, name: "Luca Koleosho", position: "Left Wing", x: 0.15, y: 0.40, subOff: 87 },
    { id: 38, number: 10, name: "Ilan Kebbal", position: "Centre Attacking Midfielder", x: 0.50, y: 0.38, yellowCard: true, yellowCardMin: 46, subOff: 77 },
    { id: 39, number: 7, name: "Alimami Gory", position: "Right Wing", x: 0.85, y: 0.40, subOff: 85 },
    { id: 40, number: 36, name: "Ciro Immobile", position: "Centre Forward", x: 0.50, y: 0.46, subOff: 77 },
  ],
  substitutes: [
    { id: 50, number: 4, name: "Vincent Marchetti", position: "Midfielder", subOn: 65 },
    { id: 51, number: 9, name: "Willem Geubbels", position: "Forward", subOn: 77 },
    { id: 52, number: 13, name: "Mathieu Cafaro", position: "Midfielder", subOn: 85 },
    { id: 53, number: 17, name: "Adama Camara", position: "Winger", subOn: 87 },
    { id: 54, number: 19, name: "Nhoa Sangui", position: "Defender" },
  ],
};

// ── Goals ─────────────────────────────────────────────────────────────────────

export const GOALS: GoalEvent[] = [
  { minute: 21, playerId: 37, playerName: "Gory", team: "away", type: "goal" },
  { minute: 31, playerId: 11, playerName: "Diallo", team: "home", type: "goal" },
  { minute: 69, playerId: 38, playerName: "Kebbal", team: "away", type: "goal" },
  { minute: 89, playerId: 38, playerName: "Kebbal", team: "away", type: "goal" },
];

// ── Phase Breakdown ───────────────────────────────────────────────────────────

export interface PhaseData {
  label: string;
  home: number;
  away: number;
}

export const PHASE_BREAKDOWN: PhaseData[] = [
  { label: "Build Up", home: 34, away: 28 },
  { label: "Create", home: 22, away: 19 },
  { label: "Finish", home: 8, away: 14 },
  { label: "Direct", home: 11, away: 9 },
  { label: "Transition", home: 15, away: 12 },
  { label: "Quick Break", home: 6, away: 11 },
  { label: "Chaotic", home: 5, away: 8 },
  { label: "Set Play", home: 9, away: 7 },
];

// ── Tactical Shapes (Average Positions) ──────────────────────────────────────

export interface TacticalPosition {
  x: number;
  y: number;
  pos: string;
}

export type TacticalPhase = "all" | "build-up" | "creation" | "recovery" | "low-block";
export type BallZone = "left" | "center" | "right";

export const TACTICAL_SHAPES: Record<"home" | "away", Record<TacticalPhase, TacticalPosition[]>> = {
  home: {
    all: [
      { x: 0.50, y: 0.90, pos: "GB" },
      { x: 0.82, y: 0.77, pos: "RB" },
      { x: 0.63, y: 0.81, pos: "RCB" },
      { x: 0.37, y: 0.81, pos: "LCB" },
      { x: 0.18, y: 0.77, pos: "LB" },
      { x: 0.62, y: 0.65, pos: "RDM" },
      { x: 0.38, y: 0.65, pos: "LDM" },
      { x: 0.84, y: 0.49, pos: "RW" },
      { x: 0.50, y: 0.51, pos: "CAM" },
      { x: 0.16, y: 0.49, pos: "LW" },
      { x: 0.50, y: 0.33, pos: "CF" },
    ],
    "build-up": [
      { x: 0.50, y: 0.92, pos: "GB" },
      { x: 0.92, y: 0.78, pos: "RB" },
      { x: 0.70, y: 0.88, pos: "RCB" },
      { x: 0.30, y: 0.88, pos: "LCB" },
      { x: 0.08, y: 0.78, pos: "LB" },
      { x: 0.65, y: 0.75, pos: "RDM" },
      { x: 0.35, y: 0.75, pos: "LDM" },
      { x: 0.88, y: 0.45, pos: "RW" },
      { x: 0.50, y: 0.60, pos: "CAM" },
      { x: 0.12, y: 0.45, pos: "LW" },
      { x: 0.50, y: 0.40, pos: "CF" },
    ],
    creation: [
      { x: 0.50, y: 0.80, pos: "GB" },
      { x: 0.85, y: 0.50, pos: "RB" },
      { x: 0.65, y: 0.65, pos: "RCB" },
      { x: 0.35, y: 0.65, pos: "LCB" },
      { x: 0.15, y: 0.50, pos: "LB" },
      { x: 0.58, y: 0.45, pos: "RDM" },
      { x: 0.42, y: 0.45, pos: "LDM" },
      { x: 0.90, y: 0.25, pos: "RW" },
      { x: 0.50, y: 0.28, pos: "CAM" },
      { x: 0.10, y: 0.25, pos: "LW" },
      { x: 0.50, y: 0.15, pos: "CF" },
    ],
    recovery: [
      { x: 0.50, y: 0.88, pos: "GB" },
      { x: 0.75, y: 0.65, pos: "RB" },
      { x: 0.60, y: 0.70, pos: "RCB" },
      { x: 0.40, y: 0.70, pos: "LCB" },
      { x: 0.25, y: 0.65, pos: "LB" },
      { x: 0.55, y: 0.55, pos: "RDM" },
      { x: 0.45, y: 0.55, pos: "LDM" },
      { x: 0.70, y: 0.40, pos: "RW" },
      { x: 0.50, y: 0.45, pos: "CAM" },
      { x: 0.30, y: 0.40, pos: "LW" },
      { x: 0.50, y: 0.35, pos: "CF" },
    ],
    "low-block": [
      { x: 0.50, y: 0.94, pos: "GB" },
      { x: 0.78, y: 0.85, pos: "RB" },
      { x: 0.60, y: 0.88, pos: "RCB" },
      { x: 0.40, y: 0.88, pos: "LCB" },
      { x: 0.22, y: 0.85, pos: "LB" },
      { x: 0.58, y: 0.78, pos: "RDM" },
      { x: 0.42, y: 0.78, pos: "LDM" },
      { x: 0.75, y: 0.72, pos: "RW" },
      { x: 0.50, y: 0.74, pos: "CAM" },
      { x: 0.25, y: 0.72, pos: "LW" },
      { x: 0.50, y: 0.65, pos: "CF" },
    ],
  },
  away: {
    all: [
      { x: 0.50, y: 0.10, pos: "GB" },
      { x: 0.82, y: 0.23, pos: "RB" },
      { x: 0.63, y: 0.19, pos: "RCB" },
      { x: 0.37, y: 0.19, pos: "LCB" },
      { x: 0.18, y: 0.23, pos: "LB" },
      { x: 0.62, y: 0.35, pos: "RDM" },
      { x: 0.38, y: 0.35, pos: "LDM" },
      { x: 0.84, y: 0.51, pos: "RW" },
      { x: 0.50, y: 0.49, pos: "CAM" },
      { x: 0.16, y: 0.51, pos: "LW" },
      { x: 0.50, y: 0.67, pos: "CF" },
    ],
    "build-up": [
      { x: 0.50, y: 0.08, pos: "GB" },
      { x: 0.92, y: 0.22, pos: "RB" },
      { x: 0.70, y: 0.12, pos: "RCB" },
      { x: 0.30, y: 0.12, pos: "LCB" },
      { x: 0.08, y: 0.22, pos: "LB" },
      { x: 0.65, y: 0.25, pos: "RDM" },
      { x: 0.35, y: 0.25, pos: "LDM" },
      { x: 0.88, y: 0.55, pos: "RW" },
      { x: 0.50, y: 0.40, pos: "CAM" },
      { x: 0.12, y: 0.55, pos: "LW" },
      { x: 0.50, y: 0.60, pos: "CF" },
    ],
    creation: [
      { x: 0.50, y: 0.20, pos: "GB" },
      { x: 0.85, y: 0.50, pos: "RB" },
      { x: 0.65, y: 0.35, pos: "RCB" },
      { x: 0.35, y: 0.35, pos: "LCB" },
      { x: 0.15, y: 0.50, pos: "LB" },
      { x: 0.58, y: 0.55, pos: "RDM" },
      { x: 0.42, y: 0.55, pos: "LDM" },
      { x: 0.90, y: 0.75, pos: "RW" },
      { x: 0.50, y: 0.72, pos: "CAM" },
      { x: 0.10, y: 0.75, pos: "LW" },
      { x: 0.50, y: 0.85, pos: "CF" },
    ],
    recovery: [
      { x: 0.50, y: 0.12, pos: "GB" },
      { x: 0.75, y: 0.35, pos: "RB" },
      { x: 0.60, y: 0.30, pos: "RCB" },
      { x: 0.40, y: 0.30, pos: "LCB" },
      { x: 0.25, y: 0.35, pos: "LB" },
      { x: 0.55, y: 0.45, pos: "RDM" },
      { x: 0.45, y: 0.45, pos: "LDM" },
      { x: 0.70, y: 0.60, pos: "RW" },
      { x: 0.50, y: 0.55, pos: "CAM" },
      { x: 0.30, y: 0.60, pos: "LW" },
      { x: 0.50, y: 0.65, pos: "CF" },
    ],
    "low-block": [
      { x: 0.50, y: 0.06, pos: "GB" },
      { x: 0.78, y: 0.15, pos: "RB" },
      { x: 0.60, y: 0.12, pos: "RCB" },
      { x: 0.40, y: 0.12, pos: "LCB" },
      { x: 0.22, y: 0.15, pos: "LB" },
      { x: 0.58, y: 0.22, pos: "RDM" },
      { x: 0.42, y: 0.22, pos: "LDM" },
      { x: 0.75, y: 0.28, pos: "RW" },
      { x: 0.50, y: 0.26, pos: "CAM" },
      { x: 0.25, y: 0.28, pos: "LW" },
      { x: 0.50, y: 0.35, pos: "CF" },
    ],
  },
};

// Possession efficiency donut data
export const POSSESSION_EFFICIENCY = {
  progression: { value: 62, label: "Progression", sublabel: "vers création" },
  recycling: { value: 24, label: "Recyclage", sublabel: "vers l'arrière" },
  losses: { value: 14, label: "Pertes", sublabel: "de possession" },
};

// ── Passes & xPV ─────────────────────────────────────────────────────────────

export const PASSES: PassLine[] = [
  { x1: 0.50, y1: 0.90, x2: 0.38, y2: 0.65, playerId: 1, phase: "Build Up", xpv: 0.02, lineBreaking: "none" },
  { x1: 0.38, y1: 0.65, x2: 0.50, y2: 0.51, playerId: 6, phase: "Build Up", xpv: 0.05, lineBreaking: "first" },
  { x1: 0.50, y1: 0.51, x2: 0.84, y2: 0.49, playerId: 9, phase: "Create", xpv: 0.12, lineBreaking: "mid" },
  { x1: 0.84, y1: 0.49, x2: 0.50, y2: 0.33, playerId: 10, phase: "Create", xpv: 0.18, lineBreaking: "last" },
  { x1: 0.50, y1: 0.33, x2: 0.62, y2: 0.65, playerId: 11, phase: "Finish", xpv: 0.08, lineBreaking: "none" },
  { x1: 0.62, y1: 0.65, x2: 0.16, y2: 0.49, playerId: 7, phase: "Transition", xpv: 0.14, lineBreaking: "mid" },
  { x1: 0.16, y1: 0.49, x2: 0.50, y2: 0.33, playerId: 8, phase: "Create", xpv: 0.22, lineBreaking: "last" },
  { x1: 0.18, y1: 0.77, x2: 0.38, y2: 0.65, playerId: 5, phase: "Build Up", xpv: 0.03, lineBreaking: "none" },
  { x1: 0.63, y1: 0.81, x2: 0.62, y2: 0.65, playerId: 3, phase: "Build Up", xpv: 0.04, lineBreaking: "first" },
  { x1: 0.82, y1: 0.77, x2: 0.62, y2: 0.65, playerId: 2, phase: "Build Up", xpv: 0.03, lineBreaking: "none" },
];

export const CARRIES: CarryLine[] = [
  { x1: 0.35, y1: 0.84, x2: 0.38, y2: 0.72, playerId: 2, distance: 12, xThreat: 0.02 },
  { x1: 0.62, y1: 0.72, x2: 0.50, y2: 0.62, playerId: 7, distance: 15, xThreat: 0.08 },
  { x1: 0.50, y1: 0.62, x2: 0.50, y2: 0.40, playerId: 9, distance: 22, xThreat: 0.15 },
  { x1: 0.85, y1: 0.82, x2: 0.85, y2: 0.60, playerId: 5, distance: 18, xThreat: 0.05 },
];

export const SEASON_STATS = {
  possession: { match: 52, season: 48, unit: "%" },
  passAccuracy: { match: 84, season: 81, unit: "%" },
  progressivePasses: { match: 42, season: 38, unit: "" },
  carriesInFinalThird: { match: 15, season: 12, unit: "" },
  expectedGoals: { match: 1.8, season: 1.4, unit: "xG" },
};

// Lines broken table
export interface LineBreakRow {
  playerName: string;
  number: number;
  firstLine: number;
  midLine: number;
  lastLine: number;
}

export const LINE_BREAKS: LineBreakRow[] = [
  { playerName: "Deminguet", number: 20, firstLine: 4, midLine: 2, lastLine: 0 },
  { playerName: "Gbamin", number: 5, firstLine: 3, midLine: 3, lastLine: 0 },
  { playerName: "Hein", number: 10, firstLine: 2, midLine: 5, lastLine: 2 },
  { playerName: "Tsitaishvili", number: 7, firstLine: 1, midLine: 4, lastLine: 3 },
  { playerName: "Mbala", number: 34, firstLine: 0, midLine: 3, lastLine: 4 },
  { playerName: "Diallo", number: 30, firstLine: 0, midLine: 1, lastLine: 6 },
];

// Déséquilibre timeline (10-min segments)
export interface DesEquilibreSegment {
  segment: string;
  score: number;
  isHigh: boolean;
}

export const DESEQUILIBRE_TIMELINE: DesEquilibreSegment[] = [
  { segment: "0–10", score: 3.2, isHigh: false },
  { segment: "10–20", score: 4.8, isHigh: false },
  { segment: "20–30", score: 6.1, isHigh: true },
  { segment: "30–40", score: 5.3, isHigh: false },
  { segment: "40–50", score: 4.2, isHigh: false },
  { segment: "50–60", score: 7.4, isHigh: true },
  { segment: "60–70", score: 6.8, isHigh: true },
  { segment: "70–80", score: 5.1, isHigh: false },
  { segment: "80–90", score: 4.6, isHigh: false },
];

// ── Off-Ball Runs ──────────────────────────────────────────────────────────────

export const RUN_VECTORS: RunVector[] = [
  { x1: 0.40, y1: 0.60, x2: 0.30, y2: 0.45, playerId: 6, zone: "central", profile: "coming-short", speed: 16.2 },
  { x1: 0.18, y1: 0.60, x2: 0.08, y2: 0.40, playerId: 8, zone: "left", profile: "pulling-wide", speed: 17.8 },
  { x1: 0.84, y1: 0.55, x2: 0.92, y2: 0.30, playerId: 10, zone: "right", profile: "in-behind", speed: 21.3 },
  { x1: 0.50, y1: 0.55, x2: 0.52, y2: 0.28, playerId: 11, zone: "central", profile: "in-behind", speed: 19.6 },
  { x1: 0.60, y1: 0.65, x2: 0.72, y2: 0.45, playerId: 7, zone: "right", profile: "ahead", speed: 15.9 },
  { x1: 0.30, y1: 0.70, x2: 0.20, y2: 0.55, playerId: 5, zone: "left", profile: "pulling-wide", speed: 16.5 },
  { x1: 0.50, y1: 0.65, x2: 0.50, y2: 0.45, playerId: 9, zone: "central", profile: "ahead", speed: 15.2 },
  { x1: 0.70, y1: 0.60, x2: 0.80, y2: 0.42, playerId: 3, zone: "right", profile: "coming-short", speed: 15.8 },
];

export interface RunProfileRow {
  playerName: string;
  number: number;
  comingShort: number;
  pullingWide: number;
  ahead: number;
  inBehind: number;
  total: number;
}

export const RUN_PROFILES: RunProfileRow[] = [
  { playerName: "Tsitaishvili", number: 7, comingShort: 2, pullingWide: 8, ahead: 5, inBehind: 3, total: 18 },
  { playerName: "Mbala", number: 34, comingShort: 1, pullingWide: 6, ahead: 4, inBehind: 7, total: 18 },
  { playerName: "Diallo", number: 30, comingShort: 4, pullingWide: 2, ahead: 6, inBehind: 9, total: 21 },
  { playerName: "Hein", number: 10, comingShort: 6, pullingWide: 3, ahead: 7, inBehind: 2, total: 18 },
  { playerName: "Deminguet", number: 20, comingShort: 3, pullingWide: 4, ahead: 8, inBehind: 1, total: 16 },
  { playerName: "Gbamin", number: 5, comingShort: 5, pullingWide: 2, ahead: 6, inBehind: 0, total: 13 },
];

// ── Defense & Pressure ────────────────────────────────────────────────────────

export const PRESSURE_POINTS: PressurePoint[] = [
  { x: 0.25, y: 0.20, intensity: 0.9, presserId: 8, pressedId: 32, outcome: "loss", action: "Récupération réussie" },
  { x: 0.50, y: 0.18, intensity: 0.7, presserId: 11, pressedId: 30, outcome: "failed-pass", action: "Passe forcée ratée" },
  { x: 0.70, y: 0.25, intensity: 0.8, presserId: 10, pressedId: 31, outcome: "success", action: "Pression efficace" },
  { x: 0.35, y: 0.30, intensity: 0.6, presserId: 6, pressedId: 33, outcome: "loss", action: "Récupération réussie" },
  { x: 0.60, y: 0.35, intensity: 0.5, presserId: 7, pressedId: 35, outcome: "success", action: "Pression efficace" },
  { x: 0.20, y: 0.40, intensity: 0.7, presserId: 5, pressedId: 34, outcome: "failed-pass", action: "Passe forcée ratée" },
  { x: 0.80, y: 0.30, intensity: 0.8, presserId: 9, pressedId: 37, outcome: "loss", action: "Récupération réussie" },
  { x: 0.45, y: 0.45, intensity: 0.4, presserId: 6, pressedId: 36, outcome: "success", action: "Pression efficace" },
  { x: 0.55, y: 0.22, intensity: 0.9, presserId: 11, pressedId: 32, outcome: "loss", action: "Récupération réussie" },
  { x: 0.30, y: 0.15, intensity: 0.6, presserId: 8, pressedId: 33, outcome: "success", action: "Pression efficace" },
];

export const RECEIVED_PRESSURE_POINTS: ReceivedPressurePoint[] = [
  { x: 0.30, y: 0.65, intensity: 0.8, playerId: 6, outcome: "kept", action: "Ballon conservé" },
  { x: 0.15, y: 0.75, intensity: 0.9, playerId: 4, outcome: "lost", action: "Perte sous pression" },
  { x: 0.85, y: 0.70, intensity: 0.7, playerId: 5, outcome: "kept", action: "Sortie de balle réussie" },
  { x: 0.50, y: 0.60, intensity: 0.6, playerId: 9, outcome: "lost", action: "Passe forcée interceptée" },
  { x: 0.40, y: 0.80, intensity: 0.9, playerId: 2, outcome: "kept", action: "Dégagement propre" },
  { x: 0.60, y: 0.75, intensity: 0.5, playerId: 3, outcome: "kept", action: "Ballon conservé" },
  { x: 0.20, y: 0.60, intensity: 0.7, playerId: 8, outcome: "lost", action: "Tacle adverse réussi" },
  { x: 0.75, y: 0.65, intensity: 0.8, playerId: 10, outcome: "kept", action: "Ballon conservé" },
];

export const PRESSURE_SCORES = [
  { name: "Diallo", score: 88, pos: 75, neg: 25 },
  { name: "Tsitaishvili", score: 82, pos: 68, neg: 32 },
  { name: "Mbala", score: 79, pos: 60, neg: 40 },
  { name: "Hein", score: 74, pos: 55, neg: 45 },
  { name: "Deminguet", score: 71, pos: 50, neg: 50 },
];

export const RESISTANCE_SCORES = [
  { name: "Gbamin", score: 92, pos: 85, neg: 15 },
  { name: "Deminguet", score: 85, pos: 78, neg: 22 },
  { name: "Sané", score: 78, pos: 70, neg: 30 },
  { name: "Kouao", score: 72, pos: 65, neg: 35 },
  { name: "Yegbe", score: 68, pos: 60, neg: 40 },
];

export interface DefActionRow {
  playerName: string;
  number: number;
  hiPressures: number;
  hiRecoveries: number;
  tackles: number;
  interceptions: number;
}

export const DEF_ACTIONS: DefActionRow[] = [
  { playerName: "Diallo", number: 30, hiPressures: 12, hiRecoveries: 3, tackles: 2, interceptions: 1 },
  { playerName: "Tsitaishvili", number: 7, hiPressures: 9, hiRecoveries: 2, tackles: 1, interceptions: 2 },
  { playerName: "Hein", number: 10, hiPressures: 7, hiRecoveries: 4, tackles: 3, interceptions: 1 },
  { playerName: "Mbala", number: 34, hiPressures: 8, hiRecoveries: 1, tackles: 2, interceptions: 0 },
  { playerName: "Deminguet", number: 20, hiPressures: 6, hiRecoveries: 3, tackles: 4, interceptions: 3 },
  { playerName: "Gbamin", number: 5, hiPressures: 5, hiRecoveries: 5, tackles: 6, interceptions: 4 },
  { playerName: "Yegbe", number: 15, hiPressures: 4, hiRecoveries: 2, tackles: 3, interceptions: 2 },
  { playerName: "Sané", number: 38, hiPressures: 3, hiRecoveries: 4, tackles: 5, interceptions: 3 },
];

// Pressure sources (players who press most)
export interface PressureSource {
  playerId: number;
  playerName: string;
  count: number;
  avgX: number;
  avgY: number;
}

export const PRESSURE_SOURCES: PressureSource[] = [
  { playerId: 11, playerName: "Diallo", count: 12, avgX: 0.50, avgY: 0.20 },
  { playerId: 8, playerName: "Tsitaishvili", count: 9, avgX: 0.22, avgY: 0.25 },
  { playerId: 10, playerName: "Mbala", count: 8, avgX: 0.78, avgY: 0.22 },
  { playerId: 9, playerName: "Hein", count: 7, avgX: 0.52, avgY: 0.38 },
  { playerId: 6, playerName: "Deminguet", count: 6, avgX: 0.38, avgY: 0.42 },
];

// Pressure consequences
export const PRESSURE_CONSEQUENCES = {
  losses: { count: 5, pct: 42 },
  successPasses: { count: 4, pct: 33 },
  failedPasses: { count: 3, pct: 25 },
};

// Received Pressure consequences
export const RECEIVED_CONSEQUENCES = {
  kept: { count: 8, pct: 55 },
  lost: { count: 4, pct: 30 },
  forcedError: { count: 2, pct: 15 },
};
