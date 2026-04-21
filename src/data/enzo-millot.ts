// ── Enzo Millot — All hardcoded profile data ─────────────────────────────────

export const PLAYER = {
  id: "enzo-millot",
  firstName: "Enzo",
  lastName: "Millot",
  initials: "EM",
  age: 23,
  nationality: "France",
  flag: "🇫🇷",
  height: "181 cm",
  weight: "73 kg",
  foot: "Droit",
  position: "MC",
  positionLabel: "Milieu Central",
  club: "FC Metz",
  league: "Ligue 1",
  contractEnd: "Jun 2026",
  marketValue: "12M€",
  marketValueTrend: "up" as const,
  agent: "Stellar Sports",
  isUE: true,
} as const;

// ── Radar (8 axes, 0–100) ─────────────────────────────────────────────────────
export const RADAR_AXES = [
  "Finition",
  "Création",
  "Sortie de balle",
  "Pressing",
  "Duel Aérien",
  "Duel Sol",
  "Vol. Physique",
  "Placement",
] as const;

export const RADAR_PLAYER   = [72, 83, 79, 71, 65, 74, 78, 80];
export const RADAR_BENCHMARK = [68, 76, 74, 75, 68, 72, 76, 74];

// ── Formations (3 mini pitches) ──────────────────────────────────────────────
export const FORMATIONS = [
  {
    name: "4-3-3",
    pct: 45,
    // Dots: { x, y } as fraction of pitch [0–1]. y=0 = attacking goal, y=1 = own goal
    teammates: [
      // GK
      { x: 0.50, y: 0.90 },
      // DEF
      { x: 0.15, y: 0.73 }, { x: 0.35, y: 0.70 }, { x: 0.65, y: 0.70 }, { x: 0.85, y: 0.73 },
      // MID (other 2)
      { x: 0.25, y: 0.50 }, { x: 0.75, y: 0.50 },
      // FWD
      { x: 0.20, y: 0.22 }, { x: 0.50, y: 0.17 }, { x: 0.80, y: 0.22 },
    ],
    player: { x: 0.50, y: 0.45 },
  },
  {
    name: "4-2-3-1",
    pct: 35,
    teammates: [
      // GK
      { x: 0.50, y: 0.90 },
      // DEF
      { x: 0.15, y: 0.73 }, { x: 0.35, y: 0.70 }, { x: 0.65, y: 0.70 }, { x: 0.85, y: 0.73 },
      // DM
      { x: 0.35, y: 0.58 }, { x: 0.65, y: 0.58 },
      // AM (other 2)
      { x: 0.20, y: 0.37 }, { x: 0.80, y: 0.37 },
      // ST
      { x: 0.50, y: 0.17 },
    ],
    player: { x: 0.50, y: 0.37 },
  },
  {
    name: "3-4-3",
    pct: 20,
    teammates: [
      // GK
      { x: 0.50, y: 0.90 },
      // DEF
      { x: 0.25, y: 0.73 }, { x: 0.50, y: 0.70 }, { x: 0.75, y: 0.73 },
      // MID (other 3)
      { x: 0.15, y: 0.51 }, { x: 0.62, y: 0.48 }, { x: 0.85, y: 0.51 },
      // FWD
      { x: 0.20, y: 0.22 }, { x: 0.50, y: 0.17 }, { x: 0.80, y: 0.22 },
    ],
    player: { x: 0.38, y: 0.48 },
  },
];

// ── Availability (28 matchdays) ───────────────────────────────────────────────
export const AVAILABILITY = {
  pct: 86,
  played: 24,
  total: 28,
  minutes: [
    // MD1-6: healthy
    90, 78, 85, 90, 62, 90,
    // MD7-9: injury 1 (ankle)
    0, 0, 0,
    // MD10-20: healthy
    72, 85, 90, 90, 68, 76, 90, 85, 90, 80, 72,
    // MD21: injury 2 (thigh)
    0,
    // MD22-28: healthy
    68, 85, 90, 78, 90, 82, 75,
  ],
  injuries: [
    { start: 7, end: 9, label: "Cheville droite" },
    { start: 21, end: 21, label: "Cuisse gauche" },
  ],
};

// ── Market value history ──────────────────────────────────────────────────────
export const VALUE_HISTORY = [
  { month: "Jan 2020", value: 1.5, age: 17 },
  { month: "Jun 2020", value: 2.0, age: 18 },
  { month: "Jan 2021", value: 2.8, age: 18 },
  { month: "Jun 2021", value: 3.5, age: 19 },
  { month: "Jan 2022", value: 5.0, age: 19 },
  { month: "Jun 2022", value: 6.5, age: 20 },
  { month: "Jan 2023", value: 7.5, age: 21 },
  { month: "Jun 2023", value: 8.5, age: 21 },
  { month: "Jan 2024", value: 10.0, age: 22 },
  { month: "Jun 2024", value: 11.0, age: 22 },
  { month: "Jan 2025", value: 12.0, age: 23 },
];

// ── Shot map (SVG half-pitch coords: x 0–420, y 0–320) ───────────────────────
// y=0 = goal line, y=320 = midfield
export type ShotType = "goal" | "saved" | "missed" | "blocked";
export interface Shot {
  x: number;
  y: number;
  type: ShotType;
}

export const SHOTS: Shot[] = [
  // Goals
  { x: 210, y: 42, type: "goal" },
  { x: 175, y: 58, type: "goal" },
  { x: 240, y: 38, type: "goal" },
  // Saved
  { x: 205, y: 30, type: "saved" },
  { x: 225, y: 55, type: "saved" },
  { x: 183, y: 68, type: "saved" },
  { x: 248, y: 48, type: "saved" },
  { x: 190, y: 36, type: "saved" },
  { x: 218, y: 78, type: "saved" },
  // Missed / off target
  { x: 198, y: 90, type: "missed" },
  { x: 258, y: 65, type: "missed" },
  { x: 160, y: 74, type: "missed" },
  { x: 278, y: 85, type: "missed" },
  { x: 136, y: 96, type: "missed" },
  { x: 205, y: 112, type: "missed" },
  { x: 265, y: 105, type: "missed" },
  { x: 180, y: 58, type: "missed" },
  { x: 232, y: 98, type: "missed" },
  // Blocked
  { x: 192, y: 58, type: "blocked" },
  { x: 218, y: 64, type: "blocked" },
  { x: 200, y: 72, type: "blocked" },
  { x: 245, y: 68, type: "blocked" },
  { x: 172, y: 48, type: "blocked" },
];

// ── Scout reports (timeline) ──────────────────────────────────────────────────
export const REPORTS = [
  { id: 1, date: "Mar 2024", author: "J. Martin",  type: "Terrain", note: 7.8 },
  { id: 2, date: "Oct 2024", author: "D. Garcia",  type: "Vidéo",   note: 8.1 },
  { id: 3, date: "Jan 2025", author: "J. Martin",  type: "Terrain", note: 8.4 },
];

// ── Positions played this season ──────────────────────────────────────────────
export interface PositionMatch {
  home: string;
  away: string;
  result: "V" | "N" | "D";
  date: string;
  formation: string;
}

export interface PositionAppearance {
  position: string;
  label: string;
  x: number;   // 0–1 fraction of pitch width
  y: number;   // 0–1 fraction of pitch height (0=top=opponent goal, 1=bottom=own goal)
  matches: number;
  matchList: PositionMatch[];
}

export const POSITION_APPEARANCES: PositionAppearance[] = [
  {
    position: "MC",
    label: "Milieu Central",
    x: 0.50,
    y: 0.48,
    matches: 18,
    matchList: [
      { home: "FC Metz",      away: "PSG",           result: "D", date: "11 août",  formation: "4-3-3"   },
      { home: "Lyon",         away: "FC Metz",       result: "N", date: "18 août",  formation: "4-3-3"   },
      { home: "FC Metz",      away: "Monaco",        result: "V", date: "25 août",  formation: "4-3-3"   },
      { home: "Lens",         away: "FC Metz",       result: "D", date: "1 sept",   formation: "4-3-3"   },
      { home: "FC Metz",      away: "Toulouse",      result: "V", date: "15 sept",  formation: "4-3-3"   },
      { home: "Brest",        away: "FC Metz",       result: "D", date: "22 sept",  formation: "4-2-3-1" },
      { home: "FC Metz",      away: "Reims",         result: "V", date: "6 oct",    formation: "4-3-3"   },
      { home: "Strasbourg",   away: "FC Metz",       result: "N", date: "20 oct",   formation: "4-3-3"   },
      { home: "FC Metz",      away: "Marseille",     result: "D", date: "27 oct",   formation: "4-2-3-1" },
      { home: "Nantes",       away: "FC Metz",       result: "V", date: "3 nov",    formation: "4-3-3"   },
      { home: "FC Metz",      away: "Auxerre",       result: "V", date: "10 nov",   formation: "4-3-3"   },
      { home: "Le Havre",     away: "FC Metz",       result: "D", date: "24 nov",   formation: "4-3-3"   },
      { home: "FC Metz",      away: "Saint-Étienne", result: "V", date: "1 déc",    formation: "4-3-3"   },
      { home: "FC Metz",      away: "Lille",         result: "N", date: "15 déc",   formation: "4-2-3-1" },
      { home: "Montpellier",  away: "FC Metz",       result: "V", date: "22 déc",   formation: "4-3-3"   },
      { home: "FC Metz",      away: "Nice",          result: "N", date: "12 janv",  formation: "4-3-3"   },
      { home: "Rennes",       away: "FC Metz",       result: "D", date: "19 janv",  formation: "4-3-3"   },
      { home: "FC Metz",      away: "Lyon",          result: "V", date: "2 févr",   formation: "4-3-3"   },
    ],
  },
  {
    position: "MOC",
    label: "Milieu Offensif",
    x: 0.50,
    y: 0.33,
    matches: 4,
    matchList: [
      { home: "FC Metz",   away: "Brest",    result: "V", date: "29 sept", formation: "4-2-3-1" },
      { home: "Monaco",    away: "FC Metz",  result: "D", date: "8 déc",   formation: "4-2-3-1" },
      { home: "FC Metz",   away: "Lens",     result: "V", date: "29 janv", formation: "4-2-3-1" },
      { home: "Toulouse",  away: "FC Metz",  result: "N", date: "9 févr",  formation: "4-2-3-1" },
    ],
  },
  {
    position: "MG",
    label: "Milieu Gauche",
    x: 0.22,
    y: 0.47,
    matches: 2,
    matchList: [
      { home: "Marseille", away: "FC Metz",  result: "D", date: "26 oct",  formation: "3-4-3" },
      { home: "FC Metz",   away: "Rennes",   result: "N", date: "16 févr", formation: "3-4-3" },
    ],
  },
];
