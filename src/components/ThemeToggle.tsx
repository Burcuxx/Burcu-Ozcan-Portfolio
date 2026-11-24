"use client";

/*
 * Light/dark switch. The first click turns the theme the visitor currently sees into an
 * explicit choice and flips it; the choice is saved and re-applied before paint by the
 * inline script in app/layout.tsx. Which icon shows is decided in CSS (globals.css), so
 * the button renders correctly before hydration and never flashes the wrong icon.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.getAttribute("data-theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";

    // Cross-fade colours briefly while switching (skipped for reduced motion).
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 300);
    }

    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className="grid size-9 place-items-center rounded-full text-accent transition hover:bg-terracotta/10"
    >
      {/* Moon: shown in the light theme */}
      <svg
        viewBox="0 0 24 24"
        className="theme-icon-moon size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* Sun: shown in the dark theme */}
      <svg
        viewBox="0 0 24 24"
        className="theme-icon-sun size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
