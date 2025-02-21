"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ELECTION_CREATION_FORM } from "@/constants/form";
import { useCreateElection } from "@/hooks/institution";

const ElectionForm = () => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
    electionsLists,
    isElectionsListsLoading,
  } = useCreateElection();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Elections List Select Dropdown */}
      <Label htmlFor="electionsListId">Elections List</Label>
      <Select onValueChange={(value) => register("electionsListId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an elections list" />
        </SelectTrigger>
        <SelectContent>
          {!isElectionsListsLoading && electionsLists?.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name} {/* Displaying elections list name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Render other fields */}
      {ELECTION_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      <Button type="submit" disabled={isPending || isElectionsListsLoading}>
        <Loader loading={isPending || isElectionsListsLoading}>Create Election</Loader>
      </Button>
    </form>
  );
};

export default ElectionForm;
