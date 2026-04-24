"use client";

import React from "react";
import { X, Calendar, User, Search, Activity, FileText } from "lucide-react";
import {
  type PlayerTarget,
  type ScoutReport,
  STATUS_CONFIG,
  NOTE_CONFIG,
  SOURCE_CONFIG,
  KANBAN_OPTIONS
} from "@/data/rapports-mock";

interface ViewRapportModalProps {
  player: PlayerTarget;
  report: ScoutReport;
  onClose: () => void;
}

export function ViewRapportModal({ player, report, onClose }: ViewRapportModalProps) {
  const statusConf = STATUS_CONFIG[report.status];
  const noteConf = NOTE_CONFIG[report.note];
  const sourceConf = SOURCE_CONFIG[report.source];
  const kanbanLabel = KANBAN_OPTIONS.find(k => k.id === report.kanban)?.label || report.kanban;

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
                Rapport : {player.firstName} {player.name}
              </h2>
              <div className="text-xs text-[var(--color-neutral-400)] flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><Calendar size={12} /> {report.date}</span>
                <span className="flex items-center gap-1"><User size={12} /> {report.author} ({report.authorRole})</span>
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
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar space-y-6">

          {/* Main Info Badges */}
          <div className="flex flex-wrap gap-4">
            <div
              className="px-3 py-1.5 rounded-lg border text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: statusConf.bg, borderColor: statusConf.border, color: statusConf.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConf.color }} />
              {statusConf.label}
            </div>

            <div
              className="px-3 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-2"
              style={{ backgroundColor: noteConf.bg, borderColor: noteConf.color, color: noteConf.color }}
            >
              Note : {report.note}
            </div>

            <div
              className="px-3 py-1.5 rounded-lg border border-[var(--color-neutral-700)] bg-[var(--color-neutral-800)] text-sm font-medium flex items-center gap-2 text-[var(--color-neutral-200)]"
            >
              <span style={{ color: sourceConf.color }}>{sourceConf.icon}</span>
              Source : {sourceConf.label}
            </div>

            <div
              className="px-3 py-1.5 rounded-lg border border-[var(--color-neutral-700)] bg-[var(--color-neutral-800)] text-sm font-medium flex items-center gap-2 text-[var(--color-neutral-400)]"
            >
              Statut Pipeline : <span className="text-[var(--color-neutral-200)]">{kanbanLabel}</span>
            </div>
          </div>

          {/* Context (If Match) */}
          {report.type === "match" ? (
            <div className="p-4 bg-[var(--color-neutral-950)] border border-[var(--color-neutral-800)] rounded-lg space-y-3">
              <h3 className="text-sm font-semibold text-[var(--color-neutral-200)] flex items-center gap-2 border-b border-[var(--color-neutral-800)] pb-2">
                <Search size={14} className="text-[var(--color-primary-500)]" />
                Contexte de l'observation
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">Affiche</div>
                  <div className="text-sm text-[var(--color-neutral-200)]">{report.affiche}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">Compétition</div>
                  <div className="text-sm text-[var(--color-neutral-200)]">{report.competition}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">Système / Poste</div>
                  <div className="text-sm text-[var(--color-neutral-200)]">{report.systeme} — {report.poste}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[var(--color-neutral-950)] border border-[var(--color-neutral-800)] rounded-lg flex items-center gap-2 text-sm text-[var(--color-neutral-400)]">
              <Activity size={16} className="text-[var(--color-primary-500)]" />
              Rapport de Performance Globale
            </div>
          )}

          {/* Comment */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-neutral-200)] flex items-center gap-2 mb-3">
              <FileText size={14} className="text-[var(--color-neutral-500)]" />
              Analyse Qualitavtive
            </h3>
            <div className="p-4 bg-[var(--color-neutral-950)] border border-[var(--color-neutral-800)] rounded-lg text-sm text-[var(--color-neutral-300)] leading-relaxed whitespace-pre-wrap">
              {report.comment}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-neutral-800)] bg-[var(--color-neutral-950)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-700)] rounded-lg shadow-sm transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
