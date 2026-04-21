"use client";

import { useState } from "react";
import { POSITION_APPEARANCES } from "@/data/enzo-millot";
import type { PositionAppearance } from "@/data/enzo-millot";

const PW = 224;
const PH = 352;
const PAD = 8;

const RESULT_COLORS: Record<string, string> = {
  V: "#22C55E",
  N: "#EAB308",
  D: "#EF4444",
};

function FullPitch({
  positions,
  activePos,
  onSelect,
}: {
  positions: PositionAppearance[];
  activePos: PositionAppearance | null;
  onSelect: (pos: PositionAppearance | null) => void;
}) {
  return (
    <svg
      width={PW}
      height={PH}
      viewBox={`0 0 ${PW} ${PH}`}
      style={{ display: "block", cursor: "default", flexShrink: 0 }}
      onClick={() => onSelect(null)}
    >
      {/* Pitch background */}
      <rect width={PW} height={PH} fill="#112211" rx={4} />

      {/* Pitch outline */}
      <rect
        x={PAD} y={PAD}
        width={PW - PAD * 2} height={PH - PAD * 2}
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.8}
      />

      {/* Halfway line */}
      <line
        x1={PAD} y1={PH / 2}
        x2={PW - PAD} y2={PH / 2}
        stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}
      />

      {/* Centre circle */}
      <circle cx={PW / 2} cy={PH / 2} r={22} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
      <circle cx={PW / 2} cy={PH / 2} r={2} fill="rgba(255,255,255,0.3)" />

      {/* Top penalty box */}
      <rect
        x={PW * 0.2} y={PAD}
        width={PW * 0.6} height={PH * 0.22}
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}
      />
      {/* Top 6-yard box */}
      <rect
        x={PW * 0.33} y={PAD}
        width={PW * 0.34} height={PH * 0.085}
        fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={0.6}
      />

      {/* Bottom penalty box */}
      <rect
        x={PW * 0.2} y={PH - PAD - PH * 0.22}
        width={PW * 0.6} height={PH * 0.22}
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}
      />
      {/* Bottom 6-yard box */}
      <rect
        x={PW * 0.33} y={PH - PAD - PH * 0.085}
        width={PW * 0.34} height={PH * 0.085}
        fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={0.6}
      />

      {/* Position circles */}
      {positions.map((pos) => {
        const cx = pos.x * PW;
        const cy = pos.y * PH;
        const isActive = activePos?.position === pos.position;
        const r = pos.matches >= 10 ? 18 : 15;

        return (
          <g
            key={pos.position}
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(isActive ? null : pos);
            }}
          >
            {/* Pulse ring when active */}
            {isActive && (
              <circle
                cx={cx} cy={cy} r={r + 6}
                fill="none" stroke="#C42B47" strokeWidth={1.5} opacity={0.55}
              />
            )}
            {/* Background shadow */}
            <circle cx={cx} cy={cy} r={r + 1} fill="rgba(0,0,0,0.35)" />
            {/* Main circle */}
            <circle cx={cx} cy={cy} r={r} fill="#C42B47" />
            {/* Match count */}
            <text
              x={cx} y={cy + 4}
              textAnchor="middle"
              style={{
                fill: "white",
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {pos.matches}
            </text>
            {/* Position label below circle */}
            <text
              x={cx} y={cy + r + 11}
              textAnchor="middle"
              style={{
                fill: "rgba(255,255,255,0.65)",
                fontSize: 8,
                fontFamily: "var(--font-sans)",
              }}
            >
              {pos.position}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MatchDrawer({ pos, onClose }: { pos: PositionAppearance; onClose: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        borderLeft: "1px solid var(--color-neutral-700)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "slideInRight 150ms ease-out",
      }}
    >
      {/* Drawer header */}
      <div
        className="px-3 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-neutral-700)", flexShrink: 0 }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              backgroundColor: "#C42B47",
              color: "white",
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            {pos.position}
          </span>
          <div className="min-w-0">
            <p style={{ color: "var(--color-neutral-100)", fontSize: 12, fontWeight: 600 }}>
              {pos.label}
            </p>
            <p style={{ color: "var(--color-neutral-500)", fontSize: 10 }}>
              {pos.matches} match{pos.matches > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded"
          style={{
            width: 22,
            height: 22,
            color: "var(--color-neutral-500)",
            backgroundColor: "var(--color-neutral-700)",
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Match list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {pos.matchList.map((m, i) => (
          <div
            key={i}
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid var(--color-neutral-700)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {/* Teams + result */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: `${RESULT_COLORS[m.result]}18`,
                  border: `1px solid ${RESULT_COLORS[m.result]}`,
                  color: RESULT_COLORS[m.result],
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {m.result}
              </span>
              <span
                style={{
                  color: "var(--color-neutral-200)",
                  fontSize: 11,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.home}{" "}
                <span style={{ color: "var(--color-neutral-600)" }}>·</span>{" "}
                {m.away}
              </span>
            </div>

            {/* Date + formation */}
            <div style={{ display: "flex", gap: 6, paddingLeft: 24 }}>
              <span style={{ color: "var(--color-neutral-500)", fontSize: 9 }}>{m.date}</span>
              <span
                style={{
                  color: "var(--color-neutral-400)",
                  fontSize: 9,
                  backgroundColor: "var(--color-neutral-700)",
                  padding: "1px 5px",
                  borderRadius: 3,
                }}
              >
                {m.formation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormationGrid() {
  const [activePos, setActivePos] = useState<PositionAppearance | null>(null);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: "var(--color-neutral-800)",
        border: "1px solid var(--color-neutral-700)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-2"
        style={{ flexShrink: 0 }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}
        >
          Positions jouées
        </span>
      </div>

      {/* Pitch + optional drawer */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ padding: "4px 16px 16px 16px", flexShrink: 0 }}>
          <FullPitch
            positions={POSITION_APPEARANCES}
            activePos={activePos}
            onSelect={setActivePos}
          />
        </div>

        {activePos && (
          <MatchDrawer pos={activePos} onClose={() => setActivePos(null)} />
        )}
      </div>
    </div>
  );
}
