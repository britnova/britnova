# Britnova Technologies

Marketing website for a software development agency. The site uses a dark, bold, editorial aesthetic with a single-page-feel homepage and dedicated pages for Work, Services, About, and Contact.

Design reference: [Kinetiq template](https://kinetiq-template.webflow.io/)

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Astro](https://astro.build/) (file-based routing, static output with Vercel adapter) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) — design tokens in `src/styles/global.css` |
| Interactivity | [React](https://react.dev/) islands only (nav, carousel, contact form, work filters) |
| Animation | [Framer Motion](https://www.framer.com/motion/) (inside React islands) |
| Content | Astro Content Collections (`src/content/work/`, `src/content/services/`) |
| Package manager | [pnpm](https://pnpm.io/) |

## Requirements

- Node.js **>= 22.12.0**
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:4321` by default.

### Production build

```bash
pnpm build
pnpm preview
```

## Environment variables

The contact form sends email via [Resend](https://resend.com/). Create a `.env` file in the project root:

```env
RESEND_API_KEY=your_resend_api_key
```

Optional overrides:

```env
CONTACT_EMAIL=hello@britnova.com
RESEND_FROM="Britnova Contact Form <hello@britnova.com>"
```

`RESEND_FROM` must use a domain verified in your Resend account. The default uses Resend's sandbox sender for development.

## Project structure

```
src/
  components/
    astro/          # Static, non-interactive components
    react/          # Client-side islands (Nav, ContactForm, etc.)
  content/
    work/           # Case study markdown files
    services/       # Service markdown files
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    work/
    services.astro
    about.astro
    contact.astro
    api/contact.ts  # Contact form API route (Resend)
  styles/
    global.css      # Tailwind theme tokens and base styles
public/
  images/
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/work` | Portfolio grid with category filters |
| `/work/[slug]` | Individual case study |
| `/services` | Services overview |
| `/about` | About the agency |
| `/contact` | Contact form and details |

## Content

Case studies and services live in markdown files under `src/content/`. Schemas are defined in `src/content.config.ts`. Edit content there rather than hardcoding copy in page templates.

## Development conventions

- **Static-first** — default to `.astro` components; use React only when client-side state or interaction is required.
- **Hydration** — prefer `client:visible` or `client:idle` over `client:load` for below-the-fold islands.
- **Images** — use Astro's `<Image />` from `astro:assets` for local images.
- **Styling** — Tailwind utility classes only; shared tokens belong in `src/styles/global.css`, not inline hex values.
- **TypeScript** — required for React components and Astro frontmatter with props.

For full agent and contributor guidelines, see [AGENTS.md](./AGENTS.md).

## Deployment

The site is configured for [Vercel](https://vercel.com/) via `@astrojs/vercel`. Set `RESEND_API_KEY` in your Vercel project environment variables for the contact form to send live emails.
