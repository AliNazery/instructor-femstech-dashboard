import { Star, User, Clock } from "lucide-react";
import { useGetRecentReviewsQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";
import { Link } from "react-router-dom";

function StarRating({ rating }: Readonly<{ rating: number }>) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
          }
        />
      ))}
    </div>
  );
}

export default function RecentReviews() {
  const { data, isLoading, isError, refetch } = useGetRecentReviewsQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-950 bg-gradient-to-b from-white to-gray-50 p-5 shadow-sm dark:from-white/[0.03] dark:to-gray-900/30 dark:border-gray-800 transition">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading reviews...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-5 flex items-center justify-between transition-all">
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
            Failed to load recent reviews. Please try again.
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

  const reviews = (data?.data ?? []).slice(0, 3);

  return (
    <div className="rounded-2xl border border-brand-950 bg-gradient-to-b from-white to-gray-50 p-5 shadow-sm dark:from-white/[0.03] dark:to-gray-900/30 dark:border-gray-800 transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Reviews
        </h3>
        <Link
          to="/instructor/reviews"
          className="text-xs text-brand-950 dark:text-brand-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No reviews yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((rv) => (
            <li
              key={rv.id}
              className="group rounded-xl border border-brand-950 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4 transition-transform duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:border-brand-200 dark:hover:border-brand-950/30"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-800 dark:text-white/90 capitalize">
                    {rv.student?.first_name} {rv.student?.last_name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {rv.course?.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(rv.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-2">
                <StarRating rating={rv.rating} />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                “{rv.review_text}”
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// import { Star, User, Clock } from "lucide-react";
// import { useGetRecentReviewsQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

// function StarRating({ rating }: Readonly<{ rating: number }>) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <Star
//           key={i}
//           size={14}
//           className={
//             i < rating
//               ? "fill-yellow-400 text-yellow-400"
//               : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
//           }
//         />
//       ))}
//     </div>
//   );
// }

// export default function RecentReviews() {
//   const { data, isLoading, isError, refetch } = useGetRecentReviewsQuery();
//   if (isLoading) {
//     return (
//       <div className="rounded-2xl border border-brand-950 bg-gradient-to-b from-white to-gray-50 p-5 shadow-sm dark:from-white/[0.03] dark:to-gray-900/30 dark:border-gray-800 transition">
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Loading reviews...
//         </p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="rounded-2xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-5 flex items-center justify-between transition-all">
//         <div className="flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 text-red-500 dark:text-red-400"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M8.257 3.099c.366-.756 1.42-.756 1.786 0l6.347 13.092A1 1 0 0115.486 18H4.514a1 1 0 01-.904-1.809l6.347-13.092zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a.75.75 0 01-.75-.75V8a.75.75 0 011.5 0v3.25A.75.75 0 0110 12z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <p className="text-sm text-red-600 dark:text-red-400 font-medium">
//             Failed to load recent reviews. Please try again.
//           </p>
//         </div>
//         <button
//           onClick={() => refetch()}
//           className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   const reviews = data?.data ?? [];

//   return (
//     <div className="rounded-2xl border border-brand-950 bg-gradient-to-b from-white to-gray-50 p-5 shadow-sm dark:from-white/[0.03] dark:to-gray-900/30 dark:border-gray-800 transition">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Recent Reviews
//         </h3>
//         <button className="text-xs text-brand-950 dark:text-brand-400 hover:underline">
//           View All
//         </button>
//       </div>

//       {reviews.length === 0 ? (
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           No reviews yet.
//         </p>
//       ) : (
//         <ul className="space-y-3">
//           {reviews.map((rv) => (
//             <li
//               key={rv.id}
//               className="group rounded-xl border border-brand-950 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4 transition-transform duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:border-brand-200 dark:hover:border-brand-950/30"
//             >
//               <div className="flex items-start justify-between mb-1">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <User className="w-4 h-4 text-gray-400" />
//                   <span className="font-medium text-gray-800 dark:text-white/90 capitalize">
//                     {rv.student?.first_name} {rv.student?.last_name}
//                   </span>
//                   <span className="text-gray-400">•</span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400">
//                     {rv.course?.title}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//                   <Clock className="w-3 h-3" />
//                   {new Date(rv.created_at).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="mb-2">
//                 <StarRating rating={rv.rating} />
//               </div>

//               <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
//                 “{rv.review_text}”
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
