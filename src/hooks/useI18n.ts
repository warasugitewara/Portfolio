import { useEffect, useState } from "react";
import type { Language, I18n } from "../types";

export const useI18n = (defaultLang: Language = "ja") => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language | null;
      return saved || defaultLang;
    }
    return defaultLang;
  });
  const [i18n, setI18n] = useState<I18n | null>(null);

  const basePath = import.meta.env.BASE_URL || "/";

  useEffect(() => {
    const loadI18n = async () => {
      try {
        const url = `${basePath}data/i18n-${lang}.json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load i18n: ${response.status}`);
        const data = await response.json();
        setI18n(data);
      } catch (error) {
        console.error("Failed to load i18n:", error);
      }
    };
    void loadI18n();
  }, [lang, basePath]);

  const switchLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
  };

  return { lang, i18n, switchLanguage };
};
