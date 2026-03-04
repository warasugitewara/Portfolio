import { useState, useEffect } from 'react';
import type { I18n } from '../types';

interface SnakeProps {
  i18n: I18n | null;
}

export const Snake = ({ i18n }: SnakeProps) => {
  const [hasSnake, setHasSnake] = useState(false);

  useEffect(() => {
    // Check if snake SVG exists (try both light and dark versions)
    const checkSnake = async () => {
      try {
        // Check if either SVG exists
        const darkUrl = '/github-contribution-grid-snake-dark.svg';
        const lightUrl = '/github-contribution-grid-snake.svg';
        
        const [darkRes, lightRes] = await Promise.all([
          fetch(darkUrl),
          fetch(lightUrl),
        ]);
        
        setHasSnake(darkRes.ok || lightRes.ok);
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

  const snakeDarkUrl = '/github-contribution-grid-snake-dark.svg';
  const snakeLightUrl = '/github-contribution-grid-snake.svg';

  return (
    <section className="section snake">
      <div className="section-container">
        <h2 className="section-title">Contributions</h2>
        <div className="snake-container">
          {hasSnake ? (
            <picture>
              <source
                media="(prefers-color-scheme: dark)"
                srcSet={snakeDarkUrl}
              />
              <source
                media="(prefers-color-scheme: light)"
                srcSet={snakeLightUrl}
              />
              <img
                alt="github contribution grid snake animation"
                src={snakeDarkUrl}
                loading="lazy"
              />
            </picture>
          ) : (
            <div className="snake-placeholder">
              <p>🐍 GitHub contribution animation generating...</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Trigger the workflow on GitHub Actions to generate the snake animation
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
