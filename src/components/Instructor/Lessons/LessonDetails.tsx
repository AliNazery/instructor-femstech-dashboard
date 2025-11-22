import { FC } from "react";
import { Lesson } from "../../../app/api/instructor/instructor.type";
import { API_BASE_URL } from "../../../app/api/config/constant";

type LessonDetailsProps = {
  lesson: Lesson;
};

const fieldClass =
  "grid grid-cols-[140px_1fr] gap-x-4 py-2 border-b last:border-b-0 border-gray-200 text-sm";

const labelClass = "text-gray-500 font-medium";

// Helper to detect YouTube video and get embed URL
const getEmbedUrl = (url: string) => {
  const youtubeRegex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const LessonDetails: FC<LessonDetailsProps> = ({ lesson }) => {
  const videoSrc = lesson.video_url?.startsWith("http")
    ? lesson.video_url
    : `${API_BASE_URL}${lesson.video_url || ""}`;

  const youtubeEmbedUrl = lesson.video_url
    ? getEmbedUrl(lesson.video_url)
    : null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 w-full max-w-[720px] max-h-[80vh] mx-auto flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Lesson Details</h2>

      {/* Video Section */}

      {/* Video Section */}
      <div className="mb-6">
        {(() => {
          if (!lesson.video_url) {
            return (
              <div className="w-full h-[200px] rounded-lg border flex items-center justify-center text-gray-400">
                No Video
              </div>
            );
          }

          if (youtubeEmbedUrl) {
            return (
              <div className="w-full h-[360px] rounded-lg overflow-hidden border">
                <iframe
                  width="100%"
                  height="100%"
                  src={youtubeEmbedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
          }

          return (
            <div className="w-full h-[360px] rounded-lg overflow-hidden border">
              <video
                src={videoSrc}
                className="w-full h-full object-contain bg-black"
                controls
              >
                <track
                  src="captions_en.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                  default
                />
              </video>
            </div>
          );
        })()}
      </div>

      {/* Scrollable Meta Info */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-white dark:bg-gray-900 p-4">
        <div className="flex flex-col gap-2">
          <div className={fieldClass}>
            <span className={labelClass}>Title</span>
            <span>{lesson.title}</span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Description</span>
            <span>{lesson.description || "—"}</span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Order</span>
            <span>{lesson.order_index ?? "—"}</span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Duration</span>
            <span>
              {lesson.duration_minutes ? `${lesson.duration_minutes} min` : "—"}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Preview Available</span>
            <span>{lesson.is_preview ? "Yes" : "No"}</span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Created At</span>
            <span>{new Date(lesson.created_at).toLocaleString()}</span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Updated At</span>
            <span>{new Date(lesson.updated_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
