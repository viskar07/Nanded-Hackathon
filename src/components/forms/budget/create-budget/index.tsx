"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BUDGET_CREATION_FORM } from "@/constants/form";
import { useCreateBudget } from "@/hooks/institution";

const BudgetForm = () => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
    organizations,
    isOrganizationsLoading,
  } = useCreateBudget();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Organization Select Dropdown */}
      <Label htmlFor="organizationId">Organization</Label>
      <Select onValueChange={(value) => register("organizationId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          {!isOrganizationsLoading && organizations?.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name} {/* Displaying organization name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Render other fields */}
      {BUDGET_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      {/* Budget Clear Toggle */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="budgetClear">Budget Clear?</Label>
        <Switch
          id="budgetClear"
          {...register("budgetClear")}
          onCheckedChange={(checked) => {
            register("budgetClear").onChange({ target: { value: checked } });
          }}
        />
      </div>

      <Button type="submit" disabled={isPending || isOrganizationsLoading}>
        <Loader loading={isPending || isOrganizationsLoading}>Create Budget</Loader>
      </Button>
    </form>
  );
};

export default BudgetForm;
