import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateAnnouncementMutation } from "../../app/api/instructor/instructorApi";
import { Announcement } from "../../app/api/instructor/instructor.type";

interface Props {
  announcement: Announcement;
  onSuccess: () => void;
}

const EditAnnouncementForm: FC<Props> = ({ announcement, onSuccess }) => {
  const [title, setTitle] = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
  const [isPinned, setIsPinned] = useState(announcement.is_pinned);

  const [updateAnnouncement, { isLoading }] = useUpdateAnnouncementMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      await updateAnnouncement({
        id: announcement.id,
        data: { title, content, is_pinned: isPinned },
      }).unwrap();
      toast.success("Announcement updated successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to update announcement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[320px]">
      <h2 className="text-lg font-semibold">Edit Announcement</h2>

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
        <span className="text-sm font-medium">Content</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        {isLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditAnnouncementForm;
