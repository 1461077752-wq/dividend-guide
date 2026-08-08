import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    modDate: z.coerce.date().optional(),
    category: z.string().default('General'),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    author: z.string().default('Henry Zhou'),
    authorRole: z.string().default('Independent Dividend Researcher'),
    review: z.string().default('Facts, data sources, and calculations personally verified by the author'),
    reviewDate: z.coerce.date().optional(),
    dataAsOf: z.string().optional(),
    methodology: z.string().optional(),
    sources: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      accessed: z.coerce.date().optional(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

const articleTranslations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/translations/zh/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { articles, articleTranslations };
