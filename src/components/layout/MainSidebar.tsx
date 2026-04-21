"use client";

import { useState } from "react";
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
          className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: "var(--color-primary-900)" }}
        >
          {/* FC Metz Grenat badge — simplified SVG */}
          <svg viewBox="0 0 40 40" width="32" height="32" fill="none">
            <path
              d="M20 4 L34 10 L34 22 C34 30 20 38 20 38 C20 38 6 30 6 22 L6 10 Z"
              fill="var(--color-primary-600)"
            />
            <path
              d="M20 8 L30 13 L30 22 C30 28.5 20 35 20 35 C20 35 10 28.5 10 22 L10 13 Z"
              fill="var(--color-primary-800)"
            />
            <text
              x="20"
              y="25"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="var(--color-primary-200)"
              fontFamily="var(--font-dm-sans)"
            >
              FCM
            </text>
          </svg>
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
                  ? "var(--color-primary-900)"
                  : "transparent",
                transition: "background-color 120ms ease-out",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--color-neutral-700)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
              }}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                style={{
                  color: isActive
                    ? "var(--color-primary-400)"
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
              "var(--color-neutral-700)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
          style={{ transition: "background-color 120ms ease-out" }}
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-primary-800)",
              color: "var(--color-primary-200)",
              fontFamily: "var(--font-dm-sans)",
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
                      fontFamily: "var(--font-dm-sans)",
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
                      "var(--color-neutral-700)")
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
                      "var(--color-neutral-700)")
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
