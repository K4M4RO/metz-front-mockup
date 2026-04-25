"use client";

import { useState } from "react";
import { BarChart2, Target, Activity, Shield } from "lucide-react";
import { TabMatchSummary } from "./TabMatchSummary";
import { TabOnBall }      from "./TabOnBall";
import { TabOffBall }     from "./TabOffBall";
import { TabDefense }     from "./TabDefense";
import { TabEndurance }   from "./TabEndurance";
import { HOME_TEAM, AWAY_TEAM, MATCH_INFO } from "./data";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "summary",   label: "Match Summary & Phases",  icon: BarChart2, shortLabel: "Summary"  },
  { id: "endurance", label: "Endurance & Fatigue",     icon: Activity,  shortLabel: "Endurance" },
  { id: "onball",    label: "On-Ball — Passes & Déséquilibre", icon: Target,   shortLabel: "On-Ball"  },
  { id: "animation", label: "Animation & Espaces",     icon: Activity,  shortLabel: "Animation" },
  { id: "defense",   label: "Pression & Défense",       icon: Shield,   shortLabel: "Pression"  },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Score Header ─────────────────────────────────────────────────────────────

function MatchHeader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 24px",
      background: "var(--color-neutral-900)",
      borderBottom: "1px solid var(--color-neutral-800)",
      flexShrink: 0,
      flexWrap: "wrap",
      gap: 12,
    }}>
      {/* Left: competition */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180 }}>
        <div style={{
          padding: "2px 8px",
          borderRadius: 4,
          background: "rgba(var(--primary-rgb), 0.15)",
          border: "1px solid rgba(var(--primary-rgb), 0.3)",
          fontSize: 9, fontWeight: 800,
          color: "var(--color-primary-400)",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          Post-Match
        </div>
        <span style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>
          {MATCH_INFO.competition} · {MATCH_INFO.matchday}
        </span>
        <span style={{ fontSize: 10, color: "var(--color-neutral-600)" }}>
          {MATCH_INFO.date}
        </span>
      </div>

      {/* Centre: Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Home */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary-400)" }}>
            {HOME_TEAM.name}
          </div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>Domicile</div>
        </div>

        {/* Score */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--color-neutral-950)",
          border: "1px solid var(--color-neutral-700)",
          borderRadius: 10, padding: "5px 4px",
          gap: 0,
        }}>
          <span style={{
            fontSize: 32, fontWeight: 900, color: "var(--color-primary-400)",
            width: 44, textAlign: "center", lineHeight: 1,
          }}>
            {MATCH_INFO.homeScore}
          </span>
          <span style={{ fontSize: 16, color: "var(--color-neutral-600)", margin: "0 2px" }}>—</span>
          <span style={{
            fontSize: 32, fontWeight: 900, color: "var(--color-neutral-400)",
            width: 44, textAlign: "center", lineHeight: 1,
          }}>
            {MATCH_INFO.awayScore}
          </span>
        </div>

        {/* Away */}
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-neutral-300)" }}>
            {AWAY_TEAM.name}
          </div>
          <div style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>Extérieur</div>
        </div>
      </div>

      {/* Right: Venue */}
      <div style={{ fontSize: 10, color: "var(--color-neutral-500)", textAlign: "right", minWidth: 180 }}>
        <div>{MATCH_INFO.venue}</div>
        <div style={{ color: "var(--color-neutral-600)" }}>Coup d&apos;envoi {MATCH_INFO.kickoff}</div>
      </div>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

function TabBar({ activeTab, onSelect }: {
  activeTab: TabId;
  onSelect: (id: TabId) => void;
}) {
  return (
    <div style={{
      display: "flex",
      gap: 0,
      padding: "0 24px",
      background: "var(--color-neutral-900)",
      borderBottom: "1px solid var(--color-neutral-800)",
      flexShrink: 0,
      overflowX: "auto",
    }}>
      {TABS.map(({ id, shortLabel, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "11px 18px",
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--color-primary-400)" : "var(--color-neutral-500)",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${isActive ? "var(--color-primary-400)" : "transparent"}`,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-300)";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)";
            }}
          >
            <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PostMatchReport() {
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--color-neutral-950)",
      color: "var(--color-neutral-300)",
      overflow: "hidden",
    }}>
      {/* Score header */}
      <MatchHeader />

      {/* Tab navigation */}
      <TabBar activeTab={activeTab} onSelect={setActiveTab} />

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "summary" && <TabMatchSummary />}
        {activeTab === "endurance" && <TabEndurance />}
        {activeTab === "onball"  && <TabOnBall />}
        {activeTab === "animation" && <TabOffBall />}
        {activeTab === "defense" && <TabDefense />}
      </div>
    </div>
  );
}
