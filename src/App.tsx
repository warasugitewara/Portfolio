import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useI18n } from './hooks/useI18n';
import { useTheme } from './hooks/useTheme';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { InfrastructurePage } from './pages/InfrastructurePage';

function App() {
  const { lang, i18n, switchLanguage } = useI18n('ja');
  const { theme, toggleTheme } = useTheme('dark');

  if (!i18n) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Layout
        lang={lang}
        i18n={i18n}
        onLanguageSwitch={switchLanguage}
        onThemeToggle={toggleTheme}
        theme={theme}
      >
        <Routes>
          <Route path="/" element={<HomePage i18n={i18n} />} />
          <Route path="/infrastructure" element={<InfrastructurePage i18n={i18n} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
