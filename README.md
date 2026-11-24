# Burcu Ozcan — Portfolio

Live site: https://burcuxx.github.io/Burcu-Ozcan-Portfolio/

Personal portfolio built with **Next.js**, **React**, **TypeScript** and **Tailwind CSS**. The colour palette matches my CV: terracotta, peach and rust.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Editing content

All text (summary, skills, experience, projects, certifications) lives in `src/data/profile.ts`. The colours are defined as CSS variables in `src/app/globals.css`.

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, set **Pages → Source** to **GitHub Actions**.

## AI chat assistant

The "Ask about Burcu" chat answers visitors' questions from the CV. Because the site is static, the
Claude API key cannot live in the browser, so a small Cloudflare Worker (`worker/`) sits in between:

```
Browser (GitHub Pages)  ->  Cloudflare Worker (holds the key)  ->  Claude API
```

- `worker/src/knowledge.ts`: the profile text and rules the assistant answers from.
- `src/data/chat.ts`: suggested questions with pre-written answers, shown instantly with no AI call.
- `worker/src/index.ts`: origin check, input limits, per-IP rate limit, streaming reply.
- `worker/src/quota.ts`: daily allowance of typed questions per visitor (`DAILY_LIMIT`, default 10).
- `.github/workflows/deploy-chat.yml`: deploys the Worker when `worker/` changes.
- `src/config.ts`: the Worker URL. While it is empty, the chat offers only the suggested questions.

Repository secrets used by the workflow (Settings -> Secrets and variables -> Actions):
`ANTHROPIC_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. None of them is ever committed.

The Worker's Origin check only stops other websites from using it in a browser; it is not
authentication. The per-IP rate limit and a monthly spend limit on the Anthropic account are what
protect the bill, so set that spend limit in the Anthropic Console.

The assistant's knowledge is generated from `src/data/profile.ts`, the same file the site renders.
