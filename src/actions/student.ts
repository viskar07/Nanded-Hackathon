'use server'

import { client } from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

interface StudentData {
    name: string;
    email: string;
    password?: string;
    profile?: string;
    bloodGroup?: string;
    hobbies?: string[];
    achievements?: string[];
    dob?: Date;
    gender: 'MALE' | 'FEMALE' ;
    clubs?: string[];
    role?: string | null;
    classId?: string;
    departmentId: string;
    parentName: string;
    parentMobile: string;
    parentEmail: string;
    institutionId: string;
}

export const createStudent = async (data: StudentData) => {
    console.log("Received student data:", data);

    try {
        const user = await currentUser();
        if (!user) {
            console.error("Unauthorized: No user found");
            return { message: "Unauthorized", status: 401 }; // Return error response
        }

        console.log("Authenticated User:", user);

        const newStudent = await client.student.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password!, // Ensure this is hashed before storing
                profile: data.profile,
                bloodGroup: data.bloodGroup,
                dob: data.dob,
                gender: data.gender,
                classId: data.classId,
                departmentId: data.departmentId,
                parentName: data.parentName,
                parentMobile: data.parentMobile,
                parentEmail: data.parentEmail,
                institutionId: data.institutionId,
                isActive: true, // Default value for isActive
            },
        });

        console.log("Student Created Successfully:", newStudent);

        // Fetch Institution Data to get Clerk Organization ID
        const institution = await client.institution.findUnique({
            where: {
                id: data.institutionId,
            },
        });

        if (!institution?.clerkOrganizationId) {
            console.error("Institution not linked to Clerk Organization");
            return { message: "Institution not linked to Clerk Organization", status: 400 };
        }

        // Invite student to Clerk Organization
        try {
            await clerkClient().organizations.createOrganizationInvitation({ // Call as a function
                organizationId: institution.clerkOrganizationId,
                emailAddress: data.email,
                role: "org:student", //This is an organisation role make sure it exists
                inviterUserId: user.id!,
            });
            console.log("Student invitation sent successfully");
        } catch (invitationError:any) {
            console.error("Error sending invitation:", invitationError);
            return {
                message: `Failed to send invitation: ${invitationError.message || "Unknown error"}`,
                status: 500,
            };
        }

        return { status: 200, message: "Student created and invited successfully", studentId: newStudent.id };
    } catch (error: any) {
        console.error("Error creating student:", error);
        return { message: error.message || "Failed to create student", status: 500 };
    }
};
