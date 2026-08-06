/*
 * Homepage copy for the Why-us, How-we-work and Team sections.
 *
 * NOTE: this belongs in an Astro content collection (see AGENTS.md) once the
 * real copy exists, so non-engineers can edit it without touching layout code.
 * It is a plain module for now because every line is still placeholder.
 *
 * TODO: replace — ALL of this is placeholder. The value props and process
 * steps follow the client's homepage outline (their ChatGPT notes) and are
 * deliberately modest per that outline's own advice — no invented years,
 * client counts or awards. Still: confirm every line before launch.
 *
 * TEAM: no real names or roles are known. The slots below
 * are LAYOUT PLACEHOLDERS ONLY — the role labels are guesses mapped to the
 * four service disciplines. Replace with the real people (and only real
 * people) before anything ships.
 */

export interface WhyUsItem {
  title: string;
  body: string;
}

export const whyUs: WhyUsItem[] = [
  {
    title: 'Experienced engineers',
    body: 'Senior people on every engagement — nobody learns on your budget.',
  },
  {
    title: 'Transparent communication',
    body: 'Direct access to the people building, not an account-manager filter.',
  },
  {
    title: 'Modern technology stack',
    body: 'Current tools, boring where it matters — chosen for longevity, not fashion.',
  },
  {
    title: 'Fast delivery',
    body: 'Small team, short loops, working software early and often.',
  },
  {
    title: 'Scalable architecture',
    body: 'Built to survive growth — in load, in team size, in scope.',
  },
  {
    title: 'Long-term partnership',
    body: 'We stay past launch. The people who build it are the people who run it.',
  },
];

export interface ProcessStep {
  title: string;
  detail: string;
}

export const processSteps: ProcessStep[] = [
  { title: 'Discovery call', detail: '30 minutes on what you actually need — no deck.' },
  { title: 'Requirements & planning', detail: 'Scope, priorities and a plan you can hold us to.' },
  {
    title: 'Architecture & design',
    detail: 'System design before code — decisions on paper first.',
  },
  { title: 'Development', detail: 'Short iterations; something working every week.' },
  { title: 'Testing', detail: 'Automated where it pays, manual where it matters.' },
  { title: 'Deployment', detail: 'Boring, repeatable releases.' },
  { title: 'Ongoing support', detail: 'We run what we build.' },
];

export interface TeamSlot {
  /** TODO: replace — guessed role label, not a real person. */
  role: string;
  /** Discipline the slot maps to, for the placeholder caption. */
  area: string;
}

export const teamSlots: TeamSlot[] = [
  { role: 'Founder', area: 'Direction & delivery' },
  { role: 'Engineering lead', area: 'Architecture & review' },
  { role: 'AI / ML engineer', area: 'Models & pipelines' },
  { role: 'Cloud & DevOps engineer', area: 'Infrastructure & releases' },
];
