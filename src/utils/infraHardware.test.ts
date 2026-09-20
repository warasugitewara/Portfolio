import { describe, expect, it } from "vitest";
import { formatHardware, formatHardwareShort, formatStorage } from "./infraHardware";
import type { InfraHardware } from "../types";

const hp2: InfraHardware = {
  model: "HP Z240 SFF",
  cpu: "Xeon E3-1245 v5",
  cores: 8,
  memGiB: 16,
  storage: ["SSD", "HDD"],
};

const bareMetal: InfraHardware = {
  model: "",
  cpu: "Core i7-3770",
  cores: 8,
  memGiB: 16,
  storage: ["Kingston SQ500S37240G 240GB"],
};

describe("formatHardware", () => {
  it("joins model, cpu, memory and storage", () => {
    expect(formatHardware(hp2)).toBe(
      "HP Z240 SFF — Xeon E3-1245 v5 (8 threads) · RAM 16GB · SSD · HDD",
    );
  });

  it("drops the model when the machine has no meaningful name", () => {
    expect(formatHardware(bareMetal)).toBe(
      "Core i7-3770 (8 threads) · RAM 16GB · Kingston SQ500S37240G 240GB",
    );
  });
});

describe("formatHardwareShort", () => {
  it("keeps the diagram caption short", () => {
    expect(formatHardwareShort(hp2)).toBe("HP Z240 SFF · Xeon E3-1245 v5 · 16GB");
  });

  it("omits an empty model", () => {
    expect(formatHardwareShort(bareMetal)).toBe("Core i7-3770 · 16GB");
  });
});

describe("formatStorage", () => {
  it("joins the drives", () => {
    expect(formatStorage(hp2)).toBe("SSD + HDD");
  });
});
