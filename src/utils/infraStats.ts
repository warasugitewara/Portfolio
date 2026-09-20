import type { InfrastructureData, Profile, ProfileStat } from "../types";

export interface InfraStats {
  /** Nodes that form the Proxmox cluster (bare-metal machines excluded). */
  pveNodes: number;
  /** Guests listed on the cluster nodes, running or not. */
  totalGuests: number;
  runningGuests: number;
  lxc: number;
  vm: number;
}

export const deriveInfraStats = (infra: InfrastructureData | null): InfraStats | null => {
  const nodes = infra?.infrastructure?.nodes;
  if (!nodes) return null;
  const guests = nodes
    .filter((node) => node.kind === "pve")
    .flatMap((node) => node.workloads)
    .filter((wl) => wl.kind !== "baremetal");
  return {
    pveNodes: nodes.filter((node) => node.kind === "pve").length,
    totalGuests: guests.length,
    runningGuests: guests.filter((wl) => wl.status === "running").length,
    lxc: guests.filter((wl) => wl.kind === "lxc").length,
    vm: guests.filter((wl) => wl.kind === "qemu").length,
  };
};

/**
 * Resolve the hero stats, deriving the countable ones from live data.
 *
 * Falls back to the literal `value` while `infra` is still loading, so the
 * numbers never flash or disappear.
 */
export const resolveStats = (
  profile: Profile | null,
  infra: InfrastructureData | null,
): (ProfileStat & { value: string })[] => {
  const stats = deriveInfraStats(infra);
  return (profile?.stats ?? []).map((stat) => {
    const derived = (() => {
      switch (stat.derive) {
        case "pveNodes":
          return stats ? String(stats.pveNodes) : undefined;
        case "runningGuests":
          return stats ? String(stats.runningGuests) : undefined;
        case "credentials":
          return profile?.credentials ? String(profile.credentials.length) : undefined;
        default:
          return undefined;
      }
    })();
    return { ...stat, value: derived ?? stat.value ?? "" };
  });
};
