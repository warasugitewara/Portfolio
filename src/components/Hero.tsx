import type { Profile, I18n } from '../types';

interface HeroProps {
  i18n: I18n | null;
  profile: Profile | null;
}

export const Hero = ({ i18n, profile }: HeroProps) => {
  if (!i18n) return null;

  const avatar = profile?.avatar ?? '';

  return (
    <section
      className="hero"
      style={{
        backgroundImage: 'url(/minecraft-city.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10, 14, 39, 0.75)',
          zIndex: 1,
        }}
      />
      <div className="hero-container" style={{ position: 'relative', zIndex: 2 }}>
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
            <p className="hero-location">�� {profile.location}</p>
          )}
        </div>
      </div>
    </section>
  );
};
