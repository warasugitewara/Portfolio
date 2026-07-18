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
  infrastructure?: I18nInfrastructure;
}

/**
 * Infrastructure page UI labels.
 * The index signature keeps dynamic lookups (stack / roadmap / diagram keys)
 * type-safe; the documented keys below are the stable, always-present ones.
 */
export interface I18nInfrastructure {
  [key: string]: string | undefined;
  title?: string;
  designPhilosophy?: string;
  hypervisor?: string;
  nodes?: string;
  networkDesign?: string;
  securityModel?: string;
  technologyStack?: string;
  learningOutcomes?: string;
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
  purpose_en?: string;
  details?: string[];
  details_en?: string[];
}

export interface InfraNode {
  id: string;
  name: string;
  name_en?: string;
  hardware: string;
  role: string;
  role_en?: string;
  purpose: string;
  purpose_en?: string;
  workloads: InfraWorkload[];
}

export interface InfraRoadmapPhase {
  status: string;
  status_en?: string;
  components: string[];
  components_en?: string[];
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
    server_en?: string;
    coverage: string;
    coverage_en?: string;
    alerting: string;
    alerting_en?: string;
  };
  access_management: {
    internal: string;
    internal_en?: string;
    remote_desktop: string;
    remote_desktop_en?: string;
    authentication: string;
    authentication_en?: string;
  };
  reliability: {
    uptime_target: string;
    uptime_target_en?: string;
    restart_policy: string;
    restart_policy_en?: string;
    backup: string;
    backup_en?: string;
  };
}

export interface InfrastructureData {
  infrastructure: {
    title: string;
    title_en?: string;
    subtitle: string;
    subtitle_en?: string;
    overview: string;
    overview_en?: string;
    design_philosophy: string[];
    design_philosophy_en?: string[];
    hypervisor: {
      platform: string;
      purpose: string;
      purpose_en?: string;
      key_features: string[];
      key_features_en?: string[];
    };
    nodes: InfraNode[];
    network_design: {
      topology: string;
      topology_en?: string;
      security: string[];
      security_en?: string[];
      dns: string;
      dns_en?: string;
    };
    security_model: {
      ssh: {
        root_login: string;
        password_auth: string;
        key_type: string;
        access_method: string;
      };
      backup_strategy: string[];
      backup_strategy_en?: string[];
      authentication: {
        proxmox: string;
        linux_vms: string;
      };
      philosophy?: string;
      philosophy_en?: string;
    };
    technology_stack: InfraTechnologyStack;
    learning_outcomes: string[];
    learning_outcomes_en?: string[];
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
