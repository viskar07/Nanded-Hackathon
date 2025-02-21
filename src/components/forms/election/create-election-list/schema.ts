import { z } from "zod";

export const ElectionsListCreationSchema = z.object({
  name: z.string().min(3, "Election list name must be at least 3 characters long"),
});

export type ElectionsListCreationType = z.infer<typeof ElectionsListCreationSchema>;
