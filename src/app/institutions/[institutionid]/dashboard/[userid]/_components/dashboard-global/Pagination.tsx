// components/Pagination.tsx
const Pagination = ({ page, count, onPageChange }) => {
  const totalPages = Math.ceil(count / 10);

  return (
    <div className="flex justify-between items-center mt-4">
      <button 
        disabled={page === 1} 
        onClick={() => onPageChange(page - 1)} 
        className={`px-4 py-2 bg-lamaSky text-white rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Previous
      </button>

      <span>{`Page ${page} of ${totalPages}`}</span>

      <button 
        disabled={page === totalPages} 
        onClick={() => onPageChange(page + 1)} 
        className={`px-4 py-2 bg-lamaSky text-white rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
