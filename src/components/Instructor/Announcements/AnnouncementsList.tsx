import { useState } from "react";
import { Pin } from "lucide-react";
import PinToggle from "./PinToggle";
import {
  usePinAnnouncementMutation,
  useUnpinAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "../../../app/api/instructor/instructorApi"; 
import { Announcement } from "../../../app/api/instructor/instructor.type";
import Modal from "../../common/modal/Modal";
import EditAnnouncementForm from "../../Instructor/Announcements/EditAnnouncementForm";
import ConfirmDeleteDialog from "../../common/modal/ConfirmDeleteDialog";


type Props = {
  announcements: Announcement[];
};

export default function AnnouncementsList({
  announcements,
}: Readonly<Props>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [deleteAnnouncement, { isLoading: deleting }] =
    useDeleteAnnouncementMutation();
  const [pinAnnouncement] = usePinAnnouncementMutation();
  const [unpinAnnouncement] = useUnpinAnnouncementMutation();



  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAnnouncement(deletingId).unwrap();
      setDeletingId(null);
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };
const handleEdit = (announcement: Announcement) => {
  setEditingId(announcement.id);
  setSelectedAnnouncement(announcement);
};
  const togglePin = async (a: Announcement) => {
    try {
      if (a.is_pinned) await unpinAnnouncement(a.id).unwrap();
      else await pinAnnouncement(a.id).unwrap();
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8 border border-dashed rounded-md">
        No announcements yet. Click <strong>+ New Announcement</strong> to
        create one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...announcements]
        .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
        .map((a) => {
          const isEditing = editingId === a.id;
          return (
            <div
              key={a.id}
              className={`bg-white border rounded-lg shadow-sm transition-all duration-200 p-4 space-y-3
          ${a.is_pinned ? "border-brand-500 bg-yellow-50" : "hover:shadow-lg"}`}
            >
              {/* ===== Desktop / Tablet Layout ===== */}
              <div className="hidden sm:flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {a.title}
                    {a.is_pinned && (
                      <Pin size={16} className="text-brand-500" />
                    )}
                  </h3>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(a.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PinToggle
                    pinned={a.is_pinned}
                    onToggle={() => togglePin(a)}
                  />
                  {!isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="bg-white text-brand-500 border border-brand-500 rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:bg-brand-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(a.id);
                          setSelectedAnnouncement(a);
                        }}
                        className="text-red-600 border border-red-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== Mobile Layout ===== */}
              <div className="flex flex-col sm:hidden">
                {/* Top Row: Title + Pin */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {a.title}
                    </h3>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="ml-2">
                    <PinToggle
                      pinned={a.is_pinned}
                      onToggle={() => togglePin(a)}
                    />
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 whitespace-pre-line mt-3">
                  {a.content}
                </p>

                {/* Buttons Row */}
                {!isEditing && (
                  <div className="flex justify-between gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(a)}
                      className="flex-1 bg-white text-brand-500 border border-brand-500 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-brand-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(a.id);
                        setSelectedAnnouncement(a);
                      }}
                      className="flex-1 text-red-600 border border-red-600 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Shared Content (for both views on larger screens) */}
              <div className="hidden sm:block">
                <p className="text-gray-700 whitespace-pre-line">{a.content}</p>
              </div>
            </div>
          );
        })}

    

      {/* --- Edit Modal (optional alternative) --- */}
      <Modal isOpen={!!editingId} onClose={() => setEditingId(null)}>
        {editingId && selectedAnnouncement && (
          <EditAnnouncementForm
            announcement={selectedAnnouncement}
            onSuccess={() => setEditingId(null)}
          />
        )}
      </Modal>

      {/* --- Delete Confirmation --- */}
      <ConfirmDeleteDialog
        isOpen={!!deletingId}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Announcement"
        message={`Are you sure you want to delete “${selectedAnnouncement?.title}”?`}
      />
    </div>
  );
}
