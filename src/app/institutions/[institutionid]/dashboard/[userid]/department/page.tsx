// components/DepartmentListPage.tsx
"use client";

import DepartmentForm from "@/components/forms/create-department";
import { Loader } from "@/components/global/loader";
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
import {
  Button
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination"; // Assuming you have a pagination component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDepartmentData } from "@/hooks/departments";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from 'react';


interface Department {
    id: string;
    name: string;
    description?: string;
    achievements?: string;
    toppers?: string;
    institutionId: string;
}

interface DepartmentListPageProps {
    params: { institutionid: string; userid: string; };
}

const DepartmentListPage: React.FC<DepartmentListPageProps> = ({ params }) => {
    const { institutionid } = params;
    const {
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
        getDepartmentById
    } = useDepartmentData(institutionid);
    const router = useRouter();
    const pathname = usePathname();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const handleRowClick = (id: string) => {
        router.push(`${pathname}/${id}`);
    };

    const handleOpenUpdateModal = (department: Department) => {
        setSelectedDepartment(department);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setSelectedDepartment(null);
        setIsUpdateModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        await deleteDepartment(id);
        await fetchDepartments()
    };

    const columns = [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Description",
            accessorKey: "description",
        },
        {
            header: "Actions",
            accessorKey: "actions",
        },
    ];

    return (
      <Loader loading={loading} >
          <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Top Section */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Departments</h1>
                <div className="flex items-center gap-4 self-end">
                    <Input
                        type="text"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)}>Create Department</Button>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.accessorKey}>{column.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.map((department) => (
                        <TableRow key={department.id} onClick={() => handleRowClick(department.id)} className="cursor-pointer hover:bg-gray-100">
                            <TableCell>{department.name}</TableCell>
                            <TableCell>{department.description}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenUpdateModal(department);
                                    }}>Update</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive" onClick={(e) => e.stopPropagation()}>Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => {
                                                  handleDelete(department.id)
                                                }}
                                                >Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination
                    count={totalCount || 0}
                    page={currentPage}
                    onPageChange={(newPage) => setCurrentPage(newPage)}
                    pageSize={pageSize}
                />
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Department</DialogTitle>
                    </DialogHeader>
                    <DepartmentForm
                        institutionId={institutionid}
                        onSuccess={async () => {
                            setIsCreateModalOpen(false);
                            await fetchDepartments();
                        }}
                        onCancel={() => setIsCreateModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Department</DialogTitle>
                    </DialogHeader>
                    {selectedDepartment && (
                        <DepartmentForm
                            institutionId={institutionid}
                            department={selectedDepartment}
                            onSuccess={async () => {
                                handleCloseUpdateModal();
                                await fetchDepartments();
                            }}
                            onCancel={handleCloseUpdateModal}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Loading and Error Handling */}
            {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        </div>
      </Loader>
    );
};

export default DepartmentListPage;
