import * as z from "zod";

export const ClassSchema = z.object({
    class: z.string().min(2,{message:"Class must be at least 2 characters." }).max(200), // Realistic year range
    branch: z.string().min(2, { message: "Branch must be at least 2 characters." }),
});

export type ClassSchemaType = z.infer<typeof ClassSchema>;
