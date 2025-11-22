import { FC, JSX } from "react";

interface RevenueSummaryCardProps {
  title: string;
  value: string; // e.g., "12.3456" or "$1234"
  change: string;
  icon: JSX.Element;
  isPercent?: boolean; // new prop to format value as percent
}

const RevenueSummaryCard: FC<RevenueSummaryCardProps> = ({
  title,
  value,
  change,
  icon,
  isPercent = false,
}) => {
  const isPositive = parseFloat(change.replace("%", "")) > 0;

  // Format value only if it's a percent
  const formattedValue = isPercent ? parseFloat(value).toFixed(1) + "%" : value;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-neutral-700 min-w-0">
      {/* Left section */}
      <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
        <div
          className={`p-3 rounded-full flex-shrink-0 flex items-center justify-center ${
            isPositive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {icon}
        </div>
        <div className="truncate min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate">
            {formattedValue}
          </p>
        </div>
      </div>

      {/* Right section */}
      <span
        className={`mt-2 sm:mt-0 text-sm font-medium ${
          isPositive ? "text-green-600" : "text-red-500"
        }`}
      >
        {change}
      </span>
    </div>
  );
};

export default RevenueSummaryCard;
