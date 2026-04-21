"use client";

import { Video } from "lucide-react";

export function ExportsPage() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "100%", gap: 12, color: "var(--color-neutral-500)",
    }}>
      <Video size={36} strokeWidth={1} />
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-neutral-400)" }}>Exports Vidéo (XML)</div>
      <div style={{ fontSize: 13 }}>En cours de développement</div>
    </div>
  );
}
