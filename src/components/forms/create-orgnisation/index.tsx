// components/OrganizationForm.tsx
"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { ORGANIZATION_CREATION_FORM } from "@/constants/form";
import { useDepartments } from "@/hooks/departments";
import { useOrganizationForm } from "@/hooks/institution";
import Select, { ActionMeta, SingleValue } from "react-select";

interface OrganizationFormProps {
    institutionId: string;
}

const OrganizationForm = ({ institutionId }: OrganizationFormProps) => {
    const { onSubmit, isPending, register, errors, setValue, trigger, organizationType } = useOrganizationForm({ institutionId });
    const { departments, isLoadingDepartments, fetchError } = useDepartments();

    return (
        <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
            {ORGANIZATION_CREATION_FORM.map((field) => (
                <FormGenerator key={field.name} {...field} register={register} errors={errors} />
            ))}

            {/* Department Selection */}
            <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                    Department
                </label>
                <Loader loading={isLoadingDepartments} >
                    <Select
                        id="departmentId"
                        options={departments.map((department) => ({
                            value: department.id,
                            label: department.name,
                        }))}
                        isDisabled={organizationType === "Mess"}
                        onChange={(selectedOption: SingleValue<{ value: string; label: string }>, actionMeta: ActionMeta<{ value: string; label: string }>) => {
                            const departmentId = selectedOption ? selectedOption.value : undefined;
                            setValue('departmentId', departmentId);
                            trigger('departmentId');
                        }}
                        placeholder="Select a department"
                        classNamePrefix="react-select"
                    />
                    </Loader >
                {errors.departmentId && <p className="text-red-600">{errors.departmentId.message}</p>}
                
                {fetchError && <p className="text-red-600">Error: {fetchError}</p>}
            </div>

            <Button type="submit" className="rounded-2xl" disabled={isPending}>
                <Loader loading={isPending}>Create Organization</Loader>
            </Button>
        </form>
    );
};

export default OrganizationForm;
