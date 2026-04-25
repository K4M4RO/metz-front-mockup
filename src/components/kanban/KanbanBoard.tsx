"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
    borderColor: "#6B7280",
    cards: [
      { id: "c1", name: "Karim Diallo",  position: "LD",    age: 24, club: "AS Monaco",       note: 6.8, scout: "J.Martin",  date: "14 janv", initials: "KD", avatarBg: "#1E40AF" },
      { id: "c2", name: "Noa Fabre",     position: "LD",    age: 21, club: "Brestois",        note: 7.1, scout: "T.Richard", date: "16 janv", initials: "NF", avatarBg: "#065F46" },
      { id: "c3", name: "Marco Bianchi", position: "LD",    age: 26, club: "Genoa",           note: 6.5, scout: "D.Garcia",  date: "18 janv", initials: "MB", avatarBg: "#7C2D12" },
      { id: "c4", name: "Artur Novak",   position: "LD",    age: 23, club: "Lechia Gdańsk",   note: 6.2, scout: "J.Martin",  date: "20 janv", initials: "AN", avatarBg: "#4C1D95" },
    ],
  },
  {
    id: "scoute_video",
    label: "SCOUTÉ VIDÉO",
    borderColor: "#3B82F6",
    cards: [
      { id: "c5", name: "Yusuf Çelik",     position: "LD",    age: 25, club: "Trabzonspor",       note: 7.4, scout: "D.Garcia",  date: "22 janv", initials: "YÇ", avatarBg: "#0F766E" },
      { id: "c6", name: "Gabriel Ferreira", position: "LD/AD", age: 22, club: "Vitória SC",        note: 7.6, scout: "T.Richard", date: "24 janv", initials: "GF", avatarBg: "#166534" },
      { id: "c7", name: "Samir Benzaki",    position: "LD",    age: 27, club: "SM Caen",           note: 7.0, scout: "J.Martin",  date: "26 janv", initials: "SB", avatarBg: "#92400E" },
    ],
  },
  {
    id: "en_analyse",
    label: "EN ANALYSE LIVE",
    borderColor: "#EAB308",
    cards: [
      { id: "c8", name: "Lucas Petrov", position: "LD",    age: 24, club: "Girondins Bordeaux", note: 7.8, scout: "T.Richard", date: "28 janv", initials: "LP", avatarBg: "#1E3A5F" },
      { id: "c9", name: "David Moreno", position: "LD",    age: 26, club: "CD Leganés",        note: 7.5, scout: "D.Garcia",  date: "30 janv", initials: "DM", avatarBg: "#831843" },
    ],
  },
  {
    id: "valide_direction",
    label: "VALIDÉ DIRECTION",
    borderColor: "#22C55E",
    locked: true,
    cards: [
      { id: "c10", name: "Rafael Esteves", position: "LD", age: 23, club: "SC Braga", note: 8.2, scout: "T.Richard", date: "2 févr", initials: "RE", avatarBg: "#1E3A8A", locked: true },
    ],
  },
  {
    id: "en_negociation",
    label: "EN NÉGOCIATION",
    borderColor: "#C42B47",
    cards: [
      { id: "c11", name: "Fayçal Abdou", position: "LD/MD", age: 25, club: "FC Sète", note: 8.5, scout: "J.Martin", date: "5 févr", initials: "FA", avatarBg: "#065F46" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function noteBadgeStyle(note: number): { background: string; color: string } {
  if (note >= 8.0) return { background: "rgba(var(--note-high-rgb), 0.15)", color: "var(--note-high)" };
  if (note >= 7.0) return { background: "rgba(var(--note-mid-rgb),  0.15)", color: "var(--note-mid)"  };
  if (note >= 6.5) return { background: "rgba(var(--note-low-rgb),  0.15)", color: "var(--note-low)"  };
  return               { background: "rgba(var(--note-bad-rgb),  0.15)", color: "var(--note-bad)"  };
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

  return (
    <div
      draggable={!isLocked}
      onDragStart={isLocked ? undefined : (e) => onDragStart(e, card.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-hover)" : "var(--color-neutral-800, #1F2937)",
        border: hovered ? "1px solid transparent" : "1px solid var(--color-neutral-700, #374151)",
        borderLeft: hovered ? "3px solid var(--color-primary-400)" : "1px solid var(--color-neutral-700, #374151)",
        borderRadius: "8px",
        padding: "12px",
        cursor: isLocked ? "not-allowed" : "grab",
        opacity: isLocked ? 0.9 : 1,
        transition: "background 0.15s, border 0.15s",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Lock icon for locked cards */}
      {isLocked && (
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      )}

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
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--color-neutral-100, #F3F4F6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {card.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-neutral-500, #6B7280)" }}>
            {card.position} · {card.age} ans
          </div>
        </div>
      </div>

      {/* Club */}
      <div style={{ fontSize: 12, color: "var(--color-neutral-400, #9CA3AF)", marginBottom: 10 }}>
        {card.club}
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
        <span style={{ fontSize: 11, color: "var(--color-neutral-500, #6B7280)", marginLeft: "auto" }}>
          {card.scout}
        </span>
        <span style={{ fontSize: 11, color: "var(--color-neutral-500, #6B7280)" }}>
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
        background: isDragOver ? "rgba(var(--primary-rgb), 0.08)" : "var(--color-neutral-900, #111827)",
        border: isDragOver ? "1px solid rgba(var(--primary-rgb), 0.3)" : "1px solid var(--color-neutral-800, #1F2937)",
        borderTop: `4px solid ${column.borderColor}`,
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
        borderBottom: "1px solid var(--color-neutral-800, #1F2937)",
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "var(--text-primary)",
          textTransform: "uppercase",
        }}>
          {column.label}
        </span>
        <span style={{
          background: "var(--color-neutral-700, #374151)",
          color: "var(--color-neutral-400, #9CA3AF)",
          borderRadius: 20,
          padding: "1px 9px",
          fontSize: 11,
          fontWeight: 600,
        }}>
          {column.cards.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, padding: "10px 10px 6px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
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
      <div style={{ padding: "8px 10px 12px" }}>
        <button
          onClick={() => {}}
          style={{
            width: "100%",
            padding: "7px 0",
            background: "transparent",
            border: "1px solid var(--color-primary-400)",
            borderRadius: 6,
            color: "var(--color-primary-400)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(var(--primary-rgb), 0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          + Ajouter
        </button>
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

    // Move card
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

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "var(--color-neutral-950, #030712)",
      fontFamily: "var(--font-dm-sans, var(--font-sans, sans-serif))",
    }}>
      {/* Page header */}
      <div style={{
        padding: "24px 28px 20px",
        borderBottom: "1px solid var(--color-neutral-800, #1F2937)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
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
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-700)",
              color: "var(--color-neutral-400)",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-neutral-700)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-neutral-800)";
              e.currentTarget.style.color = "var(--color-neutral-400)";
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
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-neutral-500, #6B7280)" }}>
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
              border: "1px solid var(--color-neutral-700, #374151)",
              borderRadius: 6,
              color: "var(--color-neutral-300, #D1D5DB)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Exporter PDF
          </button>
          <button
            onClick={() => {}}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid var(--color-neutral-700, #374151)",
              borderRadius: 6,
              color: "var(--color-neutral-300, #D1D5DB)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Archiver
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div
          style={{
            display: "flex",
            gap: 16,
            height: "100%",
            minWidth: "max-content",
            padding: 24,
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

      {/* Toast */}
      <Toast visible={toastVisible} />
    </div>
  );
}
