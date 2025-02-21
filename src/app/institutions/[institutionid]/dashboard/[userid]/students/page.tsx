'use client'

import StudentForm from '@/components/forms/create-student';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from "react";

interface Props {
  params: {
    institutionid: string;
    userid: string;
  };
}

const StudentPage = ({ params }:Props ) => {
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
          <DialogTitle>Create Student</DialogTitle>

          <StudentForm institutionId={params.institutionid} />
          
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

export default StudentPage;
