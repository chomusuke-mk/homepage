import { defineCollection, z } from 'astro:content';

const installInstructionSchema = z.object({
  platform: z.string(),
  label: z.string(),
  label_en: z.string().optional(),
  url: z.string().url(),
  icon: z.string().optional(),
});

const projectsCollection = defineCollection({
  type: 'content',
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
