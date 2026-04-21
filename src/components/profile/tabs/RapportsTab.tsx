"use client";

import { useState, useCallback, useRef } from "react";
import { Search, Plus, Download, X, ChevronDown, ExternalLink, Check, Filter } from "lucide-react";
import {
  RAPPORT_PLAYERS, STATUS_CONFIG, NOTE_CONFIG, SOURCE_CONFIG,
  KANBAN_OPTIONS, POSTE_OPTIONS, SYSTEME_OPTIONS,
} from "@/data/rapports-mock";
import type {
  PlayerTarget, ScoutReport, ReportStatus, ReportType, ReportSource,
  KanbanId, NoteGrade,
} from "@/data/rapports-mock";

// ── Small badges ──────────────────────────────────────────────────────────────

function StatusBadge({ status, small }: { status: ReportStatus; small?: boolean }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: small ? "1px 7px" : "2px 9px",
      borderRadius: 999,
      backgroundColor: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.color,
      fontSize: small ? 9 : 10,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.color, display: "inline-block", flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function NoteBadge({ note }: { note: NoteGrade }) {
  const cfg = NOTE_CONFIG[note];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: 5,
      backgroundColor: cfg.bg,
      color: cfg.color,
      fontSize: 11, fontWeight: 800,
      fontFamily: "var(--font-dm-sans)",
      flexShrink: 0,
    }}>
      {note}
    </span>
  );
}

function SourceBadge({ source }: { source: ReportSource }) {
  const cfg = SOURCE_CONFIG[source];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "1px 7px", borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: cfg.color, fontSize: 9, fontWeight: 600,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Dot tooltip ───────────────────────────────────────────────────────────────

interface DotTooltipProps {
  report: ScoutReport;
  x: number;
  y: number;
}

function DotTooltip({ report, x, y }: DotTooltipProps) {
  const LEFT_OFFSET = 16;
  const TOP_OFFSET = -16;
  return (
    <div style={{
      position: "fixed",
      left: x + LEFT_OFFSET,
      top: y + TOP_OFFSET,
      zIndex: 9999,
      backgroundColor: "#111118",
      border: `1px solid ${STATUS_CONFIG[report.status].color}60`,
      borderRadius: 8,
      padding: "10px 13px",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px ${STATUS_CONFIG[report.status].color}25`,
      minWidth: 200,
    }}>
      {/* Date + type */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
        <span style={{ color: "var(--color-neutral-300)", fontSize: 11, fontWeight: 700 }}>
          {report.date}
        </span>
        <span style={{
          fontSize: 9, padding: "1px 6px", borderRadius: 4,
          backgroundColor: report.type === "match" ? "rgba(59,130,246,0.15)" : "rgba(167,139,250,0.15)",
          color: report.type === "match" ? "#60A5FA" : "#A78BFA",
          border: `1px solid ${report.type === "match" ? "rgba(59,130,246,0.3)" : "rgba(167,139,250,0.3)"}`,
          fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {report.type === "match" ? "Match" : "Global"}
        </span>
      </div>
      {/* Author */}
      <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginBottom: 7 }}>
        {report.author} · <span style={{ color: "var(--color-neutral-600)" }}>{report.authorRole}</span>
      </div>
      {/* Note + Status row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <NoteBadge note={report.note} />
        <StatusBadge status={report.status} small />
      </div>
      {/* Source */}
      <SourceBadge source={report.source} />
      {/* Match context */}
      {report.affiche && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "var(--color-neutral-500)" }}>
          {report.competition && <span style={{ color: "var(--color-neutral-400)" }}>{report.competition} · </span>}
          {report.affiche}
        </div>
      )}
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────

interface TimelineProps {
  player: PlayerTarget;
  onDotHover: (e: React.MouseEvent, report: ScoutReport) => void;
  onDotLeave: () => void;
  onDotClick: (report: ScoutReport, player: PlayerTarget) => void;
}

function HorizontalTimeline({ player, onDotHover, onDotLeave, onDotClick }: TimelineProps) {
  const { reports } = player;
  return (
    <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", padding: "0 8px", minWidth: 0 }}>
      {/* Background line */}
      <div style={{
        position: "absolute", left: 8, right: 8,
        height: 1,
        background: "linear-gradient(to right, transparent, var(--color-neutral-700) 8%, var(--color-neutral-700) 92%, transparent)",
      }} />
      {/* Dots row */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: reports.length === 1 ? "center" : "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {reports.map((report) => {
          const cfg = STATUS_CONFIG[report.status];
          return (
            <div
              key={report.id}
              onClick={() => onDotClick(report, player)}
              onMouseEnter={(e) => onDotHover(e, report)}
              onMouseLeave={onDotLeave}
              style={{
                width: 14, height: 14,
                borderRadius: "50%",
                backgroundColor: cfg.dot,
                border: `2.5px solid var(--color-neutral-900)`,
                boxShadow: `0 0 7px ${cfg.dot}90, 0 0 14px ${cfg.dot}40`,
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                flexShrink: 0,
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.45)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${cfg.dot}, 0 0 24px ${cfg.dot}60`;
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 7px ${cfg.dot}90, 0 0 14px ${cfg.dot}40`;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Player row ────────────────────────────────────────────────────────────────

interface PlayerRowProps {
  player: PlayerTarget;
  onDotHover: (e: React.MouseEvent, report: ScoutReport) => void;
  onDotLeave: () => void;
  onDotClick: (report: ScoutReport, player: PlayerTarget) => void;
  onAddReport: (player: PlayerTarget) => void;
  onExportPDF: (player: PlayerTarget) => void;
}

function PlayerRow({ player, onDotHover, onDotLeave, onDotClick, onAddReport, onExportPDF }: PlayerRowProps) {
  const lastReport = player.reports[player.reports.length - 1];

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 0,
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-neutral-700)")}
    >
      {/* Left: player identity (fixed 240px) */}
      <div style={{
        width: 240, flexShrink: 0, padding: "14px 16px",
        borderRight: "1px solid var(--color-neutral-700)",
        display: "flex", alignItems: "center", gap: 11,
      }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          backgroundColor: player.avatarColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "white",
          fontFamily: "var(--font-dm-sans)",
          boxShadow: `0 0 12px ${player.avatarColor}60`,
        }}>
          {player.avatarInitials}
        </div>
        {/* Name + meta */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: "var(--color-neutral-100)",
              fontFamily: "var(--font-dm-sans)", whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {player.firstName} {player.name}
            </span>
            <span style={{ fontSize: 10 }}>{player.flag}</span>
          </div>
          <div style={{ fontSize: 10, color: "var(--color-neutral-500)", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3, padding: "0 5px",
              color: "var(--color-neutral-400)",
              fontWeight: 600, fontSize: 9,
            }}>{player.positionShort}</span>
            <span style={{ color: "var(--color-neutral-600)" }}>·</span>
            <span>{player.club}</span>
          </div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <StatusBadge status={lastReport.status} small />
          </div>
        </div>
      </div>

      {/* Center: timeline (flex-1) */}
      <div style={{ flex: 1, minWidth: 0, padding: "0 4px", position: "relative", height: 72, display: "flex", alignItems: "center" }}>
        <HorizontalTimeline
          player={player}
          onDotHover={onDotHover}
          onDotLeave={onDotLeave}
          onDotClick={onDotClick}
        />
      </div>

      {/* Right: counts + actions (fixed 140px) */}
      <div style={{
        width: 140, flexShrink: 0, padding: "0 12px",
        borderLeft: "1px solid var(--color-neutral-700)",
        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6,
      }}>
        <span style={{ fontSize: 10, color: "var(--color-neutral-600)", marginRight: 2 }}>
          {player.reports.length} rapport{player.reports.length > 1 ? "s" : ""}
        </span>
        <button
          onClick={() => onExportPDF(player)}
          title="Exporter PDF"
          style={{
            width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)",
            color: "var(--color-neutral-500)", cursor: "pointer", flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D4A017"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)"; }}
        >
          <Download size={12} />
        </button>
        <button
          onClick={() => onAddReport(player)}
          title="Nouveau rapport"
          style={{
            width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(196,43,71,0.15)", border: "1px solid rgba(196,43,71,0.4)",
            color: "#C42B47", cursor: "pointer", flexShrink: 0,
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,43,71,0.28)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,43,71,0.15)"; }}
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ── Report Detail Drawer ──────────────────────────────────────────────────────

interface ReportDetailProps {
  report: ScoutReport;
  player: PlayerTarget;
  onClose: () => void;
}

function ReportDetailDrawer({ report, player, onClose }: ReportDetailProps) {
  const cfg = STATUS_CONFIG[report.status];
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 440, zIndex: 50,
        backgroundColor: "#111118",
        borderLeft: `1px solid ${cfg.color}40`,
        display: "flex", flexDirection: "column",
        boxShadow: "-16px 0 48px rgba(0,0,0,0.6)",
        animation: "slideInRight 0.22s ease-out",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid var(--color-neutral-700)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", backgroundColor: player.avatarColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0,
              }}>{player.avatarInitials}</div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)" }}>
                  {player.firstName} {player.name}
                </span>
                <div style={{ fontSize: 10, color: "var(--color-neutral-500)", marginTop: 1 }}>
                  {player.positionShort} · {player.club} · {player.league}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
                backgroundColor: report.type === "match" ? "rgba(59,130,246,0.15)" : "rgba(167,139,250,0.15)",
                color: report.type === "match" ? "#60A5FA" : "#A78BFA",
                border: `1px solid ${report.type === "match" ? "rgba(59,130,246,0.3)" : "rgba(167,139,250,0.3)"}`,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                {report.type === "match" ? "Observation Match" : "Performance Globale"}
              </span>
              <span style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>{report.date}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--color-neutral-500)", cursor: "pointer", background: "none", border: "none", padding: 2, flexShrink: 0 }}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Key metrics row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Note</div>
              <NoteBadge note={report.note} />
            </div>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Statut</div>
              <StatusBadge status={report.status} small />
            </div>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--color-neutral-500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Source</div>
              <SourceBadge source={report.source} />
            </div>
          </div>

          {/* Kanban status */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: "var(--color-neutral-600)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Pipeline Kanban</div>
            <span style={{ fontSize: 11, color: "var(--color-neutral-300)", backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)", borderRadius: 5, padding: "3px 9px" }}>
              {KANBAN_OPTIONS.find(k => k.id === report.kanban)?.label}
            </span>
          </div>

          {/* Match context */}
          {report.type === "match" && report.affiche && (
            <div style={{
              marginBottom: 14, padding: "12px", borderRadius: 8,
              backgroundColor: "rgba(59,130,246,0.07)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}>
              <div style={{ fontSize: 9, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 600 }}>Contexte du Match</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 10, color: "var(--color-neutral-400)" }}>
                {report.competition && <div><span style={{ color: "var(--color-neutral-600)" }}>Compétition · </span>{report.competition}</div>}
                {report.affiche && <div><span style={{ color: "var(--color-neutral-600)" }}>Affiche · </span>{report.affiche}</div>}
                {report.poste && <div><span style={{ color: "var(--color-neutral-600)" }}>Poste · </span>{report.poste}</div>}
                {report.systeme && <div><span style={{ color: "var(--color-neutral-600)" }}>Système · </span>{report.systeme}</div>}
              </div>
            </div>
          )}

          {/* Comment */}
          <div>
            <div style={{ fontSize: 9, color: "var(--color-neutral-600)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Analyse Qualitative</div>
            <p style={{
              fontSize: 12, lineHeight: 1.65, color: "var(--color-neutral-300)",
              padding: "12px 14px", borderRadius: 8,
              backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)",
            }}>
              {report.comment}
            </p>
          </div>

          {/* Author block */}
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 8, backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)", display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#3F3F46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--color-neutral-300)", flexShrink: 0 }}>
              {report.author.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--color-neutral-200)", fontWeight: 600 }}>{report.author}</div>
              <div style={{ fontSize: 10, color: "var(--color-neutral-500)" }}>{report.authorRole} · {report.date}</div>
            </div>
          </div>

          {/* Immutability notice */}
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, backgroundColor: "rgba(234,179,8,0.07)", border: "1px solid rgba(234,179,8,0.2)", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 10 }}>🔒</span>
            <span style={{ fontSize: 10, color: "rgba(234,179,8,0.8)" }}>Rapport validé — immuable. Accessible en lecture seule.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--color-neutral-700)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer",
            backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)",
            color: "var(--color-neutral-400)",
          }}>
            <ExternalLink size={12} /> Ouvrir fiche joueur
          </button>
          <button
            onClick={onClose}
            style={{ padding: "6px 14px", borderRadius: 6, backgroundColor: "#C42B47", border: "none", color: "white", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}

// ── Create Report Modal ───────────────────────────────────────────────────────

interface CreateModalProps {
  player: PlayerTarget;
  onClose: () => void;
  onSubmit: (player: PlayerTarget) => void;
}

function CreateReportModal({ player, onClose, onSubmit }: CreateModalProps) {
  const [type,     setType]     = useState<ReportType>("global");
  const [source,   setSource]   = useState<ReportSource | null>(null);
  const [status,   setStatus]   = useState<"priorite" | "pret" | "suivre" | "ecarte" | null>(null);
  const [note,     setNote]     = useState<NoteGrade | null>(null);
  const [kanban,   setKanban]   = useState<KanbanId>("scoute");
  const [comment,  setComment]  = useState("");
  const [affiche,  setAffiche]  = useState("");
  const [poste,    setPoste]    = useState("");
  const [systeme,  setSysteme]  = useState("");
  const [kanbanOpen, setKanbanOpen] = useState(false);
  const [posteOpen, setPosteOpen]   = useState(false);
  const [systemeOpen, setSystemeOpen] = useState(false);
  const today = "Aujourd'hui, " + new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 11px", borderRadius: 7, fontSize: 12,
    backgroundColor: "var(--color-neutral-700)",
    border: "1px solid var(--color-neutral-600)",
    color: "var(--color-neutral-200)",
    outline: "none", fontFamily: "var(--font-sans)",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: "var(--color-neutral-500)",
    textTransform: "uppercase", letterSpacing: "0.07em",
    display: "block", marginBottom: 7,
  };

  function SelectDropdown({ options, value, onChange, open, setOpen, placeholder }: {
    options: string[]; value: string; onChange: (v: string) => void;
    open: boolean; setOpen: (v: boolean) => void; placeholder: string;
  }) {
    return (
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        >
          <span style={{ color: value ? "var(--color-neutral-200)" : "var(--color-neutral-600)" }}>
            {value || placeholder}
          </span>
          <ChevronDown size={13} style={{ color: "var(--color-neutral-500)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
            backgroundColor: "#1A1A22", border: "1px solid var(--color-neutral-600)",
            borderRadius: 7, overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}>
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "8px 12px", fontSize: 12, cursor: "pointer",
                  color: value === opt ? "#C42B47" : "var(--color-neutral-300)",
                  backgroundColor: value === opt ? "rgba(196,43,71,0.10)" : "transparent",
                  border: "none",
                }}
                onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const canSubmit = source && status && note && comment.length >= 5 &&
    (type === "global" || (affiche && poste && systeme));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/65" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{
          width: 620, maxHeight: "calc(100vh - 96px)",
          backgroundColor: "#111118",
          border: "1px solid var(--color-neutral-600)",
          borderRadius: 12,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Modal header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-neutral-700)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", backgroundColor: player.avatarColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: "white", flexShrink: 0,
              }}>{player.avatarInitials}</div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)" }}>
                  Nouveau Rapport
                </span>
                <span style={{ fontSize: 12, color: "var(--color-neutral-500)", marginLeft: 8 }}>
                  {player.firstName} {player.name}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{
                fontSize: 10, padding: "3px 9px", borderRadius: 5, cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--color-neutral-500)", display: "flex", alignItems: "center", gap: 4,
              }}>
                <ExternalLink size={10} /> Fiche joueur
              </button>
              <button onClick={onClose} style={{ color: "var(--color-neutral-500)", cursor: "pointer", background: "none", border: "none" }}>
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

            {/* Auto fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 6, opacity: 0.6, cursor: "not-allowed" }}>
                  <span style={{ fontSize: 12 }}>📅</span> {today}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Auteur (JWT)</label>
                <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 6, opacity: 0.6, cursor: "not-allowed" }}>
                  <span style={{ fontSize: 12 }}>👤</span> Imrane El Arhrib
                </div>
              </div>
            </div>

            {/* Type toggle */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Type de Rapport</label>
              <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-neutral-600)", width: "fit-content" }}>
                {(["global", "match"] as ReportType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    style={{
                      padding: "8px 20px", fontSize: 12, cursor: "pointer", fontWeight: 500,
                      backgroundColor: type === t ? "rgba(196,43,71,0.18)" : "var(--color-neutral-700)",
                      color: type === t ? "#F4A0AF" : "var(--color-neutral-400)",
                      border: "none",
                      borderRight: t === "global" ? "1px solid var(--color-neutral-600)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {t === "global" ? "🧠 Performance Globale" : "📋 Observation Match"}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Source de l'Évaluation</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(Object.entries(SOURCE_CONFIG) as [ReportSource, typeof SOURCE_CONFIG[ReportSource]][]).map(([key, cfg]) => {
                  const active = source === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSource(key)}
                      style={{
                        padding: "7px 14px", borderRadius: 7, fontSize: 11, cursor: "pointer",
                        backgroundColor: active ? `${cfg.color}18` : "var(--color-neutral-700)",
                        border: `1px solid ${active ? `${cfg.color}50` : "var(--color-neutral-600)"}`,
                        color: active ? cfg.color : "var(--color-neutral-400)",
                        fontWeight: active ? 600 : 400, transition: "all 0.12s",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      <span>{cfg.icon}</span> {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status + Note in 2 cols */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Statut Cible</label>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {(Object.entries(STATUS_CONFIG) as [ReportStatus, typeof STATUS_CONFIG[ReportStatus]][]).map(([key, cfg]) => {
                    const active = status === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatus(key)}
                        style={{
                          padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
                          backgroundColor: active ? cfg.bg : "var(--color-neutral-700)",
                          border: `1px solid ${active ? cfg.border : "var(--color-neutral-600)"}`,
                          color: active ? cfg.color : "var(--color-neutral-400)",
                          fontWeight: active ? 600 : 400,
                          display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: cfg.color, display: "inline-block" }} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Note Globale</label>
                <div style={{ display: "flex", gap: 5 }}>
                  {(["A","B","C","D","E"] as NoteGrade[]).map((n) => {
                    const cfg = NOTE_CONFIG[n];
                    const active = note === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNote(n)}
                        style={{
                          width: 36, height: 36, borderRadius: 7, fontSize: 14, fontWeight: 800,
                          fontFamily: "var(--font-dm-sans)", cursor: "pointer",
                          backgroundColor: active ? cfg.bg : "var(--color-neutral-700)",
                          border: `1px solid ${active ? cfg.color + "60" : "var(--color-neutral-600)"}`,
                          color: active ? cfg.color : "var(--color-neutral-500)",
                          transition: "all 0.12s",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Kanban */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Statut Kanban</label>
              <SelectDropdown
                options={KANBAN_OPTIONS.map(k => k.label)}
                value={KANBAN_OPTIONS.find(k => k.id === kanban)?.label ?? ""}
                onChange={(v) => setKanban(KANBAN_OPTIONS.find(k => k.label === v)!.id)}
                open={kanbanOpen}
                setOpen={setKanbanOpen}
                placeholder="Sélectionner une étape…"
              />
            </div>

            {/* === CONDITIONAL: Match context === */}
            {type === "match" && (
              <div style={{
                marginBottom: 18, padding: "14px 16px", borderRadius: 9,
                backgroundColor: "rgba(59,130,246,0.05)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <span style={{ fontSize: 14 }}>📋</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA", letterSpacing: "0.04em" }}>
                    Contexte du Match
                  </span>
                  <span style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 3,
                    backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                    color: "#FCA5A5", fontWeight: 600,
                  }}>
                    Obligatoire
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Compétition &amp; Affiche</label>
                    <input
                      value={affiche}
                      onChange={(e) => setAffiche(e.target.value)}
                      placeholder="ex : Ligue 2 | Bastia – Rodez"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Poste Observé</label>
                      <SelectDropdown
                        options={POSTE_OPTIONS}
                        value={poste}
                        onChange={setPoste}
                        open={posteOpen}
                        setOpen={setPosteOpen}
                        placeholder="Poste…"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Système de l'Équipe</label>
                      <SelectDropdown
                        options={SYSTEME_OPTIONS}
                        value={systeme}
                        onChange={setSysteme}
                        open={systemeOpen}
                        setOpen={setSystemeOpen}
                        placeholder="Formation…"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comment */}
            <div>
              <label style={labelStyle}>Commentaire / Analyse</label>
              <textarea
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Décrivez les points forts, les faiblesses, le contexte et votre recommandation…"
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
              <div style={{ textAlign: "right", fontSize: 9, color: "var(--color-neutral-600)", marginTop: 4 }}>
                {comment.length} caractères
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div style={{
            padding: "12px 20px", borderTop: "1px solid var(--color-neutral-700)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 10, color: "var(--color-neutral-600)", display: "flex", alignItems: "center", gap: 5 }}>
              <span>🔒</span> Validé = immuable après 15 min
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={onClose}
                style={{ padding: "7px 16px", borderRadius: 7, backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)", color: "var(--color-neutral-400)", cursor: "pointer", fontSize: 12 }}
              >
                Annuler
              </button>
              <button
                onClick={() => canSubmit && onSubmit(player)}
                style={{
                  padding: "7px 18px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed",
                  backgroundColor: canSubmit ? "#C42B47" : "rgba(196,43,71,0.25)",
                  border: `1px solid ${canSubmit ? "transparent" : "rgba(196,43,71,0.3)"}`,
                  color: canSubmit ? "white" : "rgba(196,43,71,0.5)",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                }}
              >
                <Check size={13} /> Publier le Rapport
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── PDF Configurator Modal ────────────────────────────────────────────────────

interface PDFModalProps {
  player: PlayerTarget;
  onClose: () => void;
}

function PDFConfigModal({ player, onClose }: PDFModalProps) {
  const [options, setOptions] = useState({ identity: true, radar: true, withwithout: false, comments: true });
  const [exporting, setExporting] = useState(false);
  const lastReport = player.reports[player.reports.length - 1];

  function toggle(key: keyof typeof options) {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); onClose(); }, 1800);
  }

  const CHECKS: { key: keyof typeof options; label: string; desc: string }[] = [
    { key: "identity",    label: "Identité & Métadonnées", desc: "Photo, nom, club, âge, valeur Transfermarkt, contrat" },
    { key: "radar",       label: "Radar Chart Performance", desc: "Radar 8 axes avec benchmark de poste" },
    { key: "withwithout", label: "Analyse With / Without",  desc: "Impact sur les métriques collectives de l'équipe" },
    { key: "comments",    label: "Analyses Qualitatives",   desc: "Tous les commentaires de rapports inclus" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/65" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div style={{
          width: 760, backgroundColor: "#111118",
          border: "1px solid var(--color-neutral-600)",
          borderRadius: 12,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-neutral-700)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Download size={15} style={{ color: "#D4A017" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)" }}>
                Configurateur d'Export PDF
              </span>
              <span style={{ fontSize: 11, color: "var(--color-neutral-500)" }}>— {player.firstName} {player.name}</span>
            </div>
            <button onClick={onClose} style={{ color: "var(--color-neutral-500)", cursor: "pointer", background: "none", border: "none" }}>
              <X size={16} />
            </button>
          </div>

          {/* 2-col body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr" }}>
            {/* Left: options */}
            <div style={{ padding: "20px", borderRight: "1px solid var(--color-neutral-700)" }}>
              <p style={{ fontSize: 10, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14, fontWeight: 600 }}>
                Contenu à inclure
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {CHECKS.map(({ key, label, desc }) => (
                  <label
                    key={key}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 11, cursor: "pointer",
                      padding: "10px 12px", borderRadius: 8,
                      backgroundColor: options[key] ? "rgba(196,43,71,0.08)" : "var(--color-neutral-800)",
                      border: `1px solid ${options[key] ? "rgba(196,43,71,0.3)" : "var(--color-neutral-700)"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      onClick={() => toggle(key)}
                      style={{
                        width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 1,
                        backgroundColor: options[key] ? "#C42B47" : "var(--color-neutral-700)",
                        border: `1px solid ${options[key] ? "#C42B47" : "var(--color-neutral-600)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.12s",
                      }}
                    >
                      {options[key] && <Check size={10} style={{ color: "white" }} strokeWidth={3} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: options[key] ? "var(--color-neutral-200)" : "var(--color-neutral-400)", marginBottom: 2 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--color-neutral-600)", lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Right: preview */}
            <div style={{ padding: "20px", backgroundColor: "rgba(0,0,0,0.2)" }}>
              <p style={{ fontSize: 10, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14, fontWeight: 600 }}>
                Aperçu Document
              </p>
              <div style={{
                backgroundColor: "#1C1C24",
                border: "1px solid var(--color-neutral-700)",
                borderRadius: 8, overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}>
                {/* PDF header */}
                <div style={{
                  background: "linear-gradient(135deg, #1A0A10 0%, #2A0D18 50%, #1A0A10 100%)",
                  padding: "14px 16px",
                  borderBottom: "2px solid #C42B47",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}>
                  {/* Club badge */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "linear-gradient(135deg, #C42B47, #8B1D32)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 900, color: "white", marginBottom: 2,
                    }}>FCM</div>
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)" }}>FC METZ</div>
                  </div>

                  {/* Player identity (conditional) */}
                  {options.identity ? (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: player.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white" }}>
                          {player.avatarInitials}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "white", fontFamily: "var(--font-dm-sans)" }}>
                            {player.firstName.toUpperCase()} {player.name.toUpperCase()}
                          </div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>
                            {player.positionShort} · {player.age} ans · {player.nationality} {player.flag}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
                        <span>⚽ {player.club}</span>
                        <span>💰 {player.value}</span>
                        <span>📅 {player.contractEnd}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 5, width: "70%" }} />
                      <div style={{ height: 7, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 4, width: "40%" }} />
                    </div>
                  )}

                  {/* Note badge (top right of header) */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: NOTE_CONFIG[lastReport.note].bg,
                      border: `1px solid ${NOTE_CONFIG[lastReport.note].color}50`,
                      fontSize: 16, fontWeight: 900, color: NOTE_CONFIG[lastReport.note].color,
                      fontFamily: "var(--font-dm-sans)",
                    }}>{lastReport.note}</div>
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>NOTE</div>
                  </div>
                </div>

                {/* PDF evaluation section */}
                <div style={{ padding: "12px 14px" }}>
                  {/* Status row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <StatusBadge status={lastReport.status} small />
                    <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>·</span>
                    <span style={{ fontSize: 9, color: "var(--color-neutral-500)" }}>
                      {KANBAN_OPTIONS.find(k => k.id === lastReport.kanban)?.label}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>·</span>
                    <SourceBadge source={lastReport.source} />
                  </div>

                  {/* Radar placeholder */}
                  {options.radar && (
                    <div style={{
                      height: 80, borderRadius: 6, marginBottom: 10,
                      backgroundColor: "rgba(196,43,71,0.05)",
                      border: "1px solid rgba(196,43,71,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ textAlign: "center" }}>
                        {/* Mini radar visual */}
                        <svg width={60} height={60} viewBox="-30 -30 60 60">
                          {[0.3, 0.6, 1].map((r, i) => {
                            const pts = Array.from({length:8},(_,j)=>{
                              const a=(j/8)*Math.PI*2-Math.PI/2;
                              return `${(Math.cos(a)*25*r).toFixed(1)},${(Math.sin(a)*25*r).toFixed(1)}`;
                            }).join(" ");
                            return <polygon key={i} points={pts} fill="none" stroke="rgba(196,43,71,0.2)" strokeWidth="0.5"/>;
                          })}
                          <polygon points="0,-22 14,-12 20,8 10,20 -10,20 -20,8 -14,-12 0,-22" fill="rgba(196,43,71,0.25)" stroke="#C42B47" strokeWidth="1.5"/>
                        </svg>
                        <div style={{ fontSize: 8, color: "var(--color-neutral-600)", marginTop: 2 }}>Radar Chart</div>
                      </div>
                    </div>
                  )}

                  {/* With/Without placeholder */}
                  {options.withwithout && (
                    <div style={{
                      height: 40, borderRadius: 6, marginBottom: 10,
                      backgroundColor: "rgba(59,130,246,0.05)",
                      border: "1px dashed rgba(59,130,246,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: "var(--color-neutral-600)",
                    }}>
                      Impact With / Without — Tableau comparatif équipe
                    </div>
                  )}

                  {/* Comment preview */}
                  {options.comments && (
                    <div>
                      <div style={{ fontSize: 8, color: "var(--color-neutral-600)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Analyse</div>
                      <div style={{ fontSize: 8, color: "var(--color-neutral-500)", lineHeight: 1.5 }}>
                        {lastReport.comment.slice(0, 120)}…
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF footer */}
                <div style={{ padding: "6px 14px", borderTop: "1px solid var(--color-neutral-700)", display: "flex", justifyContent: "space-between", fontSize: 8, color: "var(--color-neutral-700)" }}>
                  <span>Metz Data Lab · FC Metz Recrutement · Confidentiel</span>
                  <span>{new Date().toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--color-neutral-700)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--color-neutral-600)" }}>
              {Object.values(options).filter(Boolean).length} section(s) sélectionnée(s)
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={onClose}
                style={{ padding: "7px 16px", borderRadius: 7, backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)", color: "var(--color-neutral-400)", cursor: "pointer", fontSize: 12 }}
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                style={{
                  padding: "7px 18px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: exporting ? "#8B1D32" : "linear-gradient(135deg, #C42B47, #D4A017)",
                  border: "none", color: "white",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "opacity 0.15s",
                }}
              >
                <Download size={13} />
                {exporting ? "Génération…" : "Exporter PDF →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export function RapportsTab() {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [tooltip,      setTooltip]      = useState<{ report: ScoutReport; x: number; y: number } | null>(null);
  const [createPlayer, setCreatePlayer] = useState<PlayerTarget | null>(null);
  const [detailState,  setDetailState]  = useState<{ report: ScoutReport; player: PlayerTarget } | null>(null);
  const [pdfPlayer,    setPdfPlayer]    = useState<PlayerTarget | null>(null);
  const [submitted,    setSubmitted]    = useState<string | null>(null);

  const handleDotHover = useCallback((e: React.MouseEvent, report: ScoutReport) => {
    setTooltip({ report, x: e.clientX, y: e.clientY });
  }, []);
  const handleDotLeave = useCallback(() => setTooltip(null), []);
  const handleDotClick = useCallback((report: ScoutReport, player: PlayerTarget) => {
    setTooltip(null);
    setDetailState({ report, player });
  }, []);

  // Filter players
  const filtered = RAPPORT_PLAYERS.filter((p) => {
    const matchSearch = search === "" ||
      `${p.firstName} ${p.name} ${p.club}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" ||
      p.reports.some(r => r.status === statusFilter);
    return matchSearch && matchStatus;
  });

  const statusCounts = (Object.keys(STATUS_CONFIG) as ReportStatus[]).reduce((acc, s) => {
    acc[s] = RAPPORT_PLAYERS.filter(p => p.reports.some(r => r.status === s)).length;
    return acc;
  }, {} as Record<ReportStatus, number>);

  const FILTER_OPTIONS: { id: ReportStatus | "all"; label: string; count?: number }[] = [
    { id: "all",      label: "Tous", count: RAPPORT_PLAYERS.length },
    { id: "priorite", label: "Priorité",  count: statusCounts.priorite },
    { id: "pret",     label: "Prêt",      count: statusCounts.pret     },
    { id: "suivre",   label: "À suivre",  count: statusCounts.suivre   },
    { id: "ecarte",   label: "Écarté",    count: statusCounts.ecarte   },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100%", backgroundColor: "var(--color-neutral-900)" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{
            fontSize: 20, fontWeight: 800, color: "var(--color-neutral-100)",
            fontFamily: "var(--font-dm-sans)", marginBottom: 4,
          }}>
            Rapports de Scouting
          </h2>
          <p style={{ fontSize: 12, color: "var(--color-neutral-500)" }}>
            {RAPPORT_PLAYERS.length} joueurs suivis · {RAPPORT_PLAYERS.reduce((a, p) => a + p.reports.length, 0)} rapports au total
          </p>
        </div>
        <button
          onClick={() => setCreatePlayer(RAPPORT_PLAYERS[0])}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
            backgroundColor: "rgba(196,43,71,0.18)", border: "1px solid rgba(196,43,71,0.45)",
            color: "#F4A0AF",
          }}
        >
          <Plus size={14} strokeWidth={2.5} /> Nouveau Rapport
        </button>
      </div>

      {/* Search + filters bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "0 0 260px" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-600)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un joueur, club…"
            style={{
              width: "100%", padding: "7px 11px 7px 30px", borderRadius: 8,
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-700)",
              color: "var(--color-neutral-200)", fontSize: 12, outline: "none",
              fontFamily: "var(--font-sans)", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Status filter pills */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {FILTER_OPTIONS.map(({ id, label, count }) => {
            const active = statusFilter === id;
            const cfg = id !== "all" ? STATUS_CONFIG[id] : null;
            return (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 11, cursor: "pointer",
                  backgroundColor: active ? (cfg ? cfg.bg : "rgba(255,255,255,0.08)") : "var(--color-neutral-800)",
                  border: `1px solid ${active ? (cfg ? cfg.border : "rgba(255,255,255,0.2)") : "var(--color-neutral-700)"}`,
                  color: active ? (cfg ? cfg.color : "var(--color-neutral-200)") : "var(--color-neutral-400)",
                  fontWeight: active ? 600 : 400,
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.12s",
                }}
              >
                {cfg && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.color, display: "inline-block" }} />}
                {label}
                {count !== undefined && (
                  <span style={{
                    minWidth: 16, height: 16, borderRadius: 999, padding: "0 4px",
                    backgroundColor: active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.06)",
                    color: active ? (cfg ? cfg.color : "var(--color-neutral-200)") : "var(--color-neutral-600)",
                    fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 9, color: "var(--color-neutral-700)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Progression →</span>
          {(["ecarte","suivre","pret","priorite"] as ReportStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: STATUS_CONFIG[s].dot, boxShadow: `0 0 5px ${STATUS_CONFIG[s].dot}80` }} />
              <span style={{ fontSize: 9, color: "var(--color-neutral-600)" }}>{STATUS_CONFIG[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Player list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-neutral-600)", fontSize: 13 }}>
          Aucun joueur ne correspond à ce filtre.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((player) => (
            <PlayerRow
              key={player.id}
              player={player}
              onDotHover={handleDotHover}
              onDotLeave={handleDotLeave}
              onDotClick={handleDotClick}
              onAddReport={setCreatePlayer}
              onExportPDF={setPdfPlayer}
            />
          ))}
        </div>
      )}

      {/* Submission success toast */}
      {submitted && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          backgroundColor: "#0F2A1A", border: "1px solid rgba(34,197,94,0.4)",
          borderRadius: 9, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", gap: 9, fontSize: 12,
          color: "#22C55E",
          animation: "fadeInUp 0.25s ease-out",
        }}>
          <Check size={15} strokeWidth={2.5} />
          Rapport publié avec succès — {submitted}
        </div>
      )}

      {/* Floating tooltip (hover on dots) */}
      {tooltip && <DotTooltip report={tooltip.report} x={tooltip.x} y={tooltip.y} />}

      {/* Create modal */}
      {createPlayer && (
        <CreateReportModal
          player={createPlayer}
          onClose={() => setCreatePlayer(null)}
          onSubmit={(p) => {
            setCreatePlayer(null);
            setSubmitted(`${p.firstName} ${p.name}`);
            setTimeout(() => setSubmitted(null), 3500);
          }}
        />
      )}

      {/* Report detail drawer */}
      {detailState && (
        <ReportDetailDrawer
          report={detailState.report}
          player={detailState.player}
          onClose={() => setDetailState(null)}
        />
      )}

      {/* PDF config modal */}
      {pdfPlayer && (
        <PDFConfigModal
          player={pdfPlayer}
          onClose={() => setPdfPlayer(null)}
        />
      )}

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
