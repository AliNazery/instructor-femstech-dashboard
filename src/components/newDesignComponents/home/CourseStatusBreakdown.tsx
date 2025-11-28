import {
  BookOpen,
  Edit3,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useGetCoursesCountQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

export default function CourseStatusBreakdown() {
  const { data, isLoading, isError } = useGetCoursesCountQuery();

  if (isLoading)
    return (
      <div className="rounded-2xl border border-brand-500 bg-white p-6 dark:bg-white/[0.03] flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-6 h-6 text-brand-500 dark:text-brand-400" />
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          Loading course breakdown...
        </span>
      </div>
    );

  if (isError)
    return (
      <div className="rounded-2xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Failed to load course breakdown. Please try again.
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
  const breakdown = {
    total: stats?.total || 0,
    published: stats?.published || 0,
    drafts: stats?.unpublished || 0,
  };

  const items = [
    {
      icon: <BookOpen className="w-6 h-6 text-brand-500 dark:text-brand-400" />,
      label: "Published",
      count: breakdown.published,
      color: "brand",
      bg: "bg-brand-100 dark:bg-brand-900/30",
      percent:
        breakdown.total > 0 ? (breakdown.published / breakdown.total) * 100 : 0,
    },
    {
      icon: <Edit3 className="w-6 h-6 text-gray-600 dark:text-gray-300" />,
      label: "Unpublished",
      count: breakdown.drafts,
      color: "gray",
      bg: "bg-gray-100 dark:bg-gray-700/30",
      percent:
        breakdown.total > 0 ? (breakdown.drafts / breakdown.total) * 100 : 0,
    },
  ];

  return (
    <div className="rounded-2xl border border-brand-500 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-full transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Course Breakdown
        </h3>
        <button className="flex items-center gap-1 text-sm text-brand-500 dark:text-brand-400 hover:underline">
          Manage <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dual Progress Bar */}
      <div className="relative w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-5 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-brand-500 dark:bg-brand-400 transition-all"
          style={{ width: `${items[0].percent}%` }}
        ></div>
        <div
          className="absolute top-0 h-full bg-gray-400 dark:bg-gray-600 transition-all"
          style={{
            width: `${items[1].percent}%`,
            left: `${items[0].percent}%`,
          }}
        ></div>
      </div>

      {/* Status Summary */}
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className={`flex items-center justify-between rounded-lg p-4 ${it.bg} border border-brand-500 dark:border-gray-800 hover:scale-105 transition-transform`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/30 dark:bg-white/10">
                {it.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                  {it.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(it.percent)}% of total
                </span>
              </div>
            </div>
            <span
              className={`text-2xl font-bold min-w-[3rem] text-right ${
                it.color === "brand"
                  ? "text-brand-500 dark:text-brand-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {it.count}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-5 text-center text-base text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-gray-800 dark:text-white/90">
          {breakdown.total}
        </span>{" "}
        total courses 
      </div>
    </div>
  );
}
