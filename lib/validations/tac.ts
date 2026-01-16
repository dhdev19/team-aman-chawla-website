import { z } from "zod";

/**
 * TAC Registration form validation schema
 */
export const tacRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number (10 digits starting with 6-9)"),
  address: z.string().max(500, "Address is too long").optional().nullable(),
});

export type TACRegistrationFormData = z.infer<typeof tacRegistrationSchema>;
