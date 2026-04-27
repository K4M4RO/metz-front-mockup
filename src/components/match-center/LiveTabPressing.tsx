"use client";

import { PHYSICAL_SPLITS_METZ, INSIGHT_SHOTS } from "./live-mock";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defDistColor(d: number) {
  if (d <= 3)  return "#22c55e";   // pression efficace
  if (d <= 6)  return "#f59e0b";   // acceptable
  return "#ef4444";                // trop loin
}

function defDistLabel(d: number) {
  if (d <= 3)  return "Pression efficace";
  if (d <= 6)  return "Pression acceptable";
  return "Défenseur trop loin";
}

function pressEffColor(pct: number) {
  if (pct >= 5)  return "#22c55e";
  if (pct >= 3)  return "#f59e0b";
  return "#ef4444";
}

// ─── Shot defense-distance row ────────────────────────────────────────────────

function ShotRow({ shot, index }: { shot: typeof INSIGHT_SHOTS[0]; index: number }) {
  const isAway   = shot.team === "away";
  const color    = defDistColor(shot.shooterDefDist);
  const isGoal   = shot.outcome === "goal";
  const outcomeColors: Record<string, string> = {
    goal: "#ef4444", saved: "#22c55e", blocked: "#f59e0b", wide: "var(--color-neutral-500)",
  };
  const outcomeLabels: Record<string, string> = {
    goal: "BUT", saved: "Arrêt", blocked: "Contré", wide: "À côté",
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "22px 60px 110px 72px 72px 80px",
      alignItems: "center",
      gap: 10,
      padding: "7px 16px",
      borderBottom: "1px solid var(--color-neutral-800)",
      background: isGoal && isAway ? "rgba(239,68,68,0.05)" : "transparent",
    }}>
      {/* Minute */}
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)" }}>{shot.minute}'</div>

      {/* Team badge */}
      <div style={{
        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, textAlign: "center",
        background: isAway ? "rgba(228,228,231,0.08)" : "rgba(var(--primary-rgb),0.12)",
        color: isAway ? "var(--color-neutral-400)" : "var(--color-primary-400)",
      }}>
        {isAway ? "Paris FC" : "FC Metz"}
      </div>

      {/* Shooter */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-neutral-200)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {shot.playerName}
      </div>

      {/* Def distance */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: isAway ? color : "var(--color-neutral-600)" }}>
          {shot.shooterDefDist.toFixed(1)}m
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>{isAway ? defDistLabel(shot.shooterDefDist) : "tir Metz"}</div>
      </div>

      {/* Num def goalside */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: isAway && shot.numDefGoalside === 0 ? "#ef4444" : "var(--color-neutral-400)" }}>
          {shot.numDefGoalside}
        </div>
        <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>déf. côté but</div>
      </div>

      {/* Outcome */}
      <div style={{
        fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 5, textAlign: "center",
        background: `${outcomeColors[shot.outcome]}22`,
        color: outcomeColors[shot.outcome],
        border: `1px solid ${outcomeColors[shot.outcome]}44`,
      }}>
        {outcomeLabels[shot.outcome]}
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LiveTabPressing() {
  // KPI: avg shooterDefDist on away shots (= Metz defense closeness)
  const awayShots = INSIGHT_SHOTS.filter(s => s.team === "away");
  const avgDefDist = awayShots.reduce((s, sh) => s + sh.shooterDefDist, 0) / (awayShots.length || 1);
  const zeroDefShots = awayShots.filter(s => s.numDefGoalside === 0).length;

  // Per-player pressing: % time sprinting out of possession + sprint count out of possession
  const pressing = [...PHYSICAL_SPLITS_METZ]
    .filter(p => p.minutesPlayed > 0)
    .sort((a, b) => b.percentTimeSprintingOutPossession - a.percentTimeSprintingOutPossession);

  // Pressing efficiency: sprints OutPoss / total recoveries (hardcoded ratio for mockup)
  const teamPressEff = 34; // % — mockup value: 34% of pressing sprints lead to recovery

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* KPI bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0, borderBottom: "1px solid var(--color-neutral-800)", flexShrink: 0,
        background: "var(--color-neutral-900)",
      }}>
        {[
          {
            label: "Dist. déf. moy. (tirs adverses)",
            value: `${avgDefDist.toFixed(1)}m`,
            sub: avgDefDist > 6 ? "⚠ Pression insuffisante" : "Pression correcte ✓",
            alert: avgDefDist > 6,
          },
          {
            label: "Tirs adverses sans défenseur",
            value: `${zeroDefShots} / ${awayShots.length}`,
            sub: zeroDefShots >= 2 ? "⚠ Situations dangereuses" : "Contrôlé ✓",
            alert: zeroDefShots >= 2,
          },
          {
            label: "Efficacité du pressing",
            value: `${teamPressEff}%`,
            sub: "Sprints sans ballon → récupération",
            alert: teamPressEff < 35,
          },
          {
            label: "% temps sprint sans ballon (éq.)",
            value: `${(pressing.reduce((s, p) => s + p.percentTimeSprintingOutPossession, 0) / pressing.length).toFixed(1)}%`,
            sub: "Moyenne des joueurs Metz sur la mi-temps",
            alert: false,
          },
        ].map((kpi, i) => (
          <div key={i} style={{
            padding: "10px 16px",
            borderRight: i < 3 ? "1px solid var(--color-neutral-800)" : "none",
          }}>
            <div style={{ fontSize: 9, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{kpi.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: kpi.alert ? "#ef4444" : "var(--color-neutral-100)", lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: 9, color: kpi.alert ? "rgba(239,68,68,0.7)" : "var(--color-neutral-500)", marginTop: 3 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Per-player pressing intensity */}
        <div style={{
          width: 300, flexShrink: 0, borderRight: "1px solid var(--color-neutral-800)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{
            padding: "8px 16px", borderBottom: "1px solid var(--color-neutral-800)",
            fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)",
            textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0,
          }}>
            Intensité pressing — OutPossession
          </div>
          <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
            {pressing.map(p => {
              const pct = p.percentTimeSprintingOutPossession;
              const color = pressEffColor(pct);
              const maxPct = 7;
              return (
                <div key={p.playerId} style={{
                  padding: "8px 14px", borderBottom: "1px solid var(--color-neutral-800)",
                  display: "grid", gridTemplateColumns: "22px 110px 1fr 50px", alignItems: "center", gap: 10,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-600)", textAlign: "center" }}>{p.number}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-neutral-200)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>{p.position} · {p.countSprintingOutPossession} spr/sans bal.</div>
                  </div>
                  <div>
                    <div style={{ height: 5, background: "var(--color-neutral-800)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(pct / maxPct * 100, 100)}%`, background: color, borderRadius: 3 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11, fontWeight: 800, color }}>
                    {pct.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "6px 14px", borderTop: "1px solid var(--color-neutral-800)", flexShrink: 0 }}>
            <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>physical-summary · percentTimeSprintingOutPossession</div>
          </div>
        </div>

        {/* Right: Shot defense distance list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            padding: "8px 16px", borderBottom: "1px solid var(--color-neutral-800)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Pression sur le tireur — insight feed
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {[{ label: "≤ 3m", color: "#22c55e", desc: "Efficace" }, { label: "3–6m", color: "#f59e0b", desc: "Acceptable" }, { label: "> 6m", color: "#ef4444", desc: "Trop loin" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 8, color: "var(--color-neutral-400)" }}>{l.label} — {l.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "22px 60px 110px 72px 72px 80px",
            gap: 10, padding: "6px 16px",
            background: "var(--color-neutral-900)", borderBottom: "1px solid var(--color-neutral-800)", flexShrink: 0,
          }}>
            {["Min", "Équipe", "Tireur", "Dist. déf.", "Déf./But", "Résultat"].map((h, i) => (
              <div key={i} style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: i >= 3 ? "center" : "left" }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
            {INSIGHT_SHOTS.map((shot, i) => <ShotRow key={shot.id} shot={shot} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
