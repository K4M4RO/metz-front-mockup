"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mdl-theme") as "dark" | "light" | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mdl-theme", next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor =
          "var(--color-neutral-700)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor =
          "transparent")
      }
      style={{ transition: "background-color 120ms ease-out" }}
    >
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={1.5} style={{ color: "var(--color-neutral-400)" }} />
      ) : (
        <Moon size={18} strokeWidth={1.5} style={{ color: "var(--color-neutral-400)" }} />
      )}
    </button>
  );
}
