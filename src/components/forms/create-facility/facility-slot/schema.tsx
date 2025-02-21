import { z } from "zod";

export const FacilitySlotCreationSchema = z.object({
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  maxCapacity: z.number().min(1, "Capacity must be at least 1"),
  reason: z.string().optional(),
});

export type FacilitySlotCreationType = z.infer<typeof FacilitySlotCreationSchema>;
