import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

function TaskModal({ task, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        categoryId: task.categoryId || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      });
    }
  }, [task]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };
      
      await onSave(taskData);
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-surface-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-600 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.title ? 'border-error' : 'border-surface-200'
                }`}
                placeholder="What needs to be done?"
              />
              {errors.title && (
                <p className="text-error text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Add more details..."
              />
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.dueDate ? 'border-error' : 'border-surface-200'
                }`}
              />
              {errors.dueDate && (
                <p className="text-error text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-all"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (task ? 'Update' : 'Create')}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export default TaskModal;