import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default async function CampagnePage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return <KanbanBoard />;
}
