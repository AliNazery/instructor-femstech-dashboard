import LoadingSpinner from "../../common/LoadingSpinner";
import EmptyState from "../../common/EmptyState";
import { UserIcon } from "lucide-react";
import { useGetCourseStudentsQuery } from "../../../app/api/instructor/instructorApi";


interface Props {
  courseId: number;
}

export default function CourseStudents({ courseId }: Readonly<Props>) {
  const { data, isLoading, isError } = useGetCourseStudentsQuery(courseId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data?.data?.length)
    return <EmptyState description="No students enrolled yet." />;

  const students = data.data;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Enrolled Students{" "}
          <span className="text-sm text-gray-500">({students.length})</span>
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-brand-950 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {[
                "#",
                "Student",
                "Email",
                "Phone",
                "Address",
                "Progress",
                "Enrolled At",
              ].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {students.map((s, index) => {
              const student = s.student;
              const progress = parseFloat(s.enrollment.progress_percent) || 0;

              return (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-white">
                    {student.avatar_url ? (
                      <img
                        src={student.avatar_url}
                        alt={`${student.first_name} ${student.last_name}`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    {student.first_name} {student.last_name}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]"
                    title={student.email}
                  >
                    {student.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {student.phone ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {student.address ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 w-32">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {progress.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {new Date(s.enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {students.map((s, index) => {
          const student = s.student;
          const progress = parseFloat(s.enrollment.progress_percent) || 0;

          return (
            <div
              key={student.id}
              className="bg-white dark:bg-neutral-900 border rounded-xl shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {student.avatar_url ? (
                    <img
                      src={student.avatar_url}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {student.first_name} {student.last_name}
                    </p>
                    <p
                      className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]"
                      title={student.email}
                    >
                      {student.email}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{index + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-medium">Phone: </span>
                  {student.phone ?? "-"}
                </div>
                <div>
                  <span className="font-medium">Address: </span>
                  {student.address ?? "-"}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Progress: </span>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Enrolled At: </span>
                  {new Date(s.enrollment.enrolled_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
