import { createDepartmentAction, deleteDepartmentAction, fetchDepartments, getDepartmentByIdAction, getDepartmentsAction, updateDepartmentAction } from "@/actions/department";
import { useEffect, useState } from "react";

interface Department {
    id: string;
    name: string;
    description?: string;
    achievements?: string;
    toppers?: string;
    institutionId: string;
}

export const useDepartmentData = (institutionId: string) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");

    const fetchDepartments = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getDepartmentsAction(institutionId, currentPage, pageSize, search);
            if (result.success) {
                setDepartments(result.data);
                setTotalCount(result.totalCount);
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch departments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (institutionId) {
            fetchDepartments();
        }
    }, [institutionId, currentPage, search]);

    const createDepartment = async (payload: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createDepartmentAction(payload);
            if (result.success) {
                fetchDepartments(); // Refresh the data
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError(err.message || "Failed to create department");
        } finally {
            setLoading(false);
        }
    };

    const updateDepartment = async (id: string, payload: Partial<Omit<Department, 'id' | 'createdAt' | 'updatedAt'>>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await updateDepartmentAction(id, payload);
            if (result.success) {
                fetchDepartments(); // Refresh the data
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError(err.message || "Failed to update department");
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await deleteDepartmentAction(id);
            if (result.success) {
                fetchDepartments(); // Refresh the data
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError(err.message || "Failed to delete department");
        } finally {
            setLoading(false);
        }
    };

    const getDepartmentById = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
          const result = await getDepartmentByIdAction(id);
          if (result.success) {
              return result.data;
          } else {
              setError(result.error);
              return null;
          }
      } catch (err: any) {
          setError(err.message || "Failed to fetch department");
          return null;
      } finally {
          setLoading(false);
      }
    };

    return {
        departments,
        loading,
        error,
        totalCount,
        currentPage,
        pageSize,
        search,
        setCurrentPage,
        setSearch,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        getDepartmentById,
    };
};


interface Department {
    id: string;
    name: string;
}

export const useDepartments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartmentsData = async () => {
            setIsLoadingDepartments(true);
            setFetchError(null);
            try {
                const data = await fetchDepartments();
                setDepartments(data);
            } catch (error: any) {
                setFetchError(error?.message || 'Failed to fetch departments.');
            } finally {
                setIsLoadingDepartments(false);
            }
        };

        fetchDepartmentsData();
    }, []);

    return {
        departments,
        isLoadingDepartments,
        fetchError,
    };
};