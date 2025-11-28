import { CalendarX2, Clock } from "lucide-react";
import LoadingSpinner from "../../common/LoadingSpinner";
import { useGetUpcomingAssignmentsQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";
import { Link } from "react-router-dom"; // 🟢 UPDATED

export default function UpcomingDeadlines() {
  const { data, isLoading, isError } = useGetUpcomingAssignmentsQuery();
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
      <div className="flex justify-center py-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-brand-500 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
        <div className="flex flex-col items-center text-center space-y-2">
          {/* Icon */}
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            <CalendarX2 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No upcoming deadlines
          </p>

          {/* Optional subtext */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You’re all caught up for now
          </p>
        </div>
      </div>
    );
  }


  // if (isError || !data?.data?.length) {
  //   return (
  //     <div className="flex flex-col items-center h-64">
  //       {/* 🟢 Smaller empty state image */}
  //       <EmptyState description="No upcoming deadlines" />
  //     </div>
  //   );
  // }

  // 🟢 Limit to 3 items
  const deadlines = (data?.data ?? []).slice(0, 3);

  return (
    <div className="rounded-2xl border border-brand-500 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] h-full transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Upcoming Assignment Deadlines
        </h3>
        {/* 🟢 Changed to Link */}
        <Link
          to="/instructor/assignments"
          className="text-xs font-medium text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition"
        >
          View All
        </Link>
      </div>

      <ul className="space-y-4">
        {deadlines.map((dl) => (
          <li
            key={dl.id}
            className="flex justify-between items-start p-3 rounded-lg border border-brand-500 transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <div className="flex items-start gap-3">
              <Clock className="size-5 mt-0.5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {dl.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {dl.description || "—"}
                </div>
              </div>
            </div>

            <div
              className={`text-xs font-medium ${getPriorityColor(
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

// import { Clock } from "lucide-react";
// import LoadingSpinner from "../../common/LoadingSpinner";
// import EmptyState from "../../common/EmptyState";
// import { useGetUpcomingAssignmentsQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

// export default function UpcomingDeadlines() {
//   const { data, isLoading, isError } = useGetUpcomingAssignmentsQuery();
//   const now = new Date();

//   const getTimeLeft = (due: string) => {
//     const diffMs = new Date(due).getTime() - now.getTime();
//     const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
//     if (diffDays <= 0) return "Due today";
//     if (diffDays === 1) return "Tomorrow";
//     return `In ${diffDays} days`;
//   };

//   const getPriorityColor = (due: string) => {
//     const diff = new Date(due).getTime() - now.getTime();
//     const days = diff / (1000 * 60 * 60 * 24);
//     if (days <= 1) return "text-red-500 dark:text-red-400";
//     if (days <= 3) return "text-amber-500 dark:text-amber-400";
//     return "text-green-600 dark:text-green-400";
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-6">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (isError || !data?.data?.length) {
//     return <EmptyState description="No upcoming deadlines" />;
//   }

//   const deadlines = data.data;

//   return (
//     <div className="rounded-2xl border border-brand-500 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] h-full transition-all">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Upcoming Assignment Deadlines
//         </h3>
//         <button className="text-xs font-medium text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition">
//           View All
//         </button>
//       </div>

//       <ul className="space-y-4">
//         {deadlines.map((dl) => (
//           <li
//             key={dl.id}
//             className="flex justify-between items-start p-3 rounded-lg border border-brand-500 transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-white/5"
//           >
//             <div className="flex items-start gap-3">
//               <Clock className="size-5 mt-0.5 text-gray-400" />
//               <div>
//                 <div className="text-sm font-medium text-gray-800 dark:text-white/90">
//                   {dl.title}
//                 </div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                   {dl.description || "—"}
//                 </div>
//               </div>
//             </div>

//             <div
//               className={`text-xs font-medium ${getPriorityColor(
//                 dl.expiration_date
//               )}`}
//             >
//               {getTimeLeft(dl.expiration_date)}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
