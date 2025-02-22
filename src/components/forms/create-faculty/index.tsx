  "use client";

  import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FACULTY_CREATION_FORM } from "@/constants/form";
import { useCreateFaculty } from "@/hooks/institution";
import { UseFormRegister } from "react-hook-form";

  interface FacultyFormProps {
    institutionId: string;
  }

  const FacultyForm = ({ institutionId }: FacultyFormProps) => {
    const { onSubmitFaculty, isPending, register, errors } = useCreateFaculty({
      institutionId,
    });

    const registerFile = (register: UseFormRegister<any>, name: string) => ({
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        register(name).onChange({ target: { value: fileList } });
      },
    });

    return (
      <form
        className="flex flex-col gap-4 mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitFaculty(); // Call the onSubmitFaculty function
        }}
      >
        {FACULTY_CREATION_FORM.map((field) => (
          <FormGenerator key={field.id} {...field} register={register} errors={errors} />
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
            {...registerFile(register, "profile")} // Use registerFile to handle the file input
          />
          Upload Profile Picture
        </Label>

        <Button type="submit" className="rounded-2xl" disabled={isPending}>
          <Loader loading={isPending}>Create Faculty</Loader>
        </Button>
      </form>
    );
  };

  export default FacultyForm;
