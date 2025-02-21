'use client'

import ClassForm from '@/components/forms/create-class';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from "react";


const DepartmentPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);


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
          <DialogTitle>Create Class</DialogTitle>
      
          <ClassForm  />
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
