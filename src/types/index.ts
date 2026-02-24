export interface I18n {
  nav: Record<string, string>;
  hero: Record<string, string>;
  about: Record<string, string>;
  skills: Record<string, string>;
  projects: Record<string, string>;
  philosophy: Record<string, string>;
  contact: Record<string, string>;
  footer: Record<string, string>;
}

export type Language = 'ja' | 'en';

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

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  updated: string;
  pinned: boolean;
}
