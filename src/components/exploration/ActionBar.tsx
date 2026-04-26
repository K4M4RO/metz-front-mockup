"use client";

import { useState } from "react";
import { LayoutList, Grid3X3, ScatterChart, X, Download, Brain, User, Target, Plus } from "lucide-react";

export type ViewMode = "liste" | "grille" | "scatter";

interface QuickPill {
  id: string;
  label: string;
  emoji: string;
}

const QUICK_PILLS: QuickPill[] = [
  { id: "rookies", label: "Rookies", emoji: "🌟" },
  { id: "libre", label: "Libre", emoji: "🆓" },
  { id: "extra", label: "Joueur extracommunautaire", emoji: "🌍" },
];

interface Props {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  totalCount: number;
  activePills: string[];
  onTogglePill: (id: string) => void;
}

export function ActionBar({ view, onViewChange, totalCount, activePills, onTogglePill }: Props) {
  return (
    <div className="flex flex-col border-b" style={{ borderColor: "var(--color-neutral-700)" }}>
      {/* 🌟 NOUVEAU: Barre Modèles IA */}
      {/* 🌍 NOUVEAU: Barre Championnat (anciennement Contexte) */}
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-3 flex-wrap border-b"
        style={{ backgroundColor: "var(--color-neutral-950)", borderColor: "var(--color-neutral-800)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-neutral-300)] uppercase tracking-wider flex items-center gap-1.5">
            <Target size={14} className="text-[var(--color-primary-500)]" /> Championnat :
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["Ligue 1", "Premier League", "Serie A", "La Liga", "Bundesliga"].map(league => (
            <button
              key={league}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: "var(--color-neutral-900)",
                border: "1px solid var(--color-neutral-700)",
                color: "var(--color-neutral-400)"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-500)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-200)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-700)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)";
              }}
            >
              {league}
            </button>
          ))}
          <button className="text-[11px] font-bold text-[var(--color-primary-500)] px-2">
            + Voir tout
          </button>
        </div>

        {/* Bouton Ajouter aux shortlists (Global) */}
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-primary-600)] text-white rounded-lg transition-all ml-auto shadow-lg hover:bg-[var(--color-primary-500)]"
        >
          <Download size={14} /> Exporter la sélection
        </button>
      </div>

      <div
        className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-2.5 flex-shrink-0 flex-wrap"
        style={{
          backgroundColor: "var(--color-neutral-900)",
          minHeight: 52,
        }}
      >
      {/* Quick filter pills */}
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {QUICK_PILLS.map((pill) => {
          const active = activePills.includes(pill.id);
          return (
            <button
              key={pill.id}
              onClick={() => onTogglePill(pill.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold transition-all"
              style={{
                backgroundColor: active ? "var(--color-primary-500)" : "var(--color-neutral-800)",
                border: `1px solid ${active ? "var(--color-primary-500)" : "var(--color-neutral-600)"}`,
                color: active ? "var(--text-on-accent)" : "var(--color-neutral-400)",
                fontFamily: active ? "var(--font-display)" : "inherit",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139, 26, 43, 0.1)";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-800)";
              }}
            >
              <span>{pill.emoji}</span>
              <span>{pill.label}</span>
              {active && (
                <span className="ml-0.5">
                  <X size={10} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right: view toggle + counter + export */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Counter */}
        <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
          <span className="font-semibold" style={{ color: "var(--color-neutral-300)" }}>
            {totalCount.toLocaleString("fr-FR")}
          </span>{" "}
          joueur{totalCount > 1 ? "s" : ""}
        </span>

        {/* Separator */}
        <div className="h-4 w-px" style={{ backgroundColor: "var(--color-neutral-700)" }} />

        {/* View toggle */}
        <div
          className="flex items-center rounded overflow-hidden"
          style={{ border: "1px solid var(--color-neutral-600)" }}
        >
          {(
            [
              { id: "liste" as ViewMode, Icon: LayoutList, label: "Liste" },
              { id: "grille" as ViewMode, Icon: Grid3X3, label: "Grille" },
              { id: "scatter" as ViewMode, Icon: ScatterChart, label: "Scatter" },
            ] as { id: ViewMode; Icon: React.ElementType; label: string }[]
          ).map(({ id, Icon, label }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase font-bold transition-all"
                title={label}
                style={{
                  backgroundColor: active ? "var(--color-primary-500)" : "transparent",
                  color: active ? "var(--text-on-accent)" : "var(--color-neutral-500)",
                  borderRight: id !== "scatter" ? "1px solid var(--color-neutral-700)" : undefined,
                  fontFamily: active ? "var(--font-display)" : "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139, 26, 43, 0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <Icon size={14} strokeWidth={active ? 3 : 1.5} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Export button */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] uppercase font-bold transition-all"
          style={{
            backgroundColor: "var(--color-neutral-800)",
            border: "1px solid var(--color-neutral-600)",
            color: "var(--color-neutral-400)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139, 26, 43, 0.1)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-primary-500)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-800)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)";
          }}
        >
          <Download size={13} strokeWidth={2} />
          Exporter
        </button>
      </div>
    </div>
  </div>
  );
}
