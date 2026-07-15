export interface I18n {
  nav: Record<string, string>;
  hero: Record<string, string>;
  about: Record<string, string>;
  skills: Record<string, string>;
  projects: Record<string, string>;
  philosophy: Record<string, string>;
  contact: Record<string, string>;
  footer: Record<string, string>;
  /** Infrastructure page labels. Optional since keys may be sparse across locales. */
  infrastructure?: Record<string, string>;
}

export type Language = "ja" | "en";

export interface ProfileStat {
  value: string;
  label: string;
  label_ja?: string;
}

export interface Profile {
  name: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string;
  github: string;
  email: string;
  school: string;
  credentials?: string[];
  stats?: ProfileStat[];
  socials: {
    github: string;
    twitter: string;
    discord: string;
  };
}

export interface Skill {
  category: string;
  items: string[];
}

export interface FeaturedProject {
  id: string;
  title: string;
  title_ja?: string;
  tagline: string;
  tagline_ja?: string;
  background: string;
  background_ja?: string;
  points: string[];
  points_ja?: string[];
  tech: string[];
  link?: string;
  link_internal?: boolean;
  link_label?: string;
  link_label_ja?: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  updated: string;
  pinned: boolean;
}

/* ── Infrastructure page ───────────────────────────────────────────── */

export interface InfraWorkload {
  type: string;
  name: string;
  vmid?: number;
  os?: string;
  purpose?: string;
  details?: string[];
}

export interface InfraNode {
  id: string;
  name: string;
  hardware: string;
  role: string;
  purpose: string;
  workloads: InfraWorkload[];
}

export interface InfraRoadmapPhase {
  status: string;
  components: string[];
}

export interface InfraTechnologyStack {
  virtualization: string[];
  networking: string[];
  storage: string[];
  security: string[];
  applications: string[];
}

export interface InfraOperations {
  monitoring: {
    tool: string;
    server: string;
    coverage: string;
    alerting: string;
  };
  access_management: {
    internal: string;
    remote_desktop: string;
    authentication: string;
  };
  reliability: {
    uptime_target: string;
    restart_policy: string;
    backup: string;
  };
}

export interface InfrastructureData {
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
    nodes: InfraNode[];
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
      philosophy?: string;
    };
    technology_stack: InfraTechnologyStack;
    learning_outcomes: string[];
    operational_practices?: {
      monitoring: string;
      backups: string;
      updates: string;
      documentation: string;
    };
    operations: InfraOperations;
    future_roadmap: {
      phase_1_current: InfraRoadmapPhase;
      phase_2_planned: InfraRoadmapPhase;
      phase_3_future: InfraRoadmapPhase;
      phase_4_longterm: InfraRoadmapPhase;
    };
  };
}
