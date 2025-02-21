import { z } from "zod";

export const CheatingRecordCreationSchema = z.object({
  studentId: z.string().uuid("Invalid Student ID"),
  reason: z.string().min(10, "Reason must be at least 10 characters long"),
  proof: z.string().optional(), // Store the Uploadcare UUID or URL
});

export type CheatingRecordCreationType = z.infer<typeof CheatingRecordCreationSchema>;
