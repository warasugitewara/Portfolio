import type { I18n } from '../types';
import { useEffect, useState } from 'react';
import { getDataUrl } from '../utils/path';

interface InfrastructureProps {
  i18n: I18n | null;
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

export const Infrastructure = ({ i18n }: InfrastructureProps) => {
  const [infra, setInfra] = useState<InfrastructureData | null>(null);
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

  if (!i18n || !infra) return null;

  return (
    <section id="infrastructure" className="section infrastructure">
      <div className="section-container">
        <h2 className="section-title">🖧 {infra.infrastructure.title}</h2>
        <p className="section-subtitle">{infra.infrastructure.subtitle}</p>

        {/* Overview */}
        <div className="infrastructure-overview" style={{ marginBottom: '2rem' }}>
          <p style={{ lineHeight: '1.8' }}>{infra.infrastructure.overview}</p>
        </div>

        {/* Design Philosophy */}
        <div className="design-philosophy" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Design Philosophy</h3>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {infra.infrastructure.design_philosophy.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Hypervisor Info */}
        <div className="hypervisor-info" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #00ff88', borderRadius: '4px', backgroundColor: 'rgba(0,255,136,0.05)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#00ff88', fontSize: '1.1rem' }}>
            🖥️ {infra.infrastructure.hypervisor.platform}
          </h3>
          <p style={{ marginBottom: '0.5rem' }}>{infra.infrastructure.hypervisor.purpose}</p>
          <ul style={{ listStyle: 'none', padding: '0', marginTop: '0.5rem' }}>
            {infra.infrastructure.hypervisor.key_features.map((feature, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', marginBottom: '0.3rem', color: '#ccc' }}>
                • {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Nodes */}
        <div className="nodes-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Infrastructure Nodes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
            {infra.infrastructure.nodes.map(node => (
              <div
                key={node.id}
                style={{
                  border: '1px solid #00ff88',
                  borderRadius: '4px',
                  padding: '1rem',
                  backgroundColor: 'rgba(0,255,136,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.3rem', color: '#00ff88' }}>{node.name}</h4>
                    <p style={{ fontSize: '0.9rem', margin: '0' }}><strong>Role:</strong> {node.role}</p>
                    <p style={{ fontSize: '0.9rem', margin: '0' }}><strong>Hardware:</strong> {node.hardware}</p>
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>{expandedNode === node.id ? '▼' : '▶'}</span>
                </div>

                {expandedNode === node.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,255,136,0.2)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Purpose:</strong></p>
                    <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{node.purpose}</p>

                    {node.rationale && (
                      <>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}><strong>Rationale:</strong></p>
                        <p style={{ fontSize: '0.85rem', margin: '0' }}>{node.rationale}</p>
                      </>
                    )}

                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}><strong>Workloads:</strong></p>
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {node.workloads.map((wl, idx) => (
                        <li key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          <strong>{wl.name}</strong> ({wl.type})
                          {wl.os && ` - ${wl.os}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Model */}
        <div className="security-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>🔐 Security Model</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>SSH Configuration</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                <li>Root login: {infra.infrastructure.security_model.ssh.root_login}</li>
                <li>Password auth: {infra.infrastructure.security_model.ssh.password_auth}</li>
                <li>Key type: {infra.infrastructure.security_model.ssh.key_type}</li>
                <li>Access: {infra.infrastructure.security_model.ssh.access_method}</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>Authentication</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                <li>Proxmox: {infra.infrastructure.security_model.authentication.proxmox}</li>
                <li>Linux VMs: {infra.infrastructure.security_model.authentication.linux_vms}</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>Backup Strategy</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.9rem' }}>
                {infra.infrastructure.security_model.backup_strategy.map((strategy, idx) => (
                  <li key={idx}>• {strategy}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="tech-stack-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Technology Stack</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {Object.entries(infra.infrastructure.technology_stack).map(([category, items]) => (
              <div key={category} style={{ padding: '1rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#00ff88', textTransform: 'capitalize' }}>
                  {category.replace(/_/g, ' ')}
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
        </div>

        {/* Learning Outcomes */}
        <div className="learning-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>📚 Learning Outcomes</h3>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {infra.infrastructure.learning_outcomes.map((outcome, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', color: '#00ff88' }}>→</span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        {/* Diagram Placeholder */}
        <div className="diagram-section" style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'rgba(0,255,136,0.05)', borderRadius: '4px', textAlign: 'center' }}>
          <p style={{ color: '#888' }}>📊 Architecture diagram available in repository</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Mermaid diagram: <code>/public/diagrams/infra-architecture.mmd</code></p>
        </div>
      </div>
    </section>
  );
};
