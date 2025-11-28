import { Megaphone, ArrowRight, Loader2 } from "lucide-react";
import { useGetCourseAnnouncementsQuery } from "../../../app/api/instructor/instructorApi";


interface Props {
  courseId: string;
  limit?: number;
  onManage?: () => void;
}

export default function CourseAnnouncements({
  courseId,
  limit = 3,
  onManage,
}: Readonly<Props>) {
  const numericCourseId = Number(courseId);

  const {
    data: announcementsData,
    isLoading,
    isError,
  } = useGetCourseAnnouncementsQuery(numericCourseId, {
    skip: !numericCourseId,
  });

  const announcements = announcementsData?.data ?? [];
  const limited = announcements.slice(0, limit);

  return (
    <section className="space-y-4 border border-brand-500 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Megaphone size={20} className="text-brand-500" />
          Announcements
        </h2>

        {onManage && (
          <button
            onClick={onManage}
            className="text-sm text-brand-500 font-medium hover:underline flex items-center gap-1"
          >
            Manage <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* --- Loading State --- */}
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
          <Loader2 className="animate-spin" size={16} />
          Loading announcements...
        </div>
      )}

      {/* --- Error State --- */}
      {isError && (
        <p className="text-red-500 dark:text-red-400 text-sm">
          Failed to load announcements. Please try again.
        </p>
      )}

      {/* --- Empty State --- */}
      {!isLoading && !isError && limited.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          No announcements yet.
        </p>
      )}

      {/* --- Announcements List --- */}
      {!isLoading && !isError && limited.length > 0 && (
        <div className="grid gap-3">
          {limited.map((a: any) => (
            <div
              key={a.id}
              className="p-4 border rounded-lg bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                {a.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {a.content || a.body}
              </p>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(a.created_at || a.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
