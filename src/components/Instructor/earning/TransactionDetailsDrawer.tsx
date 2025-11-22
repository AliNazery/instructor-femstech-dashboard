import { FC } from "react";
import { X } from "lucide-react";
import { TransactionItem } from "../../../app/api/instructor/instructor.type";

interface Props {
  transaction: TransactionItem | null;
  onClose: () => void;
}

const TransactionDetailsDrawer: FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-[9999]">
      <div className="w-full sm:w-[600px] bg-white shadow-2xl h-full overflow-y-auto rounded-l-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 ">
          <h2 className="text-xl font-semibold text-gray-900">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 text-sm text-gray-700">
          {/* General Info */}
          <section>
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-1">
              General Info
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <Info label="Transaction ID" value={transaction.transaction_id} />
              <Info label="Status" value={transaction.status} />
              <Info label="Amount" value={`$${transaction.amount}`} />
              <Info
                label="Currency"
                value={transaction.currency.toUpperCase()}
              />
              <Info
                label="Payment Gateway"
                value={transaction.payment_gateway}
              />
              <Info
                label="Paid At"
                value={new Date(transaction.paid_at).toLocaleString()}
              />
            </div>
          </section>

          {/* Course Info */}
          <section>
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-1">
              Course Details
            </h3>
            <div className="flex gap-4 items-start">
              <img
                src={transaction.course.thumbnail_url}
                alt={transaction.course.title}
                className="w-28 h-20 rounded-lg object-cover border border-gray-200"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {transaction.course.title}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                  <Info label="Level" value={transaction.course.level} />
                  <Info label="Language" value={transaction.course.language} />
                  <Info label="Price" value={`$${transaction.course.price}`} />
                  <Info
                    label="Rating"
                    value={transaction.course.formatted_rating}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Student Info */}
          <section>
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-1">
              Student Info
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <Info
                label="Name"
                value={`${transaction.student.first_name} ${transaction.student.last_name}`}
              />
              <Info label="Email" value={transaction.student.email} />
              <Info label="Phone" value={transaction.student.phone} />
              <Info label="Address" value={transaction.student.address} />
              <Info label="Status" value={transaction.student.status} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Reusable info row component
const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div>
    <p className="text-[13px] text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 break-words">{value || "-"}</p>
  </div>
);

export default TransactionDetailsDrawer;
