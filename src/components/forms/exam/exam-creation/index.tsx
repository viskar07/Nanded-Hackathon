"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EXAM_CREATION_FORM } from "@/constants/form";
import { useCreateExam } from "@/hooks/institution";
import { Uploader } from "@uploadcare/react-widget";

const ExamForm = () => {
  const { onSubmit, register, errors, setValue, isPending } = useCreateExam();

  const handleFileSelect = (info) => {
    setValue("data", info.uuid); // Store the UUID in the form
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {EXAM_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      <Label htmlFor="uploadcare">Upload Exam Data (File)</Label>
      <Uploader
        publicKey="demopublickey" // Replace with your actual Uploadcare public key
        id="uploadcare"
        onChange={handleFileSelect}
        multiple={false} // Set to true if you want to allow multiple files
      />

      <Button type="submit" disabled={isPending}>
        <Loader loading={isPending}>Create Exam</Loader>
      </Button>
    </form>
  );
};

export default ExamForm;
