import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AddButton = ({ onClick, label = 'Add Item', className = '', ...props }) => {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center space-x-2 bg-primary text-white hover:brightness-110 ${className}`}
      {...props}
    >
      <ApperIcon name="Plus" size={18} />
      <span>{label}</span>
    </Button>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default AddButton;