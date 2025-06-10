import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ColorSquare from '@/components/atoms/ColorSquare';
import IconSquare from '@/components/atoms/IconSquare';

const availableColors = [
  '#5B47E0', '#FF6B6B', '#4ECDC4', '#FFE66D', '#4FC3F7',
  '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#2196F3'
];

const availableIcons = [
  'Folder', 'Briefcase', 'Home', 'ShoppingCart', 'Heart',
  'Gamepad2', 'BookOpen', 'Dumbbell', 'Car', 'Plane'
];

const CategoryForm = ({ category, onSave, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: availableColors[0],
    icon: availableIcons[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || availableColors[0],
        icon: category.icon || availableIcons[0]
      });
    } else {
      setFormData({
        name: '',
        color: availableColors[0],
        icon: availableIcons[0]
      });
    }
    setErrors({}); // Clear errors on category change
  }, [category]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        placeholder="Category name"
        error={errors.name}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {availableColors.map(color => (
            <ColorSquare
              key={color}
              color={color}
              isSelected={formData.color === color}
              onClick={() => handleChange('color', color)}
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
            <IconSquare
              key={icon}
              icon={icon}
              isSelected={formData.icon === icon}
              onClick={() => handleChange('icon', icon)}
            />
          ))}
        </div>
      </div>
      
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
          {isSubmitting ? 'Saving...' : (category ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  category: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default CategoryForm;