import { FC } from "react";
import ReviewRow from "./ReviewRow";

type Review = {
  id: string;
  courseTitle: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
};

interface ReviewsListProps {
  reviews: Review[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ReviewsList: FC<ReviewsListProps> = ({
  reviews,
  onApprove,
  onReject,
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    {reviews.map((review) => (
      <ReviewRow
        key={review.id}
        review={review}
        onApprove={onApprove}
        onReject={onReject}
      />
    ))}
  </div>
);

export default ReviewsList;
