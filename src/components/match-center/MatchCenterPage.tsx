"use client";

import { useState, useEffect } from "react";
import { Clock, Radio, Eye, Activity, BarChart2, Zap, Target, Brain } from "lucide-react";
import { LiveTabVue } from "./LiveTabVue";
import { LiveTabFatigue } from "./LiveTabFatigue";
import { LiveTabBloc } from "./LiveTabBloc";
import { LiveTabPressing } from "./LiveTabPressing";
import { LiveTabPlanJeu } from "./LiveTabPlanJeu";
import { TRACKING_FRAME } from "./live-mock";


// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "vue" | "fatigue" | "bloc" | "pressing" | "plan";

const TABS: { id: Tab; icon: React.ElementType; label: string; sub: string }[] = [
  { id: "vue", icon: Eye, label: "Vue Live", sub: "Terrain 2D · Synthèse" },
  { id: "fatigue", icon: Activity, label: "Fatigue & Rempl.", sub: "Flux athlétique · splits" },
  { id: "bloc", icon: BarChart2, label: "Bloc & Espaces", sub: "Flux tracking · xyz" },
  { id: "pressing", icon: Zap, label: "Pressing", sub: "Insight · shooterDefDist" },
  { id: "plan", icon: Target, label: "Plan de jeu", sub: "xG · Expected points" },
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}:${rs.toString().padStart(2, "0")}`;
}


// ─── Main Component ───────────────────────────────────────────────────────────

export function MatchCenterPage() {
  const [elapsed, setElapsed] = useState(69 * 60);
  const [pulse, setPulse] = useState(true);
  const [tab, setTab] = useState<Tab>("vue");

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    const p = setInterval(() => setPulse(v => !v), 800);
    return () => { clearInterval(t); clearInterval(p); };
  }, []);

  const frame = TRACKING_FRAME;
  const minute = Math.floor(elapsed / 60);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--color-neutral-950)", color: "var(--color-neutral-100)",
      overflow: "hidden",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "16px 20px",
        background: "var(--color-neutral-900)",
        borderBottom: "1px solid var(--color-neutral-800)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#ef4444",
              boxShadow: pulse ? "0 0 8px #ef4444" : "none",
              transition: "box-shadow 0.3s ease",
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ef4444" }}>Direct</span>
          </div>
          <div style={{ height: 20, width: 1, background: "var(--color-neutral-800)" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>FC Metz vs Paris FC</div>
            <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>Ligue 2 BKT · Journée 12</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700,
            background: frame.live ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.12)",
            color: frame.live ? "#22c55e" : "#64748b",
            border: `1px solid ${frame.live ? "rgba(34,197,94,0.3)" : "rgba(100,116,139,0.3)"}`,
          }}>
            {frame.live ? "● En jeu" : "● Hors jeu"}
          </div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>
            Dernier touché : <span style={{ color: frame.lastTouch === "home" ? "var(--color-primary-400)" : "var(--color-neutral-300)", fontWeight: 700 }}>
              {frame.lastTouch === "home" ? "FC Metz" : "Paris FC"}
            </span>
          </div>
          <div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700 }}>
            ⚽ {(frame.ball.speed * 3.6).toFixed(0)} km/h
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={12} style={{ color: "var(--color-neutral-500)" }} />
            <span style={{
              fontSize: 18, fontWeight: 800, color: "var(--color-neutral-100)",
              fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em",
            }}>
              {formatTime(elapsed)}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-neutral-500)", marginTop: 2 }}>
              {minute}ème minute
            </span>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 0,
        background: "var(--color-neutral-900)",
        borderBottom: "1px solid var(--color-neutral-800)",
        flexShrink: 0, overflowX: "auto",
      }}>
        {TABS.map(({ id, icon: Icon, label, sub }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${active ? "var(--color-primary-400)" : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon
                size={14}
                strokeWidth={active ? 2.5 : 1.5}
                style={{ color: active ? "var(--color-primary-400)" : "var(--color-neutral-500)", flexShrink: 0 }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "var(--color-primary-400)" : "var(--color-neutral-400)" }}>
                  {label}
                </div>
                <div style={{ fontSize: 8, color: "var(--color-neutral-600)" }}>{sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "vue" && <LiveTabVue onNavigate={(t) => setTab(t as Tab)} />}
        {tab === "fatigue" && <LiveTabFatigue />}
        {tab === "bloc" && <LiveTabBloc />}
        {tab === "pressing" && <LiveTabPressing />}
        {tab === "plan" && <LiveTabPlanJeu />}
      </div>


    </div>
  );
}
