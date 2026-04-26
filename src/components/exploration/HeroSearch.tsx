"use client";

import { User, Target, Search, Globe, Zap } from "lucide-react";
import { POSITIONS, LEAGUES, type Position } from "@/data/players";
import type { FilterState } from "./FiltersPanel";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  activePills: string[];
  onTogglePill: (id: string) => void;
  onApply: () => void;
  filteredCount: number;
}

const QUICK_PILLS = [
  { id: "rookies", label: "Rookies", emoji: "🌟" },
  { id: "libre", label: "Joueur Libre", emoji: "🆓" },
  { id: "extra", label: "Extracommunautaire", emoji: "🌍" },
];

export function HeroSearch({ filters, onChange, activePills, onTogglePill, onApply, filteredCount }: Props) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function togglePosition(pos: Position) {
    const next = filters.positions.includes(pos)
      ? filters.positions.filter((p) => p !== pos)
      : [...filters.positions, pos];
    set("positions", next);
  }

  function toggleLeague(league: string) {
    const next = filters.leagues.includes(league)
      ? filters.leagues.filter((l) => l !== league)
      : [...filters.leagues, league];
    set("leagues", next);
  }

  function addAIModel() {
    const newModel = {
      id: `sim-${Date.now()}`,
      type: "similarity" as const,
      name: "Nouveau Profil",
      score: 75,
    };
    set("aiModels", [...filters.aiModels, newModel]);
  }

  function updateAIModel(id: string, updates: any) {
    set("aiModels", filters.aiModels.map(m => m.id === id ? { ...m, ...updates } : m));
  }

  function removeAIModel(id: string) {
    set("aiModels", filters.aiModels.filter(m => m.id !== id));
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4 relative">
        <div className="absolute inset-0 blur-3xl opacity-10 bg-[var(--color-primary-500)] scale-[2] rounded-full pointer-events-none"></div>
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] mb-6 shadow-2xl relative z-10">
          <Search size={40} className="text-[var(--color-primary-500)]" />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight relative z-10" style={{ fontFamily: "var(--font-display)", color: "var(--color-neutral-100)" }}>
          Ciblage & Exploration
        </h1>
        <p className="text-xl max-w-2xl mx-auto relative z-10" style={{ color: "var(--color-neutral-400)" }}>
          Définissez vos critères initiaux pour filtrer la base de données globale et découvrir vos futures recrues.
        </p>
      </div>

      {/* Hero Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Col 1: Identité */}
        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--bg-surface-raised)] rounded-lg text-[var(--color-primary-400)]">
              <Zap size={20} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-neutral-100)" }}>Identité & Profil</h2>
          </div>

          <div>
            <span className="text-sm font-semibold mb-3 block text-[var(--color-neutral-400)]">Poste cible</span>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((pos) => {
                const active = filters.positions.includes(pos);
                return (
                  <button
                    key={pos}
                    onClick={() => togglePosition(pos)}
                    className="text-xs uppercase px-3 py-1.5 rounded-lg font-bold transition-all"
                    style={{
                      backgroundColor: active ? "var(--color-primary-500)" : "rgba(139, 26, 43, 0.05)",
                      border: `1px solid ${active ? "var(--color-primary-500)" : "rgba(139, 26, 43, 0.2)"}`,
                      color: active ? "var(--text-on-accent)" : "var(--color-primary-500)",
                    }}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[var(--color-neutral-400)]">Âge cible</span>
              <span className="text-sm font-bold" style={{ color: "var(--color-neutral-100)" }}>{filters.ageMin} — {filters.ageMax} ans</span>
            </div>
            <div className="relative h-2 rounded-full bg-[var(--bg-surface-raised)]">
              <div
                className="absolute h-full rounded-full bg-[var(--color-primary-500)]"
                style={{
                  left: `${((filters.ageMin - 16) / (35 - 16)) * 100}%`,
                  width: `${((filters.ageMax - filters.ageMin) / (35 - 16)) * 100}%`,
                }}
              />
              <input
                type="range" min={16} max={35} value={filters.ageMin}
                onChange={(e) => set("ageMin", Math.min(parseInt(e.target.value), filters.ageMax - 1))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
              <input
                type="range" min={16} max={35} value={filters.ageMax}
                onChange={(e) => set("ageMax", Math.max(parseInt(e.target.value), filters.ageMin + 1))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
              />
            </div>
          </div>
        </div>

        {/* Col 2: Intelligence Artificielle */}
        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-xl flex flex-col gap-6"
             style={{ boxShadow: "0 0 40px rgba(139, 26, 43, 0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-primary-500)]/20 rounded-lg text-[var(--color-primary-500)]">
              <User size={20} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-neutral-100)" }}>Modèles IA</h2>
          </div>

          <div className="flex flex-col gap-4">
            {filters.aiModels.map((model, index) => (
              <div key={model.id} className="relative group flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-neutral-400)]">
                    {model.type === "similarity" ? "Similarité" : "Fit Score"}
                  </span>
                  <button 
                    onClick={() => removeAIModel(model.id)}
                    className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                
                {model.type === "similarity" ? (
                  <input 
                    type="text" 
                    value={model.name}
                    onChange={(e) => updateAIModel(model.id, { name: e.target.value })}
                    className="w-full bg-[var(--bg-app)] border border-[var(--border-strong)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-500)] transition-colors"
                    style={{ color: "var(--color-neutral-100)" }}
                  />
                ) : (
                  <select 
                    value={model.name}
                    onChange={(e) => updateAIModel(model.id, { name: e.target.value })}
                    className="w-full bg-[var(--bg-app)] border border-[var(--border-strong)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-500)] transition-colors cursor-pointer"
                    style={{ color: "var(--color-neutral-100)" }}
                  >
                      <option>Double Pivot 4-2-3-1</option>
                      <option>Sentinelle 4-3-3</option>
                      <option>Relayeur Box-to-Box</option>
                  </select>
                )}
                
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0" max="100" 
                    value={model.score}
                    onChange={(e) => updateAIModel(model.id, { score: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-[var(--bg-surface-raised)] rounded-full accent-[var(--color-primary-500)] appearance-none cursor-pointer" 
                  />
                  <span className="text-sm font-bold text-[var(--color-primary-500)] w-10 text-right">{model.score}{model.type === "similarity" ? "%" : ""}</span>
                </div>
                
                {index < filters.aiModels.length - 1 && <div className="h-px bg-[var(--border-subtle)] mt-2"></div>}
              </div>
            ))}
          </div>

          <button 
            onClick={addAIModel}
            className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-bold text-[var(--color-primary-500)] border border-dashed border-[var(--color-primary-500)]/30 rounded-xl hover:bg-[var(--color-primary-500)]/10 transition-colors"
          >
            + Ajouter un modèle IA
          </button>
        </div>

        {/* Col 3: Championnats & Rapide */}
        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--bg-surface-raised)] rounded-lg text-[var(--color-primary-400)]">
              <Globe size={20} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-neutral-100)" }}>Contexte</h2>
          </div>

          <div>
            <span className="text-sm font-semibold mb-3 block text-[var(--color-neutral-400)]">Championnat(s)</span>
            <div className="flex flex-wrap gap-2">
              {LEAGUES.map((league) => {
                const active = filters.leagues.includes(league);
                return (
                  <button
                    key={league}
                    onClick={() => toggleLeague(league)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                    style={{
                      backgroundColor: active ? "var(--bg-hover)" : "var(--bg-app)",
                      border: `1px solid ${active ? "var(--color-neutral-500)" : "var(--border-strong)"}`,
                      color: active ? "var(--color-neutral-100)" : "var(--color-neutral-400)",
                    }}
                  >
                    {league}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[var(--border-subtle)]"></div>

          <div>
            <span className="text-sm font-semibold mb-3 block text-[var(--color-neutral-400)]">Filtres Rapides</span>
            <div className="flex flex-col gap-2">
              {QUICK_PILLS.map((pill) => {
                const active = activePills.includes(pill.id);
                return (
                  <button
                    key={pill.id}
                    onClick={() => onTogglePill(pill.id)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all"
                    style={{
                      backgroundColor: active ? "rgba(var(--primary-rgb), 0.1)" : "var(--bg-app)",
                      border: `1px solid ${active ? "var(--color-primary-500)" : "var(--border-strong)"}`,
                      color: active ? "var(--color-primary-400)" : "var(--color-neutral-400)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{pill.emoji}</span>
                      {pill.label}
                    </span>
                    {active && <Target size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-col items-center mt-6 relative z-10">
        <button 
          onClick={onApply}
          className="flex items-center justify-center gap-3 w-full max-w-md py-4 bg-[var(--color-primary-600)] text-white rounded-2xl font-bold shadow-[0_10px_30px_rgba(139,26,43,0.3)] transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-500)] active:scale-[0.98] text-lg uppercase tracking-wider"
        >
          <Search size={24} />
          Explorer {filteredCount > 0 ? `(${filteredCount} profils)` : ""}
        </button>
        <p className="mt-4 text-sm text-[var(--color-neutral-500)]">
          Ajustez vos critères pour affiner la sélection. Vous pourrez les modifier ultérieurement.
        </p>
      </div>

    </div>
  );
}
