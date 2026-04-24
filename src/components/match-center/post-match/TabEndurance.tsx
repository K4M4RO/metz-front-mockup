"use client";

import { useState } from "react";
import { Zap, Activity, Clock, ChevronDown, User } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { ENDURANCE_DATA } from "./endurance-mock";

export function TabEndurance() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(ENDURANCE_DATA.players[0].id);
  const selectedPlayer = ENDURANCE_DATA.players.find(p => p.id === selectedPlayerId) || ENDURANCE_DATA.players[0];

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar bg-[var(--color-neutral-950)]">
      {/* ── HEADER STATS ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Intensité Moyenne"
          value={`${ENDURANCE_DATA.team.avgMPerMin} m/min`}
          sub="Benchmark L2: 108"
          icon={<Activity size={16} className="text-blue-500" />}
        />
        <StatCard
          label="Sprints d'Équipe"
          value={ENDURANCE_DATA.team.totalSprints}
          sub="+12% vs dernier match"
          icon={<Zap size={16} className="text-yellow-500" />}
        />
        <StatCard
          label="Distance HI"
          value={`${(ENDURANCE_DATA.team.hiDistance / 1000).toFixed(1)} km`}
          sub="Distance à haute intensité"
          icon={<Clock size={16} className="text-purple-500" />}
        />
        <StatCard
          label="Drop-Off Final"
          value="-18%"
          sub="Perte de lucidité (80'+)"
          icon={<Activity size={16} className="text-red-500" />}
        />
      </div>

      <div className="flex flex-col gap-6">
        {/* ── DROP-OFF CHART (TEAM) ── */}
        <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fatigue Tactique & Lucidité</h3>
              <p className="text-[10px] text-[var(--color-neutral-500)] mt-1">Évolution de l'intensité (m/min) vs Précision technique (%)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500" />
                <span className="text-[10px] text-neutral-400">Intensité</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500" />
                <span className="text-[10px] text-neutral-400">Lucidité</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col pt-4 min-h-0">
            <div className="flex-1 relative min-h-0">
              {/* Simple SVG Chart representing Drop-off */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Intensity Path (Blue) */}
                <path
                  d="M 0 20 L 16 22 L 33 25 L 50 35 L 66 30 L 83 45 L 100 55"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Precision Path (Red) */}
                <path
                  d="M 0 10 L 16 12 L 33 15 L 50 20 L 66 18 L 83 35 L 100 45"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="var(--color-neutral-800)" strokeWidth="0.5" />
                ))}
              </svg>

              {/* Critical Alert Marker */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                <div className="bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-[10px] text-red-400 font-black mb-2 animate-pulse">
                  ZONE DE RUPTURE
                </div>
                <div className="w-px h-32 bg-red-500/30 dashed" />
              </div>
            </div>

            {/* Timeline Labels */}
            <div className="flex justify-between mt-4">
              {['0\'', '15\'', '30\'', '45\'', '60\'', '75\'', '90\''].map(t => (
                <span key={t} className="text-[9px] text-neutral-600 font-bold">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── PLAYER FOCUS ── */}
        <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] grid grid-cols-12 min-h-[400px]">
          <div className="col-span-4 p-6 border-r border-[var(--color-neutral-800)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Stamina — Distance/min (m/min)</h3>
              <div className="text-[10px] font-bold text-neutral-500">SÉLECTION JOUEUR</div>
            </div>

            <div className="space-y-2 mb-4 h-[220px] overflow-y-auto custom-scrollbar pr-2">
              {ENDURANCE_DATA.players.map(p => {
                const isActive = p.id === selectedPlayerId;
                // @ts-ignore
                const m = p.maintenance;
                return (
                  <button 
                    key={p.id}
                    onClick={() => setSelectedPlayerId(p.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isActive ? 'bg-[#C42B47]/10 border-[#C42B47]/30' : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${m > 85 ? 'bg-green-500' : m > 75 ? 'bg-orange-500' : 'bg-red-500'}`} />
                      <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-neutral-400'}`}>{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* @ts-ignore */}
                      {p.subbedOut && <span className="text-[8px] bg-red-500/20 text-red-500 px-1 rounded font-black">OUT</span>}
                      <span className="text-[10px] font-black text-white">{m}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-neutral-800)] border border-[var(--color-neutral-700)] flex items-center justify-center">
                <User size={24} className="text-neutral-500" />
              </div>
              <div>
                <div className="text-sm font-black text-white">{selectedPlayer.name}</div>
                <div className="flex gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Zap size={10} className="text-yellow-500" />
                    <span className="text-[10px] text-neutral-400">{selectedPlayer.sprints} sprints</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={10} className="text-blue-500" />
                    <span className="text-[10px] text-neutral-400">{selectedPlayer.hiDistance}m HI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-8 p-6 flex flex-col">
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedPlayer.slices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-800)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: "var(--color-neutral-600)", fontSize: 10, fontWeight: 700 }} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    domain={[100, 140]} 
                    ticks={[100, 110, 120, 130, 140]}
                    tick={{ fill: "var(--color-neutral-600)", fontSize: 10, fontWeight: 700 }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-neutral-800)', border: '1px solid var(--color-neutral-700)', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    labelStyle={{ color: 'var(--color-neutral-500)', marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22C55E" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "white", strokeWidth: 2, stroke: "#22C55E" }}
                    activeDot={{ r: 6, fill: "white", strokeWidth: 2, stroke: "#22C55E" }}
                    isAnimationActive={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
              <div className="text-[9px] font-bold text-red-400 uppercase mb-1">Observation Staff</div>
              <p className="text-[10px] text-neutral-400 leading-relaxed italic">
                Chute d'intensité de {Math.round((1 - selectedPlayer.slices[5].value / selectedPlayer.slices[0].value) * 100)}% constatée sur la dernière tranche. Lucidité technique affectée sur les centres.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GLOBAL FATIGUE RANKING ── */}
      <div className="bg-[var(--color-neutral-900)] rounded-xl border border-[var(--color-neutral-800)] p-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Maintien de l'Intensité (Squad Ranking)</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {ENDURANCE_DATA.players.sort((a, b) => (b as any).maintenance - (a as any).maintenance).map((p: any) => (
            <div key={p.id} className="flex items-center gap-4">
              <div className="w-24 text-[10px] font-bold text-neutral-400 truncate">{p.name}</div>
              <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    p.maintenance > 85 ? 'bg-green-500' : p.maintenance > 75 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${p.maintenance}%` }}
                />
              </div>
              <div className="w-12 text-[10px] font-black text-white text-right">{p.maintenance}%</div>
              <div className="w-10">
                {p.subbedOut && (
                  <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">OUT</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-neutral-900)] p-4 rounded-xl border border-[var(--color-neutral-800)]">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] text-[var(--color-neutral-500)] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-[9px] text-[var(--color-neutral-600)] mt-1">{sub}</div>
    </div>
  );
}
