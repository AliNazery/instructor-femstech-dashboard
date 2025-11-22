import { Clock } from "lucide-react";
import { useGetUpcomingAssignmentsQuery } from "../../app/api/instructorOverviewApi/instructorOverviewApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";



export default function AllAssignmentsPage() {
  const { data, isLoading, isError} =
    useGetUpcomingAssignmentsQuery();
  const now = new Date();

  const getTimeLeft = (due: string) => {
    const diffMs = new Date(due).getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Due today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  const getPriorityColor = (due: string) => {
    const diff = new Date(due).getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days <= 1) return "text-red-500 dark:text-red-400";
    if (days <= 3) return "text-amber-500 dark:text-amber-400";
    return "text-green-600 dark:text-green-400";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="flex flex-col items-center py-10">
        <EmptyState
          description="No upcoming assignments"
        />
      </div>
    );
  }

  const deadlines = data.data;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        All Upcoming Assignment Deadlines
      </h2>

      <ul className="space-y-4">
        {deadlines.map((dl) => (
          <li
            key={dl.id}
            className="flex justify-between items-start p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 transition hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-900/70"
          >
            <div className="flex items-start gap-3">
              <Clock className="size-5 mt-0.5 text-gray-400" />
              <div>
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {dl.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {dl.description || "—"}
                </div>
              </div>
            </div>

            <div
              className={`text-sm font-medium ${getPriorityColor(
                dl.expiration_date
              )}`}
            >
              {getTimeLeft(dl.expiration_date)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
