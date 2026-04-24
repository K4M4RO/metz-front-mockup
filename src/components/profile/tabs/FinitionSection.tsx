"use client";

import { useState } from "react";
import { Info, Target, Zap, Footprints, Ruler, Map } from "lucide-react";
import { DonutChart } from "@/components/match-center/post-match/DonutChart";
import { 
  FINITION_DASHBOARD, SHOT_IMPACTS, GOAL_ZONES, SNIPER_LOG 
} from "@/data/finition-mock";

// ── Tooltip Helper ────────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 cursor-help">
      <Info size={12} className="text-neutral-600 hover:text-neutral-400 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-[100] text-[11px] leading-relaxed text-neutral-300 font-normal normal-case">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-900" />
      </div>
    </div>
  );
}

// ── Verdict Dashboard ─────────────────────────────────────────────────────────

function VerdictDashboard() {
  const diff = FINITION_DASHBOARD.psxg - FINITION_DASHBOARD.xg;
  const maxDiff = 2.0;
  const pct = Math.min(Math.abs(diff) / maxDiff, 1) * 50; // 0-50% scale

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Differential Gauge */}
      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Gauge Différentielle (PSxG - xG)</span>
          <Tooltip text="Mesure la valeur ajoutée par le tireur. Si positive, le joueur marque plus que la moyenne grâce à la précision de ses frappes. Formule : Qualité des tirs cadrés (PSxG) - Danger initial de l'occasion (xG)." />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
          </span>
          <span className="text-[10px] text-neutral-400">Valeur ajoutée brute</span>
        </div>
        <div className="relative h-2 bg-neutral-700 rounded-full overflow-hidden flex">
          <div className="w-1/2 border-r border-neutral-900" />
          <div 
            className="absolute top-0 bottom-0 transition-all duration-1000 ease-out"
            style={{
              left: diff >= 0 ? "50%" : `${50 - pct}%`,
              width: `${pct}%`,
              backgroundColor: diff >= 0 ? "#22C55E" : "#EF4444",
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-neutral-600 font-bold">
          <span>SOUSTENSION</span>
          <span>NEUTRE</span>
          <span>SURPERFORMANCE</span>
        </div>
      </div>

      {/* Conversion Ratio */}
      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-5 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Ratio de Conversion</span>
            <Tooltip text="Pourcentage de tirs cadrés transformés en buts. Permet d'évaluer le réalisme pur du joueur face au gardien." />
          </div>
          <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {FINITION_DASHBOARD.conversionRate}%
          </div>
          <p className="text-[10px] text-neutral-500 leading-tight">Moy. Poste : 18.4%</p>
        </div>
        <DonutChart 
          value={FINITION_DASHBOARD.conversionRate} 
          label="" 
          size={70} 
          color="#D4A017" 
        />
      </div>

      {/* Sang-froid Index */}
      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Indice de Sang-froid</span>
          <Tooltip text="Analyse si l'efficacité technique du joueur (PSxG) diminue avec la fatigue ou la pression de fin de match. Un indice stable indique un joueur mentalement fort." />
        </div>
        <div className="flex gap-3 h-16 items-end">
          {[
            { label: "1ère MT", val: FINITION_DASHBOARD.sangFroid.firstHalf },
            { label: "2ème MT", val: FINITION_DASHBOARD.sangFroid.secondHalf }
          ].map((mt) => (
            <div key={mt.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-neutral-700 rounded-t-sm relative overflow-hidden" style={{ height: `${(mt.val / 0.25) * 100}%` }}>
                <div className="absolute inset-0 bg-primary-500/40" />
              </div>
              <span className="text-[9px] font-bold text-neutral-400">{mt.label} ({mt.val > 0 ? "+" : ""}{mt.val})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Goal View ─────────────────────────────────────────────────────────────────

function GoalView() {
  const [selectedShotId, setSelectedShotId] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(true);
  const selectedShot = selectedShotId ? SHOT_IMPACTS.find(s => s.id === selectedShotId) : null;

  return (
    <div className="bg-neutral-800/20 border border-neutral-700/30 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target size={16} className="text-primary-500" /> Goal View : Cartographie des Frappes Cadrées
        </h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-[10px] text-neutral-400">But</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] text-neutral-400">Arrêté / Hors-cadre</span>
          </div>
          <div className="flex items-center gap-2 border-l border-neutral-700 pl-4 ml-2">
            <div className="w-4 h-4 rounded-full border border-neutral-500" />
            <span className="text-[10px] text-neutral-300 font-bold">Taille = PSxG</span>
          </div>
          <Tooltip text="Chaque point représente un tir cadré. La taille de la bulle indique la valeur du PSxG (Qualité du tir). La couleur indique le résultat : Vert pour un but, Rouge pour un tir arrêté." />
        </div>
      </div>

      <div className="relative mx-auto" style={{ width: "65%", aspectRatio: "7.32 / 2.44" }}>
        {/* Goal Frame */}
        <div className="absolute inset-0 border-[6px] border-neutral-200 border-b-0 rounded-t-lg z-10" />
        <div className="absolute inset-0 bg-neutral-900/50">
          {/* Net Pattern */}
          <div className="absolute inset-0 opacity-10 overflow-hidden rounded-t-lg" 
            style={{ 
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", 
              backgroundSize: "20px 20px" 
            }} 
          />
          
          {/* Goal Zones Grid */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 z-0 pointer-events-none opacity-20 overflow-hidden rounded-t-lg">
            {GOAL_ZONES.map(z => (
              <div key={z.id} className="border border-neutral-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{z.v}%</span>
              </div>
            ))}
          </div>

          {/* Shots */}
          {SHOT_IMPACTS.map((shot) => {
            const size = 12 + shot.psxg * 35; // Size by PSxG
            const color = shot.result === "goal" ? "#22C55E" : "#EF4444"; // Color by Goal/No Goal
            const isTop = shot.y < 0.35; // If in the top 35% of the goal
            const isSelected = selectedShotId === shot.id;
            const isDimmed = focusMode && selectedShotId !== null && !isSelected;

            return (
              <div
                key={shot.id}
                onClick={() => setSelectedShotId(shot.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all group/shot ${isSelected ? 'ring-2 ring-white z-40' : 'z-20'} ${isDimmed ? 'opacity-20 grayscale-[50%]' : 'opacity-100 hover:ring-2 hover:ring-white/50'}`}
                style={{
                  left: `${shot.x * 100}%`,
                  top: `${shot.y * 100}%`,
                  width: size,
                  height: size,
                  backgroundColor: color,
                  boxShadow: isDimmed ? 'none' : `0 0 15px ${color}60`,
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                {/* Shot Tooltip */}
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 hidden group-hover/shot:block w-36 bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg shadow-2xl z-50 pointer-events-none ${isTop ? 'top-full mt-3' : 'bottom-full mb-3'}`}
                >
                   {/* Tooltip arrow */}
                   <div className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${isTop ? 'bottom-full border-b-neutral-700' : 'top-full border-t-neutral-700'}`} />
                   
                   <div className="flex justify-between mb-1.5 border-b border-neutral-800 pb-1">
                     <span className="text-neutral-500 text-[10px]">PSxG:</span>
                     <span className="text-white font-black text-[11px]">{shot.psxg.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between mb-2">
                     <span className="text-neutral-500 text-[10px]">xG initial:</span>
                     <span className="text-neutral-300 font-medium text-[10px]">{shot.xg.toFixed(2)}</span>
                   </div>
                   <div className={`text-center font-black uppercase tracking-tighter text-[11px] py-1 rounded ${shot.result === 'goal' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                     {shot.result === 'goal' ? 'BUT' : 'ARRÊTÉ'}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-12 mt-4">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Zones de Prédilection</p>
          <Tooltip text="Répartition de la réussite par zone de la cage. Permet d'identifier si le joueur a des zones de frappe favorites ou s'il est prévisible pour un gardien." />
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-700/50 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Map size={16} className="text-primary-500" /> Origine des frappes & Détails
          </h4>
          <button 
            onClick={() => setFocusMode(!focusMode)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded border transition-colors ${focusMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white' : 'bg-neutral-200 border-white text-black'}`}
          >
            {focusMode ? 'Activer Vue Globale (Tout voir)' : 'Activer Mode Focus (Isoler)'}
          </button>
        </div>
        <div className="grid grid-cols-12 gap-8">
          {/* Details Panel */}
          <div className="col-span-4 bg-neutral-900 rounded-xl border border-neutral-800 p-6 flex flex-col justify-center min-h-[200px]">
            {selectedShot ? (
              <div className="space-y-4">
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-800 pb-2">Détails du tir sélectionné</div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-xs">xG Initial:</span>
                  <span className="text-white font-black">{selectedShot.xg.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-xs">PSxG (Après tir):</span>
                  <span className="text-white font-black">{selectedShot.psxg.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-xs">Vitesse de balle:</span>
                  <span className="text-white font-black">{selectedShot.speed} km/h</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-neutral-800">
                  <span className="text-neutral-400 text-xs">Résultat:</span>
                  <span className={`font-black uppercase text-xs ${selectedShot.result === 'goal' ? 'text-green-500' : selectedShot.result === 'post' ? 'text-orange-500' : 'text-red-500'}`}>
                    {selectedShot.result === 'goal' ? 'BUT' : selectedShot.result === 'post' ? 'POTEAU' : 'ARRÊTÉ'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center gap-3">
                <Target size={24} className="text-neutral-600" />
                <p className="text-neutral-500 text-xs italic leading-relaxed">
                  Sélectionnez un point sur la cage ou le terrain pour voir les détails balistiques du tir.
                </p>
              </div>
            )}
          </div>
          
          {/* Half Pitch */}
          <div className="col-span-8 bg-[#141b14] rounded-xl border border-neutral-800 relative overflow-hidden" style={{ height: "220px" }}>
            {/* Pitch lines */}
            <div className="absolute inset-x-12 top-6 bottom-0 border border-white/20 border-b-0">
              {/* Penalty box */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[40%] border border-white/20 border-t-0" />
              {/* 6-yard box */}
              <div className="absolute top-0 left-[38%] right-[38%] h-[15%] border border-white/20 border-t-0" />
              {/* Penalty spot */}
              <div className="absolute top-[28%] left-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white/40 rounded-full" />
              {/* D-Curve */}
              <div className="absolute top-[40%] left-1/2 w-[20%] h-[20%] border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} />
            </div>
             
            {/* Shots on pitch */}
            <div className="absolute inset-x-12 top-6 bottom-0 pointer-events-none">
              {SHOT_IMPACTS.map((shot) => {
                const isSelected = shot.id === selectedShotId;
                const isDimmed = focusMode && selectedShotId !== null && !isSelected;
                const color = shot.result === "goal" ? "#22C55E" : "#EF4444";
                return (
                  <div
                    key={`pitch-${shot.id}`}
                    onClick={() => setSelectedShotId(shot.id)}
                    className={`absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full cursor-pointer transition-all pointer-events-auto ${isSelected ? 'ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-30' : 'z-20'} ${isDimmed ? 'opacity-20 grayscale-[50%]' : 'opacity-100 hover:ring-2 hover:ring-white/50'}`}
                    style={{
                      left: `${shot.pitchX * 100}%`,
                      top: `${(1 - shot.pitchY) * 100}%`,
                      backgroundColor: color,
                      boxShadow: isDimmed ? 'none' : `0 0 10px ${color}80`
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sniper Log ────────────────────────────────────────────────────────────────

function SniperLog() {
  return (
    <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-700/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          Sniper Log match par match
        </h3>
        <Tooltip text="Permet d'isoler les performances match par match. Visualisez la rentabilité technique sur chaque rencontre." />
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-700/50">
            {["Match", "Tirs (Cadrés)", "xG Total", "PSxG Total", "Différentiel", "Résultat"].map((h) => (
              <th key={h} className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SNIPER_LOG.map((row) => (
            <tr key={row.id} className="border-b border-neutral-700/20 hover:bg-white/5 transition-colors">
              <td className="px-5 py-4">
                <div className="text-xs font-bold text-white">{row.match}</div>
                <div className="text-[10px] text-neutral-500">{row.date}</div>
              </td>
              <td className="px-5 py-4 text-xs font-bold text-neutral-300">
                {row.shots} <span className="text-neutral-500 font-normal">({row.onTarget})</span>
              </td>
              <td className="px-5 py-4 text-xs font-bold text-neutral-300">{row.xgTotal.toFixed(2)}</td>
              <td className="px-5 py-4 text-xs font-bold text-neutral-300">{row.psxgTotal.toFixed(2)}</td>
              <td className={`px-5 py-4 text-xs font-black ${row.differential > 0 ? "text-green-500" : "text-red-500"}`}>
                {row.differential > 0 ? "+" : ""}{row.differential.toFixed(2)}
              </td>
              <td className="px-5 py-4">
                <div className="w-6 h-6 rounded bg-neutral-700 flex items-center justify-center text-xs font-black text-white">
                  {row.goals}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Bonus Indicators ──────────────────────────────────────────────────────────

function BonusIndicators() {
  const INDICATORS = [
    { 
      label: "Vitesse de Frappe Moyenne", 
      val: `${FINITION_DASHBOARD.avgSpeed} km/h`, 
      icon: Zap, 
      color: "#F59E0B",
      tooltip: "Vitesse moyenne du ballon à la sortie du pied. Indique la puissance brute du joueur."
    },
    { 
      label: "Efficacité du Mauvais Pied", 
      val: `+${FINITION_DASHBOARD.weakFootEfficiency}`, 
      icon: Footprints, 
      color: "#8B5CF6",
      tooltip: "Comparaison du différentiel PSxG - xG entre le pied fort et le pied faible. Un score équilibré indique un joueur imprévisible."
    },
    { 
      label: "Distance de Frappe Moyenne", 
      val: `${FINITION_DASHBOARD.avgDistance}m`, 
      icon: Ruler, 
      color: "#10B981",
      tooltip: "Position moyenne du joueur lors des déclenchements de tirs. Permet de distinguer les renards de surface des frappeurs de loin."
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {INDICATORS.map((ind) => (
        <div key={ind.label} className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ind.color}15`, border: `1px solid ${ind.color}30` }}>
            <ind.icon size={18} style={{ color: ind.color }} />
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{ind.label}</span>
              <Tooltip text={ind.tooltip} />
            </div>
            <div className="text-lg font-black text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>{ind.val}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

export function FinitionSection() {
  return (
    <div className="space-y-4">
      <VerdictDashboard />
      <GoalView />
      <BonusIndicators />
      <SniperLog />
    </div>
  );
}
