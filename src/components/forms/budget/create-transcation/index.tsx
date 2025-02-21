"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BUDGET_TRANSACTION_CREATION_FORM } from "@/constants/form";
import { useCreateBudgetTransaction } from "@/hooks/institution";
import { Uploader } from "@uploadcare/react-widget";

const BudgetTransactionForm = () => {
  const {
    onSubmit,
    register,
    errors,
    isPending,
    budgets,
    isBudgetsLoading,
  } = useCreateBudgetTransaction();

  const handleFileSelect = (info) => {
    register("receipt").onChange({ target: { value: info.uuid }}); // Store the UUID in the form
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Budget Select Dropdown */}
      <Label htmlFor="budgetId">Budget</Label>
      <Select onValueChange={(value) => register("budgetId").onChange({ target: { value } })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a budget" />
        </SelectTrigger>
        <SelectContent>
          {!isBudgetsLoading && budgets?.map((budget) => (
            <SelectItem key={budget.id} value={budget.id}>
              {budget.title} {/* Displaying budget title */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Render other fields */}
      {BUDGET_TRANSACTION_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      {/* Receipt Upload */}
      <Label htmlFor="uploadcare">Upload Receipt</Label>
      <Uploader
        publicKey="demopublickey" // Replace with your actual Uploadcare public key
        id="uploadcare"
        onChange={handleFileSelect}
        multiple={false}
      />

      {/* Verified Toggle */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="verified">Verified?</Label>
        <Switch
          id="verified"
          {...register("verified")}
          onCheckedChange={(checked) => {
            register("verified").onChange({ target: { value: checked } });
          }}
        />
      </div>

      <Button type="submit" disabled={isPending || isBudgetsLoading}>
        <Loader loading={isPending || isBudgetsLoading}>Create Budget Transaction</Loader>
      </Button>
    </form>
  );
};

export default BudgetTransactionForm;
