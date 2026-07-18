import { useState, useEffect } from "react";
import { BootAnimation } from "../components/BootAnimation";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Snake } from "../components/Snake";
import { Skills } from "../components/Skills";
import { Philosophy } from "../components/Philosophy";
import { FeaturedProjects } from "../components/FeaturedProjects";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import type { I18n, Language, Profile } from "../types";
import { getDataUrl } from "../utils/path";

interface HomePageProps {
  i18n: I18n;
  lang: Language;
}

export const HomePage = ({ i18n, lang }: HomePageProps) => {
  const [showBoot, setShowBoot] = useState(() => {
    if (typeof window !== "undefined") {
      const shown = localStorage.getItem("bootAnimationShown");
      return !shown;
    }
    return true;
  });

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (showBoot === false) {
      localStorage.setItem("bootAnimationShown", "true");
    }
  }, [showBoot]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(getDataUrl("profile.json"));
        if (!response.ok) throw new Error(`Failed to load profile: ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    void loadProfile();
  }, []);

  if (!i18n) return null;

  const metaDescription = `${i18n.hero.subtitle} — ${i18n.about.description}`;

  return (
    <>
      <title>{`${i18n.hero.title} - Portfolio`}</title>
      <meta name="description" content={metaDescription} />
      {showBoot && <BootAnimation onComplete={() => setShowBoot(false)} />}
      <Hero i18n={i18n} profile={profile} lang={lang} />
      <About i18n={i18n} profile={profile} />
      <Snake i18n={i18n} />
      <Skills i18n={i18n} />
      <Philosophy i18n={i18n} lang={lang} />
      <FeaturedProjects i18n={i18n} lang={lang} />
      <Projects i18n={i18n} lang={lang} />
      <Contact i18n={i18n} profile={profile} />
    </>
  );
};
