"use client";

import { useState } from "react";
import { Search, Plus, Filter, Kanban, Calendar, User, MoreVertical, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  title: string;
  role: string;
  status: "Active" | "Archivée" | "Brouillon";
  responsible: string;
  createdAt: string;
  playerCount: number;
  priority: "Haute" | "Moyenne" | "Basse";
  tags: string[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  {
    id: "ld-2025",
    title: "Recherche Latéral Droit",
    role: "Défenseur (Latéral)",
    status: "Active",
    responsible: "Thomas Richard",
    createdAt: "12/01/2025",
    playerCount: 11,
    priority: "Haute",
    tags: ["Mercato Hiver", "Prio 1"],
  },
  {
    id: "bu-2025",
    title: "Buteur - Ligue 2 / National",
    role: "Attaquant",
    status: "Active",
    responsible: "Jean Martin",
    createdAt: "05/02/2025",
    playerCount: 8,
    priority: "Moyenne",
    tags: ["Jeunes Talents"],
  },
  {
    id: "mc-u21",
    title: "Milieu Créateur U21 France",
    role: "Milieu",
    status: "Brouillon",
    responsible: "David Garcia",
    createdAt: "18/02/2025",
    playerCount: 4,
    priority: "Basse",
    tags: ["Formation"],
  },
  {
    id: "dc-xp",
    title: "Défenseur Central d'Expérience",
    role: "Défenseur (Central)",
    status: "Archivée",
    responsible: "Thomas Richard",
    createdAt: "10/11/2024",
    playerCount: 15,
    priority: "Moyenne",
    tags: ["Terminé"],
  },
];

// ─── Helper Components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const styles = {
    Active: { bg: "rgba(34,197,94,0.1)", color: "#4ADE80", border: "rgba(34,197,94,0.2)" },
    Archivée: { bg: "rgba(107,114,128,0.1)", color: "#9CA3AF", border: "rgba(107,114,128,0.2)" },
    Brouillon: { bg: "rgba(234,179,8,0.1)", color: "#FDE047", border: "rgba(234,179,8,0.2)" },
  };

  const style = styles[status];

  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: 600,
      backgroundColor: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      display: "inline-flex",
      alignItems: "center",
      gap: "4px"
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: style.color }} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Campaign["priority"] }) {
  const colors = {
    Haute: "#EF4444",
    Moyenne: "#F59E0B",
    Basse: "#3B82F6",
  };

  return (
    <span style={{
      fontSize: "10px",
      fontWeight: 700,
      color: "var(--color-neutral-500)",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    }}>
      Priorité <span style={{ color: colors[priority] }}>{priority}</span>
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CampagnesPage() {
  const [search, setSearch] = useState("");

  const filteredCampaigns = CAMPAIGNS.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.responsible.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      padding: "32px",
      backgroundColor: "var(--color-neutral-950)",
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "var(--color-neutral-100)" }}>
            Campagnes de recrutement
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--color-neutral-500)", fontSize: "14px" }}>
            Gérez vos pipelines de scouting et le suivi des cibles prioritaires.
          </p>
        </div>
        <button style={{
          padding: "10px 20px",
          backgroundColor: "var(--color-primary-400)",
          color: "var(--text-on-accent)",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          transition: "transform 0.1s"
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <Plus size={18} />
          Nouvelle campagne
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: "flex",
        gap: "12px",
        padding: "16px",
        backgroundColor: "var(--color-neutral-900)",
        borderRadius: "12px",
        border: "1px solid var(--color-neutral-800)"
      }}>
        <div style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <Search size={16} style={{ position: "absolute", left: "12px", color: "var(--color-neutral-500)" }} />
          <input
            type="text"
            placeholder="Rechercher une campagne..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 10px 10px 38px",
              backgroundColor: "var(--color-neutral-800)",
              border: "1px solid var(--color-neutral-700)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 16px",
          backgroundColor: "transparent",
          border: "1px solid var(--color-neutral-700)",
          borderRadius: "8px",
          color: "var(--color-neutral-300)",
          fontSize: "14px",
          cursor: "pointer"
        }}>
          <Filter size={16} />
          Filtres
        </button>
      </div>

      {/* Campaigns Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "20px"
      }}>
        {filteredCampaigns.map((campaign) => (
          <Link 
            key={campaign.id} 
            href={`/recrutement/campagnes/${campaign.id}`}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              backgroundColor: "var(--color-neutral-900)",
              border: "1px solid var(--color-neutral-800)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary-400)";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-neutral-800)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <StatusBadge status={campaign.status} />
                <button style={{ background: "none", border: "none", color: "var(--color-neutral-500)", cursor: "pointer" }}>
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Title & Role */}
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--color-neutral-100)" }}>
                  {campaign.title}
                </h3>
                <p style={{ margin: "4px 0 0", color: "var(--color-neutral-400)", fontSize: "13px" }}>
                  {campaign.role}
                </p>
              </div>

              {/* Stats */}
              <div style={{ 
                display: "flex", 
                gap: "16px", 
                padding: "12px", 
                backgroundColor: "var(--color-neutral-800)", 
                borderRadius: "10px" 
              }}>
                <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid var(--color-neutral-700)" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-neutral-100)" }}>{campaign.playerCount}</div>
                  <div style={{ fontSize: "10px", color: "var(--color-neutral-500)", textTransform: "uppercase", fontWeight: 600 }}>Joueurs</div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-neutral-100)" }}>12</div>
                  <div style={{ fontSize: "10px", color: "var(--color-neutral-500)", textTransform: "uppercase", fontWeight: 600 }}>Rapports</div>
                </div>
              </div>

              {/* Info Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-neutral-400)" }}>
                  <User size={14} />
                  <span>Resp: <strong>{campaign.responsible}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-neutral-400)" }}>
                  <Calendar size={14} />
                  <span>Créée le {campaign.createdAt}</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                marginTop: "4px", 
                paddingTop: "16px", 
                borderTop: "1px solid var(--color-neutral-800)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <PriorityBadge priority={campaign.priority} />
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-primary-400)", fontSize: "12px", fontWeight: 600 }}>
                  Voir Kanban <ArrowRight size={14} />
                </div>
              </div>

              {/* Icon Decoration */}
              <div style={{
                position: "absolute",
                right: "-10px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.03,
                pointerEvents: "none"
              }}>
                <Kanban size={120} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
