import { z } from "zod";

export const ComplaintCreationSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long"),
  proof: z.string().optional(), // Store the Uploadcare UUID or URL
  revealIdentity: z.boolean().default(false),
});

export type ComplaintCreationType = z.infer<typeof ComplaintCreationSchema>;
