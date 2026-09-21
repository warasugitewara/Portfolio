import type { CSSProperties } from "react";
import type { InfrastructureData } from "../types";
import { deriveInfraStats } from "../utils/infraStats";

interface ClusterBoardLabels {
  title: string;
  running: string;
  stopped: string;
}

interface ClusterBoardProps {
  infra: InfrastructureData | null;
  labels: ClusterBoardLabels;
}

/**
 * The cluster as it actually runs: one cell per guest, grouped by node.
 *
 * Nodes are separated by layout and a label rather than by color, so the only
 * colors in the board carry machine state. Stopped guests also get a dashed
 * outline and a label, so state never rests on color alone.
 */
export const ClusterBoard = ({ infra, labels }: ClusterBoardProps) => {
  const nodes = (infra?.infrastructure?.nodes ?? []).filter((node) => node.kind === "pve");
  const stats = deriveInfraStats(infra);
  if (!nodes.length || !stats) return null;

  let cellIndex = 0;

  return (
    <figure className="board">
      <figcaption className="board__title">{labels.title}</figcaption>

      <div className="board__nodes">
        {nodes.map((node) => (
          <div key={node.id} className="board__node">
            <span className="board__node-name">{node.name}</span>
            <span className="board__node-spec">
              {node.hardware.cores}c · {node.hardware.memGiB}GB
            </span>
            <ul className="board__cells">
              {node.workloads
                .filter((wl) => wl.kind !== "baremetal")
                .map((wl) => {
                  const running = wl.status === "running";
                  const id = `${wl.kind === "qemu" ? "VM" : "CT"}${wl.vmid}`;
                  const index = cellIndex++;
                  return (
                    <li
                      key={id}
                      className={`board__cell${running ? "" : " board__cell--stopped"}`}
                      style={{ "--cell-index": index } as CSSProperties}
                      title={`${id} ${wl.name} — ${running ? labels.running : labels.stopped}`}
                    >
                      <span className="board__cell-id">{wl.vmid}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      <p className="board__legend">
        <span className="board__key">
          <span className="board__swatch" aria-hidden="true" />
          {labels.running} {stats.runningGuests}
        </span>
        <span className="board__key">
          <span className="board__swatch board__swatch--stopped" aria-hidden="true" />
          {labels.stopped} {stats.totalGuests - stats.runningGuests}
        </span>
      </p>
    </figure>
  );
};
