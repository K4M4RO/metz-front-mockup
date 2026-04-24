import { RadarWidget } from "@/components/profile/RadarWidget";
import { FormationGrid } from "@/components/profile/FormationGrid";
import { AvailabilityWidget } from "@/components/profile/AvailabilityWidget";
import { ValueChart } from "@/components/profile/ValueChart";
import { PlayerPositionAnalysis } from "@/components/profile/PlayerPositionAnalysis";

export function AttributesTab() {
  return (
    <div className="p-6 space-y-4">
      {/* Main Grid: 2 columns */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Left Column: Radar + ValueChart */}
        <div className="space-y-4 flex flex-col">
          <div style={{ maxHeight: 340, overflow: "hidden" }}>
            <RadarWidget />
          </div>
          <div style={{ maxHeight: 220, overflow: "hidden" }}>
            <ValueChart />
          </div>
        </div>

        {/* Right Column: FormationGrid + PositionAnalysis */}
        <div className="space-y-4 flex flex-col">
          <FormationGrid />
          <PlayerPositionAnalysis />
        </div>
      </div>

      {/* Row 2: Availability — full width, capped at 220px */}
      <div style={{ maxHeight: 220, overflow: "hidden" }}>
        <AvailabilityWidget />
      </div>
    </div>
  );
}
