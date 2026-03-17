import type { I18n, Profile } from '../types';

interface AboutProps {
  i18n: I18n | null;
  profile: Profile | null;
}

export const About = ({ i18n, profile }: AboutProps) => {
  if (!i18n || !profile) return null;

  return (
    <section id="about" className="section about">
      <div className="section-container">
        <h2 className="section-title">{i18n.about.title}</h2>
        <div className="about-content">
          <p>{i18n.about.description}</p>
          <p style={{ marginTop: '1rem' }}>{i18n.about.hobby}</p>
          <div style={{ marginTop: '1rem' }}>
            <strong>{i18n.about.school}:</strong> {profile.school}
          </div>
          {profile.credentials && profile.credentials.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <strong>{i18n.about.credentials}:</strong>
              <ul className="credentials-list">
                {profile.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <p style={{ marginTop: '1rem' }}>
            <strong>GitHub:</strong>{' '}
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              @warasugitewara
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
