import { z } from "zod";

export const BudgetCreationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  budgetClear: z.boolean().default(false), // Added budgetClear field
});

export type BudgetCreationType = z.infer<typeof BudgetCreationSchema>;
