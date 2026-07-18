import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { I18n, Language } from "../types";

interface HeaderProps {
  lang: Language;
  i18n: I18n;
  onLanguageSwitch: (lang: Language) => void;
  onThemeToggle: () => void;
  theme: string;
}

export const Header = ({ lang, i18n, onLanguageSwitch, onThemeToggle, theme }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="header-title">warasugi</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/#about" className="nav-link">
            {i18n.nav.about}
          </Link>
          <Link to="/#skills" className="nav-link">
            {i18n.nav.skills}
          </Link>
          <Link to="/infrastructure" className="nav-link">
            {i18n.nav.infrastructure}
          </Link>
          <Link to="/#projects" className="nav-link">
            {i18n.nav.projects}
          </Link>
          <Link to="/#contact" className="nav-link">
            {i18n.nav.contact}
          </Link>
          <div className="lang-switcher">
            <button
              className={`lang-btn ${lang === "ja" ? "active" : ""}`}
              onClick={() => onLanguageSwitch("ja")}
            >
              日本語
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => onLanguageSwitch("en")}
            >
              English
            </button>
            <button
              className="theme-btn"
              onClick={onThemeToggle}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

interface FooterProps {
  i18n: I18n;
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
  lang: Language;
  i18n: I18n;
  onLanguageSwitch: (lang: Language) => void;
  onThemeToggle: () => void;
  theme: string;
}

export const Layout = ({
  children,
  lang,
  i18n,
  onLanguageSwitch,
  onThemeToggle,
  theme,
}: LayoutProps) => {
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
      <main className="main">{children}</main>
      <Footer i18n={i18n} />
    </div>
  );
};
