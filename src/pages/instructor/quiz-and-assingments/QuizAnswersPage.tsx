import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import { useGetQuizAnswersQuery } from "../../../app/api/instructor/instructorApi";
import { ArrowLeft, Award, CheckCircle, User, XCircle } from "lucide-react";
import { QuizAnswer } from "../../../app/api/instructor/instructor.type";
import EmptyState from "../../../components/common/EmptyState";
import BackButton from "../../../components/ui/button/BackButton";

const QuizAnswersPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const numericQuizId = quizId ? Number(quizId) : undefined;

  const { data, isLoading, isError } = useGetQuizAnswersQuery(
    { quiz_id: numericQuizId },
    { skip: !numericQuizId }
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data?.data?.length)
    return (
     <>
        <div className="flex justify-end">
          <BackButton label="Back" />
        </div>
        <EmptyState
          title="No quiz answers found."
          description="No one has answered yet"
        />
      </>
    );

  const groupedByStudent = data.data.reduce(
    (acc: Record<number, QuizAnswer[]>, answer) => {
      if (!acc[answer.student_id]) acc[answer.student_id] = [];
      acc[answer.student_id].push(answer);
      return acc;
    },
    {}
  );

  return (
    <main className="space-y-10">
      <PageLayoutSection
        title="Quiz Answers"
        description="View all submitted answers for this quiz, grouped by student."
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 justify-center bg-brand-500 px-4 py-2 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        }
      >
        {/* Render each student's section */}
        {Object.entries(groupedByStudent).map(([studentId, answers]) => {
          const studentAnswers = answers;
          const correctCount = studentAnswers.filter(
            (a) => a.is_correct
          ).length;
          const totalQuestions = studentAnswers.length;
          const totalScore = studentAnswers.reduce(
            (sum, a) => sum + (a.is_correct ? a.question.score : 0),
            0
          );

          return (
            <div
              key={studentId}
              className="mb-8 border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-3 sm:gap-0">
                {/* Student ID */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  <div className="p-2 bg-indigo-100 text-brand-700 rounded-full">
                    <User size={18} />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 text-center sm:text-left">
                    Student ID:{" "}
                    <span className="text-indigo-700">{studentId}</span>
                  </h2>
                </div>

                {/* Correct Count */}
                <div className="flex items-center gap-1 w-full sm:w-auto justify-center">
                  <span className="text-gray-600">Correct:</span>
                  <span className="font-semibold text-green-600">
                    {correctCount}
                  </span>
                  <span className="text-gray-500">/ {totalQuestions}</span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 w-full sm:w-auto justify-center">
                  <Award size={16} className="text-yellow-600" />
                  <span className="text-gray-600">Score:</span>
                  <span className="font-semibold text-indigo-600">
                    {totalScore}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg bg-white hidden sm:table">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        #
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Question
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Selected Option
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Correct?
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAnswers.map((answer, index) => (
                      <tr
                        key={answer.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">
                          {answer.question.question}
                        </td>
                        <td className="px-4 py-2">
                          {answer.selected_option.option}
                        </td>
                        <td className="px-4 py-2 flex items-center">
                          {answer.is_correct ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </td>
                        <td className="px-4 py-2">{answer.question.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile view */}
                <div className="sm:hidden space-y-3">
                  {studentAnswers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="border border-gray-200 rounded-lg bg-white p-3 shadow-sm"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-700">
                          #{index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          {answer.question.score} pts
                        </span>
                      </div>
                      <div className="mb-1">
                        <p className="font-medium text-gray-800">
                          {answer.question.question}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Selected:{" "}
                          <span className="font-medium">
                            {answer.selected_option.option}
                          </span>
                        </span>
                        <span
                          className={`font-medium ${
                            answer.is_correct
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {answer.is_correct ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </PageLayoutSection>
    </main>
  );
};

export default QuizAnswersPage;
