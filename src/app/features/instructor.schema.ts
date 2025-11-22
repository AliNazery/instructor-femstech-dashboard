import { z } from "zod";

export const instructorSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password is too long"),
  bio: z.string().optional(),
  phone: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(20, "Phone number too long"),
  address: z.string().optional(),
  avatar_url: z
    .any()
    .refine((file) => file && file.length > 0, "Profile image is required"),
});

// ✅ This is the TypeScript type for your form
export type InstructorFormData = z.infer<typeof instructorSchema>;
