import { RadarWidget } from "@/components/profile/RadarWidget";
import { FormationGrid } from "@/components/profile/FormationGrid";
import { AvailabilityWidget } from "@/components/profile/AvailabilityWidget";
import { ValueChart } from "@/components/profile/ValueChart";

export function AttributesTab() {
  return (
    <div className="p-6 space-y-4">
      {/* Row 1: Radar + FormationGrid — side by side, capped at 340px */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "1fr 1fr", maxHeight: 340, overflow: "hidden" }}
      >
        <RadarWidget />
        <FormationGrid />
      </div>

      {/* Row 2: Value chart — full width, capped at 220px */}
      <div style={{ maxHeight: 220, overflow: "hidden" }}>
        <ValueChart />
      </div>

      {/* Row 3: Availability — full width, capped at 220px */}
      <div style={{ maxHeight: 220, overflow: "hidden" }}>
        <AvailabilityWidget />
      </div>
    </div>
  );
}
