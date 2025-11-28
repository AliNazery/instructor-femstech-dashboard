import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseQuizzes from "../../../components/newDesignComponents/CourseQuizzes";
import Modal from "../../../components/common/modal/Modal";
import ConfirmDeleteDialog from "../../../components/common/modal/ConfirmDeleteDialog";
import {
  useGetQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} from "../../../app/api/instructor/instructorApi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import CreateQuizForm from "../../../components/courses/quiz/CreateQuizForm";
import EditQuizForm from "../../../components/courses/quiz/EditQuizForm";
import { Quiz } from "../../../app/api/instructor/instructor.type";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function QuizzesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const {
    data: quizResponse,
    isLoading: quizzesLoading,
    isError,
  } = useGetQuizzesQuery({
    entityType: "course",
    entityId: Number(courseId),
  });

  const [createQuiz] = useCreateQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();
  const [deleteQuiz, { isLoading: deleting }] = useDeleteQuizMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const quizzes =
    quizResponse?.data
      ?.filter(
        (q) => q.entity_type === "course" && q.entity_id === Number(courseId)
      )
      .map((q) => ({
        id: q.id.toString(),
        title: q.title,
        questionsCount: Math.floor(Math.random() * 10) + 1, // TEMP placeholder
      })) ?? [];

  if (quizzesLoading)
    return <LoadingSpinner text="Loading quizzes..." fullScreen />;
  if (isError)
    return (
      <EmptyState
        title="Failed to Load Quizzes"
        description="Please check your connection and try again."
      />
    );

  const openCreateModal = () => setIsCreateOpen(true);
  const openEditModal = (id: string) => {
    const quiz = quizResponse?.data.find((q) => q.id === Number(id));
    setSelectedQuiz(quiz || null);
    setIsEditOpen(true);
  };
  const confirmDelete = (id: string) => {
    const quiz = quizResponse?.data.find((q) => q.id === Number(id));
    setSelectedQuiz(quiz || null);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedQuiz) return;
    try {
      await deleteQuiz(selectedQuiz.id).unwrap();
      setIsDeleteOpen(false);
      setSelectedQuiz(null);
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  };

  return (
    <main className=" space-y-6">
      <PageLayoutSection
        title="Manage Quizzes"
        description="Create and manage quizzes for your courses."
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
        {quizzes.length === 0 ? (
          <>
            <div className="mt-4 flex justify-end">
              <button
                onClick={openCreateModal}
                className="flex items-center  gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-700 transition"
              >
                <PlusCircle size={16} /> Add Quiz
              </button>
            </div>
            <EmptyState
              title="No Quizzes Found"
              description="Start by creating your first quiz for this course."
            />
          </>
        ) : (
          <CourseQuizzes
            quizzes={quizzes}
            onAddQuiz={openCreateModal}
            onEditQuiz={openEditModal}
            onDeleteQuiz={confirmDelete}
          />
        )}

        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <CreateQuizForm
            entityType="course"
            entityId={Number(courseId)}
            onSuccess={() => setIsCreateOpen(false)}
            onCreate={async (formData) => {
              try {
                await createQuiz(formData).unwrap();
                setIsCreateOpen(false);
              } catch (err) {
                console.error("Failed to create quiz:", err);
              }
            }}
          />
        </Modal>
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
          {selectedQuiz && (
            <EditQuizForm
              quiz={selectedQuiz}
              onSuccess={() => setIsEditOpen(false)}
              onUpdate={async (formData) => {
                try {
                  await updateQuiz({
                    id: selectedQuiz.id,
                    formData,
                  }).unwrap();
                  setIsEditOpen(false);
                } catch (err) {
                  console.error("Failed to update quiz:", err);
                }
              }}
            />
          )}
        </Modal>

        <ConfirmDeleteDialog
          isOpen={isDeleteOpen}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete Quiz"
          message={`Are you sure you want to delete "${selectedQuiz?.title}"?`}
        />
      </PageLayoutSection>
    </main>
  );
}
