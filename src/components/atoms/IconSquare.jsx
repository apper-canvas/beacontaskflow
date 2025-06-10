import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const IconSquare = ({ icon, isSelected, onClick, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onClick}
      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
        isSelected ? 'border-primary bg-primary/10' : 'border-surface-200 hover:border-surface-300'
      } ${className}`}
      {...props}
    >
      <ApperIcon name={icon} size={18} />
    </motion.button>
  );
};

IconSquare.propTypes = {
  icon: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default IconSquare;