"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export enum ClassType {
  Lecture = "Lecture",
  Lab = "Lab",
}

interface ClassListPageProps {
  params: {
    institutionid: string;
    userid: string;
  };
}

function ClassListPage({ params }: ClassListPageProps) {
  const { institutionid, userid } = params;
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/classes?institutionid=${institutionid}&page=${page}`);
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [institutionid, page]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/classes/${id}`, { method: "DELETE" });
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError("Failed to delete class");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block text-lg font-semibold">All Classes</h2>
        <Button type="button">Create New Class</Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm">Update</Button>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Button onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>Previous</Button>
        <span className="mx-4">Page {page}</span>
        <Button onClick={() => setPage(prev => prev + 1)}>Next</Button>
      </div>
    </div>
  );
}

export default ClassListPage;
