import { FC } from "react";
import Modal from "./Modal";
import Button from "../../ui/button/Button";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
    >
      <div className="p-5 sm:p-6 space-y-5 text-center sm:text-left">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium transition-all"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteDialog;
