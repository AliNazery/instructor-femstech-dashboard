import { Clock, Star, User } from "lucide-react";
import { useGetRecentReviewsQuery } from "../../app/api/instructorOverviewApi/instructorOverviewApi";

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

export default function AllReviewsPage() {
  const { data, isLoading, isError, refetch } = useGetRecentReviewsQuery();

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading all reviews...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex justify-between items-center bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-800 rounded-xl">
        <p className="text-red-600 dark:text-red-400">
          Failed to load reviews. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="text-xs text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const reviews = data?.data ?? [];

  return (
    <div className="">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        All Course Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No reviews available.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rv) => (
            <div
              key={rv.id}
              className="rounded-xl border border-brand-500 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                {rv.student?.avatar_url ? (
                  <img
                    src={rv.student.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {rv.student?.first_name} {rv.student?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {rv.course?.title}
                  </p>
                </div>
              </div>

              <StarRating rating={rv.rating} />

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                “{rv.review_text}”
              </p>

              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(rv.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
