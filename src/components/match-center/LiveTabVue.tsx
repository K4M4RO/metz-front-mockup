"use client";

import { useState, useEffect, useRef } from "react";
import {
  TRACKING_FRAME, INSIGHT_SHOTS, PHYSICAL_SPLITS_METZ, BENCH_METZ,
  type TrackingPlayer,
} from "./live-mock";

// ─── Animation helpers ────────────────────────────────────────────────────────

interface Pos { x: number; y: number; }

const HOME_ORIGIN = TRACKING_FRAME.homePlayers.map(p => ({ x: p.x, y: p.y }));
const AWAY_ORIGIN = TRACKING_FRAME.awayPlayers.map(p => ({ x: p.x, y: p.y }));

const WANDER = [
  0.006,  // GB
  0.014, 0.014, 0.018, 0.018,  // défenseurs
  0.022, 0.022,                  // MDC
  0.030, 0.028, 0.030,          // ailiers + MO
  0.038,                          // attaquant
];

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function drift(pos: Pos, origin: Pos, radius: number): Pos {
  const dx = (origin.x - pos.x) * 0.06 + (Math.random() - 0.5) * radius;
  const dy = (origin.y - pos.y) * 0.06 + (Math.random() - 0.5) * radius * 0.9;
  return { x: clamp(pos.x + dx, 0.03, 0.97), y: clamp(pos.y + dy, 0.03, 0.97) };
}

type Risk = "urgent" | "watch" | "ok" | "compensate";

function firstAvg(arr: number[]) {
  const v = arr.filter(x => x > 0).slice(0, 3);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;
}
function lastAvg(arr: number[]) {
  const v = arr.filter(x => x > 0); const l = v.slice(-3);
  return l.length ? l.reduce((s, x) => s + x, 0) / l.length : 0;
}

function playerRisk(p: typeof PHYSICAL_SPLITS_METZ[0]): Risk {

  const drop = firstAvg(p.hsr5min) > 0 ? (1 - lastAvg(p.hsr5min) / firstAvg(p.hsr5min)) * 100 : 0;
  const wCurr = p.walkOutPoss5min.filter(v => v > 0).at(-1) ?? 0;
  const wBase = firstAvg(p.walkOutPoss5min);
  
  const physAlarm = drop >= 50 || (wCurr - wBase) >= 25;
  const techUseful = p.touchesDangerous >= 3 || p.progressivePasses >= 3;
  const duelOk = p.duelsTotal === 0 || (p.duelsWon / p.duelsTotal) >= 0.4;

  if (physAlarm) {
    return (techUseful && duelOk) ? "compensate" : "urgent";
  }
  if (drop >= 30 || (wCurr - wBase) >= 15) return "watch";
  return "ok";
}
function playerAction(p: typeof PHYSICAL_SPLITS_METZ[0]): string {
  const r = playerRisk(p);
  if (r === "urgent") return "SUGGESTION SUB.";
  if (r === "compensate") return "COMPENSÉ";
  if (r === "watch")  return "SURVEILLANCE";
  return "OPTIMAL";
}
function playerMetric(p: typeof PHYSICAL_SPLITS_METZ[0]): string {
  const r = playerRisk(p);
  if (r === "compensate") return "Utilité tactique ↑";
  if (r === "urgent") {
    const duelRate = p.duelsTotal > 0 ? Math.round((p.duelsWon / p.duelsTotal) * 100) : 100;
    return duelRate < 40 ? "Impact duels chute" : "Épuisement/Invisibilité";
  }
  return `${(p.minutesPlayed / 90 * 10.2).toFixed(1)} km · ${p.touchesDangerous} touches box`;
}


const RISK_COLOR: Record<Risk | "compensate", string> = { urgent: "#ef4444", watch: "#f59e0b", ok: "#22c55e", compensate: "#3b82f6" };


// ─── Tactique data ─────────────────────────────────────────────────────────────

function zoneCount(players: TrackingPlayer[]) {
  const out = players.filter(p => p.position !== "GB");
  return {
    gauche: out.filter(p => p.x < 0.33).length,
    centre: out.filter(p => p.x >= 0.33 && p.x <= 0.67).length,
    droite: out.filter(p => p.x > 0.67).length,
  };
}
const homeZ = zoneCount(TRACKING_FRAME.homePlayers);
const awayZ = zoneCount(TRACKING_FRAME.awayPlayers);
const underloadSide = homeZ.droite < awayZ.droite ? "droit" : homeZ.gauche < awayZ.gauche ? "gauche" : null;

const awayShots = INSIGHT_SHOTS.filter(s => s.team === "away");
const homeShots = INSIGHT_SHOTS.filter(s => s.team === "home");
const homeXg = homeShots.reduce((s, sh) => s + sh.xG, 0);
const awayXg = awayShots.reduce((s, sh) => s + sh.xG, 0);
const avgDefDist = awayShots.length ? awayShots.reduce((s, sh) => s + sh.shooterDefDist, 0) / awayShots.length : 0;
const zeroDefShots = awayShots.filter(s => s.numDefGoalside === 0).length;

// ─── Pitch constants ──────────────────────────────────────────────────────────

const PW = 320; const PH = 470; const PAD = 13;
function px(rx: number) { return PAD + rx * (PW - 2 * PAD); }
function py(ry: number) { return PAD + ry * (PH - 2 * PAD); }

function speedRingColor(delta: number) {
  if (delta > 0.022) return "#ef4444";
  if (delta > 0.012) return "#f59e0b";
  if (delta > 0.005) return "#22c55e";
  return "transparent";
}

// ─── Animated Pitch ───────────────────────────────────────────────────────────

function AnimatedPitch() {
  const [homePos, setHomePos] = useState<Pos[]>(HOME_ORIGIN.map(p => ({ ...p })));
  const [awayPos, setAwayPos] = useState<Pos[]>(AWAY_ORIGIN.map(p => ({ ...p })));
  const [ballPos, setBallPos] = useState<Pos>({ x: TRACKING_FRAME.ball.x, y: TRACKING_FRAME.ball.y });
  const [ballTrail, setBallTrail] = useState<Pos[]>([]);
  const [prevHome, setPrevHome] = useState<Pos[]>(HOME_ORIGIN.map(p => ({ ...p })));
  const [prevAway, setPrevAway] = useState<Pos[]>(AWAY_ORIGIN.map(p => ({ ...p })));
  const [prevBall, setPrevBall] = useState<Pos>({ x: TRACKING_FRAME.ball.x, y: TRACKING_FRAME.ball.y });

  const kickTimer  = useRef(10);
  const kickTarget = useRef<Pos>({ x: TRACKING_FRAME.ball.x, y: TRACKING_FRAME.ball.y });
  const ballRef    = useRef<Pos>({ x: TRACKING_FRAME.ball.x, y: TRACKING_FRAME.ball.y });

  useEffect(() => {
    const id = setInterval(() => {
      // Players drift around their origin
      setHomePos(prev => {
        const next = prev.map((pos, i) => drift(pos, HOME_ORIGIN[i], WANDER[i] ?? 0.02));
        setPrevHome(prev);
        return next;
      });
      setAwayPos(prev => {
        const next = prev.map((pos, i) => drift(pos, AWAY_ORIGIN[i], WANDER[i] ?? 0.02));
        setPrevAway(prev);
        return next;
      });

      // Ball: drift toward kick target, new kick periodically
      kickTimer.current--;
      if (kickTimer.current <= 0) {
        kickTimer.current = Math.floor(Math.random() * 18) + 8;
        kickTarget.current = {
          x: clamp(ballRef.current.x + (Math.random() - 0.5) * 0.35, 0.08, 0.92),
          y: clamp(ballRef.current.y + (Math.random() - 0.5) * 0.28, 0.08, 0.92),
        };
      }
      const isKicking = kickTimer.current > (kickTimer.current < 5 ? 1 : 4);
      const spd = isKicking ? 0.09 : 0.02;
      const bdx = (kickTarget.current.x - ballRef.current.x) * spd + (Math.random() - 0.5) * 0.004;
      const bdy = (kickTarget.current.y - ballRef.current.y) * spd + (Math.random() - 0.5) * 0.004;
      const newBall: Pos = { x: clamp(ballRef.current.x + bdx, 0.05, 0.95), y: clamp(ballRef.current.y + bdy, 0.05, 0.95) };

      setBallTrail(t => [{ ...ballRef.current }, ...t].slice(0, 7));
      setPrevBall({ ...ballRef.current });
      setBallPos(newBall);
      ballRef.current = newBall;
    }, 110);
    return () => clearInterval(id);
  }, []);

  const stripeW = (PW - 2 * PAD) / 10;

  return (
    <svg width={PW} height={PH} style={{ display: "block", borderRadius: 10, overflow: "hidden" }}>
      {/* Grass */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={PAD + i * stripeW} y={PAD} width={stripeW} height={PH - 2 * PAD}
          fill={i % 2 === 0 ? "#0e4a1c" : "#0c4119"} />
      ))}
      {/* Lines */}
      <rect x={PAD} y={PAD} width={PW - 2 * PAD} height={PH - 2 * PAD}
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      <line x1={PAD} y1={PH / 2} x2={PW - PAD} y2={PH / 2} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <circle cx={PW / 2} cy={PH / 2} r={36} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <circle cx={PW / 2} cy={PH / 2} r={2} fill="rgba(255,255,255,0.4)" />
      {/* Penalty areas */}
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PH - PAD - (PH - 2 * PAD) * 0.20}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PAD}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {/* Goals */}
      <rect x={PAD + (PW - 2 * PAD) * 0.42} y={PAD - 3} width={(PW - 2 * PAD) * 0.16} height={5}
        fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <rect x={PAD + (PW - 2 * PAD) * 0.42} y={PH - PAD - 2} width={(PW - 2 * PAD) * 0.16} height={5}
        fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

      {/* Ball trail */}
      {ballTrail.map((t, i) => (
        <circle key={i} cx={px(t.x)} cy={py(t.y)} r={3 - i * 0.3}
          fill="white" opacity={(0.55 - i * 0.07)} />
      ))}

      {/* Players */}
      {[
        ...homePos.map((pos, i) => ({ pos, prev: prevHome[i], p: TRACKING_FRAME.homePlayers[i], isHome: true })),
        ...awayPos.map((pos, i) => ({ pos, prev: prevAway[i], p: TRACKING_FRAME.awayPlayers[i], isHome: false })),
      ].map(({ pos, prev, p, isHome }) => {
        const delta = Math.sqrt((pos.x - prev.x) ** 2 + (pos.y - prev.y) ** 2);
        const ringColor = speedRingColor(delta);
        const R = 11;
        return (
          <g key={`${isHome}-${p.number}`}
            style={{ transform: `translate(${px(pos.x)}px, ${py(pos.y)}px)`, transition: "transform 0.1s linear" }}>
            {ringColor !== "transparent" && (
              <circle cx={0} cy={0} r={R + 5} fill="none" stroke={ringColor} strokeWidth={1.5} opacity={0.6} />
            )}
            <circle cx={1} cy={1} r={R} fill="rgba(0,0,0,0.3)" />
            <circle cx={0} cy={0} r={R}
              fill={isHome ? "var(--color-primary-400)" : "#1d2d44"}
              stroke={isHome ? "rgba(255,255,255,0.5)" : "rgba(200,210,230,0.55)"}
              strokeWidth={1.5}
            />
            <text x={0} y={4} textAnchor="middle" fontSize={8} fontWeight={700} fill="white"
              style={{ userSelect: "none", pointerEvents: "none" }}>
              {p.number}
            </text>
          </g>
        );
      })}

      {/* Ball */}
      <g style={{ transform: `translate(${px(ballPos.x)}px, ${py(ballPos.y)}px)`, transition: "transform 0.08s linear" }}>
        <circle cx={0} cy={0} r={7} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
        <circle cx={0} cy={0} r={5} fill="white" stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
      </g>
    </svg>
  );
}

// ─── Left column: Physique summary ───────────────────────────────────────────

function PhysiqueColumn({ onDetailClick }: { onDetailClick: () => void }) {
  const sorted = [...PHYSICAL_SPLITS_METZ].sort((a, b) => {
    const o: Record<Risk, number> = { urgent: 0, watch: 1, compensate: 2, ok: 3 };

    return o[playerRisk(a)] - o[playerRisk(b)];
  });
  const urgents = sorted.filter(p => ["urgent", "compensate"].includes(playerRisk(p)));

  const watches = sorted.filter(p => playerRisk(p) === "watch");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "14px 12px 14px 16px", gap: 8, overflowY: "auto" }} className="custom-scrollbar">

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-400)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Physique</span>
        <button onClick={onDetailClick} style={{
          fontSize: 9, fontWeight: 600, color: "var(--color-neutral-600)",
          background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
        }}>Détail →</button>
      </div>

      {/* Urgents */}
      {urgents.map(p => (
        <div key={p.playerId} style={{
          padding: "10px 12px", borderRadius: 8,
          background: playerRisk(p) === "compensate" ? "rgba(59,130,246,0.10)" : "rgba(239,68,68,0.10)",
          border: `1px solid ${playerRisk(p) === "compensate" ? "rgba(59,130,246,0.35)" : "rgba(239,68,68,0.35)"}`,
          borderLeft: `3px solid ${playerRisk(p) === "compensate" ? "#3b82f6" : "#ef4444"}`,
        }}>

          <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>#{p.number} · {p.position}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "white", lineHeight: 1.2 }}>{p.name}</div>
          <div style={{
            fontSize: 18, fontWeight: 900,
            color: playerRisk(p) === "compensate" ? "#3b82f6" : "#ef4444",
            lineHeight: 1.2, marginTop: 2
          }}>
            {playerAction(p)}
          </div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-400)", marginTop: 2 }}>{playerMetric(p)}</div>

        </div>
      ))}

      {/* Watches */}
      {watches.slice(0, 2).map(p => (
        <div key={p.playerId} style={{
          padding: "8px 10px", borderRadius: 8,
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.28)",
          borderLeft: "3px solid #f59e0b",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{p.name}</div>
            <div style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>{playerMetric(p)}</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#f59e0b", flexShrink: 0 }}>Surv.</div>
        </div>
      ))}
      {watches.length > 2 && (
        <div style={{ fontSize: 9, color: "var(--color-neutral-600)", textAlign: "center" }}>
          +{watches.length - 2} en surveillance
        </div>
      )}

      {/* Substitution */}
      {urgents.length > 0 && (
        <div style={{
          padding: "10px 12px", borderRadius: 8, marginTop: 4,
          background: "var(--color-neutral-900)", border: "1px solid var(--color-neutral-800)",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-400)", marginBottom: 4 }}>Remplacement suggéré</div>
          <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>
            Sortir : {urgents[0]?.name}
          </div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-600)", marginBottom: 3 }}>Disponibles :</div>
          {BENCH_METZ.map(b => (
            <div key={b.number} style={{ fontSize: 10, color: "var(--color-neutral-400)" }}>
              #{b.number} {b.name} · {b.position}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Right column: Tactique summary ──────────────────────────────────────────

function TactiqueColumn({ onDetailClick }: { onDetailClick: (tab: string) => void }) {
  const xgOk      = homeXg > awayXg;
  const blocOk    = !underloadSide;
  const pressOk   = avgDefDist <= 5.5 && zeroDefShots < 2;

  const cards = [
    {
      label: "Plan de jeu",
      ok: xgOk,
      headline: `${homeXg.toFixed(2)} xG vs ${awayXg.toFixed(2)}`,
      detail: xgOk ? "Vous dominez. Continuez." : "Paris génère plus de danger.",
      detailTab: "plan",
    },
    {
      label: "Bloc & Espaces",
      ok: blocOk,
      headline: blocOk ? "Couloirs couverts" : `Couloir ${underloadSide} : sous-nb`,
      detail: blocOk ? "Équilibre respecté." : `Paris en supériorité côté ${underloadSide}.`,
      detailTab: "bloc",
    },
    {
      label: "Pressing",
      ok: pressOk,
      headline: pressOk ? `${avgDefDist.toFixed(1)}m moy.` : `${zeroDefShots} tirs sans déf.`,
      detail: pressOk ? "Pression correcte." : "Pressing trop lâche sur tireur.",
      detailTab: "pressing",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "14px 16px 14px 12px", gap: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-400)", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>Tactique</div>
      {cards.map(c => {
        const col = c.ok ? "#22c55e" : "#ef4444";
        return (
          <div key={c.label} style={{
            flex: 1, padding: "12px 14px", borderRadius: 8,
            background: c.ok ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
            border: `1px solid ${c.ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.28)"}`,
            borderLeft: `4px solid ${col}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 0,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</span>
              <span style={{ fontSize: 10 }}>{c.ok ? "✓" : "⚠"}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: col, lineHeight: 1.2, marginTop: 6 }}>{c.headline}</div>
            <div style={{ fontSize: 10, color: "var(--color-neutral-300)", lineHeight: 1.4, marginTop: 4 }}>{c.detail}</div>
            <button onClick={() => onDetailClick(c.detailTab)} style={{
              marginTop: 6, fontSize: 9, fontWeight: 600, color: "var(--color-neutral-600)",
              background: "none", border: "none", cursor: "pointer", textAlign: "left", textDecoration: "underline",
            }}>Voir détail →</button>
          </div>
        );
      })}

      {/* Flux Insight 2S */}
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: "var(--color-neutral-600)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Flux Insight 2S</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: 10, borderLeft: "2px solid #ef4444", paddingLeft: 8, background: "rgba(255,255,255,0.02)", padding: "4px 8px" }}>
            <span style={{ color: "var(--color-neutral-500)" }}>71'02"</span> · Perte de balle haute <span style={{ color: "white", fontWeight: 700 }}>(G. Hein)</span>
          </div>
          <div style={{ fontSize: 10, borderLeft: "2px solid #22c55e", paddingLeft: 8, background: "rgba(255,255,255,0.02)", padding: "4px 8px" }}>
            <span style={{ color: "var(--color-neutral-500)" }}>69'45"</span> · xG Tir Metz : <span style={{ color: "#22c55e", fontWeight: 800 }}>0.42</span> <span style={{ color: "white" }}>(Kvilitaia)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

interface LiveTabVueProps {
  onNavigate: (tab: string) => void;
}

export function LiveTabVue({ onNavigate }: LiveTabVueProps) {
  return (
    <div style={{ height: "100%", display: "flex", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* Left: Physique summary */}
      <div style={{
        width: 210, flexShrink: 0,
        borderRight: "1px solid var(--color-neutral-800)",
        overflow: "hidden",
      }}>
        <PhysiqueColumn onDetailClick={() => onNavigate("fatigue")} />
      </div>

      {/* Centre: Animated pitch */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 8px",
        gap: 6,
        minWidth: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: PW }}>
          <span style={{ fontSize: 8, color: "var(--color-neutral-600)", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#1d2d44", border: "1px solid #94a3b8" }} />
            Paris FC
          </span>
          <span style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>tracking-fast · live</span>
        </div>

        <AnimatedPitch />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: PW }}>
          <span style={{ fontSize: 8, color: "var(--color-primary-400)", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--color-primary-400)" }} />
            FC Metz
          </span>
          {/* Speed legend */}
          <div style={{ display: "flex", gap: 8 }}>
            {[{ color: "#ef4444", label: "Sprint" }, { color: "#f59e0b", label: "Rapide" }, { color: "#22c55e", label: "Course" }].map(z => (
              <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "transparent", border: `1.5px solid ${z.color}` }} />
                <span style={{ fontSize: 7, color: "var(--color-neutral-600)" }}>{z.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Tactique summary */}
      <div style={{
        width: 210, flexShrink: 0,
        borderLeft: "1px solid var(--color-neutral-800)",
        overflow: "hidden",
      }}>
        <TactiqueColumn onDetailClick={onNavigate} />
      </div>
    </div>
  );
}
