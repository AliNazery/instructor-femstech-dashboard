import { FC, useState } from "react";
import { useCreateCategoryMutation } from "../../app/api/instructor/instructorApi";
import { isFetchBaseQueryError } from "../../Util/Validation/utility";
import { toast } from "react-toastify";

interface CreateCategoryFormProps {
  onSuccess: () => void;
}

const CreateCategoryForm: FC<CreateCategoryFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [createCategory, { isLoading, isError, error }] =
    useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail_url", thumbnail);
    }

    try {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully");
        onSuccess();
      setTitle("");
      setDescription("");
      setThumbnail(null);
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create New Category</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Category Title"
        className="border rounded p-2"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Category Description"
        className="border rounded p-2"
        rows={3}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        className="border rounded p-2"
        required
      />
      {isError && (
        <p className="text-red-500 text-sm">
          {isFetchBaseQueryError(error)
            ? error.data?.message || "Something went wrong"
            : "Something went wrong"}
        </p>
      )}

      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default CreateCategoryForm;
