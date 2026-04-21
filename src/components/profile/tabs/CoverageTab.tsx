"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { HeatmapPitch } from "@/components/profile/HeatmapPitch";
import { MATCHES, SEASON_HOTSPOTS, MATCH_HEATMAP_PATTERNS } from "@/data/enzo-millot-extended";
import type { MatchResult } from "@/data/enzo-millot-extended";

const FILTERS = ["Tous", "Domicile", "Extérieur", "Victoires", "Défaites"] as const;
type Filter = typeof FILTERS[number];

const RESULT_COLORS: Record<MatchResult, string> = {
  V: "#22C55E", N: "#EAB308", D: "#EF4444",
};

interface ModalMatch { id: number; opponent: string; score: string; result: MatchResult; date: string; minutes: number; }

export function CoverageTab() {
  const [filter, setFilter] = useState<Filter>("Tous");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalMatch | null>(null);

  const filtered = MATCHES.filter((m) => {
    if (filter === "Domicile")  return m.home;
    if (filter === "Extérieur") return !m.home;
    if (filter === "Victoires") return m.result === "V";
    if (filter === "Défaites")  return m.result === "D";
    return true;
  });

  const PAGE_SIZE = 12;
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <div className="p-6 space-y-5">
      {/* Season heatmap */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider block mb-3"
          style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
        >
          Heatmap Saison — Agrégée
        </span>
        <div className="overflow-hidden rounded" style={{ maxWidth: "100%" }}>
          <HeatmapPitch hotspots={SEASON_HOTSPOTS} width={800} idPrefix="season" />
        </div>
        {/* Color legend */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>Froid</span>
          <div
            className="flex-1 h-2 rounded-full"
            style={{ background: "linear-gradient(to right, #1E3A5F, #7B2D8B, #C42B47, #FF6B35)", maxWidth: 200 }}
          />
          <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>Chaud</span>
        </div>
      </div>

      {/* Thumbnail grid */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className="px-3 py-1 rounded-full text-xs transition-colors"
                style={{
                  backgroundColor: active ? "rgba(196,43,71,0.18)" : "var(--color-neutral-700)",
                  border: `1px solid ${active ? "rgba(196,43,71,0.50)" : "var(--color-neutral-600)"}`,
                  color: active ? "var(--color-primary-300)" : "var(--color-neutral-400)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {visible.map((match, idx) => {
            const pattern = MATCH_HEATMAP_PATTERNS[idx % MATCH_HEATMAP_PATTERNS.length];
            return (
              <button
                key={match.id}
                className="rounded overflow-hidden text-left group transition-all"
                style={{ border: "1px solid var(--color-neutral-700)" }}
                onClick={() => setModal(match)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-700)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(196,43,71,0.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-700)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <HeatmapPitch hotspots={pattern} width={200} idPrefix={`m${match.id}`} />
                <div
                  className="px-2 py-1.5"
                  style={{ backgroundColor: "var(--color-neutral-900)" }}
                >
                  <p className="text-xs font-medium truncate" style={{ color: "var(--color-neutral-200)" }}>
                    {match.abbr} · {match.date}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span style={{ color: RESULT_COLORS[match.result], fontSize: 10, fontWeight: 700 }}>
                      {match.result}
                    </span>
                    <span style={{ color: "var(--color-neutral-500)", fontSize: 10 }}>{match.score}</span>
                    <span style={{ color: "var(--color-neutral-600)", fontSize: 10 }}>· {match.minutes}mn</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Load more */}
        {hasMore && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="mt-4 w-full py-2 rounded-lg text-xs transition-colors"
            style={{
              backgroundColor: "var(--color-neutral-700)",
              color: "var(--color-neutral-400)",
              border: "1px solid var(--color-neutral-600)",
            }}
          >
            Charger plus ▼
          </button>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setModal(null)} />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="rounded-xl overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: "var(--color-neutral-800)",
                border: "1px solid var(--color-neutral-600)",
                boxShadow: "var(--shadow-modal)",
                width: 500,
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: "var(--color-neutral-700)" }}
              >
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)", fontSize: 15 }}>
                    {modal.opponent}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: "var(--color-neutral-400)" }}>
                    {modal.date} · {modal.minutes}mn ·{" "}
                  </span>
                  <span style={{ color: RESULT_COLORS[modal.result], fontSize: 12, fontWeight: 700 }}>
                    {modal.result} {modal.score}
                  </span>
                </div>
                <button onClick={() => setModal(null)} style={{ color: "var(--color-neutral-500)" }}>
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
              <HeatmapPitch
                hotspots={MATCH_HEATMAP_PATTERNS[MATCHES.findIndex(m => m.id === modal.id) % MATCH_HEATMAP_PATTERNS.length]}
                width={500}
                idPrefix={`modal-${modal.id}`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
