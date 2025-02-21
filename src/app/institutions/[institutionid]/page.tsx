"use client";

import { Loader } from "@/components/global/loader";
import Sidebar from "@/components/global/user-sidebar";
import useInstitutions from "@/hooks/institution";
import InstitutionCard from "../_components/institution";
import Navbar from "../_components/navbar";

interface Props {
  params: {
    institutionid: string;
  };
}

const UserInstitute = ({ params }: Props) => {
  const { isError, isLoading, institutionsData } = useInstitutions();

  if (isError) {
    return <div className="text-red-500">Error loading institutions</div>; // Show error message if there is an error
  }
  
  const InstutionSelectData =  institutionsData.find(item => item.clerkOrganizationId===params.institutionid)

  console.log(institutionsData);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="md:ml-[150px] flex flex-col flex-1 bg-white md:rounded-tl-xl overflow-y-auto border-l-[1px] border-t-[1px] border-[#28282D]">
        <Navbar />
        <Loader loading={isLoading}>
              <InstitutionCard institution={InstutionSelectData!} />
       
        </Loader>
      </div>
    </div>
  );
};

export default UserInstitute;
