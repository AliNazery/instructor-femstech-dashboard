import { FC, useState } from "react";
import { PlusCircle } from "lucide-react";
import CourseContentTree from "./contentManager/CourseContentTree";
import Modal from "../common/modal/Modal";
import CreateModuleForm from "../CourseModules/CreateModuleForm";


interface CourseModulesProps {
  courseId: number;
}

const CourseModules: FC<CourseModulesProps> = ({
  courseId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
          {/* Title */}
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
            Course Modules & Lessons
          </h2>

          {/* Button */}
          <button
            className="
      flex items-center justify-center flex-wrap gap-1 sm:gap-2 
      px-2.5 py-1 w-full sm:w-auto
      text-xs sm:text-sm font-medium 
      text-white bg-brand-500 rounded-lg 
      hover:bg-brand-700 transition
      sm:self-end
    "
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={14} className="shrink-0" />
            <span>Add Module</span>
          </button>
        </div>
        <CourseContentTree courseId={courseId} />
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateModuleForm
          onSuccess={() => setIsModalOpen(false)}
          courseId={courseId}
        />
      </Modal>
    </>
  );
};

export default CourseModules;
