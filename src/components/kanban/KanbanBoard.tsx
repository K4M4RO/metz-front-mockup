"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, FileText, CheckCircle2, Clock, Eye, Activity, FileLineChart } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Card {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  note: number;
  scout: string;
  date: string;
  initials: string;
  avatarBg: string;
  locked?: boolean;
  reports: {
    global: boolean;
    match: boolean;
    deep: boolean;
  };
  daysInStage: number;
}

interface Column {
  id: string;
  label: string;
  borderColor: string;
  locked?: boolean;
  cards: Card[];
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_COLUMNS: Column[] = [
  {
    id: "identifie",
    label: "IDENTIFIÉ",
    borderColor: "var(--color-neutral-500)",
    cards: [
      { id: "c1", name: "Karim Diallo",  position: "LD",    age: 24, club: "AS Monaco",       note: 6.8, scout: "J.Martin",  date: "14 janv", initials: "KD", avatarBg: "#1E40AF", reports: { global: false, match: false, deep: false }, daysInStage: 2 },
      { id: "c2", name: "Noa Fabre",     position: "LD",    age: 21, club: "Brestois",        note: 7.1, scout: "T.Richard", date: "16 janv", initials: "NF", avatarBg: "#065F46", reports: { global: false, match: false, deep: false }, daysInStage: 12 },
      { id: "c4", name: "Artur Novak",   position: "LD",    age: 23, club: "Lechia Gdańsk",   note: 6.2, scout: "J.Martin",  date: "20 janv", initials: "AN", avatarBg: "#4C1D95", reports: { global: false, match: false, deep: false }, daysInStage: 5 },
    ],
  },
  {
    id: "validation_scouting_data",
    label: "VAL. SCOUTING DATA",
    borderColor: "var(--color-info)",
    cards: [
      { id: "c5", name: "Yusuf Çelik",     position: "LD",    age: 25, club: "Trabzonspor",       note: 7.4, scout: "D.Garcia",  date: "22 janv", initials: "YÇ", avatarBg: "#0F766E", reports: { global: true, match: false, deep: false }, daysInStage: 4 },
      { id: "c7", name: "Samir Benzaki",    position: "LD",    age: 27, club: "SM Caen",           note: 7.0, scout: "J.Martin",  date: "26 janv", initials: "SB", avatarBg: "#92400E", reports: { global: true, match: false, deep: false }, daysInStage: 1 },
    ],
  },
  {
    id: "validation_analyse_match",
    label: "VAL. ANALYSE MATCH",
    borderColor: "var(--color-warning)",
    cards: [
      { id: "c8", name: "Lucas Petrov", position: "LD",    age: 24, club: "Girondins", note: 7.8, scout: "T.Richard", date: "28 janv", initials: "LP", avatarBg: "#1E3A5F", reports: { global: true, match: true, deep: false }, daysInStage: 8 },
    ],
  },
  {
    id: "validation_analyse_approfondi",
    label: "VAL. ANALYSE APPRO.",
    borderColor: "var(--color-primary-400)",
    cards: [
      { id: "c6", name: "Gabriel Ferreira", position: "LD/AD", age: 22, club: "Vitória SC",        note: 7.6, scout: "T.Richard", date: "24 janv", initials: "GF", avatarBg: "#166534", reports: { global: true, match: true, deep: true }, daysInStage: 2 },
      { id: "c9", name: "David Moreno", position: "LD",    age: 26, club: "CD Leganés",        note: 7.5, scout: "D.Garcia",  date: "30 janv", initials: "DM", avatarBg: "#831843", reports: { global: true, match: true, deep: false }, daysInStage: 1 },
    ],
  },
  {
    id: "valide_direction",
    label: "VALIDÉ DIRECTION",
    borderColor: "var(--color-success)",
    locked: true,
    cards: [
      { id: "c10", name: "Rafael Esteves", position: "LD", age: 23, club: "SC Braga", note: 8.2, scout: "T.Richard", date: "2 févr", initials: "RE", avatarBg: "#1E3A8A", locked: true, reports: { global: true, match: true, deep: true }, daysInStage: 15 },
    ],
  },
  {
    id: "en_negociation",
    label: "EN NÉGOCIATION",
    borderColor: "var(--color-primary-600)",
    cards: [
      { id: "c11", name: "Fayçal Abdou", position: "LD/MD", age: 25, club: "FC Sète", note: 8.5, scout: "J.Martin", date: "5 févr", initials: "FA", avatarBg: "#065F46", reports: { global: true, match: true, deep: true }, daysInStage: 3 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function noteBadgeStyle(note: number): { background: string; color: string } {
  if (note >= 8.0) return { background: "rgba(34,197,94,0.15)",  color: "var(--color-success)" };
  if (note >= 7.0) return { background: "rgba(234,179,8,0.15)",  color: "var(--color-warning)" };
  if (note >= 6.5) return { background: "rgba(249,115,22,0.15)", color: "#FB923C" };
  return               { background: "rgba(239,68,68,0.15)",  color: "var(--color-danger)" };
}

// ─── Card component ───────────────────────────────────────────────────────────

function KanbanCard({
  card,
  colLocked,
  onDragStart,
}: {
  card: Card;
  colLocked: boolean;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const badgeStyle = noteBadgeStyle(card.note);
  const isLocked = colLocked || card.locked;

  // Calcul completion
  const reportsCount = (card.reports.global ? 1 : 0) + (card.reports.match ? 1 : 0) + (card.reports.deep ? 1 : 0);
  const completionPct = (reportsCount / 3) * 100;

  // Inactivity warning
  const isStale = card.daysInStage > 7;

  return (
    <div
      draggable={!isLocked}
      onDragStart={isLocked ? undefined : (e) => onDragStart(e, card.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-hover)" : "var(--bg-surface)",
        borderTop: hovered ? "1px solid var(--border-default)" : "1px solid var(--border-subtle)",
        borderRight: hovered ? "1px solid var(--border-default)" : "1px solid var(--border-subtle)",
        borderBottom: hovered ? "1px solid var(--border-default)" : "1px solid var(--border-subtle)",
        borderLeft: hovered ? "3px solid var(--color-primary-400)" : "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "12px",
        cursor: isLocked ? "not-allowed" : "grab",
        opacity: isLocked ? 0.9 : 1,
        transition: "background 0.15s, border 0.15s",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Absolute top-right corner indicators */}
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: "6px", alignItems: "center" }}>
        {isStale && !isLocked && (
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--color-danger)", background: "rgba(239,68,68,0.1)", padding: "2px 4px", borderRadius: "4px" }}>
            J+{card.daysInStage}
          </span>
        )}
        {isLocked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        )}
      </div>

      {/* Header row: avatar + name + position/age */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: card.avatarBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "var(--text-on-accent)",
          flexShrink: 0,
        }}>
          {card.initials}
        </div>
        {/* Name + position */}
        <div style={{ minWidth: 0, paddingRight: "40px" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {card.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {card.position} · {card.age} ans
          </div>
        </div>
      </div>

      {/* Club */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
        {card.club}
      </div>

      {/* Reports Indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <div style={{ flex: 1, height: "4px", background: "var(--bg-surface-raised)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${completionPct}%`, height: "100%", background: completionPct === 100 ? "var(--color-success)" : "var(--color-primary-400)", transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <span title="Rapport Global" style={{ opacity: card.reports.global ? 1 : 0.2 }}><Activity size={12} color={card.reports.global ? "var(--color-info)" : "var(--text-disabled)"} /></span>
          <span title="Rapport Match" style={{ opacity: card.reports.match ? 1 : 0.2 }}><Eye size={12} color={card.reports.match ? "var(--color-warning)" : "var(--text-disabled)"} /></span>
          <span title="Analyse Approfondie" style={{ opacity: card.reports.deep ? 1 : 0.2 }}><FileLineChart size={12} color={card.reports.deep ? "var(--color-primary-400)" : "var(--text-disabled)"} /></span>
        </div>
      </div>

      {/* Bottom row: note + scout + date */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{
          ...badgeStyle,
          borderRadius: 4,
          padding: "2px 7px",
          fontSize: 11,
          fontWeight: 700,
        }}>
          {card.note.toFixed(1)}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-disabled)", marginLeft: "auto" }}>
          {card.scout}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-disabled)" }}>
          · {card.date}
        </span>
      </div>
    </div>
  );
}

// ─── Column component ─────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
}: {
  column: Column;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent, colId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, colId: string) => void;
  onCardDragStart: (e: React.DragEvent, cardId: string, fromColId: string) => void;
}) {
  return (
    <div
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
      style={{
        width: 280,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: isDragOver ? "rgba(var(--primary-rgb), 0.08)" : "transparent",
        border: isDragOver ? "1px dashed var(--color-primary-400)" : "1px solid transparent",
        borderRadius: 10,
        overflow: "hidden",
        transition: "background 0.15s, border 0.15s",
      }}
    >
      {/* Column header */}
      <div style={{
        padding: "12px 14px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid var(--border-subtle)",
        marginBottom: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: column.borderColor }} />
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
          }}>
            {column.label}
          </span>
        </div>
        <span style={{
          background: "var(--bg-surface-raised)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 20,
          padding: "1px 9px",
          fontSize: 11,
          fontWeight: 600,
        }}>
          {column.cards.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, padding: "4px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            colLocked={!!column.locked}
            onDragStart={(e, cardId) => onCardDragStart(e, cardId, column.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 4px 12px" }}>
        <button
          onClick={() => {}}
          style={{
            width: "100%",
            padding: "7px 0",
            background: "var(--bg-surface)",
            border: "1px dashed var(--border-strong)",
            borderRadius: 6,
            color: "var(--text-muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { 
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-primary-400)"; 
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary-400)"; 
          }}
          onMouseLeave={(e) => { 
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)"; 
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; 
          }}
        >
          + Ajouter
        </button>
      </div>
    </div>
  );
}

// ─── Smart Sidebar component ──────────────────────────────────────────────────

function SmartSidebar() {
  return (
    <div style={{
      width: "320px",
      background: "var(--bg-surface)",
      borderLeft: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      gap: "24px",
      overflowY: "auto"
    }}>
      <div>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <AlertCircle size={16} color="var(--color-primary-400)" />
          À faire en priorité
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div style={{ background: "var(--bg-surface-raised)", borderRadius: "8px", border: "1px solid var(--border-subtle)", padding: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Noa Fabre (Identifié)</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>Carte inactive depuis 12 jours. Aucun rapport produit.</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ fontSize: "10px", fontWeight: 600, background: "var(--color-primary-400)", color: "var(--text-on-accent)", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Créer Rapport</button>
              <button style={{ fontSize: "10px", fontWeight: 600, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-strong)", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Écarter</button>
            </div>
          </div>

          <div style={{ background: "var(--bg-surface-raised)", borderRadius: "8px", border: "1px solid var(--border-subtle)", padding: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Lucas Petrov (Val. Match)</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>Analyse match positive validée. En attente d'Analyse Approfondie.</div>
            <button style={{ fontSize: "10px", fontWeight: 600, background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-strong)", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", width: "100%" }}>Lancer l'analyse</button>
          </div>

        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <CheckCircle2 size={16} color="var(--color-success)" />
          Checklist Qualité
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Cibles identifiées</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>11 / 15</span>
          </div>
          <div style={{ width: "100%", height: "4px", background: "var(--bg-surface-raised)", borderRadius: "2px" }}>
            <div style={{ width: "75%", height: "100%", background: "var(--text-primary)", borderRadius: "2px" }} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginTop: "8px" }}>
            <span>Rapports complétés</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>64%</span>
          </div>
          <div style={{ width: "100%", height: "4px", background: "var(--bg-surface-raised)", borderRadius: "2px" }}>
            <div style={{ width: "64%", height: "100%", background: "var(--color-warning)", borderRadius: "2px" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginTop: "8px" }}>
            <span>Comparaisons (Top 3)</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>0 / 1</span>
          </div>
          <div style={{ width: "100%", height: "4px", background: "var(--bg-surface-raised)", borderRadius: "2px" }}>
            <div style={{ width: "0%", height: "100%", background: "var(--color-success)", borderRadius: "2px" }} />
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Clock size={16} color="var(--text-muted)" />
          Activité Récente
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
          <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "1px", background: "var(--border-subtle)", zIndex: 0 }} />
          
          <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-primary-400)", color: "var(--text-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>DG</div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-primary)" }}><strong>D.Garcia</strong> a ajouté un rapport <em>Match</em> pour <strong>D. Moreno</strong></div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>Il y a 2 heures</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-success)", color: "var(--text-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>TR</div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-primary)" }}><strong>T.Richard</strong> a validé <strong>R. Esteves</strong> (Direction)</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>Hier à 14:30</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--text-muted)", color: "var(--text-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>SYS</div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-primary)" }}>Campagne créée depuis la shortlist <em>Cibles Portugal</em></div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>12 Janvier 2025</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Toast component ──────────────────────────────────────────────────────────

function Toast({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.25s, transform 0.25s",
      pointerEvents: "none",
      zIndex: 9999,
      background: "var(--bg-surface-raised)",
      border: "1px solid var(--color-danger)",
      borderRadius: 8,
      padding: "10px 20px",
      color: "var(--color-danger)",
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      🔒 Permission insuffisante
    </div>
  );
}

// ─── Main board ───────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  title?: string;
  subtitle?: string;
}

export function KanbanBoard({ 
  title = "Recherche Latéral Droit", 
  subtitle = "11 joueurs · Créée le 12/01/2025 · Resp: Thomas R." 
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store {cardId, fromColId} during a drag
  const dragRef = useRef<{ cardId: string; fromColId: string } | null>(null);

  function showToast(message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  }

  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, []);

  function handleCardDragStart(e: React.DragEvent, cardId: string, fromColId: string) {
    dragRef.current = { cardId, fromColId };
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, colId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColId(colId);
  }

  function handleDragLeave() {
    setDragOverColId(null);
  }

  function handleDrop(e: React.DragEvent, toColId: string) {
    e.preventDefault();
    setDragOverColId(null);

    if (!dragRef.current) return;
    const { cardId, fromColId } = dragRef.current;
    dragRef.current = null;

    // No-op: same column
    if (fromColId === toColId) return;

    // Locked column: deny
    const targetCol = columns.find((c) => c.id === toColId);
    if (targetCol?.locked) {
      showToast("Permission insuffisante");
      return;
    }

    // Interactive prompt logic mock
    if (confirm(`Confirmer le déplacement vers ${targetCol?.label} ?\n\n(En production, ceci ouvrira la modale de rapport si manquant)`)) {
      setColumns((prev) => {
        const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
        const srcCol = next.find((c) => c.id === fromColId);
        const dstCol = next.find((c) => c.id === toColId);
        if (!srcCol || !dstCol) return prev;
        const cardIdx = srcCol.cards.findIndex((c) => c.id === cardId);
        if (cardIdx === -1) return prev;
        const [card] = srcCol.cards.splice(cardIdx, 1);
        dstCol.cards.push(card);
        return next;
      });
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "var(--bg-app)",
      fontFamily: "var(--font-dm-sans, var(--font-sans, sans-serif))",
    }}>
      {/* Page header */}
      <div style={{
        padding: "24px 28px 20px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Left: back button + title + subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link 
            href="/recrutement/campagnes"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-surface-raised)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-surface-raised)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>

          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {title}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => {}}
            style={{
              padding: "8px 16px",
              background: "var(--color-primary-400)",
              border: "none",
              borderRadius: 6,
              color: "var(--text-on-accent)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-600)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-400)"; }}
          >
            + Ajouter un joueur
          </button>
          <button
            onClick={() => {}}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid var(--border-strong)",
              borderRadius: 6,
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Comparer (2)
          </button>
          <button
            onClick={() => {}}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid var(--border-strong)",
              borderRadius: 6,
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Exporter Synthèse
          </button>
        </div>
      </div>

      {/* Main Content Area (Kanban + Sidebar) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Board */}
        <div className="flex-1 overflow-x-auto" style={{ padding: "24px", background: "var(--bg-app)" }}>
          <div
            style={{
              display: "flex",
              gap: 16,
              height: "100%",
              minWidth: "max-content",
            }}
          >
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                isDragOver={dragOverColId === col.id}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onCardDragStart={handleCardDragStart}
              />
            ))}
          </div>
        </div>

        {/* Smart Sidebar */}
        <SmartSidebar />

      </div>

      {/* Toast */}
      <Toast visible={toastVisible} />
    </div>
  );
}
