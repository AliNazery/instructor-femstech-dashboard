import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/api/store";

import CourseHeader from "../../../components/newDesignComponents/CourseHeader";
import CourseModules from "../../../components/newDesignComponents/CourseModules";
import CourseQuizzes from "../../../components/newDesignComponents/CourseQuizzes";
import CourseAssignments from "../../../components/newDesignComponents/CourseAssignments";
import InstructorInfo from "../../../components/newDesignComponents/InstructorInfo";
import CourseAnnouncements from "../../../components/newDesignComponents/announcement/CourseAnnouncements";

import {
  useGetAssignmentsQuery,
  useGetCourseQuery,
  useGetQuizzesQuery,
  useDeleteCourseMutation,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
} from "../../../app/api/instructor/instructorApi";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tab/tabs";

import Modal from "../../../components/common/modal/Modal";
import EditCourseForm from "../../../components/courses/EditCourseForm";
import ConfirmDeleteDialog from "../../../components/common/modal/ConfirmDeleteDialog";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import CourseStudents from "../../../components/newDesignComponents/students/CourseStudents";
import CoursePublishCard from "../../../components/Instructor/contentManager/CoursePublishCard";

export default function CourseContentDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { instructor } = useSelector((state: RootState) => state.instructor);

  const [isCourseEditOpen, setIsCourseEditOpen] = useState(false);
  const [isCourseDeleteOpen, setIsCourseDeleteOpen] = useState(false);

  // --- Fetch course data
  const {
    data: courseData,
    isLoading: courseLoading,
    isError,
    refetch,
  } = useGetCourseQuery(Number(courseId));

  const [deleteCourse, { isLoading: deletingCourse }] =
    useDeleteCourseMutation();
  const [publishCourse, { isLoading: publishing }] = usePublishCourseMutation();
  const [unpublishCourse] = useUnpublishCourseMutation();

  // --- Assignments
  const { data: assignmentResponse } = useGetAssignmentsQuery({
    entity_type: "course",
    entity_id: Number(courseId),
  });

  const assignments =
    assignmentResponse?.data?.map((a) => ({
      id: a.id.toString(),
      title: a.title,
      dueDate: new Date(a.expiration_date).toLocaleDateString(),
    })) ?? [];

  // --- Quizzes
  const { data: quizResponse, isLoading: quizzesLoading } = useGetQuizzesQuery({
    entityType: "course",
    entityId: Number(courseId),
  });

  const quizzes =
    quizResponse?.data
      ?.filter(
        (q) => q.entity_type === "course" && q.entity_id === Number(courseId)
      )
      .map((q) => ({
        id: q.id.toString(),
        title: q.title,
        questionsCount: Math.floor(Math.random() * 10) + 1,
      })) ?? [];

  // --- Edit & Delete handlers
  const handleEditCourse = () => setIsCourseEditOpen(true);
  const handleDeleteCourse = () => setIsCourseDeleteOpen(true);

  const confirmDeleteCourse = async () => {
    if (!courseData?.data) return;
    try {
      await deleteCourse(courseData.data.id).unwrap();
      toast.success("Course deleted successfully!");
      setIsCourseDeleteOpen(false);
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete course.");
    }
  };

  // --- Publish / Unpublish handler
  const handlePublishToggle = async () => {
    if (!courseData?.data) return;
    const course = courseData.data;

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("instructor_id", course.instructor_id.toString());
      formData.append("category_id", course.category_id.toString());
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("language", course.language);
      formData.append("level", course.level);
      formData.append("price", course.price.toString());
      formData.append("is_published", course.is_published ? "0" : "1");

      // Append thumbnail only if exists
      if (course.thumbnail_url) {
        // Assuming the API expects a File object. If needed, fetch the file.
        // Here, we skip to avoid breaking, you can enhance to include file upload
      }

      if (course.is_published) {
        await unpublishCourse({ id: course.id, body: formData }).unwrap();
        toast.success("Course marked as draft.");
      } else {
        await publishCourse({ id: course.id, body: formData }).unwrap();
        toast.success("Course published successfully!");
      }

      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update publish status.");
    }
  };

  // --- Loading & Empty states
  if (courseLoading || quizzesLoading) return <LoadingSpinner />;
  if (isError || !courseData?.data)
    return <EmptyState description="Course not found." />;

  const course = courseData.data;

  return (
    <main className="space-y-6">
      {/* --- Full Width Header --- */}
      <CourseHeader
        title={course.title}
        description={course.description}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />

      <CoursePublishCard
        isPublished={course.is_published}
        publishing={publishing}
        onToggle={handlePublishToggle}
      />

      {/* --- Tabs Section --- */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="modules">
            <CourseModules courseId={Number(courseId)} />
          </TabsContent>

          <TabsContent value="quizzes">
            <CourseQuizzes
              quizzes={quizzes}
              limit={4}
              onViewAll={() =>
                navigate(`/instructor/course/content/${courseId}/quiz`)
              }
            />
          </TabsContent>

          <TabsContent value="assignments">
            <CourseAssignments
              assignments={assignments}
              limit={4}
              onViewAll={() =>
                navigate(`/instructor/course/content/${courseId}/assignment`)
              }
            />
          </TabsContent>

          <TabsContent value="announcements">
            <CourseAnnouncements
              courseId={courseId!}
              onManage={() =>
                navigate(`/instructor/course/content/${courseId}/announcements`)
              }
            />
          </TabsContent>

          <TabsContent value="instructor">
            <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Instructor
              </h2>
              <InstructorInfo
                name={instructor?.first_name ?? "No name"}
                email={instructor?.email ?? "No email"}
                avatar={instructor?.avatar_url}
                bio={instructor?.bio}
              />
            </div>
          </TabsContent>
          <TabsContent value="students">
            <CourseStudents courseId={Number(courseId)} />
          </TabsContent>
        </div>
      </Tabs>

      {/* --- Edit Modal --- */}
      <Modal
        isOpen={isCourseEditOpen}
        onClose={() => setIsCourseEditOpen(false)}
      >
        <EditCourseForm
          course={course}
          categoryId={course.category_id}
          onSuccess={() => setIsCourseEditOpen(false)}
        />
      </Modal>

      {/* --- Delete Confirm Dialog --- */}
      <ConfirmDeleteDialog
        isOpen={isCourseDeleteOpen}
        onCancel={() => setIsCourseDeleteOpen(false)}
        onConfirm={confirmDeleteCourse}
        loading={deletingCourse}
        title="Delete Course"
        message={`Are you sure you want to delete "${course.title}"?`}
      />
    </main>
  );
}
