export interface ShotImpact {
  id: number;
  x: number; // 0-1 (horizontal within goal)
  y: number; // 0-1 (vertical within goal)
  xg: number;
  psxg: number;
  result: "goal" | "saved" | "post";
}

export interface SniperMatch {
  id: number;
  match: string;
  date: string;
  shots: number;
  onTarget: number;
  xgTotal: number;
  psxgTotal: number;
  differential: number;
  goals: number;
}

export const FINITION_DASHBOARD = {
  psxg: 4.82,
  xg: 3.45,
  conversionRate: 24,
  sangFroid: {
    firstHalf: 0.12, // Differential PSxG-xG
    secondHalf: 0.18,
  },
  avgSpeed: 94.2,
  weakFootEfficiency: 0.08,
  avgDistance: 14.8,
};

export const SHOT_IMPACTS: ShotImpact[] = [
  { id: 1, x: 0.15, y: 0.20, xg: 0.12, psxg: 0.45, result: "goal" },
  { id: 2, x: 0.85, y: 0.25, xg: 0.08, psxg: 0.38, result: "goal" },
  { id: 3, x: 0.50, y: 0.50, xg: 0.35, psxg: 0.12, result: "saved" },
  { id: 4, x: 0.70, y: 0.80, xg: 0.15, psxg: 0.55, result: "goal" },
  { id: 5, x: 0.30, y: 0.15, xg: 0.05, psxg: 0.65, result: "goal" },
  { id: 6, x: 0.90, y: 0.70, xg: 0.22, psxg: 0.18, result: "saved" },
  { id: 7, x: 0.10, y: 0.85, xg: 0.10, psxg: 0.42, result: "goal" },
  { id: 8, x: 0.55, y: 0.20, xg: 0.06, psxg: 0.05, result: "saved" },
  { id: 9, x: 0.05, y: 0.95, xg: 0.04, psxg: 0.02, result: "post" },
  { id: 10, x: 0.45, y: 0.75, xg: 0.45, psxg: 0.25, result: "saved" },
];

export const GOAL_ZONES = [
  { id: "top-left",  label: "Lucarne G", v: 40 },
  { id: "top-right", label: "Lucarne D", v: 35 },
  { id: "mid-left",  label: "Côté G",    v: 15 },
  { id: "mid-right", label: "Côté D",    v: 10 },
  { id: "bot-left",  label: "Sol G",     v: 25 },
  { id: "bot-right", label: "Sol D",     v: 20 },
];

export const SNIPER_LOG: SniperMatch[] = [
  { id: 1, match: "vs Marseille", date: "10/08", shots: 4, onTarget: 2, xgTotal: 0.45, psxgTotal: 0.88, differential: 0.43, goals: 1 },
  { id: 2, match: "vs Lens",      date: "31/08", shots: 3, onTarget: 1, xgTotal: 0.28, psxgTotal: 0.72, differential: 0.44, goals: 1 },
  { id: 3, match: "vs Brest",     date: "23/11", shots: 5, onTarget: 3, xgTotal: 0.72, psxgTotal: 0.94, differential: 0.22, goals: 1 },
  { id: 4, match: "vs Montpellier",date: "21/12", shots: 4, onTarget: 2, xgTotal: 0.68, psxgTotal: 0.35, differential: -0.33, goals: 0 },
  { id: 5, match: "vs Monaco",    date: "15/03", shots: 3, onTarget: 2, xgTotal: 0.42, psxgTotal: 0.98, differential: 0.56, goals: 1 },
];
