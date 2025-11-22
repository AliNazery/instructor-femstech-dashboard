import { useGetCourseStudentsQuery } from "../../../app/api/instructor/instructorApi";
import LoadingSpinner from "../../common/LoadingSpinner";
import EmptyState from "../../common/EmptyState";
import { UserIcon } from "lucide-react";


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
          <span className="text-sm text-gray-500">
            ({data.pagination?.total ?? students.length})
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-950 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Student
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Enrolled At
              </th>
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
                    <span>
                      {student.first_name} {student.last_name}
                    </span>
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
                      ></div>
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
    </section>
  );
}
