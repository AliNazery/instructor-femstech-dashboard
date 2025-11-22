import { useState, useMemo, useEffect } from "react";
import { BellRing, X, CheckCheck } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useGetNotificationCountsQuery,
  useMarkNotificationsReadMutation,
} from "../../app/api/instructorOverviewApi/instructorOverviewApi";

export default function NotificationDropdown() {
  const navigate = useNavigate();

  // Separate states for desktop and mobile
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: notificationsData, refetch } = useGetNotificationsQuery();
  const { data: countData, refetch: refetchCount } =
    useGetNotificationCountsQuery();
  const [markRead, { isLoading: marking }] = useMarkNotificationsReadMutation();

  const notifications = notificationsData?.data ?? [];
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.is_read),
    [notifications]
  );
  const unreadCount = countData?.data?.unread ?? unreadNotifications.length;

  async function handleMarkAllRead() {
    const unreadIds = unreadNotifications.map((n) => n.id);
    if (unreadIds.length > 0) {
      await markRead({ ids: unreadIds });
      refetch();
      refetchCount();
    }
  }

  async function handleMarkSingleRead(id: number) {
    await markRead({ ids: [id] });
    refetch();
    refetchCount();
  }

  // ✨ Inline animation styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-slideUp {
        animation: slideUp 0.25s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  function closeAfter(action: () => void | Promise<void>) {
    Promise.resolve(action()).finally(() => {
      setIsMobileOpen(false);
    });
  }

  return (
    <div className="relative">
      {/* 🔔 Notification Button */}
      <button
        onClick={() => setIsDesktopOpen((p) => !p)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-md text-gray-700 hover:text-gray-900 hover:bg-white transition-all shadow-sm dark:bg-gray-900/70 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold px-1.5 shadow-sm">
            {unreadCount}
          </span>
        )}
        <BellRing size={20} />
      </button>

      {/* 💻 Desktop / Tablet Dropdown */}
      <Dropdown
        isOpen={isDesktopOpen}
        onClose={() => setIsDesktopOpen(false)}
        className="hidden md:block fixed z-50 right-0 mt-3 mr-12 w-[360px] max-h-[460px] flex  flex-col rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl p-4 shadow-lg transition-all duration-200 ease-out dark:border-gray-800 dark:bg-gray-900/90 overflow-y-scroll"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Notifications
          </h5>
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={marking}
                className="flex items-center gap-1 text-xs font-medium text-brand-950 hover:text-brand-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
              >
                <CheckCheck size={14} />
                {marking ? "Marking..." : "Mark all read"}
              </button>
            )}
            <button
              onClick={() => setIsDesktopOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* LIST */}
        <ul className="flex flex-col overflow-y-auto flex-1 custom-scrollbar ">
          {unreadNotifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <BellRing size={26} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">You're all caught up!</p>
              <p className="text-xs text-gray-400 mt-1">
                No new notifications right now.
              </p>
            </li>
          ) : (
            unreadNotifications.map((item) => (
              <li key={item.id}>
                <DropdownItem
                  onItemClick={() => handleMarkSingleRead(item.id)}
                  className="flex gap-3 rounded-xl p-3 bg-orange-50/60 dark:bg-gray-800/30 hover:bg-orange-100/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group "
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-gray-500 text-sm dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </span>
                    )}
                    <span className="text-gray-400 text-xs mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        {/* FOOTER */}
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => {
              navigate("/instructor/notifications");
              setIsDesktopOpen(false);
            }}
            className="w-full py-2 text-center text-sm font-medium text-brand-950 hover:text-brand-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all notifications →
          </button>
        </div>
      </Dropdown>

      {/* 📱 Mobile Fullscreen Drawer */}
      <button
        className="md:hidden absolute top-0 right-0 h-11 w-11"
        onClick={() => setIsMobileOpen((p) => !p)}
      >
        {/* You can put a bell icon or keep empty */}
      </button>

      {isMobileOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col p-4 animate-slideUp mt-16 md:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Notifications
            </h5>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {unreadNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                <BellRing size={40} className="mb-2 text-gray-400" />
                <p className="text-sm font-medium">No new notifications</p>
              </div>
            ) : (
              unreadNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkSingleRead(n.id)}
                  className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-orange-50/60 dark:bg-gray-800/30 hover:bg-orange-100/60 transition cursor-pointer"
                >
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {n.title}
                  </p>
                  {n.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {n.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() =>
                closeAfter(() => navigate("/instructor/notifications"))
              }
              className="w-full py-2 text-center text-sm font-medium text-brand-950 hover:text-brand-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
