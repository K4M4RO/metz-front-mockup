const INJURIES = [
  { id: 1, label: "Elongation ischio-jambier droit", start: "12 nov. 2024", end: "03 déc. 2024", days: 21, severity: "Modérée", status: "Rétabli", statusColor: "#22C55E" },
  { id: 2, label: "Contusion genou gauche", start: "08 sept. 2024", end: "15 sept. 2024", days: 7, severity: "Légère", status: "Rétabli", statusColor: "#22C55E" },
  { id: 3, label: "Surcharge musculaire quadriceps", start: "22 févr. 2024", end: "01 mars 2024", days: 8, severity: "Légère", status: "Rétabli", statusColor: "#22C55E" },
];

const SEVERITY_COLORS: Record<string, string> = {
  Légère: "#22C55E", Modérée: "#EAB308", Sévère: "#EF4444",
};

export function BlessuresTab() {
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
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#22C55E" }} />
          <span className="text-sm font-semibold" style={{ color: "#22C55E" }}>Disponible</span>
          <span className="text-xs ml-2" style={{ color: "var(--color-neutral-400)" }}>
            Aucune blessure en cours · Charge d&apos;entraînement normale
          </span>
        </div>
      </div>

      {/* Risk assessment */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: "var(--color-neutral-800)", border: "1px solid var(--color-neutral-700)" }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: "var(--color-neutral-400)", letterSpacing: "0.06em" }}>
          Évaluation du risque
        </span>
        <div className="space-y-3">
          {[
            { zone: "Ischio-jambiers droits", risk: 42, label: "Modéré" },
            { zone: "Genou gauche", risk: 18, label: "Faible" },
            { zone: "Cheville droite", risk: 12, label: "Faible" },
          ].map(({ zone, risk, label }) => {
            const color = risk >= 60 ? "#EF4444" : risk >= 35 ? "#EAB308" : "#22C55E";
            return (
              <div key={zone} className="flex items-center gap-3">
                <span className="text-xs flex-shrink-0" style={{ color: "var(--color-neutral-400)", width: 160 }}>{zone}</span>
                <div className="flex-1 relative" style={{ height: 8, backgroundColor: "var(--color-neutral-700)", borderRadius: 4 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${risk}%`, backgroundColor: color, borderRadius: 4 }} />
                </div>
                <span className="text-xs flex-shrink-0 font-semibold" style={{ color, width: 56, textAlign: "right" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
