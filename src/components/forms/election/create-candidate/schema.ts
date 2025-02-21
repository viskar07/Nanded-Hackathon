import { z } from "zod";

export const CandidateCreationSchema = z.object({
  studentId: z.string().uuid("Invalid Student ID"),
  manifesto: z.string().optional(),
  position: z.string().min(3, "Position must be at least 3 characters long"),
  electionId: z.string().uuid("Invalid Election ID"),
  description: z.string().optional(), // New field for description
});

export type CandidateCreationType = z.infer<typeof CandidateCreationSchema>;
