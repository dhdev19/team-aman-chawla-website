import { z } from "zod";

/**
 * Video creation/update validation schema
 */
export const videoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  videoLink: z
    .string()
    .url("Invalid video URL")
    .refine(
      (url) => {
        // Validate YouTube or Vimeo URLs
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
        return youtubeRegex.test(url) || vimeoRegex.test(url);
      },
      {
        message: "Video link must be a valid YouTube or Vimeo URL",
      }
    ),
  thumbnail: z.string().url("Invalid thumbnail URL").optional().nullable(),
  description: z.string().max(1000, "Description is too long").optional().nullable(),
  order: z.number().int().min(0, "Order must be non-negative").default(0).optional(),
});

export type VideoFormData = z.infer<typeof videoSchema>;
