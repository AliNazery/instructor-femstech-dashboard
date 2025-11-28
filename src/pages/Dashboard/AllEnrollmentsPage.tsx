import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetRecentEnrollmentsQuery } from "../../app/api/instructorOverviewApi/instructorOverviewApi";


export default function AllEnrollmentsPage() {
  const { data, isLoading, isError, refetch } = useGetRecentEnrollmentsQuery();
  const enrollments = data?.data ?? [];

  if (isLoading)
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">Loading...</div>
    );

  if (isError)
    return (
      <div className=" text-red-500">
        Failed to load enrollments.
        <button
          onClick={() => refetch()}
          className="ml-2 text-sm underline text-red-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          All Enrollments
        </h2>
        <Link
          to="/instructor/home"
          className="text-sm text-brand-500 hover:underline"
        >
          ←  Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {enrollments.map((en) => (
          <div
            key={en.id}
            className="rounded-xl border border-brand-500 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg transition"
          >
            {en.student?.avatar_url && (
              <img
                src={en.student?.avatar_url}
                alt={en.student?.first_name}
                className="w-14 h-14 rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-white/90">
                {en.student?.first_name} {en.student?.last_name}
              </h3>
              <div className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span>{en.course?.title}</span>
                {en.course?.level && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="capitalize">{en.course.level}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs mt-1 text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(en.enrolled_at).toLocaleDateString()}
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col items-end">
              <div
                className={`flex items-center gap-1 ${
                  en.payment_status === "completed"
                    ? "text-green-600"
                    : en.payment_status === "pending"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {en.payment_status === "completed" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {en.payment_status}
              </div>
              <span className="text-[11px] mt-0.5">
                Progress: {en.progress_percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
