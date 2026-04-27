"use client";

import { PHYSICAL_SPLITS_METZ, BENCH_METZ, type PlayerSplit } from "./live-mock";
import { Activity, Shield, Zap, Target, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function firstThreeAvg(arr: number[]) {
  const vals = arr.filter(v => v > 0).slice(0, 3);
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
}
function lastThreeAvg(arr: number[]) {
  const vals = arr.filter(v => v > 0);
  const last = vals.slice(-3);
  return last.length ? last.reduce((s, v) => s + v, 0) / last.length : 0;
}

type RiskLevel = "urgent" | "watch" | "compensate" | "ok";

interface Rationale {
  physical: string;
  technical: string;
  context: string;
  level: RiskLevel;
}

/**
 * Reliability Engine: Cross-references Physical, Technical and Context
 */
function evaluateUtility(p: PlayerSplit): Rationale {
  const firstHsr = firstThreeAvg(p.hsr5min);
  const lastHsr  = lastThreeAvg(p.hsr5min);
  const hsrDrop  = firstHsr > 0 ? (1 - lastHsr / firstHsr) * 100 : 0;
  
  const walkBase = firstThreeAvg(p.walkOutPoss5min);
  const walkCurr = p.walkOutPoss5min.at(-1) ?? 0;
  const walkIncr = walkCurr - walkBase;

  const physAlarm = hsrDrop >= 50 || walkIncr >= 25;
  const physWarn  = hsrDrop >= 30 || walkIncr >= 15;

  const duelRate = p.duelsTotal > 0 ? (p.duelsWon / p.duelsTotal) * 100 : 100;
  const isProductive = p.touchesDangerous >= 3 || p.progressivePasses >= 3;
  const isLosingDuels = p.duelsTotal >= 3 && duelRate < 40;

  const isCriticalPos = ["MDC", "AG", "AD", "MO"].includes(p.position);

  let level: RiskLevel = "ok";
  let physMsg = "Physique stable";
  let techMsg = "Impact technique maintenu";
  let contMsg = "Rôle couvert";

  if (physAlarm) {
    if (isProductive && !isLosingDuels) {
      level = "compensate";
      physMsg = `Fatigue marquée (−${hsrDrop.toFixed(0)}%)`;
      techMsg = "Toujours décisif (Compense par le placement)";
      contMsg = "Garder : Utilité offensive critique";
    } else {
      level = "urgent";
      physMsg = `Épuisement détecté (−${hsrDrop.toFixed(0)}%)`;
      techMsg = isLosingDuels ? "Impact en chute (Duels perdus)" : "Invisibilité technique";
      contMsg = isCriticalPos ? "Risque de rupture dans l'axe" : "Sortir : Rendement insuffisant";
    }
  } else if (physWarn) {
    level = "watch";
    physMsg = `Baisse d'intensité (−${hsrDrop.toFixed(0)}%)`;
    techMsg = isLosingDuels ? "Fragilité en duel" : "Productivité correcte";
    contMsg = "Surveillance active";
  }

  return { physical: physMsg, technical: techMsg, context: contMsg, level };
}

const LEVEL_CFG: Record<RiskLevel, { label: string; color: string; bg: string; border: string; icon: any }> = {
  urgent:     { label: "SUGGESTION SUB.", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)",  icon: AlertTriangle },
  watch:      { label: "Surveillance",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", icon: Zap },
  compensate: { label: "Compensé",       color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", icon: Target },
  ok:         { label: "Optimal",        color: "#22c55e", bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.25)", icon: CheckCircle },
};

// ─── Components ───────────────────────────────────────────────────────────────

function HsrSparkline({ values, level }: { values: number[]; level: RiskLevel }) {
  const active = values.filter(v => v >= 0);
  const max = Math.max(...active, 1);
  const W = 100; const H = 30;

  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      {active.map((v, i) => {
        const x = (i / (active.length - 1 || 1)) * (W - 4) + 2;
        const h = (v / max) * (H - 4);
        const isLast3 = i >= active.length - 3;
        return (
          <rect key={i} x={x - 2} y={H - h - 2} width={4} height={h} rx={1}
            fill={isLast3 
              ? (level === "urgent" ? "#ef4444" : level === "watch" ? "#f59e0b" : level === "compensate" ? "#3b82f6" : "#22c55e")
              : "rgba(255,255,255,0.1)"} 
          />
        );
      })}
    </svg>
  );
}

function PlayerUtilityRow({ p }: { p: PlayerSplit }) {
  const rat = evaluateUtility(p);
  const cfg = LEVEL_CFG[rat.level];
  const duelRate = p.duelsTotal > 0 ? Math.round((p.duelsWon / p.duelsTotal) * 100) : "—";
  const lastHsr  = p.hsr5min.at(-1) ?? 0;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "150px 120px 80px 80px 80px 1fr",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderBottom: "1px solid var(--color-neutral-800)",
      background: rat.level === "urgent" ? "rgba(239,68,68,0.02)" : "transparent",
    }}>
      {/* 1. Joueur */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{p.name}</div>
        <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>{p.position} · {p.minutesPlayed}'</div>
      </div>

      {/* 2. Physique (HSR) */}
      <div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)", marginBottom: 4 }}>HSR (Dernier : {lastHsr}m)</div>
        <HsrSparkline values={p.hsr5min} level={rat.level} />
      </div>

      {/* 3. Technique: Volume */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--color-neutral-300)" }}>{p.touchesDangerous}</div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>Touches (15')</div>
      </div>

      {/* 4. Technique: Efficacité */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: p.duelsTotal >= 3 && (p.duelsWon / p.duelsTotal) < 0.4 ? "#ef4444" : "var(--color-neutral-300)" }}>
          {duelRate}%
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>Duels ({p.duelsTotal})</div>
      </div>

      {/* 5. Technique: Progression */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--color-neutral-300)" }}>{p.progressivePasses}</div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>Passes prog.</div>
      </div>

      {/* 6. Rationale */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, paddingLeft: 12,
        borderLeft: "1px solid var(--color-neutral-800)",
      }}>
        <div style={{
          padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 800,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
          whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
          minWidth: 120, justifyContent: "center"
        }}>
          <cfg.icon size={12} />
          {cfg.label}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "var(--color-neutral-200)", fontWeight: 600 }}>{rat.context}</div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>{rat.physical} · {rat.technical}</div>
        </div>
      </div>
    </div>
  );
}

export function LiveTabFatigue() {
  const sorted = [...PHYSICAL_SPLITS_METZ].sort((a, b) => {
    const order: Record<RiskLevel, number> = { urgent: 0, watch: 1, compensate: 2, ok: 3 };
    return order[evaluateUtility(a).level] - order[evaluateUtility(b).level];
  });

  const urgents = sorted.filter(p => evaluateUtility(p).level === "urgent");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--color-neutral-950)", overflow: "hidden" }}>
      
      {/* Top Banner */}
      <div style={{
        padding: "12px 20px", background: "rgba(59,130,246,0.05)",
        borderBottom: "1px solid var(--color-neutral-800)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Shield size={16} style={{ color: "#3b82f6" }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-200)" }}>Aide à la décision (Croisement Physique-Tactique)</div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>
            Analyse multi-flux : HSR (Athletic) + Touches/Duels/Passes (Insight) + Contexte Score (1-1).
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "150px 120px 80px 80px 80px 1fr",
          gap: 12, padding: "10px 16px",
          background: "var(--color-neutral-900)", borderBottom: "1px solid var(--color-neutral-800)",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Joueur</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Flux HSR</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", textAlign: "center" }}>Volume</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", textAlign: "center" }}>Efficacité</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", textAlign: "center" }}>Progression</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", paddingLeft: 12 }}>RATIONALE & DÉCISION ALGORITHMIQUE</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
          {sorted.map(p => <PlayerUtilityRow key={p.playerId} p={p} />)}
        </div>
      </div>

      {/* Suggestions Section */}
      {urgents.length > 0 && (
        <div style={{
          padding: "16px 20px", borderTop: "1px solid var(--color-neutral-800)",
          background: "rgba(239,68,68,0.05)", display: "flex", gap: 20, alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle style={{ color: "#ef4444" }} size={24} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#ef4444" }}>ALERTE : RUPTURE D'INTENSITÉ</div>
              <div style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>{urgents[0].name} ({urgents[0].position}) : décrochage physique et technique.</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <div style={{ fontSize: 9, color: "var(--color-neutral-600)", alignSelf: "center", marginRight: 8 }}>OPTIONS BANC :</div>
            {BENCH_METZ.slice(0, 2).map((b, i) => (
              <div key={i} style={{
                padding: "6px 12px", borderRadius: 8, background: "var(--color-neutral-900)",
                border: "1px solid var(--color-neutral-800)", fontSize: 11, color: "white",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ color: "var(--color-primary-400)", fontWeight: 900 }}>#{b.number}</span> {b.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
