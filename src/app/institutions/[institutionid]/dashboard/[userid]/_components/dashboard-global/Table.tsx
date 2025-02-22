'use client'
import { usePathname, useRouter } from "next/navigation";

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  const router = useRouter(); // Initialize the router
  const pathname = usePathname(); // Get the current pathname

  const handleRowClick = (id: string) => {
    // Redirect to the current path with the appended ID
    router.push(`${pathname}/${id}`);
  };

  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr 
            key={item.id} 
            onClick={() => handleRowClick(item.id)} 
            className="cursor-pointer hover:bg-lamaPurpleLight transition-colors"
          >
            {renderRow(item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
