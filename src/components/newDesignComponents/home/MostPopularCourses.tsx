import { Link } from "react-router-dom";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ArrowUpIcon, ArrowDownIcon, Loader2 } from "lucide-react";
import { useGetMostPopularCoursesQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

export default function MostPopularCourses() {
  const { data, isLoading, isError } = useGetMostPopularCoursesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        No popular courses found.
      </div>
    );
  }

  const courses = data.data.slice(0, 4);

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-brand-950 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-lg transition-all">
      <header className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white/90">
          Most Popular Courses
        </h3>
        <Link
          to="/instructor/popular-courses"
          className="text-sm font-medium text-brand-950 hover:underline"
        >
          View All →
        </Link>
      </header>

      {/* TABLE: visible on md+ */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-900/20">
            <TableRow>
              <TableCell isHeader className="px-4 py-3 text-left">
                Course
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left">
                Students
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left">
                Revenue
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.map((course, idx) => {
              const revenue = parseFloat(course.total_revenue ?? "0");
              const trend = revenue > 0 ? "up" : "down";

              return (
                <TableRow
                  key={course.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-all ${
                    idx < courses.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800"
                      : ""
                  }`}
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm bg-gray-100">
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-gray-800 dark:text-white/90 font-medium line-clamp-1">
                        {course.title}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                    {course.total_students}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-800 dark:text-white/90 font-semibold">
                      ${revenue.toLocaleString()}
                      {trend === "up" ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={course.is_published ? "success" : "warning"}
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* CARD LAYOUT: visible on small screens */}
      <div className="block md:hidden p-4 space-y-4">
        {courses.map((course) => {
          const revenue = parseFloat(course.total_revenue ?? "0");
          const trend = revenue > 0 ? "up" : "down";

          return (
            <div
              key={course.id}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white line-clamp-1">
                    {course.title}
                  </h4>

                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      👩‍🎓 {course.total_students}{" "}
                      <span className="hidden xs:inline">students</span>
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      ${revenue.toLocaleString()}
                      {trend === "up" ? (
                        <ArrowUpIcon className="w-3.5 h-3.5 inline text-green-500 ml-1" />
                      ) : (
                        <ArrowDownIcon className="w-3.5 h-3.5 inline text-red-500 ml-1" />
                      )}
                    </span>
                  </div>

                  <div className="mt-2">
                    <Badge
                      size="sm"
                      color={course.is_published ? "success" : "warning"}
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
