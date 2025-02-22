// components/FacultyListPage.tsx
'use client'
import FacultyForm from "@/components/forms/create-faculty";
import { useFacultyPagination } from "@/hooks/institution";
import Image from "next/image";
import { useState } from "react"; // Import useState for managing modal state
import Pagination from "../_components/dashboard-global/Pagination";
import Table from "../_components/dashboard-global/Table";
import Modal from "../_components/dashboard-global/modal";

const FacultyListPage = ({ params }: { params: { institutionid: string; userid: string; }; }) => {
  const { facultyData, totalCount, page, setPage, error } = useFacultyPagination(1, 10);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for managing modal visibility

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden md:table-cell",
    },
    {
      header: "Designation",
      accessor: "designation",
      className: "hidden md:table-cell",
    },
    {
      header: "Department",
      accessor: "departmentId", // Assuming this is a reference to the department
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item:any) => (
    <>
      <td className="flex items-center gap-4 p-4">
        <Image src={item.profile || "/noAvatar.png"} alt="" width={40} height={40} className="rounded-full object-cover" />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.designation}</td>
      <td className="hidden md:table-cell">{item.departmentId}</td> {/* Replace with department name if needed */}
    </>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Faculty</h1>
        <div className="flex items-center gap-4 self-end">
          {/* Button to open the modal */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-4 py-2 bg-lamaSky text-white rounded-md"
          >
            Create Faculty
          </button>
          {/* Faculty Form Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <FacultyForm institutionId={params.institutionid} />
          </Modal>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={facultyData} />

      {/* PAGINATION */}
      <Pagination page={page} count={totalCount} onPageChange={setPage} />
    </div>
  );
};

export default FacultyListPage;
