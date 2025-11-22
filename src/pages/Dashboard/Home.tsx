import PageMeta from "../../components/common/PageMeta";
import CourseStatusBreakdown from "../../components/newDesignComponents/home/CourseStatusBreakdown";
import InstructorMetrics from "../../components/newDesignComponents/home/InstructorMetrics";
import MostPopularCourses from "../../components/newDesignComponents/home/MostPopularCourses";
import RecentEnrollments from "../../components/newDesignComponents/home/RecentEnrollments";
import RecentReviews from "../../components/newDesignComponents/home/RecentReviews";
import UpcomingDeadlines from "../../components/newDesignComponents/home/UpcomingDeadlines";

export default function InstructorHome() {
  return (
    <>
      <PageMeta
        title="Instructor Dashboard | Azmoonhub"
        description="Instructor dashboard for Azmoonhub LMS. Track your students, courses, revenue, and performance metrics."
      />

      <div className="space-y-6">
        {/* Top metrics */}
        <InstructorMetrics />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <CourseStatusBreakdown />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <UpcomingDeadlines />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <RecentReviews />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <MostPopularCourses />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <RecentEnrollments />
          </div>
        </div>
      </div>
    </>
  );
}
