"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { DEPARTMENT_CREATION_FORM } from "@/constants/form";
import { useCreateDepartmentForm } from "@/hooks/institution";

interface DepartmentFormProps {
  institutionId: string;
}

const DepartmentForm = ({ institutionId }: DepartmentFormProps) => {
  const { onSubmit, isPending, register, errors } = useCreateDepartmentForm({ institutionId });

  return (
    <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
      {DEPARTMENT_CREATION_FORM.map((field) => (
        <FormGenerator key={field.name} {...field} register={register} errors={errors} />
      ))}

      <Button type="submit" className="rounded-2xl" disabled={isPending}>
        <Loader loading={isPending}>Create Department</Loader>
      </Button>
    </form>
  );
};

export default DepartmentForm;
