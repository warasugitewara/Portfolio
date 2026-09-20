import { describe, expect, it } from "vitest";
import { DGM_LAYOUT, computeDgmGeometry } from "./dgmGeometry";
import type { DgmGeometry } from "./dgmGeometry";

describe("computeDgmGeometry", () => {
  it("reproduces the hand-tuned layout at 8 rows and 8 legend entries", () => {
    expect(computeDgmGeometry(8, 8)).toMatchObject({
      clusterY: 185,
      clusterH: 490,
      clusterTitleY: 210,
      nodeY: 220,
      nodeH: 445,
      nodeTitleY: 246,
      nodeHwY: 265,
      rowY0: 283,
      summaryY: 695,
      legendY: 833,
      legendH: 300,
      legendTitleY: 865,
      viewBoxHeight: 1150,
      viewBox: "0 0 1200 1150",
    });
  });

  it("grows the boxes when a ninth row is added", () => {
    expect(computeDgmGeometry(9, 8)).toMatchObject({
      nodeH: 491,
      clusterH: 536,
      summaryY: 741,
      legendY: 879,
      viewBoxHeight: 1196,
    });
  });

  it("keeps every row inside its node box, and the boxes inside each other", () => {
    for (let rows = 1; rows <= 30; rows += 1) {
      const geo = computeDgmGeometry(rows, 8);
      const lastRowBottom = geo.rowY(rows - 1) + DGM_LAYOUT.rowH;
      expect(lastRowBottom).toBeLessThanOrEqual(geo.nodeY + geo.nodeH);
      expect(geo.nodeY + geo.nodeH).toBeLessThanOrEqual(geo.clusterY + geo.clusterH);
      expect(geo.clusterY + geo.clusterH).toBeLessThanOrEqual(geo.summaryY);
      expect(geo.legendY + geo.legendH).toBeLessThanOrEqual(geo.viewBoxHeight);
    }
  });

  it("grows monotonically with the row count", () => {
    for (let rows = 1; rows < 20; rows += 1) {
      expect(computeDgmGeometry(rows + 1, 8).viewBoxHeight).toBeGreaterThan(
        computeDgmGeometry(rows, 8).viewBoxHeight,
      );
    }
  });

  // The geometry carries helper functions, so compare the numbers only.
  const numbersOf = (geo: DgmGeometry) =>
    Object.fromEntries(Object.entries(geo).filter(([, value]) => typeof value !== "function"));

  it("clamps empty or negative input to a single row", () => {
    expect(numbersOf(computeDgmGeometry(0, 0))).toEqual(numbersOf(computeDgmGeometry(1, 1)));
    expect(numbersOf(computeDgmGeometry(-5, -5))).toEqual(numbersOf(computeDgmGeometry(1, 1)));
  });

  it("places the three node columns across the cluster box", () => {
    const geo = computeDgmGeometry(8, 8);
    expect([geo.colX(0), geo.colX(1), geo.colX(2)]).toEqual([25, 415, 805]);
    expect(geo.colCenterX(1)).toBe(600);
  });
});
