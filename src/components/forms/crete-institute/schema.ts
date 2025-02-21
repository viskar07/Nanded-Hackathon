import { z } from "zod";

export const InstitutionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  jsonDescription: z.string().optional(),
  htmlDescription: z.string().optional(),
  icon: z.string().url("Icon must be a valid URL").optional(), // Validate URL format
});
