import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import CourseAssignments from "../../../components/newDesignComponents/CourseAssignments";
import Modal from "../../../components/common/modal/Modal";
import ConfirmDeleteDialog from "../../../components/common/modal/ConfirmDeleteDialog";
import CreateAssignmentForm from "../../../components/Assignments/CreateAssignmentForm";
import EditAssignmentForm from "../../../components/Assignments/EditAssignmentForm";

import {
  useGetAssignmentsQuery,
  useDeleteAssignmentMutation,
} from "../../../app/api/instructor/instructorApi";
import { Assignment } from "../../../app/api/instructor/instructor.type";
import { ArrowLeft } from "lucide-react";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { courseId, moduleId, lessonId } = useParams<{
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
  }>();

  // --- Determine entity type and id dynamically ---
  let entityType: "course" | "module" | "lesson" | null = null;
  let entityId: number | null = null;
  if (courseId) {
    entityType = "course";
    entityId = Number(courseId);
  } else if (moduleId) {
    entityType = "module";
    entityId = Number(moduleId);
  } else if (lessonId) {
    entityType = "lesson";
    entityId = Number(lessonId);
  }

  // --- Fetch assignments ---
  const {
    data: assignmentResponse,
    isLoading,
    isError,
  } = useGetAssignmentsQuery(
    entityType && entityId
      ? { entity_type: entityType, entity_id: entityId }
      : skipToken
  );

  // --- Local state for modals ---
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- Delete mutation ---
  const [deleteAssignment, { isLoading: deleting }] =
    useDeleteAssignmentMutation();

  // --- Transform assignments for CourseAssignments ---
  const assignments =
    assignmentResponse?.data
      ?.filter((a) => a.entity_type === entityType && a.entity_id === entityId)
      ?.map((a) => ({
        id: a.id.toString(),
        title: a.title,
        dueDate: new Date(a.expiration_date).toLocaleDateString(),
        raw: a,
      })) ?? [];

  // --- Modal actions ---
  const openCreateModal = () => setIsCreateOpen(true);
  const openEditModal = (id: string) => {
    const assignment = assignments.find((a) => a.id === id);
    setSelectedAssignment(assignment?.raw ?? null);
    setIsEditOpen(true);
  };
  const openDeleteModal = (id: string) => {
    const assignment = assignments.find((a) => a.id === id);
    setSelectedAssignment(assignment?.raw ?? null);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAssignment) return;
    try {
      await deleteAssignment(selectedAssignment.id).unwrap();
      setIsDeleteOpen(false);
      setSelectedAssignment(null);
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  };

  // --- UI States ---
  if (isLoading) {
    return (
      <main className="p-6">
        <p className="text-center text-gray-500 mt-10">
          Loading assignments...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6">
        <p className="text-center text-red-500 mt-10">
          Failed to load assignments.
        </p>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <PageLayoutSection
        title="Manage Assignments"
        description="View and manage assignments for this specific course."
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
        <CourseAssignments
          assignments={assignments}
          onAddAssignment={openCreateModal}
          onEditAssignment={openEditModal}
          onDeleteAssignment={openDeleteModal}
        />
      </PageLayoutSection>

      {/* --- Create Modal --- */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        {entityType && entityId && (
          <CreateAssignmentForm
            entityType={entityType}
            entityId={entityId}
            onSuccess={() => setIsCreateOpen(false)}
          />
        )}
      </Modal>

      {/* --- Edit Modal --- */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selectedAssignment && (
          <EditAssignmentForm
            assignment={selectedAssignment}
            onSuccess={() => setIsEditOpen(false)}
          />
        )}
      </Modal>

      {/* --- Delete Confirm Dialog --- */}
      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${selectedAssignment?.title}"?`}
      />
    </main>
  );
}
