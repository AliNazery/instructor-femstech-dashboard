import { Loader2, Users } from "lucide-react";
import { useGetMostPopularCoursesQuery } from "../../app/api/instructorOverviewApi/instructorOverviewApi";

export default function PopularCoursesPage() {
  const { data, isLoading, isError } = useGetMostPopularCoursesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No popular courses found.
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        All Popular Courses
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.data.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-40 w-full object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {course.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 text-brand-950" />
                  {course.total_students} Students
                </span>
                <span className="font-semibold text-green-600">
                  ${course.total_revenue ?? 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
