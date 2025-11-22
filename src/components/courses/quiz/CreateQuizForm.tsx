import { FC, useState } from "react";
import { toast } from "react-toastify";

interface CreateQuizFormProps {
  entityType: "course" | "module" | "lesson";
  entityId: number;
  onCreate: (formData: FormData) => Promise<void>;
  onSuccess: () => void;
}

const CreateQuizForm: FC<CreateQuizFormProps> = ({
  entityType,
  entityId,
  onCreate,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    const formData = new FormData();
    formData.append("entity_type", entityType);
    formData.append("entity_id", entityId.toString());
    formData.append("title", title);
    formData.append("instructions", instructions);

    try {
      setIsSubmitting(true);
      await onCreate(formData);
      toast.success("Quiz created successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create New Quiz</h2>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="border rounded-lg p-2"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Optional instructions"
          className="border rounded-lg p-2 min-h-[80px]"
        />
      </div>

      <button
        type="submit"
        className="bg-brand-950 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Quiz"}
      </button>
    </form>
  );
};

export default CreateQuizForm;
