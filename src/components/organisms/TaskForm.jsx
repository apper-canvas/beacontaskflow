import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TaskForm = ({ task, categories, onSave, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

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
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });
    }
    setErrors({}); // Clear errors when task prop changes
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
    
    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    
    await onSave(taskData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        placeholder="What needs to be done?"
        error={errors.title}
        required
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="Add more details..."
        rows={3}
      />
      
      <FormField
        label="Category"
        name="categoryId"
        type="select"
        value={formData.categoryId}
        onChange={handleChange}
        options={categoryOptions}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Priority"
          name="priority"
          type="select"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
        
        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>
      
      <FormField
        label="Due Date"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        error={errors.dueDate}
      />
      
      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-surface-200 text-surface-700 hover:bg-surface-50"
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : (task ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  task: PropTypes.object,
  categories: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default TaskForm;