import { useEffect, useState } from "react";
import type { I18n, Language, SetupData } from "../types";
import { getDataUrl } from "../utils/path";
import { pickLang } from "../utils/pickLang";

interface SetupProps {
  i18n: I18n;
  lang: Language;
}

/** The tools behind the "CLI-focused" claim, named rather than asserted. */
export const Setup = ({ i18n, lang }: SetupProps) => {
  const [data, setData] = useState<SetupData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(getDataUrl("setup.json"));
        if (!response.ok) throw new Error(`Failed to load setup: ${response.status}`);
        setData((await response.json()) as SetupData);
      } catch (error) {
        console.error("Failed to load setup:", error);
      }
    };
    void load();
  }, []);

  const groups = data?.setup.groups ?? [];
  if (!groups.length) return null;

  return (
    <section id="setup" className="section">
      <h2 className="section-title">{i18n.setup?.title ?? ""}</h2>
      <dl className="setup">
        {groups.map((group) => (
          <div key={group.label} className="setup__group">
            <dt className="setup__label">
              {pickLang(lang, group.label_en ?? group.label, group.label)}
            </dt>
            <dd className="setup__items">
              {group.items.map((item) => (
                <span key={item} className="setup__item">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
