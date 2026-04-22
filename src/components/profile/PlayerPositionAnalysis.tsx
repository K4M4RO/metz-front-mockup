"use client";

import { useState } from "react";
import { ArrowRight, X, FileCode } from "lucide-react";
import { POSITION_TRANSITIONS } from "@/data/enzo-millot";
import type { PositionTransition } from "@/data/enzo-millot";

export function PlayerPositionAnalysis() {
  const [selectedTransition, setSelectedTransition] = useState<PositionTransition | null>(null);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
        >
          Transitions de Poste (Tactical Shifts)
        </span>
        <span className="text-[10px]" style={{ color: "var(--color-neutral-600)" }}>Source : Opta / Tactical Feed</span>
      </div>

      {/* List of transitions */}
      <div className="p-3 space-y-2">
        {POSITION_TRANSITIONS.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedTransition(t)}
            className="w-full flex items-center justify-between p-3 rounded-lg transition-all group hover:bg-neutral-700/30"
            style={{ backgroundColor: "var(--color-neutral-900)", border: "1px solid var(--color-neutral-700)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-400 border border-neutral-700">{t.from}</span>
                <ArrowRight size={14} className="text-neutral-500 group-hover:text-primary-400" />
                <span className="px-2 py-0.5 rounded bg-primary-900/30 text-[10px] font-bold text-primary-300 border border-primary-800/50">{t.to}</span>
              </div>
              <div className="h-4 w-[1px] bg-neutral-700" />
              <div className="text-left">
                <p className="text-[10px] text-neutral-500 uppercase tracking-tight">Fenêtre moyenne</p>
                <p className="text-xs font-dm-sans text-neutral-200">{t.avgWindow}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-lg font-bold font-dm-sans text-white">{t.count}</span>
                <span className="text-[10px] text-neutral-500 ml-1">occ.</span>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-neutral-800 border border-neutral-700 text-neutral-500 group-hover:border-primary-500 group-hover:text-primary-500 transition-colors">
                <ArrowRight size={12} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Details Modal */}
      {selectedTransition && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm px-4 flex items-center justify-center" onClick={() => setSelectedTransition(null)}>
            <div 
              className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
              style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-600)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-neutral-700 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Détails des repositionnements
                    <span className="text-[10px] font-normal text-neutral-400 px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-700">
                      {selectedTransition.from} → {selectedTransition.to}
                    </span>
                  </h3>
                </div>
                <button onClick={() => setSelectedTransition(null)} className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-400 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-900/50 border-b border-neutral-700">
                      <th className="text-[10px] text-left px-5 py-3 font-semibold text-neutral-500 uppercase tracking-wider">Match</th>
                      <th className="text-[10px] text-center px-5 py-3 font-semibold text-neutral-500 uppercase tracking-wider">Minute</th>
                      <th className="text-[10px] text-right px-5 py-3 font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {selectedTransition.matches.map((m, idx) => (
                      <tr key={idx} className="hover:bg-neutral-700/20 transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-xs font-medium text-neutral-200">{m.name}</p>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-xs font-mono text-primary-400 bg-primary-900/20 px-2 py-0.5 rounded border border-primary-900/40">
                            {m.minute}&apos;
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button 
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-700 hover:bg-primary-600 text-[10px] font-bold text-white transition-all uppercase tracking-tighter"
                            onClick={() => alert(`Export XML de la séquence à ${m.minute}' en cours...`)}
                          >
                            <FileCode size={12} />
                            XML
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-neutral-900/50 flex justify-end">
                <button 
                  onClick={() => setSelectedTransition(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white border border-neutral-700 hover:bg-neutral-700 transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
