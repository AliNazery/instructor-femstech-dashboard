import { FC, useState } from "react";
import { toast } from "react-toastify";
import { Lesson } from "../../../app/api/instructor/instructor.type";
import { useUpdateLessonMutation } from "../../../app/api/instructor/instructorApi";

interface EditLessonFormProps {
  lesson: Lesson;
  onSuccess: () => void;
}

const EditLessonForm: FC<EditLessonFormProps> = ({ lesson, onSuccess }) => {
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [duration, setDuration] = useState<number>(
    Number(lesson.duration_minutes)
  );
  const [order, setOrder] = useState<number | null>(
    lesson.order_index ? Number(lesson.order_index) : null
  );
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? "");
  const [isPreview, setIsPreview] = useState(lesson.is_preview);

  const [updateLesson, { isLoading }] = useUpdateLessonMutation();
const moduleId = lesson.module_id ? Number(lesson.module_id) : null;
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
    formData.append("duration_minutes", duration.toString());
    if (order) formData.append("order_index", order.toString());
    formData.append("video_url", videoUrl);
    formData.append("is_preview", isPreview ? "1" : "0");
    formData.append("_method", "PUT");

    try {
      await updateLesson({ id: lesson.id, formData }).unwrap();
      toast.success("Lesson updated successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to update lesson");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Edit Lesson</h2>

      <div className="flex flex-col">
        <label htmlFor="lessonTitle" className="mb-1 font-medium text-sm">
          Lesson Title
        </label>
        <input
          id="lessonTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson Title"
          className="border rounded p-2"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="lessonDescription" className="mb-1 font-medium text-sm">
          Lesson Description
        </label>
        <textarea
          id="lessonDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lesson Description"
          className="border rounded p-2"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="lessonDuration" className="mb-1 font-medium text-sm">
          Duration (minutes)
        </label>
        <input
          id="lessonDuration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (minutes)"
          className="border rounded p-2"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="lessonOrder" className="mb-1 font-medium text-sm">
          Order Index
        </label>
        <input
          id="lessonOrder"
          type="number"
          value={order ?? ""}
          onChange={(e) => setOrder(Number(e.target.value))}
          placeholder="Order Index"
          className="border rounded p-2"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="lessonVideoUrl" className="mb-1 font-medium text-sm">
          Video URL
        </label>
        <input
          id="lessonVideoUrl"
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Video URL"
          className="border rounded p-2"
        />
      </div>

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
        className="bg-brand-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditLessonForm;
