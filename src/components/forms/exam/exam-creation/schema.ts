import { z } from "zod";

export const ExamCreationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  date: z.date(),
  data: z.string().optional(), // Store the Uploadcare UUID or URL
});

export type ExamCreationType = z.infer<typeof ExamCreationSchema>;
