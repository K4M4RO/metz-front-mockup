// ── Enzo Millot — Event Map data (all 7 types) ───────────────────────────────

export interface ShotEv {
  id: number; x: number; y: number; xG: number;
  minute: number; foot: "D" | "G" | "T"; tags: string[];
}
export interface PassEv {
  id: number; x1: number; y1: number; x2: number; y2: number;
  minute: number; distance: number; tags: string[];
}
export interface PressionEv {
  id: number; x: number; y: number; minute: number; speed: number; tags: string[];
}
export interface DuelEv {
  id: number; x: number; y: number; minute: number; tags: string[];
}
export interface CarryEv {
  id: number; x1: number; y1: number; x2: number; y2: number;
  minute: number; distance: number; tags: string[];
}
export interface DefEv {
  id: number; x: number; y: number; minute: number; importance: number; tags: string[];
}
export interface TouchEv {
  id: number; x: number; y: number; tags: string[];
}

// ── Shots — 25 events ─────────────────────────────────────────────────────────
export const EM_SHOTS: ShotEv[] = [
  // Goals
  { id:  1, x: 0.80, y: 0.48, xG: 0.18, minute: 23, foot: "D", tags: ["but"] },
  { id:  2, x: 0.78, y: 0.43, xG: 0.22, minute: 67, foot: "D", tags: ["but"] },
  { id:  3, x: 0.76, y: 0.55, xG: 0.14, minute: 12, foot: "G", tags: ["but"] },
  { id:  4, x: 0.86, y: 0.49, xG: 0.37, minute: 81, foot: "D", tags: ["but"] },
  { id:  5, x: 0.82, y: 0.52, xG: 0.08, minute: 44, foot: "T", tags: ["but"] },
  { id:  6, x: 0.73, y: 0.46, xG: 0.12, minute: 58, foot: "D", tags: ["but"] },
  { id:  7, x: 0.79, y: 0.44, xG: 0.20, minute: 35, foot: "G", tags: ["but"] },
  // Saved
  { id:  8, x: 0.83, y: 0.40, xG: 0.25, minute: 17, foot: "D", tags: ["arrete"] },
  { id:  9, x: 0.77, y: 0.57, xG: 0.12, minute: 34, foot: "D", tags: ["arrete"] },
  { id: 10, x: 0.89, y: 0.50, xG: 0.43, minute: 71, foot: "D", tags: ["arrete"] },
  { id: 11, x: 0.75, y: 0.43, xG: 0.15, minute: 26, foot: "G", tags: ["arrete"] },
  { id: 12, x: 0.83, y: 0.55, xG: 0.18, minute: 53, foot: "D", tags: ["arrete"] },
  { id: 13, x: 0.71, y: 0.46, xG: 0.08, minute: 62, foot: "D", tags: ["arrete"] },
  { id: 14, x: 0.87, y: 0.46, xG: 0.31, minute: 88, foot: "D", tags: ["arrete"] },
  { id: 15, x: 0.79, y: 0.52, xG: 0.14, minute: 41, foot: "T", tags: ["arrete"] },
  // Missed
  { id: 16, x: 0.74, y: 0.38, xG: 0.07, minute: 29, foot: "D", tags: ["manque"] },
  { id: 17, x: 0.69, y: 0.59, xG: 0.05, minute: 48, foot: "D", tags: ["manque"] },
  { id: 18, x: 0.77, y: 0.63, xG: 0.06, minute: 74, foot: "G", tags: ["manque"] },
  { id: 19, x: 0.65, y: 0.48, xG: 0.04, minute: 15, foot: "D", tags: ["manque"] },
  { id: 20, x: 0.81, y: 0.35, xG: 0.09, minute: 83, foot: "D", tags: ["manque"] },
  { id: 21, x: 0.72, y: 0.53, xG: 0.11, minute: 56, foot: "G", tags: ["manque"] },
  // Blocked
  { id: 22, x: 0.80, y: 0.45, xG: 0.16, minute: 38, foot: "D", tags: ["bloque"] },
  { id: 23, x: 0.77, y: 0.54, xG: 0.13, minute: 77, foot: "D", tags: ["bloque"] },
  // Post
  { id: 24, x: 0.84, y: 0.43, xG: 0.28, minute: 51, foot: "D", tags: ["poteau"] },
  { id: 25, x: 0.76, y: 0.50, xG: 0.21, minute: 68, foot: "G", tags: ["poteau"] },
];

// ── Passes — 30 events ────────────────────────────────────────────────────────
export const EM_PASSES: PassEv[] = [
  // Short passes — réussies
  { id:  1, x1:0.42,y1:0.48, x2:0.46,y2:0.44, minute:  8, distance:  7, tags:["reussie","courte"] },
  { id:  2, x1:0.38,y1:0.35, x2:0.40,y2:0.42, minute: 22, distance:  8, tags:["reussie","courte"] },
  { id:  3, x1:0.55,y1:0.52, x2:0.57,y2:0.45, minute: 45, distance:  9, tags:["reussie","courte"] },
  { id:  4, x1:0.47,y1:0.61, x2:0.50,y2:0.55, minute: 67, distance: 10, tags:["reussie","courte"] },
  { id:  5, x1:0.53,y1:0.44, x2:0.50,y2:0.48, minute:  5, distance:  6, tags:["reussie","courte"] },
  // Short passes — ratées
  { id:  6, x1:0.44,y1:0.38, x2:0.42,y2:0.44, minute: 73, distance:  7, tags:["ratee","courte"] },
  { id:  7, x1:0.47,y1:0.43, x2:0.45,y2:0.38, minute: 28, distance:  8, tags:["ratee","courte"] },
  // Medium progressive passes
  { id:  8, x1:0.40,y1:0.50, x2:0.52,y2:0.42, minute: 11, distance: 18, tags:["reussie","moyenne","progressive"] },
  { id:  9, x1:0.48,y1:0.44, x2:0.58,y2:0.48, minute: 27, distance: 16, tags:["reussie","moyenne","progressive"] },
  { id: 10, x1:0.45,y1:0.60, x2:0.55,y2:0.55, minute: 59, distance: 16, tags:["reussie","moyenne"] },
  { id: 11, x1:0.46,y1:0.42, x2:0.60,y2:0.38, minute: 84, distance: 20, tags:["reussie","moyenne","progressive"] },
  { id: 12, x1:0.42,y1:0.48, x2:0.54,y2:0.44, minute: 42, distance: 18, tags:["reussie","moyenne","progressive"] },
  { id: 13, x1:0.44,y1:0.50, x2:0.56,y2:0.48, minute: 86, distance: 17, tags:["reussie","moyenne"] },
  { id: 14, x1:0.38,y1:0.48, x2:0.50,y2:0.53, minute: 71, distance: 18, tags:["ratee","moyenne"] },
  { id: 15, x1:0.35,y1:0.55, x2:0.48,y2:0.38, minute: 33, distance: 22, tags:["reussie","moyenne"] },
  // Long passes
  { id: 16, x1:0.36,y1:0.52, x2:0.72,y2:0.20, minute: 14, distance: 42, tags:["reussie","longue","profondeur"] },
  { id: 17, x1:0.42,y1:0.48, x2:0.75,y2:0.75, minute: 38, distance: 40, tags:["reussie","longue"] },
  { id: 18, x1:0.40,y1:0.45, x2:0.78,y2:0.30, minute: 52, distance: 48, tags:["ratee","longue"] },
  { id: 19, x1:0.44,y1:0.50, x2:0.80,y2:0.55, minute: 63, distance: 45, tags:["reussie","longue","decisive"] },
  { id: 20, x1:0.38,y1:0.42, x2:0.70,y2:0.25, minute: 77, distance: 38, tags:["ratee","longue"] },
  // Progressive
  { id: 21, x1:0.45,y1:0.47, x2:0.62,y2:0.43, minute: 18, distance: 24, tags:["reussie","moyenne","progressive"] },
  { id: 22, x1:0.50,y1:0.50, x2:0.65,y2:0.48, minute: 31, distance: 21, tags:["reussie","moyenne","progressive"] },
  { id: 23, x1:0.48,y1:0.56, x2:0.63,y2:0.53, minute: 55, distance: 22, tags:["ratee","moyenne","progressive"] },
  // Decisive / key passes
  { id: 24, x1:0.54,y1:0.50, x2:0.72,y2:0.44, minute: 23, distance: 28, tags:["reussie","moyenne","decisive"] },
  { id: 25, x1:0.52,y1:0.45, x2:0.75,y2:0.53, minute: 67, distance: 32, tags:["reussie","longue","decisive"] },
  // Depth passes
  { id: 26, x1:0.44,y1:0.48, x2:0.73,y2:0.27, minute: 41, distance: 36, tags:["reussie","longue","profondeur"] },
  { id: 27, x1:0.46,y1:0.52, x2:0.69,y2:0.70, minute: 79, distance: 33, tags:["reussie","longue","profondeur"] },
  { id: 28, x1:0.48,y1:0.47, x2:0.66,y2:0.32, minute: 19, distance: 30, tags:["reussie","longue","profondeur"] },
  // Extra medium
  { id: 29, x1:0.40,y1:0.40, x2:0.52,y2:0.36, minute: 61, distance: 18, tags:["reussie","moyenne","progressive"] },
  { id: 30, x1:0.43,y1:0.55, x2:0.53,y2:0.58, minute: 88, distance: 15, tags:["reussie","moyenne"] },
];

// ── Pressions — 25 events ─────────────────────────────────────────────────────
export const EM_PRESSIONS: PressionEv[] = [
  // High press (x > 0.65) — réussies
  { id:  1, x:0.78, y:0.42, minute:  9, speed:0.9, tags:["reussie","haute"] },
  { id:  2, x:0.82, y:0.55, minute: 21, speed:0.8, tags:["reussie","haute"] },
  { id:  3, x:0.72, y:0.38, minute: 37, speed:0.7, tags:["reussie","haute"] },
  { id:  4, x:0.75, y:0.60, minute: 54, speed:0.8, tags:["reussie","haute"] },
  { id:  5, x:0.80, y:0.48, minute: 70, speed:0.9, tags:["reussie","haute"] },
  // High press — ratées
  { id:  6, x:0.76, y:0.35, minute: 16, speed:0.6, tags:["ratee","haute"] },
  { id:  7, x:0.83, y:0.52, minute: 43, speed:0.7, tags:["ratee","haute"] },
  { id:  8, x:0.70, y:0.62, minute: 79, speed:0.5, tags:["ratee","haute"] },
  // Mid press (x 0.50-0.65) — réussies
  { id:  9, x:0.58, y:0.45, minute: 13, speed:0.7, tags:["reussie","basse"] },
  { id: 10, x:0.62, y:0.55, minute: 29, speed:0.6, tags:["reussie","basse"] },
  { id: 11, x:0.55, y:0.40, minute: 47, speed:0.8, tags:["reussie","basse"] },
  { id: 12, x:0.60, y:0.60, minute: 65, speed:0.7, tags:["reussie","basse"] },
  { id: 13, x:0.53, y:0.50, minute: 82, speed:0.6, tags:["reussie","basse"] },
  // Mid press — ratées
  { id: 14, x:0.57, y:0.48, minute: 24, speed:0.5, tags:["ratee","basse"] },
  { id: 15, x:0.63, y:0.38, minute: 56, speed:0.4, tags:["ratee","basse"] },
  { id: 16, x:0.60, y:0.63, minute: 74, speed:0.5, tags:["ratee","basse"] },
  // Counterpressure
  { id: 17, x:0.48, y:0.52, minute:  7, speed:1.0, tags:["contrepression"] },
  { id: 18, x:0.55, y:0.45, minute: 19, speed:0.9, tags:["contrepression"] },
  { id: 19, x:0.62, y:0.55, minute: 33, speed:0.9, tags:["contrepression"] },
  { id: 20, x:0.50, y:0.40, minute: 48, speed:1.0, tags:["contrepression"] },
  { id: 21, x:0.58, y:0.60, minute: 61, speed:0.8, tags:["contrepression"] },
  { id: 22, x:0.66, y:0.48, minute: 72, speed:0.9, tags:["contrepression"] },
  // Extra
  { id: 23, x:0.69, y:0.42, minute: 85, speed:0.6, tags:["reussie","haute"] },
  { id: 24, x:0.74, y:0.56, minute: 31, speed:0.7, tags:["ratee","haute"] },
  { id: 25, x:0.52, y:0.48, minute: 58, speed:0.8, tags:["contrepression"] },
];

// ── Duels — 25 events ─────────────────────────────────────────────────────────
export const EM_DUELS: DuelEv[] = [
  // Aerial — won
  { id:  1, x:0.50, y:0.30, minute: 11, tags:["gagne","aerien","defensif"] },
  { id:  2, x:0.42, y:0.45, minute: 27, tags:["gagne","aerien","defensif"] },
  { id:  3, x:0.68, y:0.35, minute: 44, tags:["gagne","aerien","offensif"] },
  { id:  4, x:0.55, y:0.62, minute: 61, tags:["gagne","aerien","offensif"] },
  { id:  5, x:0.38, y:0.38, minute: 77, tags:["gagne","aerien","defensif"] },
  // Aerial — lost
  { id:  6, x:0.45, y:0.40, minute:  8, tags:["perdu","aerien","defensif"] },
  { id:  7, x:0.60, y:0.55, minute: 35, tags:["perdu","aerien","offensif"] },
  { id:  8, x:0.33, y:0.48, minute: 52, tags:["perdu","aerien","defensif"] },
  { id:  9, x:0.65, y:0.40, minute: 69, tags:["perdu","aerien","offensif"] },
  // Ground — won
  { id: 10, x:0.48, y:0.52, minute: 14, tags:["gagne","sol","defensif"] },
  { id: 11, x:0.55, y:0.45, minute: 23, tags:["gagne","sol","offensif"] },
  { id: 12, x:0.40, y:0.55, minute: 39, tags:["gagne","sol","defensif"] },
  { id: 13, x:0.62, y:0.48, minute: 55, tags:["gagne","sol","offensif"] },
  { id: 14, x:0.35, y:0.42, minute: 72, tags:["gagne","sol","defensif"] },
  { id: 15, x:0.70, y:0.52, minute: 86, tags:["gagne","sol","offensif"] },
  { id: 16, x:0.45, y:0.35, minute:  6, tags:["gagne","sol","defensif"] },
  { id: 17, x:0.58, y:0.58, minute: 31, tags:["gagne","sol","offensif"] },
  // Ground — lost
  { id: 18, x:0.52, y:0.48, minute: 18, tags:["perdu","sol","defensif"] },
  { id: 19, x:0.43, y:0.60, minute: 42, tags:["perdu","sol","offensif"] },
  { id: 20, x:0.65, y:0.42, minute: 58, tags:["perdu","sol","offensif"] },
  { id: 21, x:0.36, y:0.52, minute: 75, tags:["perdu","sol","defensif"] },
  { id: 22, x:0.55, y:0.38, minute: 88, tags:["perdu","sol","defensif"] },
  // Extra
  { id: 23, x:0.47, y:0.45, minute: 48, tags:["gagne","sol","offensif"] },
  { id: 24, x:0.63, y:0.55, minute: 64, tags:["perdu","aerien","defensif"] },
  { id: 25, x:0.40, y:0.48, minute: 82, tags:["gagne","sol","defensif"] },
];

// ── Carries / Conduites — 25 events ──────────────────────────────────────────
export const EM_CARRIES: CarryEv[] = [
  // Progressive carries
  { id:  1, x1:0.38,y1:0.48, x2:0.52,y2:0.46, minute: 10, distance:18, tags:["progressive","conservee"] },
  { id:  2, x1:0.43,y1:0.45, x2:0.57,y2:0.43, minute: 24, distance:20, tags:["progressive","conservee"] },
  { id:  3, x1:0.40,y1:0.55, x2:0.54,y2:0.52, minute: 37, distance:19, tags:["progressive","conservee"] },
  { id:  4, x1:0.45,y1:0.42, x2:0.62,y2:0.40, minute: 51, distance:24, tags:["progressive","conservee"] },
  { id:  5, x1:0.35,y1:0.50, x2:0.50,y2:0.48, minute: 63, distance:21, tags:["progressive","conservee"] },
  { id:  6, x1:0.42,y1:0.48, x2:0.58,y2:0.45, minute: 76, distance:23, tags:["progressive","conservee"] },
  { id:  7, x1:0.46,y1:0.40, x2:0.59,y2:0.38, minute: 89, distance:19, tags:["progressive","conservee"] },
  // Progressive with loss
  { id:  8, x1:0.40,y1:0.50, x2:0.55,y2:0.47, minute: 17, distance:22, tags:["progressive","perdue"] },
  { id:  9, x1:0.44,y1:0.55, x2:0.58,y2:0.53, minute: 44, distance:20, tags:["progressive","perdue"] },
  // Lateral carries
  { id: 10, x1:0.50,y1:0.45, x2:0.50,y2:0.58, minute:  8, distance:12, tags:["laterale","conservee"] },
  { id: 11, x1:0.45,y1:0.52, x2:0.46,y2:0.39, minute: 22, distance:11, tags:["laterale","conservee"] },
  { id: 12, x1:0.55,y1:0.48, x2:0.54,y2:0.62, minute: 57, distance:13, tags:["laterale","conservee"] },
  { id: 13, x1:0.48,y1:0.55, x2:0.47,y2:0.42, minute: 71, distance:12, tags:["laterale","conservee"] },
  // Lateral with loss
  { id: 14, x1:0.52,y1:0.48, x2:0.51,y2:0.60, minute: 34, distance:11, tags:["laterale","perdue"] },
  // Backward carries
  { id: 15, x1:0.50,y1:0.48, x2:0.42,y2:0.50, minute: 16, distance:11, tags:["reculee","conservee"] },
  { id: 16, x1:0.55,y1:0.52, x2:0.46,y2:0.54, minute: 48, distance:13, tags:["reculee","conservee"] },
  { id: 17, x1:0.52,y1:0.44, x2:0.43,y2:0.46, minute: 82, distance:13, tags:["reculee","conservee"] },
  // Dribbles — successful
  { id: 18, x1:0.55,y1:0.45, x2:0.63,y2:0.43, minute: 29, distance:12, tags:["progressive","dribble_reussi","conservee"] },
  { id: 19, x1:0.52,y1:0.55, x2:0.60,y2:0.52, minute: 53, distance:12, tags:["progressive","dribble_reussi","conservee"] },
  { id: 20, x1:0.48,y1:0.42, x2:0.57,y2:0.40, minute: 68, distance:13, tags:["progressive","dribble_reussi","conservee"] },
  // Dribbles — failed
  { id: 21, x1:0.54,y1:0.48, x2:0.59,y2:0.46, minute: 13, distance: 7, tags:["progressive","dribble_rate","perdue"] },
  { id: 22, x1:0.50,y1:0.52, x2:0.55,y2:0.50, minute: 42, distance: 7, tags:["laterale","dribble_rate","perdue"] },
  { id: 23, x1:0.46,y1:0.45, x2:0.50,y2:0.43, minute: 75, distance: 6, tags:["progressive","dribble_rate","perdue"] },
  // Extra progressive
  { id: 24, x1:0.36,y1:0.45, x2:0.48,y2:0.42, minute: 60, distance:18, tags:["progressive","conservee"] },
  { id: 25, x1:0.41,y1:0.58, x2:0.53,y2:0.55, minute: 80, distance:17, tags:["progressive","conservee"] },
];

// ── Defensive actions — 25 events ─────────────────────────────────────────────
export const EM_DEFS: DefEv[] = [
  // Tackles — successful
  { id:  1, x:0.32, y:0.48, minute:  7, importance:0.8, tags:["tacle_reussi"] },
  { id:  2, x:0.40, y:0.35, minute: 22, importance:0.7, tags:["tacle_reussi"] },
  { id:  3, x:0.28, y:0.55, minute: 44, importance:0.9, tags:["tacle_reussi"] },
  { id:  4, x:0.38, y:0.42, minute: 58, importance:0.7, tags:["tacle_reussi"] },
  { id:  5, x:0.35, y:0.60, minute: 73, importance:0.6, tags:["tacle_reussi"] },
  { id:  6, x:0.45, y:0.44, minute: 87, importance:0.8, tags:["tacle_reussi"] },
  // Tackles — failed
  { id:  7, x:0.42, y:0.52, minute: 15, importance:0.5, tags:["tacle_rate"] },
  { id:  8, x:0.35, y:0.38, minute: 36, importance:0.6, tags:["tacle_rate"] },
  { id:  9, x:0.48, y:0.58, minute: 67, importance:0.5, tags:["tacle_rate"] },
  // Interceptions
  { id: 10, x:0.38, y:0.45, minute: 11, importance:0.9, tags:["interception"] },
  { id: 11, x:0.44, y:0.52, minute: 28, importance:0.8, tags:["interception"] },
  { id: 12, x:0.30, y:0.48, minute: 46, importance:0.9, tags:["interception"] },
  { id: 13, x:0.42, y:0.40, minute: 62, importance:0.7, tags:["interception"] },
  { id: 14, x:0.36, y:0.55, minute: 81, importance:0.8, tags:["interception"] },
  // Clearances
  { id: 15, x:0.20, y:0.48, minute: 19, importance:0.9, tags:["degagement"] },
  { id: 16, x:0.25, y:0.38, minute: 39, importance:0.8, tags:["degagement"] },
  { id: 17, x:0.22, y:0.58, minute: 71, importance:0.7, tags:["degagement"] },
  // Recoveries
  { id: 18, x:0.50, y:0.45, minute: 14, importance:0.6, tags:["recuperation"] },
  { id: 19, x:0.45, y:0.55, minute: 31, importance:0.7, tags:["recuperation"] },
  { id: 20, x:0.48, y:0.42, minute: 53, importance:0.6, tags:["recuperation"] },
  { id: 21, x:0.42, y:0.58, minute: 76, importance:0.7, tags:["recuperation"] },
  { id: 22, x:0.52, y:0.48, minute: 88, importance:0.6, tags:["recuperation"] },
  // Fouls provoquées
  { id: 23, x:0.55, y:0.42, minute: 26, importance:0.5, tags:["faute"] },
  { id: 24, x:0.48, y:0.55, minute: 48, importance:0.5, tags:["faute"] },
  { id: 25, x:0.54, y:0.38, minute: 84, importance:0.4, tags:["faute"] },
];

// ── Touches — 40 events ───────────────────────────────────────────────────────
export const EM_TOUCHES: TouchEv[] = [
  // Possession touches — 1st half, central + right zone
  { id:  1, x:0.48, y:0.50, tags:["possession","1eme"] },
  { id:  2, x:0.52, y:0.44, tags:["possession","1eme"] },
  { id:  3, x:0.44, y:0.48, tags:["possession","1eme"] },
  { id:  4, x:0.50, y:0.55, tags:["possession","1eme"] },
  { id:  5, x:0.55, y:0.46, tags:["possession","1eme"] },
  { id:  6, x:0.46, y:0.42, tags:["possession","1eme"] },
  { id:  7, x:0.42, y:0.52, tags:["possession","1eme"] },
  { id:  8, x:0.58, y:0.50, tags:["possession","1eme"] },
  { id:  9, x:0.49, y:0.40, tags:["possession","1eme"] },
  { id: 10, x:0.53, y:0.58, tags:["possession","1eme"] },
  { id: 11, x:0.60, y:0.45, tags:["possession","1eme"] },
  // Possession touches — 2nd half
  { id: 12, x:0.50, y:0.48, tags:["possession","2eme"] },
  { id: 13, x:0.54, y:0.42, tags:["possession","2eme"] },
  { id: 14, x:0.46, y:0.54, tags:["possession","2eme"] },
  { id: 15, x:0.56, y:0.52, tags:["possession","2eme"] },
  { id: 16, x:0.43, y:0.46, tags:["possession","2eme"] },
  { id: 17, x:0.60, y:0.48, tags:["possession","2eme"] },
  { id: 18, x:0.48, y:0.56, tags:["possession","2eme"] },
  { id: 19, x:0.52, y:0.40, tags:["possession","2eme"] },
  { id: 20, x:0.40, y:0.50, tags:["possession","2eme"] },
  { id: 21, x:0.62, y:0.52, tags:["possession","2eme"] },
  { id: 22, x:0.55, y:0.44, tags:["possession","2eme"] },
  // Out-of-possession — 1st half
  { id: 23, x:0.42, y:0.48, tags:["hors_possession","1eme"] },
  { id: 24, x:0.38, y:0.52, tags:["hors_possession","1eme"] },
  { id: 25, x:0.46, y:0.42, tags:["hors_possession","1eme"] },
  { id: 26, x:0.34, y:0.50, tags:["hors_possession","1eme"] },
  { id: 27, x:0.44, y:0.56, tags:["hors_possession","1eme"] },
  { id: 28, x:0.40, y:0.44, tags:["hors_possession","1eme"] },
  { id: 29, x:0.36, y:0.46, tags:["hors_possession","1eme"] },
  // Out-of-possession — 2nd half
  { id: 30, x:0.44, y:0.48, tags:["hors_possession","2eme"] },
  { id: 31, x:0.38, y:0.54, tags:["hors_possession","2eme"] },
  { id: 32, x:0.48, y:0.44, tags:["hors_possession","2eme"] },
  { id: 33, x:0.35, y:0.52, tags:["hors_possession","2eme"] },
  { id: 34, x:0.42, y:0.38, tags:["hors_possession","2eme"] },
  { id: 35, x:0.40, y:0.60, tags:["hors_possession","2eme"] },
  { id: 36, x:0.46, y:0.50, tags:["hors_possession","2eme"] },
  // Extra touches in attacking third
  { id: 37, x:0.64, y:0.48, tags:["possession","2eme"] },
  { id: 38, x:0.68, y:0.52, tags:["possession","2eme"] },
  { id: 39, x:0.66, y:0.44, tags:["possession","1eme"] },
  { id: 40, x:0.70, y:0.50, tags:["possession","2eme"] },
];
