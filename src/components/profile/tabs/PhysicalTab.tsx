import { SectoredRadar } from "@/components/profile/SectoredRadar";
import { PHYSICAL_GLOBAL, PHYSICAL_PHASE } from "@/data/enzo-millot-extended";

const COMPARE_ROWS = [
  { name:"Enzo Millot", abbr:"EM", highlight:true,  dist:"11,2", hi:"2,18", perMin:"120m", accel:"99" },
  { name:"M. Veretout",  abbr:"MV", highlight:false, dist:"10,8", hi:"1,94", perMin:"115m", accel:"87" },
  { name:"K. Camara",   abbr:"KC", highlight:false, dist:"10,4", hi:"1,78", perMin:"111m", accel:"82" },
  { name:"T. Samassékou",abbr:"TS",highlight:false, dist:"11,0", hi:"2,05", perMin:"117m", accel:"91" },
];

function cellBg(vals: string[], idx: number): string {
  const nums = vals.map(v => parseFloat(v.replace(",",".")));
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const cur = nums[idx];
  if (cur === max) return "rgba(34,197,94,0.15)";
  if (cur === min) return "rgba(239,68,68,0.15)";
  return "transparent";
}

export function PhysicalTab() {
  const colGroups = [
    { label:"Distance (km)", key:0 },
    { label:"HI dist (km)", key:1 },
    { label:"Dist/min", key:2 },
    { label:"Accel. score", key:3 },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Two sectored radars */}
      <div className="flex gap-4">
        <div style={{ flex: 1.5 }}>
          <SectoredRadar sectors={PHYSICAL_GLOBAL} title="Profil Physique Global — 6 secteurs" size={260} />
        </div>
        <div style={{ flex: 1 }}>
          <SectoredRadar sectors={PHYSICAL_PHASE} title="Par Phase de Jeu — 4 secteurs" size={240} />
        </div>
      </div>

      {/* Comparative table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor:"var(--color-neutral-800)", border:"1px solid var(--color-neutral-700)" }}
      >
        <div className="px-4 pt-4 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--color-neutral-400)", letterSpacing:"0.06em" }}>
            Tableau Comparatif — Milieux Centraux Ligue 1
          </span>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--color-neutral-700)" }}>
              <th style={{ padding:"8px 16px", textAlign:"left", color:"var(--color-neutral-500)", fontSize:10 }}>Joueur</th>
              {colGroups.map(c => (
                <th key={c.key} style={{ padding:"8px 12px", textAlign:"center", color:"var(--color-neutral-500)", fontSize:10 }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row, ri) => {
              const vals = [row.dist, row.hi, row.perMin, row.accel];
              return (
                <tr
                  key={row.name}
                  style={{
                    backgroundColor: row.highlight ? "rgba(196,43,71,0.10)" : "transparent",
                    borderBottom:"1px solid var(--color-neutral-700)",
                  }}
                >
                  <td style={{ padding:"10px 16px" }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: row.highlight ? "var(--color-primary-900)" : "var(--color-neutral-700)", color: row.highlight ? "var(--color-primary-300)" : "var(--color-neutral-400)", fontSize:8 }}
                      >
                        {row.abbr}
                      </div>
                      <span style={{ color: row.highlight ? "var(--color-primary-200)" : "var(--color-neutral-200)", fontSize:12, fontWeight: row.highlight ? 700 : 400 }}>
                        {row.name}
                      </span>
                    </div>
                  </td>
                  {vals.map((v, ci) => {
                    const colVals = COMPARE_ROWS.map(r => [r.dist, r.hi, r.perMin, r.accel][ci]);
                    const bg = cellBg(colVals, ri);
                    return (
                      <td key={ci} style={{ padding:"10px 12px", textAlign:"center", fontSize:12, color:"var(--color-neutral-200)", backgroundColor:bg, fontFamily:"var(--font-dm-sans)" }}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
