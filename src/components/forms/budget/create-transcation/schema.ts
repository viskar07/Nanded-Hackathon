import { z } from "zod";

export const BudgetTransactionCreationSchema = z.object({
  budgetId: z.string().uuid("Invalid Budget ID"),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  receipt: z.string().optional(), // Store the Uploadcare UUID or URL
  verified: z.boolean().default(false), // Added verified field
  rejectedReason: z.string().optional(),
});

export type BudgetTransactionCreationType = z.infer<typeof BudgetTransactionCreationSchema>;
