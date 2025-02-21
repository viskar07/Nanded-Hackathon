import * as z from 'zod';

export const OrganizationSchema = z.object({
    name: z.string().min(2, { message: 'Organization name must be at least 2 characters.' }),
    type: z.enum(['Department', 'Club', 'CollegeEvent', 'Mess']),
    departmentId: z.string().optional(), // Optional field for department
});

export type OrganizationSchemaType = z.infer<typeof OrganizationSchema>;
