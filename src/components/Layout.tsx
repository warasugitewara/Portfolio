import { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  lang: string;
  i18n: any;
  onLanguageSwitch: (lang: string) => void;
  onThemeToggle: () => void;
  theme: string;
}

export const Header = ({ lang, i18n, onLanguageSwitch, onThemeToggle, theme }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="header-title">warasugi</h1>
        </a>
        <nav className="header-nav">
          <a href="/#about" className="nav-link">
            {i18n.nav.about}
          </a>
          <a href="/#skills" className="nav-link">
            {i18n.nav.skills}
          </a>
          <a href="/infrastructure" className="nav-link">
            {i18n.nav.infrastructure}
          </a>
          <a href="/#projects" className="nav-link">
            {i18n.nav.projects}
          </a>
          <a href="/#contact" className="nav-link">
            {i18n.nav.contact}
          </a>
          <div className="lang-switcher">
            <button
              className={`lang-btn ${lang === 'ja' ? 'active' : ''}`}
              onClick={() => onLanguageSwitch('ja')}
            >
              日本語
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => onLanguageSwitch('en')}
            >
              English
            </button>
            <button
              className="theme-btn"
              onClick={onThemeToggle}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

interface FooterProps {
  i18n: any;
}

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <footer className="footer">
      <p>{i18n.footer.copyright}</p>
    </footer>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  lang: string;
  i18n: any;
  onLanguageSwitch: (lang: string) => void;
  onThemeToggle: () => void;
  theme: string;
}

export const Layout = ({ children, lang, i18n, onLanguageSwitch, onThemeToggle, theme }: LayoutProps) => {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="app">
      <Header 
        lang={lang} 
        i18n={i18n} 
        onLanguageSwitch={onLanguageSwitch} 
        onThemeToggle={onThemeToggle}
        theme={theme}
      />
      <main className="main">
        {children}
      </main>
      <Footer i18n={i18n} />
    </div>
  );
};
