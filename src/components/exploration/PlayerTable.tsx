"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, BookmarkPlus, GitCompare, FileText, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { type Player, STATUS_CONFIG, RATING_CONFIG, POSITION_LABELS } from "@/data/players";

type SortKey = "name" | "age" | "marketValueNum" | "contractEndYear" | "rating" | "note";
type SortDir = "asc" | "desc";

// ─── Position badge ────────────────────────────────────────────────────────────
function PosBadge({ pos }: { pos: Player["position"] }) {
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded"
      style={{
        backgroundColor: "rgba(196,43,71,0.12)",
        border: "1px solid rgba(196,43,71,0.35)",
        color: "var(--color-primary-400)",
        whiteSpace: "nowrap",
        fontSize: 11,
      }}
      title={POSITION_LABELS[pos]}
    >
      {pos}
    </span>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Player["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
      style={{
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        whiteSpace: "nowrap",
        fontSize: 11,
      }}
    >
      {status}
    </span>
  );
}

// ─── Rating badge ──────────────────────────────────────────────────────────────
function RatingBadge({ rating }: { rating: Player["rating"] }) {
  const color = RATING_CONFIG[rating];
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto"
      style={{
        backgroundColor: color + "1A",
        border: `1.5px solid ${color}55`,
        color,
      }}
    >
      {rating}
    </div>
  );
}

// ─── Context menu ──────────────────────────────────────────────────────────────
function ContextMenu({
  player,
  onOpenDrawer,
  onClose,
}: {
  player: Player;
  onOpenDrawer: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const items = [
    { icon: ExternalLink, label: "Ouvrir la fiche", action: onOpenDrawer },
    { icon: BookmarkPlus, label: "Ajouter shortlist", action: onClose },
    { icon: GitCompare, label: "Comparer", action: onClose },
    { icon: FileText, label: "Créer un rapport", action: onClose },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 rounded-lg overflow-hidden"
      style={{
        width: 180,
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-600)",
        boxShadow: "var(--shadow-dropdown)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ icon: Icon, label, action }) => (
        <button
          key={label}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors"
          style={{ color: "var(--color-neutral-300)" }}
          onClick={() => { action(); onClose(); }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
        >
          <Icon size={13} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)", flexShrink: 0 }} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Table header cell ─────────────────────────────────────────────────────────
function TH({
  children,
  sortKey,
  currentSort,
  onSort,
  align = "left",
  width,
}: {
  children: React.ReactNode;
  sortKey?: SortKey;
  currentSort: { key: SortKey; dir: SortDir } | null;
  onSort: (k: SortKey) => void;
  align?: "left" | "center";
  width?: number;
}) {
  const isActive = sortKey && currentSort?.key === sortKey;
  return (
    <th
      className="px-3 text-xs font-semibold select-none"
      style={{
        color: isActive ? "var(--color-neutral-200)" : "var(--color-neutral-500)",
        textAlign: align,
        width,
        whiteSpace: "nowrap",
        paddingTop: 10,
        paddingBottom: 10,
        cursor: sortKey ? "pointer" : "default",
        userSelect: "none",
      }}
      onClick={() => sortKey && onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortKey && isActive && (
          currentSort?.dir === "asc"
            ? <ChevronUp size={11} strokeWidth={2} />
            : <ChevronDown size={11} strokeWidth={2} />
        )}
      </span>
    </th>
  );
}

// ─── Main table ────────────────────────────────────────────────────────────────
interface Props {
  players: Player[];
  onRowClick: (p: Player) => void;
}

const PAGE_SIZE = 25;

export function PlayerTable({ players, onRowClick }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ playerId: number } | null>(null);

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
    setPage(1);
  }

  const sorted = [...players].sort((a, b) => {
    if (!sort) return 0;
    let av: string | number, bv: string | number;
    switch (sort.key) {
      case "name": av = a.lastName; bv = b.lastName; break;
      case "age": av = a.age; bv = b.age; break;
      case "marketValueNum": av = a.marketValueNum; bv = b.marketValueNum; break;
      case "contractEndYear": av = a.contractEndYear; bv = b.contractEndYear; break;
      case "rating": av = "ABCDE".indexOf(a.rating); bv = "ABCDE".indexOf(b.rating); break;
      case "note": av = a.note; bv = b.note; break;
      default: return 0;
    }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sort.dir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col h-full">
      {/* Table container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ minWidth: 860 }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-neutral-800)", borderBottom: "1px solid var(--color-neutral-700)" }}>
              <TH sortKey="name" currentSort={sort} onSort={handleSort} width={240}>
                Joueur
              </TH>
              <TH currentSort={sort} onSort={handleSort} width={72} align="center">
                Poste
              </TH>
              <TH currentSort={sort} onSort={handleSort} width={180}>
                Club / Championnat
              </TH>
              <TH sortKey="marketValueNum" currentSort={sort} onSort={handleSort} width={100}>
                Valeur
              </TH>
              <TH currentSort={sort} onSort={handleSort} width={90} align="center">
                Sim. Kanté
              </TH>
              <TH currentSort={sort} onSort={handleSort} width={90} align="center">
                Fit Score
              </TH>
              <TH sortKey="contractEndYear" currentSort={sort} onSort={handleSort} width={110}>
                Fin contrat
              </TH>
              <TH sortKey="rating" currentSort={sort} onSort={handleSort} width={60} align="center">
                Note
              </TH>
              <TH currentSort={sort} onSort={handleSort} width={150} align="center">
                Statut
              </TH>
              <TH currentSort={sort} onSort={handleSort} width={44}>
                {""}
              </TH>
            </tr>
          </thead>
          <tbody>
            {pageData.map((player) => {
              const isHovered = hoveredRow === player.id;
              const menuOpen = contextMenu?.playerId === player.id;

              return (
                <tr
                  key={player.id}
                  onClick={() => onRowClick(player)}
                  onMouseEnter={() => setHoveredRow(player.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    height: 48,
                    cursor: "pointer",
                    backgroundColor: isHovered ? "var(--color-neutral-700)" : "transparent",
                    borderBottom: "1px solid var(--color-neutral-700)",
                    transition: "background-color 80ms ease-out",
                  }}
                >
                  {/* Player: avatar + name + age */}
                  <td className="px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: "var(--color-primary-900)",
                          color: "var(--color-primary-300)",
                          fontFamily: "var(--font-dm-sans)",
                          fontSize: 11,
                        }}
                      >
                        {player.initials}
                      </div>
                      <div className="min-w-0">
                        <div
                          className="text-sm font-medium truncate flex items-center gap-1.5"
                          style={{
                            color: "var(--color-neutral-100)",
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: 13,
                          }}
                        >
                          {player.firstName} {player.lastName} <span>{player.flag}</span>
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--color-neutral-500)", fontSize: 11 }}
                        >
                          {player.age} ans
                          {!player.isUE && (
                            <span
                              className="ml-1.5 font-medium"
                              style={{ color: "var(--color-danger)", fontSize: 10 }}
                            >
                              NON-UE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Position */}
                  <td className="px-3 text-center">
                    <PosBadge pos={player.position} />
                  </td>

                  {/* Club + League */}
                  <td className="px-3">
                    <div
                      className="text-xs font-medium truncate"
                      style={{ color: "var(--color-neutral-200)", fontSize: 12 }}
                    >
                      {player.club}
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: "var(--color-neutral-500)", fontSize: 11 }}
                    >
                      {player.league}
                    </div>
                  </td>

                  {/* Market value */}
                  <td className="px-3">
                    <span
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: "var(--color-neutral-200)" }}
                    >
                      {player.marketValue}
                    </span>
                  </td>

                  {/* AI Models */}
                  <td className="px-3 text-center">
                    <span
                      className="inline-flex items-center justify-center font-bold text-xs"
                      style={{
                        color: player.id % 2 === 0 ? "var(--color-neutral-300)" : "#cc1d3e", // Eclairci
                      }}
                    >
                      {80 + (player.id % 18)}%
                    </span>
                  </td>
                  <td className="px-3 text-center">
                    <div
                      className="inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: (75 + (player.id % 20)) > 85 ? "rgba(109,7,26,0.3)" : "var(--color-neutral-800)",
                        color: (75 + (player.id % 20)) > 85 ? "#ff5277" : "var(--color-neutral-300)",
                        border: `1px solid ${(75 + (player.id % 20)) > 85 ? "rgba(196,43,71,0.5)" : "var(--color-neutral-700)"}`
                      }}
                    >
                      {75 + (player.id % 20)}
                    </div>
                  </td>

                  {/* Contract end */}
                  <td className="px-3">
                    <span
                      className="text-xs tabular-nums"
                      style={{
                        color:
                          player.contractEndYear <= 2025
                            ? "var(--color-warning)"
                            : "var(--color-neutral-400)",
                      }}
                    >
                      {player.contractEnd}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-3 text-center">
                    <RatingBadge rating={player.rating} />
                  </td>

                  {/* Status */}
                  <td className="px-3 text-center">
                    <StatusBadge status={player.status} />
                  </td>

                  {/* Context menu */}
                  <td
                    className="px-3 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded transition-colors mx-auto"
                      style={{
                        opacity: isHovered || menuOpen ? 1 : 0,
                        color: "var(--color-neutral-400)",
                        transition: "opacity 120ms ease-out, background-color 120ms ease-out",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu(menuOpen ? null : { playerId: player.id });
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-600)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                      }
                    >
                      <MoreHorizontal size={15} strokeWidth={1.5} />
                    </button>
                    {menuOpen && (
                      <ContextMenu
                        player={player}
                        onOpenDrawer={() => { onRowClick(player); setContextMenu(null); }}
                        onClose={() => setContextMenu(null)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-4 py-3 border-t flex-shrink-0"
        style={{
          backgroundColor: "var(--color-neutral-900)",
          borderColor: "var(--color-neutral-700)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
          Joueurs{" "}
          <span style={{ color: "var(--color-neutral-300)" }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)}
          </span>{" "}
          sur{" "}
          <span style={{ color: "var(--color-neutral-300)" }}>{sorted.length}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded text-xs transition-colors"
            style={{
              color: page === 1 ? "var(--color-neutral-600)" : "var(--color-neutral-300)",
              backgroundColor: "transparent",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (page > 1) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)";
            }}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-7 h-7 flex items-center justify-center rounded text-xs transition-colors"
              style={{
                backgroundColor: p === page ? "var(--color-primary-900)" : "transparent",
                color: p === page ? "var(--color-primary-300)" : "var(--color-neutral-400)",
              }}
              onMouseEnter={(e) => {
                if (p !== page) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)";
              }}
              onMouseLeave={(e) => {
                if (p !== page) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded text-xs transition-colors"
            style={{
              color: page === totalPages ? "var(--color-neutral-600)" : "var(--color-neutral-300)",
              backgroundColor: "transparent",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (page < totalPages) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)";
            }}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            Suivant
          </button>
        </div>
      </div>
    </div >
  );
}
