"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronRight, Ghost, Share2, ShieldAlert, MousePointer2 } from "lucide-react";
import { PitchSVG, relToAbs } from "./PitchSVG";
import { ANIMATION_EVENTS, AnimationEvent } from "./animation-mock";

const PW = 500;
const PH = 350;

export function TabOffBall() {
  const [selectedEventId, setSelectedEventId] = useState(ANIMATION_EVENTS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-5); // -5s to +2s
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedEvent = ANIMATION_EVENTS.find(e => e.id === selectedEventId) || ANIMATION_EVENTS[0];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 2) {
            setIsPlaying(false);
            return 2;
          }
          return prev + 0.1;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleEventSelect = (id: string) => {
    setSelectedEventId(id);
    setCurrentTime(-5);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (currentTime >= 2) setCurrentTime(-5);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full flex overflow-hidden bg-[var(--color-neutral-950)]">
      {/* ── LEFT SIDEBAR: EVENTS LIST ── */}
      <aside className="w-80 flex-shrink-0 border-r border-[var(--color-neutral-800)] flex flex-col bg-[var(--color-neutral-900)]">
        <div className="p-4 border-b border-[var(--color-neutral-800)]">
          <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Événements Tactiques</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
          <EventGroup 
            title="Ghost Player (Espaces)" 
            icon={<Ghost size={12} />} 
            events={ANIMATION_EVENTS.filter(e => e.type === 'ghost')}
            selectedId={selectedEventId}
            onSelect={handleEventSelect}
          />
          <EventGroup 
            title="Passing Options (Connexions)" 
            icon={<Share2 size={12} />} 
            events={ANIMATION_EVENTS.filter(e => e.type === 'passing')}
            selectedId={selectedEventId}
            onSelect={handleEventSelect}
          />
          <EventGroup 
            title="Pression Collective" 
            icon={<ShieldAlert size={12} />} 
            events={ANIMATION_EVENTS.filter(e => e.type === 'pressure')}
            selectedId={selectedEventId}
            onSelect={handleEventSelect}
          />
        </div>
      </aside>

      {/* ── CENTER: 2D VIEWER ── */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Header Info */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#C42B47]/10 text-[#C42B47] text-[10px] font-bold uppercase tracking-wider">
                {selectedEvent.type}
              </span>
              <h2 className="text-lg font-black text-white">{selectedEvent.label}</h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-xl">{selectedEvent.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-bold text-white">
              {Math.floor(selectedEvent.timestamp / 60)}:{(selectedEvent.timestamp % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] text-neutral-500 font-bold uppercase">Timecode Match</div>
          </div>
        </div>

        {/* Pitch Viewer */}
        <div className="flex-1 bg-[var(--color-neutral-900)] rounded-2xl border border-[var(--color-neutral-800)] relative flex flex-col overflow-hidden shadow-2xl">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
             <div className="px-3 py-1.5 bg-black/40 backdrop-blur rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Simulated Tracking</span>
             </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-12">
            <PitchSVG width={PW} height={PH}>
               {/* ── SPACE HIGHLIGHT ── */}
               {selectedEvent.spaceHighlight && (
                 <circle 
                   cx={selectedEvent.spaceHighlight.x * PW} 
                   cy={selectedEvent.spaceHighlight.y * PH} 
                   r={selectedEvent.spaceHighlight.radius * (1 + Math.sin(currentTime * 2) * 0.1)} 
                   fill="rgba(196,43,71,0.15)"
                   stroke="#C42B47"
                   strokeWidth="1.5"
                   strokeDasharray="4 2"
                   opacity={currentTime > -1 ? 0.8 : 0.2}
                 />
               )}

               {/* ── PASSING LINES ── */}
               {selectedEvent.passingLines?.map((line, idx) => {
                 const from = selectedEvent.players.find(p => p.id === line.from);
                 const to = selectedEvent.players.find(p => p.id === line.to);
                 if (!from || !to) return null;
                 
                 const color = line.type === 'gold' ? '#D4AF37' : line.type === 'dotted' ? '#EF4444' : '#3B82F6';
                 const isIgnored = line.type === 'dotted';
                 
                 return (
                   <line 
                     key={idx}
                     x1={from.x * PW} y1={from.y * PH}
                     x2={to.x * PW} y2={to.y * PH}
                     stroke={color}
                     strokeWidth={line.thickness}
                     strokeDasharray={line.type === 'dotted' ? '4 4' : undefined}
                     opacity={currentTime > -0.5 ? (isIgnored ? 0.6 : 0.9) : 0.1}
                   />
                 );
               })}

               {/* ── PLAYERS ── */}
               {selectedEvent.players.map(player => {
                 // Simple position interpolation simulation
                 const offsetX = Math.sin(currentTime + player.x) * 10;
                 const offsetY = Math.cos(currentTime + player.y) * 10;
                 
                 const color = player.role === 'opponent' ? '#var(--color-neutral-600)' : '#C42B47';
                 const isCarrier = player.role === 'carrier';
                 
                 return (
                   <g key={player.id} transform={`translate(${player.x * PW + offsetX}, ${player.y * PH + offsetY})`}>
                      {isCarrier && (
                        <circle r="12" fill="none" stroke="#3B82F6" strokeWidth="2" className="animate-ping" />
                      )}
                      <circle r="6" fill={player.role === 'opponent' ? '#444' : '#C42B47'} stroke="#fff" strokeWidth="1" />
                      <text y="-10" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff" className="uppercase">
                        {player.id}
                      </text>
                   </g>
                 );
               })}
            </PitchSVG>
          </div>

          {/* ── PLAYERBAR ── */}
          <div className="bg-black/60 backdrop-blur-md p-4 border-t border-white/10 flex items-center gap-6">
            <button 
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-black"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            
            <button 
              onClick={() => { setCurrentTime(-5); setIsPlaying(false); }}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <RotateCcw size={18} />
            </button>

            <div className="flex-1 flex flex-col gap-2">
              <div className="relative h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#C42B47] transition-all duration-100 ease-linear" 
                  style={{ width: `${((currentTime + 5) / 7) * 100}%` }}
                />
                {/* Marker at T=0 */}
                <div className="absolute left-[71.4%] top-0 w-0.5 h-full bg-white z-10" />
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                <span>-5.0s</span>
                <span className="text-white">Événement (0.0s)</span>
                <span>+2.0s</span>
              </div>
            </div>

            <div className="w-24 text-right">
              <span className="text-xs font-mono font-bold text-white">
                {currentTime.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EventGroup({ title, icon, events, selectedId, onSelect }: { 
  title: string; 
  icon: React.ReactNode; 
  events: AnimationEvent[]; 
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="px-2 py-1 flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {events.map(event => {
          const isActive = selectedId === event.id;
          return (
            <button
              key={event.id}
              onClick={() => onSelect(event.id)}
              className={`w-full text-left p-3 rounded-xl transition-all border ${
                isActive 
                  ? "bg-[#C42B47]/10 border-[#C42B47]/30" 
                  : "bg-transparent border-transparent hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold truncate ${isActive ? "text-[#C42B47]" : "text-neutral-300"}`}>
                  {event.label}
                </span>
                <ChevronRight size={12} className={isActive ? "text-[#C42B47]" : "text-neutral-600"} />
              </div>
              <div className="text-[9px] text-neutral-500 mt-1">
                {Math.floor(event.timestamp / 60)}:{(event.timestamp % 60).toString().padStart(2, '0')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
