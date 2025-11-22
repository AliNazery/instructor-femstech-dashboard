import React from "react";

type CoursePublishCardProps = {
  isPublished: boolean;
  publishing: boolean;
  onToggle: () => void;
};

const CoursePublishCard: React.FC<CoursePublishCardProps> = ({
  isPublished,
  publishing,
  onToggle,
}) => {
  return (
    <div
      className="
        w-full rounded-xl border border-gray-200 dark:border-gray-700 
        shadow-md p-4 sm:p-5 md:p-6 
        bg-white dark:bg-gray-900 
        flex flex-col sm:flex-row sm:items-start md:items-center md:justify-between 
        gap-4 sm:gap-5 md:gap-6
      "
    >
      {/* --- Left: Info Section --- */}
      <div className="flex-1 text-center sm:text-left">
        <h3
          className="
            text-base sm:text-lg md:text-xl 
            font-semibold text-gray-900 dark:text-white mb-1
          "
        >
          {isPublished ? "Course is Published" : "Course is in Draft"}
        </h3>

        <p
          className="
            text-xs sm:text-sm md:text-base 
            text-gray-600 dark:text-gray-300 leading-snug max-w-lg mx-auto sm:mx-0
          "
        >
          {isPublished
            ? "Your course is live and visible to students."
            : "The course is currently in draft. Publish it to make it available to students."}
        </p>
      </div>

      {/* --- Right: Status Badge + Action Button --- */}
      <div
        className="
          flex flex-col sm:flex-row items-center justify-center 
          gap-3 sm:gap-4 mt-3 sm:mt-0
        "
      >
        {/* Badge */}
        <span
          className={`
            px-3 sm:px-4 py-1 sm:py-1.5 
            text-xs sm:text-sm font-semibold rounded-full
            ${
              isPublished
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          {isPublished ? "Published" : "Draft"}
        </span>

        {/* Button */}
        <button
          onClick={onToggle}
          disabled={publishing}
          className={`
            w-full sm:w-auto px-4 sm:px-5 py-1.5 sm:py-2
            text-sm sm:text-base font-medium rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-offset-1
            transition-all duration-200 
            ${
              isPublished
                ? "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }
            ${publishing ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {publishing
            ? "Updating..."
            : isPublished
            ? "Unpublish"
            : "Publish Now"}
        </button>
      </div>
    </div>
  );
};

export default CoursePublishCard;
