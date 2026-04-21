"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

// ─── Export XML Button ─────────────────────────────────────────────────────────

interface ExportXMLButtonProps {
  label?: string;
  filename?: string;
  size?: "sm" | "md";
}

export function ExportXMLButton({
  label = "XML",
  filename = "export.xml",
  size = "sm",
}: ExportXMLButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  function handleClick() {
    setState("loading");
    setTimeout(() => {
      setState("done");
      // Simulate download
      const blob = new Blob(
        [`<?xml version="1.0" encoding="UTF-8"?>\n<export filename="${filename}" />`],
        { type: "application/xml" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setTimeout(() => setState("idle"), 2000);
    }, 600);
  }

  const isSm = size === "sm";

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSm ? 4 : 5,
        padding: isSm ? "3px 8px" : "5px 12px",
        borderRadius: 5,
        fontSize: isSm ? 10 : 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        cursor: state === "loading" ? "wait" : "pointer",
        border: "1px solid",
        transition: "all 0.15s ease",
        background: state === "done"
          ? "rgba(34,197,94,0.12)"
          : "rgba(196,43,71,0.10)",
        borderColor: state === "done"
          ? "rgba(34,197,94,0.40)"
          : "rgba(196,43,71,0.35)",
        color: state === "done"
          ? "#22C55E"
          : "var(--color-p-400)",
      }}
    >
      {state === "done" ? (
        <Check size={isSm ? 10 : 12} />
      ) : (
        <Download size={isSm ? 10 : 12} />
      )}
      {state === "done" ? "OK" : `[${label}]`}
    </button>
  );
}
