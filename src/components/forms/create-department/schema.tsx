import * as z from "zod";

export const DepartmentSchema = z.object({
  name: z.string().min(2, { message: "Department name must be at least 2 characters." }),
  description: z.string().optional(),
});

export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>;
