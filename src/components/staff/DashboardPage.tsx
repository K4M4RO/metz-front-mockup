"use client";

import Link from "next/link";
import { Radio, FileText, Download, ChevronRight, Calendar, Clock } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const pastMatches = [
  {
    id: "metz-reims", date: "Aujourd'hui", opponent: "Stade de Reims", score: "3 – 2",
    result: "W", xG: "1.87", xGA: "0.72",
  },
  {
    id: 1, date: "12 Avr", opponent: "Troyes AC", score: "2 – 1",
    result: "W", xG: "1.8", xGA: "0.9",
  },
  {
    id: 2, date: "06 Avr", opponent: "Caen", score: "0 – 0",
    result: "D", xG: "1.1", xGA: "1.3",
  },
  {
    id: 3, date: "30 Mar", opponent: "Grenoble", score: "1 – 3",
    result: "L", xG: "0.7", xGA: "2.4",
  },
];

const upcomingMatches = [
  { id: 1, date: "26 Avr", time: "20h00", opponent: "Laval", venue: "Domicile", competition: "Ligue 2" },
  { id: 2, date: "03 Mai", time: "18h30", opponent: "Annecy FC", venue: "Extérieur", competition: "Ligue 2" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resultColors: Record<string, string> = { W: "#22C55E", D: "#F59E0B", L: "#EF4444" };
const resultLabels: Record<string, string> = { W: "V", D: "N", L: "D" };

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResultBadge({ result }: { result: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: 5, fontSize: 10, fontWeight: 800,
      background: `${resultColors[result]}22`, color: resultColors[result],
      border: `1px solid ${resultColors[result]}44`,
    }}>
      {resultLabels[result]}
    </span>
  );
}

function PastMatchCard({ match }: { match: typeof pastMatches[0] }) {
  return (
    <div style={{
      background: "var(--color-neutral-800)", borderRadius: 10,
      border: "1px solid var(--color-neutral-700)", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        borderBottom: "1px solid var(--color-neutral-700)",
      }}>
        <ResultBadge result={match.result} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-neutral-100)" }}>
            FC Metz {match.score} {match.opponent}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-neutral-500)", marginTop: 1 }}>{match.date}</div>
        </div>
      </div>

      {/* xG line */}
      <div style={{ display: "flex", gap: 16, padding: "8px 14px", borderBottom: "1px solid var(--color-neutral-700)" }}>
        <div style={{ fontSize: 11, color: "var(--color-neutral-400)" }}>
          xG: <strong style={{ color: "var(--color-neutral-200)" }}>{match.xG}</strong>
        </div>
        <div style={{ fontSize: 11, color: "var(--color-neutral-400)" }}>
          xGA: <strong style={{ color: "var(--color-neutral-200)" }}>{match.xGA}</strong>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, padding: "8px 10px" }}>
        <Link
          href={`/staff/post-match?match=${match.id}`}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "6px 8px", borderRadius: 6, textDecoration: "none", fontSize: 11, fontWeight: 600,
            background: "rgba(196,43,71,0.12)", color: "#C42B47",
            border: "1px solid rgba(196,43,71,0.25)",
          }}
        >
          <FileText size={12} /> Rapport Post-Match
        </Link>
        <button style={{
          display: "flex", alignItems: "center", gap: 4, padding: "6px 10px",
          borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
          background: "var(--color-neutral-700)", color: "var(--color-neutral-300)",
          border: "1px solid var(--color-neutral-600)",
        }}>
          <Download size={12} /> XML
        </button>
      </div>
    </div>
  );
}

function UpcomingMatchCard({ match }: { match: typeof upcomingMatches[0] }) {
  const isHome = match.venue === "Domicile";
  return (
    <Link
      href={`/staff/pre-match?match=${match.id}`}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div style={{
        background: "var(--color-neutral-800)", borderRadius: 10,
        border: "1px solid var(--color-neutral-700)",
        transition: "border-color 150ms, background 150ms",
        cursor: "pointer",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,43,71,0.5)";
          (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-750, #1e1e1e)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-700)";
          (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-800)";
        }}
      >
        <div style={{ padding: "12px 14px" }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
              background: isHome ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
              color: isHome ? "#22C55E" : "#F59E0B",
              border: `1px solid ${isHome ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
            }}>{match.venue}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
              background: "var(--color-neutral-700)", color: "var(--color-neutral-400)",
            }}>{match.competition}</span>
          </div>

          {/* Opponent */}
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-neutral-100)", marginBottom: 4 }}>
            vs {match.opponent}
          </div>

          {/* Date & time */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-neutral-400)" }}>
              <Calendar size={11} /> {match.date}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-neutral-400)" }}>
              <Clock size={11} /> {match.time}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderTop: "1px solid var(--color-neutral-700)",
          fontSize: 11, fontWeight: 600, color: "#C42B47",
        }}>
          <FileText size={12} /> Voir rapport Pré-Match
          <ChevronRight size={12} style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Live alert */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
        borderRadius: 10, marginBottom: 24,
        background: "rgba(196,43,71,0.08)", border: "1px solid rgba(196,43,71,0.25)",
      }}>
        <Radio size={15} style={{ color: "#C42B47" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#C42B47" }}>
          Aucun match en direct actuellement
        </span>
        <Link href="/match-center" style={{
          marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#C42B47",
          textDecoration: "none", padding: "4px 10px", borderRadius: 5,
          background: "rgba(196,43,71,0.15)", border: "1px solid rgba(196,43,71,0.3)",
        }}>
          Ouvrir Match Center
        </Link>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* ── Left: Past matches ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: "var(--color-neutral-200)", margin: 0 }}>
              Derniers matchs
            </h2>
            <Link href="/staff/post-match" style={{ fontSize: 11, color: "#C42B47", textDecoration: "none", fontWeight: 600 }}>
              Voir tous les rapports Post-Match →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pastMatches.map(m => <PastMatchCard key={m.id} match={m} />)}
          </div>
        </div>

        {/* ── Right: Upcoming matches ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: "var(--color-neutral-200)", margin: 0 }}>
              Prochains matchs
            </h2>
            <Link href="/staff/pre-match" style={{ fontSize: 11, color: "#C42B47", textDecoration: "none", fontWeight: 600 }}>
              Voir tous les rapports Pré-Match →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcomingMatches.map(m => <UpcomingMatchCard key={m.id} match={m} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
