import { FC } from "react";

export type Notification = {
  id: string;
  title: string;
  message: string;
  relatedLink?: string;
  isRead: boolean;
  date: string;
};

interface NotificationItemProps {
  notification: Notification;
  onToggleRead: (id: string) => void;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onToggleRead,
}) => {
  return (
    <div
      className={`flex justify-between items-start p-4 border-b transition-colors duration-200 rounded-md hover:bg-gray-50 ${
        notification.isRead ? "bg-white" : "bg-indigo-50"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          )}
          <h4 className="font-semibold text-gray-800">{notification.title}</h4>
        </div>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <span className="text-xs text-gray-400">
          {new Date(notification.date).toLocaleString()}
        </span>
        {notification.relatedLink && (
          <a
            href={notification.relatedLink}
            className="text-indigo-600 hover:underline text-sm mt-1"
          >
            View
          </a>
        )}
      </div>
      <button
        onClick={() => onToggleRead(notification.id)}
        className={`px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
          notification.isRead
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        }`}
      >
        {notification.isRead ? "Mark Unread" : "Mark Read"}
      </button>
    </div>
  );
};

export default NotificationItem;
