import { z } from "zod";
import { PropertyType, PropertyStatus, PropertyFormat } from "@prisma/client";

/**
 * Shared image URL schema that supports both absolute and app-relative URLs.
 * This is needed because uploaded images are served from `/uploads/...`.
 */
const imageUrlSchema = z
  .string()
  .min(1, "Image URL is required")
  .refine(
    (value) =>
      // Allow absolute URLs
      /^https?:\/\//.test(value) ||
      // And app-relative URLs like `/uploads/xyz.jpg`
      value.startsWith("/"),
    { message: "Invalid image URL" }
  );

/**
 * Property Configuration schema
 */
export const propertyConfigurationSchema = z.object({
  configType: z.string().min(1, "Configuration type is required"),
  customConfigType: z.string().max(100, "Custom type is too long").optional().nullable(),
  carpetAreaSqft: z
    .number()
    .positive("Carpet area must be positive")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  price: z
    .number()
    .positive("Price must be positive")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  floorPlanImage: imageUrlSchema.optional().nullable(),
});

export type PropertyConfigurationData = z.infer<typeof propertyConfigurationSchema>;

/**
 * Property creation/update validation schema
 */
export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required").max(200, "Name is too long"),
  slug: z
    .string()
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, hyphens only)")
    .optional()
    .nullable(),
  type: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: "Invalid property type" }),
  }),
  format: z.nativeEnum(PropertyFormat, {
    errorMap: () => ({ message: "Invalid property format" }),
  }).optional().nullable(),
  builder: z.string().min(1, "Builder name is required").max(200, "Builder name is too long"),
  builderReraNumber: z.string().max(100, "RERA number is too long").optional().nullable(),
  description: z.string().max(5000, "Description is too long").optional().nullable(),
  price: z
    .number()
    .positive("Price must be positive")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  location: z.string().max(200, "Location is too long").optional().nullable(),
  locationAdvantages: z.array(z.string()).default([]),
  status: z.nativeEnum(PropertyStatus, {
    errorMap: () => ({ message: "Invalid property status" }),
  }),
  // Allow relative URLs from the upload endpoint as well as absolute URLs
  mainImage: imageUrlSchema.optional().nullable(),
  images: z.array(imageUrlSchema).default([]),
  amenities: z.array(z.string()).default([]),
  mapImage: imageUrlSchema.optional().nullable(),
  projectLaunchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/).optional().nullable(),
  builderReraQrCode: imageUrlSchema.optional().nullable(),
  possession: z.string().max(500, "Possession info is too long").optional().nullable(),
  metaTitle: z.string().max(200, "Meta title is too long").optional().nullable(),
  metaKeywords: z.string().max(500, "Meta keywords is too long").optional().nullable(),
  metaDescription: z.string().max(500, "Meta description is too long").optional().nullable(),
  bankAccountName: z.string().max(200, "Bank account name is too long").optional().nullable(),
  bankName: z.string().max(200, "Bank name is too long").optional().nullable(),
  bankAccountNumber: z.string().max(50, "Account number is too long").optional().nullable(),
  bankIfsc: z.string().max(20, "IFSC code is too long").optional().nullable(),
  bankBranch: z.string().max(200, "Bank branch is too long").optional().nullable(),
  configurations: z.array(propertyConfigurationSchema).default([]),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

/**
 * Property filter schema
 */
export const propertyFilterSchema = z.object({
  type: z.nativeEnum(PropertyType).optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
  builder: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
});

export type PropertyFilterData = z.infer<typeof propertyFilterSchema>;
