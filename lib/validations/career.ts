import { z } from "zod";

// ReferralSource enum - matches Prisma schema
const ReferralSource = {
  FAMILY_FRIENDS: "FAMILY_FRIENDS",
  WEBSITE: "WEBSITE", 
  YOUTUBE: "YOUTUBE",
  ADVERTISEMENT: "ADVERTISEMENT",
  OTHER: "OTHER",
} as const;

/**
 * Career application validation schema
 */
export const careerApplicationSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    whatsappNumber: z
      .string()
      .min(1, "WhatsApp number is required")
      .regex(/^[6-9]\d{9}$/, "Invalid WhatsApp number (10 digits starting with 6-9)"),
    city: z.string().min(1, "City is required").max(100, "City name is too long"),
    referralSource: z.nativeEnum(ReferralSource, {
      errorMap: () => ({ message: "Please select how you came to know about us" }),
    }),
    referralOther: z.string().max(200, "Other source description is too long").optional().nullable(),
    resumeLink: z
      .string()
      .min(1, "Resume link is required")
      .url("Please provide a valid URL for your resume")
      .refine(
        (url) => {
          // Check if it's a Google Drive, Dropbox, or other cloud storage link
          const allowedDomains = [
            'drive.google.com',
            'docs.google.com',
            'dropbox.com',
            'onedrive.live.com',
            'sharepoint.com',
            'box.com',
            'mega.nz',
            'mediafire.com',
          ];
          try {
            const urlObj = new URL(url);
            return allowedDomains.some(domain => urlObj.hostname.includes(domain));
          } catch {
            return false;
          }
        },
        { message: "Please provide a valid cloud storage link (Google Drive, Dropbox, etc.)" }
      ),
  })
  .refine(
    (data) => {
      // If referralSource is OTHER, referralOther must be provided
      if (data.referralSource === ReferralSource.OTHER) {
        return !!data.referralOther && data.referralOther.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify how you came to know about us",
      path: ["referralOther"],
    }
  );

export type CareerApplicationFormData = z.infer<typeof careerApplicationSchema>;

/**
 * Career application filter schema for admin
 */
export const careerApplicationFilterSchema = z.object({
  search: z.string().optional(),
  referralSource: z.nativeEnum(ReferralSource).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CareerApplicationFilterData = z.infer<typeof careerApplicationFilterSchema>;

export { ReferralSource };