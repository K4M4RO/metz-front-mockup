// ─── LIVE MATCH MOCK DATA — aligned with Second Spectrum WebSocket APIs ────────
// tracking-fast: real-time player/ball positions + speeds
// physical-summary: cumulative athletic data per player (period=100 = full match)

// ── Types: Tracking ────────────────────────────────────────────────────────────

export interface TrackingPlayer {
  playerId: string;
  optaId: string;
  number: number;
  name: string;       // added for display
  position: string;   // added for display
  x: number;         // 0–1 relative pitch width  (converted from tracking xyz)
  y: number;         // 0–1 relative pitch height
  speed: number;     // m/s  (from tracking)
}

export interface TrackingFrame {
  frameIdx: number;
  period: number;
  gameClock: number;   // seconds
  wallClock: number;
  live: boolean;       // ball in play
  lastTouch: "home" | "away";
  homePlayers: TrackingPlayer[];
  awayPlayers: TrackingPlayer[];
  ball: {
    x: number;   // 0–1 relative
    y: number;
    speed: number; // m/s
  };
}

// ── Types: Physical ────────────────────────────────────────────────────────────

export interface PhysicalPlayer {
  playerId: string;
  number: number;
  name: string;
  position: string;
  minutesPlayed: number;
  // Full match (period=100)
  totalDistance: number;          // meters
  distanceWalking: number;
  distanceJogging: number;
  distanceLowSpeedRunning: number;
  distanceHighSpeedRunning: number;
  distanceSprinting: number;
  countSprinting: number;
  topSpeed: number;               // km/h
  avgSpeed: number;               // km/h
  percentDistanceWalking: number;
  percentDistanceJogging: number;
  percentDistanceLowSpeedRunning: number;
  percentDistanceHighSpeedRunning: number;
  percentDistanceSprinting: number;
  // InPlay subset
  totalDistanceInPlay: number;
  distanceSprintingInPlay: number;
  distanceHighSpeedRunningInPlay: number;
  // InPossession / OutPossession
  totalDistanceInPossession: number;
  totalDistanceOutPossession: number;
}

export interface PhysicalTeamSummary {
  teamId: string;
  teamName: string;
  totalDistance: number;
  topSpeed: number;
  distanceSprinting: number;
  distanceHighSpeedRunning: number;
  countSprinting: number;
  avgSpeed: number;
}

// ── Mock Tracking Frame (72'14) ────────────────────────────────────────────────

export const TRACKING_FRAME: TrackingFrame = {
  frameIdx: 260540,
  period: 2,
  gameClock: 4334,   // 72'14
  wallClock: Date.now(),
  live: true,
  lastTouch: "home",
  ball: { x: 0.62, y: 0.28, speed: 14.3 },
  homePlayers: [
    { playerId: "p1",  optaId: "o1",  number: 61, name: "P.M. Sy",         position: "GB",  x: 0.50, y: 0.93, speed: 0.4  },
    { playerId: "p2",  optaId: "o2",  number: 15, name: "T. Yegbe",         position: "DCG", x: 0.35, y: 0.84, speed: 1.2  },
    { playerId: "p3",  optaId: "o3",  number: 38, name: "S. Sané",          position: "DCD", x: 0.65, y: 0.84, speed: 2.1  },
    { playerId: "p4",  optaId: "o4",  number: 4,  name: "U. Mboula",        position: "LG",  x: 0.15, y: 0.82, speed: 0.0  }, // subbed off at 57'
    { playerId: "p5",  optaId: "o5",  number: 39, name: "K. Kouao",         position: "LD",  x: 0.85, y: 0.75, speed: 4.8  },
    { playerId: "p6",  optaId: "o6",  number: 20, name: "J. Deminguet",     position: "MDC", x: 0.38, y: 0.72, speed: 3.3  },
    { playerId: "p7",  optaId: "o7",  number: 5,  name: "JP. Gbamin",       position: "MDC", x: 0.62, y: 0.68, speed: 5.1  },
    { playerId: "p8",  optaId: "o8",  number: 7,  name: "G. Tsitaishvili",  position: "AG",  x: 0.22, y: 0.44, speed: 6.7  },
    { playerId: "p9",  optaId: "o9",  number: 10, name: "G. Hein",          position: "MO",  x: 0.54, y: 0.38, speed: 2.2  },
    { playerId: "p10", optaId: "o10", number: 34, name: "N. Mbala",         position: "AD",  x: 0.78, y: 0.42, speed: 7.2  },
    { playerId: "p11", optaId: "o11", number: 11, name: "G. Kvilitaia",     position: "AC",  x: 0.50, y: 0.28, speed: 3.8  },
  ],
  awayPlayers: [
    { playerId: "a1",  optaId: "ao1",  number: 16, name: "O. Nkambadio", position: "GB",  x: 0.50, y: 0.07, speed: 0.2  },
    { playerId: "a2",  optaId: "ao2",  number: 6,  name: "Otávio",       position: "DCG", x: 0.35, y: 0.16, speed: 1.8  },
    { playerId: "a3",  optaId: "ao3",  number: 42, name: "D. Coppola",   position: "DCD", x: 0.65, y: 0.16, speed: 1.4  },
    { playerId: "a4",  optaId: "ao4",  number: 28, name: "T. De Smet",   position: "LG",  x: 0.14, y: 0.20, speed: 3.9  },
    { playerId: "a5",  optaId: "ao5",  number: 14, name: "H. Traoré",    position: "LD",  x: 0.86, y: 0.20, speed: 4.2  },
    { playerId: "a6",  optaId: "ao6",  number: 31, name: "S. Chergui",   position: "MDC", x: 0.40, y: 0.30, speed: 2.6  },
    { playerId: "a7",  optaId: "ao7",  number: 23, name: "R. Matondo",   position: "MDC", x: 0.60, y: 0.32, speed: 1.9  },
    { playerId: "a8",  optaId: "ao8",  number: 24, name: "L. Koleosho",  position: "AG",  x: 0.16, y: 0.44, speed: 5.3  },
    { playerId: "a9",  optaId: "ao9",  number: 10, name: "I. Kebbal",    position: "MO",  x: 0.48, y: 0.42, speed: 4.1  },
    { playerId: "a10", optaId: "ao10", number: 7,  name: "A. Gory",      position: "AD",  x: 0.82, y: 0.46, speed: 6.8  },
    { playerId: "a11", optaId: "ao11", number: 9,  name: "W. Geubbels",  position: "AC",  x: 0.50, y: 0.55, speed: 2.3  },
  ],
};

// ── Mock Physical Summary (Metz, period=100) ───────────────────────────────────

export const PHYSICAL_METZ: PhysicalPlayer[] = [
  {
    playerId: "p1", number: 61, name: "Pape Mamadou Sy", position: "GB", minutesPlayed: 90,
    totalDistance: 5820, distanceWalking: 2100, distanceJogging: 2050, distanceLowSpeedRunning: 1040,
    distanceHighSpeedRunning: 380, distanceSprinting: 250, countSprinting: 5, topSpeed: 21.4, avgSpeed: 3.8,
    percentDistanceWalking: 36.1, percentDistanceJogging: 35.2, percentDistanceLowSpeedRunning: 17.9,
    percentDistanceHighSpeedRunning: 6.5, percentDistanceSprinting: 4.3,
    totalDistanceInPlay: 4200, distanceSprintingInPlay: 180, distanceHighSpeedRunningInPlay: 290,
    totalDistanceInPossession: 2100, totalDistanceOutPossession: 1900,
  },
  {
    playerId: "p2", number: 15, name: "Terry Yegbe", position: "DCG", minutesPlayed: 74,
    totalDistance: 7180, distanceWalking: 1820, distanceJogging: 2580, distanceLowSpeedRunning: 1720,
    distanceHighSpeedRunning: 680, distanceSprinting: 380, countSprinting: 11, topSpeed: 30.8, avgSpeed: 5.8,
    percentDistanceWalking: 25.3, percentDistanceJogging: 35.9, percentDistanceLowSpeedRunning: 24.0,
    percentDistanceHighSpeedRunning: 9.5, percentDistanceSprinting: 5.3,
    totalDistanceInPlay: 6100, distanceSprintingInPlay: 310, distanceHighSpeedRunningInPlay: 560,
    totalDistanceInPossession: 3100, totalDistanceOutPossession: 2700,
  },
  {
    playerId: "p3", number: 38, name: "Sadibou Sané", position: "DCD", minutesPlayed: 90,
    totalDistance: 9150, distanceWalking: 2010, distanceJogging: 3200, distanceLowSpeedRunning: 2380,
    distanceHighSpeedRunning: 1040, distanceSprinting: 520, countSprinting: 16, topSpeed: 30.2, avgSpeed: 6.0,
    percentDistanceWalking: 22.0, percentDistanceJogging: 35.0, percentDistanceLowSpeedRunning: 26.0,
    percentDistanceHighSpeedRunning: 11.4, percentDistanceSprinting: 5.7,
    totalDistanceInPlay: 7900, distanceSprintingInPlay: 440, distanceHighSpeedRunningInPlay: 890,
    totalDistanceInPossession: 4000, totalDistanceOutPossession: 3600,
  },
  {
    playerId: "p4", number: 4, name: "Urie-Michel Mboula", position: "LG", minutesPlayed: 57,
    totalDistance: 5390, distanceWalking: 1200, distanceJogging: 1920, distanceLowSpeedRunning: 1380,
    distanceHighSpeedRunning: 520, distanceSprinting: 370, countSprinting: 11, topSpeed: 29.6, avgSpeed: 5.6,
    percentDistanceWalking: 22.3, percentDistanceJogging: 35.6, percentDistanceLowSpeedRunning: 25.6,
    percentDistanceHighSpeedRunning: 9.6, percentDistanceSprinting: 6.9,
    totalDistanceInPlay: 4600, distanceSprintingInPlay: 300, distanceHighSpeedRunningInPlay: 430,
    totalDistanceInPossession: 2300, totalDistanceOutPossession: 2100,
  },
  {
    playerId: "p5", number: 39, name: "Koffi Franck Kouao", position: "LD", minutesPlayed: 90,
    totalDistance: 10230, distanceWalking: 2050, distanceJogging: 3460, distanceLowSpeedRunning: 2820,
    distanceHighSpeedRunning: 1280, distanceSprinting: 620, countSprinting: 19, topSpeed: 31.4, avgSpeed: 6.7,
    percentDistanceWalking: 20.0, percentDistanceJogging: 33.8, percentDistanceLowSpeedRunning: 27.6,
    percentDistanceHighSpeedRunning: 12.5, percentDistanceSprinting: 6.1,
    totalDistanceInPlay: 8900, distanceSprintingInPlay: 540, distanceHighSpeedRunningInPlay: 1100,
    totalDistanceInPossession: 4500, totalDistanceOutPossession: 4000,
  },
  {
    playerId: "p6", number: 20, name: "Jessy Deminguet", position: "MDC", minutesPlayed: 74,
    totalDistance: 7610, distanceWalking: 1620, distanceJogging: 2720, distanceLowSpeedRunning: 2060,
    distanceHighSpeedRunning: 770, distanceSprinting: 440, countSprinting: 13, topSpeed: 29.1, avgSpeed: 6.1,
    percentDistanceWalking: 21.3, percentDistanceJogging: 35.7, percentDistanceLowSpeedRunning: 27.1,
    percentDistanceHighSpeedRunning: 10.1, percentDistanceSprinting: 5.8,
    totalDistanceInPlay: 6600, distanceSprintingInPlay: 380, distanceHighSpeedRunningInPlay: 660,
    totalDistanceInPossession: 3400, totalDistanceOutPossession: 2900,
  },
  {
    playerId: "p7", number: 5, name: "Jean-Philippe Gbamin", position: "MDC", minutesPlayed: 90,
    totalDistance: 9820, distanceWalking: 1980, distanceJogging: 3380, distanceLowSpeedRunning: 2710,
    distanceHighSpeedRunning: 1170, distanceSprinting: 580, countSprinting: 17, topSpeed: 28.7, avgSpeed: 6.5,
    percentDistanceWalking: 20.2, percentDistanceJogging: 34.4, percentDistanceLowSpeedRunning: 27.6,
    percentDistanceHighSpeedRunning: 11.9, percentDistanceSprinting: 5.9,
    totalDistanceInPlay: 8500, distanceSprintingInPlay: 490, distanceHighSpeedRunningInPlay: 990,
    totalDistanceInPossession: 4300, totalDistanceOutPossession: 3800,
  },
  {
    playerId: "p8", number: 7, name: "Georgiy Tsitaishvili", position: "AG", minutesPlayed: 90,
    totalDistance: 11180, distanceWalking: 1960, distanceJogging: 3680, distanceLowSpeedRunning: 3100,
    distanceHighSpeedRunning: 1630, distanceSprinting: 810, countSprinting: 24, topSpeed: 32.9, avgSpeed: 7.3,
    percentDistanceWalking: 17.5, percentDistanceJogging: 32.9, percentDistanceLowSpeedRunning: 27.7,
    percentDistanceHighSpeedRunning: 14.6, percentDistanceSprinting: 7.2,
    totalDistanceInPlay: 9800, distanceSprintingInPlay: 710, distanceHighSpeedRunningInPlay: 1420,
    totalDistanceInPossession: 5100, totalDistanceOutPossession: 4300,
  },
  {
    playerId: "p9", number: 10, name: "Gauthier Hein", position: "MO", minutesPlayed: 90,
    totalDistance: 10390, distanceWalking: 2070, distanceJogging: 3520, distanceLowSpeedRunning: 2870,
    distanceHighSpeedRunning: 1230, distanceSprinting: 700, countSprinting: 21, topSpeed: 31.8, avgSpeed: 6.8,
    percentDistanceWalking: 19.9, percentDistanceJogging: 33.9, percentDistanceLowSpeedRunning: 27.6,
    percentDistanceHighSpeedRunning: 11.8, percentDistanceSprinting: 6.7,
    totalDistanceInPlay: 9000, distanceSprintingInPlay: 600, distanceHighSpeedRunningInPlay: 1060,
    totalDistanceInPossession: 4700, totalDistanceOutPossession: 4000,
  },
  {
    playerId: "p10", number: 34, name: "Nathan Mbala", position: "AD", minutesPlayed: 74,
    totalDistance: 8130, distanceWalking: 1710, distanceJogging: 2820, distanceLowSpeedRunning: 2200,
    distanceHighSpeedRunning: 750, distanceSprinting: 650, countSprinting: 20, topSpeed: 33.1, avgSpeed: 6.5,
    percentDistanceWalking: 21.0, percentDistanceJogging: 34.7, percentDistanceLowSpeedRunning: 27.1,
    percentDistanceHighSpeedRunning: 9.2, percentDistanceSprinting: 8.0,
    totalDistanceInPlay: 7100, distanceSprintingInPlay: 570, distanceHighSpeedRunningInPlay: 650,
    totalDistanceInPossession: 3600, totalDistanceOutPossession: 3200,
  },
  {
    playerId: "p11", number: 11, name: "Giorgi Kvilitaia", position: "AC", minutesPlayed: 60,
    totalDistance: 7380, distanceWalking: 1560, distanceJogging: 2620, distanceLowSpeedRunning: 2050,
    distanceHighSpeedRunning: 760, distanceSprinting: 390, countSprinting: 18, topSpeed: 30.9, avgSpeed: 6.2,
    percentDistanceWalking: 21.1, percentDistanceJogging: 35.5, percentDistanceLowSpeedRunning: 27.8,
    percentDistanceHighSpeedRunning: 10.3, percentDistanceSprinting: 5.3,
    totalDistanceInPlay: 6400, distanceSprintingInPlay: 330, distanceHighSpeedRunningInPlay: 650,
    totalDistanceInPossession: 3200, totalDistanceOutPossession: 2900,
  },
];

// ── Team Summaries ─────────────────────────────────────────────────────────────

export const TEAM_PHYSICAL: Record<"home" | "away", PhysicalTeamSummary> = {
  home: {
    teamId: "metz",
    teamName: "FC Metz",
    totalDistance: 102270,
    topSpeed: 33.1,
    distanceSprinting: 5710,
    distanceHighSpeedRunning: 10200,
    countSprinting: 175,
    avgSpeed: 6.3,
  },
  away: {
    teamId: "paris-fc",
    teamName: "Paris FC",
    totalDistance: 98140,
    topSpeed: 34.2,
    distanceSprinting: 5920,
    distanceHighSpeedRunning: 10580,
    countSprinting: 181,
    avgSpeed: 6.1,
  },
};

// ── Bench Players (not yet on pitch — no physical data) ────────────────────────

export interface BenchEntry {
  number: number;
  name: string;
  position: string;
}

export const BENCH_METZ: BenchEntry[] = [
  { number: 21, name: "B. Stambouli", position: "MDC" },
  { number: 35, name: "J. Pandore",   position: "DC"  },
  { number: 19, name: "L. Michal",    position: "AG"  },
  { number: 70, name: "R. Sarr",      position: "GB"  },
];

// ── Physical Splits (physical-splits feed, 5-min periods) ─────────────────────
// 14 periods = 0-70min (current 69')

export interface PlayerSplit {
  playerId: string;
  number: number;
  name: string;
  position: string;
  minutesPlayed: number;
  // Per 5-min period (14 periods)
  hsr5min: number[];              // distanceHighSpeedRunning per period (m)
  sprint5min: number[];           // countSprinting per period
  walkOutPoss5min: number[];      // percentTimeWalkingOutPossession per period (%)
  // Cumulative OutPossession sprint stats (for pressing tab)
  distanceSprintingOutPossession: number;
  countSprintingOutPossession: number;
  percentTimeSprintingOutPossession: number;
  // Technical Performance (last 15m) — to cross with physical drop
  touchesDangerous: number;
  duelsWon: number;
  duelsTotal: number;
  progressivePasses: number;
}


export const PHYSICAL_SPLITS_METZ: PlayerSplit[] = [
  {
    playerId: "p8", number: 7, name: "G. Tsitaishvili", position: "AG", minutesPlayed: 69,
    hsr5min:        [185, 175, 170, 165, 162, 155, 148, 140, 130, 120, 108, 88, 72, 58],
    sprint5min:     [  5,   5,   4,   5,   4,   4,   4,   4,   3,   3,   3,  2,  2,  1],
    walkOutPoss5min:[20,  21,  23,  24,  25,  27,  28,  30,  33,  36,  40, 44, 48, 52],
    distanceSprintingOutPossession: 310, countSprintingOutPossession: 8, percentTimeSprintingOutPossession: 4.6,
    touchesDangerous: 2, duelsWon: 1, duelsTotal: 5, progressivePasses: 0,
  },
  {
    playerId: "p5", number: 39, name: "K. Kouao", position: "LD", minutesPlayed: 69,
    hsr5min:        [158, 150, 152, 145, 142, 140, 136, 130, 125, 118, 112, 105, 97, 90],
    sprint5min:     [  4,   5,   4,   4,   4,   4,   3,   3,   3,   3,   2,   2,  2,  2],
    walkOutPoss5min:[18,  20,  21,  22,  23,  24,  26,  28,  30,  32,  34, 36, 38, 40],
    distanceSprintingOutPossession: 245, countSprintingOutPossession: 7, percentTimeSprintingOutPossession: 5.2,
    touchesDangerous: 1, duelsWon: 3, duelsTotal: 4, progressivePasses: 2,
  },
  {
    playerId: "p9", number: 10, name: "G. Hein", position: "MO", minutesPlayed: 69,
    hsr5min:        [168, 158, 162, 153, 148, 142, 136, 128, 122, 116, 108, 99, 88, 78],
    sprint5min:     [  5,   4,   4,   4,   4,   3,   3,   3,   3,   2,   2,  2,  2,  2],
    walkOutPoss5min:[22,  23,  24,  25,  26,  28,  30,  32,  34,  36,  39, 42, 46, 50],
    distanceSprintingOutPossession: 280, countSprintingOutPossession: 8, percentTimeSprintingOutPossession: 4.2,
    touchesDangerous: 5, duelsWon: 2, duelsTotal: 3, progressivePasses: 4,
  },
  {
    playerId: "p6", number: 20, name: "J. Deminguet", position: "MDC", minutesPlayed: 69,
    hsr5min:        [128, 122, 120, 115, 110, 108, 102, 95, 88, 80, 68, 55, 44, 38],
    sprint5min:     [  3,   3,   3,   3,   3,   2,   2,  2,  2,  2,  1,  1,  1,  1],
    walkOutPoss5min:[18,  20,  22,  25,  28,  32,  36, 40, 46, 52, 58, 62, 65, 68],
    distanceSprintingOutPossession: 180, countSprintingOutPossession: 4, percentTimeSprintingOutPossession: 2.8,
    touchesDangerous: 0, duelsWon: 0, duelsTotal: 4, progressivePasses: 0,
  },
  {
    playerId: "p7", number: 5, name: "JP. Gbamin", position: "MDC", minutesPlayed: 69,
    hsr5min:        [128, 120, 122, 118, 115, 112, 108, 104, 100, 96, 92, 88, 84, 80],
    sprint5min:     [  3,   3,   3,   3,   3,   3,   2,   2,   2,  2,  2,  2,  2,  2],
    walkOutPoss5min:[20,  21,  22,  23,  24,  25,  26,  27,  28, 29, 30, 31, 32, 33],
    distanceSprintingOutPossession: 220, countSprintingOutPossession: 6, percentTimeSprintingOutPossession: 4.8,
    touchesDangerous: 1, duelsWon: 4, duelsTotal: 5, progressivePasses: 3,
  },
  {
    playerId: "p3", number: 38, name: "S. Sané", position: "DCD", minutesPlayed: 69,
    hsr5min:        [120, 112, 115, 108, 105, 102, 98, 94, 90, 86, 82, 78, 74, 70],
    sprint5min:     [  3,   3,   2,   3,   2,   2,  2,  2,  2,  2,  2,  2,  1,  1],
    walkOutPoss5min:[28,  29,  30,  30,  31,  31,  32, 32, 33, 33, 34, 34, 35, 35],
    distanceSprintingOutPossession: 195, countSprintingOutPossession: 5, percentTimeSprintingOutPossession: 3.8,
    touchesDangerous: 0, duelsWon: 5, duelsTotal: 6, progressivePasses: 1,
  },
  {
    playerId: "p10", number: 34, name: "N. Mbala", position: "AD", minutesPlayed: 69,
    hsr5min:        [175, 168, 165, 158, 152, 148, 140, 132, 124, 116, 108, 98, 88, 76],
    sprint5min:     [  5,   4,   4,   4,   4,   4,   3,   3,   3,   3,   2,  2,  2,  2],
    walkOutPoss5min:[19,  20,  22,  23,  24,  25,  27,  29,  31,  33,  35, 38, 41, 44],
    distanceSprintingOutPossession: 268, countSprintingOutPossession: 7, percentTimeSprintingOutPossession: 4.5,
    touchesDangerous: 3, duelsWon: 2, duelsTotal: 4, progressivePasses: 1,
  },
  {
    playerId: "p11", number: 11, name: "G. Kvilitaia", position: "AC", minutesPlayed: 39,
    hsr5min:        [0, 0, 0, 0, 0, 0, 160, 148, 140, 132, 124, 114, 102, 88],
    sprint5min:     [0, 0, 0, 0, 0, 0,   4,   4,   3,   3,   3,   2,   2,  2],
    walkOutPoss5min:[0, 0, 0, 0, 0, 0,  22,  24,  26,  28,  30,  33,  36, 40],
    distanceSprintingOutPossession: 180, countSprintingOutPossession: 5, percentTimeSprintingOutPossession: 4.1,
    touchesDangerous: 4, duelsWon: 1, duelsTotal: 2, progressivePasses: 0,
  },

];

// ── Insight Shots (insight feed — optaEvent + 2sMarking) ──────────────────────

export type ShotOutcome = "goal" | "saved" | "blocked" | "wide";

export interface InsightShot {
  id: string;
  minute: number;
  team: "home" | "away";
  playerName: string;
  shotX: number;        // 0–1 pitch width
  shotY: number;        // 0–1 pitch height
  xG: number;           // from 2sMarking.markingType.xG
  numDefGoalside: number;
  keeperInitialDist: number; // meters
  shooterDefDist: number;    // meters
  goalDist: number;          // meters
  outcome: ShotOutcome;
}

export const INSIGHT_SHOTS: InsightShot[] = [
  // 21' — Gory (Paris) GOAL — counter-attack, no defender between shooter and goal
  { id: "s1", minute: 21, team: "away",  playerName: "A. Gory",
    shotX: 0.72, shotY: 0.28, xG: 0.24, numDefGoalside: 0,
    keeperInitialDist: 8.2, shooterDefDist: 4.1, goalDist: 18.4, outcome: "goal" },

  // 27' — Kvilitaia (Metz) saved — central, keeper well-positioned
  { id: "s2", minute: 27, team: "home",  playerName: "G. Kvilitaia",
    shotX: 0.48, shotY: 0.22, xG: 0.09, numDefGoalside: 2,
    keeperInitialDist: 3.4, shooterDefDist: 2.9, goalDist: 24.8, outcome: "saved" },

  // 31' — Diallo (Metz) GOAL — corner header, 1 defender but disorganised
  { id: "s3", minute: 31, team: "home",  playerName: "H. Diallo",
    shotX: 0.52, shotY: 0.18, xG: 0.38, numDefGoalside: 1,
    keeperInitialDist: 2.8, shooterDefDist: 1.2, goalDist: 7.2, outcome: "goal" },

  // 38' — Hein (Metz) blocked — long shot, 3 defenders
  { id: "s4", minute: 38, team: "home",  playerName: "G. Hein",
    shotX: 0.50, shotY: 0.30, xG: 0.06, numDefGoalside: 3,
    keeperInitialDist: 7.1, shooterDefDist: 8.4, goalDist: 26.1, outcome: "blocked" },

  // 44' — Kebbal (Paris) saved — medium threat
  { id: "s5", minute: 44, team: "away",  playerName: "I. Kebbal",
    shotX: 0.55, shotY: 0.34, xG: 0.12, numDefGoalside: 2,
    keeperInitialDist: 4.8, shooterDefDist: 7.2, goalDist: 21.6, outcome: "saved" },

  // 52' — Tsitaishvili (Metz) wide — good position but poor finish
  { id: "s6", minute: 52, team: "home",  playerName: "G. Tsitaishvili",
    shotX: 0.22, shotY: 0.20, xG: 0.21, numDefGoalside: 1,
    keeperInitialDist: 5.6, shooterDefDist: 5.1, goalDist: 15.9, outcome: "wide" },

  // 61' — Kvilitaia (Metz) saved — high xG close-range
  { id: "s7", minute: 61, team: "home",  playerName: "G. Kvilitaia",
    shotX: 0.50, shotY: 0.14, xG: 0.48, numDefGoalside: 1,
    keeperInitialDist: 2.1, shooterDefDist: 3.4, goalDist: 6.8, outcome: "saved" },

  // 69' — Kebbal (Paris) GOAL — keeper out of position, 0 defenders
  { id: "s8", minute: 69, team: "away",  playerName: "I. Kebbal",
    shotX: 0.58, shotY: 0.26, xG: 0.41, numDefGoalside: 0,
    keeperInitialDist: 10.2, shooterDefDist: 5.8, goalDist: 16.2, outcome: "goal" },
];
