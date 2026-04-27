"use client";

import React from "react";
import { Activity, Zap, Target, TrendingDown, TrendingUp, AlertCircle, CheckCircle, Brain, MousePointer2 } from "lucide-react";

// ─── Simulation Data ─────────────────────────────────────────────────────────

interface StreamData {
  minute: number;
  hsr: number;        // Physical (Athletic stream)
  successRate: number; // Technical (Insight stream)
  markingDist: number; // Tactical (Insight/Tracking stream)
}

const SIMULATION: StreamData[] = [
  { minute: 15, hsr: 100, successRate: 88, markingDist: 1.2 },
  { minute: 30, hsr: 95,  successRate: 90, markingDist: 1.1 },
  { minute: 45, hsr: 85,  successRate: 85, markingDist: 1.4 },
  { minute: 60, hsr: 60,  successRate: 75, markingDist: 1.8 },
  { minute: 75, hsr: 45,  successRate: 55, markingDist: 2.5 }, // CRITICAL CROSSOVER
];

// ─── Components ──────────────────────────────────────────────────────────────

export function DecisionMatrix() {
  return (
    <div style={{
      background: "var(--color-neutral-900)",
      borderRadius: 12,
      border: "1px solid var(--color-neutral-800)",
      padding: 24,
      color: "white",
      maxWidth: 900,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    }}>
      {/* Header: The Concept */}
      <div style={{ borderBottom: "1px solid var(--color-neutral-800)", paddingBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Brain style={{ color: "var(--color-primary-400)" }} size={24} />
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Simulation : Fusion de Flux Insight & Athlétique</h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-neutral-400)", margin: 0, lineHeight: 1.5 }}>
          L'intelligence de la suggestion réside dans le **croisement des corrélations**. 
          On ne regarde pas si le joueur est fatigué, on regarde si sa fatigue le rend **inutile** ou **dangereux**.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        
        {/* Scenario 1: The "Key Player" (Compensated) */}
        <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Gauthier Hein (MO)</div>
              <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>72ème minute · Score 1-1</div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: 10, fontWeight: 900, alignSelf: "flex-start" }}>
              GARDER (COMPENSÉ)
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Stream Physical */}
            <div style={{ padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>FLUX ATHLÉTIQUE</span>
                <span style={{ color: "#ef4444" }}>ALERTE HSR</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingDown size={16} color="#ef4444" />
                <span style={{ fontSize: 11, color: "var(--color-neutral-200)" }}>HSR Drop : <strong>-42%</strong> (Volume critique)</span>
              </div>
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: "var(--color-neutral-600)" }}>✖ CORRÉLATION ✖</div>

            {/* Stream Insight */}
            <div style={{ padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>FLUX INSIGHT (OPTA + 2S)</span>
                <span style={{ color: "#22c55e" }}>STABLE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingUp size={16} color="#22c55e" />
                <span style={{ fontSize: 11, color: "var(--color-neutral-200)" }}>Touches Danger : <strong>+12%</strong> · Passes prog : <strong>OK</strong></span>
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 11, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, borderLeft: "3px solid #3b82f6" }}>
              <strong>Rationale :</strong> Le joueur compense son manque de volume par une lecture de jeu supérieure. Son positionnement lui permet de rester décisif sans courir.
            </div>
          </div>
        </div>

        {/* Scenario 2: The "Tactical Liability" (Critical) */}
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Jessy Deminguet (MDC)</div>
              <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>72ème minute · Score 1-1</div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 10, fontWeight: 900, alignSelf: "flex-start" }}>
              SORTIR (CRITIQUE)
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Stream Physical */}
            <div style={{ padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>FLUX ATHLÉTIQUE</span>
                <span style={{ color: "#ef4444" }}>ALERTE DÉCROCHAGE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingDown size={16} color="#ef4444" />
                <span style={{ fontSize: 11, color: "var(--color-neutral-200)" }}>% Marche : <strong>68%</strong> (baseline 22%)</span>
              </div>
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: "var(--color-neutral-600)" }}>✖ CORRÉLATION ✖</div>

            {/* Stream Insight */}
            <div style={{ padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>FLUX INSIGHT (TRACKING 2S)</span>
                <span style={{ color: "#ef4444" }}>RUPTURE TACTIQUE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingDown size={16} color="#ef4444" />
                <span style={{ fontSize: 11, color: "var(--color-neutral-200)" }}>Marquage (Dist) : <strong>4.2m</strong> (Déficit +2.8m)</span>
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 11, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, borderLeft: "3px solid #ef4444" }}>
              <strong>Rationale :</strong> La fatigue physique a entraîné un décrochage mental. Le joueur n'assure plus la couverture axiale, créant une zone de tir libre pour l'adversaire.
            </div>
          </div>
        </div>

      </div>

      {/* Decision Visualization: The "Cross-Feed" */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)", marginBottom: 12, textTransform: "uppercase" }}>Visualisation de la corrélation (Flux croisés)</div>
        <div style={{ height: 120, borderBottom: "1px solid var(--color-neutral-700)", borderLeft: "1px solid var(--color-neutral-700)", position: "relative", marginBottom: 30 }}>
          {/* Mock Graph */}
          <svg width="100%" height="100%" style={{ overflow: "visible" }}>
            {/* Physical line */}
            <path d="M 0 20 L 150 25 L 300 40 L 450 70 L 600 90" fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" />
            {/* Insight line */}
            <path d="M 0 10 L 150 12 L 300 15 L 450 40 L 600 85" fill="none" stroke="var(--color-primary-400)" strokeWidth={3} />
            
            {/* Labels */}
            <text x={610} y={90} fill="#ef4444" fontSize={10} fontWeight={700}>HSR (Athletic)</text>
            <text x={610} y={85} fill="var(--color-primary-400)" fontSize={10} fontWeight={700} dy={15}>Impact (Insight)</text>
            
            {/* Crossover point */}
            <circle cx={450} cy={70} r={6} fill="#ef4444" opacity={0.5} />
            <text x={430} y={55} fill="#ef4444" fontSize={9} fontWeight={800}>POINT DE RUPTURE</text>
          </svg>
        </div>
      </div>
      
      {/* Legend / API map */}
      <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--color-neutral-800)", paddingTop: 16 }}>
        <div style={{ flex: 1, fontSize: 9, color: "var(--color-neutral-600)" }}>
          <strong style={{ color: "var(--color-neutral-400)" }}>Source Athlétique :</strong> <code>physical-splits</code> (percentTimeWalkingOutPossession, topSpeedInPlay)
        </div>
        <div style={{ flex: 1, fontSize: 9, color: "var(--color-neutral-600)" }}>
          <strong style={{ color: "var(--color-neutral-400)" }}>Source Insight :</strong> <code>insight</code> (optaEvent outcome, shooterDefDist, xG contribution)
        </div>
      </div>
    </div>
  );
}
