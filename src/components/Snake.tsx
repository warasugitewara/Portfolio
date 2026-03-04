import { useState, useEffect } from 'react';
import type { I18n } from '../types';

interface SnakeProps {
  i18n: I18n | null;
}

export const Snake = ({ i18n }: SnakeProps) => {
  const [hasSnake, setHasSnake] = useState(false);

  useEffect(() => {
    // Check if snake SVG is accessible from GitHub
    const checkSnake = async () => {
      try {
        const darkUrl = 'https://raw.githubusercontent.com/warasugitewara/warasugitewara/main/dist/github-contribution-grid-snake-dark.svg';
        const response = await fetch(darkUrl);
        setHasSnake(response.ok);
      } catch {
        setHasSnake(false);
      }
    };

    checkSnake();

    // Listen for theme changes to re-check
    const observer = new MutationObserver(() => {
      checkSnake();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  if (!i18n) return null;

  const snakeDarkUrl = 'https://raw.githubusercontent.com/warasugitewara/warasugitewara/main/dist/github-contribution-grid-snake-dark.svg';

  return (
    <section className="section snake">
      <div className="section-container">
        <h2 className="section-title">Contributions</h2>
        <div className="snake-container">
          {hasSnake ? (
            <img
              alt="github contribution grid snake animation"
              src={snakeDarkUrl}
              loading="lazy"
            />
          ) : (
            <div className="snake-placeholder">
              <p>🐍 GitHub contribution animation generating...</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Fetching snake animation from GitHub...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
