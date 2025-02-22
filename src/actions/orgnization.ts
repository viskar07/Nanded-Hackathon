// lib/actions/organizationActions.ts
"use server"
import { client } from "@/lib/prisma"

import { revalidatePath } from "next/cache"
import { getInstitutionbyclerkid } from "./institution"

// types/organization.ts
export interface Organization {
    id: string
    background?: string | null
    name: string
    jsonDescription?: string | null
    htmlDescription?: string | null
    type: OrganizationType
    achievements?: string | null
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    departmentId?: string | null
    institutionId: string
}

enum OrganizationType {
    Department = "Department",
    Club = "Club",
    CollegeEvent = "CollegeEvent",
    Mess = "Mess",
}

export const getOrganizations = async (
    institutionId: string,
    page: number = 1,
    pageSize: number = 10,
) => {
    try {
        const skip = (page - 1) * pageSize;

        const institute = await getInstitutionbyclerkid(institutionId);

        if (!institute || !institute.data?.id) {
            console.error("Institution not found.");
            return { organizations: [], totalCount: 0 };
        }

        const institutionDbId = institute.data.id; // Extract the ID safely

        const [organizations, totalCount] = await Promise.all([
            client.organization.findMany({
                where: { instituteId: institute.data.id, isActive: true }, // ✅ Corrected
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: { department: true }, // Include department for display
            }),
            client.organization.count({
                where: { instituteId: institute.data.id, isActive: true }, // ✅ Corrected
            }),
        ]);

        return { organizations, totalCount };
    } catch (error: any) {
        console.error("Error fetching organizations:", error);
        return { organizations: [], totalCount: 0 };
    }
};

// Update an organization
export const updateOrganization = async (
    id: string,
    data: Partial<OrganizationPayload>,
): Promise<{ success: boolean; error?: string }> => {
    try {
        await client.organization.update({
            where: { id },
            data,
        })
        revalidatePath("/organizations")
        return { success: true }
    } catch (error: any) {
        console.error("Error updating organization:", error)
        return {
            success: false,
            error: error.message || "Failed to update organization",
        }
    }
}

// Delete an organization
export const deleteOrganization = async (
    id: string,
): Promise<{ success: boolean; error?: string }> => {
    try {
        await client.organization.delete({
            where: { id },
        })
        revalidatePath("/organizations")
        return { success: true }
    } catch (error: any) {
        console.error("Error deleting organization:", error)
        return {
            success: false,
            error: error.message || "Failed to delete organization",
        }
    }
}
