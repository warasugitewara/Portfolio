import { useEffect, useState } from 'react';
import type { Profile } from '../types';
import type { I18n } from '../types';
import { getDataUrl } from '../utils/path';

interface HeroProps {
  i18n: I18n | null;
}

export const Hero = ({ i18n }: HeroProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(getDataUrl('profile.json'));
        if (!response.ok) throw new Error(`Failed to load profile: ${response.status}`);
        const data = await response.json();
        setProfile(data);
        setAvatar(data.avatar);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setAvatar('https://avatars.githubusercontent.com/u/87893552?v=4');
      }
    };

    loadProfile();
  }, []);

  if (!i18n) return null;

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
      {/* Dark overlay for text readability */}
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
            <img src={avatar} alt="warasugi" loading="lazy" />
          </div>
        )}
        <div className="hero-content">
          <h1 className="hero-title">{i18n.hero.title}</h1>
          <p className="hero-subtitle">{i18n.hero.subtitle}</p>
          {profile && (
            <p className="hero-location">📍 {profile.location}</p>
          )}
        </div>
      </div>
    </section>
  );
};
