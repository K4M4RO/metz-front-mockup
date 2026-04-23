import { KanbanBoard } from "@/components/kanban/KanbanBoard";

const CAMPAIGN_MOCKS: Record<string, { title: string; subtitle: string }> = {
  "ld-2025": { title: "Recherche Latéral Droit", subtitle: "11 joueurs · Créée le 12/01/2025 · Resp: Thomas Richard" },
  "bu-2025": { title: "Buteur - Ligue 2 / National", subtitle: "8 joueurs · Créée le 05/02/2025 · Resp: Jean Martin" },
  "mc-u21": { title: "Milieu Créateur U21 France", subtitle: "4 joueurs · Créée le 18/02/2025 · Resp: David Garcia" },
  "dc-xp": { title: "Défenseur Central d'Expérience", subtitle: "15 joueurs · Créée le 10/11/2024 · Resp: Thomas Richard" },
};

export default async function CampagnePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = CAMPAIGN_MOCKS[id] || { title: "Campagne de recrutement", subtitle: "Scouting en cours" };
  
  return <KanbanBoard title={campaign.title} subtitle={campaign.subtitle} />;
}
