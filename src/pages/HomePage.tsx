import { useState, useEffect } from 'react';
import { BootAnimation } from '../components/BootAnimation';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Snake } from '../components/Snake';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Contact } from '../components/Contact';
import type { Profile } from '../types';
import { getDataUrl } from '../utils/path';

interface HomePageProps {
  i18n: any;
}

export const HomePage = ({ i18n }: HomePageProps) => {
  const [showBoot, setShowBoot] = useState(() => {
    if (typeof window !== 'undefined') {
      const shown = localStorage.getItem('bootAnimationShown');
      return !shown;
    }
    return true;
  });

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (showBoot === false) {
      localStorage.setItem('bootAnimationShown', 'true');
    }
  }, [showBoot]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(getDataUrl('profile.json'));
        if (!response.ok) throw new Error(`Failed to load profile: ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, []);

  if (!i18n) return null;

  return (
    <>
      {showBoot && <BootAnimation onComplete={() => setShowBoot(false)} />}
      <Hero i18n={i18n} profile={profile} />
      <About i18n={i18n} profile={profile} />
      <Snake i18n={i18n} />
      <Skills i18n={i18n} />
      <Projects i18n={i18n} />
      <Contact i18n={i18n} profile={profile} />
    </>
  );
};
