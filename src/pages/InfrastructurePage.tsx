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
                <svg viewBox="0 0 1200 800" style={{ width: '100%', height: 'auto', minHeight: '600px' }}>
                  <defs>
                    <style>{`
                      .node-rect { fill: rgba(0,255,136,0.1); stroke: #00ff88; stroke-width: 2; }
                      .node-text { fill: #00ff88; font-family: monospace; font-size: 14px; font-weight: bold; }
                      .label-text { fill: #ccc; font-family: monospace; font-size: 12px; }
                      .container-rect { fill: rgba(100,200,255,0.08); stroke: rgba(100,200,255,0.5); stroke-width: 1; }
                      .connector-line { stroke: #00ff88; stroke-width: 2; fill: none; }
                      .arrow { fill: #00ff88; }
                      .section-label { fill: #999; font-family: monospace; font-size: 12px; font-style: italic; }
                      .title-text { fill: #00ff88; font-family: monospace; font-size: 18px; font-weight: bold; }
                    `}</style>
                  </defs>
                  
                  {/* Title */}
                  <text x="600" y="30" textAnchor="middle" className="title-text">ホームラボ インフラストラクチャ — Proxmox VE 9.x</text>

                  {/* Internet Section */}
                  <text x="50" y="80" className="section-label">インターネット</text>
                  <rect x="40" y="90" width="180" height="60" className="node-rect" rx="4"/>
                  <text x="130" y="130" textAnchor="middle" className="node-text">Internet</text>

                  {/* Twingate Section */}
                  <text x="300" y="80" className="section-label">ゼロトラスト層</text>
                  <rect x="280" y="90" width="220" height="60" className="node-rect" rx="4"/>
                  <text x="390" y="120" textAnchor="middle" className="node-text">🔒 Twingate Network</text>
                  <text x="390" y="140" textAnchor="middle" className="label-text">セキュアトンネル</text>

                  {/* Local Network */}
                  <text x="650" y="80" className="section-label">ローカルネットワーク</text>
                  <rect x="620" y="90" width="540" height="60" className="node-rect" rx="4"/>
                  <text x="900" y="130" textAnchor="middle" className="node-text">🏠 Home LAN (192.168.x.x)</text>

                  {/* Arrows from Internet */}
                  <path d="M 220 120 L 280 120" className="connector-line" markerEnd="url(#arrowhead)"/>
                  <polygon points="280,120 270,115 275,120 270,125" className="arrow"/>
                  <path d="M 500 120 L 620 120" className="connector-line" markerEnd="url(#arrowhead)"/>
                  <polygon points="620,120 610,115 615,120 610,125" className="arrow"/>

                  {/* Dell-1 Node */}
                  <text x="50" y="230" className="section-label">Dell-1 メインコンピュートノード</text>
                  <text x="50" y="245" className="label-text">Intel Core i3-6100 + 16GB RAM + SSD 128GB + HDD 512GB</text>
                  <rect x="40" y="260" width="1130" height="480" className="node-rect" rx="4"/>
                  <text x="605" y="285" textAnchor="middle" className="node-text">🖥️ Dell-1 (Proxmox VE 9.x)</text>

                  {/* VM Section */}
                  <text x="60" y="320" className="section-label">仮想マシン (VM)</text>
                  <rect x="55" y="330" width="220" height="100" className="container-rect" rx="3"/>
                  <text x="165" y="355" textAnchor="middle" className="node-text">dev-01</text>
                  <text x="165" y="370" textAnchor="middle" className="label-text">Debian 13</text>
                  <text x="60" y="385" className="label-text" style={{ fontSize: '11px' }}>• SSH開発環境</text>
                  <text x="60" y="398" className="label-text" style={{ fontSize: '11px' }}>• Neovim + CLI</text>
                  <text x="60" y="411" className="label-text" style={{ fontSize: '11px' }}>• GitHub連携</text>

                  {/* LXC Containers Section */}
                  <text x="330" y="320" className="section-label">LXC コンテナ</text>

                  {/* Music Bot */}
                  <rect x="305" y="330" width="160" height="100" className="container-rect" rx="3"/>
                  <text x="385" y="360" textAnchor="middle" className="node-text">🎵 Music Bot</text>
                  <text x="385" y="375" textAnchor="middle" className="label-text">Discord音楽ボット</text>

                  {/* Twingate Connector */}
                  <rect x="500" y="330" width="160" height="100" className="container-rect" rx="3"/>
                  <text x="580" y="360" textAnchor="middle" className="node-text">🔐 Twingate</text>
                  <text x="580" y="375" textAnchor="middle" className="label-text">トンネル</text>
                  <text x="580" y="388" textAnchor="middle" className="label-text">エンドポイント</text>

                  {/* Obsidian */}
                  <rect x="695" y="330" width="160" height="100" className="container-rect" rx="3"/>
                  <text x="775" y="360" textAnchor="middle" className="node-text">📓 Obsidian</text>
                  <text x="775" y="375" textAnchor="middle" className="label-text">livesync DB</text>

                  {/* Portfolio */}
                  <rect x="890" y="330" width="160" height="100" className="container-rect" rx="3"/>
                  <text x="970" y="360" textAnchor="middle" className="node-text">🌐 Portfolio</text>
                  <text x="970" y="375" textAnchor="middle" className="label-text">Bun + Hono</text>
                  <text x="970" y="388" textAnchor="middle" className="label-text" style={{ fontSize: '10px' }}>wc.f5.si</text>

                  {/* Storage Section */}
                  <text x="60" y="490" className="section-label">ストレージ &amp; バックアップ</text>
                  <rect x="55" y="500" width="220" height="100" className="container-rect" rx="3"/>
                  <text x="165" y="530" textAnchor="middle" className="node-text">💾 ストレージ</text>
                  <text x="60" y="550" className="label-text" style={{ fontSize: '11px' }}>• SSD: 128GB</text>
                  <text x="60" y="563" className="label-text" style={{ fontSize: '11px' }}>• HDD: 512GB</text>
                  <text x="60" y="576" className="label-text" style={{ fontSize: '11px' }}>• スナップショット</text>

                  {/* Backup Section */}
                  <rect x="305" y="500" width="220" height="100" className="container-rect" rx="3"/>
                  <text x="415" y="530" textAnchor="middle" className="node-text">☁️ バックアップ</text>
                  <text x="310" y="550" className="label-text" style={{ fontSize: '11px' }}>• Google Drive</text>
                  <text x="310" y="563" className="label-text" style={{ fontSize: '11px' }}>• USBコールド</text>
                  <text x="310" y="576" className="label-text" style={{ fontSize: '11px' }}>• Proxmoxバックアップ</text>

                  {/* Security Section */}
                  <rect x="555" y="500" width="240" height="100" className="container-rect" rx="3"/>
                  <text x="675" y="530" textAnchor="middle" className="node-text">🔐 セキュリティ</text>
                  <text x="560" y="550" className="label-text" style={{ fontSize: '11px' }}>• Ed25519 SSH鍵</text>
                  <text x="560" y="563" className="label-text" style={{ fontSize: '11px' }}>• パスワード認証無効</text>
                  <text x="560" y="576" className="label-text" style={{ fontSize: '11px' }}>• TOTP 2FA (Proxmox)</text>

                  {/* Legend */}
                  <text x="60" y="670" className="section-label">凡例</text>
                  <rect x="55" y="680" width="1030" height="100" className="node-rect" rx="3"/>
                  <text x="70" y="705" className="label-text">🖧 = Proxmox VE 9.x | 🖥️ = コンピュートノード | 📊 = 管理インターフェース</text>
                  <text x="70" y="725" className="label-text">🔒 = ゼロトラストセキュリティ | 🌐 = Webサービス | 💾 = ストレージ</text>
                  <text x="70" y="745" className="label-text">🎵 = 音声/メディアボット | 📓 = データベース | ☁️ = クラウドバックアップ | 🔐 = セキュリティ機能</text>
                  <text x="70" y="765" className="label-text">フェーズ: Phase 1 ✅ 運用中 | Phase 2 🚧 進行予定 (Z240追加・クラスタ構築) | Phase 3 📋 検討中 (VLAN・監視)</text>
                </svg>
              </div>

              {/* Architecture Notes */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.1)' }}>
                <h4 style={{ color: '#00ff88', marginBottom: '0.5rem', fontSize: '0.9rem' }}>アーキテクチャポイント</h4>
                <ul style={{ fontSize: '0.85rem', color: '#ccc', listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ marginBottom: '0.3rem' }}>✓ シンプル単一ノード構成で保守性を確保</li>
                  <li style={{ marginBottom: '0.3rem' }}>✓ Twingate経由で完全なゼロトラストアクセス</li>
                  <li style={{ marginBottom: '0.3rem' }}>✓ 複数サービスをLXCコンテナで効率的に運用</li>
                  <li>✓ Phase 2で3ノードクラスタへ拡張予定</li>
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
                            <strong>{wl.name}</strong> ({wl.type})
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
                    {phase === 'phase_1_current' && 'フェーズ 1: 現在'}
                    {phase === 'phase_2_planned' && 'フェーズ 2: 進行中'}
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
