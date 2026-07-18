import type { Language } from "../types";

/**
 * Pick a localized string.
 * @param lang  active UI language
 * @param en    the primary/default text (shown for `en`, and as `ja` fallback)
 * @param ja    optional localized text shown when `lang === 'ja'`
 * @returns the `ja` text for Japanese when provided, otherwise `en`
 */
export const pickLang = (lang: Language, en: string, ja?: string): string =>
  lang === "ja" ? (ja ?? en) : en;
