import { FC, useState } from "react";
import { toast } from "react-toastify";
import { Quiz } from "../../../app/api/instructor/instructor.type";

interface EditQuizFormProps {
  quiz: Quiz;
  onSuccess: () => void;
  onUpdate: (formData: FormData) => Promise<void>;
}

const EditQuizForm: FC<EditQuizFormProps> = ({ quiz, onSuccess, onUpdate }) => {
  const [title, setTitle] = useState(quiz.title);
  const [instructions, setInstructions] = useState(quiz.instructions || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    const formData = new FormData();
    formData.append("entity_type", quiz.entity_type);
    formData.append("entity_id", quiz.entity_id.toString());
    formData.append("title", title);
    formData.append("instructions", instructions || "");
    formData.append("_method", "PUT");

    try {
      setIsSubmitting(true);
      await onUpdate(formData);
      toast.success("Quiz updated successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Edit Quiz</h2>

      {/* Quiz title */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz title"
          className="border rounded-lg p-2"
          required
        />
      </div>

      {/* Quiz instructions */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Optional instructions"
          className="border rounded-lg p-2 min-h-[80px]"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update Quiz"}
      </button>
    </form>
  );
};

export default EditQuizForm;
