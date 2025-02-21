import * as z from "zod";

export const StudentSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email format." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    departmentId: z.string().uuid({ message: "Invalid department ID." }),
    parentName: z.string().min(2, { message: "Parent name must be at least 2 characters." }),
    parentMobile: z.string().regex(/^[0-9]{10}$/, { message: "Invalid mobile number." }),
    parentEmail: z.string().email({ message: "Invalid email format." }),
    profile: z.any().optional(), // For Uploadcare, can be any initially
});

export type StudentSchemaType = z.infer<typeof StudentSchema>;
