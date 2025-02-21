import { z } from "zod";

export const FacilityReviewCreationSchema = z.object({
  facilityId: z.string().uuid("Invalid Facility ID").optional(),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
  reviewerId: z.string().uuid("Invalid Reviewer ID"), // This will hold either studentId or facultyId
});

export type FacilityReviewCreationType = z.infer<typeof FacilityReviewCreationSchema>;