import { useState, useMemo } from "react";
import { Lesson } from "../../app/api/instructor/instructor.type";
import { PlusCircle, Edit3, Trash2, BookOpen } from "lucide-react";
import Modal from "../common/modal/Modal";
import ConfirmDeleteDialog from "../common/modal/ConfirmDeleteDialog";
import { toast } from "react-toastify";
import {
  useGetLessonsQuery,
  useDeleteLessonMutation,
} from "../../app/api/instructor/instructorApi";
import CreateLessonForm from "./CreateLessonForm";
import EditLessonForm from "./EditLessonForm";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import LessonDetails from "./LessonDetails";

interface LessonListProps {
  moduleId: number;
}

export default function LessonList({ moduleId }: Readonly<LessonListProps>) {
  // const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data, isLoading, isError, isFetching } = useGetLessonsQuery(
    moduleId ? { module_id: moduleId } : {}
  );
  const [deleteLesson, { isLoading: deleting }] = useDeleteLessonMutation();

  const lessons = useMemo(() => data?.data ?? [], [data]);

  const handleCreate = () => setIsCreateOpen(true);
  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditOpen(true);
  };
  const handleDelete = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteOpen(true);
  };
  const handleOpen = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDetailsOpen(true);
  };
  // const handleOpenQuiz = (lesson: Lesson) => {
  //   navigate(`/quiz/lesson/${lesson.id}`);
  // };

  const confirmDelete = async () => {
    if (!selectedLesson) return;
    try {
      await deleteLesson(Number(selectedLesson.id)).unwrap();
      toast.success("Lesson deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedLesson(null);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      toast.error("Failed to delete lesson.");
    }
  };

  if (isLoading || isFetching) {
    return <LoadingSpinner text="Loading lessons..." fullScreen={false} />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Error"
        description="Failed to load lessons for this module."
      />
    );
  }

  if (!lessons.length) {
    return (
      <div className="ml-6">
        <EmptyState
          title="No Lessons"
          description="No lessons found for this module."
        />
        <button
          className="mt-2 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition"
          onClick={handleCreate}
        >
          <PlusCircle className="w-4 h-4" />
          Add Lesson
        </button>

        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <CreateLessonForm
            moduleId={moduleId}
            onSuccess={() => setIsCreateOpen(false)}
          />
        </Modal>
      </div>
    );
  }


  return (
    <>
      <div className="ml-0 sm:ml-6 mt-2 space-y-2">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="
        w-full 
        flex flex-col sm:flex-row sm:justify-between sm:items-center 
        px-3 py-3 sm:px-4 sm:py-2 rounded-lg 
        bg-white dark:bg-neutral-800 
        border border-gray-200 dark:border-gray-700
        hover:shadow-sm transition
      "
          >
            {/* --- Lesson Title --- */}
            <button
              onClick={() => handleOpen(lesson)}
              className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base text-left mb-2 sm:mb-0"
            >
              {lesson.title}
            </button>

            {/* --- Action Buttons --- */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-start sm:justify-end">
              <button
                onClick={() => handleOpen(lesson)}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                title="Open Lesson"
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Open</span>
              </button>

              {/* <button
                onClick={() => handleOpenQuiz(lesson)}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                title="Open Quiz"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Quiz</span>
              </button> */}

              <button
                onClick={() => handleEdit(lesson)}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                title="Edit Lesson"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => handleDelete(lesson)}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded text-red-600 hover:text-red-700 dark:hover:bg-neutral-700 transition"
                title="Delete Lesson"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add Lesson Button */}
        <button
          className="mt-2 flex items-center gap-2 text-sm sm:text-base text-green-600 hover:text-green-700 font-medium transition"
          onClick={handleCreate}
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Lesson
        </button>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <CreateLessonForm
          moduleId={moduleId}
          onSuccess={() => setIsCreateOpen(false)}
        />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selectedLesson && (
          <EditLessonForm
            lesson={selectedLesson}
            onSuccess={() => setIsEditOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Lesson"
        message={`Are you sure you want to delete "${selectedLesson?.title}"?`}
      />

      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
        {selectedLesson && <LessonDetails lesson={selectedLesson} />}
      </Modal>
    </>
  );

 
}
