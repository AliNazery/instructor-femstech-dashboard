import { FC, useState } from "react";
import { useUpdateCategoryMutation } from "../../app/api/instructor/instructorApi";
import { Category } from "../../app/api/instructor/instructor.type";
import { toast } from "react-toastify";

interface EditCategoryFormProps {
  category: Category;
  onSuccess: () => void;
}

const EditCategoryForm: FC<EditCategoryFormProps> = ({
  category,
  onSuccess,
}) => {
  const [title, setTitle] = useState(category.title);
  const [description, setDescription] = useState(category.description);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [updateCategory, { isLoading, isError, error }] =
    useUpdateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail_url", thumbnail);
    formData.append("_method", "PUT"); // backend expects this

    try {
      await updateCategory({ id: category.id, formData }).unwrap();
      toast.success("Category updated successfully ✅");
      onSuccess();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update category ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Edit Category</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Category Title"
        className="border rounded p-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Category Description"
        className="border rounded p-2"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
      />

      {isError && (
        <p className="text-red-500 text-sm">
          {"data" in (error as object) &&
          (error as { data?: { message?: string } }).data?.message
            ? (error as { data?: { message?: string } }).data?.message
            : "Something went wrong"}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditCategoryForm;
