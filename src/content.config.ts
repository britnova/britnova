import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    tags: z.array(z.string()),
    client: z.string(),
    year: z.string(),
    featured: z.boolean().default(false),
    metrics: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    features: z.array(z.string()),
    deliverables: z.array(z.string()).optional(),
    process: z.array(z.string()).optional(),
  }),
});

export const collections = { work, services };
