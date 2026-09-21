import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Snake } from "../components/Snake";
import { Setup } from "../components/Setup";
import { Skills } from "../components/Skills";
import { Philosophy } from "../components/Philosophy";
import { FeaturedProjects } from "../components/FeaturedProjects";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import type { InfrastructureData, I18n, Language, Profile } from "../types";
import { getDataUrl } from "../utils/path";

interface HomePageProps {
  i18n: I18n;
  lang: Language;
}

export const HomePage = ({ i18n, lang }: HomePageProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [infra, setInfra] = useState<InfrastructureData | null>(null);

  useEffect(() => {
    const load = async (file: string, apply: (data: unknown) => void) => {
      try {
        const response = await fetch(getDataUrl(file));
        if (!response.ok) throw new Error(`Failed to load ${file}: ${response.status}`);
        apply(await response.json());
      } catch (error) {
        console.error(`Failed to load ${file}:`, error);
      }
    };
    void load("profile.json", (data) => setProfile(data as Profile));
    void load("infrastructure.json", (data) => setInfra(data as InfrastructureData));
  }, []);

  if (!i18n) return null;

  const metaDescription = `${i18n.hero.subtitle} — ${i18n.about.description}`;

  return (
    <>
      <title>{`${i18n.hero.title} - Portfolio`}</title>
      <meta name="description" content={metaDescription} />
      <Hero i18n={i18n} profile={profile} infra={infra} lang={lang} />
      <About i18n={i18n} profile={profile} />
      <Snake i18n={i18n} />
      <Setup i18n={i18n} lang={lang} />
      <Skills i18n={i18n} />
      <Philosophy i18n={i18n} lang={lang} />
      <FeaturedProjects i18n={i18n} lang={lang} />
      <Projects i18n={i18n} lang={lang} />
      <Contact i18n={i18n} profile={profile} />
    </>
  );
};
