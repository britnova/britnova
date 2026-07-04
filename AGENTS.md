# AGENTS.md

Instructions for AI coding agents (Antigravity, etc.) working in this repository.

## Project Overview

Marketing website for a software development agency. Design direction: dark, bold, editorial agency aesthetic (reference: https://kinetiq-template.webflow.io/). Hybrid structure — a single-page-feel homepage with dedicated inner pages for Work, Services, About, and Contact.

## Tech Stack

- **Framework**: Astro (App Router-style file-based routing, static output)
- **Styling**: Tailwind CSS (custom theme — do not use default Tailwind palette/typography, use tokens defined in `tailwind.config.mjs`)
- **Interactivity**: React, used only for islands that need client-side state (nav mobile menu, testimonial carousel, contact form, work-grid filters). Everything else must be static `.astro` components — do not reach for React by default.
- **Animation**: Framer Motion, used inside React islands only
- **Content**: Astro Content Collections for case studies (`src/content/work/*.md`) and services (`src/content/services/*.md`)
- **Package manager**: pnpm

## Commands

- `pnpm install` — install dependencies
- `pnpm dev` — start dev server
- `pnpm build` — production build (static output)
- `pnpm preview` — preview production build locally
- `pnpm lint` — run ESLint
- `pnpm format` — run Prettier

Run `pnpm build` before considering any task complete to confirm the site compiles without errors.

## Folder Structure

```
src/
  components/
    astro/        # static, non-interactive components (.astro)
    react/         # interactive islands only (.tsx)
  content/
    work/          # case study markdown files (content collection)
    services/      # service markdown files (content collection)
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    work/
      index.astro
      [slug].astro
    services.astro
    about.astro
    contact.astro
  styles/
    global.css
public/
  images/
```

## Conventions

- **Component naming**: PascalCase for both `.astro` and `.tsx` components
- **Static-first**: default to `.astro` components. Only create a React component when the section needs client-side state, animation orchestration, or event handling that Astro can't do statically. Use `client:visible` (not `client:load`) for below-the-fold islands to minimize hydration cost.
- **Styling**: Tailwind utility classes only — no separate CSS files per component unless doing something Tailwind genuinely can't express. Shared design tokens (colors, font sizes, spacing) live in `tailwind.config.mjs`, not hardcoded hex values in components.
- **Images**: use Astro's `<Image />` component (`astro:assets`) for all local images to get automatic optimization. Never use raw `<img>` for local files.
- **TypeScript**: use TypeScript for all React components and Astro frontmatter where props are involved. Define prop types explicitly, no `any`.
- **Content**: never hardcode case study or service copy directly into page templates — pull from `src/content/*` collections so non-engineers can edit content later without touching layout code.
- **Placeholders**: any placeholder text or image must include a `<!-- TODO: replace -->` (or `{/* TODO: replace */}` in JSX) comment so it's greppable before launch.

## Design Tokens (starting point — adjust in tailwind.config.mjs, don't hardcode elsewhere)

- Background: near-black (`#0A0A0A` range)
- Text: off-white (`#F5F5F5` range)
- Accent: one saturated brand color (TBD — placeholder `#6C5CE7` until brand color is chosen)
- Font: variable sans-serif (e.g. Inter or Satoshi) for both display and body, differentiated by weight/size not typeface

## Do

- Keep JS bundle size minimal — this is a content site, not an app. Justify every client-side island.
- Write semantic HTML (`<nav>`, `<section>`, `<article>`, proper heading hierarchy — one `<h1>` per page).
- Add meta title/description and Open Graph tags to every page via `BaseLayout.astro` props.
- Test responsiveness at 375px, 768px, 1280px, 1920px before marking a section done.

## Don't

- Don't introduce a state management library (Redux, Zustand, etc.) — this site doesn't need one.
- Don't use `client:load` by default — prefer `client:visible` or `client:idle`.
- Don't hardcode copy or images that belong in content collections.
- Don't add a CMS integration unless explicitly asked — content collections are sufficient for now.

## Open Questions / Placeholders to Flag

- Final brand accent color
- Contact form backend (we will use Resend, and the api key will be in the .env file)
