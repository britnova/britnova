/*
 * Technical stack shown on the homepage.
 *
 * TODO: replace — CONFIRM BEFORE LAUNCH. Two different levels of confidence here:
 *
 *   sourced: true   named somewhere in src/content/services/*.md or src/content/work/*.md,
 *                   so it is at least consistent with what the site already claims.
 *   sourced: false  PROPOSED to fill an obvious gap. NOT confirmed by BritNova.
 *                   Correct or delete these before anything ships.
 *
 * Nothing here has been verified against what the team actually uses. Grep
 * `sourced: false` to find every unconfirmed entry.
 */

export interface Tech {
  name: string;
  sourced: boolean;
}

/** Which service each group maps to, by content-collection id. */
export const stackByService: Record<string, Tech[]> = {
  'ai-ml': [
    { name: 'Python', sourced: true }, // work/ai-automation tags
    { name: 'LLM fine-tuning', sourced: true }, // services/ai-ml deliverables
    { name: 'Document parsing', sourced: true }, // services/ai-ml deliverables
    { name: 'Predictive models', sourced: true }, // services/ai-ml deliverables
    { name: 'PyTorch', sourced: false },
    { name: 'Hugging Face', sourced: false },
  ],
  'devops-mlops': [
    { name: 'Terraform', sourced: true }, // services/devops-mlops deliverables
    { name: 'Kubernetes', sourced: true }, // services/devops-mlops deliverables
    { name: 'Prometheus', sourced: true }, // services/devops-mlops deliverables
    { name: 'Grafana', sourced: true }, // services/devops-mlops deliverables
    { name: 'Docker', sourced: false },
    { name: 'GitHub Actions', sourced: false },
  ],
  'web-development': [
    { name: 'React', sourced: true }, // work/ecommerce tags
    { name: 'Next.js', sourced: true }, // work/ecommerce tags
    { name: 'Node.js', sourced: true }, // work/ecommerce tags
    { name: 'GraphQL', sourced: true }, // services/web-development deliverables
    { name: 'REST', sourced: true }, // services/web-development deliverables
    { name: 'TypeScript', sourced: false },
  ],
  'cloud-services': [
    { name: 'AWS', sourced: true }, // services/cloud-services features
    { name: 'Azure', sourced: true }, // services/cloud-services features
    { name: 'GCP', sourced: true }, // services/cloud-services features
    { name: 'Serverless', sourced: true }, // services/cloud-services deliverables
    { name: 'IAM / VPC', sourced: true }, // services/cloud-services body copy
    { name: 'Postgres', sourced: false },
  ],
};

/**
 * The belt shown in the homepage stack section — two marquee rows of icon tiles.
 * Same sourced/unsourced flags as above; `†` renders on unsourced tiles.
 */
export const beltRows: Tech[][] = [
  // languages, web, data & delivery
  [
    { name: 'Python', sourced: true },
    { name: 'TypeScript', sourced: false },
    { name: 'Node.js', sourced: true },
    { name: 'React', sourced: true },
    { name: 'Next.js', sourced: true },
    { name: 'GraphQL', sourced: true },
    { name: 'REST', sourced: true },
    { name: 'Postgres', sourced: false },
    { name: 'Vercel', sourced: true },
    { name: 'Cloudflare', sourced: true },
    { name: 'GitHub Actions', sourced: false },
    { name: 'Prometheus', sourced: true },
    { name: 'Grafana', sourced: true },
  ],
  // cloud, infrastructure & AI
  [
    { name: 'AWS', sourced: true },
    { name: 'Azure', sourced: true },
    { name: 'GCP', sourced: true },
    { name: 'Terraform', sourced: true },
    { name: 'Kubernetes', sourced: true },
    { name: 'Docker', sourced: false },
    { name: 'Serverless', sourced: true },
    { name: 'IAM / VPC', sourced: true },
    { name: 'OpenAI', sourced: false },
    { name: 'Anthropic', sourced: false },
    { name: 'LangChain', sourced: false },
    { name: 'Vector DBs', sourced: false },
    { name: 'MCP', sourced: false },
    { name: 'PyTorch', sourced: false },
    { name: 'Hugging Face', sourced: false },
  ],
];
