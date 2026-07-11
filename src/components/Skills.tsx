import { useEffect, useState } from "react";
import type { I18n, Skill } from "../types";
import { getDataUrl } from "../utils/path";

interface SkillsProps {
  i18n: I18n | null;
}

export const Skills = ({ i18n }: SkillsProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch(getDataUrl("skills.json"));
        if (!response.ok) throw new Error(`Failed to load skills: ${response.status}`);
        const data = await response.json();
        setSkills(data.skills);
      } catch (error) {
        console.error("Failed to load skills:", error);
      }
    };

    void loadSkills();
  }, []);

  if (!i18n) return null;

  return (
    <section id="skills" className="section skills">
      <div className="section-container">
        <h2 className="section-title">{i18n.skills.title}</h2>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.category} className="skill-category">
              <h3 className="skill-category-title">{skill.category}</h3>
              <div className="skill-items">
                {skill.items.map((item) => (
                  <span key={item} className="skill-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
