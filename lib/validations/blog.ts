import { z } from "zod";

/**
 * Shared image URL schema that supports both absolute and app-relative URLs.
 * This is needed because uploaded images are served from `/uploads/...`.
 */
const imageUrlSchema = z
  .string()
  .refine(
    (value) =>
      // Allow absolute URLs
      /^https?:\/\//.test(value) ||
      // And app-relative URLs like `/uploads/xyz.jpg`
      value.startsWith("/"),
    { message: "Invalid image URL" }
  )
  .optional()
  .nullable();

/**
 * Blog creation/update validation schema
 */
export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, hyphens only)"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  excerpt: z.string().max(500, "Excerpt is too long").optional().nullable(),
  image: imageUrlSchema,
  published: z.boolean().default(false),
});

export type BlogFormData = z.infer<typeof blogSchema>;

/**
 * Blog filter schema
 */
export const blogFilterSchema = z.object({
  search: z.string().optional(),
  published: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export type BlogFilterData = z.infer<typeof blogFilterSchema>;
