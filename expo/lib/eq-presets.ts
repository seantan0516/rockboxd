export type EqBand = { cutoff: number; q: number; gain: number };
export type EqPreset = {
  id: string;
  name: string;
  enabled: boolean;
  precut: number;
  bands: EqBand[];
};

// Values are copied directly from the supplied Rockbox .cfg files.
// Keep the native integer units unchanged when sending them to Rockbox.
export const EQ_PRESETS: EqPreset[] = [
  { id: "rnb", name: "节奏与布鲁斯", enabled: true, precut: 45, bands: [
    { cutoff: 60, q: 7, gain: 35 }, { cutoff: 200, q: 10, gain: 45 },
    { cutoff: 800, q: 10, gain: 5 }, { cutoff: 4000, q: 10, gain: 25 },
    { cutoff: 12000, q: 7, gain: 30 },
  ]},
  { id: "general", name: "通用", enabled: true, precut: 0, bands: [
    { cutoff: 100, q: 10, gain: 0 }, { cutoff: 400, q: 12, gain: -55 },
    { cutoff: 700, q: 12, gain: -70 }, { cutoff: 4000, q: 13, gain: -65 },
    { cutoff: 8000, q: 18, gain: -40 },
  ]},
  { id: "speaker", name: "完美外放", enabled: true, precut: 0, bands: [
    { cutoff: 60, q: 14, gain: 45 }, { cutoff: 400, q: 12, gain: -10 },
    { cutoff: 800, q: 12, gain: -40 }, { cutoff: 4000, q: 12, gain: -20 },
    { cutoff: 8000, q: 12, gain: 10 },
  ]},
  { id: "acoustic", name: "原声", enabled: true, precut: 45, bands: [
    { cutoff: 60, q: 7, gain: 45 }, { cutoff: 200, q: 10, gain: 10 },
    { cutoff: 800, q: 10, gain: 15 }, { cutoff: 4000, q: 10, gain: 30 },
    { cutoff: 12000, q: 7, gain: 20 },
  ]},
  { id: "bass2008", name: "重低音 2008", enabled: true, precut: 10, bands: [
    { cutoff: 60, q: 7, gain: 30 }, { cutoff: 170, q: 12, gain: 10 },
    { cutoff: 800, q: 10, gain: 20 }, { cutoff: 4000, q: 10, gain: 25 },
    { cutoff: 12000, q: 8, gain: -5 },
  ]},
  { id: "lounge", name: "休闲", enabled: true, precut: 20, bands: [
    { cutoff: 60, q: 7, gain: -25 }, { cutoff: 200, q: 10, gain: 5 },
    { cutoff: 800, q: 10, gain: 20 }, { cutoff: 4000, q: 10, gain: -15 },
    { cutoff: 12000, q: 7, gain: 15 },
  ]},
];
