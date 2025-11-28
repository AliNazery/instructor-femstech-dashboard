import { FC, useState } from "react";
import { PlusCircle } from "lucide-react";
import CourseContentTree from "./CourseContentTree";
import Modal from "../../common/modal/Modal";
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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Course Modules & Lessons
          </h2>
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={16} /> Add Module
          </button>
        </div>
        <CourseContentTree
          courseId={courseId}
        />
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
