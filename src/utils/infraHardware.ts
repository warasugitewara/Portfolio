import type { InfraHardware } from "../types";

/** Full hardware line, e.g. "HP Z240 SFF — Xeon E3-1225 (4 threads) · RAM 16GB · HDD". */
export const formatHardware = (hw: InfraHardware): string => {
  const head = hw.model ? `${hw.model} — ${hw.cpu}` : hw.cpu;
  const parts = [`${head} (${hw.cores} threads)`, `RAM ${hw.memGiB}GB`, ...hw.storage];
  return parts.join(" · ");
};

/** Compact form for the diagram, e.g. "HP Z240 SFF · Xeon E3-1225 · 16GB". */
export const formatHardwareShort = (hw: InfraHardware): string =>
  [hw.model, hw.cpu, `${hw.memGiB}GB`].filter(Boolean).join(" · ");

/** Storage list for the diagram summary box; empty string when unknown. */
export const formatStorage = (hw: InfraHardware): string => hw.storage.join(" + ");
