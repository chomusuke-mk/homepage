import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const installInstructionSchema = z.object({
  platform: z.string(),
  label: z.string(),
  label_en: z.string().optional(),
  url: z.string().url(),
  icon: z.string().optional(),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    description: z.string(),
    description_en: z.string().optional(),
    techStack: z.array(z.string()),
    githubLink: z.string().url(),
    liveLink: z.string().url(),
    downloadLink: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    bentoSpan: z.string().optional(),
    installInstructions: z.array(installInstructionSchema).optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};
