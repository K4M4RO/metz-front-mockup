"use client";

import { useState } from "react";
import { BookmarkPlus, Scale, FileText, Download, Plus, TrendingUp, AlertTriangle, ChevronDown, X } from "lucide-react";
import { PLAYER, REPORTS } from "@/data/enzo-millot";

// ─── Season selector ──────────────────────────────────────────────────────────
const SEASONS = ["2024-25", "2023-24", "2022-23"];

function SeasonSelector() {
  const [selected, setSelected] = useState(["2024-25"]);
  const [open, setOpen] = useState(false);

  function toggle(s: string) {
    setSelected((prev) =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter((x) => x !== s) : prev) : [...prev, s]
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
        style={{
          backgroundColor: "var(--color-neutral-800)",
          border: "1px solid var(--color-neutral-600)",
          color: "var(--color-neutral-200)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-800)")
        }
      >
        <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>Saison</span>
        {selected.map((s) => (
          <span
            key={s}
            className="px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "var(--color-primary-900)",
              color: "var(--color-primary-300)",
              fontSize: 10,
            }}
          >
            {s}
          </span>
        ))}
        <ChevronDown size={12} strokeWidth={1.5} style={{ color: "var(--color-neutral-500)" }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-10 z-50 rounded-lg overflow-hidden"
            style={{
              width: 160,
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-600)",
              boxShadow: "var(--shadow-dropdown)",
            }}
          >
            {SEASONS.map((s) => {
              const active = selected.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                  style={{ color: active ? "var(--color-primary-300)" : "var(--color-neutral-300)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                  }
                >
                  {s}
                  {active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-primary-500)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Info pill ────────────────────────────────────────────────────────────────
function Pill({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "neutral" | "warning" | "success" | "grenat";
}) {
  const styles = {
    neutral: { bg: "var(--color-neutral-800)", border: "var(--color-neutral-600)", color: "var(--color-neutral-300)" },
    warning: { bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.35)", color: "#EAB308" },
    success: { bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.35)", color: "#22C55E" },
    grenat:  { bg: "rgba(196,43,71,0.12)", border: "rgba(196,43,71,0.35)", color: "var(--color-primary-400)" },
  }[variant];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium flex-shrink-0"
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.color,
      }}
    >
      {children}
    </span>
  );
}

// ─── Report timeline ──────────────────────────────────────────────────────────
function ReportTimeline() {
  const [activeReport, setActiveReport] = useState<number | null>(null);

  return (
    <div className="relative flex items-center gap-0 h-8 px-4">
      {/* Base line */}
      <div
        className="absolute left-4"
        style={{
          right: 64,
          top: "50%",
          height: 1,
          backgroundColor: "var(--color-neutral-700)",
          transform: "translateY(-50%)",
        }}
      />

      {/* Report dots */}
      {REPORTS.map((r, i) => (
        <div key={r.id} className="relative" style={{ marginRight: i < REPORTS.length - 1 ? 88 : 0 }}>
          <button
            onClick={() => setActiveReport(activeReport === r.id ? null : r.id)}
            className="relative z-10 w-3 h-3 rounded-full transition-all"
            title={`${r.date} — ${r.author} (${r.type})`}
            style={{
              backgroundColor:
                activeReport === r.id ? "var(--color-primary-400)" : "var(--color-primary-600)",
              boxShadow:
                activeReport === r.id
                  ? "0 0 0 3px rgba(196,43,71,0.25)"
                  : "0 0 0 2px var(--color-neutral-800)",
            }}
          />
          {/* Date label */}
          <span
            className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{ color: "var(--color-neutral-500)", fontSize: 9 }}
          >
            {r.date}
          </span>

          {/* Popup */}
          {activeReport === r.id && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg px-3 py-2"
              style={{
                backgroundColor: "var(--color-neutral-800)",
                border: "1px solid var(--color-neutral-600)",
                boxShadow: "var(--shadow-dropdown)",
                minWidth: 140,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="font-medium"
                  style={{
                    color: "var(--color-neutral-100)",
                    fontSize: 11,
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {r.type}
                </span>
                <button
                  onClick={() => setActiveReport(null)}
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  <X size={10} strokeWidth={2} />
                </button>
              </div>
              <p style={{ color: "var(--color-neutral-400)", fontSize: 10, marginTop: 2 }}>
                {r.author} · Note {r.note}/10
              </p>
              <p style={{ color: "var(--color-neutral-500)", fontSize: 10 }}>{r.date}</p>
            </div>
          )}
        </div>
      ))}

      {/* Add button */}
      <button
        className="relative z-10 flex items-center gap-1 ml-4 px-2 py-1 rounded text-xs transition-colors"
        style={{
          backgroundColor: "var(--color-neutral-800)",
          border: "1px solid var(--color-neutral-700)",
          color: "var(--color-neutral-500)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-700)";
          (e.currentTarget as HTMLElement).style.color = "var(--color-primary-400)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-neutral-700)";
          (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)";
        }}
      >
        <Plus size={11} strokeWidth={2} />
        Rapport
      </button>
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────
function ActionBtn({
  icon: Icon,
  label,
  primary,
}: {
  icon: React.ElementType;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
      style={{
        backgroundColor: primary ? "var(--color-primary-600)" : "var(--color-neutral-800)",
        border: primary ? "none" : "1px solid var(--color-neutral-600)",
        color: primary ? "white" : "var(--color-neutral-300)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = primary
          ? "var(--color-primary-500)"
          : "var(--color-neutral-700)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = primary
          ? "var(--color-primary-600)"
          : "var(--color-neutral-800)")
      }
    >
      <Icon size={13} strokeWidth={1.5} />
      {label}
    </button>
  );
}

// ─── Main HeroHeader ──────────────────────────────────────────────────────────
export function HeroHeader() {
  return (
    <header
      className="flex-shrink-0 border-b"
      style={{
        height: 200,
        backgroundColor: "var(--color-neutral-900)",
        borderColor: "var(--color-neutral-700)",
        background: "linear-gradient(180deg, var(--color-neutral-800) 0%, var(--color-neutral-900) 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main row */}
      <div className="flex items-start gap-6 px-6 pt-5 flex-1">
        {/* ── Left: photo + identity ── */}
        <div className="flex items-start gap-4 flex-shrink-0">
          {/* Photo placeholder */}
          <div
            className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
            style={{
              width: 80,
              height: 80,
              backgroundColor: "var(--color-primary-900)",
              border: "3px solid var(--color-primary-700)",
              color: "var(--color-primary-200)",
              fontFamily: "var(--font-dm-sans)",
              fontSize: 24,
            }}
          >
            EM
          </div>

          {/* Name + meta */}
          <div className="pt-1">
            <h1
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 30,
                fontWeight: 700,
                color: "var(--color-neutral-100)",
                lineHeight: 1.1,
              }}
            >
              {PLAYER.firstName} {PLAYER.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-sm" style={{ color: "var(--color-neutral-400)" }}>
                {PLAYER.positionLabel}
              </span>
              <span style={{ color: "var(--color-neutral-700)" }}>·</span>
              <span className="text-sm" style={{ color: "var(--color-neutral-400)" }}>
                {PLAYER.age} ans
              </span>
              <span style={{ color: "var(--color-neutral-700)" }}>·</span>
              <span className="text-sm">{PLAYER.flag}</span>
              <span style={{ color: "var(--color-neutral-700)" }}>·</span>
              <span className="text-sm" style={{ color: "var(--color-neutral-400)" }}>
                Pied {PLAYER.foot}
              </span>
              <span style={{ color: "var(--color-neutral-700)" }}>·</span>
              <span className="text-sm" style={{ color: "var(--color-neutral-400)" }}>
                {PLAYER.height}
              </span>
            </div>

            {/* Info pills row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* Club + League */}
              <Pill variant="grenat">
                <span
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {PLAYER.club}
                </span>
              </Pill>
              <Pill variant="neutral">
                {PLAYER.league}
              </Pill>
              {/* Contract end — warning color since Jun 2026 is near */}
              <Pill variant="warning">
                <AlertTriangle size={11} strokeWidth={1.5} />
                Contrat {PLAYER.contractEnd}
              </Pill>
              {/* Market value */}
              <Pill variant="success">
                <TrendingUp size={11} strokeWidth={1.5} />
                {PLAYER.marketValue}
              </Pill>
              {/* Agent */}
              <Pill variant="neutral">
                👤 {PLAYER.agent}
              </Pill>
            </div>
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Right: season selector + actions ── */}
        <div className="flex flex-col items-end gap-3 pt-1 flex-shrink-0">
          <SeasonSelector />
          <div className="flex items-center gap-2">
            <ActionBtn icon={BookmarkPlus} label="+ Shortlist" primary />
            <ActionBtn icon={Scale} label="Comparer" />
            <ActionBtn icon={FileText} label="Rapport" />
            <ActionBtn icon={Download} label="PDF" />
          </div>
        </div>
      </div>

      {/* ── Report timeline row ── */}
      <div
        className="border-t"
        style={{ borderColor: "var(--color-neutral-700)", paddingBottom: 6, paddingTop: 4 }}
      >
        <div className="flex items-center gap-3 px-2">
          <span
            className="text-xs pl-4 flex-shrink-0"
            style={{ color: "var(--color-neutral-600)" }}
          >
            Rapports
          </span>
          <div className="flex-1">
            <ReportTimeline />
          </div>
        </div>
      </div>
    </header>
  );
}
