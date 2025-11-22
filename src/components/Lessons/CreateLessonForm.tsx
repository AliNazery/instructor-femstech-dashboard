import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useCreateLessonMutation } from "../../app/api/instructor/instructorApi";

interface CreateLessonFormProps {
  onSuccess: () => void;
  moduleId: number;
}

const CreateLessonForm: FC<CreateLessonFormProps> = ({ onSuccess, moduleId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [order, setOrder] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const [createLesson, { isLoading }] = useCreateLessonMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId || !title) {
      toast.error("Module and Title are required");
      return;
    }

    const formData = new FormData();
    formData.append("module_id", moduleId.toString());
    formData.append("title", title);
    formData.append("description", description);
    if (duration) formData.append("duration_minutes", duration.toString());
    if (order) formData.append("order_index", order.toString());
    formData.append("video_url", videoUrl);
    formData.append("is_preview", isPreview ? "1" : "0");

    try {
      await createLesson(formData).unwrap();
      toast.success("Lesson created successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to create lesson");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create Lesson</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lesson Title"
        className="border rounded p-2"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Lesson Description"
        className="border rounded p-2"
      />

      <input
        type="number"
        value={duration ?? ""}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="Duration (minutes)"
        className="border rounded p-2"
      />

      <input
        type="number"
        value={order ?? ""}
        onChange={(e) => setOrder(Number(e.target.value))}
        placeholder="Order Index"
        className="border rounded p-2"
      />

      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Video URL"
        className="border rounded p-2"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPreview}
          onChange={(e) => setIsPreview(e.target.checked)}
        />
        Preview Lesson
      </label>

      <button
        type="submit"
        className="bg-brand-950 hover:bg-brand-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateLessonForm;
