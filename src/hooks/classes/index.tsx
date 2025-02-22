import { deleteClass, getClasses, updateClass } from '@/actions/class';
import { Class } from '@prisma/client';
import { useEffect, useState } from 'react';

const useClassManagement = (institutionId: string) => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Fetch data function 
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            if (institutionId) {
                let result = getClasses(institutionId, page, pageSize)
                setClasses((await result).classes)
                setTotalCount((await result).totalCount)

            }
        }
        catch (err: any) {
            setError(err.message || 'Failed to fetch Classes')
        }
        finally {
            setLoading(false)
        }

    };

    useEffect(() => {
        if (institutionId) { fetchData() }
    }, [institutionId])

    // Handle Update Functionality 
    const handleUpdate = (id: string, data: Partial<Class>) => {
        setLoading(true)
        setError(null)

        updateClass(id, data).then(result => {

            if (result.success) {

                fetchData()
            }
            else {

                setError(result.error || 'Failed to update the Classes')

            }

        }).catch(err => setError(err.message || 'Failed to update the Classes')).finally(() => setLoading(false))

    };

    // Handle Delete Functionality 

    const handleDelete = (id: string) => {
        setLoading(true)

        deleteClass(id).then(result => {

            if (result.success) {

                fetchData()

            }
            else {

                setError(result.error || 'Failed to delete the Classes')

            }

        }).catch(err => setError(err.message || 'Failed to delete the Classes')).finally(() => setLoading(false))
    };

    return {

        loading,

        error,

        page,

        setPage,

        totalcount: totalCount,

        pagesize: pageSize,

        handleUpdate,

        handleDelete,

        fetchData,

        data: classes

    }


};

export default useClassManagement;
