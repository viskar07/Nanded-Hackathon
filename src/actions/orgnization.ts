// lib/actions/organizationActions.ts
"use server";
import { client } from "@/lib/prisma";
import { Organization, OrganizationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface OrganizationPayload {
    background?: string | null;
    name: string;
    jsonDescription?: string | null;
    htmlDescription?: string | null;
    type: OrganizationType;
    achievements?: string | null;
    departmentId?: string | null;
    institutionId: string;
}

// Get organizations with pagination
export const getOrganizations = async (institutionId: string, page: number = 1, pageSize: number = 8): Promise<{ organizations: Organization[]; totalCount: number }> => {
    try {
        const skip = (page - 1) * pageSize;

        const [organizations, totalCount] = await Promise.all([
            client.organization.findMany({
                where: { institutionId, isActive: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            client.organization.count({ where: { institutionId, isActive: true } }),
        ]);

        return { organizations, totalCount };
    } catch (error: any) {
        console.error("Error fetching organizations:", error);
        return { organizations: [], totalCount: 0 };
    }
};

// Update an organization
export const updateOrganization = async (id: string, data: Partial<OrganizationPayload>): Promise<{ success: boolean; error?: string }> => {
    try {
        await client.organization.update({
            where: { id },
            data,
        });
        revalidatePath('/organizations');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating organization:", error);
        return { success: false, error: error.message || "Failed to update organization" };
    }
};

// Delete an organization
export const deleteOrganization = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
        await client.organization.delete({
            where: { id },
        });
        revalidatePath('/organizations');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting organization:", error);
        return { success: false, error: error.message || "Failed to delete organization" };
    }
};
