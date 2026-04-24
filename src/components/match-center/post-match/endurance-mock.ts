export const ENDURANCE_DATA = {
  team: {
    avgMPerMin: 112,
    totalSprints: 142,
    hiDistance: 8400, // meters
    dropOff: [
      { minute: 0, intensity: 120, precision: 92 },
      { minute: 15, intensity: 118, precision: 90 },
      { minute: 30, intensity: 115, precision: 88 },
      { minute: 45, intensity: 108, precision: 85 },
      { minute: 60, intensity: 112, precision: 87 },
      { minute: 75, intensity: 98, precision: 78 },
      { minute: 90, intensity: 92, precision: 72 },
    ]
  },
  players: [
    {
      id: "enzo-millot",
      name: "Enzo Millot",
      sprints: 18,
      hiDistance: 950,
      subbedOut: true,
      subMinute: 72,
      maintenance: 82,
      slices: [
        { label: "0-15'", value: 128 }, { label: "15-30'", value: 122 }, { label: "30-45'", value: 115 },
        { label: "45-60'", value: 118 }, { label: "60-75'", value: 105 }, { label: "75-90'", value: 92 },
      ]
    },
    {
      id: "georges-mikautadze",
      name: "Georges Mikautadze",
      sprints: 22,
      hiDistance: 1100,
      subbedOut: false,
      maintenance: 75,
      slices: [
        { label: "0-15'", value: 135 }, { label: "15-30'", value: 128 }, { label: "30-45'", value: 120 },
        { label: "45-60'", value: 125 }, { label: "60-75'", value: 110 }, { label: "75-90'", value: 98 },
      ]
    },
    {
      id: "ablie-jallow",
      name: "Ablie Jallow",
      sprints: 15,
      hiDistance: 820,
      subbedOut: true,
      subMinute: 60,
      maintenance: 90,
      slices: [
        { label: "0-15'", value: 120 }, { label: "15-30'", value: 115 }, { label: "30-45'", value: 108 },
        { label: "45-60'", value: 112 }, { label: "60-75'", value: 95 }, { label: "75-90'", value: 88 },
      ]
    },
    {
      id: "lamine-camara",
      name: "Lamine Camara",
      sprints: 25,
      hiDistance: 1200,
      subbedOut: false,
      maintenance: 88,
      slices: [
        { label: "0-15'", value: 130 }, { label: "15-30'", value: 128 }, { label: "30-45'", value: 125 },
        { label: "45-60'", value: 122 }, { label: "60-75'", value: 118 }, { label: "75-90'", value: 115 },
      ]
    }
  ]
};
