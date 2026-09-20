import { useEffect, useState } from "react";
import type {
  I18n,
  InfrastructureData,
  InfraNode,
  InfraRoadmapPhase,
  InfraWorkload,
  InfraWorkloadStatus,
  Language,
} from "../types";
import { getDataUrl } from "../utils/path";
import { pickLang } from "../utils/pickLang";
import { formatHardware } from "../utils/infraHardware";
import { iconFor } from "../utils/infraIcons";
import { DGM_LAYOUT, computeDgmGeometry } from "../utils/dgmGeometry";
import type { DgmGeometry } from "../utils/dgmGeometry";
import { CollapsibleSection } from "../components/CollapsibleSection";
import "../styles/infrastructure.css";

interface InfrastructurePageProps {
  i18n: I18n | null;
  lang: Language;
}

/* ── Architecture-diagram rows ──────────────────────────────────────────
 * The row list (which containers exist, their name/id and order) is derived
 * from infrastructure.json at render time — the JSON is the single source of
 * truth. Only diagram-specific presentation (icon, short caption, colour
 * variant) lives here, keyed by CT/VM id. Adding/removing/renaming a workload
 * in the JSON updates the diagram automatically; a brand-new id simply falls
 * back to a default icon and blank caption until an entry is added below.
 */
type DgmVariant = "core" | "cf" | "warn";

type DgmRow = {
  icon: string;
  name: string;
  id: string;
  /** Short caption shown under the workload name. */
  caption: string;
  /** English variant of `caption`; used when `lang === "en"`. */
  caption_en: string;
  variant?: DgmVariant;
  status: InfraWorkloadStatus;
};

/** Human-facing label for a workload kind. `qemu` is an internal token, never shown. */
const workloadKindLabel = (kind: InfraWorkload["kind"]): string =>
  kind === "qemu" ? "VM" : kind === "lxc" ? "LXC" : "Bare-metal";

/** Derive a diagram row id from a workload: e.g. LXC 101 -> "CT101", VM 500 -> "VM500". */
const workloadRowId = (wl: InfraWorkload): string =>
  `${wl.kind === "qemu" ? "VM" : "CT"}${wl.vmid}`;

/**
 * Build the diagram rows for a node straight from its JSON workloads.
 *
 * Bare-metal services have no vmid and live outside the cluster, so they are
 * not drawn in the cluster diagram.
 */
const buildDgmRows = (node: InfraNode | undefined): DgmRow[] =>
  (node?.workloads ?? [])
    .filter((wl) => wl.kind !== "baremetal")
    .map((wl) => ({
      icon: iconFor(wl.icon),
      name: wl.name,
      id: workloadRowId(wl),
      caption: wl.caption,
      caption_en: wl.caption_en,
      variant: wl.variant,
      status: wl.status,
    }));

const DGM_COL_W = DGM_LAYOUT.colW;

/** Legend entries rendered below the summary boxes (dgmLegend1..8). */
const DGM_LEGEND_ROWS = 8;

const renderNodeRows = (colX: number, rows: DgmRow[], lang: Language, geo: DgmGeometry) =>
  rows.map((row, i) => {
    const y = geo.rowY(i);
    const rectClass =
      row.variant === "core"
        ? "dgm-row-rect dgm-row-rect--core"
        : row.variant === "cf"
          ? "dgm-row-rect dgm-row-rect--cf"
          : row.variant === "warn"
            ? "dgm-row-rect dgm-row-rect--warn"
            : "dgm-row-rect";
    // A powered-off guest reads as an outline rather than a filled row.
    const stoppedClass = row.status === "stopped" ? " dgm-row-rect--stopped" : "";
    return (
      <g key={`${row.id}-${row.name}`}>
        <rect
          x={colX + 10}
          y={y}
          width={DGM_COL_W - 20}
          height={40}
          rx={3}
          className={`${rectClass}${stoppedClass}`}
        />
        <text
          x={colX + 22}
          y={y + 17}
          className={`dgm-row-name${row.status === "stopped" ? " dgm-row-name--stopped" : ""}`}
        >
          {row.icon} {row.name}
        </text>
        <text x={colX + DGM_COL_W - 22} y={y + 17} textAnchor="end" className="dgm-row-id">
          {row.id}
        </text>
        <text x={colX + 22} y={y + 33} className="dgm-row-note">
          {pickLang(lang, row.caption_en, row.caption)}
        </text>
      </g>
    );
  });

export const InfrastructurePage = ({ i18n, lang }: InfrastructurePageProps) => {
  const [infra, setInfra] = useState<InfrastructureData | null>(null);

  useEffect(() => {
    const loadInfrastructure = async () => {
      try {
        const response = await fetch(getDataUrl("infrastructure.json"));
        if (!response.ok) throw new Error(`Failed to load infrastructure: ${response.status}`);
        const data: InfrastructureData = await response.json();
        setInfra(data);
      } catch (error) {
        console.error("Failed to load infrastructure:", error);
      }
    };

    void loadInfrastructure();
  }, []);

  if (!i18n || !infra) return null;

  const data = infra.infrastructure;
  const labels = i18n.infrastructure;

  // Diagram rows derived from the JSON node inventory (single source of truth).
  const hp1Rows = buildDgmRows(data.nodes.find((n) => n.id === "hp1"));
  const hp2Rows = buildDgmRows(data.nodes.find((n) => n.id === "hp2"));
  const dellRows = buildDgmRows(data.nodes.find((n) => n.id === "dell"));
  const geo = computeDgmGeometry(
    Math.max(hp1Rows.length, hp2Rows.length, dellRows.length),
    DGM_LEGEND_ROWS,
  );

  /** Resolve an infrastructure UI label; both locales define every key. */
  const t = (key: string): string => labels?.[key] ?? "";

  /** Localize a data-prose string array (JA base with optional `_en` variant). */
  const pickArr = (en: string[] | undefined, ja: string[]): string[] =>
    lang === "ja" ? ja : (en ?? ja);

  const stackLabel = (category: string): string => {
    switch (category) {
      case "virtualization":
        return t("stackVirtualization");
      case "networking":
        return t("stackNetworking");
      case "storage":
        return t("stackStorage");
      case "security":
        return t("stackSecurity");
      case "applications":
        return t("stackApplications");
      default:
        return category;
    }
  };

  const roadmapLabel = (phase: string): string => {
    switch (phase) {
      case "phase_1_current":
        return t("roadmapPhase1");
      case "phase_2_planned":
        return t("roadmapPhase2");
      case "phase_3_future":
        return t("roadmapPhase3");
      case "phase_4_longterm":
        return t("roadmapPhase4");
      default:
        return phase;
    }
  };

  return (
    <div className="infra-page">
      <title>{t("metaTitle")}</title>
      <meta name="description" content={t("metaDescription")} />
      <div className="section-container">
        {/* Title */}
        <h1 className="infra-title">🖧 {pickLang(lang, data.title_en ?? data.title, data.title)}</h1>
        <p className="infra-subtitle">
          {pickLang(lang, data.subtitle_en ?? data.subtitle, data.subtitle)}
        </p>

        {/* Overview */}
        <div className="infra-overview">
          <p>{pickLang(lang, data.overview_en ?? data.overview, data.overview)}</p>
        </div>

        {/* Architecture Diagram */}
        <CollapsibleSection title={t("secArchitecture")} defaultOpen>
          <div className="infra-diagram-wrap">
            <div className="infra-diagram-canvas">
              <svg viewBox={geo.viewBox} className="infra-svg" role="img" aria-label={t("dgmAria")}>
                <text x="600" y="34" textAnchor="middle" className="dgm-title">
                  {t("dgmTitle")}
                </text>

                {/* ── Network-core flow ── */}
                <text x="20" y="64" className="dgm-section-label">
                  {t("dgmConnCore")}
                </text>
                <rect x="20" y="74" width="175" height="56" rx="4" className="dgm-node-rect" />
                <text x="107" y="100" textAnchor="middle" className="dgm-node-text">
                  🌐 au one net
                </text>
                <text x="107" y="118" textAnchor="middle" className="dgm-label">
                  1Gbps / ONU
                </text>

                <path d="M 195 102 L 241 102" className="dgm-connector" />
                <polygon points="245,102 236,97 240,102 236,107" className="dgm-arrow" />

                <rect x="245" y="74" width="250" height="56" rx="4" className="dgm-core-rect" />
                <text x="370" y="98" textAnchor="middle" className="dgm-node-text">
                  🛡️ OPNsense
                </text>
                <text x="370" y="116" textAnchor="middle" className="dgm-label">
                  {t("dgmOpnRouter")}
                </text>

                <path d="M 495 102 L 541 102" className="dgm-connector" />
                <polygon points="545,102 536,97 540,102 536,107" className="dgm-arrow" />

                <rect x="545" y="74" width="250" height="26" rx="3" className="dgm-seg-rect" />
                <text x="670" y="91" textAnchor="middle" className="dgm-label">
                  {t("dgmSegMain")}
                </text>
                <rect x="545" y="104" width="250" height="26" rx="3" className="dgm-seg-rect" />
                <text x="670" y="121" textAnchor="middle" className="dgm-label">
                  {t("dgmSegIso")}
                </text>

                <rect x="815" y="74" width="365" height="56" rx="4" className="dgm-node-rect" />
                <text x="997" y="98" textAnchor="middle" className="dgm-node-text">
                  🔒 Twingate ZT + ☁️ Cloudflare Tunnel
                </text>
                <text x="997" y="116" textAnchor="middle" className="dgm-label">
                  {t("dgmZeroInbound")}
                </text>

                {/* ── Cluster ── */}
                <rect
                  x="15"
                  y={geo.clusterY}
                  width="1170"
                  height={geo.clusterH}
                  rx="6"
                  className="dgm-cluster-rect"
                />
                <text x="600" y={geo.clusterTitleY} textAnchor="middle" className="dgm-node-text">
                  {t("dgmCluster")}
                </text>

                {/* HP-1 */}
                <rect
                  x="25"
                  y={geo.nodeY}
                  width="370"
                  height={geo.nodeH}
                  rx="4"
                  className="dgm-node-inner-rect"
                />
                <text x="210" y={geo.nodeTitleY} textAnchor="middle" className="dgm-node-text">
                  🖥️ HP-1
                </text>
                <text x="210" y={geo.nodeHwY} textAnchor="middle" className="dgm-label">
                  HP Z240 SFF · Xeon E3-1225 · 16GB
                </text>
                {renderNodeRows(geo.colX(0), hp1Rows, lang, geo)}

                {/* HP-2 */}
                <rect
                  x="415"
                  y={geo.nodeY}
                  width="370"
                  height={geo.nodeH}
                  rx="4"
                  className="dgm-node-inner-rect"
                />
                <text x="600" y={geo.nodeTitleY} textAnchor="middle" className="dgm-node-text">
                  {t("dgmHp2Core")}
                </text>
                <text x="600" y={geo.nodeHwY} textAnchor="middle" className="dgm-label">
                  HP Z240 SFF · Xeon E3-1245 v5 · 16GB
                </text>
                {renderNodeRows(geo.colX(1), hp2Rows, lang, geo)}

                {/* Dell */}
                <rect
                  x="805"
                  y={geo.nodeY}
                  width="370"
                  height={geo.nodeH}
                  rx="4"
                  className="dgm-node-inner-rect"
                />
                <text x="990" y={geo.nodeTitleY} textAnchor="middle" className="dgm-node-text">
                  🖥️ Dell
                </text>
                <text x="990" y={geo.nodeHwY} textAnchor="middle" className="dgm-label">
                  OptiPlex 7040 SFF · i3-6100 · 8GB
                </text>
                {renderNodeRows(geo.colX(2), dellRows, lang, geo)}

                {/* ── Summary boxes ── */}
                <rect
                  x="15"
                  y={geo.summaryY}
                  width="282"
                  height="118"
                  rx="4"
                  className="dgm-node-rect"
                />
                <text x="156" y={geo.summaryLineY[0]} textAnchor="middle" className="dgm-node-text">
                  {t("dgmStorage")}
                </text>
                <text x="30" y={geo.summaryLineY[1]} className="dgm-label dgm-label--sm">
                  • HP-1: HDD / HP-2: SSD+HDD
                </text>
                <text x="30" y={geo.summaryLineY[2]} className="dgm-label dgm-label--sm">
                  • Dell: SSD 128GB + Toshiba HDD
                </text>
                <text x="30" y={geo.summaryLineY[3]} className="dgm-label dgm-label--sm">
                  {t("dgmStorage3")}
                </text>

                <rect
                  x="311"
                  y={geo.summaryY}
                  width="282"
                  height="118"
                  rx="4"
                  className="dgm-node-rect"
                />
                <text x="452" y={geo.summaryLineY[0]} textAnchor="middle" className="dgm-node-text">
                  {t("dgmBackup")}
                </text>
                <text x="326" y={geo.summaryLineY[1]} className="dgm-label dgm-label--sm">
                  {t("dgmBackup1")}
                </text>
                <text x="326" y={geo.summaryLineY[2]} className="dgm-label dgm-label--sm">
                  {t("dgmBackup2")}
                </text>
                <text x="326" y={geo.summaryLineY[3]} className="dgm-label dgm-label--sm">
                  {t("dgmBackup3")}
                </text>
                <text x="326" y={geo.summaryLineY[4]} className="dgm-label dgm-label--sm">
                  {t("dgmBackup4")}
                </text>

                <rect
                  x="607"
                  y={geo.summaryY}
                  width="282"
                  height="118"
                  rx="4"
                  className="dgm-node-rect"
                />
                <text x="748" y={geo.summaryLineY[0]} textAnchor="middle" className="dgm-node-text">
                  {t("dgmSecurity")}
                </text>
                <text x="622" y={geo.summaryLineY[1]} className="dgm-label dgm-label--sm">
                  {t("dgmSecurity1")}
                </text>
                <text x="622" y={geo.summaryLineY[2]} className="dgm-label dgm-label--sm">
                  {t("dgmSecurity2")}
                </text>
                <text x="622" y={geo.summaryLineY[3]} className="dgm-label dgm-label--sm">
                  • TOTP 2FA + Anubis
                </text>

                <rect
                  x="903"
                  y={geo.summaryY}
                  width="282"
                  height="118"
                  rx="4"
                  className="dgm-node-rect"
                />
                <text
                  x="1044"
                  y={geo.summaryLineY[0]}
                  textAnchor="middle"
                  className="dgm-node-text"
                >
                  {t("dgmMonitor")}
                </text>
                <text x="918" y={geo.summaryLineY[1]} className="dgm-label dgm-label--sm">
                  • Zabbix (Dell CT400)
                </text>
                <text x="918" y={geo.summaryLineY[2]} className="dgm-label dgm-label--sm">
                  • Discord-Pin-Service (CT104)
                </text>
                <text x="918" y={geo.summaryLineY[3]} className="dgm-label dgm-label--sm">
                  • Proxmox Web UI
                </text>

                {/* ── Legend ── */}
                <rect
                  x="15"
                  y={geo.legendY}
                  width="1170"
                  height={geo.legendH}
                  rx="4"
                  className="dgm-node-rect"
                />
                <text x="600" y={geo.legendTitleY} textAnchor="middle" className="dgm-legend-title">
                  {t("dgmLegendTitle")}
                </text>
                <text x="35" y={geo.legendRowY(0)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🖧</tspan> {t("dgmLegend1")}
                </text>
                <text x="35" y={geo.legendRowY(1)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🛡️</tspan> {t("dgmLegend2")}
                </text>
                <text x="35" y={geo.legendRowY(2)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🔐</tspan> {t("dgmLegend3")}
                </text>
                <text x="35" y={geo.legendRowY(3)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🛡️</tspan> {t("dgmLegend4")}
                </text>
                <text x="35" y={geo.legendRowY(4)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">☁️</tspan> {t("dgmLegend5")}
                </text>
                <text x="35" y={geo.legendRowY(5)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">📊</tspan> {t("dgmLegend6")}
                </text>
                <text x="35" y={geo.legendRowY(6)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🎮</tspan> {t("dgmLegend7")}
                </text>
                <text x="35" y={geo.legendRowY(7)} className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">💾</tspan> {t("dgmLegend8")}
                </text>
              </svg>
            </div>
            <p className="infra-diagram-hint" aria-hidden="true">
              {t("swipeHint")}
            </p>

            {/* Architecture Notes */}
            <div className="infra-notes">
              <h4 className="infra-notes__title">{t("notesTitle")}</h4>
              <ul className="infra-notes__list">
                <li>✓ {t("notes1")}</li>
                <li>✓ {t("notes2")}</li>
                <li>✓ {t("notes3")}</li>
                <li>✓ {t("notes4")}</li>
                <li>✓ {t("notes5")}</li>
                <li>✓ {t("notes6")}</li>
                <li>✓ {t("notes7")}</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Network Topology */}
        <CollapsibleSection title={t("secNetworkTopology")} defaultOpen>
          <div className="infra-diagram-wrap">
            <div className="infra-diagram-canvas">
              <svg
                viewBox="0 0 1000 700"
                className="infra-svg"
                role="img"
                aria-label={t("netAria")}
              >
                <defs>
                  <marker
                    id="net-arrow"
                    markerWidth="7"
                    markerHeight="5"
                    refX="5"
                    refY="2.5"
                    orient="auto"
                  >
                    <polygon points="0 0,7 2.5,0 5" className="net-arrow-fill" />
                  </marker>
                  <marker
                    id="net-arrow-cf"
                    markerWidth="7"
                    markerHeight="5"
                    refX="5"
                    refY="2.5"
                    orient="auto"
                  >
                    <polygon points="0 0,7 2.5,0 5" className="net-arrow-fill-cf" />
                  </marker>
                  <marker
                    id="net-arrow-warn"
                    markerWidth="7"
                    markerHeight="5"
                    refX="5"
                    refY="2.5"
                    orient="auto"
                  >
                    <polygon points="0 0,7 2.5,0 5" className="net-arrow-fill-warn" />
                  </marker>
                </defs>

                {/* ── Internet ── */}
                <rect x="350" y="16" width="300" height="50" rx="5" className="net-ft" />
                <text x="500" y="46" textAnchor="middle" className="net-tl">
                  🌐 Internet — au one net 1Gbps
                </text>

                {/* Internet → routes */}
                <path d="M 440 66 L 185 96" className="net-al-mgmt" />
                <path d="M 500 66 L 500 96" className="net-al-main" />
                <path d="M 560 66 L 815 96" className="net-al-exc" />

                {/* ── ② Twingate (management) ── */}
                <rect x="30" y="100" width="300" height="112" rx="5" className="net-ft" />
                <text x="180" y="120" textAnchor="middle" className="net-tl">
                  {t("netTwingateTitle")}
                </text>
                <line x1="30" y1="128" x2="330" y2="128" className="net-divider" />
                <text x="180" y="145" textAnchor="middle" className="net-rt">
                  {t("netRoute2")}
                </text>
                <text x="180" y="163" textAnchor="middle" className="net-sl">
                  {t("netTwingateSvc")}
                </text>
                <text x="180" y="180" textAnchor="middle" className="net-sl">
                  {t("netTwingateInbound")}
                </text>
                <text x="180" y="197" textAnchor="middle" className="net-sl">
                  {t("netTwingateRedundant")}
                </text>

                {/* ── ① Cloudflare (public) ── */}
                <rect x="350" y="100" width="300" height="112" rx="5" className="net-ft-cf" />
                <text x="500" y="120" textAnchor="middle" className="net-cl">
                  ☁️ Cloudflare Tunnel
                </text>
                <line x1="350" y1="128" x2="650" y2="128" className="net-divider-cf" />
                <text x="500" y="145" textAnchor="middle" className="net-rt-cf">
                  {t("netRoute1")}
                </text>
                <text x="500" y="163" textAnchor="middle" className="net-sl">
                  portfolio.warasugi.com
                </text>
                <text x="500" y="180" textAnchor="middle" className="net-sl">
                  {t("netCfInbound")}
                </text>
                <text x="500" y="197" textAnchor="middle" className="net-sl">
                  → portfolio (Dell CT103) / FileBrowser (HP-2 CT100)
                </text>

                {/* ── ③ Minecraft (exception) ── */}
                <rect x="670" y="100" width="300" height="112" rx="5" className="net-ft-warn" />
                <text x="820" y="120" textAnchor="middle" className="net-warn-tl">
                  {t("netMcTitle")}
                </text>
                <line x1="670" y1="128" x2="970" y2="128" className="net-divider" />
                <text x="820" y="145" textAnchor="middle" className="net-warn-txt">
                  {t("netRoute3")}
                </text>
                <text x="820" y="163" textAnchor="middle" className="net-sl">
                  {t("netMcBaremetal")}
                </text>
                <text x="820" y="180" textAnchor="middle" className="net-sl">
                  {t("netMcVia")}
                </text>
                <text x="820" y="197" textAnchor="middle" className="net-sl">
                  {t("netMcZero")}
                </text>

                {/* routes → OPNsense */}
                <path d="M 180 212 L 430 248" className="net-al-mgmt" />
                <path d="M 500 212 L 500 248" className="net-al-main" />
                <path d="M 820 212 L 575 248" className="net-al-exc" />

                {/* ── OPNsense core ── */}
                <rect x="200" y="250" width="600" height="64" rx="5" className="net-core-rect" />
                <text x="500" y="276" textAnchor="middle" className="net-tl">
                  {t("netOpnTitle")}
                </text>
                <text x="500" y="296" textAnchor="middle" className="net-sl">
                  {t("netOpnDesc")}
                </text>

                {/* OPNsense → segments */}
                <path d="M 400 314 L 250 350" className="net-al-mgmt" />
                <path d="M 600 314 L 750 350" className="net-al-mgmt" />

                {/* ── 0.x segment ── */}
                <rect x="30" y="352" width="450" height="190" rx="5" className="net-seg-rect" />
                <text x="255" y="374" textAnchor="middle" className="net-seg-head">
                  {t("netSeg0Head")}
                </text>
                <line x1="45" y1="382" x2="465" y2="382" className="net-divider" />
                <text x="48" y="402" className="net-seg-row">
                  {t("netSeg0Row1")}
                </text>
                <text x="48" y="422" className="net-seg-row">
                  {t("netSeg0Row2")}
                </text>
                <text x="48" y="442" className="net-nc">
                  {t("netSeg0Row3")}
                </text>
                <text x="48" y="462" className="net-seg-row">
                  📡 Discord-Pin-Service · 📺 MeTube · 📊 Zabbix · 🗄️ media-server (Dell)
                </text>
                <text x="48" y="482" className="net-warn-txt">
                  {t("netSeg0Row5")}
                </text>
                <text x="48" y="502" className="net-sl">
                  {t("netUpstreamDns")}
                </text>

                {/* ── 1.x segment ── */}
                <rect
                  x="520"
                  y="352"
                  width="450"
                  height="190"
                  rx="5"
                  className="net-seg-rect--iso"
                />
                <text x="745" y="374" textAnchor="middle" className="net-seg-head--iso">
                  {t("netSeg1Head")}
                </text>
                <line x1="535" y1="382" x2="955" y2="382" className="net-divider-cf" />
                <text x="538" y="402" className="net-seg-row">
                  🛡️ adguard-1.x [CT106 · HP-2] — AdGuard Home DNS
                </text>
                <text x="538" y="422" className="net-seg-row">
                  {t("netSeg1Row2")}
                </text>
                <text x="538" y="442" className="net-warn-txt">
                  {t("netSeg1Row3")}
                </text>
                <text x="538" y="462" className="net-seg-row">
                  📈 Pens-Uptime-kuma · 🤖 Uir-bot (HP-2)
                </text>
                <text x="538" y="482" className="net-sl">
                  {t("netUpstreamDns")}
                </text>

                {/* ── Security annotations ── */}
                <text x="30" y="562" className="net-st">
                  {t("netSecAnnot1")}
                </text>
                <text x="30" y="578" className="net-st">
                  {t("netSecAnnot2")}
                </text>

                {/* ── Legend ── */}
                <rect x="30" y="590" width="940" height="96" rx="5" className="net-leg-box" />
                <text x="500" y="610" textAnchor="middle" className="net-tl">
                  {t("netLegendLabel")}
                </text>
                <line x1="45" y1="626" x2="105" y2="626" className="net-leg-line-main" />
                <text x="112" y="630" className="net-lt">
                  {t("netLeg1")}
                </text>
                <line x1="45" y1="646" x2="105" y2="646" className="net-leg-line-mgmt" />
                <text x="112" y="650" className="net-lt">
                  {t("netLeg2")}
                </text>
                <line x1="45" y1="666" x2="105" y2="666" className="net-leg-line-exc" />
                <text x="112" y="670" className="net-lt">
                  {t("netLeg3")}
                </text>
              </svg>
            </div>
            <p className="infra-diagram-hint" aria-hidden="true">
              {t("swipeHint")}
            </p>
          </div>
        </CollapsibleSection>

        {/* Design Philosophy */}
        <CollapsibleSection title={labels?.designPhilosophy || "設計哲学"} defaultOpen>
          <div className="infra-panel">
            <ul className="infra-list">
              {pickArr(data.design_philosophy_en, data.design_philosophy).map((item, idx) => (
                <li key={idx} className="infra-list__item">
                  <span className="infra-bullet">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>

        {/* Hypervisor */}
        <CollapsibleSection title={`🖥️ ${labels?.hypervisor || "Proxmox VE"}`} defaultOpen>
          <div className="infra-panel">
            <h3 className="infra-hypervisor__platform">{data.hypervisor.platform}</h3>
            <p className="infra-hypervisor__purpose">
              {pickLang(
                lang,
                data.hypervisor.purpose_en ?? data.hypervisor.purpose,
                data.hypervisor.purpose,
              )}
            </p>
            <h4 className="infra-subhead">{t("keyFeatures")}</h4>
            <ul className="infra-list">
              {pickArr(data.hypervisor.key_features_en, data.hypervisor.key_features).map(
                (feature, idx) => (
                  <li key={idx} className="infra-list__item infra-list__item--sm">
                    <span className="infra-bullet">•</span>
                    {feature}
                  </li>
                ),
              )}
            </ul>
          </div>
        </CollapsibleSection>

        {/* Nodes */}
        <CollapsibleSection title={labels?.nodes || "ノード構成"} defaultOpen>
          {data.nodes.map((node) => (
            <CollapsibleSection
              key={node.id}
              className="infra-node"
              title={
                <span className="infra-node__head">
                  <span className="infra-node__name">
                    {pickLang(lang, node.name_en ?? node.name, node.name)} -{" "}
                    {pickLang(lang, node.role_en ?? node.role, node.role)}
                  </span>
                  <span className="infra-node__hw">
                    <strong>{t("lblHardware")}</strong> {formatHardware(node.hardware)}
                  </span>
                </span>
              }
            >
              <p className="infra-subhead">{t("lblPurpose")}</p>
              <p className="infra-muted">
                {pickLang(lang, node.purpose_en ?? node.purpose, node.purpose)}
              </p>

              <p className="infra-subhead">{t("lblWorkloads")}</p>
              <ul className="infra-list">
                {node.workloads.map((wl, idx) => (
                  <li key={idx} className="infra-node__wl">
                    <span className="infra-bullet">→</span>
                    <strong>{wl.name}</strong> ({workloadKindLabel(wl.kind)}
                    {wl.vmid ? ` VMID:${wl.vmid}` : ""}){wl.os && ` - ${wl.os}`}
                    {wl.purpose && (
                      <p className="infra-node__wl-purpose">
                        {pickLang(lang, wl.purpose_en ?? wl.purpose, wl.purpose)}
                      </p>
                    )}
                    {wl.details && (
                      <ul className="infra-node__wl-details">
                        {pickArr(wl.details_en, wl.details).map((detail, didx) => (
                          <li key={didx} className="infra-muted">
                            • {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          ))}
        </CollapsibleSection>

        {/* Network Design */}
        <CollapsibleSection title={labels?.networkDesign || "ネットワーク設計"}>
          <div className="infra-panel">
            <p>
              <strong>{t("lblTopology")}</strong>{" "}
              {pickLang(
                lang,
                data.network_design.topology_en ?? data.network_design.topology,
                data.network_design.topology,
              )}
            </p>
            <p>
              <strong>{t("lblDns")}</strong>{" "}
              {pickLang(
                lang,
                data.network_design.dns_en ?? data.network_design.dns,
                data.network_design.dns,
              )}
            </p>
            <p className="infra-subhead">{t("lblSecurityMeasures")}</p>
            <ul className="infra-list">
              {pickArr(data.network_design.security_en, data.network_design.security).map(
                (sec, idx) => (
                  <li key={idx} className="infra-list__item infra-list__item--sm">
                    <span className="infra-bullet">•</span>
                    {sec}
                  </li>
                ),
              )}
            </ul>
          </div>
        </CollapsibleSection>

        {/* Security Model */}
        <CollapsibleSection title={`🔐 ${labels?.securityModel || "セキュリティモデル"}`}>
          <div className="infra-grid">
            <div className="infra-card">
              <h4 className="infra-card__title">{t("cardSshConfig")}</h4>
              <ul className="infra-list">
                <li>
                  {t("lblRootLogin")} <strong>{data.security_model.ssh.root_login}</strong>
                </li>
                <li>
                  {t("lblPasswordAuth")} <strong>{data.security_model.ssh.password_auth}</strong>
                </li>
                <li>
                  {t("lblKeyType")} <strong>{data.security_model.ssh.key_type}</strong>
                </li>
                <li>
                  {t("lblAccessMethod")} <strong>{data.security_model.ssh.access_method}</strong>
                </li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">{t("cardAuthentication")}</h4>
              <ul className="infra-list">
                <li>
                  Proxmox: <strong>{data.security_model.authentication.proxmox}</strong>
                </li>
                <li>
                  Linux VM: <strong>{data.security_model.authentication.linux_vms}</strong>
                </li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">{t("cardBackupStrategy")}</h4>
              <ul className="infra-list">
                {pickArr(
                  data.security_model.backup_strategy_en,
                  data.security_model.backup_strategy,
                ).map((strategy, idx) => (
                  <li key={idx}>• {strategy}</li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Operations */}
        <CollapsibleSection title={t("secOperations")}>
          <div className="infra-grid">
            <div className="infra-card">
              <h4 className="infra-card__title">{t("cardMonitoring")}</h4>
              <ul className="infra-list">
                <li>
                  {t("lblTool")} <strong>{data.operations.monitoring.tool}</strong>
                </li>
                <li>
                  {t("lblServer")}{" "}
                  <strong>
                    {pickLang(
                      lang,
                      data.operations.monitoring.server_en ?? data.operations.monitoring.server,
                      data.operations.monitoring.server,
                    )}
                  </strong>
                </li>
                <li>
                  {pickLang(
                    lang,
                    data.operations.monitoring.coverage_en ?? data.operations.monitoring.coverage,
                    data.operations.monitoring.coverage,
                  )}
                </li>
                <li>
                  {pickLang(
                    lang,
                    data.operations.monitoring.alerting_en ?? data.operations.monitoring.alerting,
                    data.operations.monitoring.alerting,
                  )}
                </li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">{t("cardAccessMgmt")}</h4>
              <ul className="infra-list">
                <li>
                  {t("lblInternal")}{" "}
                  {pickLang(
                    lang,
                    data.operations.access_management.internal_en ??
                      data.operations.access_management.internal,
                    data.operations.access_management.internal,
                  )}
                </li>
                <li>
                  {t("lblRemote")}{" "}
                  {pickLang(
                    lang,
                    data.operations.access_management.remote_desktop_en ??
                      data.operations.access_management.remote_desktop,
                    data.operations.access_management.remote_desktop,
                  )}
                </li>
                <li>
                  {t("lblAuth")}{" "}
                  <strong>
                    {pickLang(
                      lang,
                      data.operations.access_management.authentication_en ??
                        data.operations.access_management.authentication,
                      data.operations.access_management.authentication,
                    )}
                  </strong>
                </li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">{t("cardReliability")}</h4>
              <ul className="infra-list">
                <li>
                  {pickLang(
                    lang,
                    data.operations.reliability.uptime_target_en ??
                      data.operations.reliability.uptime_target,
                    data.operations.reliability.uptime_target,
                  )}
                </li>
                <li>
                  {pickLang(
                    lang,
                    data.operations.reliability.restart_policy_en ??
                      data.operations.reliability.restart_policy,
                    data.operations.reliability.restart_policy,
                  )}
                </li>
                <li>
                  {pickLang(
                    lang,
                    data.operations.reliability.backup_en ?? data.operations.reliability.backup,
                    data.operations.reliability.backup,
                  )}
                </li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Technology Stack */}
        <CollapsibleSection title={labels?.technologyStack || "テクノロジースタック"}>
          <div className="infra-grid infra-grid--narrow">
            {Object.entries(data.technology_stack).map(([category, items]: [string, string[]]) => (
              <div key={category} className="infra-card">
                <h4 className="infra-card__title">{stackLabel(category)}</h4>
                <div className="infra-chips">
                  {items.map((item, idx) => (
                    <span key={idx} className="infra-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Future Roadmap */}
        <CollapsibleSection title={t("secRoadmap")}>
          <div className="infra-grid">
            {Object.entries(data.future_roadmap).map(
              ([phase, phaseData]: [string, InfraRoadmapPhase]) => (
                <div key={phase} className="infra-card">
                  <h4 className="infra-card__title">{roadmapLabel(phase)}</h4>
                  <p className="infra-muted">
                    {pickLang(lang, phaseData.status_en ?? phaseData.status, phaseData.status)}
                  </p>
                  <ul className="infra-list">
                    {pickArr(phaseData.components_en, phaseData.components).map((comp, idx) => (
                      <li key={idx} className="infra-list__item infra-list__item--sm">
                        <span className="infra-bullet">▸</span>
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </CollapsibleSection>

        {/* Learning Outcomes */}
        <CollapsibleSection title={`📚 ${labels?.learningOutcomes || "学習成果"}`}>
          <div className="infra-panel">
            <ul className="infra-list">
              {pickArr(data.learning_outcomes_en, data.learning_outcomes).map((outcome, idx) => (
                <li key={idx} className="infra-list__item">
                  <span className="infra-bullet">→</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};
