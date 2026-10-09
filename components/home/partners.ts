// Client logos shown in the hero wall and listed beneath it.
//
// The accessible name list (`logo-wall__names`) and the logo images are derived
// from this one array, so the two cannot drift apart. `tonal` marks logos that
// ship as transparent PNGs and need the tonal treatment in dark contexts.
export type Partner = {
  /** File name under /img/partners/. */
  file: string;
  /** Accessible name. Also the text in the names list. */
  name: string;
  /** Apply `logo-wall__logo-img--tonal`. */
  tonal?: boolean;
};

export const PARTNERS: Partner[] = [
  { file: "kinchlyons.svg", name: "KinchLyons" },
  { file: "law-by-levin.svg", name: "Law by Levin" },
  { file: "stira.png", name: "Stira", tonal: true },
  { file: "boces.svg", name: "BOCES", tonal: true },
  { file: "better-faster-further.svg", name: "Better Faster Further" },
  { file: "kaptea.svg", name: "Kaptea" },
  { file: "boop.svg", name: "Boop" },
  { file: "karias-health.svg", name: "Karias Health" },
  { file: "blueflame.svg", name: "Blueflame AI" },
  { file: "dydx.svg", name: "dYdX" },
  { file: "datasite.png", name: "Datasite" },
  { file: "arcus.svg", name: "Arcus" },
  { file: "channelsight.png", name: "ChannelSight" },
  { file: "adaptive-insurance.svg", name: "Adaptive Insurance" },
  { file: "k2-group.svg", name: "K2 Group" },
  { file: "edesk.png", name: "eDesk" },
  { file: "sentrix.png", name: "Sentrix" },
  { file: "coreshell.svg", name: "Coreshell" },
  { file: "rivo-finance.svg", name: "Rivo Finance" },
  { file: "leaptree.png", name: "LeapTree" },
];