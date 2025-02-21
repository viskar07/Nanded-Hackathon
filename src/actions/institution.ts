// actions/institution.ts
"use server";

import { ClassSchemaType } from "@/components/forms/create-class/schema";
import { ComplaintCreationType } from "@/components/forms/create-complaint/schema";
import { DepartmentSchema, DepartmentSchemaType } from "@/components/forms/create-department/schema";
import { OrganizationSchemaType } from "@/components/forms/create-orgnisation/schema";
import { CandidateCreationType } from "@/components/forms/election/create-candidate/schema";
import { ExamCreationType } from "@/components/forms/exam/exam-creation/schema";
import { client } from "@/lib/prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { onAuthenticatedUser } from "./auth";




export async function getInstitutionsByUserId(userId: string) {
  try {
   

    const institutions = await client.institution.findMany({
      where: {
        creatorId: userId,
      },
    });
    console.log(institutions);
    
    return { data:institutions,status:200 }; // Wrap the result in an object
  } catch (error: any) {

    return { error: "Failed to fetch institutions: " + error.message ,status:500 }; // Return an error object
  }
}
export const createInstitution = async (data: {
  name: string;
  jsonDescription?: string;
  htmlDescription?: string;
  icon?: string; // This will be the URL returned by Uploadcare
  creatorId?: string; // Assuming you have the creator's ID available
}) => {


  try {
    const clerk = await currentUser()
    const user = await onAuthenticatedUser()
    // Create organization in Clerk
    const organization = await clerkClient.organizations.createOrganization({
      name: data.name,
      createdBy :clerk?.id!
      // Add any other necessary fields for your organization
    });

    const newInstitution = await client.institution.create({
      data: {
        ...data,
        creatorId:user.id!,
      
        clerkOrganizationId: organization.id, // Set Clerk organization ID
      },
    });

    return {
      status: 201,
      institution: newInstitution,
    };
  } catch (error) {
    console.error("Error creating institution:", error);
    return {
      status: 500,
      message: "Oops! Something went wrong. Please try again.",
    };
  }
};
export const getInstitution = async (institutionId: string) => {
  try {
    // Fetch institution from the database
    const institution = await client.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      return { error: "Institution not found" };
    }

    return { status:200, data: institution };
  } catch (error) {
    console.error("Error fetching institution:", error);
    return { error: "Failed to fetch institution" };
  }
};
export const createFaculty = async (
  data: any,
) => {
  console.log("Received faculty data:", data);
  console.log("Institution ID:", data.institutionId);
  console.log("Profile URL:", data.profile);

  try {
      const user = await currentUser();
      if (!user) {
          console.error("Unauthorized: No user found");
          return { message: "Unauthorized", status: 401 };  // Return error response
      }

      console.log("Authenticated User:", user);

      const newFaculty = await client.faculty.create({
          data: {
              name: data.name,
              email: data.email,
              password: data.password,
              profile: data.profile,  // Save uploaded profile image
              designation: data.designation,
              role: data.role || null,
              isActive: data.isActive ?? true,
              institutionId: data.institutionId,
          },
      });

      console.log("Faculty Created Successfully:", newFaculty);

      // Fetch Institution Data
      const institutionResult = await getInstitution(data.institutionId);
      const institution = institutionResult?.data;

      if (!institution?.clerkOrganizationId) {
          console.error("Institution not linked to Clerk Organization");
          return { message: "Institution not linked to Clerk Organization", status: 400 }; // Return error response
      }

      console.log("Clerk Organization ID:", institution.clerkOrganizationId);

      // Invite faculty to Clerk Organization
      const celrk = await clerkClient().organizations.createOrganizationInvitation({  // Call clerkClient() as a function
        organizationId: institution.clerkOrganizationId,
        emailAddress: data.email,
        role: "org:faculty",
        inviterUserId: user.id!,
    });
      console.log(celrk);
      

      return { status: 200, message: "Faculty created and invited successfully" }; // Include a message in success response
  } catch (error: any) {
      console.error("Error creating faculty:", error);
      return { message: error.message || "Failed to create faculty", status: 500 }; // Return error response
  }
};
export async function createDepartmentAction(data: DepartmentSchemaType & { institutionId: string }) {
  try {
    const session =  auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const validatedData = DepartmentSchema.parse(data);

    const department = await client.department.create({
      data: {
        ...validatedData,
        institutionId: data.institutionId, // Make sure to pass institutionId
      },
    });

    revalidatePath("/departments");
    return department;
  } catch (error: any) {
    console.error("Error creating department:", error);
    throw new Error(error.message || "Failed to create department.");
  }
}
export async function createClassAction(data: ClassSchemaType) {
    try {
        const session =  auth();

        if (!session) {
            throw new Error("Unauthorized");
        }

        const classRecord = await client.class.create({
            data
        });

        revalidatePath("/classes");
        return classRecord;
    } catch (error: any) {
        console.error("Error creating class:", error);
        throw new Error(error.message || "Failed to create class.");
    }
}

export async function createOrganizationAction(data : OrganizationSchemaType & { institutionId:string }) {
  try{
      const session =  auth();

      if(!session){
          throw new Error("Unauthorized");
      }

      // const validatedData = OrganizationSchema.parse(data);

      const organization = await client.organization.create({
          data:{
              ...data,
              institutionId:data.institutionId // Ensure institutionId is set
          }
      });

      revalidatePath("/organizations");
      return organization;
  }
  catch(error:any){
      console.error("Error creating organization:", error);
      throw new Error(error.message || 'Failed to create organization.');
  }
}


// lib/server-actions/facility.actions.ts


export const createFacility = async (data:any) => {
  try {
    const facility = await client.facility.create({
      data: {
        name: data.name,
        description: data.description,
        images: data.images,
        ...data
      },
    });
    revalidatePath("/admin/facilities")
    return facility;
  } catch (error) {
    console.error("Error creating facility:", error);
    throw new Error("Failed to create facility");
  }
};


export const createFacilitySlot = async (data:any) => {
  try {
    const facilitySlot = await client.facilitySlot.create({
      data: {
        facilityId: data.facilityId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        maxCapacity: data.maxCapacity,
        reason: data.reason,
      },
    });
    revalidatePath(`/admin/facilities/${data.facilityId}/slots`); // Revalidate the slots page
    return facilitySlot;
  } catch (error) {
    console.error("Error creating facility slot:", error);
    throw new Error("Failed to create facility slot");
  }
};



export const createComplaint = async (data: ComplaintCreationType) => {
  try {
    const complaint = await client.complaint.create({
      data: {
        description: data.description,
        proof: data.proof,
        revealIdentity: data.revealIdentity,
      },
    });
    
    revalidatePath("/complaints"); // Revalidate complaints page
    return complaint;
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw new Error("Failed to create complaint");
  }
};

export const createExam = async (data: ExamCreationType) => {
  try {
    const exam = await client.exam.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        data: data.data,
      },
    });
    
    revalidatePath("/exams"); // Revalidate exams page
    return exam;
  } catch (error) {
    console.error("Error creating exam:", error);
    throw new Error("Failed to create exam");
  }
};

export const createCheatingRecord = async (data:any) => {
  try {
    // Assuming you have access to the facultyId in the server context
    const facultyId = "facultyId";

    const cheatingRecord = await client.cheatingRecord.create({
      data: {
        studentId: data.studentId,
        reason: data.reason,
        proof: data.proof,
        facultyId: facultyId,
      },
    });

    revalidatePath("/cheating-records"); // Revalidate cheating records page
    return cheatingRecord;
  } catch (error) {
    console.error("Error creating cheating record:", error);
    throw new Error("Failed to create cheating record");
  }
};

export const createBudget = async (data: any) => {
  try {
    const budget = await client.budget.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        organizationId: data.organizationId,
        budgetClear: data.budgetClear, // Include the budgetClear value
      },
    });
    
    revalidatePath("/budgets"); // Revalidate budgets page
    return budget;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw new Error("Failed to create budget");
  }
};

export const createBudgetTransaction = async (data: CreateBudgetTransactionProps) => {
  try {
    const budgetTransaction = await client.budgetTransaction.create({
      data: {
        budgetId: data.budgetId,
        title: data.title,
        amount: data.amount,
        description: data.description,
        receipt: data.receipt, // Store the receipt URL or UUID
        verified: data.verified, // Store the verified status
        rejectedReason: data.rejectedReason, // Optional field
      },
    });

    revalidatePath("/budget-transactions"); // Revalidate the budget transactions page to reflect new data

    return budgetTransaction; // Return the created transaction
  } catch (error) {
    console.error("Error creating budget transaction:", error);
    throw new Error("Failed to create budget transaction");
  }
};

export const createElectionsList = async (data: ElectionsListCreationType) => {
  try {
    const electionsList = await client.electionsList.create({
      data: {
        name: data.name,
      },
    });

    revalidatePath("/elections-lists"); // Revalidate the elections lists page to reflect new data

    return electionsList; // Return the created elections list
  } catch (error) {
    console.error("Error creating elections list:", error);
    throw new Error("Failed to create elections list");
  }
};


export const createCandidate = async (data: CandidateCreationType) => {
  try {
    const candidate = await client.candidate.create({
      data: {
        studentId: data.studentId,
        manifesto: data.manifesto,
        position: data.position,
        electionId: data.electionId, // Associate with the selected election
        description: data.description, // Include description field
      },
    });

    revalidatePath("/candidates"); // Revalidate the candidates page to reflect new data

    return candidate; // Return the created candidate
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw new Error("Failed to create candidate");
  }
};

export const createVote = async (data: VoteCreationType) => {
  try {
    const vote = await client.vote.create({
      data: {
        candidateId: data.candidateId,
        voterId: data.voterId, // Associate with the selected voter (student)
        electionId: data.electionId, // Associate with the selected election
      },
    });

    revalidatePath("/votes"); // Revalidate the votes page to reflect new data

    return vote; // Return the created vote
  } catch (error) {
    console.error("Error creating vote:", error);
    throw new Error("Failed to cast vote");
  }
};

export const createFacilityReview = async (data: FacilityReviewCreationType) => {
  try {
    const review = await client.facilityReview.create({
      data: {
        facilityId: data.facilityId,
        rating: data.rating,
        comment: data.comment,
        studentId: data.reviewerId, // Use reviewerId directly as student ID or faculty ID based on context
        createdById: data.reviewerId, // Assuming createdBy can be either student or faculty
      },
    });

    revalidatePath("/facility-reviews"); // Revalidate the facility reviews page to reflect new data

    return review; // Return the created review
  } catch (error) {
    console.error("Error creating facility review:", error);
    throw new Error("Failed to submit facility review");
  }
};
// Get Data
export async function fetchDepartments() {
  try {
      console.log("Fetching departments from the database...");
      const departments = await client.department.findMany({
          select: {
              id: true,
              name: true,
          },
      });
      console.log("Fetched departments:", departments);
      return departments;
  } catch (error) {
      console.error("Error fetching departments:", error);
      throw new Error("Failed to fetch departments.");
  }
}