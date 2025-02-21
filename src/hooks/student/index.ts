import { createStudent } from "@/actions/student";
import { StudentSchema, StudentSchemaType } from "@/components/forms/create-student/schema";
import { upload } from "@/lib/uploadcare";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useStudentForm = ({ institutionId }: { institutionId: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<StudentSchemaType>({
        resolver: zodResolver(StudentSchema),
        mode: "onBlur",
    });

    const router = useRouter();

   const { mutate: createFacultyMutation, isPending: isPending } = useMutation({
     mutationFn: async (values: any) => {
       let profileUrl;
 
       // 🔹 Upload Profile Image if Provided
       if (values.profile && values.profile.length > 0) {
         try {
           const uploaded = await upload.uploadFile(values.profile[0]);
           profileUrl = uploaded.uuid;
         } catch (error) {
           console.error("Profile Upload Failed:", error);
           throw new Error("Profile image upload failed");
         }
       }
 
       // 🔹 Send Data to Backend
       return await createStudent({
         ...values,
         profile: profileUrl, // Include profileUrl in the request data
         institutionId:institutionId, 
       },
     );
     },
 
     onSuccess: () => {
       toast.success("Faculty Created Successfully");
       reset();
       // router.push("/"); // Redirect if needed
     },
 
     onError: (error) => {
       console.error("Faculty Creation Failed:", error);
       toast.error("Error creating faculty");
     },
   });
 
   const onSubmitStudent = handleSubmit((values) => {
     createFacultyMutation(values);
   });
 
   return {
    onSubmitStudent,
     isPending,
     register,
     errors,
   };
};
