"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, TrendingUp, Activity, Settings, LogOut, User } from "lucide-react";

type Module = "recrutement" | "formation" | "staff";

const modules = [
  { id: "recrutement" as Module, icon: Search, label: "Recrutement" },
  { id: "formation" as Module, icon: TrendingUp, label: "Formation" },
  { id: "staff" as Module, icon: Activity, label: "Staff / GPS" },
];

export function MainSidebar() {
  const [activeModule, setActiveModule] = useState<Module>("recrutement");
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <aside
      className="w-16 flex flex-col items-center py-3 flex-shrink-0 border-r"
      style={{
        width: 64,
        backgroundColor: "var(--color-neutral-900)",
        borderColor: "var(--color-neutral-600)",
      }}
    >
      {/* Logo */}
      <div className="group relative mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ backgroundColor: "transparent" }}
        >
          <Image
            src="/fc-metz-logo.png"
            alt="FC Metz"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        {/* Tooltip */}
        <span
          className="absolute left-14 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50"
          style={{
            backgroundColor: "var(--color-neutral-700)",
            color: "var(--color-neutral-100)",
            fontSize: 12,
            transition: "opacity 120ms ease-out",
          }}
        >
          Metz Data Lab
        </span>
      </div>

      {/* Separator */}
      <div className="w-8 mb-4" style={{ height: 1, backgroundColor: "var(--color-neutral-700)" }} />

      {/* Module icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {modules.map(({ id, icon: Icon, label }) => {
          const isActive = activeModule === id;
          return (
            <button
              key={id}
              onClick={() => setActiveModule(id)}
              className="group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isActive
                  ? "var(--color-primary-500)"
                  : "transparent",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(var(--primary-rgb), 0.1)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
              }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{
                  color: isActive
                    ? "white"
                    : "var(--color-neutral-400)",
                }}
              />
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                  style={{ backgroundColor: "var(--color-primary-500)" }}
                />
              )}
              {/* Tooltip */}
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50"
                style={{
                  backgroundColor: "var(--color-neutral-700)",
                  color: "var(--color-neutral-100)",
                  fontSize: 12,
                  transition: "opacity 120ms ease-out",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        {/* Separator */}
        <div className="w-8 mb-1" style={{ height: 1, backgroundColor: "var(--color-neutral-700)" }} />

        {/* Settings */}
        <button
          className="group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(var(--primary-rgb), 0.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
          style={{ transition: "all 150ms ease" }}
        >
          <Settings
            size={20}
            strokeWidth={1.5}
            style={{ color: "var(--color-neutral-400)" }}
          />
          <span
            className="absolute left-14 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50"
            style={{
              backgroundColor: "var(--color-neutral-700)",
              color: "var(--color-neutral-100)",
              fontSize: 12,
              transition: "opacity 120ms ease-out",
            }}
          >
            Paramètres
          </span>
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setAvatarOpen((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: "var(--color-primary-500)",
              color: "white",
              fontFamily: "var(--font-display)",
            }}
          >
            IL
          </button>

          {/* Dropdown menu */}
          {avatarOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAvatarOpen(false)}
              />
              <div
                className="absolute left-12 bottom-0 w-44 rounded-lg overflow-hidden z-50"
                style={{
                  backgroundColor: "var(--color-neutral-800)",
                  border: "1px solid var(--color-neutral-600)",
                  boxShadow: "var(--shadow-dropdown)",
                }}
              >
                <div
                  className="px-3 py-2 border-b"
                  style={{ borderColor: "var(--color-neutral-600)" }}
                >
                  <p
                    className="text-xs font-medium"
                    style={{
                      color: "var(--color-neutral-100)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Imrane L.
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-neutral-500)" }}
                  >
                    Scout
                  </p>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                  style={{ color: "var(--color-neutral-300)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(var(--primary-rgb), 0.1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent")
                  }
                >
                  <User size={14} strokeWidth={1.5} />
                  Mon profil
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                  style={{ color: "var(--color-danger)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(var(--primary-rgb), 0.1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent")
                  }
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
