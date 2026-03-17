import { useEffect, useState } from 'react';
import type { I18n, GitHubRepo } from '../types';

interface ProjectsProps {
  i18n: I18n | null;
  lang: string;
}

interface GitHubRepoRaw {
  fork: boolean;
  description: string | null;
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

export const Projects = ({ i18n, lang }: ProjectsProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.github.com/users/warasugitewara/repos?sort=updated&per_page=12&type=owner'
        );
        const data: GitHubRepoRaw[] = await response.json();
        const locale = lang === 'ja' ? 'ja-JP' : 'en-US';

        const repos: GitHubRepo[] = data
          .filter((repo) => !repo.fork && repo.description)
          .slice(0, 10)
          .map((repo) => ({
            name: repo.name,
            description: repo.description || '',
            url: repo.html_url,
            language: repo.language || '',
            stars: repo.stargazers_count,
            updated: new Date(repo.updated_at).toLocaleDateString(locale),
            pinned: false,
          }));

        setRepos(repos);
      } catch (error) {
        console.error('Failed to fetch GitHub repos:', error);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [lang]);

  if (!i18n) return null;

  return (
    <section id="projects" className="section projects">
      <div className="section-container">
        <h2 className="section-title">{i18n.projects.title}</h2>
        {loading ? (
          <div className="projects-loading">Loading repositories...</div>
        ) : repos.length === 0 ? (
          <div className="projects-empty">
            <p>Unable to load repositories from GitHub</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
              <a href="https://github.com/warasugitewara" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                View on GitHub &#8594;
              </a>
            </p>
          </div>
        ) : (
          <div className="projects-list">
            {repos.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-item"
              >
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </div>
                <div className="project-meta">
                  {project.language && (
                    <span className="project-language">{project.language}</span>
                  )}
                  {project.stars > 0 && (
                    <span className="project-stars">&#11088; {project.stars}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
