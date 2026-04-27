"use client";

import { INSIGHT_SHOTS, type InsightShot } from "./live-mock";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAD = 14;
const PW  = 340;
const PH  = 240;

function px(rx: number) { return PAD + rx * (PW - 2 * PAD); }
function py(ry: number) { return PAD + ry * (PH - 2 * PAD); }

function xgColor(xg: number) {
  if (xg >= 0.35) return "#ef4444";
  if (xg >= 0.15) return "#f59e0b";
  return "#3b82f6";
}

function outcomeIcon(o: InsightShot["outcome"]) {
  if (o === "goal") return "⚽";
  if (o === "saved") return "🧤";
  if (o === "blocked") return "🔶";
  return "↗";
}

// ─── Shot map (horizontal pitch, home defends left, attacks right) ─────────────

function ShotMap() {
  const stripeW = (PW - 2 * PAD) / 10;

  return (
    <svg width={PW} height={PH} style={{ display: "block", borderRadius: 8, overflow: "hidden" }}>
      {/* Grass */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i}
          x={PAD + i * stripeW} y={PAD}
          width={stripeW} height={PH - 2 * PAD}
          fill={i % 2 === 0 ? "#0f4d1f" : "#0d4520"} />
      ))}

      {/* Pitch outline */}
      <rect x={PAD} y={PAD} width={PW - 2 * PAD} height={PH - 2 * PAD}
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />

      {/* Halfway line */}
      <line x1={PAD} y1={PH / 2} x2={PW - PAD} y2={PH / 2}
        stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <circle cx={PW / 2} cy={PH / 2} r={28}
        fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />

      {/* Penalty areas (top = away goal, bottom = home goal) */}
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PAD}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.24}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PH - PAD - (PH - 2 * PAD) * 0.24}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.24}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

      {/* Goal indicators */}
      <rect x={PAD + (PW - 2 * PAD) * 0.42} y={PAD - 3} width={(PW - 2 * PAD) * 0.16} height={6}
        fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <rect x={PAD + (PW - 2 * PAD) * 0.42} y={PH - PAD - 3} width={(PW - 2 * PAD) * 0.16} height={6}
        fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

      {/* Shots */}
      {INSIGHT_SHOTS.map(shot => {
        const cx = px(shot.shotX);
        const cy = py(shot.shotY);
        const r  = 5 + shot.xG * 16;
        const isHome = shot.team === "home";
        const isGoal = shot.outcome === "goal";
        const color  = isHome ? "var(--color-primary-400)" : "#94a3b8";
        const strokeColor = isGoal ? "#ffffff" : color;

        return (
          <g key={shot.id}>
            <circle cx={cx} cy={cy} r={r}
              fill={`${color}30`}
              stroke={strokeColor}
              strokeWidth={isGoal ? 2 : 1.5}
              strokeDasharray={isGoal ? "none" : "3 2"}
            />
            {isGoal && (
              <text x={cx} y={cy + 4} textAnchor="middle"
                fontSize={9} fill="white"
                style={{ userSelect: "none" }}>⚽</text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <text x={PAD + 4} y={PAD + 12} fontSize={8} fill="var(--color-primary-400)" style={{ userSelect: "none" }}>Metz (attaque ↓)</text>
      <text x={PW - PAD - 4} y={PH - PAD - 6} fontSize={8} fill="#94a3b8" textAnchor="end" style={{ userSelect: "none" }}>Paris FC (attaque ↑)</text>
    </svg>
  );
}

// ─── Shot list row ────────────────────────────────────────────────────────────

function ShotDetailRow({ shot }: { shot: InsightShot }) {
  const isAway = shot.team === "away";
  const isGoal = shot.outcome === "goal";
  const isCritical = isAway && shot.numDefGoalside === 0;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "22px 60px 100px 48px 60px 56px 56px 70px",
      alignItems: "center",
      gap: 8,
      padding: "6px 16px",
      borderBottom: "1px solid var(--color-neutral-800)",
      background: isCritical ? "rgba(239,68,68,0.04)" : "transparent",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)" }}>{shot.minute}'</div>
      <div style={{
        fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, textAlign: "center",
        background: isAway ? "rgba(228,228,231,0.08)" : "rgba(var(--primary-rgb),0.12)",
        color: isAway ? "var(--color-neutral-400)" : "var(--color-primary-400)",
      }}>
        {isAway ? "Paris FC" : "Metz"}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-neutral-200)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {shot.playerName}
      </div>
      {/* xG */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: xgColor(shot.xG) }}>{shot.xG.toFixed(2)}</div>
        <div style={{ fontSize: 7, color: "var(--color-neutral-600)" }}>xG</div>
      </div>
      {/* Distance */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-neutral-300)" }}>{shot.goalDist.toFixed(1)}m</div>
        <div style={{ fontSize: 7, color: "var(--color-neutral-600)" }}>au but</div>
      </div>
      {/* numDefGoalside */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: isAway && shot.numDefGoalside === 0 ? "#ef4444" : "var(--color-neutral-400)" }}>
          {shot.numDefGoalside}
        </div>
        <div style={{ fontSize: 7, color: "var(--color-neutral-600)" }}>déf./but</div>
      </div>
      {/* keeperInitialDist */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: isAway && shot.keeperInitialDist > 8 ? "#ef4444" : "var(--color-neutral-400)" }}>
          {shot.keeperInitialDist.toFixed(1)}m
        </div>
        <div style={{ fontSize: 7, color: "var(--color-neutral-600)" }}>gard. dist.</div>
      </div>
      {/* Outcome */}
      <div style={{ textAlign: "center", fontSize: 11 }}>
        {outcomeIcon(shot.outcome)} <span style={{ fontSize: 9, color: isGoal ? "#ef4444" : "var(--color-neutral-500)" }}>
          {shot.outcome === "goal" ? "BUT" : shot.outcome === "saved" ? "Arrêt" : shot.outcome === "blocked" ? "Contré" : "À côté"}
        </span>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LiveTabPlanJeu() {
  const homeShots = INSIGHT_SHOTS.filter(s => s.team === "home");
  const awayShots = INSIGHT_SHOTS.filter(s => s.team === "away");
  const homeXg    = homeShots.reduce((s, sh) => s + sh.xG, 0);
  const awayXg    = awayShots.reduce((s, sh) => s + sh.xG, 0);
  const maxXg     = Math.max(homeXg, awayXg, 1);

  // Danger metric: away shots with 0 defenders between shooter and goal
  const dangerShots = awayShots.filter(s => s.numDefGoalside === 0);
  const highKeeperDist = awayShots.filter(s => s.keeperInitialDist > 8);

  const score   = "1 – 1";
  const xgDominant = homeXg > awayXg;
  const xgMsg   = xgDominant
    ? `Metz domine en xG (${homeXg.toFixed(2)} vs ${awayXg.toFixed(2)}) — le score flatte Paris FC. Structure offensive fonctionnelle.`
    : `Paris FC crée plus de danger (${awayXg.toFixed(2)} xG vs ${homeXg.toFixed(2)}) malgré le score. Attention aux transitions.`;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* xG comparison banner */}
      <div style={{
        padding: "12px 24px", borderBottom: "1px solid var(--color-neutral-800)",
        background: "var(--color-neutral-900)", flexShrink: 0,
        display: "flex", gap: 24, alignItems: "center",
      }}>
        {/* xG visual */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginBottom: 2 }}>FC Metz</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: xgDominant ? "#22c55e" : "var(--color-primary-400)", lineHeight: 1 }}>{homeXg.toFixed(2)}</div>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>xG</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 12, borderRadius: 6, background: "var(--color-neutral-800)", overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${(homeXg / (homeXg + awayXg)) * 100}%`, background: xgDominant ? "#22c55e" : "var(--color-primary-400)", borderRadius: "6px 0 0 6px" }} />
              <div style={{ flex: 1, background: "#475569", borderRadius: "0 6px 6px 0" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ fontSize: 11, color: "var(--color-neutral-500)", textAlign: "center" }}>Score : {score}</div>
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginBottom: 2 }}>Paris FC</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: !xgDominant ? "#ef4444" : "var(--color-neutral-400)", lineHeight: 1 }}>{awayXg.toFixed(2)}</div>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>xG</div>
          </div>
        </div>

        {/* Message */}
        <div style={{
          flex: 1, padding: "10px 14px", borderRadius: 8, maxWidth: 340,
          background: xgDominant ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${xgDominant ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          borderLeft: `3px solid ${xgDominant ? "#22c55e" : "#ef4444"}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: xgDominant ? "#22c55e" : "#ef4444", marginBottom: 4 }}>
            {xgDominant ? "✓ Plan de jeu efficace" : "⚠ Vigilance défensive"}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-300)", lineHeight: 1.5 }}>{xgMsg}</div>
        </div>

        {/* Danger metrics */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            padding: "8px 12px", borderRadius: 8,
            background: dangerShots.length >= 2 ? "rgba(239,68,68,0.08)" : "var(--color-neutral-800)",
            border: `1px solid ${dangerShots.length >= 2 ? "rgba(239,68,68,0.3)" : "var(--color-neutral-700)"}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: dangerShots.length >= 2 ? "#ef4444" : "var(--color-neutral-300)" }}>{dangerShots.length}</div>
            <div style={{ fontSize: 8, color: "var(--color-neutral-500)" }}>Tirs adverse<br/>sans déf.</div>
          </div>
          <div style={{
            padding: "8px 12px", borderRadius: 8,
            background: highKeeperDist.length >= 1 ? "rgba(245,158,11,0.08)" : "var(--color-neutral-800)",
            border: `1px solid ${highKeeperDist.length >= 1 ? "rgba(245,158,11,0.3)" : "var(--color-neutral-700)"}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: highKeeperDist.length >= 1 ? "#f59e0b" : "var(--color-neutral-300)" }}>{highKeeperDist.length}</div>
            <div style={{ fontSize: 8, color: "var(--color-neutral-500)" }}>Gardien<br/>mal placé (&gt;8m)</div>
          </div>
        </div>
      </div>

      {/* Body: shot map + shot list */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Shot map */}
        <div style={{
          width: 370, flexShrink: 0, borderRight: "1px solid var(--color-neutral-800)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "flex-start" }}>
            Carte des tirs
          </div>
          <ShotMap />
          <div style={{ display: "flex", gap: 16, alignSelf: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "transparent", border: "2px dashed var(--color-primary-400)" }} />
              <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>Tir Metz</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "transparent", border: "2px dashed #94a3b8" }} />
              <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>Tir Paris</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, color: "var(--color-neutral-400)" }}>⚽ = But · taille ∝ xG</span>
            </div>
          </div>
        </div>

        {/* Shot list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "22px 60px 100px 48px 60px 56px 56px 70px",
            gap: 8, padding: "7px 16px",
            background: "var(--color-neutral-900)", borderBottom: "1px solid var(--color-neutral-800)", flexShrink: 0,
          }}>
            {["Min", "Équipe", "Tireur", "xG", "Dist.", "Déf./But", "Gardien", "Résultat"].map((h, i) => (
              <div key={i} style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: i >= 3 ? "center" : "left" }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
            {INSIGHT_SHOTS.map(shot => <ShotDetailRow key={shot.id} shot={shot} />)}
          </div>

          {/* Totals */}
          <div style={{
            padding: "8px 16px", borderTop: "1px solid var(--color-neutral-800)",
            display: "flex", gap: 20, flexShrink: 0,
          }}>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>
              Metz : <strong style={{ color: "var(--color-primary-400)" }}>{homeShots.length} tirs</strong> · xG total <strong style={{ color: "#22c55e" }}>{homeXg.toFixed(2)}</strong>
            </div>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>
              Paris FC : <strong style={{ color: "var(--color-neutral-300)" }}>{awayShots.length} tirs</strong> · xG total <strong style={{ color: !xgDominant ? "#ef4444" : "var(--color-neutral-400)" }}>{awayXg.toFixed(2)}</strong>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 8, color: "var(--color-neutral-600)" }}>
              Source · insight feed · 2sMarking.xG · numDefGoalside · keeperInitialDist
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
