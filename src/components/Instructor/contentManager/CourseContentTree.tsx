import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeleteModuleMutation,
  useGetModulesQuery,
} from "../../../app/api/instructor/instructorApi";
import LoadingSpinner from "../../common/LoadingSpinner";
import EmptyState from "../../common/EmptyState";
import Modal from "../../common/modal/Modal";
import EditModuleForm from "../../CourseModules/EditModuleForm";
import ConfirmDeleteDialog from "../../common/modal/ConfirmDeleteDialog";
import { toast } from "react-toastify";
import { CourseModule } from "../../../app/api/instructor/instructor.type";
import LessonList from "../Lessons/LessonList";

type Props = {
  courseId: number;
};

export default function CourseContentTree({ courseId }: Readonly<Props>) {
  const {
    data: modules,
    isLoading,
    isError,
    isFetching,
  } = useGetModulesQuery({
    course_id: courseId,
  });

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  const [deleteModule, { isLoading: deleting }] = useDeleteModuleMutation();

  const toggle = (mid: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(mid)) {
        next.delete(mid);
      } else {
        next.add(mid);
      }
      return next;
    });
  };

  const handleEdit = (module: CourseModule) => {
    setSelectedModule(module);
    setIsEditOpen(true);
  };

  const handleDelete = (module: CourseModule) => {
    setSelectedModule(module);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedModule) return;
    try {
      await deleteModule({ id: selectedModule.id }).unwrap();
      toast.success("Module deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedModule(null);
    } catch (err) {
      console.error("Failed to delete module:", err);
      toast.error("Failed to delete module.");
    }
  };
  if (!modules?.data.length) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-neutral-900 shadow-inner">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No modules yet. Start by adding a module to structure your course
          content.
        </p>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return <LoadingSpinner text="Loading modules..." fullScreen={false} />;
  }
  if (isError) {
    return (
      <EmptyState
        title="Error"
        description="Failed to load modules or lessons"
      />
    );
  }

  return (
    <div className="space-y-4">
      {modules?.data.map((mod) => {
        const isOpen = expandedModules.has(mod.id.toString());
        return (
          <motion.div
            key={mod.id}
            layout
            className="border border-brand-500 rounded-lg bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2 
                       hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors "
            >
              <button
                type="button"
                onClick={() => toggle(mod.id.toString())}
                className="flex items-center justify-between w-full sm:w-auto px-4 py-2 
                         hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors /* UPDATED: full width on mobile */"
              >
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
                  {isOpen ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                  {isOpen ? (
                    <FolderOpen size={18} className="text-brand-500" />
                  ) : (
                    <Folder size={18} className="text-gray-400" />
                  )}
                  <span
                    className={`transition-colors ${
                      isOpen
                        ? "text-brand-500 dark:text-brand-400"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {mod.title}
                  </span>
                </div>
              </button>

              <div className="flex flex-wrap gap-2 sm:gap-3 justify-end w-full sm:w-auto px-4 py-2 /* UPDATED: wrap and full width for mobile buttons */">
                <button
                  onClick={() => handleEdit(mod)}
                  className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 
                transition-colors"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(mod)}
                  className="flex items-center gap-2 text-sm text-red-600 
               hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            {/* Module Expanded Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="px-4 py-3 border-t bg-gray-50 dark:bg-neutral-900 space-y-4"
                >
                  {/* Lessons */}
                  <LessonList moduleId={mod.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selectedModule && (
          <EditModuleForm
            module={selectedModule}
            onSuccess={() => setIsEditOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Module"
        message={`Are you sure you want to delete "${selectedModule?.title}"?`}
      />
    </div>
  );

}
