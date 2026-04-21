"use client";

import { useState } from "react";

const TABS = [
  { id: "attributes", label: "Attributs" },
  { id: "analyse",    label: "Analyse" },
  { id: "equipe",     label: "Équipe" },
  { id: "rapports",   label: "Rapports" },
  { id: "blessures",  label: "Blessures" },
];

interface Props {
  active?: string;
  onChange?: (id: string) => void;
}

export function TabBar({ active = "attributes", onChange }: Props) {
  return (
    <div
      className="flex items-end gap-0 px-6 flex-shrink-0 overflow-x-auto"
      style={{
        backgroundColor: "var(--color-neutral-900)",
        borderBottom: "1px solid var(--color-neutral-700)",
        height: 44,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            className="relative flex items-center h-full px-4 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0"
            style={{
              color: isActive
                ? "var(--color-neutral-100)"
                : "var(--color-neutral-400)",
              fontFamily: "var(--font-dm-sans)",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-neutral-200)";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-neutral-400)";
            }}
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: 2,
                  backgroundColor: "var(--color-primary-500)",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
