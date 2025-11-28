import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetNotificationCountsQuery,
} from "../../../app/api/instructorOverviewApi/instructorOverviewApi";
import { CheckCheck, BellRing, Link2, Loader2 } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import { Button } from "../../../components/ui/InstructorButton/Button";




// ✅ Utility: Group notifications by timeframe
function groupByTimeframe(notifications: any[]): [string, any[]][] {
  const groups: Record<string, any[]> = {
    Today: [],
    "This Week": [],
    "This Month": [],
    Older: [],
  };

  const now = new Date();

  notifications.forEach((n) => {
    const created = new Date(n.created_at);
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);

    if (diffDays < 1) groups["Today"].push(n);
    else if (diffDays < 7) groups["This Week"].push(n);
    else if (diffDays < 30) groups["This Month"].push(n);
    else groups["Older"].push(n);
  });

  return Object.entries(groups).filter(([, arr]) => arr.length > 0);
}

function getTypeLink(type: string): string {
  switch (type) {
    case "course":
    case "lesson":
    case "quiz":
    case "assignment":
      return "/instructor/courses";
    case "payment":
      return "/instructor/earnings";
    default:
      return "/instructor/home";
  }
}

export default function InstructorNotificationsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);

  // ✅ Fetch data
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useGetNotificationsQuery();

  const { data: countData } = useGetNotificationCountsQuery();
  const [markRead, { isLoading: marking }] = useMarkNotificationsReadMutation();

  const notifications = notificationsData?.data ?? [];
  const unreadCount = countData?.data?.unread ?? 0;
  const readCount =
    countData?.data?.total !== undefined
      ? countData.data.total - unreadCount
      : 0;

  const grouped = groupByTimeframe(notifications);

  // ✅ Select/Deselect notifications
  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Mark selected
  async function handleMarkSelectedRead() {
    if (selected.length === 0) return;
    await markRead({ ids: selected }).unwrap();
    setSelected([]);
    refetch();
  }

  return (
    <div className="p-2">
      <PageMeta
        title="Notifications | Instructor Dashboard"
        description="Stay informed with updates about your courses, students, and payments."
      />
      <PageBreadcrumb pageTitle="Notifications" />
      <PageLayoutSection
        title="All Notifications"
        description="Stay updated with your courses, students, and payment activities."
      >
        {/* Header Summary */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <BellRing className="text-orange-500" />
            <span>
              <strong>{unreadCount}</strong> unread ·{" "}
              <strong>{readCount}</strong> read
            </span>
          </div>

          {selected.length > 0 && (
            <button
              onClick={handleMarkSelectedRead}
              disabled={marking}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-700 transition text-sm"
            >
              {marking ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <CheckCheck size={16} />
              )}
              Mark selected as read ({selected.length})
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-gray-500 flex items-center justify-center py-10">
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Loading notifications...
          </div>
        )}

        {/* Empty state */}
        {!isLoading && notifications.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            No notifications yet.
          </p>
        )}

        {/* Notifications grouped */}
        <div className="space-y-8">
          {grouped.map(([label, items]) => (
            <div key={label}>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {label}
              </h3>
              <div className="space-y-3">
                {items.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-4 cursor-pointer transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/30 ${
                      !n.is_read
                        ? "border-orange-400/40 bg-orange-50 dark:bg-gray-800/30"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selected.includes(n.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect(n.id);
                        }}
                        className="mt-1 accent-orange-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800 dark:text-gray-100">
                            {n.title}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {new Date(n.created_at).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {n.description || n.message}
                        </p>

                        {n.type && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(getTypeLink(n.type));
                            }}
                            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-500 border border-blue-100 font-medium text-sm rounded-md transition-colors duration-150"
                          >
                            <Link2 size={14} className="text-brand-500" />
                            Go to related section
                          </button>
                        )}
                      </div>
                    </div>

                    {!n.is_read && (
                      <Button
                        variant="outline"
                        disabled={marking}
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead({ ids: [n.id] }).then(() => refetch());
                        }}
                        className="text-xs text-brand-500 hover:text-white flex items-center gap-1"
                      >
                        <CheckCheck size={14} /> Mark read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageLayoutSection>
    </div>
  );
}

// import {
//   useGetNotificationsQuery,
//   useMarkNotificationsReadMutation,
// } from "../../../app/api/instructorOverviewApi/instructorOverviewApi";

// export default function NotificationsPage() {
//   const { data, isLoading, isError } = useGetNotificationsQuery();
//   const [markRead] = useMarkNotificationsReadMutation();

//   const notifications = data?.data ?? [];

//   const handleMarkRead = async (id: number) => {
//     await markRead({ ids: [id] });
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Failed to load notifications.</p>;
//   if (notifications.length === 0) return <p>No notifications found.</p>;

//   return (
//     <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
//       <h2 className="text-xl font-semibold mb-4">All Notifications</h2>
//       <ul className="space-y-3">
//         {notifications.map((n) => (
//           <li
//             key={n.id}
//             className={`p-4 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
//               !n.is_read ? "bg-gray-50 dark:bg-gray-800" : ""
//             }`}
//             onClick={() => handleMarkRead(n.id)}
//           >
//             <div className="font-medium text-gray-800 dark:text-white">
//               {n.title}
//             </div>
//             {n.description && (
//               <div className="text-sm text-gray-500 dark:text-gray-400">
//                 {n.description}
//               </div>
//             )}
//             <div className="text-xs text-gray-400 mt-1">
//               {new Date(n.created_at).toLocaleDateString()}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
