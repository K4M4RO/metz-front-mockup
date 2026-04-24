"use client";

import { useState } from "react";
import { HeroHeader } from "@/components/profile/HeroHeader";
import { TabBar } from "@/components/profile/TabBar";
import { AttributesTab } from "@/components/profile/tabs/AttributesTab";
import { AnalyseTab } from "@/components/profile/tabs/AnalyseTab";
import { EquipeTab } from "@/components/profile/tabs/EquipeTab";
import { RapportsTab } from "@/components/profile/tabs/RapportsTab";
import { BlessuresTab } from "@/components/profile/tabs/BlessuresTab";

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("attributes");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--color-neutral-900)" }}>
        <HeroHeader />
        
        {/* Sticky TabBar */}
        <div className="sticky top-0 z-40">
          <TabBar active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex-1">
          {activeTab === "attributes" && <AttributesTab />}
          {activeTab === "analyse"    && <AnalyseTab />}
          {activeTab === "equipe"     && <EquipeTab />}
          {activeTab === "rapports"   && <RapportsTab />}
          {activeTab === "blessures"  && <BlessuresTab />}
        </div>
      </div>
    </div>
  );
}
