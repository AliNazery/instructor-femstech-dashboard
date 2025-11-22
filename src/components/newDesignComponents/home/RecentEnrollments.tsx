import { UserPlus, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetRecentEnrollmentsQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

export default function RecentEnrollments() {
  const { data, isLoading, isError, refetch } = useGetRecentEnrollmentsQuery();

  // 🔹 Loading state
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-950 bg-white dark:bg-gray-900/30 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Loading recent enrollments...
        </p>
      </div>
    );
  }

  // 🔹 Error state
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-500 dark:text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.366-.756 1.42-.756 1.786 0l6.347 13.092A1 1 0 0115.486 18H4.514a1 1 0 01-.904-1.809l6.347-13.092zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a.75.75 0 01-.75-.75V8a.75.75 0 011.5 0v3.25A.75.75 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Failed to load recent enrollments. Please try again.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const enrollments = data?.data ?? [];
  const limitedEnrollments = enrollments.slice(0, 4);

  return (
    <section className="rounded-2xl border border-brand-950 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900/30 dark:border-gray-800 shadow-sm transition-all">
      {/* Header */}
      <header className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white/90">
          Recent Enrollments
        </h3>
        {enrollments.length > 4 && (
          <Link
            to="/instructor/all-enrollments"
            className="text-sm font-medium text-brand-950 dark:text-brand-400 hover:underline"
          >
            View All →
          </Link>
        )}
      </header>

      {/* Empty State */}
      {limitedEnrollments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No recent enrollments found.
        </p>
      ) : (
        <ul className="flex flex-col gap-3 p-5">
          {limitedEnrollments.map((en) => (
            <li
              key={en.id}
              className="group flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
            >
              {/* Left section: student & course info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/30 shrink-0">
                  <UserPlus className="w-5 h-5 text-brand-950 dark:text-brand-400" />
                </div>

                <div className="flex flex-col min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white/90 truncate">
                    {en.student?.first_name} {en.student?.last_name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate max-w-[180px] sm:max-w-xs">
                      {en.course?.title}
                    </span>
                    {en.course?.level && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize">{en.course.level}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right section: date & progress */}
              <div className="flex flex-col items-start md:items-end mt-3 md:mt-0 md:ml-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  <time dateTime={en.enrolled_at}>
                    {new Date(en.enrolled_at).toLocaleDateString()}
                  </time>
                </div>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  Progress: {en.progress_percent ?? 0}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
