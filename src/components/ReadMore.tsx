"use client";

import { useState } from "react";

/** Shows the first paragraph and reveals the rest on demand. All text stays in the HTML for SEO. */
export function ReadMore({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  const [first, ...rest] = paragraphs;

  return (
    <div className="max-w-3xl text-lg leading-relaxed">
      <p>{first}</p>
      {rest.length > 0 && (
        <>
          <div id="about-more" hidden={!open} className="mt-4 space-y-4">
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="about-more"
            onClick={() => setOpen((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-base font-medium text-accent underline-offset-4 hover:underline"
          >
            {open ? "Show less" : "Read more"}
            <svg
              viewBox="0 0 24 24"
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
