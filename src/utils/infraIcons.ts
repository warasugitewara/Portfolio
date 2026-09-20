/**
 * Semantic icon names are stored in `infrastructure.json`; the glyphs live here.
 *
 * Keeping the mapping in one place means the data never has to change when the
 * icon set does — swapping these for Nerd Font glyphs only touches this file.
 */
const ICONS: Record<string, string> = {
  music: "",
  game: "",
  speaker: "",
  tts: "",
  app: "",
  os: "",
  shield: "",
  backup: "",
  lock: "",
  dns: "",
  monitor: "",
  bot: "",
  web: "",
  webhook: "",
  video: "",
  chart: "",
  storage: "",
};

export const ICON_FALLBACK = "";

export const iconFor = (name: string | undefined): string => (name && ICONS[name]) || ICON_FALLBACK;
