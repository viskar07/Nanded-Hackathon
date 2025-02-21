import { z } from "zod";

export const VoteCreationSchema = z.object({
  candidateId: z.string().uuid("Invalid Candidate ID"),
  voterId: z.string().uuid("Invalid Voter ID"),
  electionId: z.string().uuid("Invalid Election ID"),
});

export type VoteCreationType = z.infer<typeof VoteCreationSchema>;
