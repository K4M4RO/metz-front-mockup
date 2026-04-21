// ── Shared types ──────────────────────────────────────────────────────────────

export type ReportStatus = "priorite" | "pret" | "suivre" | "ecarte";
export type ReportType   = "global" | "match";
export type ReportSource = "data" | "video" | "live" | "agent";
export type KanbanId     = "identifie" | "scoute" | "analyse" | "valide" | "negociation";
export type NoteGrade    = "A" | "B" | "C" | "D" | "E";

export interface ScoutReport {
  id: string;
  date: string;
  dateIso: string;
  author: string;
  authorRole: string;
  type: ReportType;
  source: ReportSource;
  status: ReportStatus;
  note: NoteGrade;
  kanban: KanbanId;
  comment: string;
  // Match-specific (only when type === "match")
  competition?: string;
  affiche?: string;
  poste?: string;
  systeme?: string;
}

export interface PlayerTarget {
  id: string;
  name: string;
  firstName: string;
  position: string;
  positionShort: string;
  club: string;
  clubAbbr: string;
  league: string;
  nationality: string;
  flag: string;
  age: number;
  value: string;
  contractEnd: string;
  avatarInitials: string;
  avatarColor: string;
  reports: ScoutReport[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  priorite: { label: "Priorité",   color: "#22C55E", bg: "rgba(34,197,94,0.13)",  border: "rgba(34,197,94,0.35)",   dot: "#22C55E" },
  pret:     { label: "Prêt",       color: "#3B82F6", bg: "rgba(59,130,246,0.13)", border: "rgba(59,130,246,0.35)",  dot: "#3B82F6" },
  suivre:   { label: "À suivre",   color: "#EAB308", bg: "rgba(234,179,8,0.13)",  border: "rgba(234,179,8,0.35)",   dot: "#EAB308" },
  ecarte:   { label: "Écarté",     color: "#EF4444", bg: "rgba(239,68,68,0.13)",  border: "rgba(239,68,68,0.35)",   dot: "#EF4444" },
};

export const NOTE_CONFIG: Record<NoteGrade, { color: string; bg: string }> = {
  A: { color: "#22C55E", bg: "rgba(34,197,94,0.13)" },
  B: { color: "#4ADE80", bg: "rgba(74,222,128,0.10)" },
  C: { color: "#EAB308", bg: "rgba(234,179,8,0.13)" },
  D: { color: "#F97316", bg: "rgba(249,115,22,0.13)" },
  E: { color: "#EF4444", bg: "rgba(239,68,68,0.13)" },
};

export const SOURCE_CONFIG: Record<ReportSource, { label: string; icon: string; color: string }> = {
  data:  { label: "Data / IA",    icon: "◈", color: "#A78BFA" },
  video: { label: "Vidéo",        icon: "▶", color: "#60A5FA" },
  live:  { label: "Live / Stade", icon: "◉", color: "#34D399" },
  agent: { label: "Agent",        icon: "◆", color: "#FBBF24" },
};

export const KANBAN_OPTIONS: { id: KanbanId; label: string }[] = [
  { id: "identifie",   label: "Identifié" },
  { id: "scoute",      label: "Scouté (Vidéo)" },
  { id: "analyse",     label: "En Analyse (Live)" },
  { id: "valide",      label: "Validé Direction" },
  { id: "negociation", label: "En Négociation" },
];

export const POSTE_OPTIONS = ["G", "DC", "DD", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];
export const SYSTEME_OPTIONS = ["4-4-2", "4-3-3", "4-2-3-1", "3-5-2", "3-4-2-1", "5-3-2", "4-1-4-1", "3-4-3"];

// ── Mock data ─────────────────────────────────────────────────────────────────
// Sadibou Sané — progression classique 🟡→🟡→🔵→🟢

export const RAPPORT_PLAYERS: PlayerTarget[] = [
  {
    id: "sane-01",
    name: "Sané",
    firstName: "Sadibou",
    position: "Milieu Central",
    positionShort: "MC",
    club: "SC Charleroi",
    clubAbbr: "CHR",
    league: "Pro League",
    nationality: "Sénégal",
    flag: "🇸🇳",
    age: 24,
    value: "3.2M€",
    contractEnd: "Jun 2026",
    avatarInitials: "SS",
    avatarColor: "#7C3AED",
    reports: [
      {
        id: "r-ss-01",
        date: "11 oct. 2024",
        dateIso: "2024-10-11",
        author: "Nathan Perrin",
        authorRole: "Analyste Data",
        type: "global",
        source: "data",
        status: "suivre",
        note: "C",
        kanban: "identifie",
        comment: "Profil intéressant détecté via StatsBomb. Percentile élevé sur les passes progressives (78e) et la récupération balle (72e). Volume physique à confirmer. À surveiller ce trimestre.",
      },
      {
        id: "r-ss-02",
        date: "18 janv. 2025",
        dateIso: "2025-01-18",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "video",
        status: "suivre",
        note: "C",
        kanban: "scoute",
        comment: "Analyse vidéo sur 4 matchs. Bon pressing, bonne lecture tactique. Perd encore trop de duels aériens (43%). Pied gauche peu utilisé. Pas encore prêt pour le niveau L1 mais progression notable.",
        competition: "Pro League Belgique",
        affiche: "Charleroi vs Anderlecht",
        poste: "MC",
        systeme: "4-2-3-1",
      },
      {
        id: "r-ss-03",
        date: "15 fév. 2025",
        dateIso: "2025-02-15",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "live",
        status: "pret",
        note: "B",
        kanban: "analyse",
        comment: "Vu en live au Stade du Pays de Charleroi contre Bruges. Impressionnant. Leadership naturel, excellente intensité sur 80 min. 7/8 duels gagnés, 2 interceptions clés. La question aérienne reste un point de vigilance mais sa lecture du jeu compense largement.",
        competition: "Pro League Belgique",
        affiche: "Charleroi vs Club Brugge",
        poste: "MC",
        systeme: "4-4-2",
      },
      {
        id: "r-ss-04",
        date: "14 avr. 2025",
        dateIso: "2025-04-14",
        author: "Imrane El Arhrib",
        authorRole: "Directeur Sportif Adjoint",
        type: "match",
        source: "live",
        status: "priorite",
        note: "A",
        kanban: "valide",
        comment: "Rapport de validation finale. Profil validé par la direction après concertation. Valeur marchande en hausse (+0.8M€ en 6 mois), contrat court (juin 2026) : fenêtre d'opportunité à saisir avant le mercato estival. Recommandation : initier le contact via l'agent Karim Ziane dans les 10 jours.",
        competition: "Pro League Belgique — Play-offs",
        affiche: "Charleroi vs Genk",
        poste: "MC",
        systeme: "4-3-3",
      },
    ],
  },

  // Cheikh Sabaly — régression 🟡→🟡→🔴
  {
    id: "sabaly-02",
    name: "Sabaly",
    firstName: "Cheikh",
    position: "Milieu Défensif Central",
    positionShort: "MDC",
    club: "Girondins de Bordeaux",
    clubAbbr: "GDB",
    league: "National",
    nationality: "Sénégal",
    flag: "🇸🇳",
    age: 27,
    value: "1.8M€",
    contractEnd: "Jun 2025",
    avatarInitials: "CS",
    avatarColor: "#0891B2",
    reports: [
      {
        id: "r-cs-01",
        date: "03 nov. 2024",
        dateIso: "2024-11-03",
        author: "Nathan Perrin",
        authorRole: "Analyste Data",
        type: "global",
        source: "data",
        status: "suivre",
        note: "C",
        kanban: "identifie",
        comment: "Libre potentiel en juin 2025. Profil MDC solide sur les stats défensives (74e percentile). Alerté par Réseau/Agent Fontaine. À évaluer rapidement avant que le dossier ne se réchauffe.",
      },
      {
        id: "r-cs-02",
        date: "22 janv. 2025",
        dateIso: "2025-01-22",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "video",
        status: "suivre",
        note: "D",
        kanban: "scoute",
        comment: "Analyse de 5 matchs en National. Profil moins convaincant que les stats ne le laissaient suggérer. Jeu très direct, peu de progression balle au pied, nombreuses pertes sous pression. Style ne correspond pas bien au 4-3-3 pressing de Metz. Blessure genou signalée en janvier.",
        competition: "National",
        affiche: "Bordeaux vs Red Star",
        poste: "MDC",
        systeme: "4-4-2",
      },
      {
        id: "r-cs-03",
        date: "08 mars 2025",
        dateIso: "2025-03-08",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "live",
        status: "ecarte",
        note: "E",
        kanban: "scoute",
        comment: "Vu en live post-blessure. Perte de vivacité notable, 4/12 duels gagnés, aucun pressing efficace. Dossier définitivement clos. Ne correspond pas au profil recherché. Recommandation : orienter les ressources vers d'autres cibles dans ce périmètre.",
        competition: "National",
        affiche: "Bordeaux vs Rouen",
        poste: "MDC",
        systeme: "4-4-2",
      },
    ],
  },

  // Lamine Camara — montée stable 🔵→🔵→🔵→🟢
  {
    id: "camara-03",
    name: "Camara",
    firstName: "Lamine",
    position: "Milieu Central",
    positionShort: "MC",
    club: "AS Monaco",
    clubAbbr: "ASM",
    league: "Ligue 1",
    nationality: "Mali",
    flag: "🇲🇱",
    age: 22,
    value: "18M€",
    contractEnd: "Jun 2028",
    avatarInitials: "LC",
    avatarColor: "#D97706",
    reports: [
      {
        id: "r-lc-01",
        date: "12 août 2024",
        dateIso: "2024-08-12",
        author: "Imrane El Arhrib",
        authorRole: "Directeur Sportif Adjoint",
        type: "global",
        source: "agent",
        status: "pret",
        note: "B",
        kanban: "identifie",
        comment: "Contact initié via l'agent Raphaël Barret. Profil exceptionnel pour son âge. Intégration L1 réussie à Monaco. Valeur marchande élevée (18M€) et contrat long (2028) : dossier complexe mais stratégiquement prioritaire pour le recrutement 2025-2026.",
      },
      {
        id: "r-lc-02",
        date: "17 oct. 2024",
        dateIso: "2024-10-17",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "video",
        status: "pret",
        note: "B",
        kanban: "scoute",
        comment: "Analyse sur 8 matchs de Ligue 1. Profil confirmé : leadership balle au pied, 91e percentile passes progressives, pressing dominant. Manque légèrement d'expérience dans les chocs directs. Idéal pour le 4-3-3.",
        competition: "Ligue 1",
        affiche: "Monaco vs PSG",
        poste: "MC",
        systeme: "4-3-3",
      },
      {
        id: "r-lc-03",
        date: "05 fév. 2025",
        dateIso: "2025-02-05",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "live",
        status: "pret",
        note: "B",
        kanban: "analyse",
        comment: "3ème observation live au Stade Louis II. Constance exemplaire. Aucune régression par rapport aux matchs précédents. Joue bien dans des systèmes différents. Signalé par l'IA comme similarité 94% avec Farid Boulaya (MC cadre FC Metz).",
        competition: "Ligue 1",
        affiche: "Monaco vs Lyon",
        poste: "MC",
        systeme: "4-2-3-1",
      },
      {
        id: "r-lc-04",
        date: "10 avr. 2025",
        dateIso: "2025-04-10",
        author: "Imrane El Arhrib",
        authorRole: "Directeur Sportif Adjoint",
        type: "global",
        source: "agent",
        status: "priorite",
        note: "A",
        kanban: "negociation",
        comment: "Validation finale en comité de direction (séance du 09/04). Profil unanimement validé. Prêt avec option d'achat envisageable. L'agent confirme que le joueur est ouvert à un défi nouveau. Budget prévisionnel : 2.5M€ prêt + clause achat 12M€. À finaliser avant le 30 juin.",
      },
    ],
  },

  // Abdoul Karim Traoré — reconsidération 🔴→🟡
  {
    id: "traore-04",
    name: "Traoré",
    firstName: "Abdoul Karim",
    position: "Ailier Droit",
    positionShort: "AD",
    club: "Rodez AF",
    clubAbbr: "RAF",
    league: "Ligue 2",
    nationality: "Guinée",
    flag: "🇬🇳",
    age: 21,
    value: "1.2M€",
    contractEnd: "Jun 2027",
    avatarInitials: "AT",
    avatarColor: "#BE185D",
    reports: [
      {
        id: "r-at-01",
        date: "26 sept. 2024",
        dateIso: "2024-09-26",
        author: "Nathan Perrin",
        authorRole: "Analyste Data",
        type: "match",
        source: "video",
        status: "ecarte",
        note: "D",
        kanban: "scoute",
        comment: "Profil signalé par Réseau. Analyse vidéo décevante : 2/8 dribbles réussis, contribution défensive quasi nulle, lecture tactique insuffisante pour L1. Écarté temporairement.",
        competition: "Ligue 2",
        affiche: "Rodez vs Laval",
        poste: "AD",
        systeme: "4-4-2",
      },
      {
        id: "r-at-02",
        date: "21 mars 2025",
        dateIso: "2025-03-21",
        author: "Andréas Schultz",
        authorRole: "Chef Scout",
        type: "match",
        source: "live",
        status: "suivre",
        note: "C",
        kanban: "scoute",
        comment: "Reconsidération après signalement d'une nette progression. Vu en live : transformation notable depuis septembre. 6/9 dribbles, vitesse accrue, meilleure lecture défensive. Seulement 21 ans. À remettre sur la liste de surveillance avec observations mensuelles.",
        competition: "Ligue 2",
        affiche: "Rodez vs Auxerre",
        poste: "AD",
        systeme: "4-3-3",
      },
    ],
  },
];
