import { z } from "zod";

/**
 * Contact/Enquiry form validation schema
 */
export const enquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number (10 digits starting with 6-9)")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  type: z.string().default("contact"),
  propertyId: z.string().optional().nullable(),
});

export type EnquiryFormInput = z.input<typeof enquirySchema>;
export type EnquiryFormData = z.output<typeof enquirySchema>;
