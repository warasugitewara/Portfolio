import { describe, expect, it } from "vitest";
import { deriveInfraStats, resolveStats } from "./infraStats";
import infraJson from "../../public/data/infrastructure.json";
import profileJson from "../../public/data/profile.json";
import type { InfrastructureData, Profile } from "../types";

// The real data is the fixture: these counts are the guard against the site
// drifting away from the cluster again.
const infra = infraJson as unknown as InfrastructureData;
const profile = profileJson as unknown as Profile;

describe("deriveInfraStats", () => {
  it("counts only cluster nodes, never the bare-metal machine", () => {
    const stats = deriveInfraStats(infra);
    expect(stats?.pveNodes).toBe(3);
  });

  it("counts guests and excludes bare-metal services", () => {
    const stats = deriveInfraStats(infra);
    expect(stats?.totalGuests).toBe(stats!.lxc + stats!.vm);
    expect(stats?.runningGuests).toBeLessThanOrEqual(stats!.totalGuests);
  });

  it("matches the live cluster as measured on 2026-09-20", () => {
    expect(deriveInfraStats(infra)).toEqual({
      pveNodes: 3,
      totalGuests: 19,
      runningGuests: 18,
      lxc: 16,
      vm: 3,
    });
  });

  it("returns null without data", () => {
    expect(deriveInfraStats(null)).toBeNull();
  });
});

describe("resolveStats", () => {
  it("derives the countable stats", () => {
    const stats = resolveStats(profile, infra);
    expect(stats.map((s) => s.value)).toEqual(["3", "18", "0", "4"]);
  });

  it("falls back to the literal value while infra is loading", () => {
    const stats = resolveStats(profile, null);
    expect(stats.find((s) => s.label === "open inbound ports")?.value).toBe("0");
    expect(stats.find((s) => s.derive === "pveNodes")?.value).toBe("");
  });

  it("derives certifications from the profile alone", () => {
    expect(resolveStats(profile, null).find((s) => s.derive === "credentials")?.value).toBe("4");
  });

  it("survives a missing profile", () => {
    expect(resolveStats(null, infra)).toEqual([]);
  });
});
