import { FC, useState } from "react";
import { toast } from "react-toastify";
import { CourseModule } from "../../app/api/instructor/instructor.type";
import { useUpdateModuleMutation } from "../../app/api/instructor/instructorApi";


interface EditModuleFormProps {
  module: CourseModule;
  onSuccess: () => void;
}

const EditModuleForm: FC<EditModuleFormProps> = ({ module, onSuccess }) => {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description ?? "");
  const [order, setOrder] = useState<number | null>(
    module.order_index ? Number(module.order_index) : null
  );
const courseId = module.course_id ? Number(module.course_id) : null;
  const [updateModule, { isLoading }] = useUpdateModuleMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) {
      toast.error("Course and Title are required");
      return;
    }

    const formData = new FormData();
    formData.append("course_id", courseId.toString());
    formData.append("title", title);
    formData.append("description", description);
    if (order) formData.append("order_index", order.toString());
    formData.append("_method", "PUT");

    try {
      await updateModule({ id: module.id, formData }).unwrap();
      toast.success("Module updated successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to update module");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Edit Module</h2>

      <div className="flex flex-col">
        <label htmlFor="moduleTitle" className="mb-1 font-medium text-sm">
          Module Title
        </label>
        <input
          id="moduleTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Module Title"
          className="border rounded p-2"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="moduleDescription" className="mb-1 font-medium text-sm">
          Module Description
        </label>
        <textarea
          id="moduleDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Module Description"
          className="border rounded p-2"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="moduleOrder" className="mb-1 font-medium text-sm">
          Order Index
        </label>
        <input
          id="moduleOrder"
          type="number"
          value={order ?? ""}
          onChange={(e) => setOrder(Number(e.target.value))}
          placeholder="Order Index"
          className="border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-brand-950 hover:bg-brand-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditModuleForm;
