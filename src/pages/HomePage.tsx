import { useEffect, useState } from 'react';
import { BootAnimation } from '../components/BootAnimation';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Snake } from '../components/Snake';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Contact } from '../components/Contact';

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

  useEffect(() => {
    if (showBoot === false) {
      localStorage.setItem('bootAnimationShown', 'true');
    }
  }, [showBoot]);

  if (!i18n) return null;

  return (
    <>
      {showBoot && <BootAnimation onComplete={() => setShowBoot(false)} />}
      <Hero i18n={i18n} />
      <About i18n={i18n} />
      <Snake i18n={i18n} />
      <Skills i18n={i18n} />
      <Projects i18n={i18n} />
      <Contact i18n={i18n} />
    </>
  );
};
