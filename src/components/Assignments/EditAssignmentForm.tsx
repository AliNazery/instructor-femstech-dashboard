import { FC, useState } from "react";
import { toast } from "react-toastify";
import { Assignment } from "../../app/api/instructor/instructor.type";
import { useUpdateAssignmentMutation } from "../../app/api/instructor/instructorApi";

interface EditAssignmentFormProps {
  assignment: Assignment;
  onSuccess: () => void;
}

const EditAssignmentForm: FC<EditAssignmentFormProps> = ({
  assignment,
  onSuccess,
}) => {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [expirationDate, setExpirationDate] = useState(
    assignment.expiration_date
  );

  const [updateAssignment, { isLoading }] = useUpdateAssignmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !expirationDate) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await updateAssignment({
        id: assignment.id,
        entity_type: assignment.entity_type,
        entity_id: assignment.entity_id,
        title,
        description,
        expiration_date: expirationDate,
      }).unwrap();
      toast.success("Assignment updated successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to update assignment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[320px]">
      <h2 className="text-lg font-semibold">Edit Assignment</h2>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 min-h-[80px]"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Expiration Date</span>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="border rounded p-2"
          required
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-brand-500 hover:bg-brand-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Assignment"}
      </button>
    </form>
  );
};

export default EditAssignmentForm;
