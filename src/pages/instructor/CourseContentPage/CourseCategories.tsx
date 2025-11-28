import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import CreateButton from "../../../components/ui/button/CreateButton";
import { CategoryCard } from "../../../components/newDesignComponents/CategoryCard";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../app/api/instructor/instructorApi";
import Modal from "../../../components/common/modal/Modal";
import CreateCategoryForm from "../../../components/courses/CreateCategoryForm";
import EditCategoryForm from "../../../components/courses/EditCategoryForm";
import ConfirmDeleteDialog from "../../../components/common/modal/ConfirmDeleteDialog";
import { Category } from "../../../app/api/instructor/instructor.type";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";

export default function CourseCategories() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { data: categoriesData, isLoading } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();
  const categories = categoriesData?.data ?? [];

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id).unwrap();
      toast.success("Category deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <>
      <PageMeta
        title="Categories | LMS Dashboard"
        description="Manage your categories"
      />
      <PageBreadcrumb pageTitle="Categories" />
      <PageLayoutSection
        title="Course Categories"
        description="Browse categories visually — click a category to view its courses."
        action={
     
            <CreateButton onClick={() => setIsCreateOpen(true)}>
              New Category
            </CreateButton>
   
        }
      >
        {(() => {
          if (isLoading) {
            return <LoadingSpinner text="Loading categories..." fullScreen />;
          }

          if (categories.length === 0) {
            return (
              <EmptyState
                title="No Category Yet"
                description="You haven’t added any categories. Start by creating a new category."
                action={
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-700"
                  >
                    Create
                  </button>
                }
              />
            );
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onClick={() =>
                    navigate(
                      `/instructor/course/content/categories/${cat.id}/courses`
                    )
                  }
                  onEdit={() => handleEdit(cat)}
                  onDelete={() => handleDelete(cat)}
                />
              ))}
            </div>
          );
        })()}
      </PageLayoutSection>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <CreateCategoryForm onSuccess={() => setIsCreateOpen(false)} />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selectedCategory && (
          <EditCategoryForm
            category={selectedCategory}
            onSuccess={() => setIsEditOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.title}"?`}
      />
    </>
  );
}
