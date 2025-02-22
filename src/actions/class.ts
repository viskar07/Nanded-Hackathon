// lib/actions/classActions.ts
"use server";
import { client } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getInstitutionbyclerkid } from "./institution";

// types/class.ts
export interface Class {
    id: string;
    name: string;
    description?: string | null;
    institutionId: string;
}

export enum ClassType {
    Lecture = "Lecture",
    Lab = "Lab",
}





interface ClassPayload {
  name: string;
  description?: string | null;
  institutionId: string;
}

// Get classes with pagination
export const getClasses = async (
  institutionId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ classes: Class[]; totalCount: number }> => {
  try {
    const skip = (page - 1) * pageSize;
    const institution = await getInstitutionbyclerkid(institutionId)
    const institutionID = institution.data?.id;
    const [classes, totalCount] = await Promise.all([

      client.class.findMany({
        where: { institutionID },
        skip,
        take: pageSize,
        orderBy:{name:"asc"}
      }),
      client.class.count({ where:{institutionID} }),
    ]);

    return { classes, totalCount };
  
} catch (error) {
      console.error("Error fetching classes:", error);
      return { classes:[],totalCount :0};
}
};

// Update a class
export const updateClass= async (
id:string,data :Partial<ClassPayload>):Promise<{success:boolean,error?:string}>=>{
try{
await client.class.update({
where:{id},
data:data});
revalidatePath('/classes');
return{success:true};
}catch(error:any){
console.error("Error updating class:", error);
return{success:false,error:error.message||"Failed to update class"};
}
};

// Delete a class 
export const deleteClass=async(id:string):Promise<{success:boolean,error?:string}>=>{
try{
await client.class.delete({where:{id}});
revalidatePath('/classes');
return{success:true};
}catch(error:any){
console.error("Error deleting class:", error);
return{success:false,error:error.message||"Failed to delete class"};
}
};
