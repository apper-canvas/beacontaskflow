import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { categoryService, taskService } from '@/services';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import HeaderSection from '@/components/molecules/HeaderSection';
import AddButton from '@/components/molecules/AddButton';
import CategoryList from '@/components/organisms/CategoryList';
import CategoryModal from '@/components/organisms/CategoryModal';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]); // Needed for task count in categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesResult, tasksResult] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      setCategories(categoriesResult);
      setTasks(tasksResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id, formData);
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? updated : cat
        ));
        toast.success('Category updated successfully');
      } else {
        const newCategory = await categoryService.create(formData);
        setCategories(prev => [...prev, newCategory]);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const tasksInCategory = tasks.filter(task => task.categoryId === categoryId);
    
    if (tasksInCategory.length > 0) {
      toast.error('Cannot delete category with existing tasks');
      return;
    }

    try {
      await categoryService.delete(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const getCategoryTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <HeaderSection 
        title="Categories"
        description="Organize your tasks with custom categories"
        actions={<AddButton label="Add Category" onClick={() => setIsModalOpen(true)} />}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create categories to organize your tasks better"
            actionLabel="Create Category"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <CategoryList
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            getCategoryTaskCount={getCategoryTaskCount}
          />
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        category={editingCategory}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default CategoryManagement;