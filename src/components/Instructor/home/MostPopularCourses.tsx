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
      <div className="p-6 text-center text-gray-600">
        No popular courses found.
      </div>
    );
  }

  const courses = data.data.slice(0, 4);

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-950 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xl transition-all">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Most Popular Courses
          </h3>

          <Link
            to="/instructor/popular-courses"
            className="text-sm text-brand-950 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        {/* Responsive table wrapper */}
        <div className="overflow-x-auto">
          <Table className="table-auto w-full min-w-[600px] md:min-w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-900/20">
              <TableRow>
                <TableCell isHeader className="text-left px-4 py-3">
                  Course
                </TableCell>
                <TableCell isHeader className="text-left px-4 py-3">
                  Students
                </TableCell>
                <TableCell isHeader className="text-left px-4 py-3">
                  Revenue
                </TableCell>
                <TableCell isHeader className="text-left px-4 py-3">
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
                    className={`hover:scale-[1.01] hover:shadow-lg transition-transform cursor-pointer rounded-xl 
                    ${
                      idx < courses.length - 1
                        ? "border-b border-brand-950 dark:border-gray-800"
                        : ""
                    }`}
                  >
                    {/* Course info */}
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-gray-800 dark:text-white/90 font-medium break-words">
                          {course.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* Students */}
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                      {course.total_students}
                    </TableCell>

                    {/* Revenue */}
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-800 dark:text-white/90 font-semibold">
                        ${revenue.toLocaleString()}
                        {trend === "up" ? (
                          <ArrowUpIcon className="text-green-500 w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="text-red-500 w-4 h-4" />
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
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
      </div>
    </div>
  );
}

// import { Link } from "react-router-dom";
// import Badge from "../../ui/badge/Badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import { ArrowUpIcon, ArrowDownIcon, Loader2 } from "lucide-react";
// import { useGetMostPopularCoursesQuery } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

// export default function MostPopularCourses() {
//   const { data, isLoading, isError } = useGetMostPopularCoursesQuery();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-6">
//         <Loader2 className="animate-spin text-gray-500" />
//       </div>
//     );
//   }

//   if (isError || !data?.data?.length) {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         No popular courses found.
//       </div>
//     );
//   }

//   const courses = data.data.slice(0, 4);

//   return (
//     <div className="overflow-hidden rounded-2xl border border-brand-950 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xl transition-all">
//       <div className="p-4">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
//             Most Popular Courses
//           </h3>

//           <Link
//             to="/instructor/popular-courses"
//             className="text-sm text-brand-950 hover:underline font-medium"
//           >
//             View All →
//           </Link>
//         </div>

//         <Table className="table-fixed">
//           <TableHeader className="bg-gray-50 dark:bg-gray-900/20">
//             <TableRow>
//               <TableCell isHeader className="text-left px-4 py-3">
//                 Course
//               </TableCell>
//               <TableCell isHeader className="text-left px-4 py-3">
//                 Students
//               </TableCell>
//               <TableCell isHeader className="text-left px-4 py-3">
//                 Revenue
//               </TableCell>
//               <TableCell isHeader className="text-left px-4 py-3">
//                 Status
//               </TableCell>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {courses.map((course, idx) => {
//               const revenue = parseFloat(course.total_revenue ?? "0");
//               const trend = revenue > 0 ? "up" : "down";

//               return (
//                 <TableRow
//                   key={course.id}
//                   className={`hover:scale-[1.01] hover:shadow-lg transition-transform cursor-pointer rounded-xl
//                   ${
//                     idx < courses.length - 1
//                       ? "border-b border-brand-950 dark:border-gray-800"
//                       : ""
//                   }`}
//                 >
//                   <TableCell className="px-4 py-3">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
//                         <img
//                           src={course.thumbnail_url}
//                           alt={course.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <span className="text-gray-800 dark:text-white/90 font-medium">
//                         {course.title}
//                       </span>
//                     </div>
//                   </TableCell>

//                   <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
//                     {course.total_students}
//                   </TableCell>

//                   <TableCell className="px-4 py-3">
//                     <div className="flex items-center gap-1 text-gray-800 dark:text-white/90 font-semibold">
//                       ${revenue.toLocaleString()}
//                       {trend === "up" ? (
//                         <ArrowUpIcon className="text-green-500 w-4 h-4" />
//                       ) : (
//                         <ArrowDownIcon className="text-red-500 w-4 h-4" />
//                       )}
//                     </div>
//                   </TableCell>

//                   <TableCell className="px-4 py-3">
//                     <Badge
//                       size="sm"
//                       color={course.is_published ? "success" : "warning"}
//                     >
//                       {course.is_published ? "Published" : "Draft"}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
