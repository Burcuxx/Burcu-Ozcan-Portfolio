"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = { href: string; label: string };

export function SiteHeader({ nav, email }: { nav: NavItem[]; email: string }) {
  const [open, setOpen] = useState(false);

  // Close the mobile menu with Escape, or when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 640px)");
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="font-serif text-xl text-accent" onClick={() => setOpen(false)}>
          Burcu Ozcan
        </a>
        <ul className="hidden gap-6 text-sm text-muted sm:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a
            href={`mailto:${email}`}
            className="rounded-full bg-terracotta px-4 py-1.5 text-sm font-medium text-on-terracotta transition hover:brightness-110"
          >
            Hire me
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full text-accent transition hover:bg-terracotta/10 sm:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Animates open/closed by transitioning the grid row from 0fr to 1fr; `inert` keeps the
          collapsed links out of the tab order. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`grid bg-background transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none sm:hidden ${
          open ? "grid-rows-[1fr] border-t border-line/70 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <ul className="mx-auto flex min-h-0 w-full max-w-5xl flex-col overflow-hidden px-4">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 text-base text-foreground transition-colors hover:bg-peach hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li aria-hidden="true" className="h-2" />
        </ul>
      </div>
    </header>
  );
}
