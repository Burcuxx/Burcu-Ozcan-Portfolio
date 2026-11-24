import { profile } from "./profile";

/*
 * Suggested questions with pre-written answers. The chat shows these instantly in the
 * browser without calling the AI, so the most common questions are free and always
 * accurate. Every answer must be backed by the CV (src/data/profile.ts).
 * The first few are shown up front; the rest sit behind "More questions".
 */
export const faq: { question: string; answer: string }[] = [
  {
    question: "What does Burcu specialise in?",
    answer:
      "Burcu is a Senior Frontend Developer with 14+ years in web development, including 7+ years focused on frontend engineering. She specialises in React, Next.js, TypeScript and Tailwind CSS, with a strong focus on design systems, accessibility and performance.",
  },
  {
    question: "Which projects can I see live?",
    answer: [
      "A few you can open right now:",
      "• ATS CV Checker: https://burcuxx.github.io/ats-checker/",
      "• Maximum: https://www.maximum.com.tr/",
      "• Monster Notebook: https://www.monsternotebook.de/",
      "She also built the frontends of newbalance.com.tr, ukinox.com.tr and konyalisaat.com.tr, among others.",
    ].join("\n"),
  },
  {
    question: "Is she open to new roles?",
    answer: `Yes. Burcu is open to new frontend roles. She is based in ${profile.location} and works in Turkish and English.`,
  },
  {
    question: "What is her tech stack?",
    answer: [
      "• Frontend: React, Next.js, TypeScript, JavaScript, HTML5, CSS3",
      "• Styling: Tailwind CSS, Sass (SCSS), Bootstrap, shadcn/ui, Material UI",
      "• APIs & CMS: REST, GraphQL, Directus, ASP.NET Razor, WordPress, OpenCart",
      "• Tools: Git, Nx monorepo, Figma, Lighthouse, Jira, Azure Boards",
    ].join("\n"),
  },
  {
    question: "How can I contact her?",
    answer: `You can contact Burcu by email at ${profile.email} or on LinkedIn: ${profile.linkedin}`,
  },
  {
    question: "Where has she worked?",
    answer: [
      "Most recent first:",
      "• United Remote (The Multiple): Senior Frontend Developer, and before that UI/UX Frontend Developer (2024–2026)",
      "• Proj-e Software Company: Frontend Developer (2021–2024)",
      "• Innevera Interactive: Frontend Developer (2019–2021)",
      "• Hangiacente.com: Web Operations Manager (2017–2019)",
      "• Pera Museum (Suna and İnan Kıraç Foundation): Web Development Supervisor (2016–2017)",
      "• Kıraça Holding – Karsat: Application Specialist (2012–2016)",
      "She started as a Junior Frontend Developer at Creaturk Digital Marketing Solutions in 2011.",
    ].join("\n"),
  },
  {
    question: "Does she have e-commerce experience?",
    answer:
      "Yes, a lot. At Proj-e she built the frontend for 20+ projects, many of them mobile-first online stores, rendering product and order data with ASP.NET Razor and connecting the frontend to REST APIs. At Innevera Interactive, e-commerce made up 60% of her projects. Her selected sites include newbalance.com.tr and monsternotebook.de.",
  },
  {
    question: "How does she work with designers?",
    answer:
      "Closely. As a UI/UX Frontend Developer she turned Figma designs into reusable React components and responsive production interfaces, and created design tokens, themes and visual assets for multiple brands. Earlier she also worked from Zeplin and Photoshop designs.",
  },
  {
    question: "Does she care about accessibility and performance?",
    answer:
      "Yes, both are core to her work: semantic, accessible HTML, responsive layouts and technical SEO. On the iGaming platform she improved Core Web Vitals through image optimisation, smaller bundles and lighter UI components, and she uses Lighthouse and browser DevTools to measure the results.",
  },
  {
    question: "How does she work in a team?",
    answer:
      "She works with design, product and backend teams in Agile (Scrum) sprints, takes part in code reviews and writes technical documentation. She has also delivered Waterfall projects and uses Jira and Azure Boards.",
  },
  {
    question: "What is the ATS CV Checker?",
    answer:
      "A free tool Burcu built that checks whether a CV is ATS-friendly. It runs entirely in the browser, so files never leave the user's device. It reads PDF, DOCX and TXT (including two-column layouts), scores format, structure and content, lists prioritised fixes and compares the CV with a job posting. Try it: https://burcuxx.github.io/ats-checker/",
  },
  {
    question: "Does she use AI tools?",
    answer: "Yes. Burcu uses Cursor, GitHub Copilot, Claude and ChatGPT in her daily workflow.",
  },
  {
    question: "What is her education?",
    answer: [
      "• Computer Programming, Istanbul University (2010–2012)",
      "• Web Design and Programming, Profilo Anatolian Technical High School (2005–2010)",
      "Recent courses include React & Redux, JavaScript & Node.js (Udemy, 2025), Tailwind CSS and CSS Animations (Master.dev, 2025).",
    ].join("\n"),
  },
  {
    question: "Which languages does she speak?",
    answer: "Turkish (native) and English (professional working proficiency).",
  },
];

/** How many suggestions to show before "More questions". */
export const FAQ_INITIAL = 6;
