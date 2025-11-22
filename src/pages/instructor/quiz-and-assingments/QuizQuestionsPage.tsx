import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle ,Pencil, Trash2, CheckCircle } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";

import EmptyState from "../../../components/common/EmptyState";
import Modal from "../../../components/common/modal/Modal";
import ConfirmDeleteDialog from "../../../components/common/modal/ConfirmDeleteDialog";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import CreateQuestionForm from "../../../components/courses/questions/CreateQuestionForm";
import EditQuestionForm from "../../../components/courses/questions/EditQuestionForm";
import { useDeleteQuestionMutation, useGetQuestionsQuery } from "../../../app/api/instructor/instructorApi";
import { Question, QuestionOption } from "../../../app/api/instructor/instructor.type";

export default function QuizQuestionsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

 
  const numericQuizId = quizId ? Number(quizId) : skipToken;

  const {
    data: questionData,
    isLoading: qLoading,
    isError,
  } = useGetQuestionsQuery(numericQuizId);



  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  
    const [deleteQuestion, { isLoading: deleting }] = useDeleteQuestionMutation();
   

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditOpen(true);
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuestion) return;
    try {
      await deleteQuestion(selectedQuestion.id).unwrap();
      setIsDeleteOpen(false);
      setSelectedQuestion(null);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

 const questions: Question[] = questionData?.data || [];

  let content;

  if (qLoading) {
    content = (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Loading questions...
      </p>
    );
  } else if (isError) {
    content = <p className="text-red-500 text-sm">Failed to load questions.</p>;
  } else if (questions.length === 0) {
    content = (
      <EmptyState
        title="No Questions Found"
        description="Start by adding a question to this quiz."
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {questions.map((q: Question, index: number) => (
          <div
            key={q.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
          >
            {/* Question Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-base">
                  {q.question}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-brand-950 text-brand-950 hover:bg-brand-50 transition"
                  onClick={() => handleEdit(q)}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
                  onClick={() => handleDelete(q)}
                  disabled={deleting}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {/* Question Info */}
            <p className="text-xs text-gray-500 mb-2">
              Type: <span className="font-medium">Multiple Choice</span> ·
              Score: <span className="font-medium">{q.score}</span>
            </p>

            {/* Options */}
            <ul className="pl-4 space-y-1">
              {q.options?.map((opt: QuestionOption) => (
                <li
                  key={opt.id}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {opt.is_correct ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <span className="w-4 h-4 inline-block border rounded-full border-gray-400" />
                  )}
                  <span
                    className={
                      opt.is_correct
                        ? "font-medium text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {opt.option}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className=" space-y-6">
      <PageLayoutSection
        title="Quiz Questions"
        description="Manage and organize questions for this quiz."
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center sm:justify-start w-full sm:w-auto gap-2 bg-brand-950 px-4 py-2 text-white rounded-lg hover:bg-brand-800 transition"
          >
            ← Go Back
          </button>
        }
      >
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Questions for Quiz ID: {quizId}
          </h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-brand-950 hover:bg-brand-700 rounded-lg transition"
          >
            <PlusCircle size={16} />
            Add
          </button>
        </div>

        {content}

        {/* Create Question Modal */}
        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <CreateQuestionForm
            quizId={Number(quizId)}
            onSuccess={() => setIsCreateOpen(false)}
          />
        </Modal>

        {/* Edit Question Modal */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
          {selectedQuestion && (
            <EditQuestionForm
              question={selectedQuestion}
              onSuccess={() => setIsEditOpen(false)}
            />
          )}
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDeleteDialog
          isOpen={isDeleteOpen}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Question"
          message={`Are you sure you want to delete “${selectedQuestion?.question}”?`}
        />
      </PageLayoutSection>
    </main>
  );
}
