import {  BoxIconLine, GroupIcon } from "../../../icons";
import { DollarSign, Loader2, AlertCircle } from "lucide-react";
import { useGetCoursesCountQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

export default function InstructorMetrics() {
  const { data, isLoading, isError } = useGetCoursesCountQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-6 border border-brand-500 rounded-2xl bg-white dark:bg-white/[0.03] h-[120px]">
        <Loader2 className="animate-spin w-6 h-6 text-brand-500 dark:text-brand-400" />
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          Loading metrics...
        </span>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-between p-5 rounded-2xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Failed to load instructor metrics.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );

  const stats = data?.data;

  const metrics = [
    {
      icon: <GroupIcon className="text-brand-500 size-6 dark:text-white/90" />,
      title: "Students",
      value: stats?.total_students ?? 0,
      change: 7.5,
      color: "success" ,
    },
    {
      icon: (
        <BoxIconLine className="text-brand-500 size-6 dark:text-white/90" />
      ),
      title: "Courses",
      value: stats?.total ?? 0,
      change: 3.2,
      color: "success",
    },
    {
      icon: <DollarSign className="text-brand-500 size-6 dark:text-white/90" />,
      title: "Revenue",
      value: `$${Number(stats?.total_revenue ?? 0).toFixed(2)}`,
      change: 12.1,
      color: "success",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {metrics.map((metric, i) => (
        <div
          key={i}
          className="rounded-2xl border border-brand-500 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 sm:mx-auto md:mx-0">
            {metric.icon}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-5 text-center md:text-left">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
