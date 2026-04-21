"use client";

import { useState, useRef, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { BookmarkPlus, Download, ChevronDown, X as XIcon } from "lucide-react";
import { type Player, type Position } from "@/data/players";

// ─── Position colors (from reference data) ────────────────────────────────────
export const POS_COLORS: Record<Position, string> = {
  AT: "#EF4444",
  AI: "#F97316",
  MO: "#A855F7",
  MC: "#3B82F6",
  MD: "#06B6D4",
  LD: "#22C55E",
  LG: "#10B981",
  DC: "#EAB308",
  GB: "#6B7280",
};

// ─── Axis config ──────────────────────────────────────────────────────────────
type AxisKey = "age" | "xG" | "xA" | "xThreat" | "speed" | "distance" | "note" | "marketValueNum";

interface AxisOption {
  key: AxisKey;
  label: string;
  format: (v: number) => string;
}

const AXIS_OPTIONS: AxisOption[] = [
  { key: "age",            label: "Âge",                  format: v => `${v} ans` },
  { key: "xG",             label: "xG / 90min",            format: v => v.toFixed(2) },
  { key: "xA",             label: "xA / 90min",            format: v => v.toFixed(2) },
  { key: "xThreat",        label: "xThreat / 90min",       format: v => v.toFixed(2) },
  { key: "speed",          label: "Vitesse max (km/h)",    format: v => `${v.toFixed(0)} km/h` },
  { key: "distance",       label: "Distance / 90 (km)",    format: v => `${v.toFixed(1)} km` },
  { key: "note",           label: "Note globale",          format: v => v.toFixed(1) },
  { key: "marketValueNum", label: "Valeur marchande (M€)", format: v => `${v}M€` },
];

const AXIS_TICK_LABELS: Record<AxisKey, string> = {
  age: "ans",
  xG: "xG",
  xA: "xA",
  xThreat: "xT",
  speed: "km/h",
  distance: "km",
  note: "/10",
  marketValueNum: "M€",
};

// ─── Axis selector dropdown ───────────────────────────────────────────────────
function AxisSelect({
  value,
  onChange,
  label,
}: {
  value: AxisKey;
  onChange: (k: AxisKey) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const current = AXIS_OPTIONS.find((o) => o.key === value)!;

  return (
    <div className="flex items-center gap-2 relative">
      <span className="text-xs font-medium" style={{ color: "var(--color-neutral-500)" }}>
        {label}
      </span>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors"
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
        {current.label}
        <ChevronDown size={12} strokeWidth={1.5} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-8 left-14 z-50 rounded-lg overflow-hidden"
            style={{
              width: 210,
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-600)",
              boxShadow: "var(--shadow-dropdown)",
            }}
          >
            {AXIS_OPTIONS.map((opt) => {
              const isActive = opt.key === value;
              return (
                <button
                  key={opt.key}
                  className="w-full text-left px-3 py-2 text-xs"
                  style={{
                    color: isActive ? "var(--color-primary-300)" : "var(--color-neutral-300)",
                    backgroundColor: isActive ? "rgba(196,43,71,0.12)" : "transparent",
                  }}
                  onClick={() => {
                    onChange(opt.key);
                    setOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "var(--color-neutral-700)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Custom SVG dot ───────────────────────────────────────────────────────────
interface DotProps {
  cx?: number;
  cy?: number;
  payload?: Player;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  onRegister: (id: number, cx: number, cy: number) => void;
  onPlayerClick: (p: Player) => void;
  onHover: (p: Player | null, mx?: number, my?: number) => void;
}

function CustomDot({
  cx = 0,
  cy = 0,
  payload,
  isSelected,
  isHovered,
  isDragging,
  onRegister,
  onPlayerClick,
  onHover,
}: DotProps) {
  if (!payload) return null;

  // Store pixel position for lasso selection (safe to do in render for a ref)
  onRegister(payload.id, cx, cy);

  const color = POS_COLORS[payload.position];
  // Radius 5–18px proportional to market value (1–55M€)
  const radius = Math.max(5, Math.min(18, 4 + (payload.marketValueNum / 55) * 14));

  return (
    <g>
      {/* Glow ring when selected */}
      {isSelected && (
        <circle cx={cx} cy={cy} r={radius + 5} fill={color} fillOpacity={0.18} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        fillOpacity={isSelected ? 1 : isHovered ? 0.95 : 0.72}
        stroke={isSelected ? "white" : isHovered ? color : "rgba(255,255,255,0.12)"}
        strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
        style={{
          cursor: isDragging ? "crosshair" : "pointer",
          transition: "fill-opacity 100ms",
        }}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation();
            onPlayerClick(payload);
          }
        }}
        onMouseEnter={(e) => {
          if (!isDragging) onHover(payload, e.clientX, e.clientY);
        }}
        onMouseLeave={() => onHover(null)}
      />
    </g>
  );
}

// ─── Hover tooltip (fixed positioning = no offset math needed) ────────────────
function HoverTooltip({
  player,
  mouseX,
  mouseY,
  xOpt,
  yOpt,
}: {
  player: Player;
  mouseX: number;
  mouseY: number;
  xOpt: AxisOption;
  yOpt: AxisOption;
}) {
  const color = POS_COLORS[player.position];
  return (
    <div
      style={{
        position: "fixed",
        left: mouseX + 16,
        top: mouseY - 28,
        zIndex: 9999,
        pointerEvents: "none",
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-600)",
        boxShadow: "var(--shadow-dropdown)",
        borderRadius: 10,
        padding: "10px 12px",
        minWidth: 190,
        maxWidth: 230,
      }}
    >
      {/* Player info */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "var(--color-primary-950)",
            color: "var(--color-primary-300)",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 600,
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${color}`,
            flexShrink: 0,
          }}
        >
          {player.initials}
        </div>
        <div className="min-w-0">
          <p
            className="truncate"
            style={{
              color: "var(--color-neutral-100)",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {player.firstName} {player.lastName}
          </p>
          <p style={{ color: "var(--color-neutral-500)", fontSize: 11 }}>{player.club}</p>
        </div>
      </div>

      {/* Values */}
      <div
        className="flex flex-col gap-1.5"
        style={{ borderTop: "1px solid var(--color-neutral-700)", paddingTop: 8 }}
      >
        {[
          { label: xOpt.label, value: xOpt.format(player[xOpt.key] as number) },
          { label: yOpt.label, value: yOpt.format(player[yOpt.key] as number) },
          { label: "Valeur marchande", value: player.marketValue },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span style={{ color: "var(--color-neutral-500)", fontSize: 11 }}>{label}</span>
            <span style={{ color: "var(--color-neutral-200)", fontSize: 11, fontWeight: 500 }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Selection panel (fixed bottom-right) ────────────────────────────────────
function SelectionPanel({
  selected,
  onClear,
}: {
  selected: Player[];
  onClear: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-600)",
        boxShadow: "var(--shadow-modal)",
        borderRadius: 12,
        padding: "14px 16px",
        minWidth: 240,
        animation: "slideUpIn 180ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          style={{
            color: "var(--color-neutral-100)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {selected.length} joueur{selected.length > 1 ? "s" : ""} sélectionné
          {selected.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={onClear}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors"
          style={{ color: "var(--color-neutral-500)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--color-neutral-200)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)")
          }
        >
          <XIcon size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Mini player list */}
      <div className="flex flex-col gap-1.5 mb-3">
        {selected.slice(0, 4).map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: POS_COLORS[p.position] }}
            />
            <span style={{ color: "var(--color-neutral-400)", fontSize: 11 }}>
              {p.firstName} {p.lastName}
              <span style={{ color: "var(--color-neutral-600)" }}> · {p.position}</span>
            </span>
          </div>
        ))}
        {selected.length > 4 && (
          <p style={{ color: "var(--color-neutral-600)", fontSize: 11 }}>
            +{selected.length - 4} autres
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ backgroundColor: "var(--color-primary-600)", color: "white" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-500)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-600)")
          }
        >
          <BookmarkPlus size={12} strokeWidth={1.5} />
          Ajouter à shortlist
        </button>
        <button
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors"
          style={{
            backgroundColor: "var(--color-neutral-700)",
            border: "1px solid var(--color-neutral-600)",
            color: "var(--color-neutral-300)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-600)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-neutral-700)")
          }
        >
          <Download size={12} strokeWidth={1.5} />
          Exporter
        </button>
      </div>

      <style>{`
        @keyframes slideUpIn {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main ScatterView ─────────────────────────────────────────────────────────
interface Props {
  players: Player[];
  onPlayerClick: (p: Player) => void;
}

export function ScatterView({ players, onPlayerClick }: Props) {
  const [xKey, setXKey] = useState<AxisKey>("age");
  const [yKey, setYKey] = useState<AxisKey>("xThreat");
  const [hovered, setHovered] = useState<{
    player: Player;
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selected, setSelected] = useState<Player[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);
  // Stores pixel positions of each dot (cx/cy from Recharts SVG coords)
  const dotPositions = useRef(new Map<number, { cx: number; cy: number }>());

  const xOpt = AXIS_OPTIONS.find((o) => o.key === xKey)!;
  const yOpt = AXIS_OPTIONS.find((o) => o.key === yKey)!;

  const registerDot = useCallback((id: number, cx: number, cy: number) => {
    dotPositions.current.set(id, { cx, cy });
  }, []);

  const handleHover = useCallback(
    (player: Player | null, mouseX?: number, mouseY?: number) => {
      if (player && mouseX !== undefined && mouseY !== undefined) {
        setHovered({ player, mouseX, mouseY });
      } else {
        setHovered(null);
      }
    },
    []
  );

  function getRelPos(e: React.MouseEvent) {
    const el = chartRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleMouseDown(e: React.MouseEvent) {
    const pos = getRelPos(e);
    if (!pos) return;
    setDragStart(pos);
    setDragCurrent(pos);
    setIsDragging(false);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragStart) return;
    const pos = getRelPos(e);
    if (!pos) return;
    const dist = Math.hypot(pos.x - dragStart.x, pos.y - dragStart.y);
    if (dist > 5) {
      setIsDragging(true);
      setDragCurrent(pos);
      setHovered(null); // hide tooltip during drag
    }
  }

  function finalizeDrag(endPos?: { x: number; y: number }) {
    const current = endPos ?? dragCurrent;
    if (isDragging && dragStart && current) {
      const minX = Math.min(dragStart.x, current.x);
      const maxX = Math.max(dragStart.x, current.x);
      const minY = Math.min(dragStart.y, current.y);
      const maxY = Math.max(dragStart.y, current.y);

      const newSelected: Player[] = [];
      for (const [id, pos] of dotPositions.current) {
        if (pos.cx >= minX && pos.cx <= maxX && pos.cy >= minY && pos.cy <= maxY) {
          const player = players.find((p) => p.id === id);
          if (player) newSelected.push(player);
        }
      }
      setSelected(newSelected);
    }
    setDragStart(null);
    setDragCurrent(null);
    setIsDragging(false);
  }

  function handleMouseUp(e: React.MouseEvent) {
    const pos = getRelPos(e);
    finalizeDrag(pos ?? undefined);
  }

  function handleMouseLeave() {
    if (isDragging) finalizeDrag();
    else {
      setDragStart(null);
      setDragCurrent(null);
    }
    setHovered(null);
  }

  return (
    <div className="flex flex-col h-full" style={{ userSelect: "none", position: "relative" }}>
      {/* ── Axis selectors bar ── */}
      <div
        className="flex items-center gap-4 px-5 py-3 border-b flex-shrink-0 flex-wrap"
        style={{
          borderColor: "var(--color-neutral-700)",
          backgroundColor: "var(--color-neutral-900)",
          minHeight: 52,
        }}
      >
        <AxisSelect value={xKey} onChange={setXKey} label="Axe X" />
        <span style={{ color: "var(--color-neutral-700)", fontSize: 18 }}>×</span>
        <AxisSelect value={yKey} onChange={setYKey} label="Axe Y" />

        <span className="text-xs" style={{ color: "var(--color-neutral-600)" }}>
          · taille des points ∝ valeur marchande
        </span>

        <span
          className="ml-auto text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: "rgba(196,43,71,0.10)",
            border: "1px solid rgba(196,43,71,0.25)",
            color: "var(--color-neutral-500)",
          }}
        >
          Cliquer-glisser pour sélectionner
        </span>

        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors"
            style={{
              color: "var(--color-neutral-400)",
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-700)",
            }}
          >
            <XIcon size={11} strokeWidth={2} />
            Effacer sélection
          </button>
        )}
      </div>

      {/* ── Chart + Legend ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart area — lasso events tracked here */}
        <div
          ref={chartRef}
          className="flex-1 relative overflow-hidden"
          style={{ cursor: isDragging ? "crosshair" : "default" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 24, right: 32, bottom: 56, left: 60 }}>
              <CartesianGrid
                strokeDasharray="2 6"
                stroke="var(--color-neutral-700)"
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey={xKey}
                type="number"
                domain={["auto", "auto"]}
                name={xOpt.label}
                tickFormatter={(v) => AXIS_TICK_LABELS[xKey] ? `${v}` : v}
                tick={{ fill: "var(--color-neutral-500)", fontSize: 10, fontFamily: "var(--font-sans)" }}
                axisLine={{ stroke: "var(--color-neutral-700)" }}
                tickLine={{ stroke: "var(--color-neutral-700)" }}
                label={{
                  value: xOpt.label,
                  position: "insideBottom",
                  offset: -16,
                  fill: "var(--color-neutral-400)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <YAxis
                dataKey={yKey}
                type="number"
                domain={["auto", "auto"]}
                name={yOpt.label}
                tickFormatter={(v) => `${v}`}
                tick={{ fill: "var(--color-neutral-500)", fontSize: 10, fontFamily: "var(--font-sans)" }}
                axisLine={{ stroke: "var(--color-neutral-700)" }}
                tickLine={{ stroke: "var(--color-neutral-700)" }}
                label={{
                  value: yOpt.label,
                  angle: -90,
                  position: "insideLeft",
                  offset: 14,
                  fill: "var(--color-neutral-400)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <Scatter
                data={players}
                isAnimationActive={false}
                shape={(props: unknown) => {
                  const p = props as { cx?: number; cy?: number; payload?: Player };
                  return (
                    <CustomDot
                      cx={p.cx}
                      cy={p.cy}
                      payload={p.payload}
                      isSelected={selected.some((s) => s.id === p.payload?.id)}
                      isHovered={hovered?.player.id === p.payload?.id}
                      isDragging={isDragging}
                      onRegister={registerDot}
                      onPlayerClick={onPlayerClick}
                      onHover={handleHover}
                    />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>

          {/* ── Lasso selection rectangle ── */}
          {isDragging && dragStart && dragCurrent && (
            <div
              style={{
                position: "absolute",
                left: Math.min(dragStart.x, dragCurrent.x),
                top: Math.min(dragStart.y, dragCurrent.y),
                width: Math.abs(dragCurrent.x - dragStart.x),
                height: Math.abs(dragCurrent.y - dragStart.y),
                border: "1.5px dashed var(--color-primary-500)",
                backgroundColor: "rgba(196,43,71,0.07)",
                pointerEvents: "none",
                borderRadius: 2,
              }}
            />
          )}
        </div>

        {/* ── Legend sidebar ── */}
        <div
          className="flex-shrink-0 py-5 px-4 border-l flex flex-col gap-1.5"
          style={{
            width: 116,
            borderColor: "var(--color-neutral-700)",
            backgroundColor: "var(--color-neutral-900)",
            overflowY: "auto",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-neutral-500)" }}
          >
            Postes
          </p>
          {(Object.entries(POS_COLORS) as [Position, string][]).map(([pos, color]) => (
            <div key={pos} className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-medium" style={{ color: "var(--color-neutral-400)" }}>
                {pos}
              </span>
            </div>
          ))}

          {/* Size legend */}
          <div
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid var(--color-neutral-700)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-neutral-500)" }}
            >
              Taille
            </p>
            <div className="flex items-end gap-2">
              {[6, 10, 14].map((r) => (
                <div
                  key={r}
                  className="rounded-full"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    backgroundColor: "var(--color-neutral-600)",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--color-neutral-600)", fontSize: 10 }}>
              ∝ valeur marchande
            </p>
          </div>
        </div>
      </div>

      {/* ── Hover tooltip (fixed) ── */}
      {hovered && !isDragging && (
        <HoverTooltip
          player={hovered.player}
          mouseX={hovered.mouseX}
          mouseY={hovered.mouseY}
          xOpt={xOpt}
          yOpt={yOpt}
        />
      )}

      {/* ── Selection panel (fixed bottom-right) ── */}
      {selected.length > 0 && (
        <SelectionPanel selected={selected} onClear={() => setSelected([])} />
      )}
    </div>
  );
}
