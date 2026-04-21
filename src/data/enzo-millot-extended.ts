// Extended data for Enzo Millot — all tab-specific mockup data

export type MatchResult = "V" | "N" | "D";

export interface Match {
  id: number; jj: number; date: string; opponent: string; abbr: string;
  home: boolean; score: string; result: MatchResult; minutes: number;
}

export const MATCHES: Match[] = [
  { id:1,  jj:1,  date:"03/08", opponent:"PSG",         abbr:"PSG",  home:false, score:"1-3", result:"D", minutes:90 },
  { id:2,  jj:2,  date:"10/08", opponent:"Marseille",   abbr:"OM",   home:true,  score:"2-1", result:"V", minutes:78 },
  { id:3,  jj:3,  date:"17/08", opponent:"Lyon",        abbr:"OL",   home:true,  score:"1-1", result:"N", minutes:85 },
  { id:4,  jj:4,  date:"24/08", opponent:"Monaco",      abbr:"ASM",  home:false, score:"2-2", result:"N", minutes:90 },
  { id:5,  jj:5,  date:"31/08", opponent:"Lens",        abbr:"RCL",  home:true,  score:"3-1", result:"V", minutes:62 },
  { id:6,  jj:6,  date:"14/09", opponent:"Strasbourg",  abbr:"SFC",  home:false, score:"1-0", result:"V", minutes:90 },
  { id:7,  jj:10, date:"26/10", opponent:"Rennes",      abbr:"SRF",  home:false, score:"1-2", result:"D", minutes:72 },
  { id:8,  jj:11, date:"02/11", opponent:"Nice",        abbr:"OGC",  home:true,  score:"2-0", result:"V", minutes:85 },
  { id:9,  jj:12, date:"09/11", opponent:"Nantes",      abbr:"FCN",  home:false, score:"1-1", result:"N", minutes:90 },
  { id:10, jj:13, date:"23/11", opponent:"Brest",       abbr:"SB",   home:true,  score:"3-0", result:"V", minutes:90 },
  { id:11, jj:14, date:"30/11", opponent:"Reims",       abbr:"SDR",  home:false, score:"0-1", result:"D", minutes:68 },
  { id:12, jj:15, date:"07/12", opponent:"Toulouse",    abbr:"TFC",  home:true,  score:"2-1", result:"V", minutes:76 },
  { id:13, jj:16, date:"14/12", opponent:"Lille",       abbr:"LOSC", home:false, score:"0-2", result:"D", minutes:90 },
  { id:14, jj:17, date:"21/12", opponent:"Montpellier", abbr:"MHSC", home:true,  score:"4-1", result:"V", minutes:85 },
  { id:15, jj:18, date:"11/01", opponent:"Auxerre",     abbr:"AJA",  home:false, score:"1-1", result:"N", minutes:90 },
  { id:16, jj:19, date:"18/01", opponent:"St-Étienne",  abbr:"ASSE", home:true,  score:"2-0", result:"V", minutes:80 },
  { id:17, jj:20, date:"25/01", opponent:"Le Havre",    abbr:"HAC",  home:false, score:"1-2", result:"D", minutes:72 },
  { id:18, jj:22, date:"15/02", opponent:"Angers",      abbr:"SCA",  home:true,  score:"3-1", result:"V", minutes:68 },
  { id:19, jj:23, date:"22/02", opponent:"Clermont",    abbr:"CFA",  home:false, score:"2-1", result:"V", minutes:85 },
  { id:20, jj:24, date:"01/03", opponent:"PSG",         abbr:"PSG",  home:true,  score:"1-2", result:"D", minutes:90 },
  { id:21, jj:25, date:"08/03", opponent:"Marseille",   abbr:"OM",   home:false, score:"0-0", result:"N", minutes:78 },
  { id:22, jj:26, date:"15/03", opponent:"Monaco",      abbr:"ASM",  home:true,  score:"2-1", result:"V", minutes:90 },
  { id:23, jj:27, date:"22/03", opponent:"Lyon",        abbr:"OL",   home:false, score:"1-3", result:"D", minutes:82 },
  { id:24, jj:28, date:"29/03", opponent:"Lens",        abbr:"RCL",  home:false, score:"1-1", result:"N", minutes:75 },
];

export interface MatchStats {
  matchId: number;
  passes: number; pass_pct: number; press_passes: number; one_touch: number; ball_losses: number;
  lb_att: number; lb_def: number; lb_mid: number; xThreat: number; prog_carries: number;
  pressures: number; def_duel_pct: number; counter_press: number; second_balls: number; aerial_pct: number;
  peak_sprint: number; hi_runs: number; sprints: number; total_dist: number;
}

// Raw match stats — varied to create interesting heatmap matrix visuals
const RAW: number[][] = [
  //  pass  pct  prp  1t  bl  lba lbd lbm  xT    pc   prs  ddp  cp   sb   ap   ps    hir  spr  dst
  [   52,   84,   7,   3,   4,   1,  1,  2, 0.04,  4,  14,  48,   4,   6,  42,  31.2,   9,  5, 10.8 ],
  [   58,   89,   5,   5,   2,   2,  0,  3, 0.08,  6,  12,  57,   5,   7,  50,  32.1,  11,  6,  9.8 ],
  [   61,   91,   4,   4,   3,   1,  1,  3, 0.06,  5,  11,  52,   4,   8,  45,  30.8,  10,  5, 10.2 ],
  [   55,   86,   6,   4,   3,   1,  2,  2, 0.05,  5,  16,  53,   6,   7,  44,  31.5,  12,  7, 11.1 ],
  [   44,   88,   4,   3,   2,   1,  0,  2, 0.05,  4,   9,  55,   3,   5,  48,  31.0,   7,  4,  7.8 ],
  [   64,   92,   4,   5,   2,   2,  1,  3, 0.09,  7,  13,  60,   5,   8,  52,  32.4,  13,  7, 11.3 ],
  [   48,   83,   5,   3,   3,   1,  1,  2, 0.03,  4,  11,  46,   4,   6,  40,  30.5,   8,  4,  9.2 ],
  [   55,   90,   4,   4,   2,   1,  1,  3, 0.06,  5,  15,  62,   6,   8,  54,  31.8,  12,  6, 10.7 ],
  [   67,   90,   5,   5,   2,   2,  1,  4, 0.07,  6,  12,  56,   5,   7,  48,  31.2,  11,  6, 11.0 ],
  [   72,   94,   3,   6,   1,   3,  0,  4, 0.12,  8,  11,  65,   5,   9,  56,  32.8,  14,  8, 11.5 ],
  [   42,   80,   6,   2,   5,   0,  1,  1, 0.02,  3,  13,  42,   3,   5,  38,  30.0,   7,  3,  8.6 ],
  [   56,   88,   4,   4,   2,   2,  0,  3, 0.07,  6,  12,  58,   5,   7,  50,  31.5,  10,  6,  9.6 ],
  [   50,   82,   7,   3,   4,   1,  2,  2, 0.03,  4,  17,  50,   6,   6,  44,  31.8,  13,  7, 11.2 ],
  [   68,   93,   3,   6,   1,   3,  0,  4, 0.11,  8,  10,  67,   4,   9,  58,  32.5,  12,  7, 10.8 ],
  [   58,   87,   5,   4,   2,   1,  1,  3, 0.05,  5,  14,  54,   5,   7,  47,  30.9,  10,  5, 10.9 ],
  [   60,   91,   4,   5,   2,   2,  1,  3, 0.09,  7,  12,  60,   5,   8,  52,  31.6,  11,  6, 10.1 ],
  [   46,   83,   6,   3,   4,   1,  1,  1, 0.03,  3,  12,  45,   4,   5,  40,  30.7,   8,  4,  9.1 ],
  [   50,   90,   3,   4,   2,   2,  0,  3, 0.07,  5,   9,  58,   4,   6,  50,  31.2,   8,  5,  8.6 ],
  [   62,   89,   4,   5,   2,   2,  1,  3, 0.08,  6,  13,  62,   5,   8,  53,  32.0,  12,  7, 10.7 ],
  [   54,   85,   7,   3,   4,   1,  2,  2, 0.04,  4,  16,  49,   5,   6,  43,  31.4,  10,  6, 11.0 ],
  [   58,   87,   5,   4,   3,   1,  1,  3, 0.05,  5,  13,  53,   5,   7,  47,  31.0,  10,  5,  9.8 ],
  [   70,   93,   3,   6,   1,   3,  1,  4, 0.13,  8,  11,  66,   5,   9,  57,  33.0,  14,  8, 11.5 ],
  [   52,   84,   6,   3,   4,   1,  1,  2, 0.04,  4,  14,  49,   4,   6,  43,  30.8,   9,  5, 10.4 ],
  [   54,   88,   4,   4,   2,   1,  1,  3, 0.06,  5,  12,  55,   5,   7,  49,  31.3,  10,  5,  9.4 ],
];

export const MATCH_STATS: MatchStats[] = RAW.map((r, i) => ({
  matchId: i + 1,
  passes: r[0], pass_pct: r[1], press_passes: r[2], one_touch: r[3], ball_losses: r[4],
  lb_att: r[5], lb_def: r[6], lb_mid: r[7], xThreat: r[8], prog_carries: r[9],
  pressures: r[10], def_duel_pct: r[11], counter_press: r[12], second_balls: r[13], aerial_pct: r[14],
  peak_sprint: r[15], hi_runs: r[16], sprints: r[17], total_dist: r[18],
}));

// ── Heatmap hotspot data ──────────────────────────────────────────────────────
export interface HeatSpot { x: number; y: number; r: number; intensity: number; }

// Full-season aggregate hotspots (normalized 0–1, x=left→right=attack, y=top→bottom)
export const SEASON_HOTSPOTS: HeatSpot[] = [
  { x: 0.50, y: 0.50, r: 0.14, intensity: 1.00 },
  { x: 0.46, y: 0.47, r: 0.11, intensity: 0.88 },
  { x: 0.54, y: 0.53, r: 0.11, intensity: 0.82 },
  { x: 0.52, y: 0.42, r: 0.09, intensity: 0.74 },
  { x: 0.40, y: 0.50, r: 0.09, intensity: 0.62 },
  { x: 0.62, y: 0.48, r: 0.09, intensity: 0.58 },
  { x: 0.48, y: 0.60, r: 0.08, intensity: 0.50 },
  { x: 0.66, y: 0.40, r: 0.07, intensity: 0.44 },
  { x: 0.73, y: 0.46, r: 0.06, intensity: 0.34 },
  { x: 0.36, y: 0.44, r: 0.06, intensity: 0.28 },
  { x: 0.42, y: 0.63, r: 0.05, intensity: 0.22 },
];

// Per-match heatmap patterns (6 variants, assigned by match index)
export const MATCH_HEATMAP_PATTERNS: HeatSpot[][] = [
  [ { x:0.52, y:0.48, r:0.18, intensity:0.9 }, { x:0.60, y:0.42, r:0.12, intensity:0.68 }, { x:0.44, y:0.54, r:0.11, intensity:0.55 } ],
  [ { x:0.42, y:0.50, r:0.16, intensity:0.85 }, { x:0.52, y:0.44, r:0.12, intensity:0.65 }, { x:0.64, y:0.38, r:0.09, intensity:0.42 } ],
  [ { x:0.50, y:0.53, r:0.15, intensity:0.78 }, { x:0.58, y:0.46, r:0.11, intensity:0.60 }, { x:0.40, y:0.48, r:0.10, intensity:0.45 } ],
  [ { x:0.55, y:0.45, r:0.17, intensity:0.92 }, { x:0.46, y:0.52, r:0.12, intensity:0.72 }, { x:0.68, y:0.40, r:0.09, intensity:0.48 } ],
  [ { x:0.48, y:0.56, r:0.14, intensity:0.70 }, { x:0.56, y:0.50, r:0.10, intensity:0.55 }, { x:0.38, y:0.52, r:0.09, intensity:0.40 } ],
  [ { x:0.62, y:0.44, r:0.13, intensity:0.80 }, { x:0.50, y:0.50, r:0.11, intensity:0.65 }, { x:0.44, y:0.44, r:0.10, intensity:0.50 } ],
];

// ── Team Style radars (Tab 03) ────────────────────────────────────────────────
export interface SectorDatum {
  label: string; value: number; displayText: string;
  category: "offensive" | "defensive";
}

export const RADAR_IN_POSSESSION: SectorDatum[] = [
  { label:"% Build Up", value:72, displayText:"3rd",  category:"offensive" },
  { label:"xG créé",    value:65, displayText:"7th",  category:"offensive" },
  { label:"Crosses",    value:44, displayText:"14th", category:"offensive" },
  { label:"Passes prog",value:79, displayText:"2nd",  category:"offensive" },
  { label:"Possession", value:55, displayText:"10th", category:"defensive" },
  { label:"Jeu direct", value:38, displayText:"17th", category:"defensive" },
];

export const RADAR_TRANSITIONS: SectorDatum[] = [
  { label:"1ères passes", value:68, displayText:"5th",  category:"offensive" },
  { label:"Récup. rapide",value:74, displayText:"4th",  category:"offensive" },
  { label:"xG trans. ATT",value:58, displayText:"9th",  category:"offensive" },
  { label:"xG conc. DEF", value:62, displayText:"7th",  category:"defensive" },
  { label:"Contre-attaq.", value:45, displayText:"13th", category:"defensive" },
  { label:"Press. perte",  value:80, displayText:"2nd",  category:"defensive" },
];

export const RADAR_OUT_POSSESSION: SectorDatum[] = [
  { label:"Bloc haut",   value:80, displayText:"2nd",  category:"defensive" },
  { label:"Bloc médian", value:55, displayText:"11th", category:"defensive" },
  { label:"Bloc bas",    value:32, displayText:"16th", category:"defensive" },
  { label:"Duels aér.",  value:61, displayText:"7th",  category:"defensive" },
  { label:"xG conc.",    value:70, displayText:"5th",  category:"defensive" },
  { label:"Pressions",   value:83, displayText:"1st",  category:"defensive" },
];

// ── Ligue 1 standings (Tab 03) ────────────────────────────────────────────────
export interface Standing {
  rank: number; club: string; abbr: string;
  j: number; v: number; n: number; d: number; pts: number;
  form: string; // last 5: "V","N","D"
}

export const STANDINGS: Standing[] = [
  { rank:1,  club:"PSG",         abbr:"PSG",  j:28, v:21, n:4, d:3,  pts:67, form:"VVVNV" },
  { rank:2,  club:"Monaco",      abbr:"ASM",  j:28, v:18, n:5, d:5,  pts:59, form:"VVNVV" },
  { rank:3,  club:"Marseille",   abbr:"OM",   j:28, v:17, n:4, d:7,  pts:55, form:"VNVVD" },
  { rank:4,  club:"Lens",        abbr:"RCL",  j:28, v:15, n:6, d:7,  pts:51, form:"VNVVD" },
  { rank:5,  club:"Lyon",        abbr:"OL",   j:28, v:14, n:7, d:7,  pts:49, form:"NVDVN" },
  { rank:6,  club:"Lille",       abbr:"LOSC", j:28, v:14, n:5, d:9,  pts:47, form:"DVVVN" },
  { rank:7,  club:"Nice",        abbr:"OGC",  j:28, v:13, n:5, d:10, pts:44, form:"VVDNV" },
  { rank:8,  club:"Rennes",      abbr:"SRF",  j:28, v:12, n:6, d:10, pts:42, form:"NDVVN" },
  { rank:9,  club:"FC Metz",     abbr:"FCM",  j:28, v:12, n:8, d:8,  pts:44, form:"NVDVN" },
  { rank:10, club:"Strasbourg",  abbr:"SFC",  j:28, v:11, n:7, d:10, pts:40, form:"DVVND" },
  { rank:11, club:"Brest",       abbr:"SB",   j:28, v:11, n:6, d:11, pts:39, form:"NVVDN" },
  { rank:12, club:"Toulouse",    abbr:"TFC",  j:28, v:10, n:7, d:11, pts:37, form:"NNVDV" },
  { rank:13, club:"Nantes",      abbr:"FCN",  j:28, v:9,  n:9, d:10, pts:36, form:"NVDNV" },
  { rank:14, club:"Reims",       abbr:"SDR",  j:28, v:9,  n:7, d:12, pts:34, form:"DDVNV" },
  { rank:15, club:"Auxerre",     abbr:"AJA",  j:28, v:8,  n:8, d:12, pts:32, form:"NDVDD" },
  { rank:16, club:"St-Étienne",  abbr:"ASSE", j:28, v:7,  n:7, d:14, pts:28, form:"DNVDD" },
  { rank:17, club:"Le Havre",    abbr:"HAC",  j:28, v:6,  n:8, d:14, pts:26, form:"DDNDN" },
  { rank:18, club:"Clermont",    abbr:"CFA",  j:28, v:5,  n:6, d:17, pts:21, form:"DDDNV" },
];

// ── Percentile bars (Tab 04) ──────────────────────────────────────────────────
export interface PercentileBar { label: string; raw: string; pct: number; }

export const BARS_IN_POSSESSION: PercentileBar[] = [
  { label:"% impl. Build Up",    raw:"72%",  pct:83 },
  { label:"% impl. Création",    raw:"45%",  pct:72 },
  { label:"Passes cassant lignes",raw:"4,2", pct:79 },
  { label:"One-touch passes",    raw:"3,8",  pct:65 },
  { label:"xA",                  raw:"0,11", pct:71 },
  { label:"Contre-att. initiées",raw:"1,2",  pct:58 },
  { label:"Crosses demi-espace", raw:"0,8",  pct:44 },
];

export const BARS_OUT_POSSESSION: PercentileBar[] = [
  { label:"Actions défensives",  raw:"4,8",  pct:68 },
  { label:"HI recovery runs",    raw:"7,2",  pct:75 },
  { label:"Pressions → récup.",  raw:"1,4",  pct:62 },
  { label:"Interceptions",       raw:"1,1",  pct:56 },
  { label:"Contrepress. adv.",   raw:"2,3",  pct:71 },
  { label:"Duels aériens déf.",  raw:"58%",  pct:59 },
  { label:"% tacles réussis",    raw:"67%",  pct:73 },
];

// ── Physical data (Tab 05) ────────────────────────────────────────────────────
export const PHYSICAL_GLOBAL: SectorDatum[] = [
  { label:"Peak Sprint",      value:99, displayText:"99", category:"offensive" },
  { label:"Distance totale",  value:91, displayText:"91", category:"offensive" },
  { label:"HI dist. >20km/h", value:100,displayText:"100",category:"offensive" },
  { label:"HI activities",    value:91, displayText:"91", category:"defensive" },
  { label:"Sprint acts",      value:75, displayText:"75", category:"defensive" },
  { label:"Sprint dist.",     value:66, displayText:"66", category:"defensive" },
];

export const PHYSICAL_PHASE: SectorDatum[] = [
  { label:"% sprint en poss.",   value:88, displayText:"88", category:"offensive" },
  { label:"Sprint/min DEF→ATT",  value:79, displayText:"79", category:"offensive" },
  { label:"% sprint hors poss.", value:74, displayText:"74", category:"defensive" },
  { label:"Sprint/min ATT→DEF",  value:65, displayText:"65", category:"defensive" },
];

// ── Endurance data (Tab 06) ───────────────────────────────────────────────────
export const ENDURANCE_DATA = [
  { interval:"0-15'",  stamina:131, intensity:40, timePct:87 },
  { interval:"15-30'", stamina:125, intensity:34, timePct:85 },
  { interval:"30-45'", stamina:118, intensity:32, timePct:84 },
  { interval:"45-60'", stamina:122, intensity:31, timePct:86 },
  { interval:"60-75'", stamina:114, intensity:28, timePct:82 },
  { interval:"75-90'", stamina:110, intensity:27, timePct:78 },
];

// ── With/Without data (Tab 07) ────────────────────────────────────────────────
export const OPPONENTS_WW = [
  { abbr:"PSG", color:"#004170" }, { abbr:"OM",   color:"#009fda" },
  { abbr:"OL",  color:"#e40613" }, { abbr:"ASM",  color:"#ee3124" },
  { abbr:"RCL", color:"#d62b27" }, { abbr:"SFC",  color:"#0074be" },
  { abbr:"SRF", color:"#e41e20" }, { abbr:"OGC",  color:"#c8102e" },
  { abbr:"FCN", color:"#e6b820" }, { abbr:"LOSC", color:"#c41f36" },
];

export const WW_RADAR_AXES = ["Possession","Build Up","xG","xGA","Pressing","Bloc haut","Bloc médian","Line breaks","Duels aér.","Contrepress."];
export const WW_AVEC  = [55, 65, 58, 70, 75, 68, 52, 78, 64, 71];
export const WW_SANS  = [60, 55, 66, 55, 65, 57, 48, 64, 54, 62];

export const WW_TABLE = [
  { metric:"Possession",              avec:"48,67%", sans:"51,25%", betterWith:false },
  { metric:"% Build Up",              avec:"50,3%",  sans:"55,9%",  betterWith:false },
  { metric:"Contrôle dernier tiers",  avec:"48,93%", sans:"46,4%",  betterWith:true  },
  { metric:"% Build Up réussi",       avec:"30,8%",  sans:"32,5%",  betterWith:false },
  { metric:"xG",                      avec:"0,70",   sans:"0,80",   betterWith:false },
  { metric:"xG concédé",              avec:"1,32",   sans:"1,50",   betterWith:true  },
  { metric:"Ball pressures",          avec:"797",    sans:"752",    betterWith:true  },
];
