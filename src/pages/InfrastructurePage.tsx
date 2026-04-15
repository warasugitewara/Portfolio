import { useEffect, useState } from 'react';
import { getDataUrl } from '../utils/path';

interface InfrastructurePageProps {
  i18n: any;
}

interface InfrastructureData {
  infrastructure: {
    title: string;
    subtitle: string;
    overview: string;
    design_philosophy: string[];
    hypervisor: {
      platform: string;
      purpose: string;
      key_features: string[];
    };
    nodes: Array<{
      id: string;
      name: string;
      hardware: string;
      role: string;
      purpose: string;
      workloads: Array<{
        type: string;
        name: string;
        vmid?: number;
        os?: string;
        purpose?: string;
        details?: string[];
      }>;
    }>;
    network_design: {
      topology: string;
      security: string[];
      dns: string;
    };
    security_model: {
      ssh: {
        root_login: string;
        password_auth: string;
        key_type: string;
        access_method: string;
      };
      backup_strategy: string[];
      authentication: {
        proxmox: string;
        linux_vms: string;
      };
    };
    technology_stack: {
      virtualization: string[];
      networking: string[];
      storage: string[];
      security: string[];
      applications: string[];
    };
    learning_outcomes: string[];
    future_roadmap: {
      phase_1_current: { status: string; components: string[] };
      phase_2_planned: { status: string; components: string[] };
      phase_3_future: { status: string; components: string[] };
    };
  };
}

export const InfrastructurePage = ({ i18n }: InfrastructurePageProps) => {
  const [infra, setInfra] = useState<InfrastructureData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    philosophy: true,
    diagram: true,
    hypervisor: true,
    nodes: true,
    network: false,
    security: false,
    techStack: false,
    roadmap: false,
    learning: false,
  });
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  useEffect(() => {
    const loadInfrastructure = async () => {
      try {
        const response = await fetch(getDataUrl('infrastructure.json'));
        if (!response.ok) throw new Error(`Failed to load infrastructure: ${response.status}`);
        const data = await response.json();
        setInfra(data);
      } catch (error) {
        console.error('Failed to load infrastructure:', error);
      }
    };

    loadInfrastructure();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!i18n || !infra) return null;

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="section-container">
        {/* Title */}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#00ff88' }}>
          🖧 {infra.infrastructure.title}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#999', marginBottom: '2rem' }}>
          {infra.infrastructure.subtitle}
        </p>

        {/* Overview */}
        <div style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'rgba(0,255,136,0.05)', borderLeft: '4px solid #00ff88', borderRadius: '4px' }}>
          <p style={{ lineHeight: '1.8', margin: '0' }}>{infra.infrastructure.overview}</p>
        </div>

        {/* Architecture Diagram */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('diagram')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            📊 アーキテクチャ図
            <span>{expandedSections.diagram ? '▼' : '▶'}</span>
          </button>
          {expandedSections.diagram && (
            <div style={{ padding: '2rem', marginTop: '1rem', backgroundColor: 'rgba(0,255,136,0.03)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)', overflowX: 'auto' }}>
              <div style={{ minWidth: '100%', backgroundColor: '#0a0e27', padding: '1rem', borderRadius: '4px' }}>
                <svg viewBox="0 0 1440 1500" style={{ width: '100%', height: 'auto', minHeight: '900px' }}>
                  <defs>
                    <style>{`
                      .node-rect { fill: rgba(0,255,136,0.1); stroke: #00ff88; stroke-width: 2; }
                      .node-text { fill: #00ff88; font-family: monospace; font-size: 16px; font-weight: bold; }
                      .label-text { fill: #ccc; font-family: monospace; font-size: 13px; }
                      .container-rect { fill: rgba(100,200,255,0.08); stroke: rgba(100,200,255,0.5); stroke-width: 1; }
                      .vm-rect { fill: rgba(255,200,100,0.08); stroke: rgba(255,200,100,0.5); stroke-width: 1; }
                      .connector-line { stroke: #00ff88; stroke-width: 2; fill: none; }
                      .arrow { fill: #00ff88; }
                      .section-label { fill: #999; font-family: monospace; font-size: 13px; font-style: italic; }
                      .title-text { fill: #00ff88; font-family: monospace; font-size: 20px; font-weight: bold; }
                      .legend-title { fill: #00ff88; font-family: monospace; font-size: 18px; font-weight: bold; }
                      .legend-text { fill: #ddd; font-family: monospace; font-size: 15px; }
                      .legend-icon-text { fill: #00ff88; font-family: monospace; font-size: 15px; font-weight: bold; }
                      .cluster-rect { fill: rgba(0,255,136,0.05); stroke: #00ff88; stroke-width: 3; stroke-dasharray: 8,4; }
                      .node-inner-rect { fill: rgba(0,255,136,0.08); stroke: rgba(0,255,136,0.6); stroke-width: 2; }
                    `}</style>
                  </defs>

                  {/* Title */}
                  <text x="720" y="40" textAnchor="middle" className="title-text">ホームラボ インフラストラクチャ — waras-nw クラスター (Proxmox VE 9.x)</text>

                  {/* Internet */}
                  <text x="50" y="80" className="section-label">接続回線</text>
                  <rect x="40" y="90" width="170" height="55" className="node-rect" rx="4"/>
                  <text x="125" y="118" textAnchor="middle" className="node-text">au one net</text>
                  <text x="125" y="134" textAnchor="middle" className="label-text">1Gbps</text>

                  {/* Twingate */}
                  <text x="265" y="80" className="section-label">ゼロトラスト層</text>
                  <rect x="260" y="90" width="210" height="55" className="node-rect" rx="4"/>
                  <text x="365" y="117" textAnchor="middle" className="node-text">🔒 Twingate</text>
                  <text x="365" y="135" textAnchor="middle" className="label-text">セキュアトンネル</text>

                  {/* LAN */}
                  <text x="535" y="80" className="section-label">ローカルネットワーク</text>
                  <rect x="530" y="90" width="870" height="55" className="node-rect" rx="4"/>
                  <text x="965" y="125" textAnchor="middle" className="node-text">🏠 Home LAN (192.168.x.x)</text>

                  {/* Arrows */}
                  <path d="M 210 117 L 258 117" className="connector-line"/>
                  <polygon points="260,117 252,113 257,117 252,121" className="arrow"/>
                  <path d="M 470 117 L 528 117" className="connector-line"/>
                  <polygon points="530,117 522,113 527,117 522,121" className="arrow"/>

                  {/* waras-nw Cluster */}
                  <rect x="40" y="175" width="1360" height="740" className="cluster-rect" rx="6"/>
                  <text x="720" y="202" textAnchor="middle" className="node-text">🖧 waras-nw (Proxmox VE 9.x — 3ノードクラスター)</text>

                  {/* ── HP-1 ── */}
                  <rect x="55" y="215" width="400" height="670" className="node-inner-rect" rx="4"/>
                  <text x="255" y="245" textAnchor="middle" className="node-text">🖥️ HP-1</text>
                  <text x="255" y="263" textAnchor="middle" className="label-text">HP Z240 SFF / Xeon E3-1225 / 16GB</text>

                  <text x="70" y="295" className="section-label">LXC</text>
                  <rect x="65" y="302" width="380" height="65" className="container-rect" rx="3"/>
                  <text x="255" y="327" textAnchor="middle" className="node-text">📓 obsidian-host [VMID:100]</text>
                  <text x="255" y="347" textAnchor="middle" className="label-text">livesync CouchDB</text>

                  <rect x="65" y="377" width="380" height="65" className="container-rect" rx="3"/>
                  <text x="255" y="402" textAnchor="middle" className="node-text">🎵 music-bot [VMID:101]</text>
                  <text x="255" y="422" textAnchor="middle" className="label-text">Discord 音楽ボット</text>

                  <text x="70" y="462" className="section-label">VM</text>
                  <rect x="65" y="469" width="380" height="115" className="vm-rect" rx="3"/>
                  <text x="255" y="494" textAnchor="middle" className="node-text">🎮 Minecraft [VMID:300]</text>
                  <text x="75" y="515" className="label-text" style={{ fontSize: '12px' }}>• Mechanical Mastery Modpack</text>
                  <text x="75" y="532" className="label-text" style={{ fontSize: '12px' }}>• Java Edition サーバー</text>

                  {/* ── HP-2 ── */}
                  <rect x="520" y="215" width="400" height="670" className="node-inner-rect" rx="4"/>
                  <text x="720" y="245" textAnchor="middle" className="node-text">🖥️ HP-2 (GPU)</text>
                  <text x="720" y="263" textAnchor="middle" className="label-text">HP Z240 SFF / Xeon E3-1245 v5 / 16GB</text>
                  <text x="720" y="280" textAnchor="middle" className="label-text">+ NVIDIA Quadro P600</text>

                  <text x="535" y="308" className="section-label">VM</text>
                  <rect x="530" y="315" width="380" height="225" className="vm-rect" rx="3"/>
                  <text x="720" y="340" textAnchor="middle" className="node-text">💻 dev-01 [VMID:200]</text>
                  <text x="720" y="358" textAnchor="middle" className="label-text">Debian + Xfce</text>
                  <text x="540" y="378" className="label-text" style={{ fontSize: '12px' }}>• WezTerm + SSH 開発環境</text>
                  <text x="540" y="395" className="label-text" style={{ fontSize: '12px' }}>• Neovim / CLI 中心ワークフロー</text>
                  <text x="540" y="412" className="label-text" style={{ fontSize: '12px' }}>• NVIDIA Quadro P600 PCIe パススルー</text>
                  <text x="540" y="429" className="label-text" style={{ fontSize: '12px' }}>• Sunshine/Moonlight ゲーミング</text>

                  <text x="535" y="562" className="section-label">LXC</text>
                  <rect x="530" y="569" width="380" height="65" className="container-rect" rx="3"/>
                  <text x="720" y="594" textAnchor="middle" className="node-text">🔐 twingate-connector [VMID:105]</text>
                  <text x="720" y="614" textAnchor="middle" className="label-text">ゼロトラストトンネル</text>

                  {/* ── Dell ── */}
                  <rect x="985" y="215" width="405" height="670" className="node-inner-rect" rx="4"/>
                  <text x="1187" y="245" textAnchor="middle" className="node-text">🖥️ Dell</text>
                  <text x="1187" y="263" textAnchor="middle" className="label-text">OptiPlex 7040 Micro / i3-6100 / 8GB</text>

                  <text x="1000" y="291" className="section-label">LXC</text>
                  <rect x="995" y="298" width="385" height="65" className="container-rect" rx="3"/>
                  <text x="1187" y="323" textAnchor="middle" className="node-text">🔐 twingate [VMID:102]</text>
                  <text x="1187" y="343" textAnchor="middle" className="label-text">ゼロトラストトンネル</text>

                  <rect x="995" y="373" width="385" height="65" className="container-rect" rx="3"/>
                  <text x="1187" y="398" textAnchor="middle" className="node-text">🌐 portfolio [VMID:103]</text>
                  <text x="1187" y="418" textAnchor="middle" className="label-text">Bun + Hono | warasugi.com</text>

                  <rect x="995" y="448" width="385" height="65" className="container-rect" rx="3"/>
                  <text x="1187" y="473" textAnchor="middle" className="node-text">📡 pote-monitor [VMID:104]</text>
                  <text x="1187" y="493" textAnchor="middle" className="label-text">Zabbix エージェント / プロキシ</text>

                  <text x="1000" y="533" className="section-label">VM</text>
                  <rect x="995" y="540" width="385" height="65" className="vm-rect" rx="3"/>
                  <text x="1187" y="565" textAnchor="middle" className="node-text">📊 ZABBIX [VMID:106]</text>
                  <text x="1187" y="585" textAnchor="middle" className="label-text">監視サーバー (クラスター全体)</text>

                  {/* Bottom Sections */}
                  <rect x="40" y="950" width="320" height="105" className="node-rect" rx="4"/>
                  <text x="200" y="980" textAnchor="middle" className="node-text">💾 ストレージ</text>
                  <text x="55" y="1000" className="label-text" style={{ fontSize: '12px' }}>• HP-1: HDD 1TB</text>
                  <text x="55" y="1017" className="label-text" style={{ fontSize: '12px' }}>• Dell: SSD + Toshiba HDD</text>
                  <text x="55" y="1034" className="label-text" style={{ fontSize: '12px' }}>• Proxmox スナップショット</text>

                  <rect x="380" y="950" width="320" height="105" className="node-rect" rx="4"/>
                  <text x="540" y="980" textAnchor="middle" className="node-text">☁️ バックアップ</text>
                  <text x="395" y="1000" className="label-text" style={{ fontSize: '12px' }}>• Google Drive</text>
                  <text x="395" y="1017" className="label-text" style={{ fontSize: '12px' }}>• USB コールドバックアップ</text>
                  <text x="395" y="1034" className="label-text" style={{ fontSize: '12px' }}>• Proxmox バックアップ (Dell)</text>

                  <rect x="720" y="950" width="320" height="105" className="node-rect" rx="4"/>
                  <text x="880" y="980" textAnchor="middle" className="node-text">🔐 セキュリティ</text>
                  <text x="735" y="1000" className="label-text" style={{ fontSize: '12px' }}>• Ed25519 SSH 鍵認証</text>
                  <text x="735" y="1017" className="label-text" style={{ fontSize: '12px' }}>• パスワード認証無効</text>
                  <text x="735" y="1034" className="label-text" style={{ fontSize: '12px' }}>• TOTP 2FA (Proxmox)</text>

                  <rect x="1060" y="950" width="340" height="105" className="node-rect" rx="4"/>
                  <text x="1230" y="980" textAnchor="middle" className="node-text">📊 監視・運用</text>
                  <text x="1075" y="1000" className="label-text" style={{ fontSize: '12px' }}>• ZABBIX サーバー (VMID:106)</text>
                  <text x="1075" y="1017" className="label-text" style={{ fontSize: '12px' }}>• pote-monitor エージェント</text>
                  <text x="1075" y="1034" className="label-text" style={{ fontSize: '12px' }}>• Proxmox Web UI</text>

                  {/* Legend */}
                  <rect x="40" y="1080" width="1360" height="390" className="node-rect" rx="4"/>
                  <text x="720" y="1115" textAnchor="middle" className="legend-title">📋 凡例とシステム構成</text>
                  <text x="60" y="1158" className="legend-text"><tspan className="legend-icon-text">🖧</tspan> waras-nw — Proxmox VE 9.x 3ノードクラスター (HP-1 / HP-2 / Dell)</text>
                  <text x="60" y="1198" className="legend-text"><tspan className="legend-icon-text">🔒</tspan> ゼロトラスト — Twingate を HP-2 (VMID:105) + Dell (VMID:102) で冗長化</text>
                  <text x="60" y="1238" className="legend-text"><tspan className="legend-icon-text">🎮</tspan> GPU — dev-01 に Quadro P600 PCIe パススルー + Sunshine/Moonlight ゲーミング</text>
                  <text x="60" y="1278" className="legend-text"><tspan className="legend-icon-text">📊</tspan> 監視 — ZABBIX サーバー (VM:106) + pote-monitor エージェント (LXC:104)</text>
                  <text x="60" y="1318" className="legend-text"><tspan className="legend-icon-text">🌐</tspan> サービス — obsidian/music-bot (HP-1) / portfolio (Dell) / Minecraft (HP-1)</text>
                  <text x="60" y="1368" className="legend-text"><tspan className="legend-icon-text">✅ Phase 1+2</tspan>  完了（単一ノード→3ノードクラスター / GPU / Zabbix）　<tspan className="legend-icon-text">🚧 Phase 3</tspan>  検討中</text>
                </svg>
              </div>

              {/* Architecture Notes */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.1)' }}>
                <h4 style={{ color: '#00ff88', marginBottom: '0.5rem', fontSize: '0.95rem' }}>アーキテクチャのポイント</h4>
                <ul style={{ fontSize: '0.9rem', color: '#ccc', listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ marginBottom: '0.4rem' }}>✓ waras-nw 3ノードクラスター — HP-1 / HP-2 / Dell の分散ワークロード構成</li>
                  <li style={{ marginBottom: '0.4rem' }}>✓ Twingate ゼロトラスト — HP-2 (VMID:105) + Dell (VMID:102) の2拠点冗長化</li>
                  <li style={{ marginBottom: '0.4rem' }}>✓ GPU パススルー — dev-01 に Quadro P600 でゲーミング・開発環境を実現</li>
                  <li style={{ marginBottom: '0.4rem' }}>✓ ZABBIX 監視 — サーバー(VM:106) + pote-monitor エージェント(LXC:104) でクラスター全体を監視</li>
                  <li>✓ マルチレイヤーセキュリティ：Ed25519 SSH鍵 + TOTP 2FA + Anubis ボット対策</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Design Philosophy */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('philosophy')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            {i18n.infrastructure?.designPhilosophy || '設計哲学'}
            <span>{expandedSections.philosophy ? '▼' : '▶'}</span>
          </button>
          {expandedSections.philosophy && (
            <div style={{ padding: '1rem', marginTop: '1rem' }}>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                {infra.infrastructure.design_philosophy.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Hypervisor */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('hypervisor')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            🖥️ {i18n.infrastructure?.hypervisor || 'Proxmox VE'}
            <span>{expandedSections.hypervisor ? '▼' : '▶'}</span>
          </button>
          {expandedSections.hypervisor && (
            <div style={{ padding: '1rem', marginTop: '1rem', backgroundColor: 'rgba(0,255,136,0.03)', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#00ff88', fontSize: '1.1rem' }}>
                {infra.infrastructure.hypervisor.platform}
              </h3>
              <p style={{ marginBottom: '1rem' }}>{infra.infrastructure.hypervisor.purpose}</p>
              <h4 style={{ marginBottom: '0.5rem', color: '#ccc' }}>主な機能:</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                {infra.infrastructure.hypervisor.key_features.map((feature, idx) => (
                  <li key={idx} style={{ fontSize: '0.95rem', marginBottom: '0.3rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Nodes */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('nodes')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            {i18n.infrastructure?.nodes || 'ノード構成'}
            <span>{expandedSections.nodes ? '▼' : '▶'}</span>
          </button>
          {expandedSections.nodes && (
            <div style={{ marginTop: '1rem' }}>
              {infra.infrastructure.nodes.map(node => (
                <div
                  key={node.id}
                  style={{
                    border: '1px solid #00ff88',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: 'rgba(0,255,136,0.03)',
                  }}
                >
                  <div
                    onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ marginBottom: '0.3rem', color: '#00ff88', fontSize: '1.05rem' }}>
                        {node.name} - {node.role}
                      </h4>
                      <p style={{ fontSize: '0.9rem', margin: '0', color: '#ccc' }}>
                        <strong>ハードウェア:</strong> {node.hardware}
                      </p>
                    </div>
                    <span style={{ fontSize: '1.3rem', color: '#00ff88' }}>
                      {expandedNode === node.id ? '▼' : '▶'}
                    </span>
                  </div>

                  {expandedNode === node.id && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,255,136,0.2)' }}>
                      <p style={{ marginBottom: '0.5rem' }}><strong>目的:</strong></p>
                      <p style={{ margin: '0 0 0.8rem 0', color: '#ccc' }}>{node.purpose}</p>

                      <p style={{ marginBottom: '0.5rem' }}><strong>ワークロード:</strong></p>
                      <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                        {node.workloads.map((wl, idx) => (
                          <li key={idx} style={{ marginBottom: '0.8rem', paddingLeft: '1rem', position: 'relative', color: '#ccc' }}>
                            <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>→</span>
                            <strong>{wl.name}</strong> ({wl.type}{wl.vmid ? ` VMID:${wl.vmid}` : ''})
                            {wl.os && ` - ${wl.os}`}
                            {wl.purpose && <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>{wl.purpose}</p>}
                            {wl.details && (
                              <ul style={{ listStyle: 'none', padding: '0.3rem 0 0 1rem', margin: '0', fontSize: '0.85rem' }}>
                                {wl.details.map((detail, didx) => (
                                  <li key={didx} style={{ color: '#888' }}>• {detail}</li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Network Design */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('network')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            {i18n.infrastructure?.networkDesign || 'ネットワーク設計'}
            <span>{expandedSections.network ? '▼' : '▶'}</span>
          </button>
          {expandedSections.network && (
            <div style={{ padding: '1rem', marginTop: '1rem', backgroundColor: 'rgba(0,255,136,0.03)', borderRadius: '4px' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>トポロジー:</strong> {infra.infrastructure.network_design.topology}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>DNS:</strong> {infra.infrastructure.network_design.dns}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>セキュリティ対策:</strong></p>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                {infra.infrastructure.network_design.security.map((sec, idx) => (
                  <li key={idx} style={{ fontSize: '0.9rem', marginBottom: '0.3rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>•</span>
                    {sec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Security Model */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('security')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            🔐 {i18n.infrastructure?.securityModel || 'セキュリティモデル'}
            <span>{expandedSections.security ? '▼' : '▶'}</span>
          </button>
          {expandedSections.security && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>SSH設定</h4>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                  <li style={{ marginBottom: '0.3rem' }}>Root ログイン: <strong>{infra.infrastructure.security_model.ssh.root_login}</strong></li>
                  <li style={{ marginBottom: '0.3rem' }}>パスワード認証: <strong>{infra.infrastructure.security_model.ssh.password_auth}</strong></li>
                  <li style={{ marginBottom: '0.3rem' }}>鍵タイプ: <strong>{infra.infrastructure.security_model.ssh.key_type}</strong></li>
                  <li>アクセス方法: <strong>{infra.infrastructure.security_model.ssh.access_method}</strong></li>
                </ul>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>認証</h4>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                  <li style={{ marginBottom: '0.3rem' }}>Proxmox: <strong>{infra.infrastructure.security_model.authentication.proxmox}</strong></li>
                  <li>Linux VM: <strong>{infra.infrastructure.security_model.authentication.linux_vms}</strong></li>
                </ul>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>バックアップ戦略</h4>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                  {infra.infrastructure.security_model.backup_strategy.map((strategy, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem' }}>• {strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Technology Stack */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('techStack')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            {i18n.infrastructure?.technologyStack || 'テクノロジースタック'}
            <span>{expandedSections.techStack ? '▼' : '▶'}</span>
          </button>
          {expandedSections.techStack && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {Object.entries(infra.infrastructure.technology_stack).map(([category, items]) => (
                <div key={category} style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#00ff88', textTransform: 'capitalize' }}>
                    {category === 'virtualization' && '仮想化'}
                    {category === 'networking' && 'ネットワーク'}
                    {category === 'storage' && 'ストレージ'}
                    {category === 'security' && 'セキュリティ'}
                    {category === 'applications' && 'アプリケーション'}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(Array.isArray(items) ? items : [items]).map((item, idx) => (
                      <span key={idx} style={{ display: 'inline-block', padding: '0.3rem 0.6rem', backgroundColor: '#00ff88', color: '#0a0e27', borderRadius: '3px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Future Roadmap */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('roadmap')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            🛣️ 今後のロードマップ
            <span>{expandedSections.roadmap ? '▼' : '▶'}</span>
          </button>
          {expandedSections.roadmap && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {Object.entries(infra.infrastructure.future_roadmap).map(([phase, data]: [string, any]) => (
                <div key={phase} style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>
                    {phase === 'phase_1_current' && 'フェーズ 1: 完了'}
                    {phase === 'phase_2_planned' && 'フェーズ 2: 完了'}
                    {phase === 'phase_3_future' && 'フェーズ 3: 検討中'}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#aaa' }}>{data.status}</p>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                    {data.components.map((comp: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '0.3rem', paddingLeft: '1rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>▸</span>
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Outcomes */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => toggleSection('learning')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
            }}
          >
            📚 学習成果
            <span>{expandedSections.learning ? '▼' : '▶'}</span>
          </button>
          {expandedSections.learning && (
            <div style={{ padding: '1rem', marginTop: '1rem' }}>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                {infra.infrastructure.learning_outcomes.map((outcome, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>→</span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
