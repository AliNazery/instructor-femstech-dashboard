import { FC, ReactNode } from "react";
import { Edit3, Trash2 } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  description?: string;
  subtitle?: string | ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const buttonBaseClasses =
  "flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 duration-200";

const CourseHeader: FC<CourseHeaderProps> = ({
  title,
  description,
  subtitle,
  onEdit,
  onDelete,
  className = "",
}) => {
  return (
    <header
      className={`
        w-full border-b border-gray-200 dark:border-gray-700 pb-4
        flex flex-col gap-4 relative
        sm:flex-col md:flex-col lg:flex-row lg:items-center lg:justify-between
        ${className}
      `}
    >
      {/* --- Title & Description --- */}
      <div className="flex flex-col w-full text-center sm:text-left lg:w-auto md:mb-10 lg:mb-0">
        <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        {description && (
          <p className="text-sm sm:text-base md:text-base lg:text-base text-gray-600 dark:text-gray-400 mt-1 max-w-xl mx-auto sm:mx-0">
            {description}
          </p>
        )}

        {subtitle && (
          <div className="text-xs sm:text-sm md:text-sm lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>

      {/* --- Action Buttons --- */}
      <div
        className={`
          flex flex-col md:flex-row lg:flex-row
          gap-2
          mt-3 md:mt-0
          w-full md:w-auto
          md:absolute md:bottom-0 md:right-0 
           md:justify-end
        `}
      >
        <button
          type="button"
          onClick={onEdit}
          className={`
            ${buttonBaseClasses}
            w-full sm:w-full md:w-auto lg:w-auto
            px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5
            text-sm sm:text-base md:text-sm lg:text-base
            bg-brand-500 text-white hover:bg-brand-500 dark:focus:ring-brand-400
          `}
          aria-label="Edit Course"
        >
          <Edit3 size={16} />
          <span>Edit Course</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className={`
            ${buttonBaseClasses}
            w-full sm:w-full md:w-auto lg:w-auto
            px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5
            text-sm sm:text-base md:text-sm lg:text-base
            bg-red-700 text-white hover:bg-red-800 dark:focus:ring-red-400
          `}
          aria-label="Delete Course"
        >
          <Trash2 size={16} />
          <span>Delete Course</span>
        </button>
      </div>
    </header>
  );
};

export default CourseHeader;

