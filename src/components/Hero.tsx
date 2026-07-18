import type { Profile, I18n, Language } from "../types";
import { pickLang } from "../utils/pickLang";

interface HeroProps {
  i18n: I18n | null;
  profile: Profile | null;
  lang: Language;
}

export const Hero = ({ i18n, profile, lang }: HeroProps) => {
  if (!i18n) return null;

  const avatar = profile?.avatar ?? "";
  const stats = profile?.stats ?? [];

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
              {"📍"} {profile.location}
            </p>
          )}
          {stats.length > 0 && (
            <div className="hero-stats">
              {stats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`} className="hero-stat">
                  <span className="hero-stat__value">{stat.value}</span>
                  <span className="hero-stat__label">
                    {pickLang(lang, stat.label, stat.label_ja)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
