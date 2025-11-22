type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <nav
      className="flex items-center justify-center gap-3 mt-4 text-sm"
      aria-label="Pagination"
    >
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40"
        aria-disabled={page === 1}
      >
        Previous
      </button>

      <span className="text-neutral-600 dark:text-neutral-400">
        Page <strong>{page}</strong> of {totalPages}
      </span>

      <button
        onClick={next}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40"
        aria-disabled={page === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
