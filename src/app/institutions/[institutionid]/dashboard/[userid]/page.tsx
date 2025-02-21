import StudentPage from "./_components/dashboard/student"

type Props = {}

const DashboardPage = (props: Props) => {
  return (
    <div className="w-full h-full">
      {/* <AdminPage /> */}
      {/* <FacultyPage /> */}
      <StudentPage />

    </div>
  )
}

export default DashboardPage