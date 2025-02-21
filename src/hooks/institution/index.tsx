"use client";

import { onAuthenticatedUser } from "@/actions/auth";
import { createBudget, createBudgetTransaction, createCandidate, createClassAction, createDepartmentAction, createExam, createFacility, createFaculty, createInstitution, createOrganizationAction, fetchDepartments, getInstitutionsByUserId } from "@/actions/institution";
import { BudgetCreationSchema, BudgetCreationType } from "@/components/forms/budget/create-budget/schema";
import { BudgetTransactionCreationSchema, BudgetTransactionCreationType } from "@/components/forms/budget/create-transcation/schema";
import { ClassSchema, ClassSchemaType } from "@/components/forms/create-class/schema";
import { ComplaintCreationSchema, ComplaintCreationType } from "@/components/forms/create-complaint/schema";
import { DepartmentSchema, DepartmentSchemaType } from "@/components/forms/create-department/schema";
import { FacilitySlotCreationSchema, FacilitySlotCreationType } from "@/components/forms/create-facility/facility-slot/schema";
import { FacilityReviewCreationSchema, FacilityReviewCreationType } from "@/components/forms/create-facility/review/schema";
import { FacilityCreationSchema, FacilityCreationType } from "@/components/forms/create-facility/schema";
import { FacultyCreationSchema } from "@/components/forms/create-faculty/schema";
import { OrganizationSchema, OrganizationSchemaType } from "@/components/forms/create-orgnisation/schema";
import { InstitutionSchema } from "@/components/forms/crete-institute/schema";
import { CandidateCreationSchema, CandidateCreationType } from "@/components/forms/election/create-candidate/schema";
import { ElectionsListCreationSchema, ElectionsListCreationType } from "@/components/forms/election/create-election-list";
import { ElectionCreationSchema, ElectionCreationType } from "@/components/forms/election/election-create/schema";
import { VoteCreationSchema, VoteCreationType } from "@/components/forms/election/vote/schema";
import { CheatingRecordCreationSchema, CheatingRecordCreationType } from "@/components/forms/exam/cheating-records/schema";
import { ExamCreationSchema, ExamCreationType } from "@/components/forms/exam/exam-creation/schema";
import { upload } from "@/lib/uploadcare";
import { Institution } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facility } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UseInstitutionsResult {
  institutionsData: Institution[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useInstitutions(): UseInstitutionsResult {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const authenticatedUser = await onAuthenticatedUser();
        setUserId(authenticatedUser?.id || null);
      } catch (error: any) {
        console.error("Error fetching user ID:", error);
        toast.error(`Failed to fetch user information. ${error.message || "Please try again later."}`);
        setUserId(null);
      }
    };

    fetchUserId();
  }, []);

  const {
    data, // Renamed data to rawData
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-institutions", userId],
    queryFn: async (): Promise<Institution[]> => {
      if (!userId) return [];

      const response = await getInstitutionsByUserId(userId);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to fetch institutions"); // Use error message
      }

      return response.data; // Return only the data array
    },
    enabled: !!userId,
    onError: (err: any) => { // Type the error argument as any
      console.error("Error fetching institutions:", err.message, err);
      toast.error(`Failed to load institutions. ${err.message || "Please check your connection."}`);
    },
  });

   const institutionsData: Institution[] = data || []; // Safely handle undefined data

  return {
    institutionsData,
    isLoading,
    isError,
    error,
  };
}




export const useInstitutionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof InstitutionSchema>>({
    resolver: zodResolver(InstitutionSchema),
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof InstitutionSchema>) => createInstitution(values),
    onSuccess: () => {
      toast.success("Institution created successfully!");
      reset();
    },
    onError: (error: any) => {  // Use 'any' for error type for now - refine as needed
      toast.error(error?.message || "Failed to create institution."); // Safely access error message
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values); // Await the mutation
  });

  return {
    register,
    errors,
    onSubmit,
    isPending: mutation.isPending,
  };
};

// Ensure correct export
export default useInstitutions;








export const useCreateFaculty = ({ institutionId }: { institutionId: string }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof FacultyCreationSchema>>({
    resolver: zodResolver(FacultyCreationSchema),
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
      return await createFaculty({
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

  const onSubmitFaculty = handleSubmit((values) => {
    createFacultyMutation(values);
  });

  return {
    onSubmitFaculty,
    isPending,
    register,
    errors,
  };
};




interface UseDepartmentFormProps {
  institutionId: string;
}

export const useCreateDepartmentForm = ({ institutionId }: UseDepartmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<DepartmentSchemaType>({
    resolver: zodResolver(DepartmentSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const { mutate: createDepartmentMutation, isPending: isPending } = useMutation({
    mutationFn: async (values: DepartmentSchemaType) => {
      const payload = {
        ...values,
        institutionId: institutionId,
      };
      return await createDepartmentAction(payload);
    },
    onSuccess: () => {
      toast.success("Department created successfully!");
      reset();
      router.push("/departments"); // Adjust the redirect path
    },
    onError: (error: any) => {
      console.error("Mutation Error:", error);
      toast.error(error?.message || "Failed to create department.");
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    createDepartmentMutation(values);
  });

  return {
    register,
    errors,
    onSubmit,
    isPending,
    control,
  };
};






export const useCreateClassForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<ClassSchemaType>({
        resolver: zodResolver(ClassSchema),
        mode: "onBlur",
    });

    const router = useRouter();

  

    const { mutate: createClassMutation, isPending: isPending } = useMutation({
        mutationFn: async (values: ClassSchemaType) => {
            return await createClassAction(values);
        },
        onSuccess: () => {
            toast.success("Class created successfully!");
            reset();
            router.push("/classes"); // Adjust the redirect path
        },
        onError: (error: any) => {
            console.error("Mutation Error:", error);
            toast.error(error?.message || "Failed to create class.");
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        createClassMutation(values);
    });

    return {
        register,
        errors,
        onSubmit,
        isPending,
        control,
    };
};




interface UseOrganizationFormProps {
  institutionId: string;
}

export const useOrganizationForm = ({ institutionId }: UseOrganizationFormProps) => {
  const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
      watch,
  } = useForm<OrganizationSchemaType>({
      resolver: zodResolver(OrganizationSchema),
      mode: "onBlur",
  });

  const router = useRouter();

  const { data:departments = [] , isLoading: isLoadingDepartments, error: fetchError } = useQuery({
    queryKey:['departmentsList'], // Unique query key
    queryFn:fetchDepartments // Fetching function
  }
  );

  console.log("Department",departments);
 

  const organizationType = watch('type'); // Watch for changes in organization type

  const { mutate: createOrganizationMutation, isPending: isPending } = useMutation({
      mutationFn: async (values: OrganizationSchemaType) => {
          return await createOrganizationAction({ ...values, institutionId }); // Pass institutionId to server action
      },
      onSuccess: () => {
          toast.success("Organization created successfully!");
          reset();
          router.push("/organizations"); // Adjust the redirect path
      },
      onError: (error: any) => {
          console.error("Mutation Error:", error);
          toast.error(error?.message || 'Failed to create organization.');
      }
  });

  const onSubmit = handleSubmit(async (values) => {
    // Ensure departmentId is set correctly or null if not selected
    const organizationData = {
        ...values,
        departmentId: values.departmentId || undefined, // Handle as needed
    };
    createOrganizationMutation(organizationData);
});

  return {
      register,
      errors,
      onSubmit,
      isPending,
      control,
      departments,
      isLoadingDepartments,
      fetchError,
      organizationType, // Expose organization type for conditional rendering
  };
};




export const useCreateFacility = ({ institutionId }: UseOrganizationFormProps) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FacilityCreationType>({
    resolver: zodResolver(FacilityCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter()

  const { mutate: createFacilityMutation, isPending: isPending } = useMutation({
    mutationFn: async (data: FacilityCreationType) => {
      return await createFacility({...data,institutionId:institutionId});
    },
    onSuccess: () => {
      toast.success("Facility Created Successfully");
      reset();
      queryClient.invalidateQueries({
        queryKey: ["facilities"]
      })
      router.push("/admin/facilities")
    },
    onError: (error) => {
      toast.error(`Failed to create facility: ${error.message}`);
    },
  });

  const onSubmit = handleSubmit(async(values: FacilityCreationType) => {
    createFacilityMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    setValue,
    isPending,
  };
};





export const useCreateFacilitySlot = ({ facilityId }: {facilityId:string}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FacilitySlotCreationType>({
    resolver: zodResolver(FacilitySlotCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const { mutate: createFacilitySlotMutation, isPending: isPending } = useMutation({
    mutationFn: async (data: Facility) => {
      return  createFacilitySlotMutation({ ...data, facilityId });
    },
    onSuccess: () => {
      toast.success("Facility Slot Created Successfully");
      reset();
      queryClient.invalidateQueries({
        queryKey: ["facility-slots", facilityId], // Invalidate slots for this facility
      });
      router.push(`/admin/facilities/${facilityId}/slots`); // Redirect to slots page
    },
    onError: (error: any) => {
      toast.error(`Failed to create facility slot: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values: FacilitySlotCreationType) => {
    createFacilitySlotMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
  };
};




export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ComplaintCreationType>({
    resolver: zodResolver(ComplaintCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const { mutate: createComplaintMutation, isPending } = useMutation({
    mutationFn: async (data: ComplaintCreationType) => {
      return await createComplaint(data);
    },
    onSuccess: () => {
      toast.success("Complaint Created Successfully");
      reset();
      queryClient.invalidateQueries(["complaints"]); // Invalidate complaints query
      router.push("/complaints"); // Redirect to complaints page
    },
    onError: (error) => {
      toast.error(`Failed to create complaint: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createComplaintMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    setValue,
    isPending,
  };
};


export const useCreateExam = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ExamCreationType>({
    resolver: zodResolver(ExamCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const { mutate: createExamMutation, isPending } = useMutation({
    mutationFn: async (data: ExamCreationType) => {
      return await createExam(data);
    },
    onSuccess: () => {
      toast.success("Exam Created Successfully");
      reset();
      queryClient.invalidateQueries(["exams"]); // Invalidate exams query
      router.push("/exams"); // Redirect to exams page
    },
    onError: (error) => {
      toast.error(`Failed to create exam: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createExamMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    setValue,
    isPending,
  };
};


export const useCreateCheatingRecord = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CheatingRecordCreationType>({
    resolver: zodResolver(CheatingRecordCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  // Fetch Students for Dropdown
  const { data: students, isLoading: isStudentsLoading, error: studentsError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      // Replace with your actual function to fetch all students
      const response = await fetch("/api/students"); // Example API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      return await response.json();
    },
  });

  const { mutate: createCheatingRecordMutation, isPending } = useMutation({
    mutationFn: async (data: CheatingRecordCreationType) => {
      return await createCheatingRecord(data);
    },
    onSuccess: () => {
      toast.success("Cheating Record Created Successfully");
      reset();
      queryClient.invalidateQueries(["cheating-records"]); // Invalidate cheating records query
      router.push("/cheating-records"); // Redirect to cheating records page
    },
    onError: (error) => {
      toast.error(`Failed to create cheating record: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createCheatingRecordMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    setValue,
    isPending,
    students,
    isStudentsLoading,
    studentsError,
  };
};




export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BudgetCreationType>({
    resolver: zodResolver(BudgetCreationSchema),
    mode: "onBlur",
    defaultValues: {
      budgetClear: false, // Set the default value for budgetClear
    },
  });

  const router = useRouter();

  // Fetch Organizations for Dropdown
  const { data: organizations, isLoading: isOrganizationsLoading, error: organizationsError } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await fetch("/api/organizations"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      return await response.json(); // Ensure this returns an array of organization objects
    },
  });

  const { mutate: createBudgetMutation, isPending } = useMutation({
    mutationFn: async (data: BudgetCreationType) => {
      return await createBudget(data);
    },
    onSuccess: () => {
      toast.success("Budget Created Successfully");
      reset();
      queryClient.invalidateQueries(["budgets"]); // Invalidate budgets query
      router.push("/budgets"); // Redirect to budgets page
    },
    onError: (error) => {
      toast.error(`Failed to create budget: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createBudgetMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
    organizations,
    isOrganizationsLoading,
    organizationsError,
  };
};




export const useCreateBudgetTransaction = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BudgetTransactionCreationType>({
    resolver: zodResolver(BudgetTransactionCreationSchema),
    mode: "onBlur",
    defaultValues: {
      verified: false, // Set default value for verified
    },
  });

  const router = useRouter();

  // Fetch Budgets for Dropdown
  const { data: budgets, isLoading: isBudgetsLoading, error: budgetsError } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await fetch("/api/budgets"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      return await response.json(); // Ensure this returns an array of budget objects
    },
  });

  const { mutate: createBudgetTransactionMutation, isPending } = useMutation({
    mutationFn: async (data: BudgetTransactionCreationType) => {
      return await createBudgetTransaction(data);
    },
    onSuccess: () => {
      toast.success("Budget Transaction Created Successfully");
      reset();
      queryClient.invalidateQueries(["budget-transactions"]); // Invalidate budget transactions query
      router.push("/budget-transactions"); // Redirect to budget transactions page
    },
    onError: (error) => {
      toast.error(`Failed to create budget transaction: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createBudgetTransactionMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
    budgets,
    isBudgetsLoading,
    budgetsError,
  };
};



export const useCreateElectionsList = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ElectionsListCreationType>({
    resolver: zodResolver(ElectionsListCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const { mutate: createElectionsListMutation, isPending } = useMutation({
    mutationFn: async (data: ElectionsListCreationType) => {
      return await createElectionsList(data);
    },
    onSuccess: () => {
      toast.success("Election List Created Successfully");
      reset();
      queryClient.invalidateQueries(["elections-lists"]); // Invalidate elections lists query
      router.push("/elections-lists"); // Redirect to elections lists page
    },
    onError: (error) => {
      toast.error(`Failed to create election list: ${error?.message || "Unknown error"}`);
    },
  });
  const onSubmit = handleSubmit((values) => {
    createElectionsListMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
  };
};



export const useCreateElection = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ElectionCreationType>({
    resolver: zodResolver(ElectionCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  // Fetch Elections Lists for Dropdown
  const { data: electionsLists, isLoading: isElectionsListsLoading, error: electionsListsError } = useQuery({
    queryKey: ["elections-lists"],
    queryFn: async () => {
      const response = await fetch("/api/elections-lists"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch elections lists");
      }
      return await response.json(); // Ensure this returns an array of elections list objects
    },
  });

  const { mutate: createElectionMutation, isPending } = useMutation({
    mutationFn: async (data: ElectionCreationType) => {
      return await createElection(data);
    },
    onSuccess: () => {
      toast.success("Election Created Successfully");
      reset();
      queryClient.invalidateQueries(["elections"]); // Invalidate elections query
      router.push("/elections"); // Redirect to elections page
    },
    onError: (error) => {
      toast.error(`Failed to create election: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createElectionMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
    electionsLists,
    isElectionsListsLoading,
    electionsListsError,
  };
};


export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CandidateCreationType>({
    resolver: zodResolver(CandidateCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  // Fetch Elections for Dropdown
  const { data: elections, isLoading: isElectionsLoading, error: electionsError } = useQuery({
    queryKey: ["elections"],
    queryFn: async () => {
      const response = await fetch("/api/elections"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch elections");
      }
      return await response.json(); // Ensure this returns an array of election objects
    },
  });

  // Fetch Students for Dropdown
  const { data: students, isLoading: isStudentsLoading, error: studentsError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/students"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      return await response.json(); // Ensure this returns an array of student objects
    },
  });

  const { mutate: createCandidateMutation, isPending } = useMutation({
    mutationFn: async (data: CandidateCreationType) => {
      return await createCandidate(data);
    },
    onSuccess: () => {
      toast.success("Candidate Created Successfully");
      reset();
      queryClient.invalidateQueries(["candidates"]); // Invalidate candidates query
      router.push("/candidates"); // Redirect to candidates page
    },
    onError: (error) => {
      toast.error(`Failed to create candidate: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createCandidateMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
    elections,
    isElectionsLoading,
    students,
    isStudentsLoading,
  };
};


export const useCreateVote = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VoteCreationType>({
    resolver: zodResolver(VoteCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  // Fetch Candidates for Dropdown
  const { data: candidates, isLoading: isCandidatesLoading, error: candidatesError } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const response = await fetch("/api/candidates"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      return await response.json(); // Ensure this returns an array of candidate objects
    },
  });

  // Fetch Students (Voters) for Dropdown
  const { data: students, isLoading: isStudentsLoading, error: studentsError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/students"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      return await response.json(); // Ensure this returns an array of student objects
    },
  });

  // Fetch Elections for Dropdown
  const { data: elections, isLoading: isElectionsLoading, error: electionsError } = useQuery({
    queryKey: ["elections"],
    queryFn: async () => {
      const response = await fetch("/api/elections"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch elections");
      }
      return await response.json(); // Ensure this returns an array of election objects
    },
  });

  const { mutate: createVoteMutation, isPending } = useMutation({
    mutationFn: async (data: VoteCreationType) => {
      return await createVote(data);
    },
    onSuccess: () => {
      toast.success("Vote Cast Successfully");
      reset();
      queryClient.invalidateQueries(["votes"]); // Invalidate votes query
      router.push("/votes"); // Redirect to votes page
    },
    onError: (error) => {
      toast.error(`Failed to cast vote: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createVoteMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
    candidates,
    isCandidatesLoading,
    students,
    isStudentsLoading,
    elections,
    isElectionsLoading,
  };
};


export const useCreateFacilityReview = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FacilityReviewCreationType>({
    resolver: zodResolver(FacilityReviewCreationSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  // Fetch Facilities for Dropdown
  const { data: facilities, isLoading: isFacilitiesLoading, error: facilitiesError } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetch("/api/facilities"); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      return await response.json(); // Ensure this returns an array of facility objects
    },
  });

  const { mutate: createFacilityReviewMutation, isPending } = useMutation({
    mutationFn: async (data: FacilityReviewCreationType) => {
      return await createFacilityReview(data);
    },
    onSuccess: () => {
      toast.success("Facility Review Submitted Successfully");
      reset();
      router.push("/facility-reviews"); // Redirect to facility reviews page
    },
    onError: (error) => {
      toast.error(`Failed to submit facility review: ${error?.message || "Unknown error"}`);
    },
  });

  const onSubmit = handleSubmit((values) => {
    createFacilityReviewMutation(values);
  });

  return {
    onSubmit,
    register,
    errors,
    isPending,
    facilities,
    isFacilitiesLoading,
  };
};