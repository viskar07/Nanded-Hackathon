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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import useOrganizationManagement from "@/hooks/orgnization";
import { Organization, OrganizationType } from "@prisma/client";
import Pagination from "../_components/dashboard-global/Pagination";
interface OrganizationListPageProps {
  params: { institutionid: string; userid: string };
}

const OrganizationListPage = ({
  params,
}: {
  params: { institutionid: string; userid: string };
}) => {
  const { institutionid } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [updateModalOpen, setUpdateModalOpen] = React.useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    React.useState<Organization | null>(null);

  const {
    organizations,
    loading,
    error,
    totalCount,
    page,
    setPage,
    fetchData,
    handleUpdate,
    handleDelete,
  } = useOrganizationManagement(institutionid);
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const handleUpdateOrganization = async (
    id: string,
    updatedData: Partial<Organization>
  ) => {
    try {
      // Call the handleUpdate function
      await handleUpdate(id, updatedData);

      // Optionally, show a success message
      toast({
        title: "Success",
        description: "Organization updated successfully.",
      });

      // Close the modal
      setUpdateModalOpen(false);

      // Fetch data again to refresh the list
      await fetchData();
    } catch (error: any) {
      // If there's an error, show an error message
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update organization.",
      });
    }
  };
  const handleDeleteOrganization = async (id: string) => {
    try {
      // Call the handleDelete function
      await handleDelete(id);

      // Optionally, show a success message
      toast({
        title: "Success",
        description: "Organization deleted successfully.",
      });

      // Fetch data again to refresh the list
      await fetchData();
    } catch (error: any) {
      // If there's an error, show an error message
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete organization.",
      });
    }
  };
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Name",
      accessor: "name",
      className: "hidden md:table-cell",
    },
    {
      header: "Type",
      accessor: "type",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "actions",
    },
  ];
  const renderRow = (item: Organization) => (
    <>
      <TableCell className="flex items-center gap-4 p-4">
        <Image
          src={item.background || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.type}</p>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{item.name}</TableCell>
      <TableCell className="hidden md:table-cell">{item.type}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Update</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit organization</DialogTitle>
                <DialogDescription>
                  Make changes to update the organization by entering the
                  followng information. Click save when youre done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    defaultValue={item.name}
                    onChange={(e) =>
                      setSelectedOrganization({
                        ...item,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    defaultValue={item.type}
                    onValueChange={(value) =>
                      setSelectedOrganization({
                        ...item,
                        type: value as OrganizationType,
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrganizationType.Club}>
                        Club
                      </SelectItem>
                      <SelectItem value={OrganizationType.Department}>
                        Department
                      </SelectItem>
                      <SelectItem value={OrganizationType.CollegeEvent}>
                        College Event
                      </SelectItem>
                      <SelectItem value={OrganizationType.Mess}>Mess</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() =>
                  handleUpdateOrganization(item.id, selectedOrganization!)
                }
              >
                Update
              </Button>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want to
                  permanently delete this organization?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteOrganization(item.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Organization
        </h1>
        <div className="flex items-center gap-4 self-end"></div>
      </div>

      {/* ERROR MESSAGE */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* LIST */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessor}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((item) => (
            <TableRow key={item.id}>{renderRow(item)}</TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <Pagination page={page} count={totalCount} onPageChange={setPage} />
    </div>
  );
};

export default OrganizationListPage;
