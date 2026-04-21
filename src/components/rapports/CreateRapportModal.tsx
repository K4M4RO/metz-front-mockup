"use client";

import React, { useState } from "react";
import { X, Calendar, User, Search, Activity, FileText, MapPin, MonitorPlay, BarChart2, Network } from "lucide-react";
import { 
  type PlayerTarget, 
  type ReportType, 
  type ReportSource, 
  type ReportStatus, 
  type NoteGrade, 
  KANBAN_OPTIONS, 
  POSTE_OPTIONS, 
  SYSTEME_OPTIONS,
  STATUS_CONFIG,
  NOTE_CONFIG,
  SOURCE_CONFIG
} from "@/data/rapports-mock";

interface CreateRapportModalProps {
  player: PlayerTarget;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateRapportModal({ player, onClose, onSubmit }: CreateRapportModalProps) {
  const [type, setType] = useState<ReportType>("global");
  const [source, setSource] = useState<ReportSource>("data");
  const [status, setStatus] = useState<ReportStatus>("suivre");
  const [note, setNote] = useState<NoteGrade>("C");
  const [kanban, setKanban] = useState(KANBAN_OPTIONS[0].id);
  const [comment, setComment] = useState("");
  
  const handleTypeChange = (newType: ReportType) => {
    setType(newType);
    if (newType === "global") {
      setSource("data");
    } else {
      setSource("live");
    }
  };
  
  // Conditional fields
  const [competition, setCompetition] = useState("");
  const [poste, setPoste] = useState(player.positionShort);
  const [systeme, setSysteme] = useState(SYSTEME_OPTIONS[2]); // 4-2-3-1 is often default

  // Display fields that would ideally come from JWT / auth context
  const curDate = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  const curDateIso = new Date().toISOString().split("T")[0];
  const curAuthor = "Connexion Actuelle";

  // When source is 'video' or 'live', we might auto-switch to "match" type if desired, 
  // but let's keep them separate as per specs. 
  // Just ensure we show conditional fields if type === 'match'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `r-new-${Date.now()}`,
      date: curDate,
      dateIso: curDateIso,
      author: curAuthor,
      authorRole: "Scout",
      type,
      source,
      status,
      note,
      kanban,
      comment,
      ...(type === "match" ? { competition, poste, systeme } : {})
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-neutral-800)] bg-[var(--color-neutral-950)]">
          <div className="flex items-center gap-4">
             <div 
               className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
               style={{ backgroundColor: `${player.avatarColor}22`, color: player.avatarColor, border: `1px solid ${player.avatarColor}44` }}
             >
               {player.avatarInitials}
             </div>
             <div>
               <h2 className="text-lg font-bold text-[var(--color-neutral-100)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                 Nouveau Rapport sur {player.firstName} {player.name}
               </h2>
               <div className="text-xs text-[var(--color-neutral-400)] flex items-center gap-3 mt-1">
                 <span className="flex items-center gap-1"><Calendar size={12} /> {curDate}</span>
                 <span className="flex items-center gap-1"><User size={12} /> {curAuthor}</span>
               </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--color-neutral-500)] hover:text-white hover:bg-[var(--color-neutral-800)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          <form id="rapport-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Toggle */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-neutral-400)] uppercase tracking-wider mb-2">
                Type de Rapport
              </label>
              <div className="flex p-1 bg-[var(--color-neutral-950)] rounded-lg border border-[var(--color-neutral-800)] mb-6">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${type === 'global' ? 'bg-[var(--color-neutral-800)] text-white shadow-sm' : 'text-[var(--color-neutral-400)] hover:text-white'}`}
                  onClick={() => handleTypeChange("global")}
                >
                  <Activity size={16} />
                  Performance Globale
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${type === 'match' ? 'bg-[var(--color-neutral-800)] text-white shadow-sm' : 'text-[var(--color-neutral-400)] hover:text-white'}`}
                  onClick={() => handleTypeChange("match")}
                >
                  <Search size={16} />
                  Observation Match
                </button>
              </div>
            </div>

            {/* Source d'Évaluation (Pills) */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-neutral-400)] uppercase tracking-wider mb-2">
                Source d'Évaluation
              </label>
              <div className="flex gap-3">
                {(type === "global" 
                  ? [
                      { id: "data", label: "Data", icon: BarChart2 },
                      { id: "agent", label: "Réseau", icon: Network },
                    ]
                  : [
                      { id: "live", label: "Stade", icon: MapPin },
                      { id: "video", label: "Vidéo", icon: MonitorPlay },
                    ]
                ).map((opt) => {
                  const isSelected = source === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSource(opt.id as ReportSource)}
                      className={`flex-1 py-2 text-sm font-medium rounded-full border flex items-center justify-center gap-2 transition-all ${
                        isSelected 
                          ? 'bg-[#6D071A] border-[#c42b47] text-white shadow-md' 
                          : 'bg-[var(--color-neutral-800)] border-[var(--color-neutral-700)] text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-700)]'
                      }`}
                    >
                      <Icon size={16} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Match Context (Conditional) */}
            {type === "match" && (
              <div className="p-4 bg-[var(--color-neutral-950)] border border-[var(--color-neutral-800)] rounded-lg space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-sm font-semibold text-[var(--color-neutral-200)] flex items-center gap-2 mb-2">
                  <Search size={14} className="text-[var(--color-primary-500)]" />
                  Contexte du match
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-neutral-400)] mb-1.5">
                      Compétition & Affiche *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="ex: Ligue 2 | Bastia - Metz"
                      className="w-full bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)] rounded-lg px-3 py-2 text-sm text-[var(--color-neutral-100)] focus:ring-1 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] outline-none transition-all placeholder-[var(--color-neutral-600)]"
                      value={competition}
                      onChange={e => setCompetition(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-neutral-400)] mb-1.5">
                      Poste sur le match *
                    </label>
                    <select 
                      required
                      className="w-full bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)] rounded-lg px-3 py-2 text-sm text-[var(--color-neutral-100)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none"
                      value={poste}
                      onChange={e => setPoste(e.target.value)}
                    >
                      {POSTE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-neutral-400)] mb-1.5">
                      Système de l'équipe *
                    </label>
                    <select 
                      required
                      className="w-full bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)] rounded-lg px-3 py-2 text-sm text-[var(--color-neutral-100)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none"
                      value={systeme}
                      onChange={e => setSysteme(e.target.value)}
                    >
                      {SYSTEME_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Statut & Note Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Statut Cible */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-neutral-400)] uppercase tracking-wider mb-2">
                  Statut Cible
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(STATUS_CONFIG) as [ReportStatus, typeof STATUS_CONFIG[ReportStatus]][]).map(([k, conf]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setStatus(k)}
                      className={`py-2 px-3 text-sm font-medium rounded-lg border flex items-center gap-2 transition-all`}
                      style={{
                        backgroundColor: status === k ? conf.bg : 'var(--color-neutral-800)',
                        borderColor: status === k ? conf.border : 'var(--color-neutral-700)',
                        color: status === k ? conf.color : 'var(--color-neutral-400)',
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
                      {conf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Globale / Note Match */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-neutral-400)] uppercase tracking-wider mb-2">
                  {type === "match" ? "Note Match" : "Note Globale"}
                </label>
                <div className="flex gap-2">
                  {(Object.entries(NOTE_CONFIG) as [NoteGrade, typeof NOTE_CONFIG[NoteGrade]][]).map(([k, conf]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setNote(k)}
                      className="flex-1 py-2 text-sm font-bold rounded-lg border transition-all"
                      style={{
                        backgroundColor: note === k ? conf.bg : 'var(--color-neutral-800)',
                        borderColor: note === k ? conf.color : 'var(--color-neutral-700)',
                        color: note === k ? conf.color : 'var(--color-neutral-400)',
                        opacity: note !== k ? 0.6 : 1
                      }}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-neutral-400)] uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={14} />
                Analyse & Commentaire
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Rédigez votre rapport qualitatif ici..."
                className="w-full bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)] rounded-lg p-3 text-sm text-[var(--color-neutral-100)] focus:ring-1 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] outline-none transition-all placeholder-[var(--color-neutral-600)] custom-scrollbar"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

          </form>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[var(--color-neutral-800)] bg-[var(--color-neutral-950)] gap-3 space-x-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--color-neutral-300)] hover:text-white hover:bg-[var(--color-neutral-800)] rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            form="rapport-form"
            className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] rounded-lg shadow-sm transition-colors border border-[var(--color-primary-500)]"
          >
            Sauvegarder le Rapport
          </button>
        </div>

      </div>
    </div>
  );
}
