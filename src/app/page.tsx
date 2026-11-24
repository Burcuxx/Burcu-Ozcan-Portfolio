import Image from "next/image";
import photo from "@/assets/burcu.jpg";
import { Section } from "@/components/Section";
import { ChatWidget } from "@/components/ChatWidget";
import { ParallaxLayer } from "@/components/Parallax";
import { CHAT_API_URL } from "@/config";
import { ReadMore } from "@/components/ReadMore";
import { SiteHeader } from "@/components/SiteHeader";
import {
  certifications,
  education,
  experience,
  languages,
  profile,
  projects,
  skills,
  stats,
  websites,
} from "@/data/profile";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function Wave({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-6 w-full sm:h-10 ${className}`}
    >
      <path d="M0 0h1440v22c-240 30-480 34-720 18S240 10 0 40Z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader nav={nav} email={profile.email} />

      <main id="top" className="flex-1">
        {/* Hero — mirrors the CV header */}
        <div className="relative isolate overflow-hidden bg-peach">
          <Wave className="relative z-10 text-terracotta" />

          {/* Decorative parallax layers (CV motifs: circles, diamonds, rules) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <ParallaxLayer speed={0.35} className="absolute -top-24 -right-24 sm:right-[8%]">
              <div className="size-72 rounded-full bg-ring-photo/35 blur-2xl sm:size-96" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2} className="absolute -bottom-32 -left-20">
              <div className="size-64 rounded-full bg-terracotta/15 blur-2xl sm:size-80" />
            </ParallaxLayer>
            <ParallaxLayer speed={-0.25} className="absolute top-[22%] right-[12%] hidden sm:block">
              <div className="size-6 rotate-45 border-2 border-terracotta/50" />
            </ParallaxLayer>
            <ParallaxLayer speed={-0.45} className="absolute bottom-[18%] right-[30%]">
              <div className="size-3 rotate-45 bg-terracotta/60" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.5} className="absolute top-[35%] left-[4%]">
              <div className="size-4 rotate-45 bg-ring-photo" />
            </ParallaxLayer>
            <ParallaxLayer
              speed={-0.15}
              className="absolute right-0 bottom-[30%] hidden w-1/3 md:block"
            >
              <div className="relative h-px bg-terracotta/40">
                <span className="absolute -top-[3.5px] left-0 size-2 rotate-45 bg-terracotta/60" />
              </div>
            </ParallaxLayer>
          </div>

          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pt-8 pb-12 text-center sm:flex-row sm:px-6 sm:pt-10 sm:pb-14 sm:text-left">
            <div className="shrink-0">
              <div className="rounded-full border-[6px] border-ring-photo p-0 shadow-lg shadow-terracotta/10">
                <Image
                  src={photo}
                  alt="Portrait of Burcu Ozcan"
                  priority
                  className="size-40 rounded-full object-cover sm:size-48"
                />
              </div>
            </div>
            <div>
              <h1 className="font-serif text-5xl leading-none text-accent sm:text-7xl">
                {profile.name}
              </h1>
              <p className="mt-3 text-xl font-medium text-accent/90 sm:text-2xl">{profile.title}</p>
              <p className="mt-4 max-w-xl text-muted">
                I build fast, accessible interfaces and design systems with React, Next.js,
                TypeScript and Tailwind CSS. Based in {profile.location}.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <a
                  href="#projects"
                  className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110 dark:text-background"
                >
                  View my work
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-terracotta px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-terracotta/10"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Section id="about">
            <ReadMore paragraphs={profile.summary} />
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col rounded-2xl border border-line bg-surface p-6"
                >
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="order-first font-serif text-4xl text-accent">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="skills" title="Skills">
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((group) => (
                <div key={group.group}>
                  <h3 className="mb-3 font-semibold">{group.group}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-full bg-peach px-3 py-1 text-sm text-rust">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="experience" title="Professional Experience">
            <ol className="relative border-l-2 border-line">
              {experience.map((job) => (
                <li key={job.role + job.period} className="relative pb-7 pl-6 last:pb-0">
                  <span className="absolute top-1.5 -left-[7px] size-3 rotate-45 bg-terracotta" />
                  <p className="text-sm font-medium text-accent">{job.period}</p>
                  <h3 className="mt-1 text-lg font-semibold">{job.role}</h3>
                  <p className="text-muted">{job.company}</p>
                  {job.points.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-terracotta">
                      {job.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Section>

          <Section id="projects" title="Projects">
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((p) => {
                const card = (
                  <>
                    <p className="text-xs font-semibold tracking-wider text-accent uppercase">
                      {p.kind}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-rust">{p.name}</h3>
                    <p className="mt-3 flex-1 text-muted">{p.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full bg-peach px-2.5 py-0.5 text-xs text-rust"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </>
                );
                const cls = `flex flex-col rounded-2xl border border-line bg-surface p-6 transition${
                  p.featured ? " sm:col-span-2" : ""
                }`;
                return p.href ? (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${cls} hover:-translate-y-1 hover:border-terracotta hover:shadow-lg hover:shadow-terracotta/10`}
                  >
                    {card}
                  </a>
                ) : (
                  <div key={p.name} className={cls}>
                    {card}
                  </div>
                );
              })}
            </div>

            <h3 className="mt-8 mb-4 font-semibold">Selected websites</h3>
            <ul className="flex flex-wrap gap-3">
              {websites.map((w) => (
                <li key={w}>
                  <a
                    href={`https://${w}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg border border-line bg-surface px-4 py-2 text-sm transition hover:border-terracotta hover:text-accent"
                  >
                    {w} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className="grid gap-x-12 md:grid-cols-2">
            <Section id="education" title="Education">
              <ul className="space-y-4">
                {education.map((e) => (
                  <li key={e.title}>
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-muted">
                      {e.place} · {e.period}
                    </p>
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 mb-3 font-serif text-2xl text-rust">Languages</h3>
              <ul className="space-y-2">
                {languages.map((l) => (
                  <li key={l.name}>
                    <span className="font-semibold">{l.name}</span>{" "}
                    <span className="text-muted">— {l.level}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="certifications" title="Certifications">
              <ul className="divide-y divide-line">
                {certifications.map((c) => (
                  <li key={c.title} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span>
                      {c.title} <span className="text-muted">· {c.place}</span>
                    </span>
                    <span className="text-sm text-accent">{c.year}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <section
          id="contact"
          className="relative isolate mt-6 scroll-mt-20 overflow-hidden bg-peach"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <ParallaxLayer speed={0.3} className="absolute -top-20 -left-16">
              <div className="size-64 rounded-full bg-ring-photo/35 blur-2xl" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2} className="absolute -right-16 -bottom-24">
              <div className="size-72 rounded-full bg-terracotta/15 blur-2xl" />
            </ParallaxLayer>
            <ParallaxLayer speed={-0.3} className="absolute top-[25%] right-[15%]">
              <div className="size-5 rotate-45 border-2 border-terracotta/50" />
            </ParallaxLayer>
            <ParallaxLayer speed={-0.4} className="absolute bottom-[25%] left-[12%]">
              <div className="size-3 rotate-45 bg-terracotta/60" />
            </ParallaxLayer>
          </div>
          <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">
            <h2 className="font-serif text-4xl text-rust sm:text-5xl">Let&apos;s work together</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Open to frontend roles and freelance projects. The fastest way to reach me is by
              email.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:brightness-110 dark:text-background"
              >
                {profile.email}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-terracotta px-6 py-3 font-medium text-accent transition hover:bg-terracotta/10"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-terracotta px-6 py-3 font-medium text-accent transition hover:bg-terracotta/10"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-terracotta text-center text-sm text-white/90 dark:text-background">
        <Wave className="rotate-180 text-peach" />
        <p className="px-4 pt-2 pb-6">
          ©{" "}
          {/* The year is baked in at build time; the inline script below keeps it current
              between deploys, before the first paint (see Next.js "preventing flash before
              hydration" guide). */}
          <span id="copyright-year" suppressHydrationWarning>
            {new Date().getFullYear()}
          </span>
          <script
            dangerouslySetInnerHTML={{
              __html: `document.getElementById("copyright-year").textContent=new Date().getFullYear()`,
            }}
          />{" "}
          {profile.name} · Built with Next.js & Tailwind CSS
        </p>
      </footer>
      <ChatWidget apiUrl={CHAT_API_URL} />
    </>
  );
}
