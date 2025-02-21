"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { CLASS_CREATION_FORM } from "@/constants/form";
import { useCreateClassForm } from "@/hooks/institution";

const ClassForm = () => {
    const { onSubmit, isPending, register, errors } = useCreateClassForm();

    return (
        <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
            {CLASS_CREATION_FORM.map((field) => (
                <FormGenerator key={field.name} {...field} register={register} errors={errors} />
            ))}

            <Button type="submit" className="rounded-2xl" disabled={isPending}>
                <Loader loading={isPending}>Create Class</Loader>
            </Button>
        </form>
    );
};

export default ClassForm;
