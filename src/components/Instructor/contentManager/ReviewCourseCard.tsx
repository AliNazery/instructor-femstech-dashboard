import { GraduationCap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Course } from "../../../app/api/instructor/instructor.type";


type ReviewCourseCardProps = {
  course: Course;
};

export function ReviewCourseCard({ course }: Readonly<ReviewCourseCardProps>) {
  const thumbnailSrc = course.thumbnail_url ? course.thumbnail_url : null;

  return (
    <motion.div
      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        {thumbnailSrc ? (
          <motion.img
            alt={course.title}
            src={thumbnailSrc}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <GraduationCap className="w-12 h-12 text-gray-300" />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-brand-700 line-clamp-2">
          {course.title}
        </h4>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
          {course.description ?? "No description available."}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
            {course.level ?? "—"}
          </span>
        </div>

        <div className="mt-5">
          <Link
            to={`/instructor/reviews/courses/${course.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-700 transition"
          >
            <Star className="w-4 h-4 mr-2" />
            See Student Feedback
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
