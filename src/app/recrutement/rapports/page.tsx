"use client";

import React, { useState } from "react";
import { Search, FileText, FileDown, Filter } from "lucide-react";
import { RAPPORT_PLAYERS, type PlayerTarget, type ScoutReport } from "@/data/rapports-mock";
import { RapportTimeline } from "@/components/rapports/RapportTimeline";
import { CreateRapportModal } from "@/components/rapports/CreateRapportModal";
import { PdfExportModal } from "@/components/rapports/PdfExportModal";
import { ViewRapportModal } from "@/components/rapports/ViewRapportModal";

export default function RapportsPage() {
  const [players, setPlayers] = useState<PlayerTarget[]>(RAPPORT_PLAYERS);
  
  // Modals state
  const [createModalPlayer, setCreateModalPlayer] = useState<PlayerTarget | null>(null);
  const [pdfModalPlayer, setPdfModalPlayer] = useState<PlayerTarget | null>(null);
  const [viewModalData, setViewModalData] = useState<{ player: PlayerTarget; report: ScoutReport } | null>(null);

  const handleNewReport = (player: PlayerTarget) => {
    setCreateModalPlayer(player);
  };

  const handleViewReport = (player: PlayerTarget, report: ScoutReport) => {
    setViewModalData({ player, report });
  };

  const handleSaveReport = (data: any) => {
    console.log("Saving new report:", data);
    // In a real app we would update the backend.
    // For prototype, we could update the local state.
    if (createModalPlayer) {
      setPlayers(prev => prev.map(p => {
        if (p.id === createModalPlayer.id) {
          return { ...p, reports: [...p.reports, data] };
        }
        return p;
      }));
    }
    setCreateModalPlayer(null);
  };

  const handleExportPdf = (config: any) => {
    console.log("Exporting PDF with config:", config);
    // Simulate export
    alert(`Génération du PDF pour ${pdfModalPlayer?.firstName} ${pdfModalPlayer?.name} avec succès !`);
    setPdfModalPlayer(null);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-neutral-950)] text-[var(--color-neutral-300)]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--color-neutral-800)] bg-[var(--color-neutral-900)] flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-neutral-100)] flex items-center gap-3 tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <FileText className="text-[var(--color-primary-500)]" size={24} />
            Rapports d'Évaluation
          </h1>
          <p className="text-sm text-[var(--color-neutral-400)] mt-1">
            Vue macro de l'historique de scouting et génération de dossiers.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un joueur..." 
              className="pl-9 pr-4 py-2 bg-[var(--color-neutral-950)] border border-[var(--color-neutral-700)] rounded-lg text-sm text-[var(--color-neutral-100)] outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] rounded-lg text-sm font-medium hover:bg-[var(--color-neutral-700)] transition-colors">
            <Filter size={16} />
            Filtrer
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
        <div className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-xl overflow-hidden shadow-sm">
          
          {/* Table Header */}
          <div className="grid grid-cols-[300px_1fr_120px] gap-6 p-4 border-b border-[var(--color-neutral-800)] bg-[var(--color-neutral-950)]/50 text-xs font-semibold text-[var(--color-neutral-400)] uppercase tracking-wider">
            <div>Profil Joueur</div>
            <div>Historique & Timeline</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[var(--color-neutral-800)]">
            {players.map(player => (
              <div 
                key={player.id} 
                className="grid grid-cols-[300px_1fr_120px] gap-6 p-4 hover:bg-[var(--color-neutral-800)]/50 transition-colors items-center group"
              >
                {/* 1. Player Info */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: `${player.avatarColor}22`, color: player.avatarColor, border: `1px solid ${player.avatarColor}44` }}
                  >
                    {player.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[var(--color-neutral-100)] truncate tracking-tight text-base" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {player.firstName} {player.name}
                    </div>
                    <div className="text-xs text-[var(--color-neutral-400)] mt-0.5 flex items-center gap-1.5 truncate">
                       <span className="font-medium bg-[var(--color-neutral-800)] px-1.5 py-0.5 rounded text-[var(--color-neutral-300)]">{player.positionShort}</span>
                       <span>·</span>
                       <span>{player.age} ans</span>
                       <span>{player.flag}</span>
                    </div>
                    <div className="text-xs text-[var(--color-neutral-500)] mt-0.5 truncate">
                      {player.club}
                    </div>
                  </div>
                </div>

                {/* 2. Timeline */}
                <div className="flex items-center px-4 w-full pt-1">
                   <RapportTimeline 
                     player={player} 
                     onNewReport={handleNewReport} 
                     onViewReport={(report) => handleViewReport(player, report)} 
                   />
                </div>

                {/* 3. Actions */}
                <div className="flex items-center justify-center">
                   <button 
                     onClick={() => setPdfModalPlayer(player)}
                     className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded outline-none shadow-sm transition-all text-[var(--color-neutral-300)] bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] hover:bg-[var(--color-primary-500)] hover:border-[var(--color-primary-500)] hover:text-white"
                     title="Configurer et exporter en PDF"
                   >
                     <FileDown size={14} />
                     <span className="hidden xl:inline">Export PDF</span>
                   </button>
                </div>
              </div>
            ))}

            {players.length === 0 && (
              <div className="p-8 text-center text-[var(--color-neutral-400)]">
                Aucun joueur trouvé.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {createModalPlayer && (
        <CreateRapportModal 
          player={createModalPlayer} 
          onClose={() => setCreateModalPlayer(null)} 
          onSubmit={handleSaveReport}
        />
      )}

      {pdfModalPlayer && (
        <PdfExportModal 
          player={pdfModalPlayer}
          onClose={() => setPdfModalPlayer(null)}
          onExport={handleExportPdf}
        />
      )}

      {viewModalData && (
        <ViewRapportModal 
          player={viewModalData.player}
          report={viewModalData.report}
          onClose={() => setViewModalData(null)}
        />
      )}
    </div>
  );
}
