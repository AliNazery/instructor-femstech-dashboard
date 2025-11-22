// src/features/notifications/pages/NotificationsPage.tsx
import NotificationsDropdown from "../../../components/newDesignComponents/notifications/NotificationsDropdown";
import { Notification } from "../../../components/newDesignComponents/notifications/NotificationItem";

const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "New Enrollment",
    message: "Student John enrolled in your React course.",
    relatedLink: "#",
    isRead: false,
    date: new Date().toISOString(),
  },
  {
    id: "n2",
    title: "Course Updated",
    message: "Your course JavaScript Advanced was updated.",
    relatedLink: "#",
    isRead: true,
    date: new Date().toISOString(),
  },
  {
    id: "n3",
    title: "Assignment Submitted",
    message: "Student Jane submitted Assignment 3.",
    relatedLink: "#",
    isRead: false,
    date: new Date().toISOString(),
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <NotificationsDropdown notifications={mockNotifications} />
    </div>
  );
}
