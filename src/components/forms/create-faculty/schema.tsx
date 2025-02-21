import { z } from "zod";

const FacultyRoleType = z.enum([
  "ADMIN",
  "FINANCE",
  "REGISTRAR",
  "FACILITY_INCHARGE",
  "COMPLAINT_MODERATOR",
  "ELECTION_MANAGER",
]);

const FacultyDesignationType = z.enum([
  "LECTURER",
  "ASSISTANT_PROFESSOR",
  "ASSOCIATE_PROFESSOR",
  "PROFESSOR",
  "STAFF",
]);

const FacultyCreationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),

  profile: z
    .union([
      z.string().url("Invalid profile URL"), // If storing a URL
      z.instanceof(File) // If handling actual file uploads
    ])
    .optional(),

  designation: FacultyDesignationType, // Now `designation` is a string with allowed values

  role: FacultyRoleType.optional(), // Role is optional

  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export { FacultyCreationSchema, FacultyDesignationType, FacultyRoleType };

