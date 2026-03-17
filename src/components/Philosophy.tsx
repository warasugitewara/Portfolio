import { useEffect, useState } from 'react';
import type { I18n } from '../types';
import { getDataUrl } from '../utils/path';

interface Principle {
  title: string;
  title_ja?: string;
  description: string;
  description_ja?: string;
}

interface PhilosophyProps {
  i18n: I18n | null;
  lang: string;
}

export const Philosophy = ({ i18n, lang }: PhilosophyProps) => {
  const [principles, setPrinciples] = useState<Principle[]>([]);

  useEffect(() => {
    const loadPhilosophy = async () => {
      try {
        const response = await fetch(getDataUrl('philosophy.json'));
        if (!response.ok) throw new Error(`Failed to load philosophy: ${response.status}`);
        const data = await response.json();
        setPrinciples(data.philosophy.principles);
      } catch (error) {
        console.error('Failed to load philosophy:', error);
      }
    };
    loadPhilosophy();
  }, []);

  if (!i18n) return null;

  return (
    <section id="philosophy" className="section philosophy">
      <div className="section-container">
        <h2 className="section-title">{i18n.philosophy.title}</h2>
        <div className="principles-grid">
          {principles.map((principle) => (
            <div key={principle.title} className="principle-card">
              <h3 className="principle-title">
                {lang === 'ja' && principle.title_ja ? principle.title_ja : principle.title}
              </h3>
              <p className="principle-description">
                {lang === 'ja' && principle.description_ja ? principle.description_ja : principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
