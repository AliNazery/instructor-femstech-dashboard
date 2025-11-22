import { useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import { useGetMyCoursesQuery } from "../../../app/api/instructor/instructorApi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import { ReviewCourseCard } from "../../../components/newDesignComponents/ReviewCourseCard";

export default function ReviewCoursesPage() {
  const { categoryId } = useParams<{ categoryId?: string }>();

  // Optional filters (future use)
  const [filters] = useState({
    category_id: categoryId ? Number(categoryId) : undefined,
    search: undefined,
    is_published: undefined,
  });

  const {
    data: coursesData,
    isLoading,
    isError,
  } = useGetMyCoursesQuery(filters);

  const courses = coursesData?.data ?? [];

  let content;

  if (isLoading) {
    content = <LoadingSpinner text="Loading your courses..." fullScreen />;
  } else if (isError) {
    content = (
      <EmptyState
        title="Error Loading Courses"
        description="Something went wrong while fetching your courses. Please try again."
      />
    );
  } else if (courses.length === 0) {
    content = (
      <EmptyState
        title="No Courses Found"
        description="You haven’t created any courses yet, so there are no reviews to display."
      />
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <ReviewCourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Course Reviews | LMS Dashboard"
        description="View your courses and see their reviews and ratings"
      />
      <PageBreadcrumb pageTitle="Course Reviews" />

      <PageLayoutSection
        title="Your Courses ( Reviews and Rating )"
        description="Browse your published and unpublished courses to view student reviews and ratings."
      >
        {content}
      </PageLayoutSection>
    </>
  );
}

