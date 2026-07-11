import { useId, useState } from "react";
import type { ReactNode } from "react";

interface CollapsibleSectionProps {
  /** Header content — plain text or rich nodes. */
  title: ReactNode;
  /** Whether the section starts expanded. Defaults to closed. */
  defaultOpen?: boolean;
  children: ReactNode;
  /** Extra class on the wrapper (e.g. to restyle a nested variant). */
  className?: string;
  /** Extra class on the collapsible body. */
  bodyClassName?: string;
}

/**
 * Accessible, reusable collapsible section.
 * - Real <button> toggle with aria-expanded / aria-controls.
 * - Keyboard operable by default (native button semantics).
 * - Body stays in the DOM (toggled via `hidden`) so aria-controls always resolves.
 */
export const CollapsibleSection = ({
  title,
  defaultOpen = false,
  children,
  className,
  bodyClassName,
}: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div className={`collapsible${className ? ` ${className}` : ""}`}>
      <button
        type="button"
        className="collapsible__trigger"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="collapsible__title">{title}</span>
        <span className="collapsible__chevron" aria-hidden="true">
          {open ? "▼" : "▶"}
        </span>
      </button>
      <div
        id={bodyId}
        className={`collapsible__body${bodyClassName ? ` ${bodyClassName}` : ""}`}
        hidden={!open}
      >
        {children}
      </div>
    </div>
  );
};
