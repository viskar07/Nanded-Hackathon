// lib/actions/departmentActions.ts
"use server";
import { client } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getInstitutionbyclerkid } from "./institution";

interface DepartmentPayload {
    name: string;
    description?: string;
    achievements?: string;
    toppers?: string;
    institutionId: string;
}

export const createDepartmentAction = async (payload: DepartmentPayload) => {
    try {
        const department = await client.department.create({
            data: payload,
        });
        revalidatePath('/departments');
        return { success: true, data: department };
    } catch (error: any) {
        console.error("Error creating department:", error);
        return { success: false, error: error.message || "Failed to create department" };
    }
};

export const updateDepartmentAction = async (id: string, payload: Partial<DepartmentPayload>) => {
    try {
        const department = await client.department.update({
            where: { id },
            data: payload,
        });
        revalidatePath('/departments');
        return { success: true, data: department };
    } catch (error: any) {
        console.error("Error updating department:", error);
        return { success: false, error: error.message || "Failed to update department" };
    }
};

export const deleteDepartmentAction = async (id: string) => {
    try {
        await client.department.delete({
            where: { id },
        });
        revalidatePath('/departments');
        return { success: true, message: "Department deleted successfully" };
    } catch (error: any) {
        console.error("Error deleting department:", error);
        return { success: false, error: error.message || "Failed to delete department" };
    }
};

export const getDepartmentsAction = async (institutionId: string, page: number = 1, pageSize: number = 10, search: string = "") => {
    try {
        const institute = await getInstitutionbyclerkid(institutionId)
        const skip = (page - 1) * pageSize;

        const where = {
            institutionId: institute.data?.id,
            name: {
                contains: search,
                mode: "insensitive" as const,
            },
        };

        const [departments, totalCount] = await Promise.all([
            client.department.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    name: 'asc',
                },
            }),
            client.department.count({ where }),
        ]);

        return {
            success: true,
            data: departments,
            totalCount,
        };
    } catch (error: any) {
        console.error("Error fetching departments:", error);
        return { success: false, error: error.message || "Failed to fetch departments", data: [], totalCount: 0 };
    }
};

export const getDepartmentByIdAction = async (id: string) => {
    try {
        const department = await client.department.findUnique({
            where: { id },
        });
        if (!department) {
            return { success: false, error: "Department not found" };
        }
        return { success: true, data: department };
    } catch (error: any) {
        console.error("Error fetching department by ID:", error);
        return { success: false, error: error.message || "Failed to fetch department", data: null };
    }
};

export async function fetchDepartments(organizationId:String) {
    try {
        console.log("Fetching departments from the database...");
        const departments = await client.department.findMany({
            select: {
                id: true,
                name: true,
            },
            where:{
                id: organizationId
            }
        });
        console.log(`Fetched ${departments.length} departments:`, departments);
        return departments;
    } catch (error: any) {
        console.error("Error fetching departments:", error);
        throw new Error(`Failed to fetch departments: ${error.message}`);
    }
}


