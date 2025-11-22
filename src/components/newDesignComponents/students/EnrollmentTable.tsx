import {
  Enrollment,
  Student,
} from "../../../app/api/instructor/instructor.type";
import LoadingSpinner from "../../common/LoadingSpinner";
import StudentProgressRow from "./StudentProgressRow";

type EnrollmentWithStudent = Enrollment & { student: Student };

type Props = {
  data: EnrollmentWithStudent[];
  onViewStudentDetails: (student: Student) => void;
  isLoading?: boolean;
};

export default function EnrollmentTable({
  data,
  onViewStudentDetails,
  isLoading,
}: Readonly<Props>) {
  if (isLoading) return <LoadingSpinner />;
  if (data.length === 0)
    return <div className="text-center py-6">No enrollments found.</div>;

  return (
    <div className="bg-white rounded-md shadow-sm border border-brand-950 p-2">
      {/* 🖥️ Table view — shown on sm and larger */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-left font-semibold">Course</th>
              <th className="px-4 py-2 text-left font-semibold">Enrolled</th>
              <th className="px-4 py-2 text-left font-semibold">Progress</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((enrollment) => {
              const studentName = `${enrollment.student.first_name} ${enrollment.student.last_name}`;
              const studentEmail = enrollment.student.email;
              const courseTitle = enrollment.course?.title || "N/A";

              return (
                <tr key={enrollment.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{studentName}</td>
                  <td className="px-4 py-2 text-gray-600">{studentEmail}</td>
                  <td className="px-4 py-2">{courseTitle}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <StudentProgressRow
                      progress={parseFloat(enrollment.progress_percent)}
                      completedAt={enrollment.completed_at ?? ""}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onViewStudentDetails(enrollment.student)}
                      className="text-brand-950 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📱 Card view — shown only on mobile */}
      <div className="block sm:hidden divide-y divide-gray-100">
        {data.map((enrollment) => {
          const studentName = `${enrollment.student.first_name} ${enrollment.student.last_name}`;
          const studentEmail = enrollment.student.email;
          const courseTitle = enrollment.course?.title || "N/A";
          const enrolledDate = new Date(
            enrollment.enrolled_at
          ).toLocaleDateString();

          return (
            <div
              key={enrollment.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-all duration-200"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {studentName}
                </h3>
                <p className="text-sm text-gray-500">{studentEmail}</p>
              </div>

              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Course: </span>
                  {courseTitle}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Enrolled: </span>
                  {enrolledDate}
                </p>
              </div>

              <div className="mt-3">
                <span className="font-medium text-gray-700 text-sm">
                  Progress:
                </span>
                <div className="mt-1">
                  <StudentProgressRow
                    progress={parseFloat(enrollment.progress_percent)}
                    completedAt={enrollment.completed_at ?? ""}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onViewStudentDetails(enrollment.student)}
                  className="text-brand-950 text-sm font-medium hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
