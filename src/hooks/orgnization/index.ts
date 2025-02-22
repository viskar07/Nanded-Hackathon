// hooks/useOrganizationManagement.ts
import { deleteOrganization, getOrganizations, updateOrganization } from "@/actions/orgnization";
import { Organization } from "@prisma/client";
import { useEffect, useState } from 'react';

export const useOrganizationManagement = (institutionId: string) => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const fetchData = async () => {
        setLoading(true);
        try {
            const { organizations, totalCount } = await getOrganizations(institutionId, currentPage, pageSize);
            setOrganizations(organizations);
            setTotalCount(totalCount);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch organizations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (institutionId) {
            fetchData();
        }
    }, [institutionId, currentPage]);

    const handleUpdate = async (id: string, data: Partial<Organization>) => {
        setLoading(true);
        try {
            const { success } = await updateOrganization(id, data);
            if (success) {
                await fetchData(); // Refresh the data
            } else {
                setError("Failed to update organization");
            }
        } catch (err: any) {
            setError(err.message || "Failed to update organization");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const { success } = await deleteOrganization(id);
            if (success) {
                await fetchData(); // Refresh the data
            } else {
                setError("Failed to delete organization");
            }
        } catch (err: any) {
            setError(err.message || "Failed to delete organization");
        } finally {
            setLoading(false);
        }
    };

    return {
        organizations,
        loading,
        error,
        totalCount,
        currentPage,
        setCurrentPage,
        pageSize,
        fetchData,
        handleUpdate,
        handleDelete,
    };
};

export default useOrganizationManagement;
