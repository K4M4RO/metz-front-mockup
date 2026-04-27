"use client";

import { PHYSICAL_SPLITS_METZ, BENCH_METZ, type PlayerSplit } from "./live-mock";

// ─── Risk logic (same as LiveTabFatigue) ──────────────────────────────────────

type Risk = "urgent" | "watch" | "ok";

function firstThreeAvg(arr: number[]) {
  const v = arr.filter(x => x > 0).slice(0, 3);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;
}
function lastThreeAvg(arr: number[]) {
  const v = arr.filter(x => x > 0);
  const last = v.slice(-3);
  return last.length ? last.reduce((s, x) => s + x, 0) / last.length : 0;
}

function hsrDrop(p: PlayerSplit) {
  const f = firstThreeAvg(p.hsr5min);
  const l = lastThreeAvg(p.hsr5min);
  return f > 0 ? (1 - l / f) * 100 : 0;
}

function walkOutPossCurrent(p: PlayerSplit) {
  return p.walkOutPoss5min.filter(v => v > 0).at(-1) ?? 0;
}
function walkOutPossBaseline(p: PlayerSplit) {
  const v = p.walkOutPoss5min.filter(x => x > 0).slice(0, 3);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;
}

function risk(p: PlayerSplit): Risk {
  const drop  = hsrDrop(p);
  const wCurr = walkOutPossCurrent(p);
  const wBase = walkOutPossBaseline(p);
  if (drop >= 50 || (wCurr - wBase) >= 25) return "urgent";
  if (drop >= 30 || (wCurr - wBase) >= 15) return "watch";
  return "ok";
}

function actionLabel(p: PlayerSplit): string {
  const r = risk(p);
  if (r === "urgent") return "SUGGESTION SUB.";
  if (r === "watch")  return "Surveillance";
  return "Optimal";
}


function metricLabel(p: PlayerSplit): string {
  const drop  = hsrDrop(p);
  const wCurr = walkOutPossCurrent(p);
  const wBase = walkOutPossBaseline(p);
  const r = risk(p);
  if (r === "urgent") {
    if ((wCurr - wBase) >= 25) return `Décroche défensivement (+${Math.round(wCurr - wBase)}% marche s/bal.)`;
    return `Vitesse chute ${drop.toFixed(0)}% vs début de match`;
  }
  if (r === "watch") {
    if (drop >= 30) return `HSR en baisse −${drop.toFixed(0)}%`;
    return `Marche s/ballon ↑ ${wCurr.toFixed(0)}%`;
  }
  const total = p.minutesPlayed > 0 ? p.minutesPlayed : 1;
  return `${(p.minutesPlayed / 90 * 10.2).toFixed(1)} km parcourus`;
}

const RISK_COLOR: Record<Risk, string> = {
  urgent: "#ef4444",
  watch:  "#f59e0b",
  ok:     "#22c55e",
};
const RISK_BG: Record<Risk, string> = {
  urgent: "rgba(239,68,68,0.10)",
  watch:  "rgba(245,158,11,0.08)",
  ok:     "var(--color-neutral-900)",
};
const RISK_BORDER: Record<Risk, string> = {
  urgent: "#ef4444",
  watch:  "#f59e0b",
  ok:     "var(--color-neutral-800)",
};

// ─── Alert banner ─────────────────────────────────────────────────────────────

function AlertBanner() {
  const urgents = PHYSICAL_SPLITS_METZ.filter(p => risk(p) === "urgent");
  if (!urgents.length) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "8px 20px", flexShrink: 0,
      background: "#7f1d1d",
      borderBottom: "1px solid #ef4444",
    }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: "#fca5a5", letterSpacing: "0.06em", flexShrink: 0 }}>
        ⚠ URGENT
      </span>
      {urgents.map(p => (
        <span key={p.playerId} style={{
          fontSize: 11, fontWeight: 700, color: "white",
          padding: "2px 10px", borderRadius: 5,
          background: "rgba(239,68,68,0.4)", border: "1px solid rgba(239,68,68,0.6)",
        }}>
          {p.name} — {p.position}
        </span>
      ))}
    </div>
  );
}

// ─── Player card ──────────────────────────────────────────────────────────────

function PlayerCard({ p }: { p: PlayerSplit }) {
  const r      = risk(p);
  const action = actionLabel(p);
  const metric = metricLabel(p);
  const color  = RISK_COLOR[r];

  return (
    <div style={{
      padding: "14px 16px",
      borderRadius: 10,
      background: RISK_BG[r],
      border: `1.5px solid ${RISK_BORDER[r]}`,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      position: "relative",
      overflow: "hidden",
      minHeight: 120,
    }}>
      {/* Colored left accent */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: color, borderRadius: "10px 0 0 10px",
      }} />

      {/* Number + position */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 8 }}>
        <span style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>
          #{p.number} · {p.position}
        </span>
        <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>{p.minutesPlayed}'</span>
      </div>

      {/* Name */}
      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--color-neutral-100)", paddingLeft: 8, lineHeight: 1.2 }}>
        {p.name}
      </div>

      {/* Action — biggest, most prominent */}
      <div style={{
        fontSize: r === "ok" ? 15 : 20,
        fontWeight: 900,
        color,
        paddingLeft: 8,
        marginTop: 4,
        lineHeight: 1,
        fontFamily: "var(--font-display)",
        letterSpacing: r !== "ok" ? "0.04em" : "normal",
      }}>
        {action}
      </div>

      {/* Context metric */}
      <div style={{ fontSize: 10, color: r === "ok" ? "var(--color-neutral-500)" : "var(--color-neutral-300)", paddingLeft: 8, lineHeight: 1.4 }}>
        {metric}
      </div>
    </div>
  );
}

// ─── Substitution card ────────────────────────────────────────────────────────

function SubstitutionCard() {
  const urgents = PHYSICAL_SPLITS_METZ.filter(p => risk(p) === "urgent");
  if (!urgents.length) return null;

  return (
    <div style={{
      padding: "14px 20px",
      background: "var(--color-neutral-900)",
      border: "1px solid var(--color-neutral-800)",
      borderRadius: 10,
      display: "flex",
      alignItems: "flex-start",
      gap: 20,
      flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-neutral-300)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
          Remplacement suggéré
        </div>
        <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginBottom: 8 }}>Cible :</div>
        {urgents.slice(0, 2).map(p => (
          <div key={p.playerId} style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", marginBottom: 2 }}>
            {p.name} <span style={{ fontSize: 10, color: "var(--color-neutral-400)", fontWeight: 600 }}>
              {p.position} · {risk(p) === "urgent" && hsrDrop(p) >= 50 ? `HSR −${hsrDrop(p).toFixed(0)}%` : "Décrochage déf."}
            </span>
          </div>
        ))}
      </div>

      <div style={{ color: "var(--color-neutral-700)", fontSize: 18, paddingTop: 20 }}>→</div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginBottom: 6 }}>Disponibles sur le banc :</div>
        {BENCH_METZ.map(b => (
          <div key={b.number} style={{ fontSize: 12, fontWeight: 600, color: "var(--color-neutral-300)", marginBottom: 2 }}>
            #{b.number} {b.name} <span style={{ fontSize: 10, color: "var(--color-neutral-600)" }}>· {b.position}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function LiveTabPhysique2() {
  const sorted = [...PHYSICAL_SPLITS_METZ].sort((a, b) => {
    const order: Record<Risk, number> = { urgent: 0, watch: 1, ok: 2 };
    return order[risk(a)] - order[risk(b)];
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-neutral-950)" }}>

      <AlertBanner />

      {/* Player grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }} className="custom-scrollbar">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10,
          marginBottom: 16,
        }}>
          {sorted.map(p => <PlayerCard key={p.playerId} p={p} />)}
        </div>

        <SubstitutionCard />
      </div>
    </div>
  );
}
