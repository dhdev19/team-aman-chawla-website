import { z } from "zod";
import { PropertyType, PropertyStatus } from "@prisma/client";

/**
 * Property creation/update validation schema
 */
export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required").max(200, "Name is too long"),
  type: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: "Invalid property type" }),
  }),
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
  status: z.nativeEnum(PropertyStatus, {
    errorMap: () => ({ message: "Invalid property status" }),
  }),
  mainImage: z.string().url("Invalid image URL").optional().nullable(),
  images: z.array(z.string().url("Invalid image URL")).default([]),
  amenities: z.array(z.string()).default([]),
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
