'use client'

import DepartmentForm from '@/components/forms/create-department';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from "react";

// Define the props interface for better type safety
interface DepartmentPageProps {
  params: {
    institutionid: string;
    userid: string;
  };
}

// Use the interface to define the props for the component
const DepartmentPage = ({ params }: DepartmentPageProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
console.log(params);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button onClick={handleOpen} className="btn btn-primary">
            Create
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Department</DialogTitle>
          {/* Pass the institutionId to FacultyForm */}
          <DepartmentForm institutionId={params.institutionid} />
          <DialogClose asChild>
            <button onClick={handleClose} className="btn btn-secondary mt-4">
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentPage;
