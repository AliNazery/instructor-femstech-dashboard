import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description is too short"),
  modules: z.number().min(1, "At least one module required"),
  price: z.number().nonnegative(),
  status: z.enum(["draft", "published"]),
});

export type CourseFormData = z.infer<typeof courseSchema>;
