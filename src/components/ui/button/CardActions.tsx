import { Eye, Pencil, Trash2 } from "lucide-react";

type CardActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CardActions({ onView, onEdit, onDelete }: Readonly<CardActionsProps>) {
  return (
    <div className="mt-3 flex flex-wrap justify-start items-center gap-2">
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md 
                     bg-brand-50 text-brand-950 hover:bg-brand-100 transition"
        >
          <Eye className="w-4 h-4" /> View
        </button>
      )}

      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md 
                     bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
      )}

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md 
                     bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      )}
    </div>
  );
}
