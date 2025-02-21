'use client'

import FacilityForm from '@/components/forms/create-facility';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from "react";

// Define the props interface for better type safety
interface FacultyPageProps {
  params: {
    institutionid: string;
    userid: string;
  };
}

// Use the interface to define the props for the component
const FacultyPage = ({ params }: FacultyPageProps) => {
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
          <DialogTitle>Create Faculty</DialogTitle>
          {/* Pass the institutionId to FacultyForm */}
          <FacilityForm institutionId={params.institutionid} />
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

export default FacultyPage;
