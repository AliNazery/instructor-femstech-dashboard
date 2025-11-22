import React from "react";
import empty from "../../../public/images/empty/empty.png";

type EmptyStateProps = {
  title?: string;
  description?: string;
  fullScreen?: boolean;
  action?: React.ReactNode;
  className?: string;
  imageSrc?: string;
  alt?: string;
};

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is currently nothing to show. Try adding new items to get started.",
  fullScreen = false,
  action,
  className = "",
  imageSrc = empty,
  alt = "Empty state illustration",
}: Readonly<EmptyStateProps>) {
  const containerClass = fullScreen
    ? "flex flex-col items-center justify-center min-h-[60vh] w-full px-4"
    : "flex flex-col items-center justify-center py-12 px-4";

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Illustration */}
      <div className="mb-2 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={alt}
          className="w-2xl h-full sm:w-[400px] sm:h-[400px] object-contain"
        />
      </div>

      {/* Text content */}
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-500 max-w-md text-center mb-2">
        {description}
      </p>

      {/* Action button / element */}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
