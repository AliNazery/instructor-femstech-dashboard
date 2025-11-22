import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Star, Edit, Trash2 } from "lucide-react";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
} from "../../../app/api/instructor/instructorApi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import { toast } from "react-toastify";
import { Course } from "../../../app/api/instructor/instructor.type";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import CreateButton from "../../../components/ui/button/CreateButton";
import Modal from "../../../components/common/modal/Modal";
import CreateCourseForm from "../../../components/courses/CreateCourseForm";
import EditCourseForm from "../../../components/courses/EditCourseForm";
import ConfirmDeleteDialog from "../../../components/common/modal/ConfirmDeleteDialog";
import { RootState } from "../../../app/api/store";
import { useSelector } from "react-redux";

export default function CourseContentPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseEditOpen, setIsCourseEditOpen] = useState(false);
  const [isCourseDeleteOpen, setIsCourseDeleteOpen] = useState(false);
  const [isCourseCreateOpen, setIsCourseCreateOpen] = useState(false);
  const { instructor } = useSelector((state: RootState) => state.instructor);

  const { data: coursesData, isLoading } = useGetCoursesQuery({
    category_id: Number(categoryId),
  });
  const courses = coursesData?.data ?? [];

  const [deleteCourse, { isLoading: deletingCourse }] =
    useDeleteCourseMutation();

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseEditOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseDeleteOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse.id).unwrap();
      toast.success("Course deleted successfully!");
      setIsCourseDeleteOpen(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete course.");
    }
  };

  if (isLoading) return <LoadingSpinner />;
 if (!courses.length)
  return (
    <>
      <div className="flex justify-end">
        <CreateButton onClick={() => setIsCourseCreateOpen(true)}>
          New Course
        </CreateButton>
      </div>

      <EmptyState description="No courses found for this category." />
       <Modal
        isOpen={isCourseCreateOpen}
        onClose={() => setIsCourseCreateOpen(false)}
      >
        <CreateCourseForm
          categoryId={Number(categoryId)}
          instructorId={instructor?.id ?? 0}
          onSuccess={() => setIsCourseCreateOpen(false)}
        />
      </Modal>
    </>
  );

  return (
    <main className="space-y-8">
      <PageLayoutSection
        title={`Category: ${categoryId}`}
        description={`Showing courses inside category ID ${categoryId}.`}
        action={
          <CreateButton onClick={() => setIsCourseCreateOpen(true)}>
            New Course
          </CreateButton>
        }
      >
        {/* Courses Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail */}
              <div
                className="relative h-44 w-full overflow-hidden cursor-pointer"
                onClick={() =>
                  navigate(
                    `/instructor/course/content/categories/${categoryId}/courses/${course.id}/detail`
                  )
                }
              >
                <img
                  src={
                    course.thumbnail_url
                      ? course.thumbnail_url
                      : "/images/placeholder-course.jpg"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="flex items-center gap-2 text-white font-medium bg-brand-950/80 px-3 py-1 rounded-lg">
                    <Eye size={16} /> View Course
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div
                  className="cursor-pointer mb-3 w-full"
                  onClick={() =>
                    navigate(`/instructor/course/content/${course.id}/detail`)
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                    {course.description || "No description provided."}
                  </p>

                  {/* Labeled Meta Info */}
                  <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                    {course.level && (
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Level:
                        </span>
                        <span>{course.level}</span>
                      </div>
                    )}
                    {course.category?.title && (
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Category:
                        </span>
                        <span>{course.category.title}</span>
                      </div>
                    )}
                    {course.language && (
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Language:
                        </span>
                        <span>{course.language}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        Price:
                      </span>
                      <span>${course.price || "Free"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        Status:
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          course.is_published
                            ? "border-green-300 text-green-700 bg-green-50"
                            : "border-red-300 text-red-700 bg-red-50"
                        }`}
                      >
                        {course.is_published ? "Published" : "Unpublished"}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 dark:border-gray-800 pt-2">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Rating:
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />
                      <span>{course.formatted_rating || "4.8"} / 5</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-brand-950 text-white rounded-md hover:bg-brand-700 transition-all duration-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </PageLayoutSection>

      {/* Modals */}
      <Modal
        isOpen={isCourseCreateOpen}
        onClose={() => setIsCourseCreateOpen(false)}
      >
        <CreateCourseForm
          categoryId={Number(categoryId)}
          instructorId={instructor?.id ?? 0}
          onSuccess={() => setIsCourseCreateOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isCourseEditOpen}
        onClose={() => setIsCourseEditOpen(false)}
      >
        {selectedCourse && (
          <EditCourseForm
            course={selectedCourse}
            categoryId={Number(categoryId)}
            onSuccess={() => setIsCourseEditOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDeleteDialog
        isOpen={isCourseDeleteOpen}
        onCancel={() => setIsCourseDeleteOpen(false)}
        onConfirm={confirmDeleteCourse}
        loading={deletingCourse}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.title}"?`}
      />
    </main>
  );
}
