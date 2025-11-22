import {HelpCircle, Pencil, Trash2 } from "lucide-react";

type CardActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onQuiz?: () => void;
};

export function CardActions({ onEdit, onDelete, onQuiz }: Readonly<CardActionsProps>) {
  return (
    <div className="mt-3 flex justify-between items-center gap-2">
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 border border-brand-950 hover:bg-brand-700 p-2 rounded-2xl"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
      )}

      {onQuiz && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuiz();
          }}
          className="flex items-center gap-1 text-sm text-gray-700 border border-brand-950 hover:bg-brand-700 p-2 rounded-2xl"
        >
          <HelpCircle className="w-4 h-4" /> Quiz
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-1 text-sm text-gray-700 border border-brand-950 hover:bg-brand-700 p-2 rounded-2xl"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      )}
    </div>
  );
}
