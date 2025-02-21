"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHEATING_RECORD_CREATION_FORM } from "@/constants/form";
import { useCreateCheatingRecord } from "@/hooks/cheating-record"; // Corrected import
import { Uploader } from "@uploadcare/react-widget";

const CheatingRecordForm = () => {
  const {
    onSubmit,
    register,
    errors,
    setValue,
    isPending,
    students,
    isStudentsLoading,
    studentsError,
  } = useCreateCheatingRecord();

  const handleFileSelect = (info) => {
    setValue("proof", info.uuid); // Store the UUID in the form
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Student Select Dropdown */}
      <Label htmlFor="studentId">Student</Label>
      <Select onValueChange={(value) => setValue("studentId", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a student" />
        </SelectTrigger>
        <SelectContent>
          {students &&
            students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} ({student.email}) {/* Adjust based on student object */}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {CHEATING_RECORD_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors} />
      ))}

      <Label htmlFor="uploadcare">Upload Proof (Image)</Label>
      <Uploader
        publicKey="demopublickey" // Replace with your actual Uploadcare public key
        id="uploadcare"
        onChange={handleFileSelect}
        multiple={false}
      />

      <Button type="submit" disabled={isPending || isStudentsLoading}>
        <Loader loading={isPending || isStudentsLoading}>Create Cheating Record</Loader>
      </Button>
    </form>
  );
};

export default CheatingRecordForm;
