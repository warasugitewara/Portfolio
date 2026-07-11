import type { Profile, I18n } from "../types";

interface HeroProps {
  i18n: I18n | null;
  profile: Profile | null;
}

export const Hero = ({ i18n, profile }: HeroProps) => {
  if (!i18n) return null;

  const avatar = profile?.avatar ?? "";

  return (
    <section className="hero">
      <div className="hero-container">
        {avatar && (
          <div className="hero-avatar">
            <a href="https://github.com/warasugitewara" target="_blank" rel="noopener noreferrer">
              <img src={avatar} alt="warasugi" loading="eager" />
            </a>
          </div>
        )}
        <div className="hero-content">
          <h1 className="hero-title">{i18n.hero.title}</h1>
          <p className="hero-subtitle">{i18n.hero.subtitle}</p>
          {profile && (
            <p className="hero-location">
              {"\uD83D\uDCCD"} {profile.location}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
