import { z } from "zod";

export const FacilityCreationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().optional(),
  images: z.string().optional(), // Store the Uploadcare UUID
});

export type FacilityCreationType = z.infer<typeof FacilityCreationSchema>
