'use client'
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstitutions } from "@/hooks/institution";
import { Building2, Plus } from 'lucide-react';
import Link from "next/link";
import Navbar from "./_components/navbar";




const UserInstitute = () => {

  return (
    <div className="flex h-screen w-full">
      <div className="w-full flex flex-col flex-1 bg-white md:rounded-tl-xl overflow-y-auto border-l-[1px] border-t-[1px] border-[#28282D]">
        <Navbar />
            <OrganizationsPage />
      </div>
    </div>
  );
};

export default UserInstitute;






const OrganizationBox = ({ organization }: { organization:any }) => (
 <Link href={`/institutions/${organization.clerkOrganizationId}`}>
     <Card className="w-full h-full cursor-pointer hover:bg-accent transition-colors">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Building2 className="w-5 h-5" />
        <span>{organization.name}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{organization.description}</p>
    </CardContent>
  </Card>
 </Link>
)

const AddBox = () => (
    <Link href="/institutions/create"> {/* Change to your desired route */}
    <Card className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
      <Button variant="ghost" className="text-2xl">
        <Plus className="w-8 h-8" />
        <span className="sr-only">Add new organization</span>
      </Button>
    </Card>
  </Link>
)

export function OrganizationsPage() {
    const { isError, isLoading, institutionsData } = useInstitutions(); // ✅ Use correctly
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Organizations</h1>
  
        <Loader loading={isLoading}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {institutionsData && institutionsData.map((org) => (
              <div key={org.id} className="w-full max-w-sm">
                <OrganizationBox organization={org} />
              </div>
            ))}
            <div className="w-full max-w-sm">
              <AddBox />
            </div>
          </div>
        </Loader>
  
        {isError && <p className="text-red-500 text-center mt-4">Failed to load organizations.</p>}
      </div>
    );
  }
  
