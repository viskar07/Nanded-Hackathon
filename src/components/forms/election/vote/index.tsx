"use client";

import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateVote } from "@/hooks/institution";

const VoteForm = () => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
    candidates,
    isCandidatesLoading,
    students,
    isStudentsLoading,
    elections,
    isElectionsLoading,
  } = useCreateVote();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Candidate Select Dropdown */}
      <Label htmlFor="candidateId">Candidate</Label>
      <Select onValueChange={(value) => register("candidateId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a candidate" />
        </SelectTrigger>
        <SelectContent>
          {!isCandidatesLoading && candidates?.map((candidate) => (
            <SelectItem key={candidate.id} value={candidate.id}>
              {candidate.position} - {candidate.student.name} {/* Displaying candidate position and name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Voter Select Dropdown */}
      <Label htmlFor="voterId">Voter</Label>
      <Select onValueChange={(value) => register("voterId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a voter" />
        </SelectTrigger>
        <SelectContent>
          {!isStudentsLoading && students?.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name} {/* Displaying student name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Election Select Dropdown */}
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

      <Button type="submit" disabled={isPending || isCandidatesLoading || isStudentsLoading || isElectionsLoading}>
        <Loader loading={isPending || isCandidatesLoading || isStudentsLoading || isElectionsLoading}>Cast Vote</Loader>
      </Button>
    </form>
  );
};

export default VoteForm;
