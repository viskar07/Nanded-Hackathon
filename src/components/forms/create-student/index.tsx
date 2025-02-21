"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STUDENT_CREATION_FORM } from "@/constants/form";
import { useStudentForm } from "@/hooks/student";

interface FacultyFormProps {
    institutionId: string;
}

const StudentForm = ({ institutionId }: FacultyFormProps) => {
    const { onSubmitStudent, isPending, register, errors, } = useStudentForm({
        institutionId,
    });

    // Update STUDENT_CREATION_FORM with departmentOptions
    // useEffect(() => {
    //     STUDENT_CREATION_FORM.forEach((field) => {
    //         if (field.name === "departmentId" && departmentOptions) {
    //             field.options = departmentOptions;
    //         }
    //     });
    // }, [departmentOptions]);

    return (
        <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmitStudent}>
            {STUDENT_CREATION_FORM.map((field) => (
                <FormGenerator key={field.name} {...field} register={register} errors={errors} options={field.options} />
            ))}

            {/* Profile Picture Upload */}
            <Label
                htmlFor="profile-upload"
                className="border-2 border-themeGray bg-themeGray/50 px-5 py-3 rounded-lg hover:bg-themeBlack cursor-pointer"
            >
                <Input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    {...register( "profile")}
                />
                Upload Profile Picture
            </Label>

            <Button type="submit" className="rounded-2xl" disabled={isPending}>
                <Loader loading={isPending}>Create Student</Loader>
            </Button>
        </form>
    );
};

export default StudentForm;
