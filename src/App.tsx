import { useEffect, useState } from 'react';
import { useI18n } from './hooks/useI18n';
import { useTheme } from './hooks/useTheme';
import { BootAnimation } from './components/BootAnimation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Snake } from './components/Snake';
import { Skills } from './components/Skills';
import { Infrastructure } from './components/Infrastructure';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';

function App() {
  const { lang, i18n, switchLanguage } = useI18n('ja');
  const { theme, toggleTheme } = useTheme('dark');
  const [showBoot, setShowBoot] = useState(() => {
    if (typeof window !== 'undefined') {
      const shown = localStorage.getItem('bootAnimationShown');
      return !shown;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (showBoot === false) {
      localStorage.setItem('bootAnimationShown', 'true');
    }
  }, [showBoot]);

  if (!i18n) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {showBoot && <BootAnimation onComplete={() => setShowBoot(false)} />}
      <header className="header">
        <div className="header-wrapper">
          <h1 className="header-title">warasugi</h1>
          <nav className="header-nav">
            <a href="#about" className="nav-link">
              {i18n.nav.about}
            </a>
            <a href="#skills" className="nav-link">
              {i18n.nav.skills}
            </a>
            <a href="#infrastructure" className="nav-link">
              Infrastructure
            </a>
            <a href="#projects" className="nav-link">
              {i18n.nav.projects}
            </a>
            <a href="#contact" className="nav-link">
              {i18n.nav.contact}
            </a>
            <div className="lang-switcher">
              <button
                className={`lang-btn ${lang === 'ja' ? 'active' : ''}`}
                onClick={() => switchLanguage('ja')}
              >
                日本語
              </button>
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => switchLanguage('en')}
              >
                English
              </button>
              <button
                className="theme-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main">
        <Hero i18n={i18n} />
        <About i18n={i18n} />
        <Snake i18n={i18n} />
        <Skills i18n={i18n} />
        <Infrastructure i18n={i18n} />
        <Projects i18n={i18n} />
        <Contact i18n={i18n} />
      </main>

      <footer className="footer">
        <p>{i18n.footer.copyright}</p>
      </footer>
    </div>
  );
}

export default App;
