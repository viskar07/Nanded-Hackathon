"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FACILITY_REVIEW_CREATION_FORM } from "@/constants/form";
import { useCreateFacilityReview } from "@/hooks/institution";

interface FacilityReviewFormProps {
  facilityId: string; // Passed as a prop
  reviewerId: string; // Passed as a prop (studentId or facultyId)
}

const FacilityReviewForm = ({ facilityId, reviewerId }: FacilityReviewFormProps) => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
    facilities,
    isFacilitiesLoading,
  } = useCreateFacilityReview();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Facility Select Dropdown */}
      <Label htmlFor="facilityId">Facility</Label>
      <select {...register("facilityId")} defaultValue={facilityId} className="border rounded p-2">
        <option value="" disabled>Select a facility</option>
        {!isFacilitiesLoading && facilities?.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name} {/* Displaying facility name */}
          </option>
        ))}
      </select>

      {/* Set reviewer ID directly */}
      <input type="hidden" value={reviewerId} {...register("reviewerId")} />

      {/* Render other fields */}
      {FACILITY_REVIEW_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      <Button type="submit" disabled={isPending || isFacilitiesLoading}>
        <Loader loading={isPending || isFacilitiesLoading}>Submit Review</Loader>
      </Button>
    </form>
  );
};

export default FacilityReviewForm;
