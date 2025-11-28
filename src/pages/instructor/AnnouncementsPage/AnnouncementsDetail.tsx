import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import AnnouncementsList from "../../../components/newDesignComponents/announcement/AnnouncementsList";
import { ArrowLeft, Plus } from "lucide-react";
import Modal from "../../../components/common/modal/Modal";
import CreateAnnouncementForm from "../../../components/Announcements/CreateAnnouncementForm";
import { useGetCourseAnnouncementsQuery } from "../../../app/api/instructor/instructorApi";

export default function AnnouncementsDetail() {
    const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = courseId ? Number(courseId) : undefined;

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // --- Fetch course-specific announcements ---
  const {
    data: announcementsData,
    isLoading,
    isError,
  } = useGetCourseAnnouncementsQuery(numericCourseId!, {
    skip: !numericCourseId,
  });

  const announcements = announcementsData?.data ?? [];

  // --- Render content ---
  let content;

  if (isLoading) {
    content = <LoadingSpinner text="Loading announcements..." fullScreen />;
  } else if (isError) {
    content = (
      <EmptyState
        title="Error Loading Announcements"
        description="Something went wrong while fetching course announcements. Please try again."
      />
    );
  } else if (announcements.length === 0) {
    content = (
      <EmptyState
        title="No Announcements Found"
        description="This course doesn’t have any announcements yet."
      />
    );
  } else {
    content = (
      <AnnouncementsList
        announcements={announcements}
      />
    );
  }

  return (
    <>
      <PageMeta
        title="Course Announcements | LMS Dashboard"
        description="Manage and view your course-specific announcements."
      />
      <PageBreadcrumb pageTitle="Course Announcements" />

      <PageLayoutSection
        title="Course Announcements"
        description="View and manage announcements for this specific course."
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
        {/* Header Controls */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {content}
      </PageLayoutSection>

      {/* Create Announcement Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        {numericCourseId && (
          <CreateAnnouncementForm
            courseId={numericCourseId}
            onSuccess={() => setIsCreateOpen(false)}
          />
        )}
      </Modal>
    </>
  );
}
