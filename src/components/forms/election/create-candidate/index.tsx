"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CANDIDATE_CREATION_FORM } from "@/constants/form";
import { useCreateCandidate } from "@/hooks/institution";

const CandidateForm = () => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
    elections,
    isElectionsLoading,
    students,
    isStudentsLoading,
  } = useCreateCandidate();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Student Select Dropdown */}
      <Label htmlFor="studentId">Student</Label>
      <Select onValueChange={(value) => register("studentId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a student" />
        </SelectTrigger>
        <SelectContent>
          {!isStudentsLoading && students?.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name} {/* Displaying student name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Elections Select Dropdown */}
      <Label htmlFor="electionId">Election</Label>
      <Select onValueChange={(value) => register("electionId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an election" />
        </SelectTrigger>
        <SelectContent>
          {!isElectionsLoading && elections?.map((election) => (
            <SelectItem key={election.id} value={election.id}>
              {election.title} {/* Displaying election title */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Render other fields */}
      {CANDIDATE_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      <Button type="submit" disabled={isPending || isElectionsLoading || isStudentsLoading}>
        <Loader loading={isPending || isElectionsLoading || isStudentsLoading}>Create Candidate</Loader>
      </Button>
    </form>
  );
};

export default CandidateForm;
