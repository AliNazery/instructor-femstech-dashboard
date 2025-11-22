import { FC, ReactNode } from "react";
import { BookOpen, ClipboardList, Eye, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Quiz {
  id: string;
  title: string;
  questionsCount: number;
}

interface CourseQuizzesProps {
  quizzes: Quiz[];
  onAddQuiz?: () => void;
  onEditQuiz?: (quizId: string) => void;
  onDeleteQuiz?: (quizId: string) => void;
  onViewAll?: () => void;
  header?: ReactNode;
  limit?: number;
}

const CourseQuizzes: FC<CourseQuizzesProps> = ({
  quizzes,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onViewAll,
  header,
  limit,
}) => {
  const navigate = useNavigate();
  const displayQuizzes = limit ? quizzes.slice(0, limit) : quizzes;

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-brand-950 dark:border-neutral-800 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        {header ?? (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Quizzes
          </h2>
        )}

        <div className="flex flex-wrap gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-950 hover:text-brand-700 transition"
            >
              <Eye size={16} /> View All
            </button>
          )}
          {onAddQuiz && (
            <button
              onClick={onAddQuiz}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-950 rounded-lg hover:bg-brand-700 transition"
            >
              <PlusCircle size={16} /> Add Quiz
            </button>
          )}
        </div>
      </div>

      {/* Quiz List */}
      {displayQuizzes.length > 0 ? (
        <div className="space-y-3">
          {displayQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="border border-gray-200 dark:border-neutral-800 rounded-lg bg-gray-50 dark:bg-neutral-800/40 hover:bg-gray-100 dark:hover:bg-neutral-800 transition p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* --- Title Section --- */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2 sm:mb-0 text-center sm:text-left flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 break-words truncate sm:truncate">
                  {quiz.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {quiz.questionsCount}{" "}
                  {quiz.questionsCount === 1 ? "question" : "questions"}
                </p>
              </div>

              {/* --- Action Buttons --- */}
              {(onEditQuiz || onDeleteQuiz) && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2 sm:mt-0 w-full sm:w-auto">
                  <button
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-brand-950 rounded-lg hover:bg-brand-700 transition whitespace-nowrap"
                    onClick={() =>
                      navigate(
                        `/instructor/course/content/quizzes/${quiz.id}/questions`
                      )
                    }
                  >
                    <BookOpen size={14} />
                    <span className="hidden sm:inline">Questions</span>
                  </button>

                  <button
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-brand-950 rounded-lg hover:bg-brand-700 transition whitespace-nowrap"
                    onClick={() =>
                      navigate(
                        `/instructor/course/content/quizzes/${quiz.id}/answers`
                      )
                    }
                  >
                    <ClipboardList size={14} />
                    <span className="hidden sm:inline">Answers</span>
                  </button>

                  {onEditQuiz && (
                    <button
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm text-white bg-brand-950 rounded-lg hover:bg-brand-700 transition whitespace-nowrap"
                      onClick={() => onEditQuiz(quiz.id)}
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteQuiz && (
                    <button
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition whitespace-nowrap"
                      onClick={() => onDeleteQuiz(quiz.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 border rounded-md">
          No quizzes found.
        </div>
      )}
    </section>
  );
};

export default CourseQuizzes;
