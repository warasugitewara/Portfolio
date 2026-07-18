import { useState } from "react";
import type { I18n } from "../types";

interface SnakeProps {
  i18n: I18n | null;
}

const SNAKE_DARK_URL =
  "https://raw.githubusercontent.com/warasugitewara/warasugitewara/main/dist/github-contribution-grid-snake-dark.svg";

export const Snake = ({ i18n }: SnakeProps) => {
  const [hasSnake, setHasSnake] = useState(true);

  if (!i18n || !hasSnake) return null;

  return (
    <section className="section snake">
      <div className="section-container">
        <h2 className="section-title">Contributions</h2>
        <div className="snake-container">
          <img
            alt="github contribution grid snake animation"
            src={SNAKE_DARK_URL}
            loading="lazy"
            onError={() => setHasSnake(false)}
          />
        </div>
      </div>
    </section>
  );
};
