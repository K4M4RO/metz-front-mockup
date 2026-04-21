"use client";

import React, { useState } from "react";
import { X, Download, CheckCircle2, FileDown, ShieldCheck } from "lucide-react";
import type { PlayerTarget } from "@/data/rapports-mock";

interface PdfExportModalProps {
  player: PlayerTarget;
  onClose: () => void;
  onExport: (config: any) => void;
}

export function PdfExportModal({ player, onClose, onExport }: PdfExportModalProps) {
  const [includeMeta, setIncludeMeta] = useState(true);
  const [includeRadar, setIncludeRadar] = useState(true);
  const [includeWithWithout, setIncludeWithWithout] = useState(false);

  const handleExport = () => {
    onExport({
      includeMeta,
      includeRadar,
      includeWithWithout
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-4xl bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        {/* Left column: Configuration */}
        <div className="flex-1 border-r border-[var(--color-neutral-800)] flex flex-col">
          <div className="p-6 border-b border-[var(--color-neutral-800)] flex justify-between items-center bg-[var(--color-neutral-950)]">
            <h2 className="text-lg font-bold text-[var(--color-neutral-100)] flex items-center gap-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
              <FileDown className="text-[var(--color-primary-500)]" size={20} />
              Export PDF
            </h2>
            {/* Close button for mobile, hidden on md since we'll put it on top right of the whole modal */}
            <button onClick={onClose} className="md:hidden text-[var(--color-neutral-500)]"><X size={20}/></button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <p className="text-sm text-[var(--color-neutral-400)] mb-6">
              Configurez le contenu du dossier à exporter pour la direction sportive.
            </p>

            <div className="space-y-4">
              <label className="flex items-start gap-4 p-4 border border-[var(--color-neutral-700)] rounded-lg cursor-pointer hover:bg-[var(--color-neutral-800)] transition-colors">
                <div className="pt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-[var(--color-primary-500)] bg-[var(--color-neutral-900)] border-[var(--color-neutral-600)] rounded"
                    checked={includeMeta}
                    onChange={(e) => setIncludeMeta(e.target.checked)}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-neutral-100)]">Méta-données du joueur</div>
                  <div className="text-xs text-[var(--color-neutral-500)] mt-1">Inclure l'identité complète, biométrie, statut contractuel et valeur marchande.</div>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-[var(--color-neutral-700)] rounded-lg cursor-pointer hover:bg-[var(--color-neutral-800)] transition-colors">
                <div className="pt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-[var(--color-primary-500)] bg-[var(--color-neutral-900)] border-[var(--color-neutral-600)] rounded"
                    checked={includeRadar}
                    onChange={(e) => setIncludeRadar(e.target.checked)}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-neutral-100)]">Radar Chart (Performance)</div>
                  <div className="text-xs text-[var(--color-neutral-500)] mt-1">Générer le polygone de statistiques comparatives par percentile au poste.</div>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-[var(--color-neutral-700)] rounded-lg cursor-pointer hover:bg-[var(--color-neutral-800)] transition-colors">
                <div className="pt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-[var(--color-primary-500)] bg-[var(--color-neutral-900)] border-[var(--color-neutral-600)] rounded"
                    checked={includeWithWithout}
                    onChange={(e) => setIncludeWithWithout(e.target.checked)}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-neutral-100)]">Analyse With/Without <span className="ml-2 text-[10px] bg-[var(--color-neutral-700)] px-1.5 py-0.5 rounded text-[var(--color-neutral-300)]">Data Science</span></div>
                  <div className="text-xs text-[var(--color-neutral-500)] mt-1">Intégrer les métriques d'impact équipe (xG, xGA, PPDA) de l'onglet 07.</div>
                </div>
              </label>

              {/* Confidentiality Warning */}
              <div className="mt-8 bg-[rgba(234,179,8,0.1)] border border-[rgba(234,179,8,0.2)] rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="text-yellow-500 flex-shrink-0" size={18} />
                <div className="text-xs text-yellow-500 text-opacity-90 leading-relaxed">
                  <strong className="block mb-1">Document Confidentiel</strong>
                  Le fichier PDF comportera un filigrane de traçabilité lié à votre session utilisateur. Ne pas diffuser en dehors de l'espace Club.
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-[var(--color-neutral-800)] bg-[var(--color-neutral-950)] flex justify-between">
             <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[var(--color-neutral-400)] hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleExport}
                className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Générer (PDF)
              </button>
          </div>
        </div>

        {/* Right column: Live Preview */}
        <div className="hidden md:flex md:w-[45%] bg-[#E5E7EB] flex-col relative overflow-y-auto">
           {/* Modal Close Button */}
           <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-black/60 hover:text-black/90 rounded-full transition-colors z-10"
          >
            <X size={18} />
          </button>
          
          <div className="p-8 pb-4 flex-shrink-0">
             <div className="text-xs text-center text-gray-500 font-medium uppercase tracking-widest mb-6">Aperçu du document</div>
             
             {/* The PDF Document Preview */}
             <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-sm min-h-[500px] flex flex-col p-8 select-none mx-auto w-full max-w-[340px]">
                {/* PDF Header Logo */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-[#8b1e30] rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                     </div>
                     <div>
                        <div className="text-[10px] font-bold text-gray-800 font-sans tracking-wide">FC METZ</div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-wider">Recrutement</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-gray-400">Date d'export</div>
                    <div className="text-[10px] font-medium text-gray-600">{new Date().toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>

                {/* PDF Content: Meta */}
                {includeMeta && (
                  <div className="bg-gray-50 rounded p-3 mb-4 flex gap-3 border border-gray-100">
                     <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center text-gray-400 text-lg font-bold">
                       {player.avatarInitials}
                     </div>
                     <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 leading-tight">{player.firstName} {player.name}</h3>
                        <div className="text-[9px] text-gray-500 mt-0.5">{player.position} · {player.club}</div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                          <div>
                            <div className="text-[7px] text-gray-400 uppercase">Âge & Nat.</div>
                            <div className="text-[9px] font-medium text-gray-700">{player.age} ans · {player.nationality}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[7px] text-gray-400 uppercase">Valeur</div>
                            <div className="text-[9px] font-bold text-gray-800">{player.value}</div>
                          </div>
                        </div>
                     </div>
                  </div>
                )}

                {!includeMeta && (
                  <div className="mb-4">
                     <h3 className="text-base font-bold text-gray-800">{player.firstName} {player.name}</h3>
                     <div className="text-[10px] text-gray-500">{player.position}</div>
                  </div>
                )}

                {/* PDF Content: Reports List Simulation */}
                <div className="mb-4">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">
                    Historique des Évaluations ({player.reports.length})
                  </div>
                  <div className="space-y-3">
                    {/* Mock a couple of report blocks */}
                    <div className="bg-white border border-gray-200 p-2 rounded">
                       <div className="flex justify-between mb-1">
                          <span className="text-[9px] font-bold text-gray-700">Andréas Schultz</span>
                          <span className="text-[8px] text-green-600 font-bold bg-green-50 px-1 rounded">Note: B</span>
                       </div>
                       <div className="text-[8px] text-gray-500 leading-relaxed line-clamp-2">
                         Très bon volume de jeu, excellente lecture tactique. Pertes de balles mineures ms globales...
                       </div>
                    </div>
                    {player.reports.length > 1 && (
                      <div className="bg-white border border-gray-200 p-2 rounded opacity-70">
                         <div className="flex justify-between mb-1">
                            <span className="text-[9px] font-bold text-gray-700">Nathan Perrin</span>
                            <span className="text-[8px] text-yellow-600 font-bold bg-yellow-50 px-1 rounded">Note: C</span>
                         </div>
                         <div className="text-[8px] text-gray-400 leading-relaxed line-clamp-1">
                            Profil intéressant détecté via StatsBomb...
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Content: Radar Preview */}
                {includeRadar && (
                  <div className="mt-auto mb-4 border border-gray-100 rounded p-2 flex items-center justify-center bg-gray-50">
                     <div className="w-24 h-24 relative">
                        {/* Fake Radar polygon */}
                        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
                           <polygon points="50,10 90,30 80,80 20,80 10,30" fill="rgba(139, 30, 48, 0.2)" stroke="#8b1e30" strokeWidth="1" />
                           <line x1="50" y1="50" x2="50" y2="10" stroke="#ccc" strokeWidth="0.5" />
                           <line x1="50" y1="50" x2="90" y2="30" stroke="#ccc" strokeWidth="0.5" />
                           <line x1="50" y1="50" x2="80" y2="80" stroke="#ccc" strokeWidth="0.5" />
                           <line x1="50" y1="50" x2="20" y2="80" stroke="#ccc" strokeWidth="0.5" />
                           <line x1="50" y1="50" x2="10" y2="30" stroke="#ccc" strokeWidth="0.5" />
                        </svg>
                     </div>
                  </div>
                )}
                
                {/* PDF Content: With/Without block */}
                {includeWithWithout && (
                  <div className="mt-auto mb-2 border border-gray-200 border-dashed rounded p-2 bg-gray-50/50">
                     <div className="text-[8px] font-bold text-gray-500 mb-1">COMPARAISON IMPACT ÉQUIPE</div>
                     <div className="flex items-center gap-2">
                       <div className="h-1 bg-gray-300 w-full rounded flex"><div className="w-3/4 bg-blue-500 rounded"></div></div>
                       <span className="text-[7px] text-gray-400">AVEC (1.8xG)</span>
                     </div>
                     <div className="flex items-center gap-2 mt-1">
                       <div className="h-1 bg-gray-300 w-full rounded flex"><div className="w-1/2 bg-gray-400 rounded"></div></div>
                       <span className="text-[7px] text-gray-400">SANS (1.2xG)</span>
                     </div>
                  </div>
                )}
                <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center text-[7px] text-gray-400">
                  <span>Usage interne uniquement</span>
                  <span>Page 1/1</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
