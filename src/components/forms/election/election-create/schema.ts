import { z } from "zod";

export const ElectionCreationSchema = z.object({
  title: z.string().min(3, "Election title must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.enum(["HIDDEN", "ACTIVE", "COMPLETED"]),
  startTime: z.date(),
  endTime: z.date().refine((date) => date > new Date(), {
    message: "End time must be in the future",
  }),
  electionsListId: z.string().optional(), // Optional field for associated elections list
});

export type ElectionCreationType = z.infer<typeof ElectionCreationSchema>;
