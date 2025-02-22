'use client'
import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useInstitutionForm } from "@/hooks/institution";
import { Widget } from "@uploadcare/react-widget"; // Correct import for Uploadcare

// Define the type for the fields array
type InstitutionFormField = {
  name: string;
  label: string;
  placeholder: string;
  inputType: "input" | "textarea";
  type?: "text" | "email" | "password" | "number";
  lines?: number;
};

const InstitutionForm = () => {
  const { register, errors, onSubmit, isPending } = useInstitutionForm();

  // Define fields for FormGenerator
  const fields: InstitutionFormField[] = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter institution name",
      inputType: "input",
      type: "text",
    },
   
  
   
  ];

  // Function to handle Uploadcare changes
  const handleUploadChange = (fileInfo: any) => {
    if (fileInfo) {
      register("icon").onChange({ target: { value: fileInfo.cdnUrl } });
    } else {
      register("icon").onChange({ target: { value: "" } }); // Clear the value if no file is uploaded
    }
  };

  return (
    <form className="flex flex-col gap-3 mt-10" onSubmit={onSubmit}>
      {fields.map((field) => (
        <FormGenerator
          {...field}
          key={field.name}
          register={register}
          errors={errors}
        />
      ))}

      <div>
        <Label htmlFor="icon">Icon</Label>
        <Widget
          publicKey={process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string}
          onChange={handleUploadChange}
     
        />
        {errors.icon && <p className="text-red-400">{errors.icon.message}</p>}
      </div>

      <Button type="submit" className="rounded-2xl">
        <Loader loading={isPending}>Create Institution</Loader>
      </Button>
    </form>
  );
};

export default InstitutionForm;
