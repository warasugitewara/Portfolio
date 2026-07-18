import { useEffect, useState } from "react";
import type { I18n, Language } from "../types";
import { getDataUrl } from "../utils/path";
import { pickLang } from "../utils/pickLang";

interface Principle {
  title: string;
  title_ja?: string;
  description: string;
  description_ja?: string;
}

interface PhilosophyProps {
  i18n: I18n | null;
  lang: Language;
}

export const Philosophy = ({ i18n, lang }: PhilosophyProps) => {
  const [principles, setPrinciples] = useState<Principle[]>([]);

  useEffect(() => {
    const loadPhilosophy = async () => {
      try {
        const response = await fetch(getDataUrl("philosophy.json"));
        if (!response.ok) throw new Error(`Failed to load philosophy: ${response.status}`);
        const data = await response.json();
        setPrinciples(data.philosophy.principles);
      } catch (error) {
        console.error("Failed to load philosophy:", error);
      }
    };
    void loadPhilosophy();
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
                {pickLang(lang, principle.title, principle.title_ja)}
              </h3>
              <p className="principle-description">
                {pickLang(lang, principle.description, principle.description_ja)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
