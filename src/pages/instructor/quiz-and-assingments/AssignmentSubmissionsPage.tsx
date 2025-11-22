import { useParams, useNavigate } from "react-router-dom";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import { useGetAssignmentAnswersQuery } from "../../../app/api/instructor/instructorApi";
import { ArrowLeft } from "lucide-react";

export default function AssignmentSubmissionsPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAssignmentAnswersQuery({ assignment_id: Number(assignmentId) });

  const submissions = response?.data ?? [];

  // --- Extracted UI States (fix SonarQube nested ternary issue) ---
  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <p className="text-center text-gray-500 py-6">Loading submissions...</p>
    );
  } else if (isError) {
    content = (
      <p className="text-center text-red-500 py-6">
        Failed to load submissions.
      </p>
    );
  } else if (submissions.length === 0) {
    content = (
      <p className="text-center text-gray-500 py-6">
        No submissions found for this assignment.
      </p>
    );
  } else {
    content = (
      <div className="overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-lg">
        {/* Table for md/lg screens */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800 hidden sm:table">
          <thead className="bg-gray-50 dark:bg-neutral-800/40">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Student
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Submitted At
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Title
              </th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {submissions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                  {item.student.first_name} {item.student.last_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.student.email}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(item.submitted_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                  {item.title}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() =>
                      navigate(
                        `/instructor/course/content/assignment/assignment-submissions/${item.id}`,
                        { state: { submission: item } }
                      )
                    }
                    className="px-4 py-2 text-xs font-medium text-white bg-brand-950 rounded hover:bg-brand-700 transition"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Card layout for mobile */}
        <div className="flex flex-col gap-3 sm:hidden ">
          {submissions.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-neutral-800 rounded-lg p-2 bg-gray-50 dark:bg-neutral-800/40 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
            >
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {item.student.first_name} {item.student.last_name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email: {item.student.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Submitted At: {new Date(item.submitted_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-100">
                Title: {item.title}
              </p>
              <div className="mt-2">
                <button
                  onClick={() =>
                    navigate(
                      `/instructor/course/content/assignment/assignment-submissions/${item.id}`,
                      { state: { submission: item } }
                    )
                  }
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-950 rounded hover:bg-brand-700 transition"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className=" space-y-6">
      <PageLayoutSection
        title="Assignment Submissions"
        description="List of all students who submitted this assignment."
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 justify-center bg-brand-950 px-4 py-2 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        }
      >
        {content}
      </PageLayoutSection>
    </main>
  );
}
