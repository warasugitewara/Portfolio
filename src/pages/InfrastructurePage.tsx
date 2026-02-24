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
        description?: string;
        os?: string;
        purpose?: string;
        planned_services?: string[];
        details?: string;
      }>;
      rationale?: string;
    }>;
    network_design: {
      topology: string;
      gateway: string;
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
      planned_apps: string[];
    };
    learning_outcomes: string[];
  };
}

export const InfrastructurePage = ({ i18n }: InfrastructurePageProps) => {
  const [infra, setInfra] = useState<InfrastructureData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    philosophy: true,
    hypervisor: true,
    nodes: true,
    network: false,
    security: false,
    techStack: false,
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

        {/* Design Philosophy - Collapsible */}
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
            {i18n.infrastructure.designPhilosophy}
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

        {/* Hypervisor - Collapsible */}
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
            🖥️ {i18n.infrastructure.hypervisor}
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

        {/* Nodes - Collapsible */}
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
            {i18n.infrastructure.nodes}
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

                      {node.rationale && (
                        <>
                          <p style={{ marginBottom: '0.5rem' }}><strong>設計理由:</strong></p>
                          <p style={{ margin: '0 0 0.8rem 0', color: '#ccc' }}>{node.rationale}</p>
                        </>
                      )}

                      <p style={{ marginBottom: '0.5rem' }}><strong>ワークロード:</strong></p>
                      <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                        {node.workloads.map((wl, idx) => (
                          <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', position: 'relative', color: '#ccc' }}>
                            <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>→</span>
                            <strong>{wl.name}</strong> ({wl.type})
                            {wl.os && ` - ${wl.os}`}
                            {wl.purpose && <span style={{ display: 'block', fontSize: '0.85rem', marginTop: '0.2rem' }}>{wl.purpose}</span>}
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

        {/* Network Design - Collapsible */}
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
            {i18n.infrastructure.networkDesign}
            <span>{expandedSections.network ? '▼' : '▶'}</span>
          </button>
          {expandedSections.network && (
            <div style={{ padding: '1rem', marginTop: '1rem', backgroundColor: 'rgba(0,255,136,0.03)', borderRadius: '4px' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>トポロジー:</strong> {infra.infrastructure.network_design.topology}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>ゲートウェイ:</strong> {infra.infrastructure.network_design.gateway}</p>
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

        {/* Security Model - Collapsible */}
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
            🔐 {i18n.infrastructure.securityModel}
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

        {/* Technology Stack - Collapsible */}
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
            {i18n.infrastructure.technologyStack}
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
                    {category === 'planned_apps' && '計画中アプリ'}
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

        {/* Learning Outcomes - Collapsible */}
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
            📚 {i18n.infrastructure.learningOutcomes}
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
