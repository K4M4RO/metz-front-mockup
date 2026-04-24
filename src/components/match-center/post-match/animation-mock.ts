export type AnimationEvent = {
  id: string;
  type: 'ghost' | 'passing' | 'pressure';
  label: string;
  description: string;
  timestamp: number; // in seconds from match start
  players: { id: string; x: number; y: number; role: string }[];
  spaceHighlight?: { x: number; y: number; radius: number };
  passingLines?: { from: string; to: string; type: 'solid' | 'dotted' | 'gold'; thickness: number }[];
};

export const ANIMATION_EVENTS: AnimationEvent[] = [
  // ─── GHOST PLAYER ───
  {
    id: "g1",
    type: "ghost",
    label: "Appel de diversion (Disruption)",
    description: "L'appel d'Enzo Millot aspire le défenseur central, libérant l'axe pour Mikautadze.",
    timestamp: 1240,
    players: [
      { id: "millot", x: 0.75, y: 0.4, role: "runner" },
      { id: "mikautadze", x: 0.6, y: 0.5, role: "target" },
      { id: "def1", x: 0.72, y: 0.42, role: "opponent" }
    ],
    spaceHighlight: { x: 0.6, y: 0.5, radius: 25 }
  },
  {
    id: "g2",
    type: "ghost",
    label: "Appel dans le dos (Behind)",
    description: "Course profonde de Camara qui étire le bloc.",
    timestamp: 2150,
    players: [
      { id: "camara", x: 0.85, y: 0.3, role: "runner" },
      { id: "def2", x: 0.8, y: 0.35, role: "opponent" }
    ],
    spaceHighlight: { x: 0.8, y: 0.35, radius: 30 }
  },
  {
    id: "g3",
    type: "ghost",
    label: "Décrochage (Coming Short)",
    description: "Mikautadze vient demander le ballon, libérant son défenseur.",
    timestamp: 3420,
    players: [
      { id: "mikautadze", x: 0.45, y: 0.5, role: "runner" },
      { id: "def1", x: 0.55, y: 0.5, role: "opponent" }
    ],
    spaceHighlight: { x: 0.65, y: 0.5, radius: 20 }
  },
  // ─── PASSING OPTIONS ───
  {
    id: "p1",
    type: "passing",
    label: "Relais trouvé (Option Received)",
    description: "Le porteur trouve l'option la plus efficace malgré 2 autres solutions.",
    timestamp: 850,
    players: [
      { id: "carrier", x: 0.4, y: 0.6, role: "carrier" },
      { id: "millot", x: 0.55, y: 0.45, role: "option" },
      { id: "jallow", x: 0.55, y: 0.75, role: "option" }
    ],
    passingLines: [
      { from: "carrier", to: "millot", type: "solid", thickness: 4 },
      { from: "carrier", to: "jallow", type: "solid", thickness: 1 }
    ]
  },
  {
    id: "p2",
    type: "passing",
    label: "Option ignorée (Not Targeted)",
    description: "Jallow était seul à l'opposé, mais le porteur a forcé dans l'axe.",
    timestamp: 1560,
    players: [
      { id: "carrier", x: 0.5, y: 0.8, role: "carrier" },
      { id: "jallow", x: 0.5, y: 0.2, role: "isolated" }
    ],
    passingLines: [
      { from: "carrier", to: "jallow", type: "dotted", thickness: 2 }
    ]
  },
  {
    id: "p3",
    type: "passing",
    label: "Brisage de ligne (Line Breaking)",
    description: "Passe complexe trouvant l'interligne.",
    timestamp: 2890,
    players: [
      { id: "carrier", x: 0.35, y: 0.5, role: "carrier" },
      { id: "mikautadze", x: 0.6, y: 0.5, role: "target" }
    ],
    passingLines: [
      { from: "carrier", to: "mikautadze", type: "gold", thickness: 3 }
    ]
  },
  // ─── PRESSURE ───
  {
    id: "pr1",
    type: "pressure",
    label: "Soutien manquant (No Option)",
    description: "Porteur enfermé sans aucune solution de passe.",
    timestamp: 4120,
    players: [
      { id: "carrier", x: 0.7, y: 0.1, role: "carrier" },
      { id: "def1", x: 0.72, y: 0.12, role: "opponent" },
      { id: "def2", x: 0.68, y: 0.08, role: "opponent" }
    ],
    passingLines: []
  },
  {
    id: "pr2",
    type: "pressure",
    label: "Surcharge de zone (Overload)",
    description: "Densité de joueurs permettant une conservation fluide.",
    timestamp: 5240,
    players: [
      { id: "p1", x: 0.4, y: 0.4, role: "carrier" },
      { id: "p2", x: 0.45, y: 0.45, role: "teammate" },
      { id: "p3", x: 0.42, y: 0.38, role: "teammate" }
    ],
    passingLines: [
      { from: "p1", to: "p2", type: "solid", thickness: 2 },
      { from: "p1", to: "p3", type: "solid", thickness: 2 },
      { from: "p2", to: "p3", type: "solid", thickness: 2 }
    ]
  }
];
