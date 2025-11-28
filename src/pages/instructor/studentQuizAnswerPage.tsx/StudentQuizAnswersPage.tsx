import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetQuizAnswersQuery } from "../../../app/api/instructor/instructorApi";
import { Loader2, ArrowLeft, FileQuestion, ChevronDown, ChevronRight } from "lucide-react";

export default function StudentQuizAnswersPage() {
  const [searchParams] = useSearchParams();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const studentId = searchParams.get("studentId");
  const parsedId = studentId ? Number(studentId) : undefined;

  const { data, isLoading, isError } = useGetQuizAnswersQuery(
    { student_id: parsedId },
    { skip: !parsedId }
  );

  if (!studentId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
        <FileQuestion className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600 font-medium">
          Missing student ID in the URL.
        </p>
        <Link
          to="/instructor/enrollments"
          className="flex items-center text-brand-500 hover:text-brand-700 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Enrollments
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        <p>Loading quiz answers...</p>
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
        <FileQuestion className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600 font-medium">
          No quiz answers found for this student.
        </p>
        <Link
          to="/instructor/enrollments"
          className="flex items-center text-brand-500 hover:text-brand-700 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Enrollments
        </Link>
      </div>
    );
  }

  const answers = data.data;

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <main className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Student Quiz Answers
          </h1>
          <p className="text-sm text-gray-500">
            Viewing quiz submissions for student ID:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {studentId}
            </span>
          </p>
        </div>
        <Link
          to="/instructor/enrollments"
          className="flex items-center text-sm text-brand-500 hover:text-brand-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Enrollments
        </Link>
      </header>

      {/* Mobile Card Layout */}
      <div className="flex flex-col sm:hidden gap-3">
        {answers.map((answer, index) => {
          const isOpen = expandedRows.has(index);
          return (
            <div
              key={answer.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-4 space-y-2 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                    {answer.question?.question || "N/A"}
                  </p>
                  <p
                    className={`font-medium ${
                      answer.is_correct
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {answer.is_correct ? "✔ Correct" : "✘ Wrong"}
                  </p>
                </div>
                <button
                  className="ml-2 flex-shrink-0"
                  onClick={() => toggleRow(index)}
                  aria-label="Expand"
                >
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-semibold">Selected Option:</span>{" "}
                    {answer.selected_option?.option || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Score:</span>{" "}
                    {answer.question?.score ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Answered At:</span>{" "}
                    {new Date(answer.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {[
                "#",
                "Question",
                "Selected Option",
                "Correct?",
                "Score",
                "Answered At",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 text-left text-[13px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {answers.map((answer, index) => (
              <tr
                key={answer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td className="px-5 py-3 text-gray-500">{index + 1}</td>
                <td className="px-5 py-3 text-gray-900 dark:text-gray-100 font-medium">
                  {answer.question?.question || "N/A"}
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {answer.selected_option?.option || "N/A"}
                </td>
                <td
                  className={`px-5 py-3 font-medium ${
                    answer.is_correct
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {answer.is_correct ? "✔ Correct" : "✘ Wrong"}
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {answer.question?.score ?? "-"}
                </td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                  {new Date(answer.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
