import { FC } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css"; // ensure the CSS is imported

type Review = {
  id: string;
  courseTitle: string;
  rating: number; 
  comment: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
};

interface ReviewRowProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const statusColors = {
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const ReviewRow: FC<ReviewRowProps> = ({ review, onApprove, onReject }) => (
  <div className="p-4 bg-brand-50 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border-l-4 border-brand-500">
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800">{review.courseTitle}</h3>
        <p className="text-gray-600 text-sm">{review.comment}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>{review.author}</span>
          <span>•</span>
          <span>{new Date(review.date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {/* Star rating only */}
        <Rating style={{ maxWidth: 100 }} value={review.rating} readOnly />
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            statusColors[review.status]
          }`}
        >
          {review.status.toUpperCase()}
        </span>
      </div>
    </div>

    {review.status === "pending" && (
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onApprove(review.id)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(review.id)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Reject
        </button>
      </div>
    )}
  </div>
);

export default ReviewRow;
