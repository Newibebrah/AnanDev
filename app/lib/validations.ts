import { z } from 'zod';

const urlOrEmpty = z.string().url().optional().or(z.literal('')).default('');

export const projectSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(200),
  content: z.string().min(20),
  thumbnail: urlOrEmpty,
  demoUrl: urlOrEmpty,
  githubUrl: urlOrEmpty,
  techStack: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export const postSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(200).optional(),
  content: z.string().min(20),
  coverImage: urlOrEmpty,
  status: z.enum(['DRAFT', 'PUBLISHED']),
  publishedAt: z.string().datetime().optional(),
});

export const commentSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().optional().or(z.literal('')),
  content: z.string().min(3).max(1000),
});

export const messageSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  content: z.string().min(10).max(5000),
});

export const chatMessageSchema = z.object({
  name: z.string().max(20).default("Anonymous"),
  content: z.string().min(1).max(500),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
