import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useCreateAnnouncementMutation } from "../../app/api/instructor/instructorApi";

interface Props {
  courseId: number;
  onSuccess: () => void;
}

const CreateAnnouncementForm: FC<Props> = ({ courseId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      await createAnnouncement({
        course_id: courseId,
        title,
        content,
        is_pinned: isPinned,
      }).unwrap();
      toast.success("Announcement created successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to create announcement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[320px]">
      <h2 className="text-lg font-semibold">Create Announcement</h2>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title"
          className="border rounded p-2"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Content</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter announcement content"
          className="border rounded p-2 min-h-[80px]"
          required
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPinned}
          onChange={() => setIsPinned(!isPinned)}
        />
        <span className="text-sm">Pin this announcement</span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-brand-950 hover:bg-brand-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateAnnouncementForm;
