import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useCreateModuleMutation } from "../../app/api/instructor/instructorApi";

interface CreateModuleFormProps {
  onSuccess: () => void;
  courseId: number;
}

const CreateModuleForm: FC<CreateModuleFormProps> = ({ onSuccess , courseId}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number | null>(null);
  const [createModule, { isLoading }] = useCreateModuleMutation();
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

    try {
      await createModule(formData).unwrap();
      toast.success("Module created successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to create module");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create Module</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Module Title"
        className="border rounded p-2"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Module Description"
        className="border rounded p-2"
      />

      <input
        type="number"
        value={order ?? ""}
        onChange={(e) => setOrder(Number(e.target.value))}
        placeholder="Order Index"
        className="border rounded p-2"
      />

      <button
        type="submit"
        className="bg-brand-950 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateModuleForm;
