export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}>) {
  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
        className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100"
      >
        Prev
      </button>

      <span className="text-gray-600 text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || disabled}
        className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}
