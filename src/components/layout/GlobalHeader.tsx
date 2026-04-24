"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NOTIFICATIONS = 3;

function Breadcrumb() {
  const pathname = usePathname();
  const isProfile = pathname?.includes("/recrutement/joueurs/");
  const isCampagnes = pathname?.includes("/recrutement/campagnes");

  if (isProfile) {
    return (
      <nav className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
          Recrutement
        </span>
        <ChevronRight size={12} strokeWidth={1.5} style={{ color: "var(--color-neutral-600)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--color-neutral-300)" }}>
          Enzo Millot
        </span>
      </nav>
    );
  }

  if (isCampagnes) {
    return (
      <nav className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
          Recrutement
        </span>
        <ChevronRight size={12} strokeWidth={1.5} style={{ color: "var(--color-neutral-600)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--color-neutral-300)" }}>
          Campagnes
        </span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 flex-shrink-0">
      <span className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
        Recrutement
      </span>
      <ChevronRight size={12} strokeWidth={1.5} style={{ color: "var(--color-neutral-600)" }} />
      <span className="text-xs font-medium" style={{ color: "var(--color-neutral-300)" }}>
        Exploration
      </span>
    </nav>
  );
}

export function GlobalHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header
      className="flex items-center gap-4 px-6 flex-shrink-0 border-b"
      style={{
        height: 56,
        backgroundColor: "var(--color-neutral-900)",
        borderColor: "var(--color-neutral-700)",
      }}
    >
      <Breadcrumb />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Global search — centered */}
      <div
        className="relative flex items-center gap-2 px-3 rounded-lg transition-colors"
        style={{
          width: 320,
          height: 34,
          backgroundColor: searchFocused
            ? "var(--color-neutral-700)"
            : "var(--color-neutral-800)",
          border: searchFocused
            ? "1px solid var(--color-primary-500)"
            : "1px solid var(--color-neutral-600)",
          transition: "all 120ms ease-out",
        }}
      >
        <Search
          size={14}
          strokeWidth={1.5}
          style={{
            color: searchFocused
              ? "var(--color-neutral-300)"
              : "var(--color-neutral-500)",
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          placeholder="Rechercher un joueur, un rapport..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{
            color: "var(--color-neutral-300)",
            fontSize: 13,
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {/* Keyboard shortcut hint */}
        <kbd
          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
          style={{
            color: "var(--color-neutral-500)",
            backgroundColor: "var(--color-neutral-700)",
            border: "1px solid var(--color-neutral-600)",
            fontSize: 10,
            fontFamily: "var(--font-sans)",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setAvatarOpen(false);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
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
            <Bell
              size={18}
              strokeWidth={1.5}
              style={{ color: "var(--color-neutral-400)" }}
            />
            {NOTIFICATIONS > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-primary-500)",
                  color: "white",
                  fontSize: 9,
                }}
              >
                {NOTIFICATIONS}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div
                className="absolute right-0 top-10 w-72 rounded-lg overflow-hidden z-50"
                style={{
                  backgroundColor: "var(--color-neutral-800)",
                  border: "1px solid var(--color-neutral-600)",
                  boxShadow: "var(--shadow-dropdown)",
                }}
              >
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: "var(--color-neutral-600)" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: "var(--color-neutral-100)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Notifications
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-primary-900)",
                      color: "var(--color-primary-300)",
                      fontSize: 10,
                    }}
                  >
                    {NOTIFICATIONS} nouvelles
                  </span>
                </div>
                {[
                  {
                    title: "Rapport mis à jour",
                    body: "Le rapport de K. Mbappé a été modifié par D. Martin",
                    time: "Il y a 5 min",
                    unread: true,
                  },
                  {
                    title: "Joueur ajouté à la shortlist",
                    body: "T. Müller a été ajouté à la shortlist MF-Créatif",
                    time: "Il y a 1h",
                    unread: true,
                  },
                  {
                    title: "Campagne archivée",
                    body: "La campagne « Ailier Droit S24 » a été archivée",
                    time: "Hier",
                    unread: false,
                  },
                ].map((notif, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: notif.unread
                        ? "rgba(196, 43, 71, 0.05)"
                        : "transparent",
                      borderBottom: "1px solid var(--color-neutral-700)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                        "var(--color-neutral-700)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                        notif.unread
                          ? "rgba(196, 43, 71, 0.05)"
                          : "transparent")
                    }
                  >
                    <div className="flex items-start gap-2">
                      {notif.unread && (
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{
                            backgroundColor: "var(--color-primary-500)",
                          }}
                        />
                      )}
                      <div className={notif.unread ? "" : "ml-3.5"}>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--color-neutral-200)" }}
                        >
                          {notif.title}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--color-neutral-500)" }}
                        >
                          {notif.body}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--color-neutral-600)", fontSize: 10 }}
                        >
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2">
                  <button
                    className="text-xs w-full text-center transition-colors"
                    style={{ color: "var(--color-primary-400)" }}
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical separator */}
        <div
          className="h-5"
          style={{
            width: 1,
            backgroundColor: "var(--color-neutral-700)",
          }}
        />

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setAvatarOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-neutral-800)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent")
            }
            style={{ transition: "background-color 120ms ease-out" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                backgroundColor: "var(--color-primary-500)",
                color: "white",
                fontFamily: "var(--font-display)",
              }}
            >
              IL
            </div>
            <div className="text-left hidden sm:block">
              <p
                className="text-xs font-medium leading-none"
                style={{
                  color: "var(--color-neutral-200)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Imrane L.
              </p>
              <p
                className="text-xs leading-none mt-0.5"
                style={{ color: "var(--color-neutral-500)", fontSize: 11 }}
              >
                Scout
              </p>
            </div>
          </button>

          {/* Avatar dropdown */}
          {avatarOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAvatarOpen(false)}
              />
              <div
                className="absolute right-0 top-10 w-44 rounded-lg overflow-hidden z-50"
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
                    imranelarhrib2017@gmail.com
                  </p>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
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
                  Mon profil
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
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
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
