import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const CategoryBadge = ({ category, className = '' }) => {
  if (!category) return null;
  return (
    <span className={`text-xs text-surface-500 flex items-center space-x-1 ${className}`}>
      <ApperIcon name={category.icon} size={12} />
      <span>{category.name}</span>
    </span>
  );
};

CategoryBadge.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
};

export default CategoryBadge;