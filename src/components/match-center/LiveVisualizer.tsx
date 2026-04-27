"use client";

import { useState, useEffect } from "react";
import { Activity, Shield, Zap, TrendingUp, Info } from "lucide-react";
import { PitchSVG } from "./post-match/PitchSVG";
import { TRACKING_FRAME, PHYSICAL_SPLITS_METZ, type PlayerSplit } from "./live-mock";

// ─── Helpers for Metrics ──────────────────────────────────────────────────────

function hsrDrop(p: PlayerSplit) {
  const v = p.hsr5min.filter(x => x > 0);
  if (v.length < 2) return 0;
  const first = v.slice(0, 3).reduce((s, x) => s + x, 0) / Math.min(v.length, 3);
  const last = v.slice(-3).reduce((s, x) => s + x, 0) / Math.min(v.length, 3);
  return first > 0 ? (1 - last / first) * 100 : 0;
}

function getRiskColor(drop: number) {
  if (drop >= 50) return "#ef4444";
  if (drop >= 30) return "#f59e0b";
  return "#22c55e";
}

// ─── Component: LiveVisualizer ────────────────────────────────────────────────

export function LiveVisualizer() {
  const [pulse, setPulse] = useState(true);
  const frame = TRACKING_FRAME;

  useEffect(() => {
    const i = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "260px 1fr 280px",
      gap: 16,
      height: "100%",
      padding: "16px",
      background: "var(--color-neutral-950)",
      overflow: "hidden"
    }}>
      
      {/* ── LEFT: PHYSICAL ALERTS (Algorithmic suggestions) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Activity size={14} className="text-[var(--color-primary-400)]" />
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-200)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Proposition Algorithme</span>
        </div>

        {PHYSICAL_SPLITS_METZ.map(p => {
          const drop = hsrDrop(p);
          if (drop < 30) return null;
          const color = getRiskColor(drop);

          return (
            <div key={p.playerId} style={{
              padding: "12px",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${color}44`,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>{p.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color, background: `${color}22`, padding: "1px 6px", borderRadius: 4 }}>
                  {drop >= 50 ? "SUGGESTION SUB." : "SURVEILLANCE"}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>
                {drop.toFixed(0)}% de chute d'intensité HSR
              </div>
              <div style={{ marginTop: 4, height: 3, background: "var(--color-neutral-800)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, drop)}%`, height: "100%", background: color }} />
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: "auto", padding: "12px", background: "var(--color-primary-500)11", border: "1px solid var(--color-primary-500)33", borderRadius: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "var(--color-primary-400)", marginBottom: 4 }}>ANALYSE PRÉDICTIVE</div>
          <p style={{ fontSize: 10, color: "var(--color-neutral-400)", lineHeight: 1.4 }}>
            Le modèle suggère une baisse de performance globale à la 75ème min. Prévoir 2 remplacements.
          </p>
        </div>
      </div>

      {/* ── CENTER: SURGICAL 2D VIEW ── */}
      <div style={{ 
        background: "var(--color-neutral-900)", 
        border: "1px solid var(--color-neutral-800)", 
        borderRadius: 16, 
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)"
      }}>
        <div style={{ position: "relative" }}>
          <PitchSVG width={480} height={600}>
            {/* Ball */}
            <circle 
              cx={16 + frame.ball.x * (480 - 32)} 
              cy={16 + frame.ball.y * (600 - 32)} 
              r={5} 
              fill="white" 
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))", transition: "all 0.5s" }} 
            />
            
            {/* Home Players */}
            {frame.homePlayers.map(p => (
              <g key={p.playerId} style={{ transition: "all 0.5s" }}>
                <circle 
                  cx={16 + p.x * (480 - 32)} 
                  cy={16 + p.y * (600 - 32)} 
                  r={10} 
                  fill="var(--color-primary-500)" 
                  stroke="white" 
                  strokeWidth={1} 
                />
                <text 
                  x={16 + p.x * (480 - 32)} 
                  y={16 + p.y * (600 - 32) + 3} 
                  textAnchor="middle" 
                  fontSize={8} 
                  fontWeight={900} 
                  fill="white"
                >
                  {p.number}
                </text>
              </g>
            ))}

            {/* Away Players */}
            {frame.awayPlayers.map(p => (
              <g key={p.playerId} style={{ transition: "all 0.5s" }}>
                <circle 
                  cx={16 + p.x * (480 - 32)} 
                  cy={16 + p.y * (600 - 32)} 
                  r={10} 
                  fill="var(--color-neutral-800)" 
                  stroke="var(--color-neutral-400)" 
                  strokeWidth={1} 
                />
                <text 
                  x={16 + p.x * (480 - 32)} 
                  y={16 + p.y * (600 - 32) + 3} 
                  textAnchor="middle" 
                  fontSize={8} 
                  fontWeight={900} 
                  fill="white"
                >
                  {p.number}
                </text>
              </g>
            ))}
          </PitchSVG>

          {/* Legend Overlay */}
          <div style={{ 
            position: "absolute", bottom: 12, right: 12, 
            background: "rgba(0,0,0,0.6)", padding: "6px 10px", borderRadius: 6,
            display: "flex", gap: 12, backdropFilter: "blur(4px)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary-500)" }} />
              <span style={{ fontSize: 9, color: "white", fontWeight: 700 }}>Metz</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-neutral-700)" }} />
              <span style={{ fontSize: 9, color: "white", fontWeight: 700 }}>Paris FC</span>
            </div>
          </div>
        </div>

        {/* Surgical Tags */}
        <div style={{ position: "absolute", top: 20, left: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.4)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
            <Zap size={10} className="text-yellow-500" />
            <span style={{ fontSize: 9, fontWeight: 800, color: "white" }}>VITESSE BALLE : {(frame.ball.speed * 3.6).toFixed(1)} KM/H</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: TACTICAL INSIGHTS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={14} className="text-blue-400" />
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-neutral-200)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Insights Tactiques</span>
        </div>

        {/* Metric Card 1: Line Height */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-neutral-800)", borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: "var(--color-neutral-400)", fontWeight: 700 }}>Hauteur du bloc</span>
            <TrendingUp size={12} className="text-green-500" />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "white" }}>48.2</span>
            <span style={{ fontSize: 12, color: "var(--color-neutral-500)" }}>mètres</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 9, color: "var(--color-neutral-500)" }}>
            +2.4m depuis 10 min · <span className="text-green-500">Bloc Médian</span>
          </div>
        </div>

        {/* Metric Card 2: Density */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-neutral-800)", borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: "var(--color-neutral-400)", fontWeight: 700 }}>Densité Interligne</span>
            <Info size={12} className="text-blue-400" />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "white" }}>12.8</span>
            <span style={{ fontSize: 12, color: "var(--color-neutral-500)" }}>m² / joueur</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 9, color: "var(--color-neutral-500)" }}>
             <span className="text-blue-400">Stable</span> · Couverture optimale du centre.
          </div>
        </div>

        {/* Live Feed */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: "var(--color-neutral-600)", textTransform: "uppercase" }}>Flux Insight 2S</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: 0.7 }}>
            <div style={{ fontSize: 10, borderLeft: "2px solid #ef4444", paddingLeft: 8 }}>
              <span className="text-neutral-500">71'02"</span> · Perte de balle haute (G. Hein)
            </div>
            <div style={{ fontSize: 10, borderLeft: "2px solid #22c55e", paddingLeft: 8 }}>
              <span className="text-neutral-500">69'45"</span> · xG Tir Metz : 0.42 (Kvilitaia)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
