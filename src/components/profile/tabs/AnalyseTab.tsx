"use client";

import { useState } from "react";
import { EventMap } from "@/components/profile/EventMap";
import { PerformancesTab } from "@/components/profile/tabs/PerformancesTab";
import { PhysicalTab } from "@/components/profile/tabs/PhysicalTab";
import { EnduranceTab } from "@/components/profile/tabs/EnduranceTab";

type SubTab = "couverture" | "performances" | "physique" | "endurance";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "couverture",   label: "Couverture" },
  { id: "performances", label: "Performances" },
  { id: "physique",     label: "Physique" },
  { id: "endurance",    label: "Endurance" },
];



function CoverageSubTab() {

  return (
    <div className="p-6">
      <EventMap />
    </div>
  );
}

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
              backgroundColor: isActive ? "rgba(196,43,71, 0.18)" : "var(--color-neutral-800)",
              border: `1px solid ${isActive ? "rgba(196,43,71, 0.45)" : "var(--color-neutral-700)"}`,
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

export function AnalyseTab() {
  const [activeSub, setActiveSub] = useState<SubTab>("couverture");

  return (
    <div className="flex flex-col">
      <div className="sticky z-30" style={{ top: 44 }}>
        <SubPills tabs={SUB_TABS} active={activeSub} onChange={(id) => setActiveSub(id as SubTab)} />
      </div>
      <div style={{ backgroundColor: "var(--color-neutral-900)" }}>
        {activeSub === "couverture"   && <CoverageSubTab />}
        {activeSub === "performances" && <PerformancesTab />}
        {activeSub === "physique"     && <PhysicalTab />}
        {activeSub === "endurance"    && <EnduranceTab />}
      </div>
    </div>
  );
}
