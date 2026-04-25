export type Position = 'AT' | 'AI' | 'MO' | 'MC' | 'MD' | 'LD' | 'LG' | 'DC' | 'GB';
export type Rating = 'A' | 'B' | 'C' | 'D' | 'E';
export type KanbanStatus =
  | 'Identifié'
  | 'Observation'
  | 'Contacté'
  | 'Pré-accord'
  | 'Priorité'
  | 'À suivre'
  | 'Écarté';

export interface Player {
  id: number;
  initials: string;
  firstName: string;
  lastName: string;
  age: number;
  flag: string;
  nationality: string;
  position: Position;
  club: string;
  league: string;
  contractEnd: string;
  contractEndYear: number;
  marketValue: string;
  marketValueNum: number;
  xG: number;
  xA: number;
  xThreat: number;
  speed: number;
  distance: number;
  note: number;
  rating: Rating;
  status: KanbanStatus;
  isUE: boolean;
  radar: {
    technique: number;
    physique: number;
    vitesse: number;
    vision: number;
    pressing: number;
    dribble: number;
  };
}

function noteToRating(note: number): Rating {
  if (note >= 8.5) return 'A';
  if (note >= 7.5) return 'B';
  if (note >= 7.0) return 'C';
  if (note >= 6.5) return 'D';
  return 'E';
}

function statusToKanban(status: string): KanbanStatus {
  const map: Record<string, KanbanStatus> = {
    identifié: 'Identifié',
    observation: 'Observation',
    contacté: 'Contacté',
    préaccord: 'Pré-accord',
    écarté: 'Écarté',
    priorité: 'Priorité',
    suivi: 'À suivre',
  };
  return map[status] ?? 'Identifié';
}

const raw = [
  { id:1,  fn:'Luca',     ln:'Romani',         age:22, flag:'🇮🇹', nat:'ITA', pos:'MC' as Position, club:'Sassuolo',          league:'Serie A',        end:'Juin 2025', cY:2025, mv:'4,2M€',  mvN:4.2,  xG:0.18, xA:0.31, xT:0.09, spd:32.4, dist:11.24, note:7.2, status:'observation', eu:true,  r:{ technique:74, physique:70, vitesse:72, vision:80, pressing:78, dribble:68 } },
  { id:2,  fn:'Théo',     ln:'Mbaye',          age:19, flag:'🇸🇳', nat:'SEN', pos:'AI' as Position, club:'Génération Foot',   league:'Ligue 1 SEN',    end:'Juin 2026', cY:2026, mv:'1,8M€',  mvN:1.8,  xG:0.22, xA:0.14, xT:0.12, spd:34.8, dist:9.87,  note:6.8, status:'identifié',   eu:false, r:{ technique:65, physique:72, vitesse:88, vision:62, pressing:64, dribble:79 } },
  { id:3,  fn:'Florian',  ln:'Krüger',         age:26, flag:'🇩🇪', nat:'DEU', pos:'LD' as Position, club:'SC Freiburg',        league:'Bundesliga',     end:'Juin 2025', cY:2025, mv:'7,0M€',  mvN:7.0,  xG:0.08, xA:0.29, xT:0.06, spd:33.1, dist:11.68, note:7.8, status:'priorité',    eu:true,  r:{ technique:76, physique:82, vitesse:81, vision:74, pressing:80, dribble:70 } },
  { id:4,  fn:'Sacha',    ln:'Boey',           age:23, flag:'🇫🇷', nat:'FRA', pos:'LD' as Position, club:'Galatasaray',        league:'Süper Lig',      end:'Juin 2026', cY:2026, mv:'12,0M€', mvN:12.0, xG:0.11, xA:0.21, xT:0.07, spd:33.9, dist:11.40, note:8.1, status:'contacté',    eu:true,  r:{ technique:80, physique:84, vitesse:84, vision:76, pressing:79, dribble:74 } },
  { id:5,  fn:'Nuno',     ln:'Tavares',        age:24, flag:'🇵🇹', nat:'POR', pos:'LG' as Position, club:'Nottm Forest',       league:'Premier League', end:'Juin 2028', cY:2028, mv:'15,0M€', mvN:15.0, xG:0.14, xA:0.38, xT:0.11, spd:35.2, dist:10.92, note:8.4, status:'écarté',      eu:true,  r:{ technique:82, physique:86, vitesse:87, vision:78, pressing:76, dribble:80 } },
  { id:6,  fn:'Lamine',   ln:'Dramé',          age:20, flag:'🇬🇳', nat:'GUI', pos:'DC' as Position, club:'RFC Seraing',        league:'Pro League',     end:'Juin 2026', cY:2026, mv:'2,5M€',  mvN:2.5,  xG:0.04, xA:0.06, xT:0.02, spd:31.8, dist:10.14, note:6.5, status:'suivi',       eu:false, r:{ technique:62, physique:78, vitesse:74, vision:60, pressing:68, dribble:58 } },
  { id:7,  fn:'Édouard',  ln:'Michut',         age:22, flag:'🇫🇷', nat:'FRA', pos:'MC' as Position, club:'Sunderland',         league:'Championship',   end:'Juin 2025', cY:2025, mv:'5,0M€',  mvN:5.0,  xG:0.21, xA:0.18, xT:0.10, spd:30.9, dist:11.52, note:7.0, status:'observation', eu:true,  r:{ technique:72, physique:68, vitesse:70, vision:76, pressing:72, dribble:66 } },
  { id:8,  fn:'Hugo',     ln:'Ekitiké',        age:22, flag:'🇫🇷', nat:'FRA', pos:'AT' as Position, club:'Eintracht Frankfurt',league:'Bundesliga',     end:'Juin 2028', cY:2028, mv:'22,0M€', mvN:22.0, xG:0.48, xA:0.12, xT:0.19, spd:34.1, dist:9.23,  note:8.6, status:'priorité',    eu:true,  r:{ technique:82, physique:76, vitesse:92, vision:70, pressing:72, dribble:85 } },
  { id:9,  fn:'Amine',    ln:'Harit',          age:27, flag:'🇲🇦', nat:'MAR', pos:'MO' as Position, club:'Olympique de Marseille', league:'Ligue 1',    end:'Juin 2025', cY:2025, mv:'8,0M€',  mvN:8.0,  xG:0.28, xA:0.24, xT:0.14, spd:32.0, dist:10.33, note:7.5, status:'préaccord',   eu:false, r:{ technique:84, physique:68, vitesse:76, vision:88, pressing:66, dribble:82 } },
  { id:10, fn:'Désiré',   ln:'Doué',           age:19, flag:'🇫🇷', nat:'FRA', pos:'AI' as Position, club:'PSG',                league:'Ligue 1',        end:'Juin 2029', cY:2029, mv:'45,0M€', mvN:45.0, xG:0.31, xA:0.22, xT:0.17, spd:35.8, dist:9.44,  note:8.8, status:'écarté',      eu:true,  r:{ technique:88, physique:74, vitesse:90, vision:84, pressing:70, dribble:92 } },
  { id:11, fn:'Cheick',   ln:'Doucouré',       age:25, flag:'🇫🇷', nat:'FRA', pos:'MD' as Position, club:'Crystal Palace',     league:'Premier League', end:'Juin 2026', cY:2026, mv:'18,0M€', mvN:18.0, xG:0.09, xA:0.11, xT:0.05, spd:31.4, dist:12.10, note:7.6, status:'observation', eu:true,  r:{ technique:72, physique:88, vitesse:78, vision:70, pressing:90, dribble:64 } },
  { id:12, fn:'Maxime',   ln:'Caufriez',       age:28, flag:'🇧🇪', nat:'BEL', pos:'DC' as Position, club:'RFC Seraing',        league:'Pro League',     end:'Juin 2025', cY:2025, mv:'3,0M€',  mvN:3.0,  xG:0.05, xA:0.03, xT:0.02, spd:30.2, dist:10.88, note:6.9, status:'identifié',   eu:true,  r:{ technique:68, physique:80, vitesse:66, vision:64, pressing:74, dribble:56 } },
  { id:13, fn:'Ismaila',  ln:'Sarr',           age:26, flag:'🇸🇳', nat:'SEN', pos:'AI' as Position, club:'Crystal Palace',     league:'Premier League', end:'Juin 2026', cY:2026, mv:'20,0M€', mvN:20.0, xG:0.27, xA:0.19, xT:0.15, spd:36.1, dist:9.71,  note:8.0, status:'suivi',       eu:false, r:{ technique:80, physique:78, vitesse:94, vision:74, pressing:68, dribble:86 } },
  { id:14, fn:'Arnaud',   ln:'Kalimuendo',     age:22, flag:'🇫🇷', nat:'FRA', pos:'AT' as Position, club:'Stade Rennais',      league:'Ligue 1',        end:'Juin 2026', cY:2026, mv:'12,0M€', mvN:12.0, xG:0.38, xA:0.11, xT:0.14, spd:33.3, dist:9.80,  note:7.4, status:'contacté',    eu:true,  r:{ technique:76, physique:74, vitesse:82, vision:66, pressing:68, dribble:78 } },
  { id:15, fn:'Idrissa',  ln:'Touré',          age:21, flag:'🇲🇱', nat:'MLI', pos:'MD' as Position, club:'Génération Foot',   league:'Ligue 1 SEN',    end:'Juin 2025', cY:2025, mv:'1,5M€',  mvN:1.5,  xG:0.06, xA:0.08, xT:0.03, spd:30.8, dist:11.90, note:6.4, status:'identifié',   eu:false, r:{ technique:60, physique:76, vitesse:68, vision:62, pressing:80, dribble:56 } },
  { id:16, fn:'Alexis',   ln:'Claude-Maurice', age:26, flag:'🇫🇷', nat:'FRA', pos:'AI' as Position, club:'OGC Nice',           league:'Ligue 1',        end:'Juin 2025', cY:2025, mv:'6,0M€',  mvN:6.0,  xG:0.19, xA:0.28, xT:0.13, spd:33.7, dist:10.55, note:7.1, status:'préaccord',   eu:true,  r:{ technique:76, physique:72, vitesse:84, vision:76, pressing:66, dribble:80 } },
  { id:17, fn:'Matteo',   ln:'Guendouzi',      age:25, flag:'🇫🇷', nat:'FRA', pos:'MC' as Position, club:'Lazio',             league:'Serie A',        end:'Juin 2026', cY:2026, mv:'25,0M€', mvN:25.0, xG:0.14, xA:0.22, xT:0.09, spd:30.5, dist:12.30, note:8.0, status:'écarté',      eu:true,  r:{ technique:78, physique:80, vitesse:72, vision:84, pressing:82, dribble:70 } },
  { id:18, fn:'Pape',     ln:'Gueye',          age:24, flag:'🇸🇳', nat:'SEN', pos:'MD' as Position, club:'ESTAC Troyes',       league:'Ligue 2',        end:'Juin 2025', cY:2025, mv:'2,0M€',  mvN:2.0,  xG:0.07, xA:0.12, xT:0.04, spd:31.9, dist:12.05, note:6.7, status:'observation', eu:false, r:{ technique:64, physique:78, vitesse:70, vision:64, pressing:82, dribble:60 } },
  { id:19, fn:'Adrien',   ln:'Truffert',       age:23, flag:'🇫🇷', nat:'FRA', pos:'LG' as Position, club:'Stade Rennais',      league:'Ligue 1',        end:'Juin 2026', cY:2026, mv:'10,0M€', mvN:10.0, xG:0.09, xA:0.32, xT:0.08, spd:34.5, dist:11.22, note:7.7, status:'suivi',       eu:true,  r:{ technique:78, physique:82, vitesse:86, vision:72, pressing:76, dribble:74 } },
  { id:20, fn:'Cheikh',   ln:'Niasse',         age:24, flag:'🇸🇳', nat:'SEN', pos:'AT' as Position, club:'Génération Foot',   league:'Ligue 1 SEN',    end:'Juin 2025', cY:2025, mv:'2,2M€',  mvN:2.2,  xG:0.35, xA:0.08, xT:0.12, spd:33.0, dist:9.10,  note:7.0, status:'contacté',    eu:false, r:{ technique:72, physique:76, vitesse:80, vision:62, pressing:66, dribble:74 } },
  { id:21, fn:'Rayan',    ln:'Cherki',         age:21, flag:'🇫🇷', nat:'FRA', pos:'MO' as Position, club:'Olympique Lyonnais', league:'Ligue 1',        end:'Juin 2026', cY:2026, mv:'25,0M€', mvN:25.0, xG:0.26, xA:0.31, xT:0.15, spd:32.8, dist:9.55,  note:8.3, status:'écarté',      eu:true,  r:{ technique:90, physique:68, vitesse:80, vision:92, pressing:64, dribble:88 } },
  { id:22, fn:'Jordan',   ln:'Ferri',          age:31, flag:'🇫🇷', nat:'FRA', pos:'MC' as Position, club:'FC Metz',            league:'Ligue 1',        end:'Juin 2025', cY:2025, mv:'1,0M€',  mvN:1.0,  xG:0.05, xA:0.09, xT:0.03, spd:28.4, dist:10.80, note:6.2, status:'identifié',   eu:true,  r:{ technique:70, physique:64, vitesse:58, vision:72, pressing:74, dribble:62 } },
  { id:23, fn:'Tom',      ln:'Lacoux',         age:20, flag:'🇫🇷', nat:'FRA', pos:'DC' as Position, club:'FC Metz',            league:'Ligue 1',        end:'Juin 2026', cY:2026, mv:'3,5M€',  mvN:3.5,  xG:0.07, xA:0.04, xT:0.02, spd:31.1, dist:10.60, note:6.6, status:'suivi',       eu:true,  r:{ technique:64, physique:78, vitesse:70, vision:62, pressing:72, dribble:56 } },
  { id:24, fn:'Moussa',   ln:'Diaby',          age:25, flag:'🇫🇷', nat:'FRA', pos:'AI' as Position, club:'Aston Villa',        league:'Premier League', end:'Juin 2028', cY:2028, mv:'55,0M€', mvN:55.0, xG:0.34, xA:0.26, xT:0.18, spd:36.4, dist:9.90,  note:8.9, status:'écarté',      eu:true,  r:{ technique:86, physique:82, vitesse:96, vision:80, pressing:72, dribble:90 } },
  { id:25, fn:'Enzo',     ln:'Le Fée',         age:23, flag:'🇫🇷', nat:'FRA', pos:'MC' as Position, club:'AS Roma',            league:'Serie A',        end:'Juin 2027', cY:2027, mv:'14,0M€', mvN:14.0, xG:0.17, xA:0.25, xT:0.10, spd:31.8, dist:11.60, note:7.6, status:'suivi',       eu:true,  r:{ technique:80, physique:74, vitesse:74, vision:82, pressing:80, dribble:72 } },
];

export const PLAYERS: Player[] = raw.map((p) => ({
  id: p.id,
  initials: p.fn[0] + p.ln[0],
  firstName: p.fn,
  lastName: p.ln,
  age: p.age,
  flag: p.flag,
  nationality: p.nat,
  position: p.pos,
  club: p.club,
  league: p.league,
  contractEnd: p.end,
  contractEndYear: p.cY,
  marketValue: p.mv,
  marketValueNum: p.mvN,
  xG: p.xG,
  xA: p.xA,
  xThreat: p.xT,
  speed: p.spd,
  distance: p.dist,
  note: p.note,
  rating: noteToRating(p.note),
  status: statusToKanban(p.status),
  isUE: p.eu,
  radar: p.r,
}));

export const LEAGUES = [...new Set(PLAYERS.map((p) => p.league))].sort();
export const POSITIONS: Position[] = ['AT', 'AI', 'MO', 'MC', 'MD', 'LD', 'LG', 'DC', 'GB'];

export const POSITION_LABELS: Record<Position, string> = {
  AT: 'Attaquant', AI: 'Ailier', MO: 'Meneur', MC: 'Milieu C.',
  MD: 'Milieu Déf.', LD: 'Lat. Droit', LG: 'Lat. Gauche', DC: 'Déf. Central', GB: 'Gardien',
};

export const STATUS_CONFIG: Record<KanbanStatus, { color: string; bg: string; border: string }> = {
  'Priorité':    { color: 'var(--color-success)',       bg: 'rgba(var(--success-rgb), 0.12)',       border: 'rgba(var(--success-rgb), 0.35)'       },
  'Contacté':    { color: 'var(--color-warning)',       bg: 'rgba(var(--warning-rgb), 0.12)',       border: 'rgba(var(--warning-rgb), 0.35)'       },
  'À suivre':    { color: 'var(--color-warning)',       bg: 'rgba(var(--warning-rgb), 0.12)',       border: 'rgba(var(--warning-rgb), 0.35)'       },
  'Pré-accord':  { color: 'var(--color-primary-400)',  bg: 'rgba(var(--primary-rgb), 0.12)',       border: 'rgba(var(--primary-rgb), 0.35)'       },
  'Identifié':   { color: 'var(--text-muted)',          bg: 'rgba(var(--neutral-badge-rgb), 0.10)', border: 'rgba(var(--neutral-badge-rgb), 0.25)' },
  'Observation': { color: 'var(--color-info)',          bg: 'rgba(var(--info-rgb), 0.12)',          border: 'rgba(var(--info-rgb), 0.35)'          },
  'Écarté':      { color: 'var(--color-danger)',        bg: 'rgba(var(--danger-rgb), 0.12)',        border: 'rgba(var(--danger-rgb), 0.35)'        },
};

export const RATING_CONFIG: Record<Rating, { color: string; bg: string; border: string }> = {
  A: { color: 'var(--rating-a)', bg: 'rgba(var(--rating-a-rgb), 0.10)', border: 'rgba(var(--rating-a-rgb), 0.33)' },
  B: { color: 'var(--rating-b)', bg: 'rgba(var(--rating-b-rgb), 0.10)', border: 'rgba(var(--rating-b-rgb), 0.33)' },
  C: { color: 'var(--rating-c)', bg: 'rgba(var(--rating-c-rgb), 0.10)', border: 'rgba(var(--rating-c-rgb), 0.33)' },
  D: { color: 'var(--rating-d)', bg: 'rgba(var(--rating-d-rgb), 0.10)', border: 'rgba(var(--rating-d-rgb), 0.33)' },
  E: { color: 'var(--rating-e)', bg: 'rgba(var(--rating-e-rgb), 0.10)', border: 'rgba(var(--rating-e-rgb), 0.33)' },
};
