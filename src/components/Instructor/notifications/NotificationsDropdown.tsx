import { FC, useState } from "react";
import NotificationItem, { Notification } from "./NotificationItem";

interface NotificationsDropdownProps {
  notifications: Notification[];
}

const NotificationsDropdown: FC<NotificationsDropdownProps> = ({
  notifications,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 transition"
      >
        Notifications ({items.filter((n) => !n.isRead).length})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white shadow-xl border rounded-md z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-gray-800">Notifications</span>
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-600 hover:underline"
            >
              Mark All Read
            </button>
          </div>
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">
              No notifications
            </p>
          ) : (
            items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onToggleRead={toggleRead}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
