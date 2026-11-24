import type { ReactNode } from "react";

/** Section with the CV-style heading: serif title over a terracotta rule ending in a diamond. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-6 sm:py-8">
      {title && (
        <>
          <h2 className="font-serif text-3xl text-rust sm:text-4xl">{title}</h2>
          <div className="relative mt-3 mb-6 h-px bg-terracotta/60">
            <span className="absolute -top-[3.5px] right-0 size-2 rotate-45 bg-terracotta/80" />
          </div>
        </>
      )}
      {children}
    </section>
  );
}
