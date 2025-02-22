// actions/institution.ts
"use server";

import { ClassSchemaType } from "@/components/forms/create-class/schema";
import { ComplaintCreationType } from "@/components/forms/create-complaint/schema";
import { CandidateCreationType } from "@/components/forms/election/create-candidate/schema";
import { ExamCreationType } from "@/components/forms/exam/exam-creation/schema";
import { client } from "@/lib/prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Application, ApplicationStatus, Class, Department, Faculty, FacultyRoleType, Organization, Student } from "@prisma/client";
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
  
    const organization = await clerkClient.organizations.createOrganization({
      name: data.name,
      createdBy  :clerk?.id!
    
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

export const getInstitutionbyclerkid = async (institutionId: string) => {
  try {
    // Fetch institution from the database
    const institution = await client.institution.findFirst({
      where: { clerkOrganizationId: institutionId }, // No need to cast to string if institutionId is already a string
    });

    if (!institution) {
      return { error: "Institution not found" };
    }

    return { status: 200, data: institution };
  } catch (error) {
    console.error("Error fetching institution:", error);
    return { error: "Failed to fetch institution" };
  }
}

export const createFaculty = async (
  data: Faculty,
) => {


  try {
      const user = await currentUser();
      if (!user) {
          console.error("Unauthorized: No user found");
          return { message: "Unauthorized", status: 401 };  // Return error response
      }


      const institute = await getInstitutionbyclerkid(data.institutionId)
      
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
              institutionId: institute.data?.id!,
          },
      });

      console.log("Faculty Created Successfully:", newFaculty);

    


      // Invite faculty to Clerk Organization
      const celrk = await clerkClient().organizations.createOrganizationInvitation({  // Call clerkClient() as a function
        organizationId: data.institutionId,
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

export async function createDepartmentAction( data:any,institutionId: string) {
  try {
    const session =  auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // const validatedData = DepartmentSchema.parse(data);

    const institute = await getInstitutionbyclerkid(institutionId)
    const department = await client.department.create({
      data: {
        ...data,
        institutionId: institute.data?.id, // Make sure to pass institutionId
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

export async function createOrganizationAction(data :any, institutionId:string ) {
  try{
      const session =  auth();

      if(!session){
          throw new Error("Unauthorized");
      }

      // const validatedData = OrganizationSchema.parse(data);
      const institute = await getInstitutionbyclerkid(institutionId)
      const organization = await client.organization.create({
          data:{
              ...data,
              institutionId:institute.data?.id! // Ensure institutionId is set
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
        createclientyId: data.reviewerId, // Assuming createdBy can be either student or faculty
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
    throw new Error("Failed to fetch departments. Please check your database connection and try again.");
  }
}

export async function getStudentsWithPagination(page: number = 1, pageSize: number = 10): Promise<{ data: Student[] | null; error: string | null; totalCount: number }> {
  try {
    const skip = (page - 1) * pageSize;

    const [students, totalCount] = await Promise.all([
      client.student.findMany({
        skip,
        take: pageSize,
        // Add order by if needed
      }),
      client.student.count(),
    ]);

    if (!students) {
      return { data: null, error: "No students found.", totalCount: 0 };
    }

    return { data: students, error: null, totalCount };
  } catch (error: any) {
    console.error("Error fetching students with pagination:", error);
    return { data: null, error: `Failed to fetch students: ${error.message}`, totalCount: 0 };
  }
}

// Get Faculty

interface GetFacultyResult {
  data: Faculty[] | null;
  error: string | null;
  totalCount: number;
}

// Get Classes
interface GetClassesResult {
  data: Class[] | null;
  error: string | null;
  totalCount: number;
}

export async function getClassesWithPagination(
  page: number = 1,
  pageSize: number = 10,
  institutionId: string | null = null  // Optional filter by institution
): Promise<GetClassesResult> {
  try {
      const skip = (page - 1) * pageSize;

      // Build the 'where' clause based on optional filters
      const whereClause = institutionId ? { institutionId } : {};  // Filter by institution if provided

      const [classes, totalCount] = await Promise.all([
          db.class.findMany({
              skip,
              take: pageSize,
              where: whereClause,  // Apply the where clause
              orderBy: {
                  name: 'asc',  // Or any other field you want to order by
              },
          }),
          db.class.count({
              where: whereClause, // Apply the same where clause for the count
          }),
      ]);

      if (!classes) {
          return { data: null, error: "No classes found.", totalCount: 0 };
      }

      return { data: classes, error: null, totalCount };
  } catch (error: any) {
      console.error("Error fetching classes with pagination:", error);
      return { data: null, error: `Failed to fetch classes: ${error.message}`, totalCount: 0 };
  }
}

// Get Dipartments
interface GetDepartmentsResult {
  data: Department[] | null;
  error: string | null;
  totalCount: number;
}

export async function getDepartmentsWithPagination(
  page: number = 1,
  pageSize: number = 10,
  institutionId: string | null = null  // Optional filter by institution
): Promise<GetDepartmentsResult> {
  try {
      const skip = (page - 1) * pageSize;

      // Build the 'where' clause based on optional filters
      const whereClause = institutionId ? { institutionId } : {};  // Filter by institution if provided

      const [departments, totalCount] = await Promise.all([
          client.department.findMany({
              skip,
              take: pageSize,
              where: whereClause,  // Apply the where clause
              orderBy: {
                  name: 'asc',  // Or any other field you want to order by
              },
               include: { // Include related fields
                  faculty: true,
                  student: true,
              }
          }),
          client.department.count({
              where: whereClause, // Apply the same where clause for the count
          }),
      ]);

      if (!departments) {
          return { data: null, error: "No departments found.", totalCount: 0 };
      }

      return { data: departments, error: null, totalCount };
  } catch (error: any) {
      console.error("Error fetching departments with pagination:", error);
      return { data: null, error: `Failed to fetch departments: ${error.message}`, totalCount: 0 };
  }
}

// get Orgnisation
interface GetOrganizationsResult {
  data: Organization[] | null;
  error: string | null;
  totalCount: number;
}

export async function getOrganizationsWithPagination(
  page: number = 1,
  pageSize: number = 10,
  institutionId: string | null = null  // Optional filter by institution
): Promise<GetOrganizationsResult> {
  try {
      const skip = (page - 1) * pageSize;

      // Build the 'where' clause based on optional filters
      const whereClause = institutionId ? { institutionId } : {};  // Filter by institution if provided

      const [organizations, totalCount] = await Promise.all([
          client.organization.findMany({
              skip,
              take: pageSize,
              where: whereClause,  // Apply the where clause
              orderBy: {
                  name: 'asc',  // Or any other field you want to order by
              },
              include: {  // Include related fields
                  department: true,
                  organizationMemberships: true,
              }
          }),
          client.organization.count({
              where: whereClause, // Apply the same where clause for the count
          }),
      ]);

      if (!organizations) {
          return { data: null, error: "No organizations found.", totalCount: 0 };
      }

      return { data: organizations, error: null, totalCount };
  } catch (error: any) {
      console.error("Error fetching organizations with pagination:", error);
      return { data: null, error: `Failed to fetch organizations: ${error.message}`, totalCount: 0 };
  }
}


// Application 
interface GetApplicationsResult {
  data: Application[] | null;
  error: string | null;
  totalCount: number;
}

export async function getApplicationsWithPagination(
  page: number = 1,
  pageSize: number = 10,
  institutionId: string | null = null, // Optional filter by institution
  applicationStatus: ApplicationStatus | null = null // Optional filter by status
): Promise<GetApplicationsResult> {
  try {
      const skip = (page - 1) * pageSize;

      // Build the 'where' clause based on optional filters
      const whereClause: any = {}; // Use 'any' for now, refine later with your schema
      if (institutionId) {
          whereClause.institutionId = institutionId;
      }
      if (applicationStatus) {
          whereClause.status = applicationStatus;
      }

      const [applications, totalCount] = await Promise.all([
          client.application.findMany({
              skip,
              take: pageSize,
              where: whereClause,  // Apply the where clause
              orderBy: {
                  createdAt: 'desc',  // Order by creation date
              },
              // include: {  // Include related fields
              //     student: true,
              //     faculty: true,
              // },
          }),
          client.application.count({
              where: whereClause, // Apply the same where clause for the count
          }),
      ]);

      if (!applications) {
          return { data: null, error: "No applications found.", totalCount: 0 };
      }

      return { data: applications, error: null, totalCount };
  } catch (error: any) {
      console.error("Error fetching applications with pagination:", error);
      return { data: null, error: `Failed to fetch applications: ${error.message}`, totalCount: 0 };
  }
}

export async function updateApplicationStatus(id:string, status:ApplicationStatus){
try{
    const application = await client.application.update({
      where:{
        id:id
      },
      data:{
        status:status
      }
    })
    revalidatePath("/applications");
    return {data:application, error:null}
}catch(error:any){
  return {data:null, error : `Failed to update Application: ${error.message}`}
}
}










// Get Faculty Id


interface GetFacultyResult {
  data: Faculty[] | null;
  error: string | null;
  totalCount: number;
}

export async function getFacultyWithPagination(
  page: number = 1,
  pageSize: number = 10,
  institutionId: string | null = null  // Add institutionId as a parameter
): Promise<GetFacultyResult> {
  try {
    const skip = (page - 1) * pageSize;

      const institution =  await getInstitutionbyclerkid(institutionId!)
    // Build the 'where' clause based on optional filters
    const whereClause =  institution.data?.id
      ? { institutionId: institution.data.id }  // Filter by institution if provided
      : {};

    const [faculty, totalCount] = await Promise.all([
      client.faculty.findMany({
        skip,
        take: pageSize,
        where: whereClause,  // Apply the where clause
        orderBy: {
          name: 'asc',  // Or any other field you want to order by
        },
      }),
      client.faculty.count({
        where: whereClause, // Apply the same where clause for the count
      }),
    ]);

    if (!faculty) {
      return { data: null, error: "No faculty found.", totalCount: 0 };
    }

    return { data: faculty, error: null, totalCount: totalCount };
  } catch (error: any) {
    console.error("Error fetching faculty with pagination:", error);
    return { data: null, error: `Failed to fetch faculty: ${error.message}`, totalCount: 0 };
  }
}

export async function getAllFaculty(institutionId: string | null = null): Promise<GetFacultyResult> {
  try {

    const whereClause = institutionId
      ? { institutionId: institutionId }  // Filter by institution if provided
      : {};

    const faculty = await client.faculty.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc',
      },
    });
    const totalCount = await client.faculty.count({ where: whereClause });

    if (!faculty) {
      return { data: null, error: "No faculty found.", totalCount: 0 };
    }

    return { data: faculty, error: null, totalCount: totalCount };
  } catch (error: any) {
    console.error("Error fetching all faculty:", error);
    return { data: null, error: `Failed to fetch faculty: ${error.message}`, totalCount: 0 };
  }
}

export async function getFacultyRole(facultyId: string): Promise<{ data: FacultyRoleType | null; error: string | null }> {
  try {
    const faculty = await client.faculty.findUnique({
      where: {
        id: facultyId,
      },
      select: {
        role: true, // Select only the 'role' field
      },
    });

    if (!faculty) {
      return { data: null, error: "Faculty not found." };
    }

    return { data: faculty.role || null, error: null }; // If role is null, return null
  } catch (error: any) {
    console.error("Error fetching faculty role:", error);
    return { data: null, error: `Failed to fetch faculty role: ${error.message}` };
  }
}