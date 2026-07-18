import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = (
  defaultTheme?: Theme,
): { theme: Theme; switchTheme: (newTheme: Theme) => void; toggleTheme: () => void } => {
  const [theme, setTheme] = useState<Theme>(() => {
    // The blocking script in index.html already applied the persisted theme to
    // <html data-theme>. Read it back so initial state matches first paint.
    const applied = document.documentElement.dataset.theme;
    if (applied === "light" || applied === "dark") return applied;
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return defaultTheme ?? "dark";
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
