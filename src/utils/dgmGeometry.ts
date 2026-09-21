/**
 * Vertical geometry for the cluster architecture diagram.
 *
 * Every y coordinate below the network band depends on how many workload rows
 * the tallest node has, so the layout is computed instead of being written out
 * as literals. The constants are the ones the hand-tuned diagram was built
 * with: `computeDgmGeometry(8, 8)` reproduces it exactly.
 */
export const DGM_LAYOUT = {
  width: 1200,
  /** Left edge of each node column, and the column width. */
  colX: [25, 415, 805],
  colW: 370,
  clusterX: 15,
  clusterW: 1170,
  clusterY: 185,
  /** Node box offset inside the cluster box. */
  nodeDy: 35,
  nodeTitleDy: 26,
  nodeHwDy: 45,
  rowDy: 63,
  rowStep: 46,
  rowH: 40,
  nodePadBottom: 20,
  clusterPadBottom: 10,
  gap: 20,
  summaryH: 118,
  summaryLineDy: [28, 53, 71, 89, 107],
  legendTitleDy: 32,
  legendRowDy0: 67,
  legendRowStep: 30,
  legendPadBottom: 23,
  viewBoxPadBottom: 17,
} as const;

export interface DgmGeometry {
  clusterY: number;
  clusterH: number;
  clusterTitleY: number;
  nodeY: number;
  nodeH: number;
  nodeTitleY: number;
  nodeHwY: number;
  rowY0: number;
  summaryY: number;
  summaryLineY: number[];
  legendY: number;
  legendH: number;
  legendTitleY: number;
  viewBoxHeight: number;
  viewBox: string;
  rowY: (index: number) => number;
  legendRowY: (index: number) => number;
  colX: (column: number) => number;
  colCenterX: (column: number) => number;
}

/**
 * @param maxRows    workload rows in the tallest node column
 * @param legendRows entries in the legend box
 */
export const computeDgmGeometry = (maxRows: number, legendRows: number): DgmGeometry => {
  const L = DGM_LAYOUT;
  const rows = Math.max(1, Math.floor(maxRows));
  const legend = Math.max(1, Math.floor(legendRows));

  const nodeY = L.clusterY + L.nodeDy;
  const rowY0 = nodeY + L.rowDy;
  const nodeH = L.rowDy + (rows - 1) * L.rowStep + L.rowH + L.nodePadBottom;
  const clusterH = L.nodeDy + nodeH + L.clusterPadBottom;
  const summaryY = L.clusterY + clusterH + L.gap;
  const legendY = summaryY + L.summaryH + L.gap;
  const legendH = L.legendRowDy0 + (legend - 1) * L.legendRowStep + L.legendPadBottom;
  const viewBoxHeight = legendY + legendH + L.viewBoxPadBottom;

  return {
    clusterY: L.clusterY,
    clusterH,
    clusterTitleY: L.clusterY + 25,
    nodeY,
    nodeH,
    nodeTitleY: nodeY + L.nodeTitleDy,
    nodeHwY: nodeY + L.nodeHwDy,
    rowY0,
    summaryY,
    summaryLineY: L.summaryLineDy.map((dy) => summaryY + dy),
    legendY,
    legendH,
    legendTitleY: legendY + L.legendTitleDy,
    viewBoxHeight,
    viewBox: `0 0 ${L.width} ${viewBoxHeight}`,
    rowY: (index) => rowY0 + index * L.rowStep,
    legendRowY: (index) => legendY + L.legendRowDy0 + index * L.legendRowStep,
    colX: (column) => L.colX[column] ?? L.colX[0],
    colCenterX: (column) => (L.colX[column] ?? L.colX[0]) + L.colW / 2,
  };
};
