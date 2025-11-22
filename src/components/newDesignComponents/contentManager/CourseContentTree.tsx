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
import LessonList from "../../Lessons/LessonList";

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
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(
    null
  );
  const [deleteModule, { isLoading: deleting }] = useDeleteModuleMutation();

  const toggle = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
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

  if (isLoading || isFetching)
    return <LoadingSpinner text="Loading modules..." fullScreen={false} />;

  if (isError)
    return (
      <EmptyState
        title="Error"
        description="Failed to load modules or lessons"
      />
    );

  if (!modules?.data.length)
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-neutral-900 shadow-inner">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No modules yet. Start by adding a module to structure your course
          content.
        </p>
      </div>
    );

  return (
    <div className="space-y-4 w-full max-w-full">
      {modules?.data.map((mod) => {
        const isOpen = expandedModules.has(mod.id.toString());

        return (
          <motion.div
            key={mod.id}
            layout
            className="border border-gray-200 dark:border-neutral-800 rounded-lg 
                       bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md 
                       transition-shadow duration-200"
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between 
                         gap-2 sm:gap-4 px-3 sm:px-4 py-3 
                         hover:bg-gray-50 dark:hover:bg-neutral-800 
                         transition-colors duration-150"
            >
              {/* Module Title + Toggle */}
              <button
                type="button"
                onClick={() => toggle(mod.id.toString())}
                aria-expanded={isOpen}
                className="flex items-center justify-between sm:justify-start 
                           w-full sm:w-auto text-left group"
              >
                <div className="flex items-start sm:items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 flex-1 min-w-0">
                  {isOpen ? (
                    <ChevronDown
                      size={18}
                      className="text-gray-500 flex-shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-gray-500 flex-shrink-0"
                    />
                  )}
                  {isOpen ? (
                    <FolderOpen
                      size={18}
                      className="text-brand-950 dark:text-brand-400 flex-shrink-0"
                    />
                  ) : (
                    <Folder size={18} className="text-gray-400 flex-shrink-0" />
                  )}
                  <span
                    className={`break-words whitespace-normal overflow-visible text-wrap
      sm:whitespace-normal sm:break-words sm:overflow-visible
      transition-colors ${
        isOpen
          ? "text-brand-950 dark:text-brand-400"
          : "text-gray-800 dark:text-gray-100"
      }`}
                  >
                    {mod.title}
                  </span>
                </div>
              </button>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-end w-full sm:w-auto">
                <button
                  onClick={() => handleEdit(mod)}
                  className="flex items-center gap-1.5 text-sm text-brand-950 
                             hover:text-brand-700 dark:hover:text-brand-300 
                             transition-colors duration-150"
                >
                  <Pencil size={15} />
                  <span className="hidden xs:inline">Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(mod)}
                  className="flex items-center gap-1.5 text-sm text-red-600 
                             hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 
                             transition-colors duration-150"
                >
                  <Trash2 size={15} />
                  <span className="hidden xs:inline">Delete</span>
                </button>
              </div>
            </div>

            {/* Expanded Lessons */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className=" w-full 
        px-3 sm:px-4 md:px-6 
        py-2 sm:py-3 md:py-4 
        border-t border-gray-200 dark:border-gray-700 
        bg-gray-50 dark:bg-neutral-900 
        space-y-3 sm:space-y-4
        overflow-hidden"
                >
                  {/* Lessons */}
                  <LessonList moduleId={mod.id} />
                </motion.div>
              )}
            </AnimatePresence>
            {/* <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="px-3 sm:px-5 py-3 border-t border-gray-100 dark:border-neutral-800 
                             bg-gray-50 dark:bg-neutral-900 space-y-4 rounded-b-lg"
                >
                  <LessonList moduleId={mod.id} />
                </motion.div>
              )}
            </AnimatePresence> */}
          </motion.div>
        );
      })}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selectedModule && (
          <EditModuleForm
            module={selectedModule}
            onSuccess={() => setIsEditOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
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
