import { useState } from "react";
import NotificationItem, {
  Notification,
} from "../../../components/newDesignComponents/notifications/NotificationItem";

const mockNotifications: Notification[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: `n${i + 1}`,
    title: `Notification ${i + 1}`,
    message: `This is a message for notification ${i + 1}.`,
    relatedLink: "#",
    isRead: i % 3 === 0,
    date: new Date(Date.now() - i * 3600000).toISOString(),
  })
);

export default function NotificationsListPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">All Notifications</h1>
        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          Mark All Read
        </button>
      </header>

      <div className="space-y-2">
        {notifications.length === 0 && (
          <p className="text-gray-500 p-4 border rounded bg-gray-50 text-center">
            No notifications
          </p>
        )}

        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onToggleRead={toggleRead}
          />
        ))}
      </div>

      {/* Optional pagination */}
      {notifications.length > 10 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button className="px-3 py-1 bg-gray-100 rounded">Prev</button>
          <button className="px-3 py-1 bg-gray-100 rounded">Next</button>
        </div>
      )}
    </div>
  );
}
