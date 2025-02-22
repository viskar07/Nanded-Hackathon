import { client } from "@/lib/prisma"; // Ensure you import your Prisma client
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Announcements from "../../_components/dashboard-global/Announcements";
import Performance from "../../_components/dashboard-global/Performance";
// Assuming you have this component

const SingleFacultyPage = async ({
  params: { facultyId },
}: {
  params: { facultyId: string };
}) => {
  const faculty = await client.faculty.findFirst({
    where: { id: facultyId },
    include: {
      department: true, // Include related department information if needed
      _count: {
        select: {
          exam: true,
          complaint: true,
          organizationMemberships: true,
          polls: true,
        },
      },
    },
  });

  if (!faculty) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3">
        {/* USER INFO CARD */}
        <div className="bg-lamaSky py-6 px-4 rounded-md flex gap-4">
          <div className="w-1/3">
            <Image
              src={faculty.profile || "/noAvatar.png"}
              alt={`${faculty.name} ${faculty.surname}`}
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-2/3 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                {faculty.name} {faculty.surname}
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              {faculty.designation || "No designation provided."}
            </p>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="flex items-center gap-2">
                <Image src="/mail.png" alt="" width={14} height={14} />
                <span>{faculty.email || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/phone.png" alt="" width={14} height={14} />
                <span>{faculty.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/date.png" alt="" width={14} height={14} />
                <span>
                  {new Intl.DateTimeFormat("en-GB").format(new Date(faculty.createdAt))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SMALL CARDS */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD for Exams */}
          <div className="bg-white p-4 rounded-md flex gap-4 items-center shadow-md">
            <Image src="/singleExam.png" alt="" width={24} height={24} />
            <div>
              <h1 className="text-xl font-semibold">{faculty._count.exam}</h1>
              <span className="text-sm text-gray-400">Exams</span>
            </div>
          </div>

          {/* CARD for Complaints */}
          <div className="bg-white p-4 rounded-md flex gap-4 items-center shadow-md">
            <Image src="/singleComplaint.png" alt="" width={24} height={24} />
            <div>
              <h1 className="text-xl font-semibold">{faculty._count.complaint}</h1>
              <span className="text-sm text-gray-400">Complaints</span>
            </div>
          </div>

          {/* CARD for Organization Memberships */}
          <div className="bg-white p-4 rounded-md flex gap-4 items-center shadow-md">
            <Image src="/singleOrganization.png" alt="" width={24} height={24} />
            <div>
              <h1 className="text-xl font-semibold">{faculty._count.organizationMemberships}</h1>
              <span className="text-sm text-gray-400">Organizations</span>
            </div>
          </div>

          {/* CARD for Polls */}
          <div className="bg-white p-4 rounded-md flex gap-4 items-center shadow-md">
            <Image src="/singlePoll.png" alt="" width={24} height={24} />
            <div>
              <h1 className="text-xl font-semibold">{faculty._count.polls}</h1>
              <span className="text-sm text-gray-400">Polls Created</span>
            </div>
          </div>
        </div>

        {/* BOTTOM - Schedule Section */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px] shadow-md">
          <h1 className="text-lg font-semibold">Faculty&apos;s Schedule</h1>
          {/* Assuming you have a calendar component for the faculty schedule */}
          {/* <BigCalendarContainer type="facultyId" id={faculty.id} /> */}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* Shortcuts Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
           {/* Links to various sections related to the faculty */}
           <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/classes?supervisorId=${faculty.id}`}
            >
              Faculty&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/students?teacherId=${faculty.id}`}
            >
              Faculty&apos;s Students
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/lessons?teacherId=${faculty.id}`}
            >
              Faculty&apos;s Lessons
            </Link>
          </div>
        </div>

        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleFacultyPage;
