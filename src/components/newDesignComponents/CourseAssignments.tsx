 import { FC, ReactNode } from "react";
import { PlusCircle, Eye, List } from "lucide-react";
import { useNavigate } from "react-router";

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
}

interface CourseAssignmentsProps {
  assignments: Assignment[];
  onAddAssignment?: () => void;
  onEditAssignment?: (assignmentId: string) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
  onViewAll?: () => void;
  header?: ReactNode;
  limit?: number; // For preview mode
}

const CourseAssignments: FC<CourseAssignmentsProps> = ({
  assignments,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onViewAll,
  header,
  limit,
}) => {
  const navigate = useNavigate();
  const displayAssignments = limit ? assignments.slice(0, limit) : assignments;

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-brand-500 dark:border-neutral-800 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        {header ?? (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Assignments
          </h2>
        )}
        <div className="flex gap-2">
          {onViewAll && (
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-700 transition"
              onClick={onViewAll}
            >
              <Eye size={16} /> View All
            </button>
          )}
          {onAddAssignment && (
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-700 transition"
              onClick={onAddAssignment}
            >
              <PlusCircle size={16} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Assignment List */}
      {displayAssignments.length > 0 ? (
        <div className="space-y-2">
          {displayAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-3 border border-gray-200 dark:border-neutral-800 rounded-md bg-gray-50 dark:bg-neutral-800/40 hover:bg-gray-100 dark:hover:bg-neutral-800 transition
                   flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              {/* Title & Due Date */}
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {assignment.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {assignment.dueDate}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-6">
                <button
                  className="flex items-center justify-center gap-1 px-3 py-1 text-xs text-white bg-brand-500 rounded hover:bg-brand-700 w-full sm:w-auto"
                  onClick={() =>
                    navigate(
                      `/instructor/course/content/assignment/${assignment.id}/submissions`
                    )
                  }
                >
                  <List size={14} /> Submissions
                </button>

                {onEditAssignment && (
                  <button
                    className="px-4 py-2 text-xs text-white bg-brand-500 rounded hover:bg-brand-700 w-full sm:w-auto"
                    onClick={() => onEditAssignment(assignment.id)}
                  >
                    Edit
                  </button>
                )}
                {onDeleteAssignment && (
                  <button
                    className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 w-full sm:w-auto"
                    onClick={() => onDeleteAssignment(assignment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 border rounded-md">
          No assignments found.
        </div>
      )}
    </section>
  );
};

export default CourseAssignments;
