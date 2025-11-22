import { FC, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReviewsList from "../../../components/newDesignComponents/review&Rating/ReviewsList";
import { useApproveReviewMutation, useGetReviewsQuery, useUnapproveReviewMutation } from "../../../app/api/instructor/instructorApi"; // adjust path
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tab/tabs";
import EmptyState from "../../../components/common/EmptyState";
import { toast } from "react-toastify";



export interface ReviewUI {
  id: string;
  courseTitle: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  status: "approved" | "pending" | "rejected";

}
const ReviewsDetails: FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = Number(courseId);

  // --- Tab state ---
  const [tab, setTab] = useState<"all" | "approved" | "unapproved">("all");

  // --- Fetch reviews based on tab ---
  const isApprovedParam =
    tab === "approved" ? true : tab === "unapproved" ? false : undefined;

  const { data, isLoading, isFetching } = useGetReviewsQuery(
    { courseId: numericCourseId, is_approved: isApprovedParam },
    { skip: !numericCourseId }
  );
const [approveReview] = useApproveReviewMutation();
    const [unapproveReview] = useUnapproveReviewMutation();
    
  // --- Map API data to UI format ---

 const reviews: ReviewUI[] = useMemo(() => {
   if (!data?.data) return [];

   return data.data.map((r) => ({
     id: r.id.toString(),
     courseTitle: r.course?.title || `Course #${r.course_id}`,
     rating: r.rating,
     comment: r.review_text,
     author: r.student
       ? `${r.student.first_name} ${r.student.last_name}`
       : `Student #${r.student_id}`,
     date: r.created_at,
     // Aligning with Review type
     status: r.is_approved ? "approved" : "pending", // "rejected" can be handled separately
   }));
 }, [data]);



  const handleApprove = async(id: string) => {
      try {
          await approveReview(Number(id)).unwrap();
          toast.success("Review successfully approved")
      } catch (err) {
          toast.error("Failed to approve review: ")
          console.error("Failed to approve review:", err)
  }
  };

  const handleReject = async(id: string) => {
     try {
       await unapproveReview(Number(id)).unwrap();
       toast.success("Review successfully unapproved");
     } catch (err) {
       toast.error("Failed to unapprove review: ");
       console.error("Failed to unapprove review:", err);
     }
  };

  const renderConten = () => {
    if (isLoading || isFetching) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span className="ml-2 text-gray-600">Loading reviews...</span>
        </div>
      );
    } else if (reviews.length === 0) {
      return (
        <EmptyState
          title="No Reviews Found"
          description="There are no student reviews for this course yet."
        />
      );
    }

    return (
      <ReviewsList
        reviews={reviews}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Reviews & Ratings
      </h1>
      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "all" | "approved" | "unapproved")}
      >
        <TabsList className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <TabsTrigger
            value="all"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
              tab === "all"
                ? "bg-brand-950 text-gray-800 dark:bg-gray-900 shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
              tab === "approved"
                ? "bg-brand-950 dark:bg-gray-900 shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="unapproved"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
              tab === "unapproved"
                ? "bg-brand-950 dark:bg-gray-900 shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Unapproved
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Loader */}
      {renderConten()}
    </div>
  );
};

export default ReviewsDetails;
