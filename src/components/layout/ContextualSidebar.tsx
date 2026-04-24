"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Compass, Kanban, Bookmark, Sliders, FileText, GitCompare, ChevronRight,
  LayoutDashboard, Radio, ClipboardList, Video, Target,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
}

interface ModuleConfig {
  title: string;
  subtitle?: string;
  rootPrefix: string[];
  flat: NavItem[];
}

// ─── Module Configs ───────────────────────────────────────────────────────────

const RECRUTEMENT: ModuleConfig = {
  title: "Recrutement",
  rootPrefix: ["/", "/recrutement"],
  flat: [
    { id: "exploration", icon: Compass,    label: "Exploration", href: "/" },
    { id: "campagnes",   icon: Kanban,     label: "Campagnes",   href: "/recrutement/campagnes" },
    { id: "shortlists",  icon: Bookmark,   label: "Shortlists",  href: "/recrutement/shortlists" },
    { id: "simulateur",  icon: Sliders,    label: "Simulateur",  href: "/recrutement/simulateur" },
    { id: "rapports",    icon: FileText,   label: "Rapports",    href: "/recrutement/rapports" },
    { id: "comparateur", icon: GitCompare, label: "Comparateur", href: "/recrutement/comparateur" },
  ],
};

const STAFF: ModuleConfig = {
  title: "Staff",
  subtitle: "Performance",
  rootPrefix: ["/match-center", "/staff"],
  flat: [
    { id: "dashboard",   icon: LayoutDashboard, label: "Dashboard",           href: "/staff" },
    { id: "pre-match",   icon: ClipboardList,   label: "Pré-Match",           href: "/staff/pre-match" },
    { id: "post-match",  icon: FileText,        label: "Post-Match",          href: "/staff/post-match" },
    { id: "cpa",         icon: Target,          label: "CPA",                 href: "/staff/cpa" },
    { id: "comparaison", icon: GitCompare,      label: "Comparaison d'équipes", href: "/staff/comparaison" },
    { id: "live",        icon: Radio,           label: "Live Match",          href: "/match-center" },
    { id: "exports",     icon: Video,           label: "Exports Vidéo (XML)", href: "/staff/exports" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveModule(pathname: string): ModuleConfig {
  for (const prefix of STAFF.rootPrefix) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return STAFF;
  }
  return RECRUTEMENT;
}

function resolveActive(items: NavItem[], pathname: string): string {
  // Find the longest-matching href to avoid /staff matching /staff/effectif
  let bestId = items[0]?.id ?? "";
  let bestLen = 0;
  for (const item of items) {
    if (item.href === "/" && pathname === "/") return item.id;
    if (item.href !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/"))) {
      if (item.href.length > bestLen) {
        bestId  = item.id;
        bestLen = item.href.length;
      }
    }
  }
  return bestId;
}

// ─── Shared link styles ───────────────────────────────────────────────────────

function NavLink({
  item, isActive, accentColor,
}: {
  item: NavItem; isActive: boolean; accentColor?: string;
}) {
  const accent = accentColor ?? "#C42B47";
  return (
    <Link
      href={item.href}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "8px 12px", borderRadius: 6, textDecoration: "none",
        fontSize: 11, fontWeight: isActive ? 800 : 600,
        backgroundColor: isActive ? accent : "transparent",
        color: isActive ? "white" : "var(--color-neutral-400)",
        textTransform: isActive ? "uppercase" : "none",
        fontFamily: isActive ? "var(--font-display)" : "inherit",
        letterSpacing: isActive ? "0.03em" : "normal",
        transition: "all 150ms ease",
      }}
      onMouseEnter={e => {
        if (!isActive) {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "rgba(139, 26, 43, 0.08)";
          el.style.color = "var(--color-primary-500)";
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "transparent";
          el.style.color = "var(--color-neutral-400)";
        }
      }}
    >
      <item.icon
        size={14}
        strokeWidth={isActive ? 2.5 : 1.5}
        style={{ color: isActive ? "white" : "var(--color-neutral-500)", flexShrink: 0 }}
      />
      <span style={{ flex: 1 }}>{item.label}</span>
      {isActive && (
        <ChevronRight size={12} strokeWidth={2} style={{ color: accent, opacity: 0.7 }} />
      )}
    </Link>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContextualSidebar() {
  const pathname = usePathname() || "/";
  const module   = resolveModule(pathname);
  const activeId = resolveActive(module.flat, pathname);

  return (
    <aside style={{
      width: 232, display: "flex", flexDirection: "column", flexShrink: 0,
      backgroundColor: "var(--color-neutral-900)",
      borderRight: "1px solid var(--color-neutral-800)",
    }}>

      {/* Module header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--color-neutral-800)" }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--color-neutral-100)", margin: 0, fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}>
          {module.title}
          {module.subtitle && (
            <>
              <span style={{ color: "#C42B47", margin: "0 3px" }}>·</span>
              <span style={{ color: "#C42B47" }}>{module.subtitle}</span>
            </>
          )}
        </h2>
        <p style={{ fontSize: 10, color: "var(--color-neutral-600)", margin: "3px 0 0" }}>Module actif</p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 8px", display: "flex", flexDirection: "column", gap: 0, overflowY: "auto" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {module.flat.map(item => (
            <NavLink
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              accentColor="var(--color-primary-500)"
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--color-neutral-800)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: "#C42B47" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-neutral-300)", fontFamily: "var(--font-display)" }}>
            FC Metz
          </span>
          <span style={{
            marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 4,
            background: "rgba(196,43,71,0.15)", border: "1px solid rgba(196,43,71,0.3)",
            color: "#C42B47", fontWeight: 700,
          }}>Pro</span>
        </div>
        <p style={{ fontSize: 10, color: "var(--color-neutral-600)", margin: "3px 0 0" }}>Saison 2024–25</p>
      </div>
    </aside>
  );
}
