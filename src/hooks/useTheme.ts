import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = (
  defaultTheme?: Theme,
): { theme: Theme; switchTheme: (newTheme: Theme) => void; toggleTheme: () => void } => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) return saved;
    if (defaultTheme) return defaultTheme;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const switchTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    switchTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, switchTheme, toggleTheme };
};
