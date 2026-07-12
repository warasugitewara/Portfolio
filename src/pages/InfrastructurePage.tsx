import { useEffect, useState } from "react";
import type { I18n, InfrastructureData, InfraRoadmapPhase } from "../types";
import { getDataUrl } from "../utils/path";
import { CollapsibleSection } from "../components/CollapsibleSection";
import "../styles/infrastructure.css";

interface InfrastructurePageProps {
  i18n: I18n | null;
}

/* ── Architecture-diagram node inventory (source: infrastructure.json) ── */
type DgmRow = {
  icon: string;
  name: string;
  id: string;
  note: string;
  variant?: "core" | "cf" | "warn";
};

const HP1_ROWS: DgmRow[] = [
  { icon: "🎵", name: "Music-Bot", id: "CT101", note: "Discord 音楽ボット" },
  { icon: "🏠", name: "homepage", id: "CT108", note: "ダッシュボード (gethomepage)" },
  { icon: "🔊", name: "Yomiage-Bot", id: "CT304", note: "読み上げ (VOICEVOX)" },
  { icon: "🗣️", name: "Voicevox-Engine", id: "VM600", note: "TTS 音声合成エンジン" },
];

const HP2_ROWS: DgmRow[] = [
  {
    icon: "🛡️",
    name: "OPNsense",
    id: "VM500",
    note: "メイン FW・ルータ / 0.x·1.x 分離",
    variant: "core",
  },
  { icon: "🔐", name: "twingate-1.x", id: "CT105", note: "ゼロトラスト (1.x)" },
  { icon: "🛡️", name: "adguard-1.x", id: "CT106", note: "DNS フィルタ (1.x)" },
  { icon: "🛡️", name: "adguard-0.x", id: "CT107", note: "DNS フィルタ (0.x 冗長)" },
  { icon: "💾", name: "MC-Backup", id: "CT100", note: "DriveBackupV2 受け · FileBrowser" },
  { icon: "🔀", name: "Headroom-Proxy", id: "CT700", note: "AI コンテキスト圧縮" },
  { icon: "🔒", name: "secrets1", id: "CT1000", note: "非公開" },
];

const DELL_ROWS: DgmRow[] = [
  { icon: "🔐", name: "twingate-0.x", id: "CT102", note: "ゼロトラスト (0.x)" },
  { icon: "🌐", name: "portfolio", id: "CT103", note: "Bun+Hono · CF Tunnel", variant: "cf" },
  { icon: "📡", name: "pote-monitor", id: "CT104", note: "BTC/ETH Discord 通知" },
  { icon: "🎮", name: "Velocity", id: "CT301", note: "Minecraft プロキシ" },
  { icon: "📺", name: "MeTube", id: "CT302", note: "動画DL (yt-dlp)" },
  { icon: "📊", name: "Zabbix-Server", id: "CT400", note: "クラスター監視" },
];

const DGM_ROW_Y0 = 283;
const DGM_ROW_STEP = 46;
const DGM_COL_W = 370;

const renderNodeRows = (colX: number, rows: DgmRow[]) =>
  rows.map((row, i) => {
    const y = DGM_ROW_Y0 + i * DGM_ROW_STEP;
    const rectClass =
      row.variant === "core"
        ? "dgm-row-rect dgm-row-rect--core"
        : row.variant === "cf"
          ? "dgm-row-rect dgm-row-rect--cf"
          : row.variant === "warn"
            ? "dgm-row-rect dgm-row-rect--warn"
            : "dgm-row-rect";
    return (
      <g key={row.name}>
        <rect x={colX + 10} y={y} width={DGM_COL_W - 20} height={40} rx={3} className={rectClass} />
        <text x={colX + 22} y={y + 17} className="dgm-row-name">
          {row.icon} {row.name}
        </text>
        <text x={colX + DGM_COL_W - 22} y={y + 17} textAnchor="end" className="dgm-row-id">
          {row.id}
        </text>
        <text x={colX + 22} y={y + 33} className="dgm-row-note">
          {row.note}
        </text>
      </g>
    );
  });

export const InfrastructurePage = ({ i18n }: InfrastructurePageProps) => {
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

  const stackLabel = (category: string): string => {
    switch (category) {
      case "virtualization":
        return "仮想化";
      case "networking":
        return "ネットワーク";
      case "storage":
        return "ストレージ";
      case "security":
        return "セキュリティ";
      case "applications":
        return "アプリケーション";
      default:
        return category;
    }
  };

  const roadmapLabel = (phase: string): string => {
    switch (phase) {
      case "phase_1_current":
        return "フェーズ 1: 完了";
      case "phase_2_planned":
        return "フェーズ 2: 完了";
      case "phase_3_future":
        return "フェーズ 3: 計画中";
      case "phase_4_longterm":
        return "フェーズ 4: 長期構想";
      default:
        return phase;
    }
  };

  return (
    <div className="infra-page">
      <div className="section-container">
        {/* Title */}
        <h1 className="infra-title">🖧 {data.title}</h1>
        <p className="infra-subtitle">{data.subtitle}</p>

        {/* Overview */}
        <div className="infra-overview">
          <p>{data.overview}</p>
        </div>

        {/* Architecture Diagram */}
        <CollapsibleSection title="📊 アーキテクチャ図" defaultOpen>
          <div className="infra-diagram-wrap">
            <div className="infra-diagram-canvas">
              <svg
                viewBox="0 0 1200 1150"
                className="infra-svg"
                role="img"
                aria-label="waras-nw 3ノード Proxmox VE クラスター構成図（＋ベアメタル Minecraft サーバー）"
              >
                <text x="600" y="34" textAnchor="middle" className="dgm-title">
                  ホームラボ インフラ — waras-nw 3ノード Proxmox VE クラスター
                </text>

                {/* ── Network-core flow ── */}
                <text x="20" y="64" className="dgm-section-label">
                  接続 &amp; ネットワーク中核
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
                  メイン FW・ルータ (HP-2 VM500)
                </text>

                <path d="M 495 102 L 541 102" className="dgm-connector" />
                <polygon points="545,102 536,97 540,102 536,107" className="dgm-arrow" />

                <rect x="545" y="74" width="250" height="26" rx="3" className="dgm-seg-rect" />
                <text x="670" y="91" textAnchor="middle" className="dgm-label">
                  192.168.0.x — メイン
                </text>
                <rect x="545" y="104" width="250" height="26" rx="3" className="dgm-seg-rect" />
                <text x="670" y="121" textAnchor="middle" className="dgm-label">
                  192.168.1.x — 隔離
                </text>

                <rect x="815" y="74" width="365" height="56" rx="4" className="dgm-node-rect" />
                <text x="997" y="98" textAnchor="middle" className="dgm-node-text">
                  🔒 Twingate ZT + ☁️ Cloudflare Tunnel
                </text>
                <text x="997" y="116" textAnchor="middle" className="dgm-label">
                  受信接続ゼロ / 外部ポート開放なし
                </text>

                {/* ── Cluster ── */}
                <rect
                  x="15"
                  y="185"
                  width="1170"
                  height="490"
                  rx="6"
                  className="dgm-cluster-rect"
                />
                <text x="600" y="210" textAnchor="middle" className="dgm-node-text">
                  🖧 waras-nw クラスター (Proxmox VE 9.x)
                </text>

                {/* HP-1 */}
                <rect
                  x="25"
                  y="220"
                  width="370"
                  height="445"
                  rx="4"
                  className="dgm-node-inner-rect"
                />
                <text x="210" y="246" textAnchor="middle" className="dgm-node-text">
                  🖥️ HP-1
                </text>
                <text x="210" y="265" textAnchor="middle" className="dgm-label">
                  HP Z240 SFF · Xeon E3-1225 · 16GB
                </text>
                {renderNodeRows(25, HP1_ROWS)}

                {/* HP-2 */}
                <rect
                  x="415"
                  y="220"
                  width="370"
                  height="445"
                  rx="4"
                  className="dgm-node-inner-rect"
                />
                <text x="600" y="246" textAnchor="middle" className="dgm-node-text">
                  🖥️ HP-2 — ネットワーク中核
                </text>
                <text x="600" y="265" textAnchor="middle" className="dgm-label">
                  HP Z240 SFF · Xeon E3-1245 v5 · 16GB
                </text>
                {renderNodeRows(415, HP2_ROWS)}

                {/* Dell */}
                <rect
                  x="805"
                  y="220"
                  width="370"
                  height="445"
                  rx="4"
                  className="dgm-node-inner-rect"
                />
                <text x="990" y="246" textAnchor="middle" className="dgm-node-text">
                  🖥️ Dell
                </text>
                <text x="990" y="265" textAnchor="middle" className="dgm-label">
                  OptiPlex 7040 SFF · i3-6100 · 8GB
                </text>
                {renderNodeRows(805, DELL_ROWS)}

                {/* ── Summary boxes ── */}
                <rect x="15" y="695" width="282" height="118" rx="4" className="dgm-node-rect" />
                <text x="156" y="723" textAnchor="middle" className="dgm-node-text">
                  💾 ストレージ
                </text>
                <text x="30" y="748" className="dgm-label dgm-label--sm">
                  • HP-1: HDD / HP-2: SSD+HDD
                </text>
                <text x="30" y="766" className="dgm-label dgm-label--sm">
                  • Dell: SSD 128GB + Toshiba HDD
                </text>
                <text x="30" y="784" className="dgm-label dgm-label--sm">
                  • Proxmox スナップショット
                </text>

                <rect x="311" y="695" width="282" height="118" rx="4" className="dgm-node-rect" />
                <text x="452" y="723" textAnchor="middle" className="dgm-node-text">
                  ☁️ バックアップ
                </text>
                <text x="326" y="748" className="dgm-label dgm-label--sm">
                  • Google Drive クラウド
                </text>
                <text x="326" y="766" className="dgm-label dgm-label--sm">
                  • USB コールドバックアップ
                </text>
                <text x="326" y="784" className="dgm-label dgm-label--sm">
                  • Proxmox VM バックアップ
                </text>
                <text x="326" y="802" className="dgm-label dgm-label--sm">
                  • DriveBackupV2 (MC ワールド 1週間分)
                </text>

                <rect x="607" y="695" width="282" height="118" rx="4" className="dgm-node-rect" />
                <text x="748" y="723" textAnchor="middle" className="dgm-node-text">
                  🔐 セキュリティ
                </text>
                <text x="622" y="748" className="dgm-label dgm-label--sm">
                  • OPNsense FW + セグメント分離
                </text>
                <text x="622" y="766" className="dgm-label dgm-label--sm">
                  • Ed25519 SSH鍵 / PW認証無効
                </text>
                <text x="622" y="784" className="dgm-label dgm-label--sm">
                  • TOTP 2FA + Anubis
                </text>

                <rect x="903" y="695" width="282" height="118" rx="4" className="dgm-node-rect" />
                <text x="1044" y="723" textAnchor="middle" className="dgm-node-text">
                  📊 監視・運用
                </text>
                <text x="918" y="748" className="dgm-label dgm-label--sm">
                  • Zabbix (Dell CT400)
                </text>
                <text x="918" y="766" className="dgm-label dgm-label--sm">
                  • pote-monitor (CT104)
                </text>
                <text x="918" y="784" className="dgm-label dgm-label--sm">
                  • Proxmox Web UI
                </text>

                {/* ── Legend ── */}
                <rect x="15" y="833" width="1170" height="300" rx="4" className="dgm-node-rect" />
                <text x="600" y="865" textAnchor="middle" className="dgm-legend-title">
                  📋 凡例 / システム構成
                </text>
                <text x="35" y="900" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🖧</tspan> waras-nw — Proxmox VE 9.x 3ノード
                  (HP-1 / HP-2 / Dell)
                </text>
                <text x="35" y="930" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🛡️</tspan> ネットワーク中核 — OPNsense (HP-2
                  VM500) が 192.168.0.x / 192.168.1.x を分離
                </text>
                <text x="35" y="960" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🔐</tspan> ゼロトラスト — Twingate
                  を各セグメントに冗長 (1.x: CT105 / 0.x: CT102)
                </text>
                <text x="35" y="990" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🛡️</tspan> DNS フィルタ — AdGuard Home
                  を各セグメントに冗長 (1.x: CT106 / 0.x: CT107)
                </text>
                <text x="35" y="1020" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">☁️</tspan> 公開 — Cloudflare Tunnel で
                  portfolio.warasugi.com を受信ゼロ公開 / 外部ポート開放なし
                </text>
                <text x="35" y="1050" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">📊</tspan> 監視 — Zabbix (Dell CT400) +
                  pote-monitor (CT104)
                </text>
                <text x="35" y="1080" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">🎮</tspan> ベアメタルMC — Purpur
                  サバイバル常時稼働 (i7-3770 / 16GB / SSD 256GB · Debian 13 · 旧 Kasm WS 転用)
                  クラスター外・0.x 配下
                </text>
                <text x="35" y="1110" className="dgm-legend-text">
                  <tspan className="dgm-legend-icon">💾</tspan> ワールドバックアップ — DriveBackupV2
                  → HP-2 MC-Backup (CT100)。深夜4時・40MB/s 制限・1週間分保持
                </text>
              </svg>
            </div>
            <p className="infra-diagram-hint" aria-hidden="true">
              ← スワイプでスクロール →
            </p>

            {/* Architecture Notes */}
            <div className="infra-notes">
              <h4 className="infra-notes__title">アーキテクチャのポイント</h4>
              <ul className="infra-notes__list">
                <li>
                  ✓ ネットワーク中核 — OPNsense (HP-2 VM500) が 192.168.0.x / 192.168.1.x
                  を分離しルーティング
                </li>
                <li>✓ DNS 冗長 — AdGuard Home を各セグメントに配置 (1.x: CT106 / 0.x: CT107)</li>
                <li>
                  ✓ ゼロトラスト冗長 — Twingate を 2 セグメントに配置 (1.x: HP-2 CT105 / 0.x: Dell
                  CT102)
                </li>
                <li>
                  ✓ 公開は Cloudflare Tunnel のみ — portfolio.warasugi.com (Dell CT103)
                  を受信ゼロで公開
                </li>
                <li>
                  ✓ Minecraft はベアメタル専用機（Debian 13 · 0.x 配下 · 旧 Kasm WS 転用）で Purpur
                  サバイバルを常時稼働 — アクセスは別拠点（東京）の Velocity
                  経由のみで直接露出ゼロ（Dell CT301 連携）。GraalVM 17/21/25.1 併用・webmap は
                  Cloudflare Tunnel 公開
                </li>
                <li>
                  ✓ ワールドバックアップ — DriveBackupV2 が深夜4時に HP-2 MC-Backup (CT100)
                  へ転送（40MB/s 帯域制限・1週間分保持）。取り出しは FileBrowser（Cloudflare Tunnel
                  公開）
                </li>
                <li>✓ 監視・多層防御 — Zabbix (Dell CT400) + Ed25519 SSH鍵 + TOTP 2FA + Anubis</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Network Topology */}
        <CollapsibleSection title="🌐 ネットワーク通信経路" defaultOpen>
          <div className="infra-diagram-wrap">
            <div className="infra-diagram-canvas">
              <svg
                viewBox="0 0 1000 700"
                className="infra-svg"
                role="img"
                aria-label="OPNsense によるセグメント分離とゼロトラストの通信経路図"
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
                  🔐 Twingate ゼロトラスト
                </text>
                <line x1="30" y1="128" x2="330" y2="128" className="net-divider" />
                <text x="180" y="145" textAnchor="middle" className="net-rt">
                  ② 管理ルート
                </text>
                <text x="180" y="163" textAnchor="middle" className="net-sl">
                  SSH / Proxmox WebUI / 内部サービス
                </text>
                <text x="180" y="180" textAnchor="middle" className="net-sl">
                  内部発信のみ・inbound なし
                </text>
                <text x="180" y="197" textAnchor="middle" className="net-sl">
                  冗長: 1.x CT105 / 0.x CT102
                </text>

                {/* ── ① Cloudflare (public) ── */}
                <rect x="350" y="100" width="300" height="112" rx="5" className="net-ft-cf" />
                <text x="500" y="120" textAnchor="middle" className="net-cl">
                  ☁️ Cloudflare Tunnel
                </text>
                <line x1="350" y1="128" x2="650" y2="128" className="net-divider-cf" />
                <text x="500" y="145" textAnchor="middle" className="net-rt-cf">
                  ① 公開ルート
                </text>
                <text x="500" y="163" textAnchor="middle" className="net-sl">
                  portfolio.warasugi.com
                </text>
                <text x="500" y="180" textAnchor="middle" className="net-sl">
                  受信接続ゼロ (outbound tunnel)
                </text>
                <text x="500" y="197" textAnchor="middle" className="net-sl">
                  → portfolio (Dell CT103) / FileBrowser (HP-2 CT100)
                </text>

                {/* ── ③ Minecraft (exception) ── */}
                <rect x="670" y="100" width="300" height="112" rx="5" className="net-ft-warn" />
                <text x="820" y="120" textAnchor="middle" className="net-warn-tl">
                  🎮 Minecraft 公開
                </text>
                <line x1="670" y1="128" x2="970" y2="128" className="net-divider" />
                <text x="820" y="145" textAnchor="middle" className="net-warn-txt">
                  ③ Minecraft ルート (東京 Velocity 経由)
                </text>
                <text x="820" y="163" textAnchor="middle" className="net-sl">
                  ベアメタル専用機 (0.x 配下) — Purpur サバイバル鯖
                </text>
                <text x="820" y="180" textAnchor="middle" className="net-sl">
                  ← 東京 Velocity 経由 (Dell CT301 連携)
                </text>
                <text x="820" y="197" textAnchor="middle" className="net-sl">
                  自宅の受信接続はゼロ
                </text>

                {/* routes → OPNsense */}
                <path d="M 180 212 L 430 248" className="net-al-mgmt" />
                <path d="M 500 212 L 500 248" className="net-al-main" />
                <path d="M 820 212 L 575 248" className="net-al-exc" />

                {/* ── OPNsense core ── */}
                <rect x="200" y="250" width="600" height="64" rx="5" className="net-core-rect" />
                <text x="500" y="276" textAnchor="middle" className="net-tl">
                  🛡️ OPNsense — メイン FW / ルータ (HP-2 VM500)
                </text>
                <text x="500" y="296" textAnchor="middle" className="net-sl">
                  192.168.0.x ⇄ 192.168.1.x セグメント分離 / NAT / DNS 制御
                </text>

                {/* OPNsense → segments */}
                <path d="M 400 314 L 250 350" className="net-al-mgmt" />
                <path d="M 600 314 L 750 350" className="net-al-mgmt" />

                {/* ── 0.x segment ── */}
                <rect x="30" y="352" width="450" height="190" rx="5" className="net-seg-rect" />
                <text x="255" y="374" textAnchor="middle" className="net-seg-head">
                  192.168.0.x — メインセグメント
                </text>
                <line x1="45" y1="382" x2="465" y2="382" className="net-divider" />
                <text x="48" y="402" className="net-seg-row">
                  🛡️ adguard-0.x [CT107] — AdGuard Home DNS (冗長)
                </text>
                <text x="48" y="422" className="net-seg-row">
                  🔐 twingate-0.x [CT102 · Dell] — ゼロトラスト
                </text>
                <text x="48" y="442" className="net-nc">
                  🌐 portfolio [CT103 · Dell] — ← Cloudflare Tunnel 公開
                </text>
                <text x="48" y="462" className="net-seg-row">
                  📡 pote-monitor · 🎮 Velocity · 📺 MeTube · 📊 Zabbix (Dell)
                </text>
                <text x="48" y="482" className="net-warn-txt">
                  🎮 Minecraft ベアメタル機 — 東京 Velocity 経由 / webmap は CF Tunnel
                </text>
                <text x="48" y="502" className="net-sl">
                  上流 DNS: Cloudflare 1.1.1.1 / 1.0.0.1
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
                  192.168.1.x — 隔離セグメント (OPNsense 分離)
                </text>
                <line x1="535" y1="382" x2="955" y2="382" className="net-divider-cf" />
                <text x="538" y="402" className="net-seg-row">
                  🛡️ adguard-1.x [CT106 · HP-2] — AdGuard Home DNS
                </text>
                <text x="538" y="422" className="net-seg-row">
                  🔐 twingate-1.x [CT105 · HP-2] — ゼロトラスト
                </text>
                <text x="538" y="442" className="net-warn-txt">
                  💾 MC-Backup [CT100 · HP-2] — DriveBackupV2 受け / FileBrowser
                </text>
                <text x="538" y="462" className="net-seg-row">
                  🔀 Headroom-Proxy · 🔒 secrets1 (HP-2)
                </text>
                <text x="538" y="482" className="net-sl">
                  上流 DNS: Cloudflare 1.1.1.1 / 1.0.0.1
                </text>

                {/* ── Security annotations ── */}
                <text x="30" y="562" className="net-st">
                  🔒 外部ポート開放ゼロ — 受信接続なし (Cloudflare Tunnel) / Minecraft も東京
                  Velocity 経由
                </text>
                <text x="30" y="578" className="net-st">
                  🔐 SSH・Proxmox WebUI・内部サービスは Twingate ゼロトラスト経由のみ
                  (2セグメント冗長)
                </text>

                {/* ── Legend ── */}
                <rect x="30" y="590" width="940" height="96" rx="5" className="net-leg-box" />
                <text x="500" y="610" textAnchor="middle" className="net-tl">
                  凡例 / Legend
                </text>
                <line x1="45" y1="626" x2="105" y2="626" className="net-leg-line-main" />
                <text x="112" y="630" className="net-lt">
                  ① 公開ルート — Internet → Cloudflare Tunnel → portfolio.warasugi.com (受信ゼロ)
                </text>
                <line x1="45" y1="646" x2="105" y2="646" className="net-leg-line-mgmt" />
                <text x="112" y="650" className="net-lt">
                  ② 管理ルート — Twingate ゼロトラスト → SSH / Proxmox / 内部サービス
                </text>
                <line x1="45" y1="666" x2="105" y2="666" className="net-leg-line-exc" />
                <text x="112" y="670" className="net-lt">
                  ③ Minecraft (ベアメタル機 · 0.x 配下) — 別拠点(東京) Velocity 経由で公開
                  (自宅受信ゼロ)
                </text>
              </svg>
            </div>
            <p className="infra-diagram-hint" aria-hidden="true">
              ← スワイプでスクロール →
            </p>
          </div>
        </CollapsibleSection>

        {/* Design Philosophy */}
        <CollapsibleSection title={labels?.designPhilosophy || "設計哲学"} defaultOpen>
          <div className="infra-panel">
            <ul className="infra-list">
              {data.design_philosophy.map((item, idx) => (
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
            <p className="infra-hypervisor__purpose">{data.hypervisor.purpose}</p>
            <h4 className="infra-subhead">主な機能:</h4>
            <ul className="infra-list">
              {data.hypervisor.key_features.map((feature, idx) => (
                <li key={idx} className="infra-list__item infra-list__item--sm">
                  <span className="infra-bullet">•</span>
                  {feature}
                </li>
              ))}
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
                    {node.name} - {node.role}
                  </span>
                  <span className="infra-node__hw">
                    <strong>ハードウェア:</strong> {node.hardware}
                  </span>
                </span>
              }
            >
              <p className="infra-subhead">目的:</p>
              <p className="infra-muted">{node.purpose}</p>

              <p className="infra-subhead">ワークロード:</p>
              <ul className="infra-list">
                {node.workloads.map((wl, idx) => (
                  <li key={idx} className="infra-node__wl">
                    <span className="infra-bullet">→</span>
                    <strong>{wl.name}</strong> ({wl.type}
                    {wl.vmid ? ` VMID:${wl.vmid}` : ""}){wl.os && ` - ${wl.os}`}
                    {wl.purpose && <p className="infra-node__wl-purpose">{wl.purpose}</p>}
                    {wl.details && (
                      <ul className="infra-node__wl-details">
                        {wl.details.map((detail, didx) => (
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
              <strong>トポロジー:</strong> {data.network_design.topology}
            </p>
            <p>
              <strong>DNS:</strong> {data.network_design.dns}
            </p>
            <p className="infra-subhead">セキュリティ対策:</p>
            <ul className="infra-list">
              {data.network_design.security.map((sec, idx) => (
                <li key={idx} className="infra-list__item infra-list__item--sm">
                  <span className="infra-bullet">•</span>
                  {sec}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>

        {/* Security Model */}
        <CollapsibleSection title={`🔐 ${labels?.securityModel || "セキュリティモデル"}`}>
          <div className="infra-grid">
            <div className="infra-card">
              <h4 className="infra-card__title">SSH設定</h4>
              <ul className="infra-list">
                <li>
                  Root ログイン: <strong>{data.security_model.ssh.root_login}</strong>
                </li>
                <li>
                  パスワード認証: <strong>{data.security_model.ssh.password_auth}</strong>
                </li>
                <li>
                  鍵タイプ: <strong>{data.security_model.ssh.key_type}</strong>
                </li>
                <li>
                  アクセス方法: <strong>{data.security_model.ssh.access_method}</strong>
                </li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">認証</h4>
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
              <h4 className="infra-card__title">バックアップ戦略</h4>
              <ul className="infra-list">
                {data.security_model.backup_strategy.map((strategy, idx) => (
                  <li key={idx}>• {strategy}</li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Operations */}
        <CollapsibleSection title="⚙️ 運用・監視">
          <div className="infra-grid">
            <div className="infra-card">
              <h4 className="infra-card__title">📊 監視</h4>
              <ul className="infra-list">
                <li>
                  ツール: <strong>{data.operations.monitoring.tool}</strong>
                </li>
                <li>
                  サーバー: <strong>{data.operations.monitoring.server}</strong>
                </li>
                <li>{data.operations.monitoring.coverage}</li>
                <li>{data.operations.monitoring.alerting}</li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">🔐 アクセス管理</h4>
              <ul className="infra-list">
                <li>内部: {data.operations.access_management.internal}</li>
                <li>リモート: {data.operations.access_management.remote_desktop}</li>
                <li>
                  認証: <strong>{data.operations.access_management.authentication}</strong>
                </li>
              </ul>
            </div>
            <div className="infra-card">
              <h4 className="infra-card__title">🔄 可用性</h4>
              <ul className="infra-list">
                <li>{data.operations.reliability.uptime_target}</li>
                <li>{data.operations.reliability.restart_policy}</li>
                <li>{data.operations.reliability.backup}</li>
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
        <CollapsibleSection title="🛣️ 今後のロードマップ">
          <div className="infra-grid">
            {Object.entries(data.future_roadmap).map(
              ([phase, phaseData]: [string, InfraRoadmapPhase]) => (
                <div key={phase} className="infra-card">
                  <h4 className="infra-card__title">{roadmapLabel(phase)}</h4>
                  <p className="infra-muted">{phaseData.status}</p>
                  <ul className="infra-list">
                    {phaseData.components.map((comp, idx) => (
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
              {data.learning_outcomes.map((outcome, idx) => (
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
