"use client";

import { TRACKING_FRAME, INSIGHT_SHOTS, PHYSICAL_SPLITS_METZ } from "./live-mock";

// ─── Derived data ─────────────────────────────────────────────────────────────

function zoneCount(players: typeof TRACKING_FRAME.homePlayers) {
  const outfield = players.filter(p => p.position !== "GB");
  return {
    gauche: outfield.filter(p => p.x < 0.33).length,
    centre: outfield.filter(p => p.x >= 0.33 && p.x <= 0.67).length,
    droite: outfield.filter(p => p.x > 0.67).length,
  };
}

const homeZ = zoneCount(TRACKING_FRAME.homePlayers);
const awayZ = zoneCount(TRACKING_FRAME.awayPlayers);
const blocsAlert = (homeZ.gauche < awayZ.gauche || homeZ.droite < awayZ.droite);
const underloadZone = homeZ.droite < awayZ.droite ? "droit"
  : homeZ.gauche < awayZ.gauche ? "gauche"
  : null;

const homeShots = INSIGHT_SHOTS.filter(s => s.team === "home");
const awayShots = INSIGHT_SHOTS.filter(s => s.team === "away");
const homeXg    = homeShots.reduce((s, sh) => s + sh.xG, 0);
const awayXg    = awayShots.reduce((s, sh) => s + sh.xG, 0);
const xgDominant = homeXg > awayXg;

const awayDefDists = awayShots.map(s => s.shooterDefDist);
const avgDefDist   = awayDefDists.length
  ? awayDefDists.reduce((a, b) => a + b) / awayDefDists.length : 0;
const zeroDefShots = awayShots.filter(s => s.numDefGoalside === 0).length;
const pressingOk   = avgDefDist <= 5.5 && zeroDefShots < 2;

// ─── Pitch constants ──────────────────────────────────────────────────────────

const PW  = 260;
const PH  = 380;
const PAD = 12;

function px(rx: number) { return PAD + rx * (PW - 2 * PAD); }
function py(ry: number) { return PAD + ry * (PH - 2 * PAD); }

// ─── Compact Pitch ────────────────────────────────────────────────────────────

function TactiquePitch() {
  const home = TRACKING_FRAME.homePlayers;
  const away = TRACKING_FRAME.awayPlayers;
  const stripeW = (PW - 2 * PAD) / 10;

  return (
    <svg width={PW} height={PH} style={{ display: "block", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
      {/* Grass */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={PAD + i * stripeW} y={PAD} width={stripeW} height={PH - 2 * PAD}
          fill={i % 2 === 0 ? "#0f4d1f" : "#0d4520"} />
      ))}

      {/* Zone overload highlights */}
      {homeZ.droite < awayZ.droite && (
        <rect x={px(0.67)} y={py(0)} width={px(1) - px(0.67)} height={py(1) - py(0)}
          fill="rgba(239,68,68,0.10)" />
      )}
      {homeZ.gauche < awayZ.gauche && (
        <rect x={px(0)} y={py(0)} width={px(0.33) - px(0)} height={py(1) - py(0)}
          fill="rgba(239,68,68,0.10)" />
      )}

      {/* Zone dividers */}
      <line x1={px(0.33)} y1={py(0)} x2={px(0.33)} y2={py(1)}
        stroke="rgba(255,255,255,0.10)" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={px(0.67)} y1={py(0)} x2={px(0.67)} y2={py(1)}
        stroke="rgba(255,255,255,0.10)" strokeWidth={1} strokeDasharray="4 4" />

      {/* Pitch lines */}
      <rect x={PAD} y={PAD} width={PW - 2 * PAD} height={PH - 2 * PAD}
        fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} />
      <line x1={PAD} y1={PH / 2} x2={PW - PAD} y2={PH / 2}
        stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <circle cx={PW / 2} cy={PH / 2} r={28}
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PH - PAD - (PH - 2 * PAD) * 0.20}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      <rect x={PAD + (PW - 2 * PAD) * 0.22} y={PAD}
        width={(PW - 2 * PAD) * 0.56} height={(PH - 2 * PAD) * 0.20}
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* Zone overload label */}
      {underloadZone === "droit" && (
        <>
          <text x={px(0.835)} y={py(0.12)} textAnchor="middle"
            fontSize={10} fontWeight={900} fill="#ef4444"
            style={{ userSelect: "none" }}>
            ⚠
          </text>
          <text x={px(0.835)} y={py(0.19)} textAnchor="middle"
            fontSize={8} fill="#ef4444"
            style={{ userSelect: "none" }}>
            {homeZ.droite}v{awayZ.droite}
          </text>
        </>
      )}
      {underloadZone === "gauche" && (
        <>
          <text x={px(0.165)} y={py(0.12)} textAnchor="middle"
            fontSize={10} fontWeight={900} fill="#ef4444"
            style={{ userSelect: "none" }}>
            ⚠
          </text>
          <text x={px(0.165)} y={py(0.19)} textAnchor="middle"
            fontSize={8} fill="#ef4444"
            style={{ userSelect: "none" }}>
            {homeZ.gauche}v{awayZ.gauche}
          </text>
        </>
      )}

      {/* Players */}
      {[...home.map(p => ({ p, isHome: true })), ...away.map(p => ({ p, isHome: false }))].map(({ p, isHome }) => {
        const cx = px(p.x);
        const cy = py(p.y);
        const R  = 9;
        return (
          <g key={`${isHome}-${p.number}`}>
            <circle cx={cx + 1} cy={cy + 1} r={R} fill="rgba(0,0,0,0.3)" />
            <circle cx={cx} cy={cy} r={R}
              fill={isHome ? "var(--color-primary-400)" : "#1E2A3A"}
              stroke={isHome ? "rgba(255,255,255,0.45)" : "rgba(228,228,231,0.5)"}
              strokeWidth={1.5} />
            <text x={cx} y={cy + 3.5} textAnchor="middle"
              fontSize={7} fontWeight={700} fill="white"
              style={{ pointerEvents: "none", userSelect: "none" }}>
              {p.number}
            </text>
          </g>
        );
      })}

      {/* Ball */}
      <circle
        cx={px(TRACKING_FRAME.ball.x)} cy={py(TRACKING_FRAME.ball.y)} r={4.5}
        fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth={1}
      />
    </svg>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  title, status, statusOk,
  headline, detail, action,
}: {
  title: string;
  status: string;
  statusOk: boolean;
  headline: string;
  detail: string;
  action?: string;
}) {
  const color  = statusOk ? "#22c55e" : "#ef4444";
  const bgCol  = statusOk ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)";
  const border = statusOk ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.3)";

  return (
    <div style={{
      flex: 1,
      padding: "16px 18px",
      background: bgCol,
      border: `1px solid ${border}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minHeight: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {title}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4,
          background: `${color}22`, color, border: `1px solid ${color}44`,
        }}>
          {status}
        </span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1.1 }}>
        {headline}
      </div>
      <div style={{ fontSize: 11, color: "var(--color-neutral-300)", lineHeight: 1.5 }}>
        {detail}
      </div>
      {action && (
        <div style={{ fontSize: 10, fontWeight: 700, color: statusOk ? "#22c55e" : "#f59e0b", marginTop: 2 }}>
          → {action}
        </div>
      )}
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LiveTabTactique() {
  const xgMsg = xgDominant
    ? `Metz crée ${homeXg.toFixed(2)} xG vs ${awayXg.toFixed(2)} pour Paris. Le score ne reflète pas la domination.`
    : `Paris génère plus de danger (${awayXg.toFixed(2)} xG). Attention aux transitions défensives.`;

  const blocMsg = blocsAlert
    ? `Couloir ${underloadZone} en sous-nombre. Paris exploite ce déséquilibre.`
    : `Bonne couverture des couloirs. Paris ne trouve pas d'espace.`;

  const pressMsg = pressingOk
    ? `Pression correcte sur les tireurs adverses (moy. ${avgDefDist.toFixed(1)}m).`
    : `Distance déf./tireur trop grande (${avgDefDist.toFixed(1)}m moy.). ${zeroDefShots} tirs sans défenseur côté but.`;

  return (
    <div style={{ height: "100%", display: "flex", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      {/* Pitch column */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 12px 16px 20px",
        gap: 8,
        borderRight: "1px solid var(--color-neutral-800)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: PW }}>
          <span style={{ fontSize: 8, color: "var(--color-neutral-600)", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#1E2A3A", border: "1px solid #94a3b8" }} />
            Paris FC
          </span>
          <span style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>tracking-fast</span>
        </div>

        <TactiquePitch />

        <div style={{ display: "flex", justifyContent: "flex-start", width: PW }}>
          <span style={{ fontSize: 8, color: "var(--color-primary-400)", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--color-primary-400)" }} />
            FC Metz
          </span>
        </div>

        {/* Zone legend */}
        <div style={{ width: PW, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {(["gauche", "centre", "droite"] as const).map(z => {
            const hm = homeZ[z]; const ha = awayZ[z]; const alert = ha > hm;
            return (
              <div key={z} style={{
                textAlign: "center", padding: "4px 8px", borderRadius: 6,
                background: alert ? "rgba(239,68,68,0.10)" : "var(--color-neutral-900)",
                border: `1px solid ${alert ? "rgba(239,68,68,0.3)" : "var(--color-neutral-800)"}`,
              }}>
                <div style={{ fontSize: 7, color: "var(--color-neutral-500)", textTransform: "capitalize" }}>{z}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: alert ? "#ef4444" : "var(--color-neutral-400)" }}>
                  {hm}<span style={{ fontSize: 9, color: "var(--color-neutral-600)", margin: "0 2px" }}>v</span>{ha}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary cards column */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        overflowY: "auto",
      }} className="custom-scrollbar">

        <SummaryCard
          title="Plan de jeu · xG"
          status={xgDominant ? "Efficace ✓" : "Attention ⚠"}
          statusOk={xgDominant}
          headline={`${homeXg.toFixed(2)} xG vs ${awayXg.toFixed(2)}`}
          detail={xgMsg}
          action={xgDominant
            ? "Maintenir la structure. Le but viendra."
            : "Recentrer le bloc. Limiter les transitions."}
        />

        <SummaryCard
          title="Bloc & Espaces · tracking"
          status={blocsAlert ? "Sous-nombre ⚠" : "Équilibré ✓"}
          statusOk={!blocsAlert}
          headline={blocsAlert ? `Couloir ${underloadZone} : ${underloadZone === "droit" ? homeZ.droite : homeZ.gauche}v${underloadZone === "droit" ? awayZ.droite : awayZ.gauche}` : "Couloirs couverts"}
          detail={blocMsg}
          action={blocsAlert
            ? `Décaler le milieu côté ${underloadZone}. Alerter le latéral.`
            : undefined}
        />

        <SummaryCard
          title="Pressing · Insight + Physique"
          status={pressingOk ? "Correct ✓" : "Insuffisant ⚠"}
          statusOk={pressingOk}
          headline={pressingOk ? `${avgDefDist.toFixed(1)}m moy. déf.` : `${zeroDefShots} tirs sans déf.`}
          detail={pressMsg}
          action={pressingOk
            ? undefined
            : "Resserrer le pressing sur le porteur. Milieux plus agressifs."}
        />

      </div>
    </div>
  );
}
