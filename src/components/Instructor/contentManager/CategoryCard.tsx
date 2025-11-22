import { BookOpen } from "lucide-react";
import { CardActions } from "./CardActions";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../../app/api/config/constant";
import { Category } from "../../../app/api/instructor/instructor.type";

type CategoryCardProps = {
  category: Category;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CategoryCard({
  category,
  onClick,
  onEdit,
  onDelete,
}: Readonly<CategoryCardProps>) {
  const thumbnailSrc = category.thumbnail_url
    ? `${API_BASE_URL}/${category.thumbnail_url}`
    : null;
  
  return (
    <motion.div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-brand-950 h-[320px]"
      whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {category.thumbnail_url ? (
          <motion.img
            alt={category.title}
            src={thumbnailSrc || ""}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <BookOpen className="w-12 h-12 text-gray-300" />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-brand-950 line-clamp-2">
          {category.title}
        </h3>
        <p className="mt-2 text-xs text-gray-500 flex-1">
          Explore courses in this category.
        </p>

        {/* Action buttons */}
        <CardActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </motion.div>
  );
}
