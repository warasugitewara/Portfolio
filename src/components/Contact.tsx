import type { I18n, Profile } from '../types';

interface ContactProps {
  i18n: I18n | null;
  profile: Profile | null;
}

export const Contact = ({ i18n, profile }: ContactProps) => {
  if (!i18n) return null;

  const githubLink = profile?.socials.github ?? 'https://github.com/warasugitewara';
  const twitterLink = profile?.socials.twitter;
  const discordLink = profile?.socials.discord;

  return (
    <section id="contact" className="section contact">
      <div className="section-container">
        <h2 className="section-title">{i18n.contact.title}</h2>
        <div className="contact-links">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            aria-label="GitHub profile"
          >
            <span className="icon">→</span>
            <span className="label">{i18n.contact.github}</span>
          </a>
          {twitterLink && (
            <a
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              aria-label="Twitter profile"
            >
              <span className="icon">→</span>
              <span className="label">{i18n.contact.twitter}</span>
            </a>
          )}
          {discordLink && (
            <a
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              aria-label="Discord profile"
            >
              <span className="icon">→</span>
              <span className="label">{i18n.contact.discord}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
