import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { categoryService, taskService } from '../services';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B47E0',
    icon: 'Folder'
  });

  const availableColors = [
    '#5B47E0', '#FF6B6B', '#4ECDC4', '#FFE66D', '#4FC3F7',
    '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#2196F3'
  ];

  const availableIcons = [
    'Folder', 'Briefcase', 'Home', 'ShoppingCart', 'Heart',
    'Gamepad2', 'BookOpen', 'Dumbbell', 'Car', 'Plane'
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

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
      setFormData({ name: '', color: '#5B47E0', icon: 'Folder' });
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
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
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-surface-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-surface-900">
              Categories
            </h2>
            <p className="text-surface-600 mt-1">
              Organize your tasks with custom categories
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Add Category</span>
          </motion.button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create categories to organize your tasks better"
            actionLabel="Create Category"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <ApperIcon name={category.icon} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-surface-600">
                        {getCategoryTaskCount(category.id)} tasks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(category)}
                      className="p-2 text-surface-400 hover:text-primary rounded-lg transition-colors"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-surface-400 hover:text-error rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: category.color,
                      width: `${Math.min(getCategoryTaskCount(category.id) * 10, 100)}%`
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCategory(null);
                setFormData({ name: '', color: '#5B47E0', icon: 'Folder' });
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold text-surface-900">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCategory(null);
                      setFormData({ name: '', color: '#5B47E0', icon: 'Folder' });
                    }}
                    className="p-2 text-surface-400 hover:text-surface-600 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Category name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            formData.color === color 
                              ? 'border-surface-900 scale-110' 
                              : 'border-surface-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {availableIcons.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon }))}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                            formData.icon === icon 
                              ? 'border-primary bg-primary/10' 
                              : 'border-surface-200 hover:border-surface-300'
                          }`}
                        >
                          <ApperIcon name={icon} size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingCategory(null);
                        setFormData({ name: '', color: '#5B47E0', icon: 'Folder' });
                      }}
                      className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-all"
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
                    >
                      {editingCategory ? 'Update' : 'Create'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Categories;