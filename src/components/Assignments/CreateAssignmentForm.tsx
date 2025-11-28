import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useCreateAssignmentMutation } from "../../app/api/instructor/instructorApi";

interface CreateAssignmentFormProps {
  entityType: "course" | "module" | "lesson";
  entityId: number;
  onSuccess: () => void;
}

const CreateAssignmentForm: FC<CreateAssignmentFormProps> = ({
  entityType,
  entityId,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !expirationDate) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await createAssignment({
        entity_type: entityType,
        entity_id: entityId,
        title,
        description,
        expiration_date: expirationDate,
      }).unwrap();
      toast.success("Assignment created successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to create assignment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[320px]">
      <h2 className="text-lg font-semibold">Create Assignment</h2>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title"
          className="border rounded p-2"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter assignment description"
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
        {isLoading ? "Creating..." : "Create Assignment"}
      </button>
    </form>
  );
};

export default CreateAssignmentForm;
