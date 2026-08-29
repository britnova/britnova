# Analytics for britnova.net: Microsoft Clarity, consent, and the free alternatives

**Checked on: 2026-08-29** · **Sources:** primary only (vendor pricing/docs pages, official Astro docs, Microsoft Learn, npm registry, this repo) · **Context:** low-traffic marketing site for a UK agency (Norwich HQ); the question being asked of analytics is "how do prospects move toward the contact form?"

> Pricing, free tiers and consent-enforcement rules change. Re-check every claim below against its cited URL before acting on it. **Nothing here is legal advice** — §2 describes what vendors and regulators publish, not what BritNova's obligations are. A DPO or solicitor should sign off before session replay goes live.

## Verdict

**JUDGEMENT — install Umami Cloud (free Hobby tier) with a custom event on contact-form submit; do not install Clarity unless BritNova is prepared to ship a cookie banner.** The decisive fact is that Clarity's whole value here is session replay and heatmaps, and since **31 October 2025 Microsoft enforces a consent-signal requirement for visitors from the EEA, UK and Switzerland** — which is essentially all of this site's audience. Without a banner and a `clarity('consentv2', …)` call, Clarity still runs but drops to no-consent mode: no cookies, a fresh ID per page view, sessions fragmented per page, and "full session replays and user journey continuity are unavailable" ([Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq), [Consent Mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode)). Since the question is specifically about a *journey* toward the contact form, no-consent Clarity answers precisely the wrong half of it — you'd be paying the cost of a cookie banner (and its opt-out rate) to get back the feature you installed Clarity for. Umami's Hobby tier is $0 for 100K events/month, is cookieless by the vendor's own claim so needs no banner, and ships funnel, journey and goal reports plus — since v3.1/v3.2 — session replay and heatmaps of its own. That gets the funnel answer immediately and keeps replay as a later, consent-gated decision rather than a prerequisite.

The honest tradeoff: Clarity's replay is more mature than Umami's, genuinely free at any volume, and needs no infrastructure. If BritNova is going to build a cookie banner anyway (see §2 — it may be required regardless), Clarity behind that banner is a defensible pick and §4 gives the code for it.

## Verified stack

Read directly from the repo on 2026-08-29. Recorded so this doc rots loudly rather than silently.

| Thing | Value | Where verified |
|---|---|---|
| Astro | `^7.0.6` | `package.json` |
| React / adapter | `react ^19.2.7`, `@astrojs/react ^6.0.1` | `package.json` |
| Deploy target | `@astrojs/netlify ^8.1.1`, live at https://britnova.net | `package.json`, `astro.config.mjs` |
| Tailwind | `^4.3.2` via `@tailwindcss/vite`, CSS-first (no `tailwind.config`) | `package.json`, `astro.config.mjs` |
| Output mode | no explicit `output` → **static** by default | `astro.config.mjs` |
| Only SSR route | `src/pages/api/contact.ts` (`export const prerender = false`) | that file, line 6 |
| Routing model | **MPA** — `ClientRouter` / `astro:transitions` appear nowhere in `src/` or the config | `grep -rn "ClientRouter\|astro:transitions" src/ astro.config.mjs` → no matches |
| Env handling | `astro:env` with `envField`, three **server/secret** vars (`RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM`). No client vars declared yet. | `astro.config.mjs` |
| Head-script precedent | one `<script is:inline define:vars={{ THEME_STORAGE_KEY }}>` for pre-paint theme resolution, first child of `<head>` | `src/layouts/BaseLayout.astro` |
| Contact form | `src/components/react/BriefForm.tsx`, `POST`s to `/api/contact`, sets `status === 'success'` on a 2xx | that file, lines 43–64 |

The MPA finding is load-bearing for §1: every navigation is a full document load, so a head script re-executes on every page with no SPA re-fire problem to solve.

---

## 1. Microsoft Clarity install (FACT)

### 1.1 What Microsoft's own docs say

Clarity offers **three** install routes — third-party platform, manual, and NPM — chosen in **Settings → Setup** of a Clarity project ([How to setup Clarity manually](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)). Each site gets its own tracking code; the same script may be reused across subdomains.

**Placement is unambiguous and it is the head.** The manual-install section opens with a note: *"To set up Clarity, you need access to your website's `<head>` section"*, then step 2: *"Copy the code and paste it into the `<head>` section of your website or web app"* ([same page](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)). There is no end-of-body variant documented. Microsoft's Dynamics 365 Commerce integration guide independently places it in the **HTML Head** slot of the page template ([Set up Microsoft Clarity in Dynamics 365 Commerce](https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/set-up-clarity)).

Verification, per the same doc: watch for `POST` requests to `https://www.clarity.ms/collect` in the Network tab, and check the project dashboard for live users.

Also from the setup page, worth noting before adoption:
- *"Clarity shouldn't be used on any websites/apps targeting users under the age of 18 globally."*
- *"By default, Clarity masks all sensitive content on your site."*
- Clarity *"can't capture what's inside your website's Canvas or third-party iFrame elements."*

**UNVERIFIED — the exact snippet bytes.** Microsoft does not publish the literal tracking snippet in its docs; it is generated per project and only shown in the portal behind **Settings → Setup → Install manually → Get tracking code** ([setup doc](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)). Confirmed from primary sources is only the *shape*: an inline `<script>` containing an IIFE that appends an async `<script>` pointing at a `clarity.ms` tag URL carrying the project ID, and that the collect endpoint is `https://www.clarity.ms/collect`. The Dynamics guide additionally requires `https://www.clarity.ms` on the `script-src`, `connect-src` and `child-src` CSP directives, which corroborates the host. **Copy the real snippet from the portal — do not retype the one in §4 from memory.**

### 1.2 The right Astro 7 directive — and why

Astro's default `<script>` processing is not what you want for a third-party tag. By default Astro treats scripts as TypeScript, resolves and **bundles** imports, converts them to `type="module"`, and deduplicates them across component instances ([Client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/)).

`is:inline` opts out of all of that. Per the [directives reference](https://docs.astro.build/en/reference/directives-reference/), an `is:inline` script:

- *"Will not be bundled into an external file"* — so `defer`/`async` semantics for an external file no longer apply;
- *"Will not be deduplicated—the element will appear as many times as it is rendered"*;
- *"Will not have its `import`/`@import`/`url()` references resolved relative to the `.astro` file"*;
- *"Will be rendered in the final output HTML exactly where it is authored."*

Two further mechanics matter here:

1. **`is:inline` is implied automatically.** *"The `is:inline` directive is implied whenever any attribute other than `src` is used on a `<script>` or `<style>` tag"* ([directives reference](https://docs.astro.build/en/reference/directives-reference/)).
2. **`define:vars` implies `is:inline`.** *"Using `define:vars` on a `<script>` tag implies the `is:inline` directive, which means your scripts won't be bundled and will be inlined directly into the HTML"* — because a bundled script runs once per page regardless of instance count, whereas `define:vars` needs it to re-run per value set ([directives reference](https://docs.astro.build/en/reference/directives-reference/)).

**JUDGEMENT — use `<script is:inline>`, in `<head>`, in `BaseLayout.astro`.** Reasons: (a) the Clarity snippet is opaque vendor code that must reach the browser byte-for-byte, and bundling would rewrite it as an ES module and risk mangling the IIFE's `document.getElementsByTagName('script')[0]` insertion trick; (b) Microsoft's install instruction is literally "paste into `<head>`", and `is:inline` is the only directive that guarantees *"rendered in the final output HTML exactly where it is authored"*; (c) it matches the file's existing convention — the theme script is already `is:inline` with a comment explaining exactly this reasoning; (d) passing the project ID through `define:vars` implies `is:inline` anyway, so the two choices collapse into one.

Astro 7 changes nothing here. The [v7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/) lists a Rust compiler (unclosed tags now error, invalid HTML no longer auto-corrected), `compressHTML` defaulting to `'jsx'`, Sätteri replacing remark/rehype for Markdown, `src/fetch.ts` becoming reserved, and Vite 8 — no changes to `<script>` handling, `is:inline`, `define:vars` or `astro:env`. The stricter compiler is a mild argument *for* `is:inline`: a vendor snippet with sloppy markup around it now errors rather than being silently fixed.

### 1.3 Partytown — available, but not the right tool here (FACT + JUDGEMENT)

`@astrojs/partytown` is **still officially maintained**, documented at v2.1.7 with no deprecation or maintenance-mode notice on the [official integration page](https://docs.astro.build/en/guides/integrations-guide/partytown/). It relocates *"resource intensive scripts into a web worker, and off of the main thread"*, and Astro does recommend it for analytics.

**JUDGEMENT — skip it.** It adds a service worker, a proxying layer (`config.resolveUrl()`), and `config.forward` plumbing for any `window` global the script sets. Clarity's whole mechanism is DOM mutation observation and it exposes `window.clarity(...)` as its API surface — both of which fight a web-worker relocation. For a low-traffic marketing site the main-thread cost of one async analytics tag is not the bottleneck worth this complexity. Reach for Partytown when a Lighthouse trace actually indicts the tag.

### 1.4 MPA vs SPA (FACT, verified in repo)

`ClientRouter` and `astro:transitions` do not appear anywhere in `src/` or `astro.config.mjs`. Every navigation on britnova.net is a full document load, so a `<head>` script re-executes naturally on each page. **Nothing extra is needed** — no `astro:page-load` listener, no re-init, no manual pageview call.

For the record, were `ClientRouter` ever added: an `is:inline` head script would *not* re-run on client-side navigations, and the standard fix is to re-fire on the `astro:page-load` event that the View Transitions router emits. Worth a comment in the code so a future ClientRouter migration doesn't silently break tracking.

### 1.5 The npm package (FACT + JUDGEMENT)

`@microsoft/clarity` is genuinely official — published under the Microsoft scope, MIT licensed, **v1.0.2 published 2025-11-27**, homepage `clarity.microsoft.com` (verified via the [npm registry API](https://registry.npmjs.org/@microsoft/clarity); the [package page](https://www.npmjs.com/package/@microsoft/clarity) returns 403 to automated fetches). Its API: `Clarity.init(projectId)`, plus `Clarity.identify()`, `Clarity.setTag()` and custom events. The underlying library is open source at [github.com/microsoft/clarity](https://github.com/microsoft/clarity) (MIT, ~2.7k stars, last pushed 2026-08-26).

**JUDGEMENT — use the raw snippet, not the package, for this site.** The package's advantage is typed calls from application code, which pays off in an SPA where you call `identify()` per route. Here it would mean bundling a dependency into the client, and needing a React island or a bundled script to run `init()` — which pushes the tag out of `<head>` and later into the page lifecycle than the head snippet, for no gain. The snippet is one `is:inline` block and zero dependencies.

---

## 2. UK GDPR / PECR and session replay (FACT, plus a clearly-marked risk read)

**Not legal advice.** What follows is what Microsoft, the ICO and the vendors publish.

### 2.1 What Clarity actually collects and stores

- **Cookies.** Clarity sets first-party `_clck` (persists the Clarity user ID) and `_clsk` (stitches page views into one session recording), plus third-party `CLID`, `ANONCHK`, `MR`, `MUID`, `SM` on Microsoft domains — `MUID` explicitly *"used for advertising, site analytics, and other operational purposes"* ([Clarity Cookies](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies)). Microsoft's own framing: *"Clarity's typical usage requires that non-essential cookies are set on your visitor's browser… As a website publisher, you may be subject to privacy laws that require obtaining user consent before setting cookies or collecting personal data."*
- **Retention.** *"The data is retained for the webmaster's consumption up to 30 days from the time of recording"*; recordings are 30 days, but *"Favorite recordings and randomly selected sample of recordings are retained for up to 9 months"*, and labels up to 9 months ([Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq)).
- **Where processed.** *"Your data is stored in the Microsoft Azure cloud service."* No region guarantee is published on that page ([Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq)) — if data residency matters, that is a question for Microsoft, not something the docs answer.
- **Controller role.** *"Clarity is GDPR-compliant as a data controller"* ([Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq)). **JUDGEMENT:** read that carefully — Microsoft positions itself as a *controller*, not a processor acting on BritNova's instructions. That is a materially different arrangement from a typical processor DPA and is worth a look from whoever owns BritNova's privacy notice.
- **Geolocation.** *"Clarity uses IP address-based geolocation to determine user location. Consent should be obtained for users in the EEA, UK, and Switzerland. Consult your privacy team for specific requirements"* ([Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq)).
- **Masking.** Sensitive content is masked by default; input-box content is masked in **all** modes and *"can't be customized"*. Masked data is not uploaded. Style sheets and style tags are **not** masked ([Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq), [client API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api)). Relevant here: `BriefForm.tsx` collects name, email, service and message — input content is masked by default, but this is exactly the surface to verify by hand before trusting it.

### 2.2 Microsoft's own consent position

The headline, repeated verbatim across the setup, cookies, consent-mode and consent-API pages:

> *"Starting October 31, 2025, Clarity begins enforcing consent signal requirements for page visits originating from the European Economic Area (EEA), United Kingdom (UK), and Switzerland (CH). A valid consent signal is required to ensure full functionality of Clarity features for users in these regions."*

Key mechanics, all from [Consent Mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode) and the [ConsentV2 API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2):

- **Default for UK visitors is already consent-gated.** *"Consent Mode is enabled by default for all users originating from the European Economic Area (EEA), United Kingdom (UK), and Switzerland (CH)."* Once enabled, *"Clarity waits for a valid consent signal before setting any cookies."*
- **The current API is `consentv2`.** V1 (`window.clarity('consent')`) *"is planned for deprecation and should no longer be used"*:
  ```javascript
  window.clarity('consentv2', {
     ad_Storage: "granted | denied",
     analytics_Storage: "granted | denied"
  });
  ```
  Both parameters are required strings.
- **Denied is not "off".** *"If consent is not granted, Clarity assigns a unique ID per page view and does not use cookies to persist session data."* The script still loads and `/collect` still fires — it runs in "no-consent mode (with limited tracking)".
- **Revocation.** `clarity("consent", false)` clears Clarity's cookies and *"prevent[s] further tracking until new consent is granted"*. On rejection Clarity *"deletes any existing cookie for the website, ends the current session, and restarts tracking in no-consent mode"*, and that mode persists across future visits.
- **Verification** (paste in the console): `clarity('metadata', (d, upgrade, consent) => { console.log('consentStatus:', consent); }, false, true, true);` — expect `{analytics_storage: "DENIED", ad_storage: "DENIED"}` pre-consent, and no `_clck` / `_clsk` cookies.
- **Whose users, not whose office.** *"Your location is not relevant. The impact depends on where your users originate"* ([FAQ](https://learn.microsoft.com/en-us/clarity/faq)). Norwich HQ is beside the point; UK/EEA *visitors* are the trigger — and for this site that is the whole audience.
- Microsoft is careful to say that not obtaining consent *"does not violate any terms"* of Clarity — it only degrades the product. **JUDGEMENT:** that is a statement about Microsoft's contract with BritNova, not about UK law. It should not be read as permission to skip a banner.

Clarity integrates with [CookieYes](https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-cmps) today, with more CMPs and Google Consent Mode support described as "coming soon".

### 2.3 Is a banner required? (JUDGEMENT, grounded in cited facts)

The regime that bites first is **PECR**, not UK GDPR: PECR regulates storing information on, or accessing information from, a user's device. Clarity's cookies are described by Microsoft itself as **non-essential** ([Clarity Cookies](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies)), and non-essential storage requires prior opt-in consent — there is no legitimate-interests route out of PECR the way there is under GDPR. So: **on the published facts, yes — a banner is required before Clarity's cookies are set, and the practical pattern is to gate the whole script behind consent.**

Two things stack on top, and this is where the real risk sits:

1. **Session replay is not "just analytics".** Recording mouse movement, scrolling, clicks and page content is behavioural personal data processing under UK GDPR *independently* of whether a cookie is involved. Going cookieless removes the PECR trigger; it does not by itself remove the need for a lawful basis, a privacy-notice entry, and a defensible answer on data minimisation.
2. **Masking is a control you must verify, not assume.** Input content is masked by default and style content is never masked — so any sensitive value rendered outside an input (a confirmation screen echoing an email, say) can leave the site.

**JUDGEMENT on implementation:** do not merely call `consentv2('denied')` and leave the tag loaded. The cleanest and most defensible pattern is to not inject the Clarity script at all until consent exists, and call `consentv2` with `granted` immediately after. That way pre-consent there is no `/collect` traffic to explain. §4.3 shows this.

---

## 3. Free alternatives compared (FACT)

Every figure below comes from the named vendor's own pricing or docs page, fetched 2026-08-29.

| Tool | Free tier (vendor's own words) | Retention (free) | Banner needed? (vendor claim) | Session replay | Heatmaps | Ops burden / self-host cost |
|---|---|---|---|---|---|---|
| **Microsoft Clarity** | *"100% free - forever… No credit card"*; *"no traffic limits"* | 30 days; favourites + a random sample up to 9 months | **Yes** — consent enforced for UK/EEA/CH since 31 Oct 2025 | **Yes** (the main draw) | **Yes** | None (hosted); data in Azure |
| **Plausible Cloud** | **No free tier** — 30-day trial only, "no credit card required" | 3 yrs (Starter/Growth), 5 yrs (Business) | **No** — *"No cookie banner required"* | No | No | None; from **$9/mo** (10k pageviews, 1 site) |
| **Plausible CE (self-host)** | *"Plausible CE is free to self-host"*, AGPLv3 | your DB | **No** (same cookieless claim) | No | No | **High.** *"You are responsible for installation, maintenance, upgrades, server capacity, uptime, backup, security…"*; long-term release twice a year; funnels, journeys, ecommerce goals, SSO and sites API are **excluded** from CE |
| **Umami Cloud (Hobby)** | **$0** — *"Up to 100K events per month"* | **6 months** | **No** — *"you can use Umami without a cookie consent banner"* | **Yes** (v3.1.0+) | **Yes** (v3.2.0+) | None. Next tier $20/mo (1M events, 2yr); $200/mo (10M, 5yr) |
| **Umami (self-host)** | Free, MIT licensed | your DB | **No** (same claim) | Yes | Yes | Moderate — Node + Postgres/MySQL you run. Cloud-only extras: email reports, streaming API |
| **Cloudflare Web Analytics** | *"Free website analytics"*, *"Available on all plans"*; JS beacon works on any site (no proxying required) | **6 months**; unsampled only 7 days, then aggregated to ~10% | **No** — *"does not use any client-side state, such as cookies or localStorage"*; *"we don't 'fingerprint' individuals"* | **No** | **No** | None. Soft limit ~10 sites/account |
| **Netlify Web Analytics** | **Ambiguous — see note** | 1 day (Free/Personal), 7 days (Pro), 30 days (Enterprise) | Server-side collection, *"complies with… GDPR"*; no cookie claim published | **No** | **No** | None (already the host) |
| **PostHog** | 1M analytics events, **5K session replays**, 1M feature-flag requests /mo. *"Usage stops at the free tier limits, so you can't be charged by surprise"* | **1 year**, 1 project | **Yes in practice** — cookie-based by default | **Yes** | Yes (toolbar) | None (cloud); self-host exists but is heavy |
| **Google Analytics 4** | Free (standard property) | **2 or 14 months** user- and event-level; age/gender/interest always 2 months; Google-signals max 26 months | **Yes** — `_ga` cookie lasts **2 years**, `_gid` 24 hours | No | No | None; consent-mode plumbing required |
| **Matomo Cloud** | **No free tier** — trial only, *"You don't need a credit card for the free trial"* | per plan | Configurable; cookieless mode exists | Paid plugin | Paid plugin | None; from **€29/mo** (50k hits) |
| **Matomo On-Premise** | Community Edition *"free forever with unlimited users and hits"*, GPL-3.0 | your DB | Configurable | **Paid add-on** | **Paid add-on** | **High** — PHP + MySQL you run. Heatmap & Session Recording plugin **€219/yr** (1–4 users) |

Sources, in table order: [Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq) and [Clarity pricing](https://clarity.microsoft.com/pricing) · [Plausible pricing](https://plausible.io/#pricing), [Plausible self-hosted](https://plausible.io/self-hosted-web-analytics), [Plausible privacy](https://plausible.io/privacy-focused-web-analytics) · [Umami pricing](https://umami.is/pricing) (tier figures read from the page's own bundle; the rendered page is client-side), [Umami Cloud FAQ](https://docs.umami.is/docs/cloud/faq), [Umami Replays](https://docs.umami.is/docs/replays), [Umami Heatmaps](https://docs.umami.is/docs/heatmaps), [umami-software/umami](https://github.com/umami-software/umami) (MIT) · [Cloudflare Web Analytics](https://www.cloudflare.com/en-gb/web-analytics/), [Cloudflare WA docs](https://developers.cloudflare.com/web-analytics/), [Cloudflare WA FAQ](https://developers.cloudflare.com/web-analytics/faq/) · [Netlify pricing](https://www.netlify.com/pricing/), [Netlify Web Analytics overview](https://docs.netlify.com/manage/monitoring/web-analytics/overview/), [Netlify usage and billing](https://docs.netlify.com/manage/monitoring/web-analytics/usage-and-billing/) · [PostHog pricing](https://posthog.com/pricing) · [GA4 data retention](https://support.google.com/analytics/answer/7667196?hl=en), [Google ads/measurement cookies](https://business.safety.google/adscookies/), [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent) · [Matomo pricing](https://matomo.org/pricing/), [Heatmap & Session Recording plugin](https://plugins.matomo.org/HeatmapSessionRecording), [matomo-org/matomo](https://github.com/matomo-org/matomo) (GPL-3.0).

### Notes that don't fit in a table

**Netlify Analytics — the pricing story is genuinely contradictory right now, so verify in-app before assuming either.** Netlify's billing doc says it is a paid add-on billed by traffic: *"Web Analytics pricing is impacted by the number of pageviews for your project. Monthly fees are charged in advance… Fees will be prorated if you enable the add-on in the middle of a billing cycle"* ([usage and billing](https://docs.netlify.com/manage/monitoring/web-analytics/usage-and-billing/)) — but it gives **no price**, deferring to the pricing page. The [pricing page](https://www.netlify.com/pricing/) in turn lists "Web Analytics & Real User Monitoring" as a plan feature differentiated only by retention window (1 day Free/Personal, 7 days Pro, 30 days Enterprise) and shows no standalone analytics line item. The historical **$9/month per site** add-on figure appears only in a [2019 Netlify blog post](https://www.netlify.com/blog/2019/07/10/netlify-analytics-accurate-insights-without-performance-impacts/) and Netlify has since moved Pro to [credit-based tiers](https://www.netlify.com/changelog/2026-07-14-pro-plan-credit-tiers/). **Treat the current price as unverified.** Either way it is disqualified for this use case: no replay, no heatmaps, and 1-day retention on the plans BritNova would plausibly be on.

**Umami has quietly closed the replay/heatmap gap** — this is the finding that changes the recommendation. Replays landed in [v3.1.0](https://github.com/umami-software/umami/releases/tag/v3.1.0) (*"built on rrweb and works alongside your existing tracker"*), heatmaps in v3.2.0. Enabled per-site under **Websites → Edit → Replays & Heatmaps**, with a second script tag (`recorder.js`) alongside the tracker. Defaults per the [docs](https://docs.umami.is/docs/replays): sample rate `0.15`, mask level `moderate` (masks input fields; `strict` masks inputs and all text), max duration `300000`ms, plus a block-selector for excluding elements. **Replays are stored for 30 days.** The release notes contain no statement restricting these to Cloud, and the docs' own examples use a `localhost:3000` origin, which indicates self-host support — but I found no explicit first-party sentence confirming "available self-hosted", so **treat self-hosted replay as very likely but not formally verified**.

**Umami's cookieless and GDPR claims, verbatim** (from the FAQ structured data on [umami.is/pricing](https://umami.is/pricing)): *"Umami does not use cookies or collect any personally identifiable information. This means you can use Umami without a cookie consent banner"*, and *"Umami Cloud servers are located in the US and EU and adhere to GDPR and CCPA regulations."* **JUDGEMENT:** the US/EU split matters if data residency is a concern, and — as in §2.3 — a vendor's "no banner needed" claim covers *their* cookie usage, not BritNova's overall lawful-basis position for recording sessions.

**PostHog** is the closest thing to a Clarity replacement with a real free tier (1M events + 5K replays + 1yr retention), and its hard stop at the free ceiling is a genuinely nice property. **JUDGEMENT:** it is a product-analytics platform aimed at applications, and its default identification is cookie-based, so it lands in the same consent bucket as Clarity while being considerably more machinery than a five-page marketing site needs.

**Plausible and Matomo self-hosting are both false economies at this scale.** Plausible's own page is blunt: *"You need to get a server and you need to manage your infrastructure… installation, maintenance, upgrades, server capacity, uptime, backup, security, stability, consistency, loading time"*, adding that *"Self-hosting works well when you treat your instance as infrastructure you maintain, not software you install once."* A VPS plus the hours to run it exceeds Umami Cloud's $0 immediately. Worse for the goal at hand: **funnels and user journeys are explicitly excluded from Plausible CE**, which are the exact reports this project wants.

---

## 4. Recommendation (JUDGEMENT — with FACT-checked code)

### 4.1 The pick, and the tradeoff stated honestly

**Install Umami Cloud (Hobby, $0) with a `contact_submit` custom event. Hold Clarity in reserve.**

The reasoning, in order of weight:

1. **The stated goal is a funnel, and consent-less Clarity cannot render a funnel.** Without consent, Clarity assigns *"a unique ID per page view"* and treats page A → page B as two separate sessions ([FAQ](https://learn.microsoft.com/en-us/clarity/faq)). For a UK-visitor site post-31-Oct-2025, that is the default state.
2. **Zero consent burden gets data flowing this week.** Umami's cookieless claim means no banner to design, build, test and maintain — and no opt-out rate silently eating the sample.
3. **Umami answers the actual question directly.** Goals, Funnel, Journey and Retention reports plus custom events, so "how many people who hit `/services` reach `/contact` and submit?" is a report, not an inference.
4. **The free tier is comfortably oversized here.** 100K events/month with 6-month retention, on a five-page marketing site.
5. **Replay stays available later** without switching vendors, since Umami now ships it — but as a deliberate, separately-consented decision rather than a precondition.

**The honest counter-argument.** Clarity's replay and heatmaps are more mature than Umami's newer implementation, are unlimited and free at any traffic level, and Microsoft is not going to disappear. If BritNova needs a cookie banner anyway for other reasons, or if watching real prospects hesitate over the brief form is worth more than a clean funnel, then **Clarity behind a consent gate is the better pick** and §4.3 is the code. What is *not* defensible is installing Clarity without a banner and assuming it works — that combination gets you the compliance exposure of session replay and the analytical value of a page-view counter.

**Do first, whichever tool wins:** add an analytics/cookies section to the privacy notice, and manually verify masking against `BriefForm.tsx` before any replay tool records the contact page.

### 4.2 Recommended: Umami, matching this repo's conventions

**Step 1 — declare the public client vars.** `astro.config.mjs` already uses `envField`, but only for `context: 'server', access: 'secret'`. A client-side ID needs `context: 'client', access: 'public'`, which per the [environment variables guide](https://docs.astro.build/en/guides/environment-variables/) *"end up in both your final client and server bundles, and can be accessed from both client and server through the `astro:env/client` module."* Add to the existing `env.schema`, leaving the three server vars untouched:

```js
// astro.config.mjs — inside env.schema, alongside the existing server vars
PUBLIC_UMAMI_WEBSITE_ID: envField.string({
  context: 'client',
  access: 'public',
  optional: true, // absent in local dev → tag is not rendered
}),
PUBLIC_UMAMI_SRC: envField.string({
  context: 'client',
  access: 'public',
  default: 'https://cloud.umami.is/script.js',
}),
```

`optional: true` on the ID is deliberate: it lets `astro build` succeed locally without the variable and gives the layout a clean "don't render the tag" signal.

**Step 2 — render the tag in `BaseLayout.astro`.** Umami's tracker is a plain external `src` script with data attributes, so there is no inline code to preserve. `is:inline` is still the correct directive because [per the directives reference](https://docs.astro.build/en/reference/directives-reference/) it *"is implied whenever any attribute other than `src` is used"* — the `data-website-id` attribute triggers it regardless, so writing it explicitly just makes the intent legible next to the theme script.

In the frontmatter, next to the existing imports:

```astro
import { PUBLIC_UMAMI_WEBSITE_ID, PUBLIC_UMAMI_SRC } from 'astro:env/client';
```

In `<head>`, after the meta tags (analytics has no pre-paint requirement, unlike the theme script which must stay first):

```astro
{
  /*
    Umami — cookieless analytics, so no consent gate (vendor claim:
    https://umami.is/pricing FAQ). `is:inline` keeps the vendor tag
    verbatim and unbundled; it's implied by data-* anyway. This is an
    MPA (no ClientRouter), so the tag re-fires on every navigation with
    no re-init needed — revisit if View Transitions are ever added.
  */
}
{
  PUBLIC_UMAMI_WEBSITE_ID && (
    <script is:inline defer src={PUBLIC_UMAMI_SRC} data-website-id={PUBLIC_UMAMI_WEBSITE_ID} />
  )
}
```

**Step 3 — fire the conversion event.** `BriefForm.tsx` already has the exact hook: `setStatus('success')` at line 54, after a 2xx from `/api/contact`. Add beside it:

```ts
setStatus('success');
window.umami?.track('contact_submit', { service });
```

with the minimal ambient type (project convention is `src/utils/`, or a `src/env.d.ts` global):

```ts
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}
```

The optional chaining matters — the tag is absent in dev and blocked by some ad blockers, and neither should throw inside the submit handler.

Set `PUBLIC_UMAMI_WEBSITE_ID` in Netlify's environment variables for the production context only, so preview deploys and local dev stay out of the data.

### 4.3 If Clarity is chosen instead: the consent-gated pattern

Only if BritNova ships a cookie banner. Declare `PUBLIC_CLARITY_PROJECT_ID` exactly as in §4.2, then in `BaseLayout.astro`'s `<head>`:

```astro
{
  /*
    Microsoft Clarity, gated on consent. Deliberately NOT loaded until the
    visitor opts in: Clarity's cookies are non-essential by Microsoft's own
    description, and consent is enforced for UK/EEA/CH visitors since
    2025-10-31. Loading the tag and passing consentv2:"denied" would still
    hit /collect pre-consent; not injecting it at all is cleaner to defend.
    https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
    `is:inline` (implied by define:vars) keeps the vendor IIFE verbatim.
  */
}
<script is:inline define:vars={{ CLARITY_ID: PUBLIC_CLARITY_PROJECT_ID, CONSENT_STORAGE_KEY }}>
  (function () {
    if (!CLARITY_ID) return;

    function loadClarity() {
      if (window.clarity) return;
      // >>> REPLACE THIS BLOCK with the exact snippet from
      // Clarity → Settings → Setup → Install manually → Get tracking code.
      // Microsoft does not publish the literal bytes in its docs; do not
      // retype them from memory. Keep the CLARITY_ID substitution.
      // <<<
      window.clarity('consentv2', {
        ad_Storage: 'denied',
        analytics_Storage: 'granted',
      });
    }

    let consent = null;
    try {
      consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
      /* noop — treat as no consent */
    }
    if (consent === 'granted') loadClarity();

    // Banner dispatches this on accept; see §2.2 for Microsoft's own
    // event-listener example.
    window.addEventListener('consentGranted', loadClarity);
  })();
</script>
```

Notes on the above, each traceable to §2.2: `consentv2` is the current API and V1 *"should no longer be used"*; both `ad_Storage` and `analytics_Storage` are required strings; `analytics_Storage: 'granted'` with ads denied is a documented, supported combination. For revocation the banner should call `window.clarity('consent', false)`, which per the ConsentV2 doc *"clears the Clarity cookies from the user's browser and prevent[s] further tracking until new consent is granted"*. Verify with the console snippet in §2.2 and confirm no `_clck` / `_clsk` cookies exist pre-consent.

The `localStorage` read is wrapped in `try/catch` deliberately, matching the existing theme script's handling in the same file.

---

## Risks and caveats

- **The exact Clarity snippet is not in this document and could not be sourced from a first-party page.** It is portal-generated per project. §4.3 leaves an explicit placeholder rather than a guessed reconstruction.
- **Netlify Analytics pricing is contradictory across Netlify's own pages** (add-on billed by pageviews per the docs; a bundled per-plan feature per the pricing page; $9/site only in a 2019 blog post). Unresolved — verify in the Netlify UI. Immaterial to the recommendation either way.
- **Umami self-hosted replay/heatmap availability is inferred, not stated.** The docs' localhost examples and the absence of any Cloud-only disclaimer point that way; no explicit first-party sentence confirms it.
- **Umami Cloud Hobby tier figures were read out of the pricing page's JavaScript bundle**, because [umami.is/pricing](https://umami.is/pricing) renders client-side and returns no prices to a plain fetch. The $0 Hobby plan itself is separately confirmed in the [Cloud FAQ](https://docs.umami.is/docs/cloud/faq). Re-verify the 100K/6-month figures in a browser before relying on them.
- **"No cookie banner required" is in every case the vendor's own marketing claim**, not a regulator's ruling, and it addresses that vendor's cookie usage rather than BritNova's overall lawful basis — particularly for session recording, which is personal-data processing whether or not a cookie is involved.
- **Clarity's data residency is unspecified** beyond "the Microsoft Azure cloud service", and Microsoft describes itself as a **controller**, not a processor. Both warrant a look if a client contract imposes data-processing terms on BritNova.
- **Consent enforcement is described by Microsoft as likely to widen**: *"enforcement may extend to other regions in the future."*
- **Astro 7's stricter Rust compiler errors on unclosed tags and no longer auto-corrects invalid HTML** ([v7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/)). Pasted vendor markup that previously passed silently may now fail the build — a reason to keep third-party snippets inside a single well-formed `<script is:inline>`.
- **No code in this repo was modified.** This document is research only; nothing was installed and no analytics tag was added.
