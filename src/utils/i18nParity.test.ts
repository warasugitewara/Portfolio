import { describe, expect, it } from "vitest";
import ja from "../../public/data/i18n-ja.json";
import en from "../../public/data/i18n-en.json";
import infraPageSource from "../pages/InfrastructurePage.tsx?raw";

/**
 * `t()` on the infrastructure page resolves with `labels?.[key] ?? ""`, and the
 * i18n type carries an index signature — so a missing key type-checks, lints and
 * builds cleanly while rendering as a silent blank. These tests are the only
 * thing standing between a key rename and an empty label in production.
 */
const sections = Object.keys(ja) as (keyof typeof ja)[];

describe("i18n parity", () => {
  it.each(sections)("ja and en define the same keys in %s", (section) => {
    const jaKeys = Object.keys(ja[section] as Record<string, unknown>).sort();
    const enKeys = Object.keys(en[section] as Record<string, unknown>).sort();
    expect(jaKeys).toEqual(enKeys);
  });

  it("has no empty strings", () => {
    for (const section of sections) {
      for (const [key, value] of Object.entries(ja[section] as Record<string, unknown>)) {
        expect(value, `ja.${section}.${key}`).not.toBe("");
      }
      for (const [key, value] of Object.entries(en[section] as Record<string, unknown>)) {
        expect(value, `en.${section}.${key}`).not.toBe("");
      }
    }
  });
});

describe("infrastructure page label references", () => {
  const referenced = [...infraPageSource.matchAll(/\bt\("([a-zA-Z0-9_]+)"\)/g)].map((m) => m[1]);

  it("references at least the labels we expect to find", () => {
    expect(referenced.length).toBeGreaterThan(20);
  });

  it.each([...new Set(referenced)])("%s exists in both languages", (key) => {
    expect(Object.keys(ja.infrastructure)).toContain(key);
    expect(Object.keys(en.infrastructure)).toContain(key);
  });
});
