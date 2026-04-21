"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { STATUS_CONFIG, NOTE_CONFIG, SOURCE_CONFIG, type PlayerTarget, type ScoutReport } from "@/data/rapports-mock";

interface RapportTimelineProps {
  player: PlayerTarget;
  onNewReport: (player: PlayerTarget) => void;
  onViewReport?: (report: ScoutReport) => void;
}

export function RapportTimeline({ player, onNewReport, onViewReport }: RapportTimelineProps) {
  // Sort reports by date (assuming they might not be sorted)
  const reports = [...player.reports].sort(
    (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()
  );

  return (
    <div className="flex items-center w-full min-w-[300px] h-12 relative">
      {/* Background Line */}
      <div className="absolute left-0 right-12 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--color-neutral-700)] rounded-full" />

      {/* Reports Dots */}
      <div className="relative flex items-center w-[calc(100%-3rem)] h-full justify-between z-10 px-2">
        {reports.length === 0 && (
          <span className="text-[10px] text-[var(--color-neutral-500)] bg-[var(--color-neutral-900)] px-2 italic">
            Aucun rapport
          </span>
        )}
        
        {reports.map((report, index) => {
          const statusConf = STATUS_CONFIG[report.status];
          const noteConf = NOTE_CONFIG[report.note];
          
          return (
            <div 
              key={report.id} 
              className="relative group cursor-pointer"
              onClick={() => onViewReport?.(report)}
            >
              <div 
                className="w-3.5 h-3.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125"
                style={{ 
                  backgroundColor: statusConf.dot,
                  borderColor: 'var(--color-neutral-900)', 
                  boxShadow: `0 0 0 2px ${statusConf.bg}` 
                }}
              />
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <div className="bg-[var(--color-neutral-800)] border border-[var(--color-neutral-600)] shadow-lg rounded-lg p-2 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[var(--color-neutral-100)]">{report.date}</span>
                    <span 
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: noteConf.bg, color: noteConf.color }}
                    >
                      Note: {report.note}
                    </span>
                  </div>
                  <div className="text-[var(--color-neutral-400)] text-[10px] mb-1.5 flex items-center justify-between">
                     <span>{report.author}</span>
                  </div>
                  <div 
                    className="w-full text-center py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: statusConf.bg, color: statusConf.color }}
                  >
                    {statusConf.label}
                  </div>
                </div>
                
                <div className="w-2 h-2 bg-[var(--color-neutral-800)] border-b border-r border-[var(--color-neutral-600)] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[5px]"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Report Button */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 flex justify-end">
        <button 
          onClick={() => onNewReport(player)}
          className="w-8 h-8 rounded-full bg-[var(--color-neutral-800)] border border-[var(--color-primary-500)] text-[var(--color-primary-400)] flex items-center justify-center hover:bg-[var(--color-primary-500)] hover:text-white transition-colors group shadow-sm"
          title="Nouveau Rapport"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
