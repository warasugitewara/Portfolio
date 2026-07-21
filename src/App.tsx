import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useI18n } from "./hooks/useI18n";
import { useTheme } from "./hooks/useTheme";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";

// Infrastructure page carries two large SVG diagrams; load it on demand so the
// landing page's initial bundle stays lean. HomePage stays eager for the boot animation.
const InfrastructurePage = lazy(() =>
  import("./pages/InfrastructurePage").then((m) => ({ default: m.InfrastructurePage })),
);

function App() {
  const { lang, i18n, switchLanguage } = useI18n("ja");
  const { theme, toggleTheme } = useTheme("dark");

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
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage i18n={i18n} lang={lang} />} />
            <Route
              path="/infrastructure"
              element={<InfrastructurePage i18n={i18n} lang={lang} />}
            />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
