import { z } from "zod";

// BlogType enum - matches Prisma schema
const BlogType = {
  TEXT: "TEXT",
  VIDEO: "VIDEO",
} as const;

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
 * YouTube URL validation schema
 */
const youtubeUrlSchema = z
  .string()
  .url("Invalid YouTube URL")
  .refine(
    (value) => {
      // Check if it's a valid YouTube URL
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return youtubeRegex.test(value);
    },
    { message: "Must be a valid YouTube URL" }
  )
  .optional()
  .nullable();

/**
 * Blog creation/update validation schema
 */
export const blogSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(200, "Slug is too long")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, hyphens only)"),
    type: z.nativeEnum(BlogType, {
      errorMap: () => ({ message: "Invalid blog type" }),
    }),
    content: z.string().min(100, "Content must be at least 100 characters"),
    excerpt: z.string().max(500, "Excerpt is too long").optional().nullable(),
    image: imageUrlSchema,
    videoUrl: youtubeUrlSchema,
    videoThumbnail: imageUrlSchema,
    published: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // If type is TEXT, image should be provided (or can be null)
      // If type is VIDEO, videoUrl should be provided
      if (data.type === BlogType.VIDEO) {
        return !!data.videoUrl;
      }
      return true;
    },
    {
      message: "Video URL is required for video blogs",
      path: ["videoUrl"],
    }
  );

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
