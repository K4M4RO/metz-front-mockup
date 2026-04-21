"use client";

import { useState } from "react";

type SubTab = "rapports" | "medical";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "rapports", label: "Rapports" },
  { id: "medical",  label: "Médical" },
];

// ── Report data ───────────────────────────────────────────────────────────────
const REPORTS = [
  { id: 1, date: "14 avr. 2025", author: "M. Dupont", role: "Recruteur", type: "Analyse tactique", title: "Analyse complète vs Lyon", excerpt: "Excellente lecture du jeu en phase offensive. Pressing haut efficace à 78% de réussite. Bonne couverture de l'espace dans le couloir droit.", color: "#C42B47" },
  { id: 2, date: "02 mars 2025", author: "S. Bernard", role: "Analyste vidéo", type: "Note de match", title: "Prestation vs PSG (2-0)", excerpt: "Match référence. 3 passes décisives, 11 km parcourus. Leadership balle au pied remarquable. Duel aérien à améliorer (58%).", color: "#3B82F6" },
  { id: 3, date: "18 fév. 2025", author: "L. Martin", role: "Directeur sportif", type: "Évaluation saisonnière", title: "Bilan mi-saison 2024-25", excerpt: "Progression constante depuis septembre. Série de 8 matchs à +7.5 de note moyenne. Profil idéal pour passage au niveau supérieur.", color: "#D4A017" },
  { id: 4, date: "05 janv. 2025", author: "M. Dupont", role: "Recruteur", type: "Note de match", title: "Analyse vs Monaco (0-1)", excerpt: "Match difficile collectivement. Individu irréprochable : 94% de passes réussies, récupération haute du ballon à 3 reprises.", color: "#6B7280" },
];

const REPORT_TYPE_COLORS: Record<string, string> = {
  "Analyse tactique": "rgba(196,43,71,0.15)",
  "Note de match": "rgba(59,130,246,0.15)",
  "Évaluation saisonnière": "rgba(212,160,23,0.15)",
};
const REPORT_TYPE_BORDER: Record<string, string> = {
  "Analyse tactique": "rgba(196,43,71,0.35)",
  "Note de match": "rgba(59,130,246,0.35)",
  "Évaluation saisonnière": "rgba(212,160,23,0.35)",
};
const REPORT_TYPE_COLOR: Record<string, string> = {
  "Analyse tactique": "#F4A0AF",
  "Note de match": "#93C5FD",
  "Évaluation saisonnière": "#FDE68A",
};

// ── Injury data ───────────────────────────────────────────────────────────────
const INJURIES = [
  { id: 1, label: "Elongation ischio-jambier droit", start: "12 nov. 2024", end: "03 déc. 2024", days: 21, severity: "Modérée", status: "Rétabli", statusColor: "#22C55E" },
  { id: 2, label: "Contusion genou gauche", start: "08 sept. 2024", end: "15 sept. 2024", days: 7, severity: "Légère", status: "Rétabli", statusColor: "#22C55E" },
  { id: 3, label: "Surcharge musculaire quadriceps", start: "22 févr. 2024", end: "01 mars 2024", days: 8, severity: "Légère", status: "Rétabli", statusColor: "#22C55E" },
];

const SEVERITY_COLORS: Record<string, string> = {
  Légère: "#22C55E", Modérée: "#EAB308", Sévère: "#EF4444",
};

// ── Rapports sub-tab ──────────────────────────────────────────────────────────
function RapportsSubTab() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
          Historique des rapports
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: "rgba(196,43,71,0.18)",
            border: "1px solid rgba(196,43,71,0.45)",
            color: "var(--color-primary-300)",
          }}
        >
          + Nouveau rapport
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 2, backgroundColor: "var(--color-neutral-700)", left: 19 }}
        />
        <div className="space-y-3">
          {REPORTS.map((report) => (
            <div key={report.id} className="flex gap-4 relative">
              {/* Timeline dot */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold"
                style={{ backgroundColor: report.color, color: "white", border: "2px solid var(--color-neutral-900)" }}
              >
                {report.author.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>

              {/* Card */}
              <div
                className="flex-1 rounded-lg p-4"
                style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)" }}>
                      {report.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-neutral-500)" }}>
                      {report.author} · {report.role} · {report.date}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                    style={{
                      backgroundColor: REPORT_TYPE_COLORS[report.type] ?? "var(--color-neutral-700)",
                      border: `1px solid ${REPORT_TYPE_BORDER[report.type] ?? "var(--color-neutral-600)"}`,
                      color: REPORT_TYPE_COLOR[report.type] ?? "var(--color-neutral-400)",
                    }}
                  >
                    {report.type}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-neutral-400)" }}>
                  {report.excerpt}
                </p>
                <button
                  className="mt-2 text-xs"
                  style={{ color: "var(--color-primary-300)" }}
                >
                  Lire le rapport complet →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-xl pointer-events-auto"
              style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-600)", boxShadow: "0 24px 60px rgba(0,0,0,0.7)", width: 480 }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
                <span className="font-semibold" style={{ color: "var(--color-neutral-100)", fontFamily: "var(--font-dm-sans)" }}>Nouveau rapport</span>
                <button onClick={() => setShowModal(false)} style={{ color: "var(--color-neutral-500)", fontSize: 18, lineHeight: 1, cursor: "pointer", background: "none", border: "none" }}>✕</button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: "Titre", placeholder: "Ex: Analyse vs Paris SG" },
                  { label: "Type de rapport", placeholder: "Analyse tactique" },
                  { label: "Auteur", placeholder: "Votre nom" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="text-xs font-medium block mb-1" style={{ color: "var(--color-neutral-400)" }}>{label}</label>
                    <input
                      placeholder={placeholder}
                      style={{
                        width: "100%", padding: "8px 12px", borderRadius: 6,
                        backgroundColor: "var(--color-neutral-700)",
                        border: "1px solid var(--color-neutral-600)",
                        color: "var(--color-neutral-200)", fontSize: 13,
                        outline: "none", fontFamily: "var(--font-sans)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--color-neutral-400)" }}>Contenu</label>
                  <textarea
                    rows={5}
                    placeholder="Rédigez votre rapport ici…"
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 6, resize: "vertical",
                      backgroundColor: "var(--color-neutral-700)",
                      border: "1px solid var(--color-neutral-600)",
                      color: "var(--color-neutral-200)", fontSize: 13,
                      outline: "none", fontFamily: "var(--font-sans)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded text-xs"
                    style={{ backgroundColor: "var(--color-neutral-700)", border: "1px solid var(--color-neutral-600)", color: "var(--color-neutral-400)", cursor: "pointer" }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded text-xs font-semibold"
                    style={{ backgroundColor: "#C42B47", border: "none", color: "white", cursor: "pointer" }}
                  >
                    Publier le rapport
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Médical sub-tab ───────────────────────────────────────────────────────────
function MedicalSubTab() {
  return (
    <div className="p-6 space-y-4">
      {/* Summary chips */}
      <div className="flex items-center gap-3">
        {[
          { label: "3 blessures", sub: "sur 18 mois", color: "#EAB308" },
          { label: "36 jours", sub: "d'absence totale", color: "#EF4444" },
          { label: "0 blessure", sub: "cette saison", color: "#22C55E" },
        ].map(({ label, sub, color }) => (
          <div
            key={label}
            className="rounded-lg px-4 py-3 flex-1"
            style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
          >
            <p className="text-lg font-bold" style={{ color, fontFamily: "var(--font-dm-sans)" }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-neutral-500)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Injury history table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        <div className="px-4 pt-4 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
            Historique des blessures
          </span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
              {["Blessure", "Début", "Fin", "Durée", "Sévérité", "Statut"].map((h) => (
                <th key={h} style={{ padding: "6px 12px", textAlign: "left", color: "var(--color-neutral-500)", fontSize: 10, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INJURIES.map((injury) => (
              <tr key={injury.id} style={{ borderBottom: "1px solid var(--color-neutral-700)" }}>
                <td style={{ padding: "12px", fontSize: 12, color: "var(--color-neutral-200)", fontWeight: 500 }}>{injury.label}</td>
                <td style={{ padding: "12px", fontSize: 11, color: "var(--color-neutral-400)" }}>{injury.start}</td>
                <td style={{ padding: "12px", fontSize: 11, color: "var(--color-neutral-400)" }}>{injury.end}</td>
                <td style={{ padding: "12px", fontSize: 11, color: "var(--color-neutral-300)", fontFamily: "var(--font-dm-sans)", fontWeight: 600 }}>{injury.days} jours</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: SEVERITY_COLORS[injury.severity] ?? "#6B7280" }}>
                    {injury.severity}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 999,
                      backgroundColor: `${injury.statusColor}20`,
                      border: `1px solid ${injury.statusColor}50`,
                      color: injury.statusColor,
                    }}
                  >
                    {injury.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Availability forecast */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
          Disponibilité prévisionnelle
        </span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#22C55E" }} />
          <span className="text-sm font-semibold" style={{ color: "#22C55E" }}>Disponible</span>
          <span className="text-xs ml-2" style={{ color: "var(--color-neutral-400)" }}>
            Aucune blessure en cours · Charge d&apos;entraînement normale
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-pill bar ──────────────────────────────────────────────────────────────
function SubPills({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div
      className="flex items-center gap-2 px-6 py-3 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--color-neutral-700)", backgroundColor: "var(--color-neutral-900)" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: isActive ? "rgba(196,43,71,0.18)" : "var(--color-neutral-800)",
              border: `1px solid ${isActive ? "rgba(196,43,71,0.45)" : "var(--color-neutral-700)"}`,
              color: isActive ? "var(--color-primary-300)" : "var(--color-neutral-400)",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function RapportsMedicalTab() {
  const [activeSub, setActiveSub] = useState<SubTab>("rapports");

  return (
    <div className="flex flex-col h-full">
      <SubPills tabs={SUB_TABS} active={activeSub} onChange={(id) => setActiveSub(id as SubTab)} />
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--color-neutral-900)" }}>
        {activeSub === "rapports" && <RapportsSubTab />}
        {activeSub === "medical"  && <MedicalSubTab />}
      </div>
    </div>
  );
}
