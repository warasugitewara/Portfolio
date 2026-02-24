import type { I18n, Profile } from '../types';
import { useEffect, useState } from 'react';
import { getDataUrl } from '../utils/path';

interface AboutProps {
  i18n: I18n | null;
}

export const About = ({ i18n }: AboutProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(getDataUrl('profile.json'));
        if (!response.ok) throw new Error(`Failed to load profile: ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, []);

  if (!i18n || !profile) return null;

  return (
    <section id="about" className="section about">
      <div className="section-container">
        <h2 className="section-title">{i18n.about.title}</h2>
        <div className="about-content">
          <p>{i18n.about.description}</p>
          <p style={{ marginTop: '1rem' }}>最近は自作鯖で遊びながら学んでいます。</p>
          <p style={{ marginTop: '1rem' }}>
            <strong>学歴:</strong> {profile.school}
          </p>
          {profile.credentials && profile.credentials.length > 0 && (
            <p style={{ marginTop: '1rem' }}>
              <strong>資格:</strong> {profile.credentials.join(', ')}
            </p>
          )}
          <p style={{ marginTop: '1rem' }}>
            <strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noopener noreferrer">@warasugitewara</a>
          </p>
        </div>
      </div>
    </section>
  );
};
