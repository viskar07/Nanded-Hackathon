"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { ELECTIONS_LIST_CREATION_FORM } from "@/constants/form";
import { useCreateElectionsList } from "@/hooks/institution";

const ElectionsListForm = () => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
  } = useCreateElectionsList();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Render form fields */}
      {ELECTIONS_LIST_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      <Button type="submit" disabled={isPending}>
        <Loader loading={isPending}>Create Election List</Loader>
      </Button>
    </form>
  );
};

export default ElectionsListForm;
