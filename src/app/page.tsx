"use client";

import { useState, useMemo } from "react";
import { HeroSearch } from "@/components/exploration/HeroSearch";
import { FiltersPanel, DEFAULT_FILTERS, type FilterState } from "@/components/exploration/FiltersPanel";
import { ActionBar, type ViewMode } from "@/components/exploration/ActionBar";
import { PlayerTable } from "@/components/exploration/PlayerTable";
import { PlayerDrawer } from "@/components/exploration/PlayerDrawer";
import { ScatterView } from "@/components/exploration/ScatterView";
import { PLAYERS, type Player } from "@/data/players";
import { Target } from "lucide-react";

function filterPlayers(players: Player[], f: FilterState, pills: string[]): Player[] {
  return players.filter((p) => {
    if (f.positions.length > 0 && !f.positions.includes(p.position)) return false;
    if (p.age < f.ageMin || p.age > f.ageMax) return false;
    if (p.contractEndYear > f.contractEndMax) return false;
    if (p.marketValueNum > f.marketValueMax) return false;
    if (p.xG < f.xGMin) return false;
    if (p.xA < f.xAMin) return false;
    if (p.xThreat < f.xThreatMin) return false;
    if (f.leagues.length > 0 && !f.leagues.includes(p.league)) return false;
    // Quick pills
    if (pills.includes("rookies") && p.age > 21) return false;
    if (pills.includes("libre") && p.marketValueNum > 0.5) return false; // fake "free" = very cheap
    if (pills.includes("extra") && p.isUE) return false;
    return true;
  });
}

export default function ExplorationPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [view, setView] = useState<ViewMode>("liste");
  const [activePills, setActivePills] = useState<string[]>([]);
  const [drawerPlayer, setDrawerPlayer] = useState<Player | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  function togglePill(id: string) {
    setActivePills((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  const filtered = useMemo(() => filterPlayers(PLAYERS, filters, activePills), [filters, activePills]);

  if (!isApplied) {
    return (
      <div className="h-full w-full overflow-y-auto bg-[var(--color-neutral-950)] flex items-center justify-center p-8">
        <HeroSearch
          filters={filters}
          onChange={setFilters}
          activePills={activePills}
          onTogglePill={togglePill}
          onApply={() => setIsApplied(true)}
          filteredCount={filtered.length}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Filters panel */}
      <FiltersPanel
        filters={filters}
        onChange={setFilters}
        filteredCount={filtered.length}
        onApply={() => setIsApplied(true)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ActionBar
          view={view}
          onViewChange={setView}
          totalCount={filtered.length}
          activePills={activePills}
          onTogglePill={togglePill}
        />

        {/* Table area */}
        <div className="flex-1 overflow-hidden relative">
          {view === "liste" && (
            <PlayerTable
              players={filtered}
              onRowClick={setDrawerPlayer}
            />
          )}

          {view === "scatter" && (
            <ScatterView
              players={filtered}
              onPlayerClick={setDrawerPlayer}
            />
          )}

          {view === "grille" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-neutral-800)" }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-neutral-600)" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--color-neutral-500)", fontFamily: "var(--font-dm-sans)" }}>
                  Mode Grille — bientôt disponible
                </p>
              </div>
            </div>
          )}

          {/* Player drawer — rendered inside the relative container */}
          {drawerPlayer && (
            <PlayerDrawer
              player={drawerPlayer}
              onClose={() => setDrawerPlayer(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
