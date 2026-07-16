import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FeaturedProject, I18n, Language } from "../types";
import { getDataUrl } from "../utils/path";

interface FeaturedProjectsProps {
  i18n: I18n | null;
  lang: Language;
}

export const FeaturedProjects = ({ i18n, lang }: FeaturedProjectsProps) => {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await fetch(getDataUrl("featured.json"));
        if (!response.ok) throw new Error(`Failed to load featured: ${response.status}`);
        const data = await response.json();
        setProjects(data.featured ?? []);
      } catch (error) {
        console.error("Failed to load featured projects:", error);
      }
    };
    void loadFeatured();
  }, []);

  if (!i18n || projects.length === 0) return null;

  const ja = lang === "ja";
  const pick = (en: string, jaText?: string) => (ja && jaText ? jaText : en);

  return (
    <section id="featured" className="section featured">
      <div className="section-container">
        <h2 className="section-title">{i18n.projects.featured ?? i18n.projects.title}</h2>
        <div className="featured-grid">
          {projects.map((project) => {
            const linkLabel = pick(project.link_label ?? "GitHub →", project.link_label_ja);
            return (
              <article key={project.id} className="featured-card">
                <h3 className="featured-title">{pick(project.title, project.title_ja)}</h3>
                <p className="featured-tagline">{pick(project.tagline, project.tagline_ja)}</p>
                <p className="featured-background">
                  {pick(project.background, project.background_ja)}
                </p>
                <ul className="featured-points">
                  {(ja && project.points_ja ? project.points_ja : project.points).map(
                    (point, idx) => (
                      <li key={idx}>{point}</li>
                    ),
                  )}
                </ul>
                <div className="featured-footer">
                  <div className="featured-tech">
                    {project.tech.map((item) => (
                      <span key={item} className="featured-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  {project.link &&
                    (project.link_internal ? (
                      <Link to={project.link} className="featured-link">
                        {linkLabel}
                      </Link>
                    ) : (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="featured-link"
                      >
                        {linkLabel}
                      </a>
                    ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
