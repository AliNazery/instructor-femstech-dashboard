import { FC, ReactNode, useState } from "react";
import { Search } from "lucide-react";

type PageLayoutSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void; // new prop for sorting
};

const PageLayoutSection: FC<PageLayoutSectionProps> = ({
  title,
  description,
  action,
  children,
  onSearchChange,
  onSortChange,
}) => {
  // Local state to control sort input (optional, can be controlled outside)
  const [sortValue, setSortValue] = useState("");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortValue(val);
    if (onSortChange) onSortChange(val);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col  md:flex-row md:items-center md:justify-between gap-4 md:gap-0 border-b border-brand-500 dark:border-brand-700 pb-4">
        <div>
          <h2 className="text-3xl font-semibold text-brand-black dark:text-gray-100 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      {/* Search and Sort row */}
      {(onSearchChange || onSortChange) && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          {/* Search Input */}
          {onSearchChange && (
            <div className="relative w-full md:max-w-xl">
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-brand-500 transition duration-200"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 pointer-events-none"
              />
            </div>
          )}

          {/* Sort Select */}
          {onSortChange && (
            <select
              value={sortValue}
              onChange={handleSortChange}
              className="w-full md:w-48 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-brand-500 transition duration-200"
            >
              <option value="">Sort by</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="date-newest">Date: Newest</option>
              <option value="date-oldest">Date: Oldest</option>
            </select>
          )}
        </div>
      )}
      {/* Content container */}
      <div className="rounded-xl border border-brand-500 dark:border-brand-500 bg-white dark:bg-gray-900 shadow-md p-4 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default PageLayoutSection;
