"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Info } from "lucide-react";
import { POSITIONS, LEAGUES, POSITION_LABELS, type Position } from "@/data/players";

export interface FilterState {
  positions: Position[];
  ageMin: number;
  ageMax: number;
  contractEndMax: number; // year
  marketValueMax: number; // in M€
  xGMin: number;
  xAMin: number;
  xThreatMin: number;
  leagues: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  positions: [],
  ageMin: 16,
  ageMax: 35,
  contractEndMax: 2030,
  marketValueMax: 60,
  xGMin: 0,
  xAMin: 0,
  xThreatMin: 0,
  leagues: [],
};

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  filteredCount: number;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="flex items-center"
      >
        <Info size={12} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)" }} />
      </button>
      {open && (
        <span
          className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-48 text-xs px-2 py-1.5 rounded leading-relaxed"
          style={{
            backgroundColor: "var(--color-neutral-700)",
            color: "var(--color-neutral-300)",
            border: "1px solid var(--color-neutral-600)",
            boxShadow: "var(--shadow-dropdown)",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: "var(--color-neutral-700)" }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-neutral-400)" }}>
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)" }} />
        ) : (
          <ChevronDown size={14} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)" }} />
        )}
      </button>
      {open && <div className="px-4 pb-4 flex flex-col gap-3">{children}</div>}
    </div>
  );
}

// ─── Single range slider ──────────────────────────────────────────────────────
function Slider({
  label,
  min,
  max,
  value,
  onChange,
  format,
  tip,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  tip?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : String(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>{label}</span>
          {tip && <InfoTip text={tip} />}
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--color-neutral-300)" }}>{display}</span>
      </div>
      <div className="relative h-1 rounded" style={{ backgroundColor: "var(--color-neutral-700)" }}>
        <div
          className="absolute h-full rounded"
          style={{ width: `${pct}%`, backgroundColor: "var(--color-primary-500)" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-thumb absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: 16, marginTop: -8 }}
        />
        {/* Thumb visual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full pointer-events-none"
          style={{
            left: `calc(${pct}% - 7px)`,
            backgroundColor: "var(--color-primary-500)",
            boxShadow: "0 0 0 3px var(--color-neutral-900)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Dual range slider (age) ──────────────────────────────────────────────────
function DualSlider({
  label,
  min,
  max,
  low,
  high,
  onChange,
  unit,
}: {
  label: string;
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  unit: string;
}) {
  const pctLow = ((low - min) / (max - min)) * 100;
  const pctHigh = ((high - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>{label}</span>
        <span className="text-xs font-medium" style={{ color: "var(--color-neutral-300)" }}>
          {low}{unit} — {high}{unit}
        </span>
      </div>
      <div className="relative" style={{ height: 16 }}>
        {/* Track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-full h-1 rounded"
          style={{ backgroundColor: "var(--color-neutral-700)" }}
        />
        {/* Fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded"
          style={{
            left: `${pctLow}%`,
            width: `${pctHigh - pctLow}%`,
            backgroundColor: "var(--color-primary-500)",
          }}
        />
        {/* Thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full pointer-events-none"
          style={{
            left: `calc(${pctLow}% - 7px)`,
            backgroundColor: "var(--color-primary-500)",
            boxShadow: "0 0 0 3px var(--color-neutral-900)",
            zIndex: 2,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full pointer-events-none"
          style={{
            left: `calc(${pctHigh}% - 7px)`,
            backgroundColor: "var(--color-primary-500)",
            boxShadow: "0 0 0 3px var(--color-neutral-900)",
            zIndex: 2,
          }}
        />
        {/* Invisible inputs */}
        <input
          type="range" min={min} max={max} value={low}
          onChange={(e) => onChange(Math.min(parseInt(e.target.value), high - 1), high)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: 3 }}
        />
        <input
          type="range" min={min} max={max} value={high}
          onChange={(e) => onChange(low, Math.max(parseInt(e.target.value), low + 1))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function FiltersPanel({ filters, onChange, filteredCount }: Props) {
  const [collapsed, setCollapsed] = useState(false);

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

  function reset() {
    onChange({ ...DEFAULT_FILTERS });
  }

  const hasActiveFilters =
    filters.positions.length > 0 ||
    filters.ageMin !== DEFAULT_FILTERS.ageMin ||
    filters.ageMax !== DEFAULT_FILTERS.ageMax ||
    filters.leagues.length > 0 ||
    filters.xGMin > 0 ||
    filters.xAMin > 0 ||
    filters.xThreatMin > 0 ||
    filters.marketValueMax < DEFAULT_FILTERS.marketValueMax;

  if (collapsed) {
    return (
      <aside
        className="flex flex-col items-center py-4 border-r flex-shrink-0"
        style={{
          width: 40,
          backgroundColor: "var(--color-neutral-900)",
          borderColor: "var(--color-neutral-600)",
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139, 26, 43, 0.1)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          title="Afficher les filtres"
        >
          <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--color-neutral-400)" }} />
        </button>
        {hasActiveFilters && (
          <div
            className="mt-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-primary-500)" }}
          />
        )}
      </aside>
    );
  }

  return (
    <aside
      className="flex flex-col flex-shrink-0 border-r overflow-hidden"
      style={{
        width: 280,
        backgroundColor: "var(--color-neutral-900)",
        borderColor: "var(--color-neutral-600)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: "var(--color-neutral-700)" }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--color-neutral-200)", fontFamily: "var(--font-dm-sans)" }}
        >
          Filtres
          {hasActiveFilters && (
            <span
              className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--color-primary-100)",
                color: "var(--color-primary-700)",
              }}
            >
              actifs
            </span>
          )}
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
          style={{ color: "var(--color-neutral-500)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139, 26, 43, 0.1)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-primary-500)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)";
          }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
          Réduire
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Identité */}
        <Section title="Identité">
          {/* Position badges */}
          <div>
            <span className="text-xs mb-2 block" style={{ color: "var(--color-neutral-500)" }}>Poste</span>
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.map((pos) => {
                const active = filters.positions.includes(pos);
                return (
                  <button
                    key={pos}
                    onClick={() => togglePosition(pos)}
                    className="text-[10px] uppercase px-2 py-1 rounded font-bold transition-all"
                    style={{
                      backgroundColor: active ? "var(--color-primary-500)" : "rgba(139, 26, 43, 0.05)",
                      border: `1px solid ${active ? "var(--color-primary-500)" : "rgba(139, 26, 43, 0.2)"}`,
                      color: active ? "var(--text-on-accent)" : "var(--color-primary-500)",
                      fontFamily: active ? "var(--font-display)" : "inherit",
                    }}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>
          <DualSlider
            label="Âge"
            min={16} max={35}
            low={filters.ageMin} high={filters.ageMax}
            onChange={(lo, hi) => onChange({ ...filters, ageMin: lo, ageMax: hi })}
            unit=" ans"
          />
        </Section>

        {/* Contrat & Valeur */}
        <Section title="Contrat & Valeur" defaultOpen={false}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>Fin de contrat avant</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-neutral-300)" }}>
                {filters.contractEndMax}
              </span>
            </div>
            <div className="relative h-1 rounded" style={{ backgroundColor: "var(--color-neutral-700)" }}>
              <div
                className="absolute h-full rounded"
                style={{
                  width: `${((filters.contractEndMax - 2025) / 5) * 100}%`,
                  backgroundColor: "var(--color-primary-500)",
                }}
              />
              <input
                type="range" min={2025} max={2030} value={filters.contractEndMax}
                onChange={(e) => set("contractEndMax", parseInt(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: 16, marginTop: -8 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full pointer-events-none"
                style={{
                  left: `calc(${((filters.contractEndMax - 2025) / 5) * 100}% - 7px)`,
                  backgroundColor: "var(--color-primary-500)",
                  boxShadow: "0 0 0 3px var(--color-neutral-900)",
                }}
              />
            </div>
          </div>
          <Slider
            label="Valeur marchande max"
            min={0} max={60} value={filters.marketValueMax}
            onChange={(v) => set("marketValueMax", v)}
            format={(v) => v >= 60 ? "Tout" : `${v.toFixed(0)}M€`}
          />
        </Section>

        {/* Performance */}
        <Section title="Performance" defaultOpen={false}>
          <Slider
            label="xG min / 90min"
            min={0} max={1} value={filters.xGMin}
            onChange={(v) => set("xGMin", v)}
            format={(v) => v.toFixed(2)}
            tip="Expected Goals par 90 minutes. Mesure la qualité et la quantité des occasions créées."
          />
          <Slider
            label="xA min / 90min"
            min={0} max={0.8} value={filters.xAMin}
            onChange={(v) => set("xAMin", v)}
            format={(v) => v.toFixed(2)}
            tip="Expected Assists par 90 minutes. Mesure la qualité des passes décisives potentielles."
          />
          <Slider
            label="xThreat min / 90min"
            min={0} max={0.5} value={filters.xThreatMin}
            onChange={(v) => set("xThreatMin", v)}
            format={(v) => v.toFixed(2)}
            tip="Expected Threat par 90 minutes. Quantifie la menace totale générée sur le porteur du ballon."
          />
        </Section>

        {/* Contexte */}
        <Section title="Contexte" defaultOpen={false}>
          <div>
            <span className="text-xs mb-2 block" style={{ color: "var(--color-neutral-500)" }}>Championnat</span>
            <div className="flex flex-col gap-1">
              {LEAGUES.map((league) => {
                const active = filters.leagues.includes(league);
                return (
                  <label
                    key={league}
                    className="flex items-center gap-2.5 cursor-pointer py-1 px-1 rounded transition-colors"
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139, 26, 43, 0.1)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        border: `1px solid ${active ? "var(--color-primary-500)" : "var(--color-neutral-600)"}`,
                        backgroundColor: active ? "var(--color-primary-500)" : "transparent",
                      }}
                    >
                      {active && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs truncate" style={{ color: active ? "var(--color-neutral-200)" : "var(--color-neutral-400)" }}>
                      {league}
                    </span>
                    <input type="checkbox" className="sr-only" checked={active} onChange={() => toggleLeague(league)} />
                  </label>
                );
              })}
            </div>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-t flex-shrink-0"
        style={{ borderColor: "var(--color-neutral-700)" }}
      >
        <button
          onClick={reset}
          className="flex-1 text-xs py-2 rounded transition-colors"
          style={{ color: "var(--color-primary-400)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary-500)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary-400)")}
        >
          Réinitialiser
        </button>
        <button
          className="flex-1 text-[10px] uppercase py-2 rounded font-bold transition-colors btn-grenat"
          style={{
            backgroundColor: "var(--color-primary-500)",
            color: "var(--text-on-accent)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-400)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-500)")}
        >
          Appliquer ({filteredCount})
        </button>
      </div>
    </aside>
  );
}
