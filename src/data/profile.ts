export const profile = {
  name: "Burcu Ozcan",
  title: "Senior Frontend Developer",
  location: "Gżira, Malta",
  email: "burcukizilaslan.05@gmail.com",
  linkedin: "https://www.linkedin.com/in/bkozcan",
  github: "https://github.com/Burcuxx",
  summary: [
    "I'm a Senior Frontend Developer with 14+ years in web development, including 7+ years focused on frontend engineering. I care about interfaces that look right, load fast and work for everyone — semantic, accessible HTML, responsive layouts and clean, reusable components.",
    "Most recently, at United Remote (The Multiple), I used React, Next.js, TypeScript and Tailwind CSS to build iGaming features for multiple brands. I created shared UI components with shadcn/ui and a design-token system in an Nx monorepo, so each brand could carry its own look from a single codebase. I turned Figma designs into production components, integrated REST APIs and improved Core Web Vitals through image optimisation, smaller bundles and lighter UI.",
    "Before that, I delivered 20+ projects at agencies and software companies — mostly mobile-first e-commerce sites and landing pages for brands such as Maximum, New Balance and Monster Notebook — using JavaScript, ASP.NET Razor, SCSS and Bootstrap. Earlier in my career I maintained the Pera Museum and corporate websites, customised WordPress themes and built the frontend for a monthly digital magazine.",
    "I work closely with design, product and backend teams in Agile (Scrum) sprints, review code, write technical documentation and use AI tools like Cursor, GitHub Copilot and Claude in my daily workflow. I'm based in Malta and work in Turkish and English.",
  ],
};

export const stats = [
  { value: "14+", label: "years in web development" },
  { value: "7+", label: "years in frontend engineering" },
  { value: "20+", label: "projects shipped at Proj-e" },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Sass (SCSS)",
      "Bootstrap",
      "shadcn/ui",
      "Material UI",
      "Accessibility",
      "Technical SEO",
      "Responsive design",
    ],
  },
  {
    group: "Design Systems",
    items: ["Design tokens", "Multi-brand theming", "Shared UI libraries"],
  },
  {
    group: "APIs & CMS",
    items: ["REST APIs", "GraphQL", "Directus", "ASP.NET Razor", "WordPress", "OpenCart"],
  },
  {
    group: "Tools",
    items: ["Git", "Nx monorepo", "Jira", "Azure Boards", "DevTools", "Lighthouse", "Figma"],
  },
  {
    group: "AI Tools",
    items: ["Cursor", "GitHub Copilot", "Claude", "ChatGPT"],
  },
  { group: "Methodologies", items: ["Agile", "Scrum", "Waterfall"] },
];

export type Job = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export const experience: Job[] = [
  {
    role: "Senior Frontend Developer",
    company: "United Remote (The Multiple)",
    period: "Feb 2026 – Nov 2026",
    points: [
      "Developed multi-brand iGaming features with React, Next.js, TypeScript and REST APIs.",
      "Built shared React components and design tokens powering distinct themes for multiple brands from one Nx monorepo.",
      "Improved Core Web Vitals through image optimisation, smaller bundles and lighter UI components.",
      "Worked with design, product and backend teams in Scrum sprints on feature delivery, code reviews and technical documentation.",
    ],
  },
  {
    role: "UI/UX Frontend Developer",
    company: "United Remote (The Multiple)",
    period: "Aug 2024 – Jan 2026",
    points: [
      "Turned Figma designs into reusable React components and responsive production interfaces.",
      "Created design tokens, themes and visual assets for multiple brands.",
      "Connected frontend features to backend REST APIs.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Proj-e Software Company",
    period: "Jan 2021 – May 2024",
    points: [
      "Developed frontend interfaces for 20+ Agile and Waterfall projects, including mobile-first e-commerce sites and landing pages.",
      "Translated Figma, Zeplin and Photoshop designs into web pages using HTML, CSS and JavaScript.",
      "Rendered backend data in dynamic e-commerce pages with ASP.NET Razor.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Innevera Interactive",
    period: "Sep 2019 – Jan 2021",
    points: [
      "Built responsive websites from Figma, Zeplin and Photoshop designs; e-commerce accounted for 60% of projects.",
    ],
  },
  {
    role: "Web Operations Manager",
    company: "Hangiacente.com",
    period: "May 2017 – Apr 2019",
    points: [
      "Built frontend pages, managed CMS content, website setup, domains and hosting, and trained customers.",
    ],
  },
  {
    role: "Web Development Supervisor",
    company: "Suna and İnan Kıraç Foundation, Pera Museum",
    period: "Feb 2016 – Feb 2017",
    points: [
      "Maintained museum and research institute websites and customised WordPress themes and HTML/CSS layouts.",
    ],
  },
  {
    role: "Application Specialist",
    company: "Kıraça Holding – Karsat",
    period: "Nov 2012 – Feb 2016",
    points: [
      "Maintained corporate websites and intranet content, and built the frontend for KMAG, a monthly digital magazine.",
    ],
  },
  {
    role: "Junior Frontend Developer",
    company: "Smart Tanıtım – Creaturk Digital Marketing Solutions",
    period: "Nov 2011 – Nov 2012",
    points: [],
  },
];

export type Project = {
  name: string;
  kind: string;
  description: string;
  tags: string[];
  href?: string;
  /** Spans the full width of the project grid. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "Multi-brand iGaming platform",
    kind: "Design system",
    description:
      "Shared React components built with Tailwind CSS and shadcn/ui, plus design tokens that power distinct brand themes from a single Nx monorepo.",
    tags: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "Design tokens", "Nx"],
  },
  {
    name: "E-commerce websites",
    kind: "E-commerce",
    description:
      "Mobile-first online stores built with pure JavaScript, Bootstrap and Sass. I worked across the C# / ASP.NET stack, rendering product and order data with Razor syntax and connecting the frontend to REST APIs.",
    tags: ["Vanilla JS", "Bootstrap", "Sass", "C#", "ASP.NET Razor", "REST API"],
  },
  {
    name: "ATS CV Checker",
    kind: "Web tool",
    description:
      "A free, fully client-side tool that checks whether a CV is ATS-friendly. It parses PDF, DOCX and TXT (including two-column layouts), scores format, structure and content, lists prioritised fixes and matches the CV against a job posting. Turkish / English interface.",
    tags: ["HTML", "CSS", "Vanilla JS", "pdf.js", "mammoth.js", "i18n"],
    href: "https://burcuxx.github.io/ats-checker/",
  },
  {
    name: "Social Share",
    kind: "Web app",
    description:
      "Upload a video once, write the title and description, and publish it to YouTube, TikTok and Instagram Reels at the same time. Includes email sign-in, OAuth connections to each platform and automatic token renewal.",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "SQLite", "OAuth"],
    href: "https://github.com/Burcuxx/SocialShare",
  },
  {
    name: "Artworks from Pera Museum",
    kind: "Chrome extension",
    description:
      "A browser extension that brings artworks from the Pera Museum collection into every new tab.",
    tags: ["JavaScript", "Chrome Extensions"],
  },
  {
    name: "Maximum",
    kind: "Website",
    description:
      "The website of Maximum, one of Turkey's largest credit card programmes. I built the responsive interface with Bootstrap, SCSS and pure JavaScript.",
    tags: ["Bootstrap", "SCSS", "Vanilla JS", "Responsive"],
    href: "https://www.maximum.com.tr/",
  },
];

export const websites = [
  "newbalance.com.tr",
  "monsternotebook.de",
  "ukinox.com.tr",
  "hyplit.com",
  "konyalisaat.com.tr",
  "faiksonmez.com",
];

export const education = [
  { title: "Computer Programming", place: "Istanbul University", period: "2010–2012" },
  {
    title: "Web Design and Programming",
    place: "Profilo Anatolian Technical High School",
    period: "2005–2010",
  },
];

export const certifications = [
  { title: "React & Redux", place: "Udemy", year: "2025" },
  { title: "JavaScript & Node.js", place: "Udemy", year: "2025" },
  { title: "Tailwind CSS", place: "Master.dev", year: "2025" },
  { title: "CSS Animations and Transitions", place: "Master.dev", year: "2025" },
  { title: "Information Security (EU)", place: "iGaming Academy", year: "2024" },
  { title: "GDPR", place: "iGaming Academy", year: "2024" },
  { title: "Advanced Git", place: "Patika.dev", year: "2022" },
  { title: "User Experience 101", place: "Udemy", year: "2021" },
];

export const languages = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
];
