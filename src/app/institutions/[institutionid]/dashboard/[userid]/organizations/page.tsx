// components/OrganizationListPage.tsx
"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from 'react';

import { Pagination } from "@/components/ui/pagination";
import { useOrganizationManagement } from "@/hooks/orgnization";
import { Organization } from '@prisma/client';
import { Loader } from 'lucide-react';


interface DepartmentListPageProps {
    institutionId: string;
}

const DepartmentListPage: React.FC<DepartmentListPageProps> = ({ institutionId }) => {
    const {
        organizations,
        loading,
        error,
        totalCount,
        currentPage,
        setCurrentPage,
        pageSize,
        handleUpdate,
        handleDelete,
        fetchData
    } = useOrganizationManagement(institutionId);

    const router = useRouter();
    const pathname = usePathname();

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

    const handleRowClick = (id: string) => {
        router.push(`${pathname}/${id}`);
    };

    const handleOpenUpdateModal = (organization: Organization) => {
        setSelectedOrganization(organization);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setSelectedOrganization(null);
        setIsUpdateModalOpen(false);
    };
    const handleDeleteOrganization = async (id: string) => {
        await handleDelete(id)
        fetchData()
    };
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Type", accessor: "type" },
        { header: "Actions", accessor: "actions" },
    ];

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Organizations</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map(column => (
                            <TableHead key={column.accessor}>{column.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {organizations.map(organization => (
                        <TableRow key={organization.id} onClick={() => handleRowClick(organization.id)}>
                            <TableCell>{organization.name}</TableCell>
                            <TableCell>{organization.type}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="sm">Update</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteOrganization(organization.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-center mt-4">
                <Pagination
                    count={totalCount || 0}
                    page={currentPage}
                    onPageChange={(newPage) => setCurrentPage(newPage)}
                    pageSize={pageSize}
                />
            </div>  
            {loading && <Loader />}
            {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        </div>
    );
};

export default DepartmentListPage;
